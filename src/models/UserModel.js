import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    token: {
      type: String,
      required: true,
      select: false,
    },
    profilePic: {
      type: String,
    },
    bio: {
      type: String,
    },
    isVerified: {
      type: Boolean,
    },
    otp: {
      type: Number,
    },
    otpExpiry: {
      type: Date,
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Journey",
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export const User = model("User", UserSchema);
