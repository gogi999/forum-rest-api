const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

var Topic = require('../model/Topic');
const AppDatabaseManager = require('../manager/appDatabaseManager');
const appDatabaseManager = new AppDatabaseManager();

app.get('/', function (req, res) {
    var numRows;
    var queryPagination;
    var numPerPage = parseInt(req.query.npp, 10) || 1;
    var page = parseInt(req.query.page, 10) || 0;
    var numPages;
    var skip = page * numPerPage;
  
    var end_limit = numPerPage; 
    var limit = skip + ',' + end_limit;
    console.log(limit);
    console.log("SELECT * FROM topics DESC LIMIT " + limit);

    queryAsync('SELECT count(*) as numRows FROM topicss')
    .then(function(results) {
      numRows = results[0].numRows;
      numPages = Math.ceil(numRows / numPerPage);
      console.log('number of pages:', numPages);
    })
    .then(() => queryAsync('SELECT * FROM topics DESC LIMIT ' + limit))
    .then(function(results) {
      var responsePayload = {
        results: results
      };
      if (page < numPages) {
        responsePayload.pagination = {
          current: page,
          perPage: numPerPage,
          previous: page > 0 ? page - 1 : undefined,
          next: page < numPages - 1 ? page + 1 : undefined
        }
      }
      else responsePayload.pagination = {
        err: 'queried page ' + page + ' is >= to maximum page number ' + numPages
      }
      res.json(responsePayload);
    })
    .catch(function(err) {
      console.error(err);
      res.json({ err: err });
    });
});

router.get('/', auth, async (req, res) => {
    try{
        res.status(200).send(await appDatabaseManager.fetchTopics());
    }catch(error){
        res.status(400).send(error);
    }
});

router.get('/:id', auth, async (req, res) => {
    try{
        res.status(200).send(await appDatabaseManager.fetchAllTopics(req.params.id));
    }catch(error){
        res.status(400).send(error);
    }
});

router.post('/', auth, async (req, res) => {
    try{
        var topic = new Topic(req.body);
        const { error } = topic.validateTopic(topic);

        if(error) return res.status(400).send({message: error.details[0].message});

        topic.user_id = req.user._id;
        res.status(200).send(await appDatabaseManager.createTopic(req.user._id));
    }catch(error){
        res.status(400).send(error);
    }
});

router.put('/:id', auth, async (req, res) => {
    try{
        var topic = new Topic(req.body);
        const { error } = topic.validateTopic(topic);

        if(error) return res.status(400).send({message: error.details[0].message});
        
        topic.user_id = req.user._id;
        res.status(200).send(await appDatabaseManager.updateTopic(req.params.id, req.user._id));
    }catch(error){
        res.status(400).send(error);
    }
});

router.delete('/:id', auth, (req, res) => {
    try{
        if(!req.params.id) return res.status(400).send({message: 'Topic id is invalid!'});

        res.status(200).send(appDatabaseManager.deleteTopic(req.params.id, req.user._id));
    }catch(error){
        res.status(400).send(error);
    }
});

module.exports = router;