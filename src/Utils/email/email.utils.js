import nodemailer from "nodemailer";
import { USER_EMAIL, USER_PASSWORD } from "../../../config/config.service.js";

export const sendEmail = async ({
  to = "",
  subject = "",
  text = "",
  html = "",
  attachments = [],
  cc = "",
  bcc = "",
} = {}) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: USER_EMAIL,
        pass: USER_PASSWORD,
      },
    });

    try {
      const info = await transporter.sendMail({
        from: `"Example Team" <${USER_EMAIL}>`,
        to,
        subject,
        text,
        html,
        attachments,
        cc,
        bcc,
      });

      console.log("Message sent: %s", info.messageId);
    } catch (err) {
      console.error("Error while sending mail:", err);
    }
  } catch (error) {
    console.error("Error in sendEmail function:", error);
  }
};

export const emailSubjects = {
  confirmEmail: "Please confirm your email",
  resetPassword: "Password Reset Request",
  welcome: "Welcome to Our Service",
  contactUs: "New Contact Us Message",
};