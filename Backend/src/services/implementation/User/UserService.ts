import { threadId } from "worker_threads";
import { StatusCode } from "../../../constants/statusCode";
import { CategoryDTO, GetUserProfileResponseDTO, UpdateUserProfileRequestDTO } from "../../../dtos/GetUserProfileResponseDTO";
import { ChangePasswordRequestDTO } from "../../../dtos/passwordChange";
import { IUser } from "../../../model/User/User";
import { BaseRepository } from "../../../repositories/base/BaseRepository";
import { IUserRepositroy } from "../../../repositories/interface/User/IUserRepository";
import { CustomError } from "../../../utils/CustomError";
import { sendOTPEmail } from "../../../utils/emailUtils";
import JWTUtils from "../../../utils/jwtUtils";
import PasswordUtils from "../../../utils/PasswordUtils";
import { IUserService } from "../../interface/User/IUserService";

class UserService implements IUserService {
    private _userRepository: IUserRepositroy;

    constructor(userRepository: IUserRepositroy) {
        this._userRepository = userRepository;
    }




    private generateOTP(): string {
        return Math.floor(10000 + Math.random() * 900000).toString();
    }

    async registration(userDetails: Partial<IUser>): Promise<{ user: IUser }> {
        try {
            const { firstName, lastName, email, phone, dob, password, preferences } =
                userDetails;

            const existingUser = await this._userRepository.findUserByEmail(
                userDetails.email!
            );

            if (existingUser) {
                throw new CustomError("Email already exist", StatusCode.CONFLICT);
            }

            const otp = this.generateOTP();
            const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

            const hashedPassword = await PasswordUtils.hashPassword(password!);

            const user = await this._userRepository.create({
                firstName,
                lastName,
                email,
                phone,
                dob,
                password: hashedPassword,
                preferences,
                otp,
                otpExpires,
                isActive: false,
                isVerified: false,
            });

            await sendOTPEmail(email!, otp);
            return { user };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw new CustomError(
                    "Registration Erorr",
                    StatusCode.INTERNAL_SERVER_ERROR
                );
            }
        }
    }

    async resendOtp(email: string): Promise<void> {
        try {
            const user = await this._userRepository.findUserByEmail(email);

            if (!user) {
                throw new CustomError("User not found", StatusCode.NOT_FOUND);
            }

            const otp = this.generateOTP();
            const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

            await this._userRepository.update(user._id.toString(), {
                otp,
                otpExpires,
            });

            await sendOTPEmail(email, otp);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw new CustomError(
                    "Resend otp Erorr",
                    StatusCode.INTERNAL_SERVER_ERROR
                );
            }
        }
    }

    async verifyOtp(email: string, otp: string): Promise<void> {
        try {
            const user = await this._userRepository.findUserByEmail(email);

            if (!user) {
                throw new CustomError("User not found", StatusCode.NOT_FOUND);
            }

            if (!user.otp || !user.otpExpires || new Date() > user.otpExpires) {
                throw new CustomError(
                    "OTP expired. Please request a new one.",
                    StatusCode.BAD_REQUEST
                );
            }

            if (user.otp !== otp) {
                throw new CustomError(
                    "Invalid OTP. Please try again",
                    StatusCode.BAD_REQUEST
                );
            }

            await this._userRepository.update(user._id.toString(), {
                otp: null,
                otpExpires: null,
                isActive: true,
                isVerified: true,
            });
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw new CustomError(
                    "OTP Verification erro",
                    StatusCode.INTERNAL_SERVER_ERROR
                );
            }
        }
    }



    async loginUser(email: string, password: string): Promise<{ user: IUser | null; accessToken: string; refreshToken: string; }> {
        try {

            const user = await this._userRepository.findUserByEmail(email)

            if (!user) {
                throw new CustomError("Invalid email or password.", StatusCode.BAD_REQUEST)
            }

            if (!user.isActive) {
                throw new CustomError("signup not completed", StatusCode.BAD_REQUEST)
            }

            if (!user.isVerified) {
                throw new CustomError("signup not completed", StatusCode.BAD_REQUEST)
            }

            const isMatch = await PasswordUtils.comparePassword(
                password,
                user.password
            )

            if (!isMatch) {
                throw new CustomError("Invalid email or password.", StatusCode.BAD_REQUEST)
            }


            const accessToken = JWTUtils.generateAccessToken({
                userId: user._id,
                email: user.email
            })

            const refreshToken = JWTUtils.generateRefreshToken({ userId: user._id })

            await this._userRepository.updateRefreshToken(
                user._id.toString(),
                refreshToken
            )


            return { accessToken, refreshToken, user }

        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw new CustomError(
                    "Login service error",
                    StatusCode.INTERNAL_SERVER_ERROR
                );
            }
        }
    }


    async getUserProfile(userId: string): Promise<GetUserProfileResponseDTO> {
        try {

            const user = await this._userRepository.findUserByIdWithPreferences(userId);

            if (!user) {
                throw new CustomError("User not found", StatusCode.NOT_FOUND);
            }

            const preferences: CategoryDTO[] = (user.preferences as any[]).map(pref => ({
                _id: pref._id.toString(),
                name: pref.name
            }));

            return {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                dob: user.dob,
                profileImage: user.profileImage,
                preferences
            };


        } catch (error) {

            if (error instanceof CustomError) {
                throw error;
            } else {
                throw new CustomError(
                    "User profile featching error :",
                    StatusCode.INTERNAL_SERVER_ERROR
                );
            }

        }
    }


    async changePassword(userId: string, data: ChangePasswordRequestDTO): Promise<void> {
        try {

            const user = await this._userRepository.findById(userId)

            if (!user) {
                throw new CustomError("User not found", StatusCode.NOT_FOUND)
            }

            const isMatch = await PasswordUtils.comparePassword(data.currentPassword, user.password)


            if (!isMatch) {
                throw new CustomError("Current password is incorrect", StatusCode.UNAUTHORIZED);
            }

            const hashedPassword = await PasswordUtils.hashPassword(data.newPassword)

            await this._userRepository.update(userId, { password: hashedPassword })

        } catch (error) {

            if (error instanceof CustomError) {
                throw error
            } else {
                throw new CustomError("Password change error", StatusCode.INTERNAL_SERVER_ERROR)
            }

        }
    }


    async updateUserProfile(userId: string, data: UpdateUserProfileRequestDTO): Promise<void> {
        try {

            if (!data.firstName || !data.lastName || !data.phone || !data.dob) {
                throw new CustomError("Missing required fields", StatusCode.BAD_REQUEST);
            }

            await this._userRepository.updateUserProfile(userId, data);
        } catch (error) {

            if (error instanceof CustomError) {
                throw error
            } else {
                throw new CustomError("Internal server error", StatusCode.INTERNAL_SERVER_ERROR)
            }

        }
    }

    async logoutUser(refreshToken: string): Promise<void> {
        await this._userRepository.removeRefreshToken(refreshToken)
    }

    async renewAuthTokens(oldRefreshToken: string): Promise<{ accessToken: string; }> {
        const decode = JWTUtils.verifyToken(oldRefreshToken, true)

        if (!decode || typeof decode === "string" || !decode.userId) {
            throw new Error("Invalid refresh token");
        }

        const user = await this._userRepository.findUserTokenById(decode.userId.toString())

        if (!user || user.refreshToken !== oldRefreshToken) {
            throw new Error("Invalid refresh token");
        }

        const newAccessToken = JWTUtils.generateAccessToken({
            userId: user?._id,
            email: user?.email,

        });

        return { accessToken: newAccessToken };
    }



}


export default UserService