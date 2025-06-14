import { Types } from "mongoose";
import { StatusCode } from "../../../constants/statusCode";
import { ArticleModel, IArticle } from "../../../model/Article/Article";
import { CategoryModel, ICategory } from "../../../model/Category/Category";
import { IInteraction, InteractionModel } from "../../../model/Interaction/Interaction";
import { CustomError } from "../../../utils/CustomError";
import { BaseRepository } from "../../base/BaseRepository";
import { IArticleRepository } from "../../interface/Article/IArticleRepository";
import { PopulatedArticle, UpdateArticleRequestDTO } from "../../../dtos/article.dto";
import { ArticleByIdResponseDTO } from "../../../dtos/articleResponse.dto";
import { IUser } from "../../../model/User/User";

export class ArticleRepository
    extends BaseRepository<IArticle>
    implements IArticleRepository {
    constructor() {
        super(ArticleModel);
    }



    async findPaginatedCategory(
        skip: number,
        limit: number
    ): Promise<ICategory[]> {
        const categories = await CategoryModel.find().skip(skip).limit(limit);
        return categories;
    }

    async findAllCategory(): Promise<ICategory[]> {
        const categories = await CategoryModel.find()
        // console.log("==>", categories);

        return categories
    }

    async getArticlesByPreferencesPaginated(
        preferences: string[],
        userId: string,
        page: number,
        limit: number
    ): Promise<{ articles: IArticle[]; total: number }> {
        try {
            const filter = {
                category: { $in: preferences },
                author: { $ne: userId },
            };

            const skip = (page - 1) * limit;

            const [articles, total] = await Promise.all([
                ArticleModel.find(filter)
                    .populate("category", "name")
                    .populate("author", "firstName profileImage")
                    .sort({ createdAt: -1 })
                    .limit(skip)
                    .exec(),

                ArticleModel.countDocuments(filter),
            ]);

            // console.log("==>", articles);

            return { articles, total };
        } catch (error) {
            throw new CustomError(
                "article fething error",
                StatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getMyArticlesPaginated(
        userId: string,
        page: number,
        limit: number
    ): Promise<{ articles: IArticle[]; total: number }> {
        try {
            const skip = (page - 1) * limit;
            const [articles, total] = await Promise.all([
                ArticleModel.find({ author: userId })
                    .populate("category", "name")
                    .sort({ createdAt: -1 })
                    .limit(skip)
                    .exec(),

                ArticleModel.countDocuments({ author: userId }),
            ]);

            return { articles, total };
        } catch (error) {
            throw new CustomError(
                "article fething error",
                StatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }



    async findInteraction(userId: Types.ObjectId, articleId: Types.ObjectId): Promise<IInteraction[]> {
        return await InteractionModel.find({ userId, articleId })
    }
    async createInteraction(userId: Types.ObjectId, articleId: Types.ObjectId, type: string): Promise<IInteraction> {
        return await InteractionModel.create({ userId, articleId, type })
    }
    async deleteInteraction(userId: Types.ObjectId, articleId: Types.ObjectId, type: string): Promise<void> {
        const result = await InteractionModel.deleteOne({ userId, articleId, type });
        console.log("Delete result: ", result);
    }


    async findUserInteractions(userId: Types.ObjectId, articleIds: Types.ObjectId[]): Promise<IInteraction[]> {
        return await InteractionModel.find({
            userId,
            articleId: { $in: articleIds }
        });
    }

    async updateArticle(articleId: string, data: UpdateArticleRequestDTO): Promise<void> {

        console.log("articleid :",articleId);
        console.log("data :",data);
        

        await ArticleModel.findByIdAndUpdate(articleId, {
            $set: {
                title: data.title,
                description: data.description,
                tags: data.tags,
                category: data.category,
                images: data.images,
                updatedAt: new Date()
            }
        })
    }


    async findArticleById(articleId: string): Promise<PopulatedArticle | null> {
    const result = await ArticleModel.findById(new Types.ObjectId(articleId))
        .populate<{ category: ICategory }>("category")
        .populate<{ author: IUser }>("author")
        .lean();

    return result as PopulatedArticle | null;
}








}
