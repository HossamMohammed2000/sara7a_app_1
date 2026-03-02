
import { decrypt } from "../../Utils/Security/encryption.security.js";
import { successResponse } from "../../Utils/Response/success.response.js";

export const getProfile = async (req, res) => {
  req.user.phone =await  decrypt(req.user.phone);
return successResponse(res, 200, "Done", data =req.user);
  }
  

