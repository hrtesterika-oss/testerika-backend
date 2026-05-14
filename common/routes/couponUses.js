const express = require("express");
const couponUsesController = require("../controller/couponUses.controller");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../middleware/fileUploader");

router.get('/', couponUsesController.findAll);
router.post('/', couponUsesController.create);
router.put('/:id', couponUsesController.update);
router.get('/:id', couponUsesController.findById);
router.delete('/:id', couponUsesController.delete);


module.exports = router;
