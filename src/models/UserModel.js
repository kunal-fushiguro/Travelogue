import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    username: {},
  },
  { timestamps: true }
);

export const User = model("User", UserSchema);
