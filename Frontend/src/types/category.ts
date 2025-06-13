export interface Category {
    _id: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
}


export interface Category {
  _id: string;
  name: string;
}

export interface GetCategoriesResponse {
  success: boolean;
  data: Category[];
  message?: string;
}

