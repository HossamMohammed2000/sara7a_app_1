import joi from "joi";
import { generalFields } from "../../Middlewares/validation.middleware.js";
import { generateOtp } from "../../Utils/generateOtp.js";

export const signupSchema = {
  body: joi.object({
    firstName: generalFields.firstName.required(),

    lastName: generalFields.lastName.required(),

    email: generalFields.email.required(),

    age: generalFields.age,

    password: generalFields.password.required(),

    confirmPassword: generalFields.confirmPassword.required(),

    phone: generalFields.phone.required(),
  }),
};

export const loginSchema = {
  body: joi.object({
   email: generalFields.email.required(),
    password: generalFields.password.required(),
  }),
};
export const confirmEmailSchema = {
  body: joi.object({
   email: generalFields.email.required(),
    otp: generalFields.otp.required(),
  }),
};

export const forgotPasswordSchema = {
  body: joi.object({
   email: generalFields.email.required(),
  }),
};

export const resetPasswordSchema = {
  body: joi.object({
   email: generalFields.email.required(),
   otp: generalFields.otp.required(),
   newPassword: generalFields.password.required(),
   confirmNewPassword: joi.ref("newPassword"),
   }),
};




