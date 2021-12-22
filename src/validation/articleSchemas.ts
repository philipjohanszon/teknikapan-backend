import Joi from "joi";

const createArticleSchema = Joi.object({
    title: Joi.string().min(3).max(40).required(),
    content: Joi.string().min(3).required(),
    preview: Joi.string().min(3).required(),
    categoryId: Joi.string().required(),
    authorId: Joi.string().required(),
    imageId: Joi.string().required(),
});

const updateArticleSchema = Joi.object({
    title: Joi.string().min(3).max(40).required(),
    content: Joi.string().min(3).required(),
    preview: Joi.string().min(3).required(),
    published: Joi.boolean().required(),
    categoryId: Joi.string().required(),
    authorId: Joi.string().required(),
    imageId: Joi.string().required(),
});

export { createArticleSchema, updateArticleSchema };