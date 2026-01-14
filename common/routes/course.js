const express = require("express");
const CourseController = require("../controller/course.controller");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../middleware/fileUploader");

router.get('/', CourseController.findAll);
router.get('/getAll', CourseController.getAll);
router.post('/', CourseController.create);
router.put('/:id', CourseController.update);
router.get('/:id', CourseController.findById);
router.delete('/:id', CourseController.delete);


module.exports = router;
