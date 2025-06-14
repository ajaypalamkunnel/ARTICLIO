import { IUser } from "../model/User/User";


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
    createdAt: Date;
}


export interface CategoryDTO {
  _id: string;
  name: string;
}

// AuthorDTO
export interface AuthorDTO {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
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
