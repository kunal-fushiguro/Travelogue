import { ApiResponse } from "../utils/ApiResponse.js";
import { Post } from "../models/JourneyModel.js";
import { User } from "../models/UserModel.js";
import {
  createPostSchema,
  updatePostSchema,
} from "../schemas/JourneySchemas.js";

async function createPost(req, res) {
  try {
    const body = req.body;
    await createPostSchema.parseAsync(body);

    const { title, description, coverImage, isPublic } = body;

    //  find user
    const user = await User.findById(req.userid);

    if (!user) {
      const options = {
        httpOnly: true,
        secure: true,
      };
      res
        .clearCookie("userToken", options)
        .status(400)
        .json(new ApiResponse(400, "User not found.", {}, false).error());
    }

    // create a post
    const newPost = await Post.create({
      userid: user._id,
      title: title,
      description: description,
      coverImage: coverImage,
      isPublic: isPublic,
    });

    // update user
    const updatedUser = await User.findByIdAndUpdate(user._id, {
      $push: { posts: newPost._id },
    }).populate("posts");

    return res
      .status(201)
      .json(
        new ApiResponse(200, "Post created successfully.", {}, true).userInfo(
          updatedUser
        )
      );
  } catch (error) {
    ApiResponse.handleError(res, error);
  }
}

async function updatePost(req, res) {
  try {
    const body = req.body;

    await updatePostSchema.parseAsync(body);

    const { postid, title, description, coverImage, isPublic } = body;

    //  find post and update the post
    const post = await Post.findById(postid);

    if (String(req.userid) !== String(post.userid)) {
      return res
        .status(401)
        .json(new ApiResponse(401, "Unauthorized Access", {}, false).error());
    }

    await Post.findByIdAndUpdate(post._id, {
      title: title,
      description: description,
      coverImage: coverImage,
      isPublic: isPublic,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, "Post Updated SuccessFully.", {}, true));
  } catch (error) {
    ApiResponse.handleError(res, error);
  }
}

async function deletePost(req, res) {
  try {
    const body = req.body;
    const { postid } = body;

    if (!postid) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Post ID is required.", {}, false).error());
    }

    // find post
    const post = await Post.findById(postid);

    if (String(req.userid) !== String(post.userid)) {
      return res
        .status(401)
        .json(new ApiResponse(401, "Unauthorized Access", {}, false).error());
    }

    // delete post and delete post id from user as well
    await Post.findByIdAndDelete(post._id);
    const updatedUser = User.findByIdAndUpdate(post.userid, {
      $pull: {
        posts: post._id,
      },
    });
  } catch (error) {
    ApiResponse.handleError(res, error);
  }
}

export { createPost, updatePost, deletePost };
