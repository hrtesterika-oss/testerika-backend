const express = require("express");
const dismissNotificationContoller = require("../controller/dismissNotification.controller");
const router = express.Router();
const auth = require("../middleware/auth");
// const { upload } = require("../middleware/fileUploader");

router.get('/', dismissNotificationContoller.findAll);
router.post('/', dismissNotificationContoller.create);
router.put('/:id', dismissNotificationContoller.update);
router.get('/:id', dismissNotificationContoller.findById);
router.delete('/:id', dismissNotificationContoller.delete);


module.exports = router;
