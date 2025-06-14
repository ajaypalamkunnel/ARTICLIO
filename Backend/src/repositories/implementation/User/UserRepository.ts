import { UpdateUserProfileRequestDTO } from "../../../dtos/GetUserProfileResponseDTO";
import { IUser, UserModel } from "../../../model/User/User";
import { BaseRepository } from "../../base/BaseRepository";
import { IUserRepositroy } from "../../interface/User/IUserRepository";


class UserRepository extends BaseRepository<IUser> implements IUserRepositroy {

    constructor() {
        super(UserModel)
    }
    
    

    async findUserByEmail(email: string): Promise<IUser | null> {
        return await UserModel.findOne({ email })
    }
    async updateRefreshToken(
        userId: string,
        refreshToken: string
    ): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(userId, { refreshToken });
    }

    async findUserByIdWithPreferences(userId: string): Promise<IUser | null> {
        return await UserModel.findById(userId)
            .populate("preferences")
            .exec();
    }


    async updateUserProfile(userId: string, data: UpdateUserProfileRequestDTO): Promise<void> {
        await UserModel.findByIdAndUpdate(userId, {
            $set: {
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                dob: data.dob,
                profileImage: data.profileImage,
                preferences: data.preferences,
            }
        })
    }


    async removeRefreshToken(refreshToken: string): Promise<void> {
        await UserModel.updateOne({refreshToken},{$unset:{refreshToken:1}})
    }


    async findUserTokenById(userId: string): Promise<IUser | null> {
        return await UserModel.findById(userId).select("-password");
    }




}

export default UserRepository