import { Schema, model, Document, Types } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  description: string;
  images: string[];
  tags: string[];
  category: Types.ObjectId;
  author: Types.ObjectId;
  stats: {
    likes: number;
    dislikes: number;
    blocks: number;
  };
  createdAt: Date;
  updatedAt: Date;
}


const ArticleSchema = new Schema<IArticle>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stats: {
      likes: { type: Number, default: 0 },
      dislikes: { type: Number, default: 0 },
      blocks: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true, 
  }
);

export const ArticleModel = model<IArticle>('Article', ArticleSchema);