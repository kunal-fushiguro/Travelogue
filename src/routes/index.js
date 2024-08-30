import { Router } from "express";
import {
  deleteUser,
  followUser,
  getuser,
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  sendOtp,
  unfollowUser,
  updateUser,
  verifyUser,
} from "../controllers/UserControllers.js";
import {
  createPost,
  updatePost,
  deletePost,
} from "../controllers/JourneyControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

// *********** USER ROUTES ********************
router.route("/users/register").post(registerUser);
router.route("/users/login").post(loginUser);
router.route("/users/logout").get(authMiddleware, logoutUser);
router.route("/users/getuser").get(authMiddleware, getuser);
router.route("/users/sendotp").get(authMiddleware, sendOtp);
router.route("/users/verify").patch(authMiddleware, verifyUser);
router.route("/users/reset").patch(authMiddleware, resetPassword);
router.route("/users/update").patch(authMiddleware, updateUser);
router.route("/users/delete").delete(authMiddleware, deleteUser);
router.route("/users/follow/:id").put(authMiddleware, followUser);
router.route("/users/unfollow/:id").delete(authMiddleware, unfollowUser);
router.route("/users/profile/:id").get(getUserProfile);

// *********** USER ROUTES ********************
router.route("/posts/create").post(authMiddleware, createPost);
router.route("/posts/update").post(authMiddleware, updatePost);
router.route("/posts/delete").post(authMiddleware, deletePost);

export { router };
