import { Request, Response } from "express";
import { IArticleService } from "../../../services/interface/Article/IArticleService";
import { IArticleController } from "../../interface/Article/IArticleController";
import { StatusCode } from "../../../constants/statusCode";

class ArtileController implements IArticleController {
    private _ArticleService: IArticleService;

    constructor(articleService: IArticleService) {
        this._ArticleService = articleService;
    }
    async getpaginatedCategory(req: Request, res: Response): Promise<Response> {
        try {
            const skip = parseInt(req.query.skip as string) || 0;
            const limit = parseInt(req.query.limit as string) || 7;

            const categories = await this._ArticleService.getCategoriesPaginated(
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

    


}

export default ArtileController;
