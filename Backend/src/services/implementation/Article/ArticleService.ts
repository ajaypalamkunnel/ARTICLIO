import { ICategory } from "../../../model/Category/Category";
import { IArticleRepository } from "../../../repositories/interface/Article/IArticleRepository";
import { IArticleService } from "../../interface/Article/IArticleService";


class ArticleService implements IArticleService{

    private _articleRepository:IArticleRepository

    constructor(articleRepository:IArticleRepository){
        this._articleRepository = articleRepository
    }
   async getCategoriesPaginated(skip: number = 0, limit: number = 7): Promise<ICategory[]> {
        const categories = await  this._articleRepository.findPaginatedCategory(skip,limit)
        return categories
    }

    

}

export default ArticleService