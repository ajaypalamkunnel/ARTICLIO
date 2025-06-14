import { Request, Response } from "express";
import { IUserController } from "../../interface/User/IUserController";
import { IUserService } from "../../../services/interface/User/IUserService";
import { ERROR_MESSAGES, StatusCode } from "../../../constants/statusCode";
import { CustomError } from "../../../utils/CustomError";
import { config } from "../../../config/env";
import { ChangePasswordRequestDTO } from "../../../dtos/passwordChange";
import { UpdateUserProfileRequestDTO } from "../../../dtos/GetUserProfileResponseDTO";
import { UpdateArticleRequestDTO } from "../../../dtos/article.dto";
import { Types } from "mongoose";

class UserController implements IUserController {
    private _userService: IUserService;

    constructor(userService: IUserService) {
        this._userService = userService;
    }






    async registerUser(req: Request, res: Response): Promise<Response> {
        try {
            const {
                firstName,
                lastName,
                email,
                phone,
                dateOfBirth,
                password,
                articlePreferences,
            } = req.body;

            const { user } = await this._userService.registration({
                firstName,
                lastName,
                email,
                phone,
                dob: new Date(dateOfBirth),
                password,
                preferences: articlePreferences,
            });

            return res.status(StatusCode.CREATED).json({
                message: "User registered successfully. OTP sent to email.",
                userId: user._id,
            });
        } catch (error) {
            console.log("registratrion error", error);

            return res
                .status(
                    error instanceof CustomError
                        ? error.statusCode
                        : StatusCode.INTERNAL_SERVER_ERROR
                )
                .json(
                    error instanceof CustomError
                        ? error.message
                        : ERROR_MESSAGES.INTERNAL_SERVER_ERROR
                );
        }
    }

    async resendOtp(req: Request, res: Response): Promise<Response> {
        try {
            const { email } = req.body;

            if (!email) {
                return res
                    .status(StatusCode.BAD_REQUEST)
                    .json({ success: false, error: "Email is required" });
            }

            await this._userService.resendOtp(email);

            return res
                .status(StatusCode.OK)
                .json({ success: true, message: "New OTP sent to email" });
        } catch (error) {
            console.log("resend otp error", error);

            return res
                .status(
                    error instanceof CustomError
                        ? error.statusCode
                        : StatusCode.INTERNAL_SERVER_ERROR
                )
                .json(
                    error instanceof CustomError
                        ? error.message
                        : ERROR_MESSAGES.INTERNAL_SERVER_ERROR
                );
        }
    }

    async verifyOtp(req: Request, res: Response): Promise<Response> {
        try {
            const { email, otp } = req.body;

            if (!email || !otp) {
                return res
                    .status(StatusCode.BAD_REQUEST)
                    .json({ error: "Email and OTP are required" });
            }

            await this._userService.verifyOtp(email, otp)

            return res.status(StatusCode.OK).json({
                success: true,
                message: "OTP verified successfully. Your account is now activated.",
            })


        } catch (error) {

            console.log("===>", error);


            return res
                .status(
                    error instanceof CustomError
                        ? error.statusCode
                        : StatusCode.INTERNAL_SERVER_ERROR
                )
                .json(
                    error instanceof CustomError
                        ? error.message
                        : ERROR_MESSAGES.INTERNAL_SERVER_ERROR
                );

        }
    }


    async postLogin(req: Request, res: Response): Promise<Response> {
        try {

            const { email, password } = req.body

            if (!email || !password) {
                return res
                    .status(StatusCode.BAD_REQUEST)
                    .json({ error: "Email and Password are required" });
            }

            const { accessToken, refreshToken, user } = await this._userService.loginUser(email, password)
            const isProduction = config.nodeEnv === "production";

            console.log("env status : ", isProduction);

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                path: "/"
            });


            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                path: "/"
            });

            return res.status(StatusCode.OK).json({
                success: true,
                message: "Login succesful",
                accessToken,
                user: {
                    id: user?._id,
                    email: user?.email,
                    isVerified: user?.isVerified,
                    firstName: user?.firstName,
                    lastName: user?.lastName
                },
            })
        } catch (error) {
            console.log("===>", error);


            return res
                .status(
                    error instanceof CustomError
                        ? error.statusCode
                        : StatusCode.INTERNAL_SERVER_ERROR
                )
                .json(
                    error instanceof CustomError
                        ? error.message
                        : ERROR_MESSAGES.INTERNAL_SERVER_ERROR
                );

        }
    }


    async renewAuthTokens(req: Request, res: Response): Promise<void> {
        try {

            const oldRefreshToken = req.cookies?.["refreshToken"]

            if (!oldRefreshToken) {
                res
                    .status(StatusCode.UNAUTHORIZED)
                    .json({ error: "Refresh token not found" });
                return;
            }

            const { accessToken } = await this._userService.renewAuthTokens(
                oldRefreshToken
            );

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                path: "/"
            });
            res.status(StatusCode.OK).json({ success: true, accessToken });


        } catch (error) {
            res.status(StatusCode.BAD_REQUEST).json({
                error:
                    error instanceof Error ? error.message : "Failed to refresh token",
            });
        }
    }



    async getUserProfile(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.userId;

            const profile = await this._userService.getUserProfile(userId!);
            return res.status(StatusCode.OK).json({ success: true, data: profile });

        } catch (error) {
            console.error("Get Profile error:", error);

            return res.status(
                error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR
            ).json(
                error instanceof CustomError ? error.message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR
            );
        }

    }


    async changePassword(req: Request, res: Response): Promise<Response> {
        try {

            const userId = req.user?.userId

            const data: ChangePasswordRequestDTO = req.body

            await this._userService.changePassword(userId!, data)

            return res.status(StatusCode.OK).json({ success: true, message: "Password updated successfully" });


        } catch (error) {
            console.error("Change password error:", error);

            return res.status(
                error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR
            ).json(
                error instanceof CustomError ? error.message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR
            );
        }
    }


    async updateUserProfile(req: Request, res: Response): Promise<Response> {
        try {

            const userId = req.user?.userId

            const data: UpdateUserProfileRequestDTO = req.body

            await this._userService.updateUserProfile(userId!, data)

            return res.status(StatusCode.OK).json({
                success: true,
                message: "Profile updated successfully",
            });

        } catch (error) {
            console.error("Profile updation error::", error);

            return res.status(
                error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR
            ).json(
                error instanceof CustomError ? error.message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR
            );
        }
    }




    async logout(req: Request, res: Response): Promise<Response> {
        try {
            console.log("My cookie : ", req.cookies);
            const refreshToken = req.cookies?.["refreshToken"]

            console.log("refresh token :", refreshToken);




            if (!refreshToken) {
                return res
                    .status(StatusCode.BAD_REQUEST)
                    .json({ error: "No refresh token provided" });
            }

            await this._userService.logoutUser(refreshToken)

            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                path: "/"

            })


            res.clearCookie("accessToken", {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                path: "/"

            })

            return res
                .status(StatusCode.OK)
                .json({ success: true, message: "Logout successful" });

        } catch (error) {
            console.error("Logout failed", error);

            return res
                .status(StatusCode.INTERNAL_SERVER_ERROR)
                .json({ error: "Logout failed" });
        }
    }
}

export default UserController;
