const express = require("express");
const userController = require("../controller/user.controller");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../middleware/fileUploader");
const checkUserAuthorizedOrNot = require("../middleware/auth");
router.get("/updateUserRoleStatus",userController.updateUserRoleStatus)
router.get("/getUserAndReseller",userController.getAllUsersAndResellers)
router.get("/", userController.findAll);
router.get("/getAll", userController.getAllUsers);
router.post("/sendEmailOtp", userController.sendEmailOtp);
router.post("/loginWithEmail", userController.loginWithEmail);
router.get("/:id", userController.findById);
router.delete("/:id", userController.delete);
router.put("/:id", userController.update);
router.post("/update", userController.updateFromAdmin);
router.post("/emailCreate", userController.emailCreate);
router.put("/updateTouchId/:id", userController.updateTouchId);
router.post("/uploadProfile", upload.single('image'), userController.uploadProfile);
router.get("/getAddress/:id", userController.findAllAddress);
router.post("/recordLoginActivity", auth, userController.recordLoginActivity);
router.post("/sendMobileOtp", userController.sendMobileOtp);
router.post("/verifyOtp", userController.verifyOtp);
router.post("/resendOtp", userController.resendOtp);
router.post("/updatePan/:id", userController.updatePan);
router.post("/updateUpi/:id", userController.updateUpi);
router.post("/updateBank/:id", userController.updateBank);
router.post("/getAllUserUsingId", userController.getAllUserUsingId)

// user route Started 

router.post("/registerOrLogin/sendOtp",userController.registerOrLoginOtpSendOnMobileNumber)
router.post("/registerOrLogin/verifyOtp",userController.registerOrLoginOtpVerify)
router.post("/reseller/registerOrLogin/verifyOtp",userController.registerOrLoginOtpVerifyReseller)


router.post("/complete/profile/:id",userController.completeProfile)
router.post("/upload-image",upload.single('image'),userController.uploadImageData) // done
router.post("/complete-profile/update-image/:id",userController.completeProfileUpdateImage) // done
router.post("/emailVerificationOTPSent",userController.emailVerificationOtpSent)
router.post("/emailVerificationOTPVerified",userController.emailVerificationOtpVerified)
router.post("/checkUserExistOrNot/:id",userController.checkUserExistOrNot)
router.post("/reseller/checkUserExistOrNot/:id",userController.checkUserExistOrNotReseller)

router.get("/getAllRegisteredUsers/users",userController.getAllRegisteredusersCoupon)
router.post("/update/user/status",userController.updateUserStatus)


router.get("/find/user/:user_id",userController.findUserByIdForPaymentDetail)

router.post("/getAllUsersUsingUserId",userController.getAllUsersUsingUserId)



// Reseller 
router.get("/reseller/get", userController.findAllReseller);

router.get("/today/registered/user",userController.todayRegisteredUser)
router.get("/login/today/user",userController.updateUserTodayLogin)

module.exports = router;
