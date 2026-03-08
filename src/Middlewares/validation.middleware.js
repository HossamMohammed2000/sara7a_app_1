import { Types } from "mongoose";
import { badRequestException } from "../Utils/Response/error.response.js";
import {
  GenderEnum,
  ProviderEnum,
  RoleEnum,
} from "../Utils/enums/user.enum.js";
import Joi from "joi";

export const generalFields = {
  firstName: Joi.string().alphanum().min(3).max(25).messages({
    "string.required": "First name is required",
    "string.min": "First name must be at least 3 characters long",
    "string.max": "First name must be at most 25 characters long",
  }),

  lastName: Joi.string().alphanum().min(3).max(25).messages({
    "string.required": "Last name is required",
  }),

  email: Joi.string()
    .email({
      minDomainSegments: 1,
      maxDomainSegments: 3,
      tlds: { allow: ["com", "net", "org"] },
    })
    .messages({
      "string.email": "Please provide a valid email address",
    }),

  age: Joi.number().positive().integer(),

  password: Joi.string().messages({
    "string.required": "Password is required",
  }),

  confirmPassword: Joi.string().valid(Joi.ref("password")).messages({
    "any.only": "Passwords do not match",
  }),

  phone: Joi.string()
    .pattern(/^01[0125][0-9]{8}$/)
    .messages({
      "string.pattern.base":
        "Phone number must be a valid Egyptian mobile number",
    }),

  id: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .messages({
      "any.invalid": "Invalid ID format",
    }),

  gender: Joi.string().valid(...Object.values(GenderEnum)),

  role: Joi.string().valid(...Object.values(RoleEnum)),

  Provider: Joi.string().valid(...Object.values(ProviderEnum)),
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
      return res.status(400).json(validationError);
    }

    next();
  };
};
