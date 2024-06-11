import { Request, Response } from "express";
import User from "../models/userModel";
import bcrypt from "bcrypt";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../utils/sendEmail";

const UserSchema = z.object({
    fullName: z.string().min(2, "Username must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must contain at least 6 characters"),
});

const generateToken = (payload: any, expiry: string) => {
    return jwt.sign({ payload }, process.env.JWT_SECRET!, {
        expiresIn: expiry,
    });
};

async function registerUser(req: Request, res: Response) {
    try {
        const { fullName, email, password } = req.body;

        //validate user input
        const result = UserSchema.safeParse({ fullName, email, password });

        if (!result.success) {
            return res.status(400).json({
                message: result.error.issues[0].message,
                success: false,
            });
        }

        const existingUser = await User.findOne({ email });

        //if user already exists
        if (existingUser && existingUser.isVerified) {
            return res
                .status(400)
                .json({ message: "User already exists", success: false });
        }

        //if user exists but not verified
        if (existingUser && !existingUser.isVerified) {
            //update the password
            existingUser.password = await bcrypt.hash(password, 10);
            await existingUser.save();

            //generate new token
            const token = generateToken(existingUser._id, "1h");
            const { success } = await sendVerificationEmail(
                existingUser.email,
                existingUser.fullName,
                token
            );
            if (!success) {
                return res.status(500).json({
                    message: "Failed to send verification email",
                    success: false,
                });
            }

            return res.json({
                success: true,
                message: "Re-sent verification email",
            });
        }

        const hash = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullName,
            email,
            password: hash,
        });

        const savedUser = await newUser.save();

        //temporary token for email verification
        const token = generateToken(savedUser._id, "1h");

        const { success } = await sendVerificationEmail(email, fullName, token);

        if (!success) {
            return res.status(500).json({
                message: "Failed to send verification email",
                success: false,
            });
        }

        res.json({
            message:
                "User registered, please check your email for verification",
            success: true,
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}

async function verifyUser(req: Request, res: Response) {
    try {
        const { token } = req.body;

        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        if (!decoded) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid token" });
        }
        console.log("Decoded:", decoded);

        const { payload } = decoded as { payload: string };
        const user = await User.findById(payload);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        if (user.isVerified) {
            return res
                .status(400)
                .json({ success: false, message: "User already verified" });
        }

        user.isVerified = true;
        await user.save();
        return res
            .status(200)
            .json({ success: true, message: "User verified successfully" });
    } catch (error) {
        console.error("Error verifying user:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}

async function loginUser(req: Request, res: Response) {
    const { email, password } = req.body;
    res.json({ email, password });
}

export { registerUser, loginUser, verifyUser };
