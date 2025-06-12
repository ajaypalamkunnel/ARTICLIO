import { Document, model, ObjectId, Schema, Types } from "mongoose";

export interface IUser extends Document {
  _id: ObjectId
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: Date;
  password: string;
  preferences: Types.ObjectId[];
  profileImage?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  otp?: string | null;
  otpExpires?: Date | null;
  isVerified: Boolean
  refreshToken?: string
}

const UserSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^\S+@\S+\.\S+$/,
    },
    phone: {
      type: String,
      required: true,
      match: /^[0-9]{10,15}$/,
    },
    dob: {
      type: Date,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    preferences: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    profileImage: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    otp: { type: String },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
    refreshToken: { type: String }
  },

  {
    timestamps: true,
  }
);

export const UserModel = model<IUser>('User', UserSchema);
