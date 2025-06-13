export interface UserArticleInteractionDTO {
  articleId: string;
  like: boolean;
  dislike: boolean;
  block: boolean;
}

export interface UserArticleInteractionResponse {
  success: boolean;
  data: UserArticleInteractionDTO[];
}


export interface getIntractionsRequestID {
    articleIds:string[]
}

export type InteractionType = 'like' | 'dislike' | 'block';

export interface InteractionRequestDTO {
  articleId: string;
  type: InteractionType;
  action: 'add' | 'remove';
}