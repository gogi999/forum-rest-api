const nodemailer = require('nodemailer');
const nodemaiMailgun = require('nodemailer-mailgun-transport');

class AppDatabaseManager {
    fetchUserByEmail(email){
        return db.query("SELECT * FROM users WHERE email = ?", email).then(rows => {
            return rows;
        });
    }

    doRegister(register){
        return db.query("INSERT INTO users (first_name, last_name, password, confirm_password,  email, terms_of_service) VALUES (?, ?, ?, ?, ?, ?)", 
        [
            register.first_name,
            register.last_name,
            register.password,
            register.confirm_password,
            register.email,
            register.terms_of_service
        ]);
    }

    fetchAllTopics(){
        return db.query("SELECT * FROM topics")
            .then(rows => {
                return rows;
            });        
    }

    fetchTopic(id){
        return db.query("SELECT * FROM topics WHERE id = ?", 
            [id]
            )
            .then(rows => {
                return rows;
            });
            
    }

    async createTopic(topic){
        const checkTopicExists = await this.fetchTopic(topic.id);

        // If topic already exists
        if(checkTopicExists[0]){
            let user_id = checkTopicExists[0].user_id;
            let topic_title = checkTopicExists[0].topic_title + topic.topic_title;
            let topic_text = checkTopicExists[0].topic_text + topic.topic_text;

            return db.query("UPDATE topics SET topic_title = ?, topic_text = ? WHERE user_id = ?"
            + "SELECT LAST_INSERT_ID()", 
                [
                    topic_title, 
                    topic_text, 
                    user_id
                ])
                .then(rows => {
                    return rows;
                });
        }else{
            return db.query("INSERT INTO topics topic.topic_title, topic.topic_text, topic.user_id VALUES (?, ?, ?)" + 
            "SELECT LAST_INSERT_ID()", [topic.topic_title, topic.topic_text, topic.user_id]
            )
            .then(rows => {
                return rows;
            });
        }        
    }

    updateTopic(id, user_id){
        return db.query("UPDATE topics set topic_title = ?, topic_text = ? WHERE id = ? AND user_id = ?"
        + "SELECT LAST_INSERT_ID", 
            [topic_title, topic_text, user_id, id]
            )
            .then(rows => {
                return rows;
        });
    }

    deleteTopic(id, user_id){
        return db.query("DELETE * FROM topics WHERE id AND user_id = ?"
        + "SELECT LAST_INSERT_ID", 
            [id, user_id]
            )
            .then(rows => {
                return rows;
        });
    }

    fetchAllComments(){
        return db.query("SELECT * FROM comments")
            .then(rows => {
                return rows;
            });        
    }
    
    fetchComment(id){
        return db.query("SELECT * FROM comments WHERE topic_id = ? AND user_id = ?", 
            [id])
            .then(rows => {
                return rows;
            });
            
    }

    async createComment(comment){
        const checkCommentExists = await this.fetchComment(comment.id);

        // If comment already exists
        if(checkCommentExists[0]){
            let id = checkCommentExists[0].id;
            let comment_text = checkCommentExists[0].comment_text;

            return db.query("UPDATE comments SET comment_text = ? WHERE id = ?"
                + "SELECT LAST_INSERT_ID()", 
                [ 
                    comment_text, 
                    id
                ])
                .then(rows => {
                    return rows;
                });
        }else{
            return db.query("INSERT INTO comments (comment_text, user_id, topic_id) VALUES(?, ?, ?)" + 
            "SELECT LAST_INSERT_ID()",
            [comment.comment_text, comment.topic_id, comment.user_id]
            ).then(rows => {
                return rows;
            });
        }
    }

    updateComment(id, user_id){
        return db.query("UPDATE comments set comment_text = ? WHERE topic_id = ? AND user_id = ?"
        + "SELECT LAST_INSERT_ID()", 
            [comment_text, topic_id, user_id, id]
            )
            .then(rows => {
                return rows;
        });
    }

    deleteComment(id, user_id){
        return db.query("DELETE * FROM comments WHERE id = ? AND user_id = ?"
        + "SELECT LAST_INSERT_ID()", 
            [id, user_id]
            )
            .then(rows => {
                return rows;
        });
    }
}

module.exports = AppDatabaseManager;