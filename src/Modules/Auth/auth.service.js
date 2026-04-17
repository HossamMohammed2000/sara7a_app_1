import {
  create,
  findOne,
  findById,
  updateOne,
} from "../../DB/database.repository.js";

import UserModel from "../../DB/Models/user.model.js";

import {
  badRequestException,
  notFoundException,
} from "../../Utils/Response/error.response.js";

import {
  generateHash,
  compareHash,
} from "../../Utils/Security/hash.security.js";

import { HashEnum } from "../../Utils/enums/security.enum.js";

import { successResponse } from "../../Utils/Response/success.response.js";

import {
  generateToken,
  verifyToken,
  getsignature,
  getNewLoginCredentials,
} from "../../Utils/tokens/tokens.js";

import { CLIENT_ID } from "../../../config/config.service.js";

import { signatureEnum, ProviderEnum } from "../../Utils/enums/user.enum.js";

import { OAuth2Client } from "google-auth-library";

import { revokeTokenKey } from "../../DB/redis.service.js";

import { emailEvent } from "../../Utils/events/email.events.js";

import { generateOtp } from "../../Utils/generateOTP.js";

/* ================= SIGNUP ================= */
export const signup = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  const existingUser = await findOne(UserModel, "", { email });
  if (existingUser) return badRequestException("User already exists");

  const hashedPassword = await generateHash({
    plainText: password,
    algo: HashEnum.Argon2,
  });

  const otp = generateOtp();

  console.log("🔥 SIGNUP OTP:", otp);

  const hashedOtp = await generateHash({
    plainText: otp.toString(),
    algo: HashEnum.Argon2,
  });

  const user = await create(UserModel, {
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phone,
    confirmEmailOtp: hashedOtp,
    otpExpiresAt: new Date(Date.now() + 60 * 1000),
    otpAttempts: 0,
    otpResendAt: new Date(Date.now() + 60 * 1000),
  });

  emailEvent.emit("sendEmail", {
    to: email,
    otp,
    firstName,
  });

  return successResponse(res, 201, "User created successfully", {
    data: user,
  });
};

/* ================= CONFIRM EMAIL ================= */
export const confirmEmail = async (req, res) => {
  const { email, otp } = req.body;

  const user = await findOne(UserModel, "", {
    email,
    confirmEmail: { $exists: false },
  });

  if (!user) return notFoundException("Invalid email");

  const isOTPValid = await compareHash({
    plainText: otp.toString(),
    cipherText: user.confirmEmailOtp,
    algo: HashEnum.Argon2,
  });

  if (!isOTPValid) return badRequestException("Invalid OTP");

  await updateOne(
    UserModel,
    { _id: user._id },
    {
      confirmEmail: Date.now(),
      $unset: {
        confirmEmailOtp: 1,
        otpExpiresAt: 1,
        otpAttempts: 1,
        otpResendAt: 1,
      },
    },
  );

  return successResponse(res, 200, "Email confirmed successfully");
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await findOne(UserModel, {
    email,
    confirmEmail: { $exists: true },
    freezedAt: { $exists: false },
  });

  if (!user) {
    return badRequestException("Invalid email or password");
  }

  const isPasswordValid = await compareHash({
    plainText: password,
    cipherText: user.password,
    algo: HashEnum.Argon2,
  });

  if (!isPasswordValid) {
    return badRequestException("Invalid email or password");
  }

  const credentials = await getNewLoginCredentials(user);

  return successResponse(res, 200, "User logged in successfully", {
    data: credentials,
  });
};
// ================= LOGOUT =================
export const logout = async (req, res) => {
  // Invalidate the token on the client side by not returning a new token
  return successResponse(res, 200, "User logged out successfully");
};
// logout with redis
export const logoutWithRedis = async (req, res) => {
  const { userId } = req.user;
  await revokeTokenKey({ User_Id: userId });
  return successResponse(res, 200, "User logged out successfully");
};

