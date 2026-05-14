const express = require("express");
const router = express.Router();
const userRoute = require("./user.routes");
const feedbackRoute = require('./feedback.routes')
const advocayEmailRouter=require("./advocayEmailRouter/email.template.router")
router.use("/user", userRoute);
router.use("/feedback", feedbackRoute);

router.use("/advocay/email/template",advocayEmailRouter)


module.exports = router;
