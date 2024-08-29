import { verifyToken } from "../utils/jwtToken.js";
import { ApiResponse } from "../utils/ApiResponse.js";

async function authMiddleware(req, res, next) {
  try {
    const cookie = req.cookies;
    const { userid } = await verifyToken(cookie.userToken);
    req.userid = userid;
    next();
  } catch (error) {
    ApiResponse.handleError(res, error);
  }
}

export { authMiddleware };
