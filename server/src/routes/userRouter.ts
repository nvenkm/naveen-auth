import express from "express";
import {
  loginUser,
  logoutUser,
  refresh,
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

userRouter.post("/refresh", refresh);
