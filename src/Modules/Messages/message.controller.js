import { Router } from "express";
import * as messageService from "./message.service.js";
import * as messageValidation from "./message.validation.js";
import { successResponse } from "../../Utils/Response/success.response.js";

import { validation } from "../../Middlewares/validation.middleware.js";
import {
  authantication,
  authorization,
} from "../../Middlewares/auth.middleware.js";
import { RoleEnum, tokenTypeEnum } from "../../Utils/enums/user.enum.js";

const router = Router();

router.post(
  "/send-message/:recieverId",
  validation(messageValidation.sendMessageValidation),
  async (req, res, next) => {
    try {
      const { recieverId } = req.params;
      const { content } = req.body;

      const senderId = req.user._id;

      const message = await messageService.sendMessage({
        content,
        recieverId,
        senderId,
      });

      return successResponse(res, 200, "Message sent successfully", {
        data: message,
      });
    } catch (error) {
      return next(error);
    }
  },
);

// admin
router.get(
  "/get-messages-admin{/:receiverId}",
  authantication({ tokenType: tokenTypeEnum.Access }),
  authorization({ accessRoles: [RoleEnum.Admin] }),
   messageService.getMessages
);

// user
router.get(
  "/get-messages",
  authantication({ tokenType: tokenTypeEnum.Access }),
  authorization({ accessRoles: [RoleEnum.User] }),
   messageService.getMessages
);
export default router;
