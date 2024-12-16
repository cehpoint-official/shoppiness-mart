import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: {
                user: process.env.nodemailer_user,
                pass: process.env.nodemailer_pass
            }
        });
        let info = await transporter.sendMail({
            from: process.env.nodemailer_user,
            to: email,
            subject: title,
            html: body,
        });
        return info;
    } catch (error) {
        console.log(error.message);
        return error;
    }
};
export default mailSender;