const express = require("express");
const QuizTypeController = require("../controller/quizType.controller");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../middleware/fileUploader");

router.get("/", QuizTypeController.findAll);
router.get("/:id", QuizTypeController.findById);
router.delete("/:id", QuizTypeController.delete);
router.put("/:id", QuizTypeController.update);
router.post("/", QuizTypeController.create);


module.exports = router;
