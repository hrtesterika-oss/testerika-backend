const express = require("express");
const sponsorController = require("../controller/sponsor.controller");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../middleware/fileUploader");

router.get('/', sponsorController.findAll);
router.get('/sponsors', sponsorController.getAllSponsors)
router.post('/', sponsorController.create);
router.put('/:id', sponsorController.update);
router.get('/:id', sponsorController.findById);
router.delete('/:id', sponsorController.delete);


module.exports = router;
