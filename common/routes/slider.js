const express = require("express");
const sliderController = require("../controller/slider.controller");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../middleware/fileUploader");

router.get('/', sliderController.findAll);
router.post('/', upload.single('image'), sliderController.create);
router.put('/:id', upload.single('image'), sliderController.update);
router.get('/:id', sliderController.findById);
router.delete('/:id', sliderController.delete);

module.exports = router;
