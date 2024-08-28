import { Schema, model } from "mongoose";

const DaySchema = new Schema(
  {
    journeyid: {
      type: Schema.Types.ObjectId,
      ref: "Journey",
    },
    title: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    photos: [{ type: Schema.Types.ObjectId, ref: "Photo" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const Day = model("Day", DaySchema);
