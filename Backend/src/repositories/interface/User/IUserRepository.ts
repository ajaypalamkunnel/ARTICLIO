import { IUser } from "../../../model/User/User";
import { IBaseRepository } from "../../base/IBaseRepository";

export interface IUserRepositroy extends IBaseRepository<IUser> {

     findUserByEmail(email: string): Promise<IUser | null>;
     updateRefreshToken(
        userId: string,
        refreshToken: string
    ): Promise<IUser | null>;

}