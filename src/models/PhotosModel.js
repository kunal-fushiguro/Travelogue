import { model, Schema } from "mongoose";

const PhotoSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
});

export const Photo = model("Photo", PhotoSchema);
