import mongoose from "mongoose";

//db connection

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URL!);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
