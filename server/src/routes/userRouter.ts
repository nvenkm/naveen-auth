import express from "express";
import {
    loginUser,
    registerUser,
    verifyUser,
} from "../controller/userController";
const userRouter = express.Router();

export default userRouter;

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

userRouter.post("/verify", verifyUser);
