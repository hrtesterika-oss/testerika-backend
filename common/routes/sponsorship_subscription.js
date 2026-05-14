const express = require("express");
const sponsorshipController = require("../controller/sponsorshipSubscription.controller");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../middleware/fileUploader");

router.get('/', sponsorshipController.findAll);
router.get('/sponsors', sponsorshipController.findAlllSponsors);

router.post('/', upload.single('bank_proof_url'), sponsorshipController.create);
router.put('/:id', sponsorshipController.update);
router.get('/:id', sponsorshipController.findById);
router.delete('/:id', sponsorshipController.delete);


module.exports = router;
