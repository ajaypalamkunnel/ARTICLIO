// import { API_PREFIX } from "../constants/apiRoutes";
import type { LoginFormData } from "../pages/Login";
import type { ApiResponse } from "../types/apiResponse";
import type {  GetArticlesResponse } from "../types/article";
import type { Category, GetCategoriesResponse } from "../types/category";
import type { getIntractionsRequestID, InteractionRequestDTO, UserArticleInteractionResponse } from "../types/interactions";
import type { IUser, RegistrationFormData } from "../types/user";
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