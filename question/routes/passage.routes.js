const express = require("express");
const questionController = require("../controller/question.controller");
const passageController = require("../controller/passage.controller");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../middleware/fileUploader");

// router.get("/", questionBankController.findAll);
// router.get("/getFiltreredQuestion/:id",questionBankController.getFilteredQuestions)
// router.post("/", questionController.create);
// router.post("/update", questionBankController.create);
// router.post("/addOption", questionController.addOption);
// router.delete("/deleteOption/:id", questionController.deleteOption);
// router.put("/:questionBankId/:questionId", questionController.updateQuestion);
// router.get("/getAllQuestionUsingQuizId/:quiz_id",questionController.getAllQuestionsUsingQuizId)

// router.get("/:id", questionBankController.findById);
// router.delete("/:id", questionController.delete);
// router.get("/getQuestionDetail/:questionBankId", questionController.getQuestionDetails);
// router.get("/:questionBankId/:language",questionController.getQuestionUsingQuestionBankIdAndLanguage)
// router.delete("/deleteQuestion/:id", questionController.deleteQuestions);
// router.put("/updateOption/:id", questionController.updateOptions);




// //user Route
// router.post("/checkAnswerIsCorrectOrNot", checkUserAuthorizedOrNot, questionController.checkAnswerIsCorrectOrNot);
// router.post("/getAllQuestionWithCorrectOption",questionController.getAllQuestionDetailUsingQuestionBankId)



// create Passage 
router.post("/create",passageController.create)
router.get("/getAllPassages/:id",passageController.getPassages)
router.get("/",passageController.findAll)
router.get("/getPassageDetail/:passageBankId", passageController.getPassageDetails);
router.put("/:passageBankId/:passageId", passageController.updatePassage);
router.get("/:passageBankId/:language",passageController.getQuestionUsingPassageBankIdAndLanguage)
router.delete("/:id", passageController.delete);
router.delete("/deletePassage/:id", passageController.deletePassage);
module.exports = router;
