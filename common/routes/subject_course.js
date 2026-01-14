const express = require("express");
const subjectCourseController = require("../controller/subjectCourse.controller");
const router = express.Router();
const auth = require("../middleware/auth");
// const { upload } = require("../middleware/fileUploader");

router.get('/', subjectCourseController.findAll);
router.post('/', subjectCourseController.create);
router.put('/:id', subjectCourseController.update);
router.get('/:id', subjectCourseController.findById);
router.delete('/:id', subjectCourseController.delete);


module.exports = router;
