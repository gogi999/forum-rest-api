const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

var Comment = require('../model/Comment');
const AppDatabaseManager = require('../manager/appDatabaseManager');
const appDatabaseManager = new AppDatabaseManager();

router.get('/', auth, async (req, res) => {
    try{
        res.status(200).send(await appDatabaseManager.fetchComment());
    }catch(error){
        res.status(400).send(error);
    }
});

router.get('/', auth, async (req, res) => {
    try{
        res.status(200).send(await appDatabaseManager.fetchAllComments(req.params.id));
    }catch(error){
        res.status(400).send(error);
    }
});

router.post('/', auth, async (req, res) => {
    try{
        var comment = new Comment(req.body);
        const { error } = comment.validateTopic(comment);

        if(error) return res.status(400).send({message: error.details[0].message});

        comment.user_id = req.user._id;
        res.status(200).send(await appDatabaseManager.createTopic(req.user._id));
    }catch(error){
        res.status(400).send(error);
    }
});

router.put('/:id', auth, async (req, res) => {
    try{
        var comment = new Comment(req.body);
        const { error } = comment.validateComment(comment);

        if(error) return res.status(400).send({message: error.details[0].message});
        
        comment.user_id = req.user._id;
        res.status(200).send(await appDatabaseManager.updateComment(req.params.id, req.user._id));
    }catch(error){
        res.status(400).send(error);
    }
});

router.delete('/:id', auth, (req, res) => {
    try{
        if(!req.params.id) return res.status(400).send({message: 'Comment id is invalid!'});
    
        res.status(200).send(appDatabaseManager.deleteComment(req.params.id, req.user._id));
    }catch(error){
        res.status(400).send(error);
    }
});

module.exports = router;