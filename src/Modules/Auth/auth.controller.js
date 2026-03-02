import { Router } from "express";
import * as authServices from "./auth.service.js";

const router = Router();
router.post("/signup", authServices.signup);
router.post("/login", authServices.login);
router.post("/refresh-token", authServices.refreshAccessToken);



export default router; 