import {
  create,
  findone,
  findById,
  updateOne,
} from "../../DB/database.repository.js";
import UserModel from "../../DB/Models/user.model.js";
import TokenModel from "../../DB/Models/token.model.js";
import {
  badRequestException,
  notFoundException,
} from "../../Utils/Response/error.response.js";
import {
  generateHash,
  compareHash,
} from "../../Utils/Security/hash.security.js";
import { HashEnum } from "../../Utils/enums/security.enum.js";
import { successResponse } from "../../Utils/Response/success.response.js";
import {
  generateToken,
  verifyToken,
  getsignature,
  getNewLoginCredentials,
} from "../../Utils/tokens/tokens.js";
import { CLIENT_ID, Refresh_EXPIRATION } from "../../../config/config.service.js";
import { signatureEnum, LogoutTypeEnum, ProviderEnum } from "../../Utils/enums/user.enum.js";
import { signupSchema } from "../Auth/auth.valiadation.js";
import {OAuth2Client} from 'google-auth-library';
export const signup = async (req, res) => {
  const validationResult = signupSchema.validate(req.body, {
    abortEarly: false,
  });

  if (validationResult.error) {
    return badRequestException(
      validationResult.error.details.map((d) => d.message).join(", "),
    );
  }

  const { firstName, lastName, email, password, phone } = req.body;

  const existingUser = await findone(UserModel, "", { email });

  if (existingUser) return badRequestException("User already exists");

  const hashedPassword = await generateHash({
    plainText: password,
    algo: HashEnum.Argon2,
  });

  const user = await create(UserModel, {
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phone,
  });

  return successResponse(res, 201, "User created successfully", { data: user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await findone(UserModel, "", { email });
  if (!user) return badRequestException("Invalid email or password");

  const isPasswordValid = await compareHash({
    plainText: password,
    cipherText: user.password,
    algo: HashEnum.Argon2,
  });

  if (!isPasswordValid) return badRequestException("Invalid email or password");

  const credentials = await getNewLoginCredentials(user);

  return successResponse(res, 200, "User logged in successfully", {
    data: { credentials },
  });
};

export const refreshAccessToken = async (req, res) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) return badRequestException("Refresh token required");

    const [Bearer, token] = authorization.split(" ") || [];
    if (!Bearer || !token || Bearer !== "Bearer")
      return badRequestException("Invalid token format");

    const { refreshSignature, accessSignature } = getsignature({
      signatureLevel: signatureEnum.User,
    });

    const decodedToken = verifyToken({
      token,
      tokenSecretKey: refreshSignature,
    });

    const user = await findById(UserModel, decodedToken.userId);
    if (!user) throw notFoundException("User not found");

    const accessToken = generateToken({
      payload: { userId: user._id, email: user.email },
      secretkey: accessSignature,
    });

    return successResponse(res, 200, "Access token refreshed successfully", {
      accessToken,
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};
 async function verifyGoogleAccount(idToken) {
  const client = new OAuth2Client();
const ticket = await client.verifyIdToken({
    idToken,
    audience:CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;

}

export const loginWithGoogle = async (req, res) => {
 const {idToken} = req.body;
 const {email , picture , given_name , family_name , email_verified , } = await verifyGoogleAccount(idToken)
    if(!email_verified) throw badRequestException("Email not verified by Google");
    const user = await findone(UserModel, { email });
    if(user){
      if(user.provider===ProviderEnum.Google){
       const credentials = await getNewLoginCredentials(user);
       return successResponse(res, 200, "User logged in successfully", {
        data: { credentials },
      });
      }
    }
// create new user
    const newUser = await create(UserModel, [{
      firstName:given_name,
      lastName:family_name,
      email,
      profileImage:picture,
      provider:ProviderEnum.Google,
    }]);
    
    const credentials = await getNewLoginCredentials(newUser);
   

    return successResponse(res, 201, "User logged in successfully", {
      data: { credentials },
    });
  
  }
;




export const logout = async (req, res) => {
  const { flag } = req.body;
  let statusCode = 200;

  switch (flag) {
    case LogoutTypeEnum.logout:
      await create(TokenModel, {
        jti: req.tokenInfo.jti,
        userId: req.user._id,
        expiresIn: new Date(Date.now() + req.tokenInfo.exp * 1000),
      });
      statusCode = 201;
      break;
    case LogoutTypeEnum.logoutFromAll:
      await updateOne(
        UserModel,
        { _id: req.user._id },
        { changeCredentialsTime: new Date() },
      );
      statusCode = 200;
      break;
    default:
      return badRequestException("Invalid logout type");
  }

  return successResponse(res, statusCode, "Logged out successfully");
};
