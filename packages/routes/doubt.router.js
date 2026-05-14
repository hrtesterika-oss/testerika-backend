const express = require('express');
const router = express();
const doubtController=require("../controller/doubt.controller")
router.route("/create").post(doubtController.createDoubt);
router.route("/updateDoubt/:id").put(doubtController.updateDoubt);
router.route("/getAllDoubt").get(doubtController.getAllDoubt)
router.route("/getMyDoubtById").get(doubtController.getMyDoubtById)
router.route("/getDoubtSolutionById").get(doubtController.getDoubtSolutionById)
router.route("/deleteDoubt/:id").delete(doubtController.deleteDoubt)
router.route("/deleteDoubtSolution/:doubt_id/:id/:userid").delete(doubtController.deleteDoubtSolution)
router.route("/createDoubtSolution").post(doubtController.createDoubtSolution)
router.route("/updateDoubtSolution/:doubt_id/:id/:userid").put(doubtController.updateDoubtSolution)
router.route("/updateDoubtStatus/:id/:userid").put(doubtController.updateDoubtStatus)
router.route("/updateDoubtSolutionStatus/:id/:userid/:doubt_id").put(doubtController.updateDoubtSolutionStatus)
router.route("/updateDoubtActiveStatus").put(doubtController.updateDoubtActiveStatus)
// router.route("/reportDoubt").post(doubtController.reportDoubt)
router.route("/addedToMyDoubt").post(doubtController.addedToMyDoubt)

router.route("/get/single/doubt/:id").get(doubtController.getSingleDoubtSolution)
router.route("/getAllDoubtCourseSubjectIds").get(doubtController.getAllDoubtsCoursesAndSubjectSId)
// router.route("/markDoubtAsReported/:id").put(doubtController.markDoubtAsReported)
module.exports = router;