import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config("./config/config.env");

const sendEmail = async (options) => {
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  let message = {
    from: process.env.FROM_EMAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  const info = await transport.sendMail(message);
};
export default sendEmail;
