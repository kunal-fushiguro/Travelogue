import { ApiResponse } from "../utils/ApiResponse.js";
import { Post } from "../models/JourneyModel.js";
import { Day } from "../models/DayModel.js";
import { User } from "../models/UserModel.js";
import { daysCreateSchema } from "../schemas/DaysSchemas.js";

async function createDays(req, res) {
  try {
    const body = req.body;
    const postId = req.params.postid;

    await daysCreateSchema.parseAsync(body);

    // find post
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json(new ApiResponse(404, "Post not found.", {}, false).error());
    }

    if (String(post.userid) !== String(req.userid)) {
      return res
        .status(401)
        .json(new ApiResponse(401, "Unauthorized Access", {}, false).error());
    }

    const newDay = await Day.create({
      journeyid: post._id,
      title: body.title,
      summary: body.summary,
      location: body.location,
      photos: [...body.photos],
    });

    const updatePost = await Post.findByIdAndUpdate(
      post._id,
      {
        $push: {
          days: newDay._id,
        },
      },
      { new: true }
    ).populate("days");

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          "Day created successfully.",
          { post: updatePost._doc },
          true
        )
      );
  } catch (error) {
    ApiResponse.handleError(res, error);
  }
}

async function updateDays(req, res) {
  try {
    const body = req.body;
    const postId = req.params.postid;
    const daysId = req.params.daysid;

    await daysCreateSchema.parseAsync(body);

    // find post
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json(new ApiResponse(404, "Post not found.", {}, false).error());
    }

    if (String(post.userid) !== String(req.userid)) {
      return res
        .status(401)
        .json(new ApiResponse(401, "Unauthorized Access", {}, false).error());
    }

    await Day.findByIdAndUpdate(daysId, {
      title: body.title,
      summary: body.summary,
      location: body.location,
      photos: [...body.photos],
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Day Updated successfully.",
          { post: updatedPost._doc },
          true
        )
      );
  } catch (error) {
    ApiResponse.handleError(res, error);
  }
}

async function deleteDays(req, res) {
  try {
    const postId = req.params.postid;
    const daysId = req.params.daysid;
    // find post
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json(new ApiResponse(404, "Post not found.", {}, false).error());
    }

    if (String(post.userid) !== String(req.userid)) {
      return res
        .status(401)
        .json(new ApiResponse(401, "Unauthorized Access", {}, false).error());
    }

    await Day.findByIdAndDelete(daysId);

    const updatedPost = await Post.findByIdAndUpdate(
      post._id,
      {
        $pull: {
          days: daysId,
        },
      },
      { new: true }
    ).populate("days");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Day deleted successfully.",
          { post: updatedPost._doc },
          true
        )
      );
  } catch (error) {
    ApiResponse.handleError(res, error);
  }
}

async function likeDays(req, res) {
  try {
    const dayId = req.params.daysid;

    const userid = req.userid;

    await Day.findByIdAndUpdate(dayId, {
      $push: {
        likes: userid,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Day liked successfully.", {}, true));
  } catch (error) {
    ApiResponse.handleError(res, error);
  }
}
async function unlikeDays(req, res) {
  try {
    const dayId = req.params.daysid;

    const userid = req.userid;

    await Day.findByIdAndUpdate(dayId, {
      $pull: {
        likes: userid,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Day unliked successfully.", {}, true));
  } catch (error) {
    ApiResponse.handleError(res, error);
  }
}

export { createDays, updateDays, deleteDays, likeDays, unlikeDays };
