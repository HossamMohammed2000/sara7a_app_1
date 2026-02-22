import { create, findone } from "../../DB/database.repository.js";
import UserModel from "../../DB/Models/user.model.js";
import { badRequestException } from "../../Utils/Response/error.response.js";
import { generateHash, compareHash } from "../../Utils/Security/hash.security.js";
import { HashEnum } from "../../Utils/enums/security.enum.js";
import { successResponse } from "../../Utils/Response/success.response.js";

export const signup = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  const existingUser = await findone(UserModel, "", { email });
  console.log("existingUser:", existingUser);

  if (existingUser) return successResponse(res, 200, "User already exists", { user: existingUser });

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

  if (!isPasswordValid) return badRequestException({ message: "Invalid email or password" });

  return successResponse(res, 200, "User logged in successfully", { user });
};