const express = require("express");
const QuestionVerifyController = require("../controller/questionVerify.controller");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../middleware/fileUploader");

router.get("/", QuestionVerifyController.findAll);
router.get("/:id", QuestionVerifyController.findById);
router.delete("/:id", QuestionVerifyController.delete);
router.put("/:id", QuestionVerifyController.update);
router.post("/", QuestionVerifyController.create);


module.exports = router;
