import { ICategory } from "../../../model/Category/Category";
import { IBaseRepository } from "../../base/IBaseRepository";


export interface IArticleRepository {


    findPaginatedCategory(skip:number, limit:number): Promise<ICategory[]> 

}

