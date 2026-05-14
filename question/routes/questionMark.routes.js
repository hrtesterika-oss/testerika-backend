const express = require("express");
const QuestionMarkController = require("../controller/questionMarks.controller");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../middleware/fileUploader");

router.get("/", QuestionMarkController.findAll);
router.get("/:id", QuestionMarkController.findById);
router.delete("/:id", QuestionMarkController.delete);
router.put("/:id", QuestionMarkController.update);
router.post("/", QuestionMarkController.create);


module.exports = router;
