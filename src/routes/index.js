import { Router } from "express";
import {
  deleteUser,
  getuser,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  sendOtp,
  updateUser,
  verifyUser,
} from "../controllers/UserControllers.js";
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
export { router };
