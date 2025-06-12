// import { API_PREFIX } from "../constants/apiRoutes";
import type { LoginFormData } from "../pages/Login";
import type { ApiResponse } from "../types/apiResponse";
import type { Category } from "../types/category";
import type { IUser, RegistrationFormData } from "../types/user";
import { apiRequest } from "../utils/apiClient";

export const getallCategories = async (
    skip: number,
    limit: number
): Promise<ApiResponse<Category[]>> => {
    return apiRequest<Category[]>(
        `/get-all-category?skip=${skip}&limit=${limit}`,
        "GET"
    );
};



export const registration = async(formData:RegistrationFormData):Promise<ApiResponse<RegistrationFormData>> =>{

    return apiRequest<RegistrationFormData>(
        `/registration`,
        "POST",
        formData
    )

}


export const verifyOtp = async(otp:string,email:string):Promise<ApiResponse<void>>=>{

    return apiRequest(
        '/verify-otp',
        'POST',
        {otp,email}
    )

}


export const resendOtp = async(email:string):Promise<ApiResponse<void>>=>{
    return apiRequest(
        '/resend-otp',
        'POST',
        {email}
    )
}


export const login = async(data:LoginFormData):Promise<ApiResponse<{ accessToken: string, user: Partial<IUser> }>>=>{
    return apiRequest<{ accessToken: string, user: Partial<IUser> }>(
        '/login',
        'POST',
        data
    )
}