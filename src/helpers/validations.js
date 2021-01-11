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
        
    })
}