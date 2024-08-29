import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/envConfig/index.js";

const generateToken = async (userId) => {
  return await jwt.sign({ userid: userId }, JWT_SECRET, { expiresIn: "7d" });
};

const verifyToken = async (token) => {
  return await jwt.verify(token, JWT_SECRET);
};

export { generateToken, verifyToken };
