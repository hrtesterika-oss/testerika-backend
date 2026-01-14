const express = require("express");
const feedbackController = require("../controller/feedback.controller");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../middleware/fileUploader");

router.get("/", feedbackController.findAll);
router.get("/:id", feedbackController.findById);
router.delete("/:id", feedbackController.delete);
router.put("/:id", feedbackController.update);
router.post("/", feedbackController.create);


module.exports = router;