/* ================= REFRESH TOKEN ================= */
export const refreshAccessToken = async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) return badRequestException("Refresh token required");

  const [Bearer, token] = authorization.split(" ") || [];

  if (!Bearer || !token || Bearer !== "Bearer")
    return badRequestException("Invalid token format");

  const { refreshSignature, accessSignature } = getsignature({
    signatureLevel: signatureEnum.User,
  });

  const decodedToken = verifyToken({
    token,
    tokenSecretKey: refreshSignature,
  });

  const user = await findById(UserModel, decodedToken.userId);

  if (!user) return notFoundException("User not found");

  const accessToken = generateToken({
    payload: { userId: user._id, email: user.email },
    secretkey: accessSignature,
  });

  return successResponse(res, 200, "Access token refreshed", {
    accessToken,
  });
};

/* ================= GOOGLE LOGIN ================= */
const verifyGoogleAccount = async (idToken) => {
  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken,
    audience: CLIENT_ID,
  });

  return ticket.getPayload();
};

export const loginWithGoogle = async (req, res) => {
  const { idToken } = req.body;

  const { email, picture, given_name, family_name, email_verified } =
    await verifyGoogleAccount(idToken);

  if (!email_verified) return badRequestException("Email not verified");

  let user = await findOne(UserModel, "", { email });

  if (!user) {
    user = await create(UserModel, {
      firstName: given_name,
      lastName: family_name,
      email,
      profileImage: picture,
      provider: ProviderEnum.Google,
    });
  }

  const credentials = await getNewLoginCredentials(user);

  return successResponse(res, 200, "Google login success", {
    data: credentials,
  });
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await findOne(UserModel, "", {
    email,
    confirmEmail: { $exists: true },
  });

  if (!user) return notFoundException("User not found");

  const otp = generateOtp();

  console.log("🔥 FORGOT OTP:", otp);

  const hashedOtp = await generateHash({
    plainText: otp.toString(),
    algo: HashEnum.Argon2,
  });

  await updateOne(
    UserModel,
    { email },
    {
      forgotPasswordOtp: hashedOtp,
      forgotPasswordOtpExpiry: new Date(Date.now() + 15 * 60 * 1000),
    },
  );

  emailEvent.emit("forgotPassword", {
    to: email,
    otp,
    firstName: user.firstName,
  });

  return successResponse(res, 200, "OTP sent successfully");
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await findOne(UserModel, "", {
    email,
    forgotPasswordOtp: { $exists: true },
  });

  if (!user) return notFoundException("User not found");

  const isOTPValid = await compareHash({
    plainText: otp.toString(),
    cipherText: user.forgotPasswordOtp,
    algo: HashEnum.Argon2,
  });

  if (!isOTPValid) return badRequestException("Invalid OTP");

  const hashedPassword = await generateHash({
    plainText: newPassword,
    algo: HashEnum.Argon2,
  });

  await updateOne(
    UserModel,
    { _id: user._id },
    {
      password: hashedPassword,
      $unset: {
        forgotPasswordOtp: 1,
        forgotPasswordOtpExpiry: 1,
      },
    },
  );

  return successResponse(res, 200, "Password reset successfully");
};

/* ================= RESEND OTP ================= */
export const resendEmailOTP = async (req, res) => {
  const { email } = req.body;

  const user = await findOne(UserModel, "", {
    email,
    confirmEmail: { $exists: false },
  });

  if (!user) return notFoundException("User not found");

  const otp = generateOtp();

  console.log("🔥 RESEND OTP:", otp);

  const hashedOtp = await generateHash({
    plainText: otp.toString(),
    algo: HashEnum.Argon2,
  });

  await updateOne(
    UserModel,
    { _id: user._id },
    {
      confirmEmailOtp: hashedOtp,
      otpResendAt: new Date(Date.now() + 60 * 1000),
    },
  );

  emailEvent.emit("sendEmail", {
    to: email,
    otp,
    firstName: user.firstName,
  });

  return successResponse(res, 200, "OTP sent successfully");
};
