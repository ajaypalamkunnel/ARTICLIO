import type { CategoryDTO } from "./user";

export interface ArticleFormData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  image?: File;
}

export interface UserInteractionState {
  like: boolean;
  dislike: boolean;
  block: boolean;
}

export interface ArticleResponseDTO {
    id: string;
    title: string;
    description: string;
    images: string[];
    tags: string[];
    category: {
        id: string;
        name: string;
    };
    author: {
        id: string;
        firstName: string;
        profileImage?: string;
    };
    stats: {
        likes: number;
        dislikes: number;
        blocks: number;
    };
    createdAt: string;
     userInteraction?: UserInteractionState;
}

export interface GetArticlesResponse {
  success: boolean;
  articles: ArticleResponseDTO[];
  total: number;
  totalPages: number;
  currentPage: number;
}


export interface GetMyArticlesResponseDTO {
  articles: ArticleResponseDTO[];
  total: number;
  totalPages: number;
  currentPage: number;
}





export interface UpdateArticleRequestDTO {
  articleId: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  images: string[];  // Cloudinary or file paths from multer
}


export interface UserDTO {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage: string;
}

export interface ArticleByIdResponseDTO {
  id?: string;
  title: string;
  description: string;
  tags: string[];
  images: string[];
  category: CategoryDTO;
  author: UserDTO;
  createdAt: Date;
  updatedAt: Date;
}
