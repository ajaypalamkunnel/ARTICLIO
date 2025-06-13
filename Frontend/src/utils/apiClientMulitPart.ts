import type { AxiosRequestConfig, Method } from "axios";
import type { ApiResponse } from "../types/apiResponse";
import { axiosInstanceMultiPart } from "./axiosInstance";
import axios from "axios";

export async function apiRequestMultiPart<T>(
    url: string,
    method: Method = "GET",
    data?: any,
    config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
    try {
        const response = await axiosInstanceMultiPart.request<ApiResponse<T>>({
            url,
            method,
            data,
            ...config,
        });

        console.log("Response : ",response);
        

        return {
            success: true,
            data: response.data as T
        };
    } catch (error: unknown) {
        let message = "An unexpected error occurred.";
        console.log("❌",error);
        
        if (axios.isAxiosError(error)) {
            message = error.response?.data || message;
        }

        return {
            success: false,
            message,
        };
    }
}
