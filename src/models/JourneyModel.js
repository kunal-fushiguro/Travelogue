import { Schema, model } from "mongoose";

const JourneySchema = new Schema(
  {
    userid: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    isPublic: {
      type: Boolean,
      required: true,
      default: true,
    },
    days: [{ type: Schema.Types.ObjectId, ref: "Day" }],
  },
  { timestamps: true }
);

export const Post = model("Journey", JourneySchema);
