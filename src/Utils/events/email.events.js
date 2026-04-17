import { EventEmitter as eventEmitter } from "node:events";
import { sendEmail, emailSubjects } from "../email/email.utils.js";

import { template } from "../email/generateHTML.js";

const EventEmitter = eventEmitter;

export const emailEvent = new EventEmitter();
emailEvent.on("sendEmail", async (data) => {
  await sendEmail({
    to: data.to,
    subject: emailSubjects.confirmEmail,
    html: template(data.otp, data.firstName, emailSubjects.confirmEmail),
  }).catch((err) => {
    console.log("Error sending email:", err);
  });
});

emailEvent.on("forgotPassword", async (data) => {
  await sendEmail({
    to: data.to,
    subject: emailSubjects.resetPassword,
    html: template(data.otp, data.firstName, emailSubjects.resetPassword),
  }).catch((err) => {
    console.log("Error sending reset password:", err);
  });
});
