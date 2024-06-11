import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./db/db";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

//routers
import userRouter from "./routes/userRouter";

const port = process.env.PORT || 3000;
const app: Express = express();

//db
connectDB();

//middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes
app.use("/api/v1/user", userRouter);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
