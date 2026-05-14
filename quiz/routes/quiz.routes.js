const express = require("express");
const quizController = require("../controller/quiz.controller");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../middleware/fileUploader");
const checkUserAuthorizedOrNot = require("../middleware/auth");

router.get("/", quizController.findAll);
router.get("/result", quizController.getAllCompletedQuiz);
router.route("/getAllNotification").get(quizController.getAllNotifications)

router.get("/quizQuestion/:id/:quiz_id", quizController.quizQuestions);
router.get("/getQuizQuestion/:id", quizController.getQuizQuestions);
router.get("/getAll", quizController.getAllQuiz);
router.get("/getQuizTypeById/:quizTypeId", quizController.getQuizTypeById);

router.post("/", quizController.createQuiz);
router.post("/quizSetting", quizController.createQuizSetting);
router.post("/quizDate", quizController.createQuizDate);
router.post("/quizDetail", quizController.createQuizDetail);
router.post("/quizCourse", quizController.createQuizCourse);
router.post("/addQuestion", quizController.addQuestion);
router.delete("/question/:id/:quiz_id", quizController.deleteQuestion);

router.get("/:id", quizController.findById);
router.delete("/:id", quizController.delete);
router.put("/:id", quizController.updateQuiz);
router.put("/quizCourse/:id", quizController.updateQuizCourse);
router.put("/quizDate/:id", quizController.updateQuizDate);
router.put("/quizDetail/:id", quizController.updateQuizDetail);
router.get("/getQuizDetailAccordingToSubjectAndOtherFilteredData/:quiz_id",quizController.getQuizDetailsAccordingToSubjectId)

//result API

// user playing quiz 
router.post("/submitQuizQuestionAnswer",checkUserAuthorizedOrNot, quizController.submittingUserAnswer)
router.get("/getQuizResultWithQuizId/:quiz_id",checkUserAuthorizedOrNot,quizController.getQuizResultWithToQuizId)
router.post("/userRegistration",checkUserAuthorizedOrNot,quizController.userRegistration)
router.get("/getAllRegisteredUserUsingQuizId/:id",checkUserAuthorizedOrNot,quizController.getAllRegisteredusers)
router.get("/getQuizDetailForgettingQuestion/:key/:user_id", checkUserAuthorizedOrNot, quizController.findQuizDetail);


// passage Route 
router.route("/createPassage").post(quizController.createPassage)
router.route("/updatePassage/:id").put(quizController.updatePassage)
router.route("/passages/getAll").get(quizController.getAllPassage)
router.route("/updatePassageStatus/:id").put(quizController.updatePassageStatus)
router.route("/deletePassage/:id").delete(quizController.deletePassage)
router.route("/getPassageById/:id").get(quizController.getPassageById)





//notifications Route

router.route("/createNotifications").post(quizController.createNotifications)
router.route("/updateNotifications/:id").put(quizController.updateNotifications)
router.route("/getAllNotification").get(quizController.getAllNotifications)
router.route("/updateNotificationStatus/:id").put(quizController.updateNotificationStatus)
router.route("/deleteNotifications/:id").delete(quizController.deleteNotifications)
router.route("/getNotificationById/:id").get(quizController.getNotificationById)



// user Panel Route 
router.route("/quizzes/status/get").get(quizController.getQuizDetailsUserPanel)
router.route("/live/quizzes/status/get").get(quizController.getLiveQuizDetailsUserPanel)

router.post("/submitQuizResult/result/submit",quizController.submitQuizResult)
router.post("/getQuizResult/result/get",quizController.getQuizResultUsingUserIdAndQuizKey)
router.post("/submitQuizReview/review/submit",quizController.submitQuizReview)
router.post("/intializedQuizAnalysisStatus/status",quizController.initializedQuizStatus)
router.post("/reattemptQuiz/status",quizController.reAttemptQuizStatus)

router.get("/getAllReview/get/:key",quizController.getAllReview)
router.put("/updateQuizReview/:id",quizController.editQuizReview)
router.delete("/deleteQuizReview/:id",quizController.deleteQuizReview)
router.post("/getQuizReportStatus",quizController.getQuizReportStatus)



router.put("/status/update/updateTimeTakenForQuiz",quizController.updateTimeForQuizzes)
router.put("/status/reset/resetTimeTakenForQuiz",quizController.resetTimeForQuizzes)


module.exports = router;
