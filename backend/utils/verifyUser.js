import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return next(errorHandler(401, "Unauthorized – Token missing"));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(errorHandler(403, "Invalid or expired token"));
      }

      req.user = decoded; // contains user id and other payload
      next();
    });
  } catch (error) {
    next(errorHandler(500, "Internal server error in token verification"));
  }
};
