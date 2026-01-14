const express = require("express");
const passesController = require("../controller/passes.controller");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../middleware/fileUploader");

router.route("/passes/add").post(passesController.createPasses)
router.route("/passes").get(passesController.findAll)
router.route("/passes/:id").get(passesController.getPassesById)
router.route("/passes/:id").put(passesController.updatePassesById)
router.route("/passes/:id").delete(passesController.deletePassesById)
router.route("/getAllPass/users").get(passesController.getAllPasses)

router.route("/passes/category/add").post(passesController.createPassesCategory)
router.route("/passes/category/get").get(passesController.getAllPassCategory)
router.route("/passes/category/get/:id").get(passesController.getPassCategoryById)
router.route("/passes/category/delete/:id").delete(passesController.deletePassCategoryById)
router.route("/passes/category/update/:id").put(passesController.updatePassesCategory)
router.route("/passes/getAllPassType/get").get(passesController.getAllPassTypeDetail)
router.route("/findPassUsingId/:id").get(passesController.findPassesById)

router.route("/admin/get/passes").get(passesController.findAllPasses)
module.exports = router;
