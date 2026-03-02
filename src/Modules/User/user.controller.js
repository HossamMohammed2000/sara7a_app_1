import { Router } from "express";
import * as userServices from "./user.service.js";
import { authantication, authorization } from "../../Middlewares/auth.middleware.js";
import { RoleEnum, tokenTypeEnum } from "../../Utils/enums/user.enum.js";
const router = Router();

router.get("/",authantication({ tokenTypeEnum: tokenTypeEnum.Access }),authorization({ accessRoles: [ RoleEnum.Admin] }),userServices.getProfile);

export default router;