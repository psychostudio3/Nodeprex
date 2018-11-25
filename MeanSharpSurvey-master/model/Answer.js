
var mongoose = require('mongoose');
var User = require('../model/User');
var Question = require('../model/Question');

ObjectId = mongoose.Schema.Types.ObjectId; 

var answerSchema = new mongoose.Schema({
  questionID: { type: ObjectId, index: true ,required:true,ref:"Question"},
  userID:{type:ObjectId,index:true,required:true,ref:"User"},// this is the _id of the User object not the userID property
  createdDate:{type:Date},
  updatedDate:{type:Date},
  answer:{type:String} 
});
answerSchema.index({questionID: 1, userID: 1}, {unique: true});

mongoose.model("Answer", answerSchema ); 

//module.exports= mongoose.model("Answer"); 
  