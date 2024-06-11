import { Request, Response } from "express";
import User from "../models/userModel";
import bcrypt from "bcrypt";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../utils/sendEmail";
import { AuthRequest } from "../middlewares/authMiddleware";
import axios from "axios";

const UserSchema = z.object({
  fullName: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must contain at least 6 characters"),
});

const SigninSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must contain at least 6 characters"),
});

const generateToken = (payload: any, expiry: string, secret: string) => {
  return jwt.sign({ payload }, secret, {
    expiresIn: expiry,
  });
};

async function registerUser(req: Request, res: Response) {
  try {
    const { fullName, email, password, recaptchaToken } = req.body;

    const recaptchaResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${recaptchaToken}`
    );

    if (!recaptchaResponse.data.success) {
      return res.status(400).json({
        message: "Captcha verification failed",
        success: false,
      });
    }
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
      const token = generateToken(
        existingUser._id,
        process.env.ACCESS_TOKEN_EXPIRY!,
        process.env.JWT_SECRET!
      );
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
    const token = generateToken(
      savedUser._id,
      process.env.ACCESS_TOKEN_EXPIRY!,
      process.env.JWT_SECRET!
    );

    const { success } = await sendVerificationEmail(email, fullName, token);

    if (!success) {
      return res.status(500).json({
        message: "Failed to send verification email",
        success: false,
      });
    }

    res.json({
      message: "User registered, please check your email for verification",
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
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

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
  const { email, password, recaptchaToken } = req.body;

  const recaptchaResponse = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${recaptchaToken}`
  );

  if (!recaptchaResponse.data.success) {
    return res.status(400).json({
      message: "Captcha verification failed",
      success: false,
    });
  }

  const validate = SigninSchema.safeParse({ email, password });
  if (!validate.success) {
    return res.status(400).json({
      message: validate.error.issues[0].message,
      success: false,
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "User does not exist",
      success: false,
    });
  }
  if (!user.isVerified) {
    return res.status(400).json({
      message: "Please verify your email first",
      sucess: false,
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({
      message: "Invalid credentials",
      success: false,
    });
  }

  const responseUser = {
    _id: user._id,
    email: user.email,
    fullName: user.fullName,
  };

  const accessToken = generateToken(
    responseUser,
    process.env.ACCESS_TOKEN_EXPIRY!,
    process.env.JWT_SECRET!
  );
  const refreshToken = generateToken(
    user._id,
    process.env.REFRESH_TOKEN_EXPIRY!,
    process.env.REFRESH_TOKEN_SECRET!
  );

  user.refreshToken = refreshToken;

  await user.save();

  res
    .status(200)
    .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
    .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
    .json({
      success: true,
      user: responseUser,
      message: "User logged in successfully",
      accessToken,
    });
}

async function logoutUser(req: AuthRequest, res: Response) {
  try {
    User.findByIdAndUpdate(
      req.user?._id,
      {
        refreshToken: undefined,
      },
      { new: true }
    );

    res
      .status(200)
      .clearCookie("refreshToken")
      .clearCookie("accessToken")
      .json({
        success: true,
        message: "User logged out successfully",
      });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}

async function refresh(req: AuthRequest, res: Response) {
  try {
    const recievedToken = req.cookies.refreshToken;

    if (!recievedToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(
      recievedToken,
      process.env.REFRESH_TOKEN_SECRET!
    );
    if (!decoded || typeof decoded === "string") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    } else {
      const _id = decoded.payload;

      const user = await User.findById(_id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (recievedToken !== user.refreshToken) {
        return res.status(401).json({
          success: false,
          message: "Refresh token is invalid",
        });

        //generate new tokens
      }
      const newAccessToken = generateToken(
        user,
        process.env.ACCESS_TOKEN_EXPIRY!,
        process.env.JWT_SECRET!
      );

      const newRefreshToken = generateToken(
        user._id,
        process.env.REFRESH_TOKEN_EXPIRY!,
        process.env.REFRESH_TOKEN_SECRET!
      );
      user.refreshToken = newRefreshToken;
      await user.save();

      res
        .status(200)
        .cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: true,
        })
        .cookie("accessToken", newAccessToken, { httpOnly: true, secure: true })
        .json({
          success: true,
          message: "Refreshed successfully",
          newAccessToken,
        });
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export { loginUser, logoutUser, verifyUser, registerUser, refresh };
