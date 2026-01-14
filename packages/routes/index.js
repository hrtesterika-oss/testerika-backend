const express = require('express');
const router = express();
const packageRouter = require('./package.router');
const subPackageRouter = require('./subpackage.router');
const bundleRouter=require("./bundle.router")
const examRouter=require("./exam.router")
const paymentRouter=require("./payment.router")
const doubtRouter=require("./doubt.router")
router.use("/package", packageRouter);
router.use("/subpackage", subPackageRouter);
router.use("/bundle", bundleRouter);
router.use("/exam", examRouter);
router.use("/payment",paymentRouter)
router.use("/doubt",doubtRouter)
module.exports = router;