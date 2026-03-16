import { Router } from "express";
import * as userServices from "./user.service.js";
import {
  authantication,
  authorization,
} from "../../Middlewares/auth.middleware.js";
import { RoleEnum, tokenTypeEnum } from "../../Utils/enums/user.enum.js";
import { fileValidation, localFileUpload } from "../../Utils/multer/local.multer.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import { coverImagesValidationSchema, updateProfilePictureSchema } from "./user.validation.js";
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
  localFileUpload({ customPath: "User" , validation: [...fileValidation.images]}).single("attachments"),
  validation(updateProfilePictureSchema),
  userServices.updateProfilePicture,
);




router.patch(
  "/update-cover-picture",
    authantication({ tokenTypeEnum: tokenTypeEnum.Access }),
  authorization({ accessRoles: [RoleEnum.Admin] }),
  localFileUpload({ customPath: "User" , validation: [...fileValidation.images]}).array("attachments" , 5),
  validation(coverImagesValidationSchema),
  userServices.updateCoverPicture,
);
export default router;
