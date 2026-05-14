const express = require('express');
const router = express();
const packageController = require('../controller/package.controller');

router.route("/createUpdate").post(packageController.createUpdatepackage);
router.route("/get/packages").get(packageController.getPackages);
router.route("/get/packages/:id").get(packageController.getPackagesById);
router.route("/get/packages/getById/:id").get(packageController.getPackageById);
router.route("/delete/packages/:id").delete(packageController.deletePackageById);
router.route("/get/getAllSubPackages").get(packageController.getAllSubPackages);

//user router
router.route("/user/get/packages").get(packageController.getPackagesUser)
router.route("/user/get/package/:id/:hash/:user_id").get(packageController.getPackagesUsingSlugAndKey)
router.route("/user/cart/package/add").post(packageController.addPackageToCart)
router.route("/user/wishlist/package/add").post(packageController.addPackageToWishlist)
router.route("/user/wishlist/get/packages").get(packageController.getWishListPackagesUser)
router.route("/user/cart/get/packages").get(packageController.getCartListPackagesUser)


//home page api (Landing Page)
router.route("/home/get/packages").get(packageController.getPackagesHomePage)
router.route("/report/section").post(packageController.getReportSectionWIse)
router.route("/get/solution/section").post(packageController.getSolutionSection)



// Live Packages 
router.route("/live/user/get/packages").get(packageController.getLivePackagesUser)
router.route("/leaderboard/get").post(packageController.generateLeaderBoardForExamResultUsingBundleIdPackageId)

module.exports = router;