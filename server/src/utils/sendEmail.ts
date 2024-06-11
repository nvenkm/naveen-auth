import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";

export async function sendVerificationEmail(
    email: string,
    fullName: string,
    token: string
) {
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MY_EMAIL,
                pass: process.env.APP_PASS,
            },
        });

        console.log(
            `Verify page link : ${process.env.CLIENT_URL}/verify/${fullName}`
        );
        const html = await ejs.renderFile(
            path.join(process.cwd(), "/src/views/verifyEmail.ejs"),
            {
                fullName: fullName,
                verifyLink: `${process.env.CLIENT_URL}/verify/?token=${token}`,
            }
        );

        var mailOptions = {
            from: process.env.MY_EMAIL,
            to: email,
            subject: "Your verification link",
            html: html,
        };
        await transporter.sendMail(mailOptions);

        return {
            success: true,
            message: "Verification email sent successfully!",
        };
    } catch (error) {
        console.error("Error sending verification email!", error);
        return {
            success: false,
            message: "Failed to send verification email!",
        };
    }
}
