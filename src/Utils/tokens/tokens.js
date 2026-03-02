import jwt from "jsonwebtoken";
import {
  Access_EXPIRATION,
  Refresh_EXPIRATION,
  Token_Access_Admin_Key,
  Token_Access_User_Key,
  Token_Refresh_Admin_Key,
  Token_Refresh_User_Key,
} from "../../../config/config.service.js";
import { RoleEnum, signatureEnum } from "../enums/user.enum.js";

// توليد التوكن (Access أو Refresh حسب الـ secretkey والـ options)
export const generateToken = ({
  payload,
  secretkey = Token_Access_User_Key,
  options = {},
}) => {
  return jwt.sign(payload, secretkey, {
    expiresIn: Access_EXPIRATION,
    ...options,
  });
};

// التحقق من التوكن
export const verifyToken = ({
  token,
  tokenSecretKey = Token_Access_User_Key,
}) => {
  return jwt.verify(token, tokenSecretKey);
};

// جلب الـ signatures حسب نوع المستخدم (User/Admin)
export const getsignature = ({
  signatureLevel = signatureEnum.User,
}) => {
  let signature = {
    accessSignature: undefined,
    refreshSignature: undefined,
  };

  switch (signatureLevel) {
    case signatureEnum.Admin:
      signature.accessSignature = Token_Access_Admin_Key;
      signature.refreshSignature = Token_Refresh_Admin_Key;
      break;

    case signatureEnum.User:
      signature.accessSignature = Token_Access_User_Key;
      signature.refreshSignature = Token_Refresh_User_Key;
      break;

    default:
      signature.accessSignature = Token_Access_User_Key;
      signature.refreshSignature = Token_Refresh_User_Key;
      break;
  }

  return signature;
};

// توليد Access + Refresh Token جديدين بعد login
export const getNewLoginCredentials = async (user) => {
  // نحدد نوع الـ signature بناءً على الـ role
  const signatureLevel = user.role === RoleEnum.Admin ? signatureEnum.Admin : signatureEnum.User;
  const signature = getsignature({ signatureLevel });

  const accessToken = generateToken({
    payload: { userId: user._id },
    secretkey: signature.accessSignature,
    options: { expiresIn: Access_EXPIRATION },
  });

  const refreshTokenValue = generateToken({
    payload: { userId: user._id },
    secretkey: signature.refreshSignature,
    options: { expiresIn: Refresh_EXPIRATION },
  });

  return {
    accessToken,
    refreshToken: refreshTokenValue,
  };
};