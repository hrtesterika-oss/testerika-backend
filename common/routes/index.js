const express = require("express");
const router = express.Router();
const sliderRoute = require("./slider");
const currencyRoute = require("./currency");
const optionRoute = require("./option");
const bookRoute = require("./book");
const couponRoute = require("./coupon");
const couponUsesRoute = require("./couponUses");
const couponDatesRoute = require("./couponDates");
const courseRoute = require("./course");
const courseCategoryRoute = require("./course_category");
const notificationRoute = require("./notification");
const dismissNotificationRoute = require("./dismissNotification");
const roleRoute = require("./role");
const rolePermissionRoute = require("./role_permission");
const permissionRoute = require("./permission");
const sponsorRoute = require("./sponsor");
const sponsorshipProgramRoute = require("./sponsorship_program");
const sponsorshipSubscriptionRoute = require("./sponsorship_subscription");
const staffRoute = require("./staff");
const staffPermissionRoute = require("./staff_permission");
const subjectRoute = require("./subject");
const subjectCourseRoute = require("./subject_course");
const passRoute=require("./passes")
router.use("/subject", subjectRoute);
router.use("/subjectCourse", subjectCourseRoute);

router.use("/staff", staffRoute);
router.use("/staffPermission", staffPermissionRoute);

router.use("/sponsor", sponsorRoute);
router.use("/program", sponsorshipProgramRoute);
router.use("/subscription", sponsorshipSubscriptionRoute);

router.use("/role", roleRoute);
router.use("/rolePermission", rolePermissionRoute);
router.use("/permission", permissionRoute);

router.use("/notification", notificationRoute);
router.use("/dismissNotification", dismissNotificationRoute);

router.use("/course", courseRoute);
router.use("/courseCategory", courseCategoryRoute);

router.use("/coupon", couponRoute);
router.use("/couponUses", couponUsesRoute);
router.use("/couponDates", couponDatesRoute);

router.use("/slider", sliderRoute);
router.use("/currency", currencyRoute);
router.use("/option", optionRoute);
router.use("/book", bookRoute);
router.use("/passes", passRoute);

module.exports = router;
