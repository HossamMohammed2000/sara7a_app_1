import joi from "joi";
import { generalFields } from "../../Middlewares/validation.middleware.js";

export const sendMessageValidation =
{params: joi.object({
    recieverId: generalFields.id.required(),
}),
body:joi.object({
    content:joi.string().min(2).max(1000).messages({
        "any.required": "Content is required",
        "string.min": "Content must be at least 2 characters long",
        "string.max": "Content must be at most 1000 characters long"
})
})}
    
