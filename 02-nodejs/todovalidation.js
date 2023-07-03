const Joi = require("joi");

const todo = Joi.object().keys({
    title:Joi.string().min(3).max(100).required(),
    completed: Joi.bool(),
    description: Joi.string().max(320)
})

module.exports = todo;