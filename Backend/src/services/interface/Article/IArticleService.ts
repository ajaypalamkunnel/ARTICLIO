import { ICategory } from "../../../model/Category/Category";



export interface IArticleService{

getCategoriesPaginated(skip: number, limit: number): Promise<ICategory[]>


}