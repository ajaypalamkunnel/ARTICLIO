import { UpdateUserProfileRequestDTO } from "../../../dtos/GetUserProfileResponseDTO";
import { IUser } from "../../../model/User/User";
import { IBaseRepository } from "../../base/IBaseRepository";

export interface IUserRepositroy extends IBaseRepository<IUser> {

     findUserByEmail(email: string): Promise<IUser | null>;
     updateRefreshToken(
        userId: string,
        refreshToken: string
    ): Promise<IUser | null>;
    findUserByIdWithPreferences(userId: string): Promise<IUser | null>;
    updateUserProfile(userId: string, data: UpdateUserProfileRequestDTO): Promise<void>;
    removeRefreshToken(refreshToken: string): Promise<void>;
    findUserTokenById(userId: string): Promise<IUser | null>;

}