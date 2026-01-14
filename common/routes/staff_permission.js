const express = require("express");
const staffPermissionController = require("../controller/staffPermission.controller");
const router = express.Router();
const auth = require("../middleware/auth");
// const { upload } = require("../middleware/fileUploader");

router.get('/', staffPermissionController.findAll);
router.post('/', staffPermissionController.create);
router.put('/:id', staffPermissionController.update);
router.get('/:id', staffPermissionController.findById);
router.delete('/:id', staffPermissionController.delete);


module.exports = router;
