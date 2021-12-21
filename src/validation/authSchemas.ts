import Joi from "joi";

const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    firstname: Joi.string().min(1).required(),
    lastname: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});


export { loginSchema, registerSchema };