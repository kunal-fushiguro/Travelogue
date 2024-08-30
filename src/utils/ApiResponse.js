import { ZodError } from "zod";

class ApiResponse {
  constructor(statusCode, message, data, success) {
    this.success = success;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data || {};
  }

  static handleError(res, error) {
    let statusCode = 500;
    let message = error.message || "An unexpected error occurred";

    if (error instanceof ZodError) {
      statusCode = 400;
      message = error.errors
        .map((issue) => `${issue.path.join(".")} is ${issue.message}`)
        .join(", ");
    }

    if (message === "jwt must be provided") {
      const options = {
        httpOnly: true,
        secure: true,
      };
      const response = new ApiResponse(401, "Unauthorized request.", {}, false);
      return res
        .clearCookie("userToken", options)
        .status(401)
        .json(response.error());
    }
    const response = new ApiResponse(statusCode, message, {}, false);
    return res.status(statusCode).json(response.error());
  }

  userInfo(user) {
    return {
      message: this.message,
      statusCode: this.statusCode,
      success: this.success,
      data: {
        userid: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        bio: user.bio,
        isVerified: user.isVerified,
        posts: user.posts,
        followers: user.followers,
        following: user.following,
      },
    };
  }

  error() {
    return {
      error: {
        message: this.message,
        statusCode: this.statusCode,
        success: this.success,
      },
    };
  }
}

export { ApiResponse };
