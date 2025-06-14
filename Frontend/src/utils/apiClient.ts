/* eslint-disable @typescript-eslint/no-explicit-any */
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
        console.log("hellooo");
        
        const response = await axiosInstance.request<ApiResponse<T>>({
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
