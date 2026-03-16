import Joi from "joi";
import { fileValidation } from "../../Utils/multer/local.multer.js";
import { generalFields } from "../../Middlewares/validation.middleware.js";

export const updateProfilePictureSchema = {
  file: Joi.object({
    fieldname: generalFields.file.filedname.valid("attachments").required(),
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
  file: Joi.array()
    .items(
      Joi.object({
        fieldname: generalFields.file.filedname.valid("attachments").required(),
        originalname: generalFields.file.originalname.required(),
        mimetype: Joi.string().valid(...fileValidation.images).required(),
        size: Joi.number().positive().required(),
      })
    )
    .min(1)
    .max(5)
    .required()
    .messages({
      "object.base": "File is required",
    }),
};