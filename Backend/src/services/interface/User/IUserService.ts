import { IUser } from "../../../model/User/User";



export interface IUserService{
    registration(userDetails:Partial<IUser>):Promise<{user:IUser}>
    resendOtp(email:string):Promise<void>
    verifyOtp(email: string, otp: string): Promise<void>
    loginUser(
        email: string,
        password: string
    ): Promise<{
        user: IUser | null;
        accessToken: string;
        refreshToken: string;
    }>

}