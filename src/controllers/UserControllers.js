import { userRegisterSchema, userLoginSchema } from "../schemas/UserSchemas.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/UserModel.js";
import { comparePassword, encryptPassword } from "../utils/passwordBcrypt.js";
import { generateToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";

async function registerUser(req, res) {
  try {
    const body = req.body;
    await userRegisterSchema.parseAsync(body);

    const { username, email, password } = body;
    // check user email is register or not
    const isEmailRegisterAlreadyOrNot = await User.findOne({
      email: email,
    });

    if (isEmailRegisterAlreadyOrNot) {
      return res
        .status(409)
        .json(
          new ApiResponse(409, "Email is Already Register.", {}, false).error()
        );
    }

    // encrypt the password
    const hashedPassword = await encryptPassword(password);
    // create user
    const newUser = await User.create({
      email: email,
      username: username,
      password: hashedPassword,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          "User Register Successfully , please login.",
          {},
          true
        )
      );
  } catch (error) {
    ApiResponse.handleError(res, error);
  }
}

async function loginUser(req, res) {
  try {
    const body = req.body;
    await userLoginSchema.parseAsync(body);

    const { email, password } = body;
    // find user
    const user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(400)
        .json(
          new ApiResponse(204, "Email is not register.", {}, false).error()
        );
    }

    // check password
    const isPasswordCorrect = await comparePassword(user.password, password);

    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json(
          new ApiResponse(401, "Unauthorized credentials.", {}, false).error()
        );
    }

    // generate token
    const jwtToken = await generateToken(user._id);

    const updatedUser = await User.findByIdAndUpdate(user._id, {
      token: jwtToken,
    });

    const options = {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    return res
      .status(200)
      .cookie("userToken", jwtToken, options)
      .json(
        new ApiResponse(200, "User login successfully.", {}, true).userInfo(
          updatedUser
        )
      );
  } catch (error) {
    ApiResponse.handleError(res, error);
  }
}

async function logoutUser(req, res) {
  try {
    await User.findByIdAndUpdate(req.userid, { token: null });

    const options = {
      httpOnly: true,
      secure: true,
    };
    res
      .clearCookie("userToken", options)
      .status(200)
      .json(new ApiResponse(200, "User logout successfully.", {}, true));
  } catch (error) {
    ApiResponse.handleError(res, error);
  }
}

async function getuser(req, res) {
  try {
    const userid = req.userid;

    const user = await User.findById(userid).populate("posts");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "User Data fetched successfully.",
          {},
          true
        ).userInfo(user)
      );
  } catch (error) {
    ApiResponse.handleError(res, error);
  }
}

async function sendOtp(req, res) {
  try {
    const user = await User.findById(req.userid);
    if (!user) {
      const options = {
        httpOnly: true,
        secure: true,
      };
      return res
        .clearCookie("userToken", options)
        .status(400)
        .json(new ApiResponse(400, "User not found.", {}, false));
    }

    // if (user.isVerified) {
    //   return res
    //     .status(400)
    //     .json(
    //       new ApiResponse(400, "User is verified already.", {}, false).error()
    //     );
    // }

    // update user and create otp and expiry time
    const otp = Math.floor(Math.random() * 900000) + 100000;

    // send otp
    const isEmailSendOrNot = await sendEmail(otp, user.username, user.email);
    if (!isEmailSendOrNot) {
      return res
        .status(500)
        .json(
          new ApiResponse(
            500,
            "Unexpected Error Occur while send email",
            {},
            false
          ).error()
        );
    }

    await User.findByIdAndUpdate(user._id, {
      otp: otp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "OTP send successfully, check you email.",
          {},
          true
        )
      );
  } catch (error) {
    ApiResponse.handleError(res, error);
  }
}

async function verifyUser(req, res) {
  try {
    const body = req.body;
    const { otp } = body;

    if (!otp) {
      return res
        .status(400)
        .json(new ApiResponse(400, "OTP is required.", {}, false).error());
    }

    // find user
    const user = await User.findById(req.userid);

    if (!user) {
      const options = {
        httpOnly: true,
        secure: true,
      };
      return res
        .clearCookie("userToken", options)
        .status(400)
        .json(new ApiResponse(400, "User not found.", {}, false).error());
    }

    if (!user.isVerified) {
      if (user.otp == otp) {
        if (user.otpExpiry > Date.now()) {
          // success
          await User.findByIdAndUpdate(user._id, {
            isVerified: true,
            otp: null,
            otpExpiry: null,
          });
          return res
            .status(200)
            .json(
              new ApiResponse(200, "User verified successfully.", {}, true)
            );
        } else {
          //  not success
          await User.findByIdAndUpdate(user._id, {
            otp: null,
            otpExpiry: null,
          });
          return res
            .status(410)
            .json(
              new ApiResponse(
                410,
                "OTP expired please generate new one.",
                {},
                false
              ).error()
            );
        }
      } else {
        return res
          .status(400)
          .json(new ApiResponse(400, "Not a valid OTP.", {}, false).error());
      }
    } else {
      return res
        .status(400)
        .json(
          new ApiResponse(400, "User is verified already.", {}, false).error()
        );
    }
  } catch (error) {
    ApiResponse.handleError(res, error);
  }
}

