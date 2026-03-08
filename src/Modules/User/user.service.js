import { decrypt } from "../../Utils/Security/encryption.security.js";
import { successResponse } from "../../Utils/Response/success.response.js";
import { findByIdAndUpdate } from "../../DB/database.repository.js";

export const getProfile = async (req, res) => {
  req.user.phone = await decrypt(req.user.phone);
  
  return successResponse(res, 200, "Done", { data: req.user });
};

export const updateProfilePicture = async (req, res) => {
const user = await findByIdAndUpdate(
  UserModel,
  { _id: req.user._id },              
  { profilePicture: req.file.finalPath },
  { new: true }                        
);
  if (!user) return badRequestException("User not found");
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  return successResponse(res, 200, "Done", { data: req.file });
};