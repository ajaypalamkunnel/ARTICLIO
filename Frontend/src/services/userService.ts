/* eslint-disable @typescript-eslint/no-explicit-any */
// import { API_PREFIX } from "../constants/apiRoutes";
import type { LoginFormData } from "../pages/Login";
import type { ApiResponse } from "../types/apiResponse";
import type {  ArticleByIdResponseDTO, GetArticlesResponse, GetMyArticlesResponseDTO, } from "../types/article";
import type { GetCategoriesResponse } from "../types/category";
import type { getIntractionsRequestID, InteractionRequestDTO, UserArticleInteractionResponse } from "../types/interactions";
import type { ChangePasswordRequestDTO, GetUserProfileResponseDTO, IUser, RegistrationFormData, UpdateUserProfileRequestDTO } from "../types/user";
import { apiRequest } from "../utils/apiClient";
import { apiRequestMultiPart } from "../utils/apiClientMulitPart";

export const getallCategories = async (
    skip: number,
    limit: number
): Promise<ApiResponse<GetCategoriesResponse>> => {
    return apiRequest<GetCategoriesResponse>(
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


export const postArticle = async(data:any):Promise<ApiResponse<void>>=>{
    return apiRequestMultiPart(
        "/post-article",
        "POST",
        data
    )
}



export const fetchArticles = async(page:number,limit:number):Promise<ApiResponse<GetArticlesResponse>>=>{

    return apiRequest<GetArticlesResponse>(
        `/articles?page=${page}&limit=${limit}`,
        "GET"
    )

}

export const getCategories = async():Promise<ApiResponse<GetCategoriesResponse>>=>{
    return apiRequest<GetCategoriesResponse>(
        "/categories",
        "GET"
    )
}

export const getIntractions = async(ids:getIntractionsRequestID):Promise<ApiResponse<UserArticleInteractionResponse>>=>{

    console.log("==>",ids);
    
    return apiRequest<UserArticleInteractionResponse>(
        "/get-interactions",
        "POST",
        ids
        

    )
}


export const articleInteraction = async(data:InteractionRequestDTO):Promise<ApiResponse<InteractionRequestDTO>>=>{
    return apiRequest<InteractionRequestDTO>(
        "/interact",
        "POST",
        data
    )
}

export const getProfile = async():Promise<ApiResponse<GetUserProfileResponseDTO>>=>{
   const response =  await apiRequest<GetUserProfileResponseDTO>(
        "/my-profile",
        "GET",
    )
    console.log(":::::",response);
    
     return response
}

export const getMyArticles = async():Promise<ApiResponse<GetMyArticlesResponseDTO>>=>{
    return apiRequest<GetMyArticlesResponseDTO>(
        "/my-articles",
        "GET",
    )
}


export const changePassword = async(data:ChangePasswordRequestDTO):Promise<ApiResponse<void>>=>{
    return apiRequest(
        "/password-change",
        "POST",
        data
    )
}


export const updateProfile = async(data:UpdateUserProfileRequestDTO):Promise<ApiResponse<void>>=>{
    return apiRequest(
        "/update-profile",
        "PUT",
        data
    )
}


export const updateArticle = async(data:any):Promise<ApiResponse<void>>=>{
    return apiRequest(
        "/update-article",
        "PUT",
        data
    )
}


export const fetchArticleById = async(id:string):Promise<ApiResponse<ArticleByIdResponseDTO>>=>{
    return apiRequest<ArticleByIdResponseDTO>(
        `/article/${id}`,
        "GET"
    )
}


export const userLogout = async():Promise<ApiResponse<void>>=>{
    return apiRequest(
        `/logout`,
        "POST"
    )
}