import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface userInterface {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  refreshToken?: string;
  isVerified: boolean;
}

const userSchema = new mongoose.Schema<userInterface>(
  {
    fullName: { type: String, required: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshToken: { type: String },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<userInterface>("User", userSchema);

export default User;
