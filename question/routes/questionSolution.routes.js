const express = require("express");
const QuestionSolutionController = require("../controller/questionSolution.controller");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../middleware/fileUploader");

router.get("/", QuestionSolutionController.findAll);
router.get("/:id", QuestionSolutionController.findById);
router.delete("/:id", QuestionSolutionController.delete);
router.put("/:id", QuestionSolutionController.update);
router.post("/", QuestionSolutionController.create);


module.exports = router;
