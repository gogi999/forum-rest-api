const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
var Register = require('../model/Register');
var Login = require('../model/Login');
const AppDatabaseManager = require('../manager/appDatabaseManager');
const appDatabaseManager = new AppDatabaseManager();
const resetPassword = require('../manager/resetPassword');


router.post('/register', async (req, res) => {
    try{
        var register = new Register(req.body);
        const { error } = register.validateRegister(register);

        if(error) return res.status(400).send({
            message: error.details[0].message
        });
        
        let userCheck = await appDatabaseManager.fetchUserByEmail(register.email);

        if(userCheck != 0) return res.status(400).send('User alredy registered!');

        const salt = await bcrypt.genSalt(10);
        register.password = await bcrypt.hash(register.password, salt);
        register.confirm_password = await bcrypt.hash(register.confirm_password, salt);
        let user = appDatabaseManager.doRegister(register);
        console.log(user.insertedId);
        res.status(200).send('User successfully created!');
    }catch(error){
        res.status(400).send(error);
    }
});

router.post('/login', async (req, res) => {
    try{
        var login = new Login(req.body);
        const { error } = login.validateLogin(login);

        if(error) return res.status(400).send({
            message: error.details[0].message
        });
        
        const userInfo = await appDatabaseManager.fetchUserByEmail(login.email);

        if(userInfo.length == 0) return res.status(400).send({message: 'Invalid email or password!'});

        const validPassword = await bcrypt.compare(login.password, userInfo[0].password);
        
        if(!validPassword) 
            return res.status(400).send({message: 'Invalid email or password!'});

        login.id = userInfo[0].id;
        res.status(200).send({token: await login.generateAuthToken(login)});
    }catch(error){
        res.status(400).send(error);
    }
});

module.exports = router;