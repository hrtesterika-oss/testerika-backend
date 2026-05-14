const express = require("express");
const QuestionCourseController = require("../controller/questionCourses.controller");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../middleware/fileUploader");

router.get("/", QuestionCourseController.findAll);
router.get("/:id", QuestionCourseController.findById);
router.delete("/:id", QuestionCourseController.delete);
router.put("/:id", QuestionCourseController.update);
router.post("/", QuestionCourseController.create);

module.exports = router;
