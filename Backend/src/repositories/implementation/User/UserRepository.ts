import { IUser, UserModel } from "../../../model/User/User";
import { BaseRepository } from "../../base/BaseRepository";
import { IUserRepositroy } from "../../interface/User/IUserRepository";


class UserRepository extends BaseRepository<IUser> implements IUserRepositroy{

    constructor(){
        super(UserModel)
    }
    async findUserByEmail(email: string): Promise<IUser | null> {
        return await UserModel.findOne({email})
    }

}

export default UserRepository