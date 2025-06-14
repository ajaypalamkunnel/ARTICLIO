import { Types } from "mongoose";
import { IArticle } from "../model/Article/Article";

export interface CreateArticleDTO {
    title: string;
    description: string;
    images: string[]; 
    tags: string[];
    category: Types.ObjectId;
    author: Types.ObjectId;
}



export interface UpdateArticleRequestDTO {
  articleId: string;
  title: string;
  description: string;
  tags: string[];
  category: Types.ObjectId;
  images: string[];  // Cloudinary or file paths from multer
}

export type PopulatedArticle = Omit<IArticle, "category" | "author"> & {
    _id: Types.ObjectId;
    category: {
        _id: Types.ObjectId;
        name: string;
    };
    author: {
        _id: Types.ObjectId;
        firstName: string;
        lastName: string;
        email: string;
        profileImage?: string;
    };
};
