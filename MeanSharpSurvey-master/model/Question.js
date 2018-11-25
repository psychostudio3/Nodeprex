
var mongoose = require('mongoose');
ObjectId = mongoose.Schema.Types.ObjectId; 

var Survey = require('../model/Survey');
var Answer = require('../model/Answer');

var questionSchema = new mongoose.Schema({
  surveyID: { type: ObjectId, index: true ,required:true,ref:"Survey"},
  answers :[{type:ObjectId,index:true,ref:"Answer"}],
  questionType: {type:String,enum:["FreeText", "SingleSelect"],required:true},
  questionText:{type:String,required:true},
  answerChoices:[String]
});


mongoose.model("Question", questionSchema);
//module.exports= mongoose.model("Question"); 


