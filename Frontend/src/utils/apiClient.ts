import type { AxiosRequestConfig, Method } from "axios";
import type { ApiResponse } from "../types/apiResponse";
import axiosInstance from "./axiosInstance";
import axios from "axios";

export async function apiRequest<T>(
    url: string,
    method: Method = "GET",
    data?: any,
    config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
    try {
        const response = await axiosInstance.request<ApiResponse<T>>({
            url,
            method,
            data,
            ...config,
        });

        return {
            success: true,
            data: response.data.data,
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
