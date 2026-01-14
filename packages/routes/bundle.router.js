const express = require('express');
const router = express();
const bundleController = require('../controller/bundle.controller');

router.route("/createUpdate").post(bundleController.createUpdateBundle);
router.route("/get/bundlePackage").get(bundleController.getBundlePackage);
router.route("/get/bundlePackage/:id").get(bundleController.getBundlesById);
router.route("/get/bundlePackage/getById/:id").get(bundleController.getBundleById);
router.route("/delete/bundlePackage/:id").delete(bundleController.deleteBundleById);
router.route("/get/getAllPackages").get(bundleController.getAllPackages);
router.route("/getBundlePackagesUser").get(bundleController.getBundlePackagesUser)



router.route("/user/get/bundlePackage/:id/:hash/:user_id").get(bundleController.getBundlePackagesUsingSlugAndKey)

module.exports = router;