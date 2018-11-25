var Survey = require("../model/Survey");
var Question = require("../model/Question");

var utils = require("../utils/Utils");
var userRepo = require("../dal/UserRepo");
var mongoose = require("mongoose");
class SurveyTakePeriod {
  constructor(launchTime, dueTime) {
    this.launchTime = launchTime;
    this.dueTime = dueTime;
  }
}

//#region Get
// Get the active surveys whichs laucnh/due date covers current time & user join date is >yesterday
async function getSurveysAvailableForAUser(userID) {
  try {
    var surveys = new Array();
    var user = await userRepo.getUserByUserID(userID);
    if (!user) return "Invalid User";
    if (!utils.checkBeforeToday(user.joinDate))
      return "User join date must be before today ";
    var now = new Date();
    var activeSurveys = await Survey.find({ isActive: true });

    for (let s of activeSurveys) {
      var surveyPeriods = getSurveyTakePeriodsbyJoinDate(s, user.joinDate);
      var matchingPeriods = surveyPeriods.filter(p => p.launchTime <= now && p.dueTime >= now);
      if (matchingPeriods.length > 0) {
        console.log(matchingPeriods);
        surveys.push(s);
      }
    }
    return surveys;
  }
  catch (err) {
    return "An error has occured while getting the surveys for the user";
  }
}

// Get the active surveys whichs 1) laucnh/due date covers given beginDate and endDate 2)  user join date is >yesterday
async function getSurveysAvailableForAUserInAPeriod(userID, beginDate, endDate) {
  try {
    var surveys = new Array();
    var user = await userRepo.getUserByUserID(userID);
    if (!user) return "Invalid User";
    if (!utils.checkBeforeToday(user.joinDate))
      return "User join date must be before today ";
    var now = new Date();
    var activeSurveys = await Survey.find({ isActive: true });
    activeSurveys.forEach(s => {
      var surveyPeriods = getSurveyTakePeriodsbyJoinDate(s, user.joinDate);
      var matchingPeriods = surveyPeriods.filter(p => p.launchTime >= new Date(beginDate) && p.launchTime <= new Date(endDate));
      console.log(matchingPeriods);
      if (matchingPeriods.length > 0) {
        s.surveyTakeTimes = matchingPeriods;
        surveys.push(s);
      }
    });
    console.log(surveys);
    return surveys;
  }
  catch (err) {
    return "An error has occured while getting the surveys for the user";
  }
}

//Gives the list of the times when a user can take a survey based on the joindate of the user
function getSurveyTakePeriodsbyJoinDate(survey, joinDate) {
  var surveyPeriods = [];
  var dayCount;
  try {
    if (survey.frequency == "W")
      dayCount = 7;
    else if (survey.frequency == "D")
      dayCount = 1;

    for (x = 0; x < survey.number; x++) {
      var surveyBeginTime = new Date();
      surveyBeginTime.setDate(joinDate.getDate() + 1 + x * dayCount);
      var surveyBeginHours = utils.getHourAndMinFromDate(survey.launchTime);
      surveyBeginTime.setHours(surveyBeginHours.Hour, surveyBeginHours.Min, 0, 0);
      var surveyEndHours = utils.getHourAndMinFromDate(survey.dueTime);
      var surveyEndTime = new Date(surveyBeginTime);
      surveyEndTime.setHours(surveyEndHours.Hour, surveyEndHours.Min, 0, 0);
      var surveyPeriod = new SurveyTakePeriod(surveyBeginTime, surveyEndTime);
      surveyPeriods.push(surveyPeriod);
    }
    return surveyPeriods;
  }
  catch (err) {
    return err;
  }
}

async function getSurveys() {
  try {
    return await Survey.find({});
  } catch (err) {
    return "An error has occured while getting surveys";
  }
}

async function getSurveyByName(name) {
  try {
    return await Survey.findOne({ name: name });
  } catch (err) {
    return "An error has occured while getting the survey";
  }
}
async function getSurvey(id) {
  try {
    return await Survey.findById(id);
  } catch (err) {
    return "An error has occured while getting the survey";
  }
}
async function getSurveysQuestionsByName(name) {
  try {
    var survey = await Survey.find({ name: name });
    return survey.questions;
  } catch (err) {
    return "An error has occured while getting the survey";
  }
}


async function getQuestion(id) {
  try {
    var question = await Question.find({ id: id });
    if (question == null)
      return "No question by this id";
    return question;
  } catch (err) {
    return "An error has occured while getting the question";
  }
}

//#endregion

//#region Create
async function createSurvey(req) {
  try {
    var survey = await Survey.create({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      //  questions: req.body.questions,
      launchTime: utils.toTime(req.body.launchTime),
      dueTime: utils.toTime(req.body.dueTime),
      frequency: req.body.frequency,
      number: req.body.number,
      createdDate: Date.now()
    });
    for (var key in req.body.questions) {
      var q = req.body.questions[key];
      var question = await Question.create({
        surveyID: survey._id,
        questionText: q.questionText,
        questionType: q.questionType,
        answerChoices: q.answerChoices
      });
      survey.questions.push(question);
    }
    survey.save();
    return survey.populate('questions');
  } catch (err) {
    console.log(err);
    return "An error has occured while creating survey";
  }
}
//#endregion

//#region Update
async function updateSurvey(id, sValues) {
  try {
    var survey = await Survey.findById(id);

    if (survey == null) {
      return "The survey by this id does not exist.";
    } else {
      survey.name = sValues.name;
      survey.launchTime = utils.toTime(sValues.launchTime);
      survey.dueTime = utils.toTime(sValues.dueTime);
      survey.frequency = sValues.frequency;
      survey.number = sValues.number;
      survey.updatedDate = Date.now();
      survey.isActive = sValues.isActive;
      survey.questions = [];
      for (var key in sValues.questions) {
        var q = sValues.questions[key];
        var question = await Question.create({
          surveyID: survey._id,
          questionText: q.questionText,
          questionType: q.questionType,
          answerChoices: q.answerChoices
        });
        survey.questions.push(question);
      }
      await survey.save();
      return survey.populate('questions');
    }
  } catch (err) {
    //TODO Add logging
    console.log(err);
    return "An error has occured while updating survey";
  }
}

// Togles survey IsActive
async function updateSurveyActive(id, isActive) {
  try {
    var survey = await Survey.findById(id);
    if (survey == null) {
      return "The survey by this id does not exist.";
    }
    else {
      survey.isActive = isActive;
      await survey.save();
      return survey;
    }
  } catch (err) {
    //TODO Add logging
    console.log(err);
    return "An error has occured while updating survey";
  }
}
//#endregion

//#region delete
async function deleteSurvey(id) {
  try {
    var result = await Survey.findByIdAndRemove(id);
    return result;
  } catch (err) {
    console.log(err);
    return "An error has occured while deleting the survey";
  }
}
//#endregion

module.exports = {
  createSurvey: createSurvey,
  updateSurvey: updateSurvey,
  deleteSurvey: deleteSurvey,
  getSurveys: getSurveys,
  getSurveyByName: getSurveyByName,
  getSurvey: getSurvey,
  getSurveysQuestionsByName: getSurveysQuestionsByName,
  getSurveysAvailableForAUser: getSurveysAvailableForAUser,
  getSurveysAvailableForAUserInAPeriod: getSurveysAvailableForAUserInAPeriod,
  getQuestion: getQuestion,
  updateSurveyActive: updateSurveyActive,
  SurveyPeriod: SurveyTakePeriod
};
