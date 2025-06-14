import { GetUserProfileResponseDTO, UpdateUserProfileRequestDTO } from "../../../dtos/GetUserProfileResponseDTO";
import { ChangePasswordRequestDTO } from "../../../dtos/passwordChange";
import { IUser } from "../../../model/User/User";



export interface IUserService {
    registration(userDetails: Partial<IUser>): Promise<{ user: IUser }>
    resendOtp(email: string): Promise<void>
    verifyOtp(email: string, otp: string): Promise<void>
    loginUser(
        email: string,
        password: string
    ): Promise<{
        user: IUser | null;
        accessToken: string;
        refreshToken: string;
    }>

    getUserProfile(userId: string): Promise<GetUserProfileResponseDTO>;
    changePassword(userId: string, data: ChangePasswordRequestDTO): Promise<void>;
    updateUserProfile(userId: string, data: UpdateUserProfileRequestDTO): Promise<void>;
    logoutUser(refreshToken: string): Promise<void>;
    renewAuthTokens(token: string): Promise<{ accessToken: string }>;

}