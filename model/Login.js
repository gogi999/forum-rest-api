const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');

function Login(login){
    this.password = login.password;
    this.email = login.email;
}

Login.prototype.validateLogin = function(login){
    const schema = {
        password: Joi.string().min(8).max(200).required(),
        email: Joi.string().min(3).max(200).required()
    };

    return Joi.validate(login, schema);
};

Login.prototype.generateAuthToken = function(login){
    //console.log(config.get('jwtPrivateKey'));
    const token = jwt.sign({
        _id: login.id,
        _email: login.email
    }, 
    config.get('jwtPrivateKey'),
    {
        expiresIn: config.get('expireIn')
    });

    return token;
};

module.exports = Login;