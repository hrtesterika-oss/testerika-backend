const express = require("express");
const couponController = require("../controller/coupon.controller");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../middleware/fileUploader");

// router.get('/', couponController.findAll);
// // router.get('/download', couponController.download);
// router.post('/', couponController.create);
// router.put('/:id', couponController.update);
// router.get('/:id', couponController.findById);
// router.delete('/:id', couponController.delete);
// router.post('/update', couponController.updateCouponSetting);


router.route("/coupon/add").post(couponController.createCoupon)
router.route("/coupon").get(couponController.getAllCoupon)
router.route("/coupon/:id").get(couponController.getCouponById)
router.route("/coupon/:id").put(couponController.updateCouponById)
router.route("/coupon/:id").delete(couponController.deleteCouponById)
router.route("/coupon/check/:code").get(couponController.checkCouponByCode)
router.route("/getAllCoupon/get/:id/:email").get(couponController.getAllAuthorizedCouponForUser)
router.route("/apply/status/code").post(couponController.getCouponUsingCouponCode)
router.route("/reseller/sales").post(couponController.resellerSalesData)
router.route("/get/reseller/coupon/:id").get(couponController.getResellerCoupon)
router.route("/findAllSales/reseller/coupon/:id/:user_id").get(couponController.getAllSalesResellerCoupon)

// Admin Route 
router.route("/update/reseller/payment/status/:id").put(couponController.updateResellerSalesStatus)
router.route("/delete/reseller/payment/status/:id").delete(couponController.deleteResellerSalesStatus)
router.route("/getAllSalesUsingResellerId/:id").get(couponController.getAllResellerSales)

router.route("/resellerSalesCountDetails/:id").get(couponController.getAllResellerSalesCounter)
module.exports = router;
