const Joi = require("joi");

module.exports = {
  registerSchema: Joi.object({
    username: Joi.string().min(5).required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    avatar: Joi.string(),
  }),
  createNewsSchema: Joi.object({
    title: Joi.string().min(5).trim().required(),
    image: Joi.string(),
    imageDescription: Joi.string().min(5).required(),
    content: Joi.string().trim().required(),
    readingTime: Joi.number(),
  }),
  editNewsSchema: Joi.object({
    title: Joi.string().min(5).trim(),
    image: Joi.string(),
    imageDescription: Joi.string().min(5),
    content: Joi.string().trim(),
    readingTime: Joi.number(),
  }),
  createCategorySchema: Joi.object({
    name: Joi.string().trim().min(4).required(),
    description: Joi.string().trim().min(5).required(),
  }),
  editCategorySchema: Joi.object({
    name: Joi.string().trim().min(4),
    description: Joi.string().trim().min(5),
  }),
  changePassword: Joi.object({
    email: Joi.string().email().required(),
    newPassword: Joi.string().min(8).required(),
    repeatPassword: Joi.string().min(8).required(),
  }),
};
