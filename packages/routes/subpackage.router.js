const express = require('express');
const router = express();
const subpackageController = require('../controller/subpackage.controller');

router.route("/createUpdate").post(subpackageController.createUpdateSubpackage);
router.route("/get/subPackages").get(subpackageController.getSubpackages);
router.route("/get/subPackages/:id").get(subpackageController.getSubpackagesById);
router.route("/get/subPackages/getById/:id").get(subpackageController.getSubpackageById);
router.route("/delete/subPackages/:id").delete(subpackageController.deleteSubPackageById);

module.exports = router;