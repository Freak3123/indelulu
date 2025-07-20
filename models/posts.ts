import mongoose, { Schema, Types, Document, Model } from "mongoose";
import User from "./user";

export interface IPost extends Document {
  _id: Types.ObjectId;
  link: string;
  caption: string;
  user: Types.ObjectId; 
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    link: {
      type: String,
      required: true,
      trim: true,
    },
    caption: {
      type: String,
      trim: true,
      default: "",
      maxlength: 300, 
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>("Post", postSchema);

export default Post;
