import { Types } from "mongoose";
import { IArticle } from "../../../model/Article/Article";
import { ICategory } from "../../../model/Category/Category";
import { IBaseRepository } from "../../base/IBaseRepository";
import { IInteraction } from "../../../model/Interaction/Interaction";
import { PopulatedArticle, UpdateArticleRequestDTO } from "../../../dtos/article.dto";
import { ArticleByIdResponseDTO } from "../../../dtos/articleResponse.dto";
import { IUser } from "../../../model/User/User";


export interface IArticleRepository extends IBaseRepository<IArticle> {


  findPaginatedCategory(skip: number, limit: number): Promise<ICategory[]>
  findAllCategory(): Promise<ICategory[]>
  getArticlesByPreferencesPaginated(
    preferences: string[],
    userId: string,
    page: number,
    limit: number
  ): Promise<{ articles: IArticle[]; total: number }>

  getMyArticlesPaginated(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ articles: IArticle[]; total: number }>


  findInteraction(userId: Types.ObjectId, articleId: Types.ObjectId): Promise<IInteraction[]>;
  createInteraction(userId: Types.ObjectId, articleId: Types.ObjectId, type: string): Promise<IInteraction>;
  deleteInteraction(userId: Types.ObjectId, articleId: Types.ObjectId, type: string): Promise<void>;
  findUserInteractions(userId: Types.ObjectId, articleIds: Types.ObjectId[]): Promise<IInteraction[]>;

  updateArticle(articleId: string, data: UpdateArticleRequestDTO): Promise<void>;


findArticleById(articleId: string):Promise<PopulatedArticle|null>




}

