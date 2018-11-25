var express = require('express');
var app = express();
var db = require('./db');

//var userController = require('./controllers/UserController');
var surveyController = require('./controllers/SurveyController');
//var answerController = require('./controllers/AnswerController');

//app.use('/users', userController);
app.use('/surveys', surveyController);
//app.use('/answers', answerController);

module.exports = app;