import { Types } from "mongoose";
import joi from "joi";

import {
  GenderEnum,
  ProviderEnum,
  RoleEnum,
} from "../Utils/enums/user.enum.js";

export const generalFields = {
  firstName: joi.string().alphanum().min(3).max(25).required().messages({
    "string.empty": "First name is required",
    "string.min": "First name must be at least 3 characters long",
    "string.max": "First name must be at most 25 characters long",
  }),

  lastName: joi.string().alphanum().min(3).max(25).required().messages({
    "string.empty": "Last name is required",
  }),

  email: joi
    .string()
    .email({
      minDomainSegments: 1,
      maxDomainSegments: 3,
      tlds: { allow: ["com", "net", "org"] },
    })
    .required()
    .messages({
      "string.email": "Please provide a valid email address",
      "string.empty": "Email is required",
    }),

  age: joi.number().positive().integer(),

  password: joi.string().required().messages({
    "string.empty": "Password is required",
  }),

  confirmPassword: joi.string().valid(joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
    "string.empty": "Confirm password is required",
  }),

  phone: joi
    .string()
    .pattern(/^01[0125][0-9]{8}$/)
    .messages({
      "string.pattern.base":
        "Phone number must be a valid Egyptian mobile number",
    }),

  id: joi
    .string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .messages({
      "any.invalid": "Invalid ID format",
    }),

  gender: joi.string().valid(...Object.values(GenderEnum)),

  role: joi.string().valid(...Object.values(RoleEnum)),

  provider: joi.string().valid(...Object.values(ProviderEnum)),

  
  file: {
    fieldname: joi.string(),
    originalname: joi.string(),
    encoding: joi.string(),
    mimetype: joi.string(),
    size: joi.number().positive(),
    destination: joi.string(),
    filename: joi.string(),
    path: joi.string(),
    finalPath: joi.string(),
  },

  otp: joi
    .string()
    .pattern(/^[0-9]{6}$/)
    .length(6)
    .messages({
      "string.length": "OTP must be exactly 6 digits",
      "string.pattern.base": "OTP must contain only digits",
    }),
};

export const validation = (schema) => {
  return (req, res, next) => {
    const validationError = [];

    for (const key of Object.keys(schema)) {
      const validationResult = schema[key].validate(req[key], {
        abortEarly: false,
      });

      if (validationResult.error) {
        validationError.push({
          key,
          details: validationResult.error.details,
        });
      }
    }

    if (validationError.length) {
      return res.status(400).json({
        message: "Validation Error",
        errors: validationError,
      });
    }

     return next();
  };
};
