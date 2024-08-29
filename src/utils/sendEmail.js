import { createTransport } from "nodemailer";
import { NODEMAILER_PASSWORD } from "../config/envConfig/index.js";

const Auth = createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: "natwarlaluzumaki@gmail.com",
    pass: NODEMAILER_PASSWORD,
  },
});

const sendEmail = async (otp, username, email) => {
  try {
    const mailOptions = {
      from: "natwarlaluzumaki@gmail.com",
      to: email,
      subject: "Your 5-Minute OTP for Secure Verification",
      html: `<div style="font-family: Arial, sans-serif; text-align: center; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
    <h2 style="color: #333;">Hello, ${username}</h2>
    <p style="font-size: 18px; color: #555;">Your One-Time Password (OTP) is:</p>
    <p style="font-size: 32px; font-weight: bold; color: #4CAF50; margin: 20px 0;">${otp}</p>
    <p style="font-size: 16px; color: #555;">This OTP is valid for 5 minutes. Please do not share this code with anyone.</p>
    <p style="font-size: 16px; color: #555;">If you did not request this, please ignore this email.</p>
    <p style="font-size: 16px; color: #555;">Thank you,<br/>Your Company Team</p>
  </div>`,
    };
    await Auth.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export { sendEmail };
