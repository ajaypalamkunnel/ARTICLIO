import { Request, Response } from "express";
import { IUserController } from "../../interface/User/IUserController";
import { IUserService } from "../../../services/interface/User/IUserService";
import { ERROR_MESSAGES, StatusCode } from "../../../constants/statusCode";
import { CustomError } from "../../../utils/CustomError";

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

            console.log("===>",error);
            

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


    postLogin(req: Request, res: Response): Promise<Response> {
        throw new Error("Method not implemented.");
    }
    logout(req: Request, res: Response): Promise<Response> {
        throw new Error("Method not implemented.");
    }
}

export default UserController;
