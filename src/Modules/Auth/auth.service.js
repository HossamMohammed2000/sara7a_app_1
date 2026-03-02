import { create, findone, findById } from "../../DB/database.repository.js";
import UserModel from "../../DB/Models/user.model.js";
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
import { generateToken, verifyToken, getsignature, getNewLoginCredentials } from "../../Utils/tokens/tokens.js";
import {
  Refresh_EXPIRATION,
} from "../../../config/config.service.js";

export const signup = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  const existingUser = await findone(UserModel, "", { email });

  if (existingUser)
    return badRequestException({ message: "User already exists" });

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

  return successResponse(res, 201, "User created successfully", { user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await findone(UserModel, "", { email });
  if (!user) return badRequestException({ message: "User not found" });

  const isPasswordValid = await compareHash({
    plainText: password,
    cipherText: user.password,
    algo: HashEnum.Argon2,
  });

  if (!isPasswordValid)
    return badRequestException({ message: "Invalid email or password" });
  const credentials = await getNewLoginCredentials(user);
 

  return successResponse(res, 200, "User logged in successfully", {
   data :{credentials}
  });
};

export const refreshAccessToken = async (req, res) => {
  try {
    const { authorization } = req.headers;
    if (!authorization)
      return badRequestException({ message: "Refresh token required" });


    const [Bearer, token] = authorization.split(" ") || [];
    if (!Bearer || !token || Bearer !== "Bearer")
      return badRequestException({ message: "Invalid token format" });

    const { refreshSignature, accessSignature } = getsignature({
      signatureLevel: signatureEnum.User,
    });

    const decodedToken = verifyToken({
      token,
      tokenSecretKey: refreshSignature,
    });

    const user = await findById(UserModel, decodedToken.userId);
    if (!user) throw notFoundException({ message: "User not found" });

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