const express = require('express');
const router = express();
const examController = require('../controller/exam.controller');

router.route("/createUpdate").post(examController.createUpdateExam);
router.route("/get/exam").get(examController.getExams);
router.route("/get/exam/:id").get(examController.getExamsById);
router.route("/get/exam/getById/:id").get(examController.getExamById);
router.route("/delete/exam/:id").delete(examController.deleteExamById);
router.route("/get/getAllExamTypes").get(examController.getAllExamTypes);
router.route("/exam_types/createUpdate").post(examController.createUpdateExamTypes);
router.route("/exam_types/get/exam").get(examController.getExamTypes);
router.route("/exam_types/get/exam/getById/:id").get(examController.getExamTypesById);
router.route("/exam_types/delete/exam/:id").delete(examController.deleteExamTypesById);


router.route("/exam_section/createUpdate").post(examController.createUpdateExamSections);
router.route("/exam_section/get/section/:id").get(examController.getExamSection);
router.route("/exam_section/get/exam/getById/:id").get(examController.getExamSectionsById);
router.route("/exam_section/delete/exam/:id").delete(examController.deleteExamSectionsById);
router.route("/exam_section/delete/exam/:id").delete(examController.deleteExamSectionsById);
router.route("/exam_section/get/courses/:id").get(examController.getAllExamCoursesDetail);



router.get("/exam-section/get-all-questions/:exam_id/:section_id",examController.getAllQuestionsUsingExamAndSectionId)
router.get("/section-exam/view-all-questions/:exam_id/:section_id",examController.viewAllQuestionsUsingExamAndSectionId)

router.post("/exam-section/addRemoveQuestions",examController.addRemoveQuestionsToExamSections)
router.get("/exam-section/getAllQuestionsAlreadyPresent/:section_id",examController.getAllExamSectionQuestions)


router.route("/assign-exam/get/exam/:id").get(examController.getExamstoAssign);
router.route("/assign-exam/subPackage/exam").post(examController.assignExamToSubPackages);
router.route("/assign-exam-status/subPackage/exam/status").post(examController.assignExamTypeToSubPackagesStatus);



// Quiz Playing API
router.route("/setTimeTakenForExamSectionAndQuestionTime").post(examController.setTimeTakenExamSectionAndQuestion)
router.route("/initializedExamStatus").post(examController.initializedPackageExamStatus)
router.route("/submitQuestionAnswerExam").post(examController.submitQuestionWithExamExamStarted)
router.route("/getExamQuestionStatus").post(examController.getExamQuestionStatus)
router.route("/clearResponseFromDatabaseforParticularQuestion").post(examController.clearResponseQuestionAndAnswer)

//Not sectio-wise API
router.route("/updateTimeStatusOnEverySecond").post(examController.updateTimeStatusOnEverySeconds)

//section-wise API
router.route("/updateTimeStatusOnEverySecondSectionWIse").post(examController.updateTimeStatusOnEverySecondsSectionWise)

//not section-wise time
router.route("/findTotalTimeTakenForParticularSection").post(examController.timeTakenForSectionUsingExamSectionIdANdUserId)
//find section-wise time
router.route("/findTotalTimeTakenForParticularSectionSectionWise").post(examController.timeTakenForSectionUsingExamSectionIdANdUserIdSectionWise)
router.route("/findExamSectionTimeLeftForExam").post(examController.findTimeLeftForExamAndExamsection)
router.route("/submitExam/submit").post(examController.submiteExamForPackages)

router.route("/findExamWhichIsAlreadyGiven").post(examController.findExamWhichIsAdrteadyGivenForUser)
router.route("/liveExam/check/findExamWhichIsAlreadyGiven").post(examController.findLiveExamWhichIsAdrteadyGivenForUser)
router.route("/joinNow/live/exam").post(examController.joinNowLiveExam)
router.route("/attempted/exam/:user_id").get(examController.examAlreadyAttempted)
router.route("/admin/attempted/exam/:user_id").get(examController.adminExamAlreadyAttempted)
router.route("/delete/attempted/exam/:id").delete(examController.deleteExamAlreadyAttempted)

router.route("/quiz/attempted/:user_id").get(examController.quizAlreadyAttempted)
router.route("/clear-response").post(examController.clearResponse)

//Saved Question Router

router.route("/getSavedExamQuestion/:userid").get(examController.findSavedExamDetailWithQuestion)
router.route("/saveExamQuestion").post(examController.savedExamQuestion)
router.route("/removeSavedExamQuestion").put(examController.removeSavedQuestion)
router.route("/getSingleSavedQuestionDetail").post(examController.getSingleSavedExamQuestionDetails)
router.route("/allSavedQuestions/get/:userid").get(examController.getAllSavedExamQuestionsUsingOrderId)

//Report Question Router

router.route("/getReportedExamQuestion/:userid").get(examController.findReportExamDetailWithQuestion)
router.route("/reportExamQuestion").post(examController.reportExamQuestion)
router.route("/removeReportExamQuestion").put(examController.removeReportQuestion)
router.route("/getSingleReportQuestionDetail").post(examController.getSingleReportExamQuestionDetails)



// Live Exam 
// router.route("/live/exam/registration").post(examController.)


router.route("/deleteResultAnalysisDatausingPackageIdSubpackageIdAndExamId/:packageid/:subpackageid").post(examController.deleteResultAnalysisDatausingPackageIdSubpackageIdAndExamId)
module.exports = router;