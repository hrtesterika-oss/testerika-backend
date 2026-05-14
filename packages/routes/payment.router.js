const express = require('express');
const router = express();
const paymentController = require('../controller/payment.controller');

router.route("/razorPayPaymentCheckout").post(paymentController.RazorPayPaymentCheckout)
router.route("/razorPayPaymentVerification").post(paymentController.RazorPayPaymentVerification)
router.route("/applyCoupon").post(paymentController.applyCoupon)
router.route("/getActivePackagesAndPasses/:user_id").get(paymentController.getAllActivePackagesAndPasses)
router.route("/getAllTransactionDetails/:user_id").get(paymentController.getAllTransactionDetails)
router.route("/admin/getAllTransactionDetails/:user_id").get(paymentController.adminGetAllTransactionDetails)


router.route("/checkPackageisAvailableForUserOrNot/:package_id/:subpackage_id/:exam_id/:user_id").get(paymentController.checkPackageIsAvailableForUserOrNot)
router.route("/getExamSectionExamDetail/:exam_id/:exam_key").get(paymentController.getExamSectionExamDetail)
router.route("/getExamSectionExamDetailWithAnswer/:exam_id/:exam_key").get(paymentController.getExamSectionExamDetailWIthAnswer)



//bundle API
router.route("/checkBundlePackageisAvailableForUserOrNot/:bundle_id/:package_id/:subpackage_id/:exam_id/:user_id").get(paymentController.checkBundlePackageIsAvailableForUserOrNot)


router.route("/generateReportForExamResult").post(paymentController.generateReportForExamResultUsingBundleIdPackageId)
router.route("/generateTScoreForAllUserAndReturnSpecificUser").post(paymentController.generateAllReportForExamResultUsingBundleIdPackageId)

router.route("/leaderboard/get").post(paymentController.generateLeaderBoardForExamResultUsingBundleIdPackageId)

// cashfree Payment Gateway API Integration
router.post("/cashfree-payment-checkout",paymentController.cashFreePaymentCheckOut)
router.get("/cashfree-payment-verification/:orderid",paymentController.cashFreePaymentVerification)

// payPal Payment Gateway API Integration
router.post("/paypal-payment-verification",paymentController.paypalPaymentVerification)
router.post("/add-payment-detail/add",paymentController.addPaymentDetail)


router.post("/admin/create/payment",paymentController.addPaymentDetailManually)

// reseller API 
router.post("/getAllPaymentDetails/user",paymentController.getAllPaymentDetailsUsingUserId)
router.route("/getPremiumUser/:status").get(paymentController.getAllPremiumOrExpiredUser)
router.route("/getPaymentDetailTodayLoginUser").post(paymentController.getTodayLoginUserViewStatus)




module.exports = router;