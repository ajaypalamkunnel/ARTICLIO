import { Types } from "mongoose";
import { ERROR_MESSAGES, StatusCode } from "../../../constants/statusCode";
import { CreateArticleDTO, UpdateArticleRequestDTO } from "../../../dtos/article.dto";
import { InteractionRequestDTO, UserArticleInteractionDTO } from "../../../dtos/InteractionDTO";
import { ArticleModel, IArticle } from "../../../model/Article/Article";
import { ICategory } from "../../../model/Category/Category";
import { IArticleRepository } from "../../../repositories/interface/Article/IArticleRepository";
import { IUserRepositroy } from "../../../repositories/interface/User/IUserRepository";
import { CustomError } from "../../../utils/CustomError";
import { IArticleService } from "../../interface/Article/IArticleService";
import { ArticleByIdResponseDTO } from "../../../dtos/articleResponse.dto";


class ArticleService implements IArticleService {

    private _articleRepository: IArticleRepository
    private _userRepository: IUserRepositroy;

    constructor(articleRepository: IArticleRepository, userRepository: IUserRepositroy) {
        this._articleRepository = articleRepository
        this._userRepository = userRepository
    }





    async getCategoriesPaginated(skip: number = 0, limit: number = 7): Promise<ICategory[]> {
        const categories = await this._articleRepository.findPaginatedCategory(skip, limit)
        return categories
    }

