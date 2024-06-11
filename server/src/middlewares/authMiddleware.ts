import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { userInterface } from "../models/userModel";

export interface AuthRequest extends Request {
  user?: userInterface;
}

export const isAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    console.log(decoded);

    if (!decoded || typeof decoded === "string") {
      return res
        .status(401)
        .json({ success: false, message: "Invalid ttoken" });
    }

    const user = await User.findById(decoded.payload._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      return res.status(404).json({ success: false, message: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    // Handle error
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Invalid Access token" });
  }
};
