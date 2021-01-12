const Joi = require('joi')

module.exports = {
    registerSchema:Joi.object({
        username:Joi.string()
        .min(5)
        .required(),
        password:Joi.string()
        .required(),
        email:Joi.string()
        .email()
        .required(),
        avatar:Joi.string()   
    }),
    createNewsSchema:Joi.object({
        title:Joi.string()
        .min(5)
        .trim()
        .required(),
        image:Joi.string()
        .required(),
        imageDescription:Joi.string()
        .min(5)
        .required(),
        content:Joi.string()
        .trim()
        .required()

    })
}