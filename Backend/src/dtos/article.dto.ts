import { Types } from "mongoose";

export interface CreateArticleDTO {
    title: string;
    description: string;
    images: string[]; 
    tags: string[];
    category: Types.ObjectId;
    author: Types.ObjectId;
}