    async getAllCategories(): Promise<ICategory[]> {

        try {
            const categories = await this._articleRepository.findAllCategory()

            if (!categories || categories.length === 0) {
                throw new CustomError("categories is empty", StatusCode.NOT_FOUND)
            }

            return categories


        } catch (error) {
            if (error instanceof CustomError) {
                throw error
            } else {
                throw new CustomError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, StatusCode.INTERNAL_SERVER_ERROR)
            }
        }

    }

    async createArticle(data: CreateArticleDTO): Promise<IArticle> {
        try {

            const article = await this._articleRepository.create(data)

            return article

        } catch (error) {
            throw new CustomError("Failed to create article", StatusCode.INTERNAL_SERVER_ERROR)
        }
    }

    async getArticlesByPreferences(userId: string, page: number, limit: number): Promise<{ articles: IArticle[]; total: number; totalPages: number; currentPage: number; }> {
        try {

            const user = await this._userRepository.findById(userId)

            if (!user) {
                throw new CustomError("User not found", StatusCode.NOT_FOUND);
            }

            if (!user.preferences || user.preferences.length === 0) {
                throw new CustomError("No preferences selected.", StatusCode.BAD_REQUEST)
            }

            const preferences = user.preferences.map((id) => id.toString())

            const { articles, total } = await this._articleRepository.getArticlesByPreferencesPaginated(preferences, userId, page, limit)

            const totalPages = Math.ceil(total / limit)

            return {
                articles,
                total,
                totalPages,
                currentPage: page
            }

        } catch (error) {
            throw new CustomError("Failed to fetch articles", StatusCode.INTERNAL_SERVER_ERROR);
        }
    }

    async getMyArticles(userId: string, page: number, limit: number): Promise<{ articles: IArticle[]; total: number; totalPages: number; currentPage: number; }> {
        try {
            const { articles, total } = await this._articleRepository.getMyArticlesPaginated(userId, page, limit)

            const totalPages = Math.ceil(total / limit)

            return {
                articles,
                total,
                totalPages,
                currentPage: page
            }

        } catch (error) {
            throw new CustomError("Failed to fetch articles", StatusCode.INTERNAL_SERVER_ERROR);
        }
    }



    async handleInteraction(userId: string, interaction: InteractionRequestDTO): Promise<void> {
        try {

            const userObjectId = new Types.ObjectId(userId)
            const articleObjectId = new Types.ObjectId(interaction.articleId);

            const existingInteractions = await this._articleRepository.findInteraction(userObjectId, articleObjectId)

            const existingLike = existingInteractions.find(i => i.type === "like")
            const existingDislike = existingInteractions.find(i => i.type === 'dislike');
            const existingBlock = existingInteractions.find(i => i.type === 'block');

            console.log("inside service : ", interaction);



            if (interaction.type === "like") {
                if (interaction.action === 'add') {
                    if (existingLike) throw new Error("Already liked 4")


                    if (existingDislike) {

                        await this._articleRepository.deleteInteraction(userObjectId, articleObjectId, "dislike")
                        await ArticleModel.updateOne(
                            { _id: articleObjectId, "stats.dislikes": { $gt: 0 } },
                            { $inc: { "stats.dislikes": -1 } }
                        );
                    }

                    await this._articleRepository.createInteraction(userObjectId, articleObjectId, "like")
                    await ArticleModel.findByIdAndUpdate(articleObjectId, { $inc: { "stats.likes": 1 } })

                } else if (interaction.action === "remove") {
                    if (!existingLike) {
                        return
                    }
                    await this._articleRepository.deleteInteraction(userObjectId, articleObjectId, 'like');
                    await ArticleModel.updateOne(
                        { _id: articleObjectId, "stats.likes": { $gt: 0 } },
                        { $inc: { "stats.likes": -1 } }
                    );
                }

            }


            if (interaction.type === "dislike") {
                if (interaction.action === "add") {
                    if (existingDislike) throw new Error('Already disliked');



                    if (existingLike) {
                        await this._articleRepository.deleteInteraction(userObjectId, articleObjectId, "like")
                        await ArticleModel.updateOne(
                            { _id: articleObjectId, "stats.likes": { $gt: 0 } },
                            { $inc: { "stats.likes": -1 } }
                        );
                    }

                    await this._articleRepository.createInteraction(userObjectId, articleObjectId, 'dislike');
                    await ArticleModel.findByIdAndUpdate(articleObjectId, { $inc: { "stats.dislikes": 1 } });

                } else if (interaction.action === "remove") {
                    if (!existingDislike) {
                        return
                    }
                    await this._articleRepository.deleteInteraction(userObjectId, articleObjectId, 'dislike');
                    await ArticleModel.updateOne(
                        { _id: articleObjectId, "stats.dislikes": { $gt: 0 } },
                        { $inc: { "stats.dislikes": -1 } }
                    );
                }
            }


            if (interaction.type === "block") {
                if (interaction.action === "add") {
                    if (!existingBlock) {
                        await this._articleRepository.createInteraction(userObjectId, articleObjectId, 'block');
                        await ArticleModel.findByIdAndUpdate(articleObjectId, { $inc: { "stats.blocks": 1 } });
                    }
                } else if (interaction.action === "remove") {

                    if (existingBlock) {
                        await this._articleRepository.deleteInteraction(userObjectId, articleObjectId, 'block');
                        await ArticleModel.updateOne(
                            { _id: articleObjectId, "stats.dislikes": { $gt: 0 } },
                            { $inc: { "stats.dislikes": -1 } }
                        );
                    }
                }

            }





        } catch (error) {

            console.error("Interaction error: ", error);
            throw error instanceof Error ? error : new Error("Internal server Error");

        }
    }



    async getUserInteractions(userId: string, articleIds: string[]): Promise<UserArticleInteractionDTO[]> {
        try {

            const userObjectId = new Types.ObjectId(userId);
            const articleObjectIds = articleIds.map(id => new Types.ObjectId(id));


            const interactions = await this._articleRepository.findUserInteractions(userObjectId, articleObjectIds)

            const interactionMap: Record<string, UserArticleInteractionDTO> = {};

            for (const id of articleIds) {
                interactionMap[id] = { articleId: id, like: false, dislike: false, block: false };
            }


            for (const interaction of interactions) {
                const articleId = interaction.articleId.toString();
                if (!interactionMap[articleId]) continue;

                if (interaction.type === "like") interactionMap[articleId].like = true;
                if (interaction.type === "dislike") interactionMap[articleId].dislike = true;
                if (interaction.type === "block") interactionMap[articleId].block = true;
            }

            return Object.values(interactionMap);



        } catch (error) {

            throw new CustomError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, StatusCode.INTERNAL_SERVER_ERROR)

        }
    }


    async updateArticle(userId: string, data: UpdateArticleRequestDTO): Promise<void> {
        try {



            const existingArticle = await this._articleRepository.findById(data.articleId)

            if (!existingArticle) {
                throw new CustomError("Article not found", StatusCode.NOT_FOUND)
            }


            if (existingArticle.author.toString() !== userId) {
                throw new CustomError("Unauthorized to update this article", StatusCode.UNAUTHORIZED);
            }

            await this._articleRepository.updateArticle(data.articleId, data)



        } catch (error) {

            if (error instanceof CustomError) {
                throw error
            } else {
                throw new CustomError("article updation error", StatusCode.INTERNAL_SERVER_ERROR)
            }

        }
    }


    async getArticleById(articleId: string): Promise<ArticleByIdResponseDTO | null> {
        try {

            const article = await this._articleRepository.findArticleById(articleId);
            if (!article) return null;

            return {
                id: article._id.toString(),
                title: article.title,
                description: article.description,
                tags: article.tags,
                images: article.images,
                createdAt: article.createdAt,
                updatedAt: article.updatedAt,
                category: {
                    _id: article.category._id.toString(),
                    name: article.category.name,
                },
                author: {
                    _id: article.author._id.toString(),
                    firstName: article.author.firstName,
                    lastName: article.author.lastName,
                    email: article.author.email,
                    profileImage: article.author.profileImage || "",
                },
            };


        } catch (error) {
            throw error
        }
    }









}

export default ArticleService