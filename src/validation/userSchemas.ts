import Joi from "joi";

const userUpdateSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    role: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6),

    deletedAt: Joi.date(),
});

const userCreateSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    role: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),

    deletedAt: Joi.date(),
});

export { userUpdateSchema, userCreateSchema };