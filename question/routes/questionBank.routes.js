const express = require("express");
const QuestionBankController = require("../controller/questionBank.controller");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../middleware/fileUploader");
const checkUserAuthorizedOrNot = require("../middleware/auth");

router.get("/", QuestionBankController.findAll);
router.get("/courses", QuestionBankController.findAllCourses);
router.post("/subjects", QuestionBankController.findAllSubjects);
router.get("/:id", QuestionBankController.findById);
router.delete("/:id", QuestionBankController.delete);
router.put("/:id", QuestionBankController.update);
router.post("/", QuestionBankController.create);
router.post("/getRandomQuestionForCreatingQuiz",QuestionBankController.getRandomQuestionsForCreatingQuiz)
router.post("/uploadQuestionsFromExcelSheet",QuestionBankController.uploadQuestionsFromExcelSheet)

//user Playing Quiz Route
router.get("/getAllQuestionsWithQuizId/:quiz_key/:user_id",checkUserAuthorizedOrNot,QuestionBankController.getAllQuestionsWithQuizId)


//exam routes (packages)
router.get("/get/questions/getAllQuestionBankWithQuestionsUsingSubjectId/:subject_id",QuestionBankController.getAllQuestionBankWithQuestions)

router.post("/questionsGetUsingQuestionBankIdView",QuestionBankController.questionsGetUsingQuestionBankIdView)

// user panel getting Questions

router.post("/getAllQuestionsUsingQuestionBankIds",QuestionBankController.getAllQuestionsUsingQuestionBankIds)

router.post("/getAllQuestionsWithAnswerUsingQuestionBankIds",QuestionBankController.getAllQuestionsWithAnswerUsingQuestionBankIds)



router.post("/questionsAll/get",QuestionBankController.getAllQuestionsUsingQuestionIds)

// report Question Route 
router.get("/getReportQuestion/:userid",QuestionBankController.findReportQuestion)
router.post("/createReportQuestion",QuestionBankController.reportQuizQuestion)
router.put("/removeReportedQuestion",QuestionBankController.removeReportQuestion)
router.post("/getSingleReportQuestion",QuestionBankController.getSingleReportQuizQuestionDetails)





// Saved Question Route 
router.get("/getSavedQuestion/:userid",QuestionBankController.findSavedQuestion)
router.post("/createSavedQuestion",QuestionBankController.savedQuizQuestion)
router.put("/removeSavedQuestion",QuestionBankController.removeSavedQuestion)
router.post("/getSingleSavedQuestion",QuestionBankController.getSingleSavedQuizQuestionDetails)

module.exports = router;
