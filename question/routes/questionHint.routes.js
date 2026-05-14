const express = require("express");
const QuestionHintController = require("../controller/questionHint.controller");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../middleware/fileUploader");

router.get("/", QuestionHintController.findAll);
router.get("/:id", QuestionHintController.findById);
router.delete("/:id", QuestionHintController.delete);
router.put("/:id", QuestionHintController.update);
router.post("/", QuestionHintController.create);


module.exports = router;
