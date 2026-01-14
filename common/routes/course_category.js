const express = require("express");
const courseCategoryController = require("../controller/courseCategory.controller");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../middleware/fileUploader");

router.get('/', courseCategoryController.findAll);
router.get('/getAll', courseCategoryController.getAll);
router.post('/', courseCategoryController.create);
router.put('/:id', courseCategoryController.update);
router.get('/:id', courseCategoryController.findById);
router.delete('/:id', courseCategoryController.delete);


module.exports = router;
