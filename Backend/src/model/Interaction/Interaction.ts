import { Schema, model, Document, Types } from 'mongoose';

export type InteractionType = 'like' | 'dislike' | 'block';

export interface IInteraction extends Document {
  userId: Types.ObjectId;
  articleId: Types.ObjectId;
  type: InteractionType;
  createdAt: Date;
}

const InteractionSchema = new Schema<IInteraction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    articleId: {
      type: Schema.Types.ObjectId,
      ref: 'Article',
      required: true,
    },
    type: {
      type: String,
      enum: ['like', 'dislike', 'block'],
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

// Ensure one interaction per user/article/type
InteractionSchema.index({ userId: 1, articleId: 1, type: 1 }, { unique: true });

export const InteractionModel = model<IInteraction>('Interaction', InteractionSchema);
