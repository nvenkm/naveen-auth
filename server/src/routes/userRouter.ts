import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  verifyUser,
} from "../controller/userController";
import { isAuth } from "../middlewares/authMiddleware";
const userRouter = express.Router();

export default userRouter;

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

userRouter.post("/verify", verifyUser);

userRouter.post("/logout", isAuth, logoutUser);
