const express = require("express");
const router = express.Router();
const advocayEmailTemplateController=require("../../controller/advocacyEmailController/email.template.controller")

router.post('/member/KYC/pending', advocayEmailTemplateController.memberKYCPending);
router.post('/vendor/KYC/pending', advocayEmailTemplateController.vendorKYCPending);
router.post('/member/KYC/verified', advocayEmailTemplateController.memberKYCVerified);
router.post('/vendor/KYC/verified', advocayEmailTemplateController.vendorKYCVerified);

module.exports = router;