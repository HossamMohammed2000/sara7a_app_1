import { Router } from "express";
import * as authServices from "./auth.service.js";
import * as authValidation from "./auth.valiadation.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import { authantication } from "../../Middlewares/auth.middleware.js";
import { tokenTypeEnum } from "../../Utils/enums/user.enum.js";

const router = Router();

// ================= SIGNUP =================
router.post(
  "/signup",
  validation(authValidation.signupSchema),
  authServices.signup,
);

// ================= CONFIRM EMAIL =================
router.patch(
  "/confirm-email",
  validation(authValidation.confirmEmailSchema),
  authServices.confirmEmail,
);

// ================= LOGIN =================
router.post(
  "/login",
  validation(authValidation.loginSchema),
  authServices.login,
);

// ================= REFRESH TOKEN =================
router.post("/refresh-token", authServices.refreshAccessToken);

// ================= GOOGLE LOGIN =================
router.post("/social-login", authServices.loginWithGoogle);

// ================= LOGOUT =================
router.post(
  "/logout",
  authantication({ tokenTypeEnum: tokenTypeEnum.Access }),
  authServices.logout,
);

// ================= LOGOUT WITH REDIS =================
router.post(
  "/logout-with-redis",
  authantication({ tokenTypeEnum: tokenTypeEnum.Access }),
  authServices.logoutWithRedis,
);

// ================= FORGOT PASSWORD =================
router.patch(
  "/forgot-password",
  validation(authValidation.forgotPasswordSchema),
  authServices.forgotPassword,
);

// ================= RESET PASSWORD =================
router.patch(
  "/reset-password",
  validation(authValidation.resetPasswordSchema),
  authServices.resetPassword,
);

// ================= RESEND OTP =================
router.post("/resend-otp", authServices.resendEmailOTP);


export default router;
