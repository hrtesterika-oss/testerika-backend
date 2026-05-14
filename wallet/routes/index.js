const express = require("express");
const router = express.Router();
const walletTransactionRoute = require("./walletTransaction");
const withdrawRequestRoute = require("./withdrawRequest");
const paymentSupportRoute = require("./paymentSupport");

router.use("/wallet", walletTransactionRoute);
router.use("/withdraw", withdrawRequestRoute);
router.use("/paymentSupport", paymentSupportRoute);


module.exports = router;
