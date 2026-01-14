const express = require("express");
const PaymentSupportController = require("../controller/paymentSupport.controller");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../middleware/fileUploader");

router.get('/', PaymentSupportController.findAll);
router.post('/', PaymentSupportController.create);
router.put('/:id', PaymentSupportController.update);
router.get('/:id', PaymentSupportController.findById);
router.delete('/:id', PaymentSupportController.delete);


module.exports = router;
