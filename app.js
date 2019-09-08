const express = require('express');
const bodyParser = require('body-parser');
const db = require('./manager/db');
const users = require('./routes/users');
const topics = require('./routes/topics');
const comments = require('./routes/comments');

const app = express();

const conn = new db({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'forum_database'
});

global.db = conn;

app.use(bodyParser.json());
app.use(express.json());
app.use('/api/users', users);
app.use('/api/topics', topics);
app.use('/api/comments', comments);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is up and listening on port ${port}...`);
});