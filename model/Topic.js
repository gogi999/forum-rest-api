const config = require('config');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

function Topic(body){
    //this.id = body.id;
    this.topic_title = body.topic_title;
    this.topic_text = body.topic_text;
    this.user_id = body.user_id;
}

Topic.prototype.validateTopic = function(topic){
    const schema = {
        id: Joi.number().optional,
        topic_title: Joi.string().required(),
        topic_text: Joi.string().required(),
        user_id: Joi.number().required()
    };

    return Joi.validate(topic, schema);
};

module.exports = Topic;