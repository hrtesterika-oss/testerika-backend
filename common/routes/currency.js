const express = require("express");
const currencyController = require("../controller/currency.controller");
const router = express.Router();
const auth = require("../middleware/auth");
// const { upload } = require("../middleware/fileUploader");

router.get('/', currencyController.findAll);
router.post('/', currencyController.create);
router.put('/:id', currencyController.update);
router.get('/:id', currencyController.findById);
router.delete('/:id', currencyController.delete);


module.exports = router;
