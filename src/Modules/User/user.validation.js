import joi from "joi";
import { fileValidation } from "../../Utils/multer/local.multer.js";
import { generalFields } from "../../Middlewares/validation.middleware.js";

export const updateProfilePictureSchema = {
  file: joi.object({
    fieldname: generalFields.file.fieldname.valid("attachments").required(),
    originalname: generalFields.file.originalname.required(),
    mimetype: generalFields.file.mimetype.valid(...fileValidation.images).required(),
    size: generalFields.file.size.max(5 * 1024 * 1024).required(),
    path: generalFields.file.path.required(),
    destination: generalFields.file.destination.required(),
    filename: generalFields.file.filename.required(),
    encoding: generalFields.file.encoding.required(),
    finalPath: generalFields.file.finalPath.required(),
  })
    .required()
    .messages({
      "object.base": "File is required",
    }),
};

export const coverImagesValidationSchema = {
  file: joi.array()
    .items(
      joi.object({
        fieldname: generalFields.file.fieldname.valid("attachments").required(),
        originalname: generalFields.file.originalname.required(),
        mimetype: joi.string().valid(...fileValidation.images).required(),
        size: joi.number().positive().required(),
      })
    )
    .min(1)
    .max(5)
    .required()
    .messages({
      "object.base": "File is required",
    }),
};


export const updatePasswordSchema = {
  body: joi.object({
    oldPassword: joi.string().required(),
    newPassword: joi.string().min(8).required(),
    confirmPassword: joi.string().valid(joi.ref("newPassword")).required(),
  }),
}



export const freezeAccountSchema = {
  params: joi.object({
    userId: generalFields.id,
  }),
};


export const restoreAccountSchema = {
  params: joi.object({
    userId: generalFields.id,
  }),
};

export const hardDeleteUserSchema = {
  params: joi.object({
    userId: generalFields.id,
  }),
};
