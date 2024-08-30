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
    photos: [{ type: String, required: true }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const Day = model("Day", DaySchema);
