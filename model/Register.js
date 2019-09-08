const Joi = require('joi');

function Register(body){
    this.first_name = body.first_name;
    this.last_name = body.last_name;
    this.password = body.password;
    this.confirm_password = body.confirm_password;
    this.email = body.email;
    this.terms_of_service = body.terms_of_service;
}

Register.prototype.validateRegister = function(register){
    const schema = {
        first_name: Joi.string().min(3).max(200).required(),
        last_name: Joi.string().min(3).max(200).required(),
        password: Joi.string().min(8).max(200).required(),
        confirm_password: Joi.string().min(8).max(200).required(),
        email: Joi.string().min(3).max(200).required().email(),
        terms_of_service: Joi.string().min(3).max(200).required()
    };

    return Joi.validate(register, schema);
}

module.exports = Register;