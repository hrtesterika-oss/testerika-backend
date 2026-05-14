const express = require("express");
const router = express.Router();
const quizRoute = require("./quiz.routes");
const quizTypeRoute = require('./quizType.routes')

router.use("/quiz", quizRoute);
router.use('/quizType', quizTypeRoute)


module.exports = router;
