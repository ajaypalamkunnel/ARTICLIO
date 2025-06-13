import { IArticle } from "../model/Article/Article";
import { ArticleResponseDTO } from "../dtos/articleResponse.dto";
import { Types } from "mongoose";

export const mapArticleToDTO = (article: IArticle): ArticleResponseDTO => {
    return {
        id: (article._id as Types.ObjectId).toString(),
        title: article.title,
        description: article.description,
        images: article.images,
        tags: article.tags,
        category: {
            id:
                article.category instanceof Object
                    ? article.category._id.toString()
                    : (article.category as Types.ObjectId).toString(),
            name:
                article.category instanceof Object
                    ? (article.category as any).name
                    : "",
        },
        author: {
            id:
                article.author instanceof Object
                    ? article.author._id.toString()
                    : (article.author as Types.ObjectId).toString(),
            firstName:
                article.author instanceof Object
                    ? (article.author as any).firstName
                    : "",
            profileImage:
                article.author instanceof Object
                    ? (article.author as any).profileImage
                    : undefined,
        },
        stats: {
            likes: article.stats.likes,
            dislikes: article.stats.dislikes,
            blocks: article.stats.blocks,
        },
        createdAt: article.createdAt,
    };
};
