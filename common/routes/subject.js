const express = require("express");
const SubjectController = require("../controller/subject.controller");
const router = express.Router();
const auth = require("../middleware/auth");
// const { upload } = require("../middleware/fileUploader");

router.get('/', SubjectController.findAll);
router.get('/getAll', SubjectController.getAll);
router.post('/', SubjectController.create);
router.put('/:id', SubjectController.update);
router.get('/:id', SubjectController.findById);
router.delete('/:id', SubjectController.delete);


module.exports = router;
