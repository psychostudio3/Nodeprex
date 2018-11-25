
var mongoose = require("mongoose");
ObjectId = mongoose.Schema.Types.ObjectId; 
var Question = require('../model/Question');

var surveySchema = new mongoose.Schema({
  name: { type: String, index: true , unique:true,required:true},
  launchTime: Date,
  dueTime: Date,
 // questions: [{type:ObjectId,index:true,ref:"Question"}],
  questions: [Question],
  createdDate:{type:Date},
  updatedDate:{type:Date},
  frequency:{type:String,enum:["W","D"]}, 
  number:Number ,
  isActive:{type:Boolean ,default:true},
  surveyTakeTimes:Object
});

mongoose.model("Survey", surveySchema ); 

//module.exports= mongoose.model("Survey");


  