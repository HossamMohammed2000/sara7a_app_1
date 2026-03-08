import { Router } from "express";
import * as userServices from "./user.service.js";
import {
  authantication,
  authorization,
} from "../../Middlewares/auth.middleware.js";
import { RoleEnum, tokenTypeEnum } from "../../Utils/enums/user.enum.js";
import { localFileUpload } from "../../Utils/multer/local.multer.js";
const router = Router();

router.get(
  "/",
  authantication({ tokenTypeEnum: tokenTypeEnum.Access }),
  authorization({ accessRoles: [RoleEnum.Admin] }),
  userServices.getProfile,
);
router.patch(
  "/update-profile-picture",
    authantication({ tokenTypeEnum: tokenTypeEnum.Access }),
  authorization({ accessRoles: [RoleEnum.Admin] }),
  localFileUpload({ customPath: "User" }).single("attachments"),

  userServices.updateProfilePicture,
);
export default router;
