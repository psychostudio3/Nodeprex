var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var models = require("../model/Answer");
var utils = require("../utils/Utils");
var answerRepo = require("../dal/AnswerRepo");

// Create a new  answer
router.post("/:questionID/:userID/:answer", async function (req, res) {
  try {
    var answer = await answerRepo.upsertAnswer(req.params.questionID,req.params.userID,req.params.answer);
    res.status(200).send(answer);
  } catch (err) {
    console.log(err);
    return res.status(500).send("There was a problem saving the answer." );
  }
});

// Get Answers by user and survey
router.get("/:surveyID/:userID", async function(req, res) {
  try {
    var answers = await answerRepo.getAnswersBySurveyUser(req.params.surveyID,req.params.userID);
    res.status(200).send(answers);
  } catch (err) {
    return res.status(500).send("There was a problem getting the answers.");
  }
});

// // Get UnAnswered questions  by user and survey
// router.get("/:surveyID/:userID", async function(req, res) {
//     try {
//         var answers = await answerRepo.getUnAnsweredBySurveyUser(req.params.surveyID,req.params.userID);
//         res.status(200).send(answers);
//       } catch (err) {
//         return res.status(500).send("There was a problem getting the questions.");
//       }
//   });
  
module.exports = router;