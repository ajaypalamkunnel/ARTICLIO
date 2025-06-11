// import { API_PREFIX } from "../constants/apiRoutes";
import type { ApiResponse } from "../types/apiResponse";
import type { Category } from "../types/category";
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
