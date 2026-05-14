const express = require("express");
const WalletTransactionController = require("../controller/walletTransaction.controller");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../middleware/fileUploader");

router.get('/', WalletTransactionController.findAll);
router.post('/', WalletTransactionController.create);
router.put('/:id', WalletTransactionController.update);
router.get('/:id', WalletTransactionController.findById);
router.delete('/:id', WalletTransactionController.delete);


module.exports = router;
