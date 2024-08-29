import { userRegisterSchema, userLoginSchema } from "../schemas/UserSchemas.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/UserModel.js";
import { comparePassword, encryptPassword } from "../utils/passwordBcrypt.js";
import { generateToken } from "../utils/jwtToken.js";

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

    const user = await User.findById(userid);

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

// send otp
// verifyUser otp required
// forget password otp required
// delete user otp required
// update profile
export { registerUser, loginUser, logoutUser, getuser };
