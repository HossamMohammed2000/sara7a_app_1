import { Router } from "express";
import * as userServices from "./user.service.js";
import {
  authantication,
  authorization,
} from "../../Middlewares/auth.middleware.js";
import { RoleEnum, tokenTypeEnum } from "../../Utils/enums/user.enum.js";
import {
  fileValidation,
  localFileUpload,
} from "../../Utils/multer/local.multer.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import * as userValidation from "./user.validation.js";
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
  localFileUpload({
    customPath: "User",
    validation: [...fileValidation.images],
  }).single("attachments"),
  validation(userValidation.profilePictureValidationSchema),
  userServices.updateProfilePicture,
);

router.patch(
  "/update-cover-picture",
  authantication({ tokenTypeEnum: tokenTypeEnum.Access }),
  authorization({ accessRoles: [RoleEnum.Admin] }),
  localFileUpload({
    customPath: "User",
    validation: [...fileValidation.images],
  }).array("attachments", 5),
  validation(userValidation.coverPictureValidationSchema),
  userServices.updateCoverPicture,
);

router.patch(
  "/update-password",
  userServices.updatePassword,
  authantication({ tokenTypeEnum: tokenTypeEnum.Access }),
  authorization({ accessRoles: [RoleEnum.Admin] }),
  validation(userValidation.updatePasswordSchema),
  userServices.updatePassword,
);

router.delete(
  "{/:userId}/freeze-account",
  authantication({ tokenTypeEnum: tokenTypeEnum.Access }),
  authorization({ accessRoles: [RoleEnum.Admin] }),
  validation(userValidation.freezeAccountSchema),
  userServices.freezeAccount,
);

// REstore user
router.patch(
  "/:userId/restore-account",
  authantication({ tokenTypeEnum: tokenTypeEnum.Access }),
  authorization({ accessRoles: [RoleEnum.Admin] }),
  validation(userValidation.restoreAccountSchema),
  userServices.restoreAccount,
);


// hard delete user
router.delete(
  "/:userId/hard-delete",
  authantication({ tokenTypeEnum: tokenTypeEnum.Access }),
  authorization({ accessRoles: [RoleEnum.Admin] }),
  validation(userValidation.hardDeleteUserSchema),
  userServices.hardDeleteAccount,
);

export default router;
