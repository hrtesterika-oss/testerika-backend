const express = require("express");
const router = express.Router();
const questionRoute = require("./question.routes");
const questionBankRoute = require('./questionBank.routes')
const questionCourseRoute = require('./questionCourse.routes')
const questionHintRoute = require('./questionHint.routes')
const questionMarkRoute = require('./questionMark.routes')
const questionSolutionRoute = require('./questionSolution.routes')
const questionVerifyRoute = require('./questionVerify.routes')
const passageRoute=require("./passage.routes")
router.use("/question", questionRoute);
router.use('/questionBank', questionBankRoute)
router.use('/questionCourse', questionCourseRoute)
router.use('/questionHint', questionHintRoute)
router.use('/questionMark', questionMarkRoute)
router.use('/questionSolution', questionSolutionRoute)
router.use('/questionVerify', questionVerifyRoute)
router.use("/passage",passageRoute)

module.exports = router;
