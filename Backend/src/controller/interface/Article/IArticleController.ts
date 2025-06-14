import { Request,Response } from "express"

export interface IArticleController{


    getpaginatedCategory(req:Request,res:Response):Promise<Response>
    getAllCategory(req:Request,res:Response):Promise<Response>
    createArticle(req: Request, res: Response): Promise<Response>,
    getArticles(req: Request, res: Response): Promise<Response>
    getMyArticles(req: Request, res: Response): Promise<Response>
    interact(req: Request, res: Response): Promise<Response>;
    getUserInteractions(req: Request, res: Response): Promise<Response>
    updateArticle(req: Request, res: Response): Promise<Response>;
    getArticleById(req: Request, res: Response): Promise<Response>

}