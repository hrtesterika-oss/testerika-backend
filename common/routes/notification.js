const express = require("express");
const NotificationContoller = require("../controller/notification.controller");
const router = express.Router();
const auth = require("../middleware/auth");
// const { upload } = require("../middleware/fileUploader");

router.get('/', NotificationContoller.findAll);
router.post('/', NotificationContoller.create);
router.put('/:id', NotificationContoller.update);
router.get('/:id', NotificationContoller.findById);
router.delete('/:id', NotificationContoller.delete);


module.exports = router;
