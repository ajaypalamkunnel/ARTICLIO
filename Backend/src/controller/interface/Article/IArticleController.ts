import { Request,Response } from "express"

export interface IArticleController{


    getpaginatedCategory(req:Request,res:Response):Promise<Response>

}