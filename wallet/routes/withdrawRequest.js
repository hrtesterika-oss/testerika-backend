const express = require("express");
const WithdrawRequestController = require("../controller/withdrawRequest.controller");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../middleware/fileUploader");

router.get('/', WithdrawRequestController.findAll);
router.post('/', WithdrawRequestController.create);
router.put('/:id', WithdrawRequestController.update);
router.get('/:id', WithdrawRequestController.findById);
router.delete('/:id', WithdrawRequestController.delete);


module.exports = router;
