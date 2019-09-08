const config = require('config');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

function Comment(body){
    //this.id = body.id;
    this.comment_text = body.comment_text;
    this.topic_id = body.topic_id;
    this.user_id = body.user_id;
}

Comment.prototype.validateComment = function(comment){
    const schema = {
        id: Joi.number().optional,
        comment_text: Joi.string().required(),
        topic_id: Joi.number().required(),
        user_id: Joi.number().required()
    };

    return Joi.validate(comment, schema);
};

module.exports = Comment;