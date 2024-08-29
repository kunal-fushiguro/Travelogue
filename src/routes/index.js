import { Router } from "express";
import {
  getuser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/UserControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

// *********** USER ROUTES ********************
router.route("/users/register").post(registerUser);
router.route("/users/login").post(loginUser);
router.route("/users/logout").get(authMiddleware, logoutUser);
router.route("/users/getuser").get(authMiddleware, getuser);
export { router };
