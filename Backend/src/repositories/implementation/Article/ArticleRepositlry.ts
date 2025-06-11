import { ArticleModel, IArticle } from "../../../model/Article/Article";
import { CategoryModel, ICategory } from "../../../model/Category/Category";
import { BaseRepository } from "../../base/BaseRepository";
import { IArticleRepository } from "../../interface/Article/IArticleRepository";



export class ArticleRepository extends BaseRepository<IArticle> implements IArticleRepository {

    constructor(){
        super(ArticleModel)
    }
    async findPaginatedCategory(skip: number, limit: number): Promise<ICategory[]> {
        const categories = await CategoryModel.find().skip(skip).limit(limit)
        return categories
    }
   
    
}