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
