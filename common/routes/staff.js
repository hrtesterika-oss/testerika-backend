const express = require("express");
const staffController = require("../controller/staff.controller");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../middleware/fileUploader");

router.get('/roles', staffController.getRoles);
// router.post('/', upload.single('profile_image'), staffController.create);




router.post("/upload-image",upload.single('image'),staffController.uploadImageData)
router.post("/media/upload",upload.single('image'),staffController.uploadMediaImageData)

router.route('/:id').get(staffController.findById);
router.route('/checkEmail').get(staffController.checkEmail);
router.route('/:id').delete(staffController.delete);
router.route('/').get(staffController.findAll);
router.route('/register').post(staffController.register);
router.route('/createNewStaff').post(staffController.createStaff);
router.route("/verify-otp").post(staffController.verifyOtp)
router.route('/login').post(staffController.login);
router.route("/resend-otp").post(staffController.resendOtp);
router.route("/:id").put(staffController.updateStaff)
router.route("/updateProfile/:id").put(staffController.update)

router.route("/forgot-password").post(staffController.forgotPassword)
router.route("/reset-password").post(staffController.restPassword)


module.exports = router;
