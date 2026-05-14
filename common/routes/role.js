const express = require("express");
const roleController = require("../controller/role.controller");
const router = express.Router();
const auth = require("../middleware/auth");
// const { upload } = require("../middleware/fileUploader");

router.get('/', roleController.findAll);
router.get('/roles', roleController.getRoles);
router.get('/permissions', roleController.findAllPermissions);
router.post('/', roleController.create);
router.put('/:id', roleController.update);
router.get('/:id', roleController.findById);
router.delete('/:id', roleController.delete);


module.exports = router;
