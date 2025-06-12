import { StatusCode } from "../../../constants/statusCode";
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

            if(!user){
                throw new CustomError("Invalid email or password.",StatusCode.BAD_REQUEST)
            }

            if(!user.isActive){
                throw new CustomError("signup not completed",StatusCode.BAD_REQUEST)
            }
            
            if(!user.isVerified){
                throw new CustomError("signup not completed",StatusCode.BAD_REQUEST)  
            }

            const isMatch = await PasswordUtils.comparePassword(
                password,
                user.password
            )
            
            if(!isMatch){
                throw new CustomError("Invalid email or password.",StatusCode.BAD_REQUEST)
            }


            const accessToken = JWTUtils.generateAccessToken({
                userId:user._id,
                email:user.email
            })

            const refreshToken = JWTUtils.generateRefreshToken({userId:user._id})

            await this._userRepository.updateRefreshToken(
                user._id.toString(),
                refreshToken
            )


            return {accessToken,refreshToken,user}

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
}


export default UserService