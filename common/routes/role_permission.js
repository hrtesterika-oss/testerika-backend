const express = require("express");
const rolePermissionController = require("../controller/rolePermission.controller");
const router = express.Router();
const auth = require("../middleware/auth");
// const { upload } = require("../middleware/fileUploader");

router.get('/', rolePermissionController.findAll);
router.post('/', rolePermissionController.create);
router.put('/:id', rolePermissionController.update);
router.get('/:id', rolePermissionController.findById);
router.delete('/:id', rolePermissionController.delete);


module.exports = router;
