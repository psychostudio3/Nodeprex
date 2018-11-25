var Answer = require("../model/Answer");
var Survey = require("../model/Survey");
var Question = require("../model/Question");

var utils = require("../utils/Utils");
var surveyRepo = require("../dal/SurveyRepo");
var userRepo = require("../dal/UserRepo");

//#region Get 
async function getAnswer(questionID, userID) {
    try {
        return await Answer.findOne({ questionID: questionID, userID: userID });
    }
    catch (err) {
        return err;
    }
}

// async function getQuestion(id) {
//     try {
//         //tODO fix 
//         var question = await Survey.find({ id: id });
//         if (!question)
//                     return "No question by this id";
//         return question;
//     } catch (err) {
//         return "An error has occured while getting the question";
//     }
// }


// Get UnAnswered questions  by survey and user
async function getUnAnsweredQuestionsBySurveyUser(surveyID, userID) {
    //  var answers = await models.Answer.find({ id: id });
    // TODO fill this
}

// Get Answers by user and survey
async function getAnswersBySurveyUser(surveyID, userID) {
    try {
        var questions = await getQuestionsBySurvey(surveyID);
        var answers = [];

        for (let q of questions) {
            console.log("question id : " + q._id + ", userID:" +userID);
            var answer = await getAnswer(q._id, userID);
            if (answer) {
                answers.push(answer);
                console.log("answer question id is " + answer.questionID);
            }
        }
        // questions.forEach(async function (q){

        // });
        return answers;
    }
    catch (err) {
        console.log(err);
    }

}

// Get Answers by Survey
async function getAnswersBySurvey(surveyID) {
    var answers = await Answer.find({ surveyID: surveyID });
    return answers;
}

async function getQuestionsBySurvey(surveyID) {
    var questions = await Question.find({ surveyID: surveyID });
    return questions;
}

// Get Answers by  question ID
async function getAnswersByQuestion(questionID, recordCount) {
    throw "Not implemented";
}
//#endregion

//#region Create/Update
async function createAnswer(questionID, userID, answer) {
    try {
        var question = await surveyRepo.getQuestion(questionID);
        if (!question) return "Invalid question id";
        var user = await userRepo.getUser(userID);
        if (!user) return "Invalid user id";
        if (question.questionType == "SingleSelect" && !question.answerChoices.contains(answer))
            return "Invalid choice";
        return await Answer.create({
            questionID: questionID,
            userID: userID,
            answer: answer,
            createdDate: Date.now()
        });
    } catch (err) {
        console.log(err);
        return "An error has occured while saving the answer";
    }
}


async function updateAnswer(questionID, userID, answerValue) {
    try {
        var answer = await getAnswer(questionID, userID);
        if (!answer) return "Answer doesnt exists for this user/question";
        var question = await surveyRepo.getQuestion(questionID);
        if (!question) return "Question doesnt exists by this questionID";
        if (
            question.questionType == "SingleSelect" &&
            !question.answerChoices.contains(answer)
        )
            return "Invalid choice";
        answer.answer = answerValue;
        answer.updatedDate = Date.now();
        answer.save();
        return answer;
    } catch (err) {
        console.log(err);
        return "An error has occured while updating the answer";
    }
}

async function upsertAnswer(questionID, userID, answerValue) {
    var answer = await getAnswer(questionID, userID);
    if (!answer) return await createAnswer(questionID, userID, answerValue);
    else return await updateAnswer(questionID, userID, answerValue);
}
//#endregion

module.exports = {
    createAnswer: createAnswer,
    updateAnswer: updateAnswer,
    upsertAnswer: upsertAnswer,
    getAnswer: getAnswer,
    getUnAnsweredQuestionsBySurveyUser: getUnAnsweredQuestionsBySurveyUser,
    getAnswersBySurveyUser: getAnswersBySurveyUser,
    getAnswersBySurvey: getAnswersBySurvey
};
