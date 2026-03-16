import { Router } from "express";
import * as authServices from "./auth.service.js";
import * as authValidation from "./auth.valiadation.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import { localFileUpload } from "../../Utils/multer/local.multer.js";
import { authantication } from "../../Middlewares/auth.middleware.js";
import { tokenTypeEnum } from "../../Utils/enums/user.enum.js";

const router = Router();

router.post(
  "/signup",

  validation(authValidation.signupSchema),
  authServices.signup
);

router.post(
  "/login",
  validation(authValidation.loginSchema),
  authServices.login
);

router.post("/refresh-token", authServices.refreshAccessToken);
router.post("/social-login", authServices.loginWithGoogle);

router.post("/logout",authantication({tokenTypeEnum:tokenTypeEnum.Access}),authServices.logout);

export default router;