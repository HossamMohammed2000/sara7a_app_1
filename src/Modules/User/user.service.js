import { decrypt } from "../../Utils/Security/encryption.security.js";
import { successResponse } from "../../Utils/Response/success.response.js";
import { deleteOne, findByIdAndUpdate, updateOne } from "../../DB/database.repository.js";
import { update } from "../../DB/redis.service.js";
import { badRequestException, forbiddenException, notFoundException } from "../../Utils/Response/error.response.js";
import { RoleEnum } from "../../Utils/enums/user.enum.js";

export const getProfile = async (req, res) => {
  req.user.phone = await decrypt(req.user.phone);

  return successResponse(res, 200, "Done", { data: req.user });
};

export const updateProfilePicture = async (req, res) => {
  const user = await findByIdAndUpdate(
    UserModel,
    { _id: req.user._id },
    { profilePicture: req.file.finalPath },
    { new: true },
  );
  if (!user) return badRequestException("User not found");
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  return successResponse(res, 200, "Done", { data: req.file });
};

export const updateCoverPicture = async (req, res) => {
  const user = await findByIdAndUpdate(
    UserModel,
    { _id: req.user._id },
    { coverImages: req.files?.map((file) => file.finalPath) },
    { new: true },
  );
  if (!user) return badRequestException("User not found");
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  return successResponse(res, 200, "Done", { data: req.file });
};


export const updatePassword = async (req, res) => {
 const{oldPassword , newPassword , confirmPassword} = req.body;
  const user = await findById(
    UserModel,
    { _id: req.user._id },
    { password: req.body.password },
    { new: true },
  );
  const isValidPassword = await compareHash({
    plainText: oldPassword,
    hash: user.password,
    algo: HashEnum.Argon2,
  });
  // if (!user) throw badRequestException("User not found");
  if (!isValidPassword) throw badRequestException("Invalid  password");
const hashedPassword = await generateHash({
  plainText: newPassword,
  algo: HashEnum.Argon2,
});

await updateOne(
  UserModel,
  { _id: req.user._id },
  { password: hashedPassword },
);


   return successResponse(res, 200, "password updated successfully", { data: req.file });
};



export const freezeAccount = async (req, res) => {
  const { userId } = req.params;
  const updateUser = await findByIdAndUpdate(
    UserModel,
    { _id: userId || req.user._id ,   freezedAt:{$exists: false} },
 { freezedAt: new Date() , freezedBy: req.user._id },
   { restoredAt: true, restoredBy: true },
  
  );
  if (userId&&req.user.role!==RoleEnum.Admin) throw forbiddenException("You are not authorized to freeze this account");

  return successResponse(res, 200, "Account frozen", { data: updateUser });
};


export const restoreAccount = async (req, res) => {
  const { userId } = req.params;
  const updateUser = await findByIdAndUpdate(
    UserModel,
   {restoredAt:Date.now() , restoredBy: req.user._id} ,
    { $unset: { freezedAt: true, freezedBy:true  }, restoredAt: new Date(), restoredBy: req.user._id },
  );


  return successResponse(res, 200, "Account restored", { data: updateUser });
};


export const hardDeleteAccount = async (req, res) => {
  const { userId } = req.params;
  const deletedUser = await deleteOne(
    UserModel,
    { _id: userId  },
  );
 
  user.deletedCount?
   successResponse(res, 200, "Account deleted") :  notFoundException("User not found");
}