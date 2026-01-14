const express = require("express");
const optionController = require("../controller/options.controller");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../middleware/fileUploader");

router.get('/', optionController.findAll);
router.post('/', optionController.create);
router.put('/', optionController.update);
router.get('/:name', optionController.findByName);
router.delete('/:id', optionController.delete);
router.post('/upload', upload.single('image'), optionController.upload)
router.route("/getAsideMenu/:id").get(optionController.getAuthorizedAsideMenu)
router.put('/:name', optionController.updateByName);

module.exports = router;
