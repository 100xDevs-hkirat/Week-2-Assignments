const Joi = require("joi");

const user = Joi.object().keys({
    email:Joi.string().email({minDomainSegments:2}).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-z0-9]{3,30}$')).required(),
    firstName: Joi.string().max(30).required(),
    lastName: Joi.string().max(30).required()
})

module.exports = user;