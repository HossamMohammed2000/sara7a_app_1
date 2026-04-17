import { tokenTypeEnum, signatureEnum } from "../Utils/enums/user.enum.js";
import {
  badRequestException,
  forbiddenException,
  notFoundException,
  unauthorizedException,
} from "../Utils/Response/error.response.js";
import { findById } from "../DB/database.repository.js";
import { getsignature, verifyToken } from "../Utils/tokens/tokens.js";
import UserModel from "../DB/Models/user.model.js";

export const decodedToken = async ({
  authorization,
  tokenType = tokenTypeEnum.Access,
}) => {
  if (!authorization)
    throw badRequestException({ message: "Authorization header required" });

  const [Bearer, token] = authorization.split(" ") || [];
  if (!Bearer || !token || Bearer !== "Bearer")
    throw badRequestException({ message: "Invalid token format" });

 
  
  const signature = getsignature({ signatureLevel: signatureEnum.User });

  const decoded = verifyToken({
    token,
    tokenSecretKey:
      tokenType === tokenTypeEnum.Access
        ? signature.accessSignature
        : signature.refreshSignature,
  });


  const isRevoked = await get(revokeTokenKey({User_Id:decoded.userId , jti:decoded.jti}));
  if (isRevoked) {
    throw unauthorizedException({ message: "Token has been revoked" });
  } 
  const user = await findById(UserModel, decoded.userId);
  if (!user) throw notFoundException({ message: "User not found" });
if (user.changeCredentialsTime?.getTime() || 0 > decoded.iat * 1000) {
    throw unauthorizedException({ message: "Token is no longer valid" });
  }
  return { user, decoded };
};

export const authantication = (tokenType = tokenTypeEnum.Access) => {
  return async (req, res, next) => {
    try {
      const { user, decoded } = await decodedToken({
        authorization: req.headers.authorization,
        tokenType,
      });

      req.user = user;
      req.tokenInfo = decoded;

      return next();
    } catch (err) {
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
  };
};

export const authorization = ({ accessRoles = [] }) => {
  return async (req, res, next) => {
    if (!accessRoles.includes(req.user.role)) {
      throw forbiddenException({
        message: "You don't have permission to access this resource",
      });
    }
    return next();
  };
};
