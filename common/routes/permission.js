const express = require("express");
const permissionController = require("../controller/permission.controller");
const router = express.Router();
const auth = require("../middleware/auth");
// const { upload } = require("../middleware/fileUploader");

router.get('/', permissionController.findAll);
router.post('/', permissionController.create);
router.put('/:id', permissionController.update);
router.get('/:id', permissionController.findById);
router.delete('/:id', permissionController.delete);


module.exports = router;
