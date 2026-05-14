const express = require("express");
const couponDatesController = require("../controller/couponDates.controller");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../middleware/fileUploader");

router.get('/', couponDatesController.findAll);
router.post('/', couponDatesController.create);
router.put('/:id', couponDatesController.update);
router.get('/:id', couponDatesController.findById);
router.delete('/:id', couponDatesController.delete);


module.exports = router;