async function resetPassword(req, res) {
  try {
    const body = req.body;
    const { otp, password } = body;
    if (!otp || !password) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            "OTP and newPassword is required to reset the old password.",
            {},
            false
          ).error()
        );
    }

    // find user
    const user = await User.findById(req.userid);

    if (!user) {
      const options = {
        httpOnly: true,
        secure: true,
      };
      return res
        .clearCookie("userToken", options)
        .status(400)
        .json(new ApiResponse(400, "User not found.", {}, false).error());
    }

    //  check otp is send or not
    if (user.otp === null) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            "Please Send a OTP to verified email first then try to reset the password.",
            {},
            false
          ).error()
        );
    }

    //  reset password
    const newHashedPassword = await encryptPassword(password);
    if (user.otp == otp) {
      if (user.otpExpiry > Date.now()) {
        //  success
        await User.findByIdAndUpdate(user._id, {
          otp: null,
          otpExpiry: null,
          password: newHashedPassword,
          token: null,
          isVerified: true,
        });

        const options = {
          httpOnly: true,
          secure: true,
        };
        return res
          .clearCookie("userToken", options)
          .status(200)
          .json(new ApiResponse(200, "Password reset successfully.", {}, true));
      } else {
        //  not success
        await User.findByIdAndUpdate(user._id, {
          otp: null,
          otpExpiry: null,
        });
        return res
          .status(410)
          .json(
            new ApiResponse(
              410,
              "OTP expired please generate new one.",
              {},
              false
            ).error()
          );
      }
    } else {
      return res
        .status(400)
        .json(new ApiResponse(400, "Not a valid OTP.", {}, false).error());
    }
  } catch (error) {
    ApiResponse.handleError(res, error);
  }
}

async function deleteUser(req, res) {
  try {
    const body = req.body;
    const { otp } = body;

    if (!otp) {
      return res
        .status(400)
        .json(new ApiResponse(400, "OTP is required.", {}, false).error());
    }

    // find user
    const user = await User.findById(req.userid);

    if (!user) {
      const options = {
        httpOnly: true,
        secure: true,
      };
      return res
        .clearCookie("userToken", options)
        .status(400)
        .json(new ApiResponse(400, "User not found.", {}, false).error());
    }

    if (user.otp == otp) {
      if (user.otpExpiry > Date.now()) {
        //  success
        await User.findByIdAndDelete(user._id);
        const options = {
          httpOnly: true,
          secure: true,
        };
        return res
          .clearCookie("userToken", options)
          .status(200)
          .json(
            new ApiResponse(200, "Account deleted successfully.", {}, true)
          );
      } else {
        //  not success
        await User.findByIdAndUpdate(user._id, {
          otp: null,
          otpExpiry: null,
        });
        return res
          .status(410)
          .json(
            new ApiResponse(
              410,
              "OTP expired please generate new one.",
              {},
              false
            ).error()
          );
      }
    } else {
      return res
        .status(400)
        .json(new ApiResponse(400, "Not a valid OTP.", {}, false).error());
    }
  } catch (error) {
    ApiResponse.handleError(res, error);
  }
}

async function updateUser(req, res) {
  try {
    const body = req.body;
    const { username, bio, profilePic } = body;

    if (!username || !bio || !profilePic) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            "All fields are required (username , bio,profilePic).",
            {},
            false
          ).error()
        );
    }

    // find user and update the profile
    const updatedUser = await User.findByIdAndUpdate(req.userid, {
      username: username,
      bio: bio,
      profilePic: profilePic,
    });

    if (!updatedUser) {
      const options = {
        httpOnly: true,
        secure: true,
      };
      return res
        .clearCookie("userToken", options)
        .status(404)
        .json(new ApiResponse(404, "User not found.", {}, true));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, "User Updated Successfully", {}, true).userInfo(
          updatedUser
        )
      );
  } catch (error) {
    ApiResponse.handleError(res, error);
  }
}

export {
  registerUser,
  loginUser,
  logoutUser,
  getuser,
  sendOtp,
  verifyUser,
  resetPassword,
  deleteUser,
  updateUser,
};
