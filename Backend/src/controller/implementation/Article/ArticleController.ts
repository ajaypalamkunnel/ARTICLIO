import { Request, Response } from "express";
import { IArticleService } from "../../../services/interface/Article/IArticleService";
import { IArticleController } from "../../interface/Article/IArticleController";
import { ERROR_MESSAGES, StatusCode } from "../../../constants/statusCode";
import { CustomError } from "../../../utils/CustomError";
import { Types } from "mongoose";
import UserRepository from "../../../repositories/implementation/User/UserRepository";
import { IUserService } from "../../../services/interface/User/IUserService";
import { ArticleResponseDTO } from "../../../dtos/articleResponse.dto";
import { mapArticleToDTO } from "../../../mapper/article.mapper";
import { InteractionRequestDTO } from "../../../dtos/InteractionDTO";

class ArtileController implements IArticleController {
    private _articleService: IArticleService;
    private _userService: IUserService;

    constructor(articleService: IArticleService, userService: IUserService) {
        this._articleService = articleService;
        this._userService = userService;
    }

    async getpaginatedCategory(req: Request, res: Response): Promise<Response> {
        try {
            const skip = parseInt(req.query.skip as string) || 0;
            const limit = parseInt(req.query.limit as string) || 7;

            const categories = await this._articleService.getCategoriesPaginated(
                skip,
                limit
            );

            return res
                .status(StatusCode.OK)
                .json({ success: true, data: categories });
        } catch (error) {
            console.error("[CategoryController] Error:", error);
            return res
                .status(StatusCode.OK)
                .json({ success: false, message: "Internal server error" });
        }
    }

    async getAllCategory(req: Request, res: Response): Promise<Response> {
        try {
            const categories = await this._articleService.getAllCategories();

            console.log("-->", categories);

            return res
                .status(StatusCode.OK)
                .json({ success: true, data: categories });
        } catch (error) {
            console.log("registratrion error", error);

            return res
                .status(
                    error instanceof CustomError
                        ? error.statusCode
                        : StatusCode.INTERNAL_SERVER_ERROR
                )
                .json(
                    error instanceof CustomError
                        ? error.message
                        : ERROR_MESSAGES.INTERNAL_SERVER_ERROR
                );
        }
    }

    async createArticle(req: Request, res: Response): Promise<Response> {
        try {
            const { title, description, tags, category } = req.body;
            const files = req.files as Express.Multer.File[];
            const userId = req.user?.userId;

            console.log("description :", description);

            console.log("tage", tags);
            console.log("Filer :", files);
            const imageUrls = files.map((file) => file.path);

            const article = await this._articleService.createArticle({
                title,
                description,
                tags: tags ? tags.split(",").map((tag: string) => tag.trim()) : [],
                category,
                author: new Types.ObjectId(userId),
                images: imageUrls,
            });

            return res
                .status(StatusCode.CREATED)
                .json({ success: true, data: article });
        } catch (error: any) {
            console.log("registratrion error", error);

            return res
                .status(
                    error instanceof CustomError
                        ? error.statusCode
                        : StatusCode.INTERNAL_SERVER_ERROR
                )
                .json(
                    error instanceof CustomError
                        ? error.message
                        : ERROR_MESSAGES.INTERNAL_SERVER_ERROR
                );
        }
    }

    async getArticles(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.userId;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const data = await this._articleService.getArticlesByPreferences(
                userId!,
                page,
                limit
            );

            // console.log("data : ", data.articles);

            const mappedArticles: ArticleResponseDTO[] =
                data.articles.map(mapArticleToDTO);

            // console.log("**", mappedArticles);

            return res.status(StatusCode.OK).json({
                success: true,
                articles: mappedArticles,
                total: data.total,
                totalPages: data.totalPages,
                currentPage: data.currentPage,
            });
        } catch (error) {
            console.log("falied ro fetch article:", error);

            return res
                .status(
                    error instanceof CustomError
                        ? error.statusCode
                        : StatusCode.INTERNAL_SERVER_ERROR
                )
                .json(
                    error instanceof CustomError
                        ? error.message
                        : ERROR_MESSAGES.INTERNAL_SERVER_ERROR
                );
        }
    }

    async getMyArticles(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.userId;

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const data = await this._articleService.getMyArticles(
                userId!,
                page,
                limit
            );

            const mappedMyArticles: ArticleResponseDTO[] =
                data.articles.map(mapArticleToDTO);

            return res.status(StatusCode.OK).json({
                success: true,
                articles: mappedMyArticles,
                total: data.total,
                totalPages: data.totalPages,
                currentPage: data.currentPage,
            });
        } catch (error) {
            console.log("falied ro fetch article:", error);

            return res
                .status(
                    error instanceof CustomError
                        ? error.statusCode
                        : StatusCode.INTERNAL_SERVER_ERROR
                )
                .json(
                    error instanceof CustomError
                        ? error.message
                        : ERROR_MESSAGES.INTERNAL_SERVER_ERROR
                );
        }
    }

    async interact(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.userId;

            const interaction: InteractionRequestDTO = req.body;

            await this._articleService.handleInteraction(userId!, interaction);

            return res
                .status(StatusCode.OK)
                .json({ success: true, message: "Interaction processed" });
        } catch (error: any) {
            console.error("Interaction error:", error);
            return res
                .status(StatusCode.INTERNAL_SERVER_ERROR)
                .json({ success: false, message: error.message });
        }
    }

    async getUserInteractions(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.userId;
            const { articleIds } = req.body;

            console.log("--->",articleIds);
            

            const result = await this._articleService.getUserInteractions(
                userId!,
                articleIds
            );

            return res.status(StatusCode.OK).json({ success: true, data: result });
        } catch (error) {
            console.error("Interaction load error:", error);

            return res
                .status(
                    error instanceof CustomError
                        ? error.statusCode
                        : StatusCode.INTERNAL_SERVER_ERROR
                )
                .json({
                    success: false,
                    message:
                        error instanceof CustomError
                            ? error.message
                            : ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
                });
        }
    }
}

export default ArtileController;
