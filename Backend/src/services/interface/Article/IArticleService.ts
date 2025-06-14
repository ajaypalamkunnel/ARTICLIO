import { CreateArticleDTO, UpdateArticleRequestDTO } from "../../../dtos/article.dto";
import { ArticleByIdResponseDTO } from "../../../dtos/articleResponse.dto";
import { InteractionRequestDTO, UserArticleInteractionDTO } from "../../../dtos/InteractionDTO";
import { IArticle } from "../../../model/Article/Article";
import { ICategory } from "../../../model/Category/Category";



export interface IArticleService {

    getCategoriesPaginated(skip: number, limit: number): Promise<ICategory[]>
    getAllCategories(): Promise<ICategory[]>
    createArticle(data: CreateArticleDTO): Promise<IArticle>
    getArticlesByPreferences(
        userId: string,
        page: number,
        limit: number
    ): Promise<{ articles: IArticle[]; total: number; totalPages: number; currentPage: number }>

    getMyArticles(
        userId: string,
        page: number,
        limit: number
    ): Promise<{ articles: IArticle[]; total: number; totalPages: number; currentPage: number }>


    handleInteraction(userId: string, interaction: InteractionRequestDTO): Promise<void>;

    getUserInteractions(userId: string, articleIds: string[]): Promise<UserArticleInteractionDTO[]>

    updateArticle(userId: string, data: UpdateArticleRequestDTO): Promise<void>;

    getArticleById(articleId: string): Promise<ArticleByIdResponseDTO | null>


}