const axios = require("axios");
const Razorpay = require('razorpay');
const crypto = require('crypto');
const dbContext = require("../models/index")
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const Packages = dbContext.Packages
const SubPackageExams = dbContext.SubPackageExams
const Exams = dbContext.Exams
const ExamSections = dbContext.ExamSections
const ExamSectionQuestions = dbContext.ExamSectionQuestions
const BundlePackages = dbContext.BundlePackages
const Transactions = dbContext.Transactions
const Packagesales = dbContext.Packagesales
const ExamResults = dbContext.ExamResults
const ExamResultAnalysis = dbContext.ExamResultAnalysis
const ExamSectionResultAnalysis = dbContext.ExamSectionResultAnalysis
const { PAYMENT_GATEWAY_API_KEY, PASSES_API_URL, QUESTION_BANK_URL, QUESTION_URL, API_URL, USER_URL, COMMON_URL } = require("../services");
const nodemailer = require("nodemailer")


const emailTemplatePaymentSuccess = async (successResult, userid) => {
  if (successResult && userid) {
    const data2 = await axios.get(`${API_URL}/quizophy_icons_container`)
    const { data } = await axios.get(`${API_URL}/email_details`)
    const findUser = await axios.get(`${USER_URL}/find/user/${userid}`)
    if (findUser && findUser?.data?.data && data && data2) {
      var transporter = nodemailer.createTransport({
        // service: 'gmail',
        host: data.value.SMTP_Host,
        port: data.value.SMTP_Port,
        secure: true,
        auth: {
          user: data.value.Email,
          pass: data.value.SMTP_Password
        },
        tls: { rejectUnauthorized: false }

      });
      var mailOptions = {
        from: data.value.Email,
        to: findUser?.data?.data?.email,
        subject: 'testerika Payment Successful',

        html: `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <title>testerika Email Template</title>
    <style>
        body{
            color: white;
        }
        li{
            color: white;

        }
        span,ul,li,p,h1,h2,h3,h4,h5,h6{
            color:white
        }
        img{
            text-align: center;
        }
        h4{
            font-size: 18px;
            margin: 7px auto;
            color: white;
            text-align: center;
        }
        h6{
            font-size: 15px;
            margin: 7px auto;
            color: white;
            text-align: center;
        }
        a{
            text-decoration: none;
        }
        p{
            color: white;
            text-align: center;
        }
        .nav_logo_container{
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-direction: row;
            width: 100%;
        }
    </style>
</head>
<body>
     <div class="container">
         <div class="row">
             <div class="col-12 mx-auto my-5 text-center">
                 <div class="container" style="max-width: 400px;min-height: 120px;background-color: #12213b;padding: 20px 10px;border-radius: 10px;">
                      <div class="row">
                           <div class="col-12 d-flex justify-content-between" style="display: flex;justify-content: space-between;align-items: center;">
                                 <div class="nav_logo_container">
                                    <a href="https://testerika.com" style="display: inline-block;" target="_blank">
                                        <img style="width: 100px;" alt="testerika" src=${data2.data.value.quizophy_light_logo}>
                                    </a>
                                    <ul class="" style="display: flex;flex-direction: row;align-items:center;justify-content: flex-end;list-style-type: none;margin: auto;">
                                        <li class="nav-item" style="list-style-type: none;">
                                          <a class="nav-link text-white" href="https://lms.testerika.com" style="padding: 4px;font-size: 13px;color: white;font-weight: 600;">Home</a>
                                        </li>
                                        <li class="nav-item">
                                          <a class="nav-link text-white" href="https://lms.testerika.com/quizzes" style="padding: 4px;font-size: 13px;color: white;font-weight: 600;">Quizzes</a>
                                        </li>
                                        <li class="nav-item">
                                          <a class="nav-link text-white" href="https://lms.testerika.com/packages" style="padding: 4px;font-size: 13px;color: white;font-weight: 600;">Packages</a>
                                        </li>
                                      </ul>
                                    </div>
                           </div>
                           <hr style="margin: 15px auto;width: 100%;"/>

                           <div  class="col-12" style="align-items: center;margin: auto;">
                                <h4>Hi, ${findUser?.data?.data?.firstname + " " + findUser?.data?.data?.lastname}</h4>
                                <h4>Payment Successful</h4>
                                <p style="text-align: center;margin: 2px auto;">
                                    <img src="https://cdn-icons-png.flaticon.com/512/7518/7518748.png" style="width: 70px;height: 70px;border-radius: 50%"/>
                                </p>
                                <h6>${successResult?.currency}: ${successResult?.amount}</h6>
                                <h6>Transaction ID: ${successResult?.transaction_id}</h6>
                                <h6>Payment Method: ${successResult?.payment_method}</h6>
                           </div> 

                           <hr style="margin: 15px auto;width: 100%;"/>
                           <div class="col-12" style="display: flex;justify-content: space-between;align-items: center;">
                               <footer style="margin: auto;text-align: center;">
                                    <div style="text-align: center;margin: 10px auto;">
                                         <a href="https://www.facebook.com/testerika" target="_blank" style="text-decoration: none;">
                                            <img style="width: 20px;height: 20px;" src="https://cdn-icons-png.flaticon.com/512/5968/5968764.png">
                                         </a>
                                         <a href="https://twitter.com/i/flow/login?redirect_after_login=%2Ftesterika"  target="_blank" style="margin-left: 4px;text-decoration: none;">
                                            <img style="width: 20px;height: 20px;"  src="https://cdn-icons-png.flaticon.com/512/3670/3670151.png">
                                         </a>
                                         <a href="https://www.linkedin.com/company/testerika/" target="_blank" style="margin-left: 4px;text-decoration: none;">
                                            <img style="width: 20px;height: 20px;"  src="https://cdn-icons-png.flaticon.com/512/145/145807.png">
                                         </a>
                                         <a href="https://www.youtube.com/@testerika" target="_blank" style="margin-left: 4px;text-decoration: none;">
                                            <img style="width: 20px;height: 20px;"  src="https://cdn-icons-png.flaticon.com/512/3670/3670147.png">
                                         </a>
                                    </div>
                                    <div>
                                         <p style="font-size: 12px;">testerika is a cutting-edge online quiz gaming platform that provides its users with the opportunity to explore their knowledge, learn new things, and have fun at the same time. At testerika, we believe that learning should not be boring, which is why we have created an interactive and engaging platform that offers various quizzes on different topics, such as Salesforce quizzes, UPSC quizzes, and many more.</p>
                                         <div>
                                            <a href="https://www.testerika.com/privacy-policy" target="_blank" style="font-size: 12px;color: #1877f2;text-decoration: none; margin-right: 4px;cursor: pointer;">Privacy & Policy</a>
                                            <a href="https://www.testerika.com/terms-conditions" target="_blank" style="font-size: 12px;color: #1877f2;text-decoration: none; margin-left: 4px;cursor: pointer;">Terms & Conditions</a>
                                         </div>
                                         <div>
                                            <a href="mailto:support@testerika.com" style="font-size: 12px;color: #1877f2;text-decoration: none; margin: 6px auto;">
                                                support@testerika.com
                                            </a>
                                         </div>
                                    </div>
                               </footer>
                           </div>
                           <hr style="margin: 15px auto;width: 100%;"/>


                           <div class="col-12" style="display: flex;justify-content: space-between;align-items: center;">
                            <footer style="margin: auto;text-align: center;">
                                <a href="https://testerika.com" target="_blank">
                                    <img style="width: 150px;" alt="testerika" src=${data2.data.value.quizophy_light_logo}>
                                </a>
                            </footer>
                        </div>

                      </div>
                 </div>
             </div>
         </div>
     </div>
</body>
</html>
        `
      };

      transporter.sendMail(mailOptions, function (error, info) {

      });
    }
  }
}
exports.RazorPayPaymentCheckout = async (req, res) => {
  try {
    const { payableAmount, packageDetail, userDetail, currency, couponDetail, couponDiscount, type } = req.body
    let public_key = "rzp_live_RXNHXJ3IB7uwpr"
    let secret_key = "tGas7LPM7KSa6p3EDWyo4v2q"
    const instance = new Razorpay({
      key_id: public_key,
      key_secret: secret_key,
    })
    let amountToPay = (Number(payableAmount) > 0 && Number(couponDiscount) > 0 && couponDetail) ? Number(payableAmount) : currency == "INR" ? Number(packageDetail?.price_inr) : packageDetail?.price_usd
    const options = {
      amount: Math.round(Number(amountToPay * 100)),
      currency,
    };
    const order = await instance.orders.create(options);
    if (order && order.id) {
      let findData = await Transactions.findOne({
        where: {
          userid: userDetail?.id,
          transactionid: {
            [Op.eq]: null
          },
          payment_status: "created",
          active: 0
        },
        attributes: ["id", "orderid", "userid"]
      })

      if (findData) {
        let payload = undefined
        if (type == "Pass") {

          payload = {
            packageid: null,
            passid: packageDetail?.id,
            bundleid: null,
            couponid: couponDetail ? couponDetail?.id : null,
            orderid: order?.id,
            currency,
            active: 0,
            payment_method: "RazorPay",
            payment_status: order?.status,
            total_amount: currency == "INR" ? packageDetail?.price_inr : packageDetail?.price_usd,
            coupon_discount: (payableAmount > 0 && couponDetail && couponDiscount > 0) ? couponDiscount : null,
            payable_amount: (payableAmount > 0 && couponDetail && couponDiscount > 0) ? payableAmount : currency == "INR" ? packageDetail?.price_inr : packageDetail?.price_usd
          }

        }
        else if (type == "Package") {
          payload = {
            passid: null,
            packageid: packageDetail?.id,
            bundleid: null,
            couponid: couponDetail ? couponDetail?.id : null,
            orderid: order?.id,
            currency,
            active: 0,
            payment_method: "RazorPay",
            payment_status: order?.status,
            total_amount: currency == "INR" ? packageDetail?.price_inr : packageDetail?.price_usd,
            coupon_discount: (payableAmount > 0 && couponDetail && couponDiscount > 0) ? couponDiscount : null,
            payable_amount: (payableAmount > 0 && couponDetail && couponDiscount > 0) ? payableAmount : currency == "INR" ? packageDetail?.price_inr : packageDetail?.price_usd
          }
        }
        else if (type == "Bundle") {
          payload = {
            passid: null,
            packageid: null,
            bundleid: packageDetail?.id,
            couponid: couponDetail ? couponDetail?.id : null,
            orderid: order?.id,
            currency,
            active: 0,
            payment_method: "RazorPay",
            payment_status: order?.status,
            total_amount: currency == "INR" ? packageDetail?.price_inr : packageDetail?.price_usd,
            coupon_discount: (payableAmount > 0 && couponDetail && couponDiscount > 0) ? couponDiscount : null,
            payable_amount: (payableAmount > 0 && couponDetail && couponDiscount > 0) ? payableAmount : currency == "INR" ? packageDetail?.price_inr : packageDetail?.price_usd
          }
        }
        [, updatedTransaction] = await Transactions.update({
          ...payload
        }, {
          where: {
            id: findData?.id,
            userid: findData?.userid
          }
        })
        return res.status(200).json({
          success: true,
          order
        })
      } else {
        let payload = undefined
        if (type == "Pass") {
          payload = {
            packageid: null,
            userid: userDetail?.id,
            passid: packageDetail?.id,
            bundleid: null,
            couponid: couponDetail ? couponDetail?.id : null,
            orderid: order?.id,
            currency,
            active: 0,
            payment_method: "RazorPay",
            payment_status: order?.status,
            total_amount: currency == "INR" ? packageDetail?.price_inr : packageDetail?.price_usd,
            coupon_discount: (payableAmount > 0 && couponDetail && couponDiscount > 0) ? couponDiscount : null,
            payable_amount: (payableAmount > 0 && couponDetail && couponDiscount > 0) ? payableAmount : currency == "INR" ? packageDetail?.price_inr : packageDetail?.price_usd
          }
        }
        else if (type == "Package") {
          payload = {
            passid: null,
            userid: userDetail?.id,
            packageid: packageDetail?.id,
            bundleid: null,
            couponid: couponDetail ? couponDetail?.id : null,
            orderid: order?.id,
            currency,
            active: 0,
            payment_method: "RazorPay",
            payment_status: order?.status,
            total_amount: currency == "INR" ? packageDetail?.price_inr : packageDetail?.price_usd,
            coupon_discount: (payableAmount > 0 && couponDetail && couponDiscount > 0) ? couponDiscount : null,
            payable_amount: (payableAmount > 0 && couponDetail && couponDiscount > 0) ? payableAmount : currency == "INR" ? packageDetail?.price_inr : packageDetail?.price_usd
          }
        }
        else if (type == "Bundle") {
          payload = {
            passid: null,
            userid: userDetail?.id,
            packageid: null,
            bundleid: packageDetail?.id,
            couponid: couponDetail ? couponDetail?.id : null,
            orderid: order?.id,
            currency,
            active: 0,
            payment_method: "RazorPay",
            payment_status: order?.status,
            total_amount: currency == "INR" ? Number(packageDetail?.price_inr) : packageDetail?.price_usd,
            coupon_discount: (payableAmount > 0 && couponDetail && couponDiscount > 0) ? couponDiscount : null,
            payable_amount: (payableAmount > 0 && couponDetail && couponDiscount > 0) ? payableAmount : currency == "INR" ? packageDetail?.price_inr : packageDetail?.price_usd
          }
        }
        let createdTransaction = await Transactions.create({
          ...payload
        })
        return res.status(200).json({
          success: true,
          order
        })
      }

    }
  } catch (err) {
    console.log(err)
    return res.status(200).json({
      success: false,
      message: err?.error?.description
    })
  }
}
// new code 

exports.RazorPayPaymentVerification = async (req, res) => {
  try {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    let public_key = "rzp_live_RXNHXJ3IB7uwpr"
    let secret_key = "tGas7LPM7KSa6p3EDWyo4v2q"
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", secret_key)
      .update(body.toString())
      .digest("hex");


    const isAuthentic = expectedSignature === razorpay_signature;
    if (isAuthentic) {
      let findData = await Transactions.findOne({
        where: {
          orderid: razorpay_order_id,
          active: 0
        }
      })
      let expiryDateAndTime = new Date();
      if (findData && findData?.packageid && !findData?.bundleid && !findData?.passid) {
        expiryDateAndTime.setFullYear(expiryDateAndTime.getFullYear() + 1)
      }
      else if (findData && findData?.bundleid && !findData?.passid && !findData?.packageid) {
        expiryDateAndTime.setFullYear(expiryDateAndTime.getFullYear() + 1)
      }
      // else if(setExpTimeType==="Yearly"){
      //   expiryDateAndTime.setFullYear(expiryDateAndTime.getFullYear() + 1)
      //   expiryDateAndTime.setMonth(expiryDateAndTime.getMonth() + 2)
      // }
      // else if(setExpTimeType==="Adds-On"){
      //   expiryDateAndTime.setMonth(expiryDateAndTime.getMonth() + 1)
      // }else{
      //   expiryDateAndTime.setDate(expiryDateAndTime.getDate() + 1)
      // }
      if (findData) {
        if (!findData?.packageid && !findData?.bundleid && findData?.passid) {
          const { data } = await axios.get(`${PASSES_API_URL}/findPassUsingId/${findData?.passid}`)
          if (data && data?.data) {
            let duration = Number(data?.data?.duration?.split(" ")[0])
            if (duration && duration > 0) {
              expiryDateAndTime.setMonth(expiryDateAndTime.getMonth() + duration)
            }
            await Transactions.update({
              active: 1,
              payment_status: "success",
              transactionid: razorpay_payment_id,
              buydate: new Date(),
              expirydate: expiryDateAndTime
            }, {
              where: {
                id: findData?.id,
                userid: findData?.userid
              }
            })

            let findOneData = await Transactions.findOne({
              where: {
                orderid: razorpay_order_id,
                active: 1,
                transactionid: razorpay_payment_id,
                userid: findData?.userid
              }
            })
            if (findOneData) {

              const createSales = await Packagesales.create({
                packageid: findOneData?.packageid,
                userid: findOneData?.userid,
                passid: findOneData?.passid,
                bundleid: findOneData?.bundleid,
                // couponid: findOneData?.couponid,
                transactionid: findOneData?.transactionid,
                currency: findOneData?.currency,
                active: 1,
                amount: findOneData?.payable_amount,
                payment_method: findOneData?.payment_method,
                buydate: findOneData?.buydate,
                expirydate: findOneData?.expirydate,
                transaction_id: findOneData?.id
              })
              if (createSales) {
                if (findOneData?.couponid) {
                  const reseller = await axios.post(`${COMMON_URL}/coupon/reseller/sales`, { userid: createSales?.userid, couponid: findOneData?.couponid, transactionid: createSales?.id })
                }
                // const resellerData=await ResellerSales.create({
                //   user_id:
                // })
                let successResult = {
                  currency: findOneData?.currency,
                  payment_method: "RazorPay",
                  amount: findOneData?.payable_amount,
                  transaction_id: razorpay_payment_id
                }
                emailTemplatePaymentSuccess(successResult, findOneData?.userid)
                res.redirect(
                  `https://www.testerika.com/dashboard/payment-success?reference=${razorpay_payment_id}`,
                )
              }
            }
          } else {
            console.log("Error redirect")
            res.redirect(
              `https://www.testerika.com/dashboard/payment-failed`,
            )
          }
        } else {
          await Transactions.update({
            active: 1,
            payment_status: "success",
            transactionid: razorpay_payment_id,
            buydate: new Date(),
            expirydate: expiryDateAndTime
          }, {
            where: {
              id: findData?.id,
              userid: findData?.userid
            }
          })

          let findOneData = await Transactions.findOne({
            where: {
              orderid: razorpay_order_id,
              active: 1,
              transactionid: razorpay_payment_id,
              userid: findData?.userid
            }
          })
          if (findOneData) {
            const createSales = await Packagesales.create({
              packageid: findOneData?.packageid,
              userid: findOneData?.userid,
              passid: findOneData?.passid,
              bundleid: findOneData?.bundleid,
              // couponid: findOneData?.couponid,
              transactionid: findOneData?.transactionid,
              currency: findOneData?.currency,
              active: 1,
              amount: findOneData?.payable_amount,
              payment_method: findOneData?.payment_method,
              buydate: findOneData?.buydate,
              expirydate: findOneData?.expirydate,
              transaction_id: findOneData?.id
            })
            if (createSales) {
              if (findOneData?.couponid) {
                const reseller = await axios.post(`${COMMON_URL}/coupon/reseller/sales`, { userid: createSales?.userid, couponid: findOneData?.couponid, transactionid: createSales?.id })
              }
              let successResult = {
                currency: findOneData?.currency,
                payment_method: "RazorPay",
                amount: findOneData?.payable_amount,
                transaction_id: razorpay_payment_id
              }
              emailTemplatePaymentSuccess(successResult, findOneData?.userid)
              res.redirect(
                `https://www.testerika.com/dashboard/payment-success?reference=${razorpay_payment_id}`,
              )
            }
          }
        }

      } else {
        res.redirect(
          `https://www.testerika.com/dashboard/payment-failed`,
        )
      }
    } else {
      res.redirect(
        `https://www.testerika.com/dashboard/payment-failed`,
      )
    }
  } catch (err) {
    res.redirect(
      `https://www.testerika.com/dashboard/payment-failed`,
    )
  }
}

exports.applyCoupon = async (req, res) => {
  try {
    const { data, userId, packageId, passId, bundleId, currency, passData } = req.body
    let flag = false
    let buyDetail = undefined
    if (packageId != "undefined" && typeof packageId != "undefined" && packageId) {
      buyDetail = await Packages.findOne({
        where: {
          id: packageId
        }
      })
    }
    else if (bundleId != "undefined" && typeof bundleId != "undefined" && bundleId) {
      buyDetail = await BundlePackages.findOne({
        where: {
          id: bundleId
        }
      })
    }
    else if (passId != "undefined" && typeof passId != "undefined" && passId) {
      buyDetail = passData
    }

    if (buyDetail) {
      if (currency == "INR") {
        if (data && Math.ceil(Number(buyDetail?.price_inr)) < data?.min_order_amount_inr) {
          return res.status(200).json({
            success: false,
            message: `Coupon is valid for Minimum ${data?.min_order_amount_inr} ${currency} purchase.`
          })
        }
      }
      else if (currency == "USD") {
        if (data && Math.ceil(Number(buyDetail?.price_usd)) < data?.min_order_amount_usd) {
          return res.status(200).json({
            success: false,
            message: `Coupon is valid for Minimum ${data?.min_order_amount_usd} ${currency} purchase.`
          })
        }
      }

      if (data) {
        let finddetailUser = data?.user_id
        let flag2 = false
        if (data?.reseller == 1) {
          flag2 = true
        }
        finddetailUser?.map((item, index) => {
          if (item?.value == "Everyone" || item?.value?.split("-")[0] == userId) {
            flag2 = true
          }
        })
        if (!flag2) {
          return res.status(200).json({
            success: false,
            message: "Invalid Coupon Code"
          })
        }
      }

      // calculating How many times Coupon has been Used till Now
      const countedRows = await Transactions.findAll({
        where: {
          couponid: data.id,
          active: 1
        },
        attributes: ["id", "couponid"],
        // group: ['coupon_id'],
      })

      // calculating How many times Coupon has been Used till Now (for Particular user)
      const countedRowsUser = await Transactions.findAll({
        where: {
          couponid: data.id,
          userid: userId,
          active: 1
        }
      })
      let count_coupon_used_by_user = 0
      let count_coupon_used_by_user_total = 0
      let ids = countedRows.map((x) => x.transaction_id)
      ids = ids.filter((item) => item != null)
      let ids2 = countedRowsUser.map((x) => x.transaction_id)
      ids2 = ids2.filter((item) => item != null)

      //used by Total users
      let transactionDetails2 = await Packagesales.findAll({
        where: {
          transaction_id: ids
        }
      })
      if (transactionDetails2?.length > 0) {
        count_coupon_used_by_user_total = transactionDetails2?.length
      }
      //used by One user
      let transactionDetails = await Packagesales.findAll({
        where: {
          transaction_id: ids2
        }
      })
      if (transactionDetails?.length > 0) {
        count_coupon_used_by_user = transactionDetails?.length
      }


      if (data) {
        let error = true
        let count = 0
        let applyPurchase = data?.apply_for_purchase

        if (count_coupon_used_by_user && count_coupon_used_by_user > 0) {
          applyPurchase?.map((item) => {
            let totalRows = count_coupon_used_by_user
            if (item?.value == "Everytime" || Number(item?.value) == totalRows + 1) {
              count = 0
              error = false
            } else {
              if (count <= totalRows)
                count = Number(item?.value)
            }
          })
          if (error) {
            return res.status(200).json({
              success: false,
              message: `You can used this coupon on ${count} purchase.`
            })
          }
        } else {
          applyPurchase?.map((item) => {
            if (item?.value == "Everytime" || Number(item?.value) == 1) {
              count = 0
              error = false
            } else {
              if (count <= 1)
                count = Number(item?.value)
            }
          })
          if (error) {
            return res.status(200).json({
              success: false,
              message: `You can used this coupon on ${count} purchase.`
            })
          }
        }
      }

      if (!countedRows?.length) {
        if (data?.max_user_limit > 0 && data?.max_used_by_one_user > 0) {
          flag = true
        } else {
          return res.status(200).json({
            success: false,
            message: "Coupon is exceeded Maximum user limit."
          })
        }
      }
      else if (count_coupon_used_by_user > 0 && count_coupon_used_by_user >= Number(data?.max_used_by_one_user)) {
        return res.status(200).json({
          success: false,
          message: `Already used this coupon! You can only used ${data?.max_used_by_one_user} times this coupon.`
        })
      }
      else if (count_coupon_used_by_user_total >= data?.max_user_limit) {
        return res.status(200).json({
          success: false,
          message: "Coupon is exceeded Maximum user limit."
        })
      }

      else if (count_coupon_used_by_user_total < data?.max_user_limit) {
        if (count_coupon_used_by_user < data?.max_used_by_one_user) {
          flag = true
        }
        else {
          return res.status(200).json({
            success: false,
            message: `Already used this coupon! You can only used ${data?.max_used_by_one_user} times this coupon.`
          })
        }
      }

      let find_coupon_amount = 0
      let find_payable_amount = undefined
      if (currency == "INR") {
        find_payable_amount = Number(buyDetail?.price_inr)
      } else {
        find_payable_amount = Number(buyDetail?.price_usd)
      }
      if (flag) {
        let discount_percentage = 0
        if (currency == "INR") {
          discount_percentage = data.discount_percentage_inr
          find_coupon_amount = Number((Number(Number(buyDetail?.price_inr)) / 100) * discount_percentage).toFixed(2)
          find_payable_amount = Number(Number(Number(buyDetail?.price_inr)) - find_coupon_amount).toFixed(2)
        }
        else if (currency == "USD") {
          discount_percentage = data.discount_percentage_usd
          find_coupon_amount = Number((Number(Number(buyDetail?.price_usd)) / 100) * discount_percentage).toFixed(2)
          find_payable_amount = Number(Number(Number(buyDetail?.price_usd)) - find_coupon_amount).toFixed(2)
        }
      }
      else {
        if (currency == "INR") {
          find_payable_amount = Number(buyDetail?.price_inr)
        } else {
          find_payable_amount = Number(buyDetail?.price_usd)
        }
      }
      return res.status(200).json({
        success: true,
        find_payable_amount: find_payable_amount,
        find_coupon_amount: find_coupon_amount
      })
    }
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.getAllActivePackagesAndPasses = async (req, res) => {
  try {
    const { user_id } = req.params
    const data = await Packagesales.findAll({
      where: {
        userid: user_id,
        expirydate: {
          [Op.gte]: new Date()
        },
        active: 1
      },
      attributes: ["id", "userid", "packageid", "bundleid", "passid", "transactionid", "amount", "currency", "payment_method", "buydate", "expirydate"]
    })

    if (data && data?.length > 0) {

      return res.status(200).json({
        success: true,
        data
      })
    } else {
      return res.status(200).json({
        success: false,
        data: []
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false
    })
  }
}

exports.getAllTransactionDetails = async (req, res) => {
  try {
    const { user_id } = req.params
    const data = await Packagesales.findAll({
      where: {
        userid: user_id
      },
      attributes: ["id", "userid", "packageid", "bundleid", "passid", "transactionid", "amount", "currency", "payment_method", "buydate", "expirydate"],
      order: [["id", "DESC"]],
      include: [
        {
          model: Transactions,
          attributes: ["id", "total_amount", "payable_amount", "coupon_discount", "orderid"]
        }
      ]
    })

    if (data && data?.length > 0) {
      return res.status(200).json({
        success: true,
        data
      })
    } else {
      return res.status(200).json({
        success: false,
        data: []
      })
    }
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}
exports.adminGetAllTransactionDetails = async (req, res) => {
  try {
    const { user_id } = req.params
    const data = await Transactions.findAll({
      where: {
        userid: user_id
      },
      attributes: ["id", "userid", "packageid", "bundleid", "passid", "transactionid", "total_amount", "currency", "payment_method", "payment_status", "buydate", "expirydate"],
      order: [["id", "DESC"]],
      include: [
        {
          model: Packagesales,
          attributes: ["id", "transaction_id", "buydate", "transactionid", "expirydate", "amount", "currency", "payment_method"],
          required: false,
          as: "sales"
        }
      ]
    })


    const findAllPackages = await Packages.findAll({
      attributes: ["id", "name"]
    })

    if (data && data?.length > 0) {
      return res.status(200).json({
        success: true,
        data,
        packages: findAllPackages
      })
    } else {
      return res.status(200).json({
        success: true,
        data: [],
        packages: findAllPackages
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false
    })
  }
}


exports.checkPackageIsAvailableForUserOrNot = async (req, res) => {
  try {
    const { package_id, subpackage_id, exam_id, user_id } = req.params

    const findPackage = await Packages.findOne({
      where: {
        id: package_id,
        live: 1,
        result_publish_date: {
          [Op.gt]: new Date(), // Only future result publish dates
        },
      },
    });

    if (findPackage) {
      return res.status(200).json({
        success: false
      })
    } else {
      const findExamStatus = await SubPackageExams.findOne({
        where: {
          examid: exam_id,
          subpackageid: subpackage_id,
          type: "Free"
        }
      })
      if (findExamStatus && findExamStatus?.id) {
        return res.status(200).json({
          success: true
        })
      } else {
        const findPackage = await Packages.findOne({
          where: {
            id: package_id
          },
          attributes: ["id", "name", "type", "premiumType"]
        })
        const findActivePasses = await Packagesales.findOne({
          where: {
            userid: user_id,
            passid: {
              [Op.ne]: null
            },
            bundleid: {
              [Op.eq]: null
            },
            packageid: {
              [Op.eq]: null
            },
            expirydate: {
              [Op.gte]: new Date()
            }
          },
          order: [["id", "DESC"]],
          attributes: ["id", "userid", "passid", "transactionid", "transaction_id", "expirydate"]
        })
        if (findActivePasses && findActivePasses?.id) {
          if (findPackage && findPackage?.premiumType == 0) {
            return res.status(200).json({
              success: true
            })
          } else {
            const checkPackageIsActiveOrNot = await Packagesales.findOne({
              where: {
                packageid: package_id,
                userid: user_id,
                expirydate: {
                  [Op.gte]: new Date()
                }
              },
              attributes: ["id", "userid", "packageid", "transactionid", "transaction_id", "expirydate"]
            })
            if (checkPackageIsActiveOrNot && checkPackageIsActiveOrNot?.id) {
              return res.status(200).json({
                success: true
              })
            } else {
              return res.status(200).json({
                success: false
              })
            }
          }
        }
        else {
          const checkPackageIsActiveOrNot = await Packagesales.findOne({
            where: {
              packageid: package_id,
              userid: user_id,
              expirydate: {
                [Op.gte]: new Date()
              }
            },
            attributes: ["id", "userid", "packageid", "transactionid", "transaction_id", "expirydate"]
          })
          if (checkPackageIsActiveOrNot && checkPackageIsActiveOrNot?.id) {
            return res.status(200).json({
              success: true
            })
          } else {
            return res.status(200).json({
              success: false
            })
          }
        }
      }
    }

  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}
exports.getExamSectionExamDetail = async (req, res) => {
  try {
    const { exam_id, exam_key } = req.params
    let exam = await Exams.findOne({
      where: {
        id: exam_id
      },
      order: [["id", "ASC"]],
      include: [
        {
          model: ExamSections,
          as: "examsections",
          required: true,
          order: [["id", "ASC"]],
          attributes: ["id", "examid", "subjectid", "section_name", "duration", "instruction_duration", "instruction", "memoryTest", "memoryQuestion", "memory_duration"],
          include: [
            {
              model: ExamSectionQuestions,
              required: true,
              as: "questions",
              order: [["id", "ASC"]],
              attributes: ["id", "examsectionid", "question_bank_id"]
            }
          ]
        }
      ]
    })
    if (exam) {
      let examSorted = exam.examsections?.sort((a, b) => {
        if (a.id < b.id) {
          return -1
        } else {
          return 0
        }
      })

      exam.examsections = examSorted?.slice()
      let questionBankIds = []
      exam?.examsections?.map((item) => {
        if (item?.questions && item?.questions?.length > 0) {
          item?.questions?.map((item2) => {
            if (!questionBankIds?.includes(item2?.question_bank_id)) {
              questionBankIds.push(item2?.question_bank_id)
            }
          })
        }
      })

      if (questionBankIds?.length > 0) {
        // console.log(questionBankIds)
        const { data } = await axios.post(`${QUESTION_BANK_URL}/getAllQuestionsUsingQuestionBankIds`, { questionBankIds })
        if (data?.success) {
          return res.status(200).json({
            success: true,
            questions: data?.data,
            exam
          })
        } else {
          return res.status(200).json({
            success: false,
          })
        }

      } else {
        return res.status(200).json({
          success: false
        })
      }

    } else {
      return res.status(200).json({
        success: false
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false
    })
  }
}



exports.getExamSectionExamDetailWIthAnswer = async (req, res) => {
  try {
    const { exam_id, exam_key } = req.params
    let exam = await Exams.findOne({
      where: {
        id: exam_id
      },
      order: [["id", "ASC"]],
      include: [
        {
          model: ExamSections,
          as: "examsections",
          required: true,
          order: [["id", "ASC"]],
          attributes: ["id", "examid", "subjectid", "section_name", "duration", "instruction", "instruction_duration", "memoryTest", "memoryQuestion", "memory_duration"],
          include: [
            {
              model: ExamSectionQuestions,
              required: true,
              as: "questions",
              order: [["id", "ASC"]],
              attributes: ["id", "examsectionid", "question_bank_id"]
            }
          ]
        }
      ]
    })
    if (exam) {
      let examSorted = exam.examsections?.sort((a, b) => {
        if (a.id < b.id) {
          return -1
        } else {
          return 0
        }
      })

      exam.examsections = examSorted?.slice()
      let questionBankIds = []
      exam?.examsections?.map((item) => {
        if (item?.questions && item?.questions?.length > 0) {
          item?.questions?.map((item2) => {
            if (!questionBankIds?.includes(item2?.question_bank_id)) {
              questionBankIds.push(item2?.question_bank_id)
            }
          })
        }
      })

      if (questionBankIds?.length > 0) {
        const { data } = await axios.post(`${QUESTION_BANK_URL}/getAllQuestionsWithAnswerUsingQuestionBankIds`, { questionBankIds })
        if (data?.success) {
          return res.status(200).json({
            success: true,
            questions: data?.data,
            exam
          })
        } else {
          return res.status(200).json({
            success: false,
          })
        }

      } else {
        return res.status(200).json({
          success: false
        })
      }

    } else {
      return res.status(200).json({
        success: false
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false
    })
  }
}



//bundle API
exports.checkBundlePackageIsAvailableForUserOrNot = async (req, res) => {
  try {
    const { bundle_id, package_id, subpackage_id, exam_id, user_id } = req.params
    const findExamStatus = await SubPackageExams.findOne({
      where: {
        examid: exam_id,
        subpackageid: subpackage_id,
        type: "Free"
      }
    })
    if (findExamStatus && findExamStatus?.id) {
      return res.status(200).json({
        success: true
      })
    } else {
      const findPackage = await BundlePackages.findOne({
        where: {
          id: bundle_id
        },
        attributes: ["id", "name", "type", "premiumType"]
      })
      const findActivePasses = await Packagesales.findOne({
        where: {
          userid: user_id,
          passid: {
            [Op.ne]: null
          },
          bundleid: {
            [Op.eq]: null
          },
          packageid: {
            [Op.eq]: null
          },
          expirydate: {
            [Op.gte]: new Date()
          }
        },
        order: [["id", "DESC"]],
        attributes: ["id", "userid", "passid", "transactionid", "transaction_id", "expirydate"]
      })
      if (findActivePasses && findActivePasses?.id) {
        if (findPackage && findPackage?.premiumType == 0) {
          return res.status(200).json({
            success: true
          })
        } else {
          const checkPackageIsActiveOrNot = await Packagesales.findOne({
            where: {
              bundleid: bundle_id,
              packageid: null,
              userid: user_id,
              expirydate: {
                [Op.gte]: new Date()
              }
            },
            attributes: ["id", "userid", "bundleid", "transactionid", "transaction_id", "expirydate"]
          })
          if (checkPackageIsActiveOrNot && checkPackageIsActiveOrNot?.id) {
            return res.status(200).json({
              success: true
            })
          } else {
            return res.status(200).json({
              success: false
            })
          }
        }
      }
      else {
        const checkPackageIsActiveOrNot = await Packagesales.findOne({
          where: {
            bundleid: bundle_id,
            packageid: null,
            userid: user_id,
            expirydate: {
              [Op.gte]: new Date()
            }
          },
          attributes: ["id", "userid", "bundleid", "transactionid", "transaction_id", "expirydate"]
        })
        if (checkPackageIsActiveOrNot && checkPackageIsActiveOrNot?.id) {
          return res.status(200).json({
            success: true
          })
        } else {
          return res.status(200).json({
            success: false
          })
        }
      }
    }
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}




exports.generateReportForExamResultUsingBundleIdPackageId = async (req, res) => {
  try {
    const { userid, bundleid, packageid, subpackageid, examid, offset } = req.body

    const findPackage = await Packages.findOne({
      where: {
        id: packageid,
        live: 1,
        result_publish_date: {
          [Op.gt]: new Date(), // Only future result publish dates
        },
      },
    });

    if (findPackage) {
      return res.status(200).json({
        success: false,
        message: "Unauthorized Access"
      })
    } else {

      const findExam = await Exams.findOne({
        where: { id: examid },
        include: [
          {
            model: ExamSections,
            as: "examsections",
            required: true, // Ensures only records with at least one associated exam result are returned
            include: [
              {
                model: ExamSectionQuestions,
                as: "questions",
                required: true,
              }
            ]
          }
        ]
      })

      const findAllAttempt = await ExamResultAnalysis.findAll({
        where: {
          userid, bundleid, packageid, subpackageid, examid, exam_status: "completed"
        },
        order: [["id", "ASC"]],
        attributes: ["id"]
      })


      if (!findExam) {
        return res.status(200).json({
          success: false,
          message: "Unauthorized Access"
        })
      } else {


        const findCurrentResult = await ExamResultAnalysis.findOne({
          where: {
            userid, bundleid, packageid, subpackageid, examid, exam_status: "completed"
          },
          limit: 1,
          offset,
          order: [["id", "DESC"]],
          include: [
            {
              model: ExamResults,
              as: "examresults",
              required: true,
            }
          ],
          attributes: ["id", "userid", "bundleid", "packageid", "subpackageid", "examid", "exam_status", "createdAt"]
        })

        if (!findCurrentResult) {
          return res.status(200).json({
            success: false,
            message: "Unauthorized Access"
          })
        } else {
          let getAllQuestionBankId = findExam?.examsections?.map((item) => item?.questions?.map((item2) => item2?.question_bank_id))
          const flattenedArr = [...new Set(getAllQuestionBankId.flat())];

          const { data } = await axios.post(`${QUESTION_URL}/getAllQuestionWithCorrectOption`, { data: flattenedArr })
          if (data && data?.data) {
            let questionDetails = data?.data
            // console.log(questionDetails,"questiondetails>>>>>>>>>>>>>>>>>>>>>>>")
            let examReport = undefined
            if (findCurrentResult?.examresults?.length > 0) {
              let total_points = 0
              let total_questions = getAllQuestionBankId.flat()?.length > 0 ? getAllQuestionBankId.flat()?.length : 0
              let total_correct = 0
              let total_incorrect = 0
              let correct_section_id = []
              let incorrect_section_id = []
              let section_wise_points = []
              for (const item2 of findCurrentResult?.examresults) {
                const findQuesBank = questionDetails?.find((qb) => qb?.id == item2?.question_bank_id)
                const findQues = findQuesBank?.questions?.find((qu) => qu?.id == item2?.question_id)
                const findOps = findQues?.options?.find((op) => op?.id == item2?.user_ans_option_id && op?.right_option == 1)
                // console.log(findOps,"correct Or Not")

                const findSection = section_wise_points?.length > 0 ? section_wise_points?.find((item) => item?.section_id == item2?.examsectionid) : null

                if (findSection) {
                  let filteredData = section_wise_points?.filter((item) => item?.section_id != item2?.examsectionid)
                  let dataToUpdate = section_wise_points?.find((item) => item?.section_id == item2?.examsectionid)
                  if (!findOps || findOps == undefined) {
                    dataToUpdate = {
                      ...dataToUpdate,
                      points: dataToUpdate?.points - Number(findQuesBank?.marks?.negative_marks),
                      total_points: dataToUpdate?.total_points + Number(findQuesBank?.marks?.marks)
                    }
                    section_wise_points = [
                      ...filteredData, dataToUpdate
                    ]
                  } else {
                    dataToUpdate = {
                      ...dataToUpdate,
                      points: dataToUpdate?.points + Number(findQuesBank?.marks?.marks),
                      total_points: dataToUpdate?.total_points + Number(findQuesBank?.marks?.marks)
                    }
                    section_wise_points = [
                      ...filteredData, dataToUpdate
                    ]
                  }
                } else {
                  if (!findOps || findOps == undefined) {
                    let dataToUpdate = {
                      section_id: item2?.examsectionid,
                      points: 0 - Number(findQuesBank?.marks?.negative_marks),
                      total_points: Number(findQuesBank?.marks?.marks)
                    }
                    section_wise_points.push(dataToUpdate)

                  } else {
                    let dataToUpdate = {
                      section_id: item2?.examsectionid,
                      points: Number(findQuesBank?.marks?.marks),
                      total_points: Number(findQuesBank?.marks?.marks)

                    }
                    section_wise_points.push(dataToUpdate)

                  }
                }
                if (!findOps || findOps == undefined) {
                  total_incorrect += 1
                  total_points = total_points - Number(findQuesBank?.marks?.negative_marks)
                  incorrect_section_id.push(item2?.examsectionid)
                } else {
                  total_correct += 1
                  total_points += Number(findQuesBank?.marks?.marks)
                  correct_section_id.push(item2?.examsectionid)
                }
              }

              const findTime = await ExamSectionResultAnalysis.findAll({
                where: {
                  resultanalysisid: findCurrentResult?.id,
                  userid
                },
                attributes: ["time_taken", "id", "examsectionid"]
              })
              let payload = {
                user_id: userid,
                total_correct,
                total_incorrect,
                total_points,
                total_questions,
                section_wise_points,
                correct_percentage: (total_correct / total_questions) * 100,
                incorrect_percentage: (total_incorrect / total_questions) * 100,
                not_attempted: total_questions - (total_correct + total_incorrect),
                not_attempted_percentage: ((total_questions - (total_correct + total_incorrect)) / total_questions) * 100,
                total_time_taken: findTime?.map((item) => Number(item?.time_taken))?.reduce((curr, acc) => acc + curr, 0),
                total_section: findExam?.examsections?.map((item) => {
                  return {
                    section_id: item?.id,
                    section_name: item?.section_name,
                    duration: item?.duration
                  }
                }),
                correct_section_id,
                incorrect_section_id,
                section_time_taken: findTime?.map((item) => {
                  return {
                    section_id: item?.examsectionid,
                    time_taken: item?.time_taken,
                  }
                }),
                exam: findExam,
                attempted_on: findCurrentResult?.createdAt
              }
              return res.status(200).json({
                success: true,
                message: "Result Declared Successfully",
                allAttempt: findAllAttempt?.length,
                data: payload
              })
              // examReport = payload
            } else {
              return res.status(200).json({
                success: false,
                message: "Unauthorized Access"
              })
            }
          } else {
            return res.status(200).json({
              success: false,
              message: "Unauthorized Access"
            })
          }
        }


        // const findAllAttempt = await ExamResultAnalysis.findAll({
        //   where: {
        //     userid, bundleid, packageid, subpackageid, examid, exam_status: "completed"
        //   },
        //   order: [["id", "ASC"]],
        //   attributes: ["id"]
        // })


        // let getAllQuestionBankId = findExam?.examsections?.map((item) => item?.questions?.map((item2) => item2?.question_bank_id))
        // const flattenedArr = [...new Set(getAllQuestionBankId.flat())];
        // const { data } = await axios.post(`${QUESTION_URL}/getAllQuestionWithCorrectOption`, { data: flattenedArr })
        // setTimeout(async () => {
        //   if (data && data?.data) {
        //     let questionDetails = data?.data


        //     let examReport = undefined

        //     if (findCurrentResult) {
        //       if (findCurrentResult?.examresults?.length > 0) {
        //         let total_points = 0
        //         let total_correct = 0
        //         let total_incorrect = 0
        //         let status = 0
        //         findCurrentResult?.examresults?.map(async (item2, index) => {
        //           questionDetails?.map((qBank) => {
        //             qBank?.questions?.map((ques) => {
        //               let findCorrectOption = ques?.options?.find((opt) => {
        //                 return opt?.right_option == 1
        //               })
        //               if (ques?.id == item2?.dataValues?.question_id) {
        //                 if (findCorrectOption?.id == item2?.dataValues?.user_ans_option_id) {
        //                   status += 1
        //                   let correctMarks = qBank?.marks?.marks
        //                   total_points += Number(correctMarks)
        //                   total_correct += 1
        //                 } else {
        //                   let inCorrectMarks = qBank?.marks?.negative_marks
        //                   total_points += -Number(inCorrectMarks)
        //                   total_incorrect += 1
        //                 }
        //               }

        //             })
        //           })
        //         })
        //         let payload = {
        //           user_id: userid,
        //           total_correct,
        //           total_incorrect,
        //           total_points
        //         }
        //         examReport = payload
        //       }
        //       if (examReport) {
        // return res.status(200).json({
        //   success: true,
        //   message: "Result Declared Successfully",
        //   // allAttempt: findAllAttempt?.length,
        //   data: examReport
        // })
        //       } else {
        //         return res.status(200).json({
        //           success: false,
        //           message: "Unauthorized Access"
        //         })
        //       }
        //     } else {
        //       return res.status(200).json({
        //         success: false,
        //         message: "Unauthorized Access"
        //       })
        //     }


        //   } else {
        //     return res.status(200).json({
        //       success: false,
        //       message: "Unauthorized Access"
        //     })
        //   }
        // }, 1000)
      }
    }

  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}





exports.cashFreePaymentCheckOut = async (req, res) => {
  try {
    const { payableAmount, packageDetail, userDetail, currency, couponDetail, couponDiscount, type } = req.body
    const { data } = await axios.get(`${PAYMENT_GATEWAY_API_KEY}/getPaymentGatewayCredentials/CashFree`)
    if (!data) {
      return res.status(200).json({
        success: false,
        message: "CashFree Credentials Not Found"
      })
    }
    else {
      let amountToPay = (payableAmount > 0 && couponDiscount > 0 && couponDetail) ? payableAmount : currency == "INR" ? packageDetail?.price_inr : packageDetail?.price_usd
      const options = {
        method: 'POST',
        url: 'https://api.cashfree.com/pg/orders', // for Production (change) https://api.cashfree.com/pg/orders
        headers: {
          accept: 'application/json',
          'x-api-version': "2022-09-01",
          'content-type': 'application/json',
          'x-client-id': data?.data?.public_key,
          'x-client-secret': data?.data?.secret_key
        },
        data: {
          customer_details: {
            customer_id: 'CID2478167872848' + Date.now(),
            customer_phone: userDetail?.phone,
            customer_email: userDetail?.email,
            customer_name: userDetail?.firstname + " " + userDetail?.lastname
          },
          order_meta: {
            notify_url: "https://webhook.site/1cf65a5e-8f46-4b2d-9861-7e2e6125c52b",
            // return_url: 'https://example.com/return?order_id={order_id}',
            payment_methods: 'cc,dc,upi'
          },
          order_id: 'PAYID4579623981' + Date.now(),
          order_amount: Number((amountToPay)),
          order_currency: currency,
          order_note: 'testerika Subscription Plan'
        }
      }
      axios
        .request(options)
        .then(async function (response) {
          if (response?.data && response?.data?.payment_session_id) {
            let findData = await Transactions.findOne({
              where: {
                userid: userDetail?.id,
                transactionid: {
                  [Op.eq]: null
                },
                payment_status: "created",
                active: 0
              },
              attributes: ["id", "orderid", "userid"]
            })

            if (findData) {
              let payload = undefined
              if (type == "Pass") {
                payload = {
                  packageid: null,
                  passid: packageDetail?.id,
                  bundleid: null,
                  couponid: couponDetail ? couponDetail?.id : null,
                  orderid: response?.data?.order_id,
                  currency,
                  active: 0,
                  payment_method: "CashFree",
                  payment_status: "created",
                  total_amount: currency == "INR" ? packageDetail?.price_inr : packageDetail?.price_usd,
                  coupon_discount: (payableAmount > 0 && couponDetail && couponDiscount > 0) ? couponDiscount : null,
                  payable_amount: (payableAmount > 0 && couponDetail && couponDiscount > 0) ? payableAmount : currency == "INR" ? packageDetail?.price_inr : packageDetail?.price_usd
                }
              }
              else if (type == "Package") {
                payload = {
                  passid: null,
                  packageid: packageDetail?.id,
                  bundleid: null,
                  couponid: couponDetail ? couponDetail?.id : null,
                  orderid: response?.data?.order_id,
                  currency,
                  active: 0,
                  payment_method: "CashFree",
                  payment_status: "created",
                  total_amount: currency == "INR" ? packageDetail?.price_inr : packageDetail?.price_usd,
                  coupon_discount: (payableAmount > 0 && couponDetail && couponDiscount > 0) ? couponDiscount : null,
                  payable_amount: (payableAmount > 0 && couponDetail && couponDiscount > 0) ? payableAmount : currency == "INR" ? packageDetail?.price_inr : packageDetail?.price_usd
                }
              }
              else if (type == "Bundle") {
                payload = {
                  passid: null,
                  packageid: null,
                  bundleid: packageDetail?.id,
                  couponid: couponDetail ? couponDetail?.id : null,
                  orderid: response?.data?.order_id,
                  currency,
                  active: 0,
                  payment_method: "CashFree",
                  payment_status: "created",
                  total_amount: currency == "INR" ? packageDetail?.price_inr : packageDetail?.price_usd,
                  coupon_discount: (payableAmount > 0 && couponDetail && couponDiscount > 0) ? couponDiscount : null,
                  payable_amount: (payableAmount > 0 && couponDetail && couponDiscount > 0) ? payableAmount : currency == "INR" ? packageDetail?.price_inr : packageDetail?.price_usd
                }
              }

              [, updatedTransaction] = await Transactions.update({
                ...payload
              }, {
                where: {
                  id: findData?.id,
                  userid: findData?.userid
                }
              })
              return res.status(200).json({
                success: true,
                session_id: response.data.payment_session_id
              })
            } else {
              let payload = undefined
              if (type == "Pass") {
                payload = {
                  packageid: null,
                  userid: userDetail?.id,
                  passid: packageDetail?.id,
                  bundleid: null,
                  couponid: couponDetail ? couponDetail?.id : null,
                  orderid: response?.data?.order_id,
                  currency,
                  active: 0,
                  payment_method: "CashFree",
                  payment_status: "created",
                  total_amount: currency == "INR" ? packageDetail?.price_inr : packageDetail?.price_usd,
                  coupon_discount: (payableAmount > 0 && couponDetail && couponDiscount > 0) ? couponDiscount : null,
                  payable_amount: (payableAmount > 0 && couponDetail && couponDiscount > 0) ? payableAmount : currency == "INR" ? packageDetail?.price_inr : packageDetail?.price_usd
                }
              }
              else if (type == "Package") {
                payload = {
                  passid: null,
                  userid: userDetail?.id,
                  packageid: packageDetail?.id,
                  bundleid: null,
                  couponid: couponDetail ? couponDetail?.id : null,
                  orderid: response?.data?.order_id,
                  currency,
                  active: 0,
                  payment_method: "CashFree",
                  payment_status: "created",
                  total_amount: currency == "INR" ? packageDetail?.price_inr : packageDetail?.price_usd,
                  coupon_discount: (payableAmount > 0 && couponDetail && couponDiscount > 0) ? couponDiscount : null,
                  payable_amount: (payableAmount > 0 && couponDetail && couponDiscount > 0) ? payableAmount : currency == "INR" ? packageDetail?.price_inr : packageDetail?.price_usd
                }
              }
              else if (type == "Bundle") {
                payload = {
                  passid: null,
                  userid: userDetail?.id,
                  packageid: null,
                  bundleid: packageDetail?.id,
                  couponid: couponDetail ? couponDetail?.id : null,
                  orderid: response?.data?.order_id,
                  currency,
                  active: 0,
                  payment_method: "CashFree",
                  payment_status: "created",
                  total_amount: currency == "INR" ? packageDetail?.price_inr : packageDetail?.price_usd,
                  coupon_discount: (payableAmount > 0 && couponDetail && couponDiscount > 0) ? couponDiscount : null,
                  payable_amount: (payableAmount > 0 && couponDetail && couponDiscount > 0) ? payableAmount : currency == "INR" ? packageDetail?.price_inr : packageDetail?.price_usd
                }
              }
              let createdTransaction = await Transactions.create({
                ...payload
              })
              return res.status(200).json({
                success: true,
                session_id: response.data.payment_session_id
              })
            }
          } else {
            return res.status(200).json({
              success: false,
              session_id: null,
              message: "Something went wrong.Please try again"
            })
          }
        })
        .catch(function (error) {
          return res.status(200).json({
            success: false,
            session_id: null,
            message: "Something went wrong.Please try again"
          })
        })
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false
    })
  }
}


exports.cashFreePaymentVerification = async (req, res) => {
  const orderid = req.params.orderid
  try {
    const { data } = await axios.get(`${PAYMENT_GATEWAY_API_KEY}/getPaymentGatewayCredentials/CashFree`)
    if (!data) {
      return res.status(200).json({
        success: false,
        message: "CashFree Credentials Not Found"
      })
    } else {
      const options = {
        method: 'GET',
        url: `https://api.cashfree.com/pg/orders/${orderid}`, // for Production (change) https://api.cashfree.com/pg/orders
        headers: {
          accept: 'application/json',
          'x-api-version': '2022-09-01',
          'x-client-id': data?.data?.public_key,
          'x-client-secret': data?.data?.secret_key
        }
      }
      axios
        .request(options)
        .then(async function (response) {

          if (response.data.order_status == "PAID") {
            let findData = await Transactions.findOne({
              where: {
                orderid: orderid,
                active: 0
              }
            })
            let expiryDateAndTime = new Date();
            if (findData && findData?.packageid && !findData?.bundleid && !findData?.passid) {
              expiryDateAndTime.setFullYear(expiryDateAndTime.getFullYear() + 1)
            }
            else if (findData && findData?.bundleid && !findData?.passid && !findData?.packageid) {
              expiryDateAndTime.setFullYear(expiryDateAndTime.getFullYear() + 1)
            }
            if (findData) {
              if (!findData?.packageid && !findData?.bundleid && findData?.passid) {
                const { data } = await axios.get(`${PASSES_API_URL}/findPassUsingId/${findData?.passid}`)
                if (data && data?.data) {
                  let duration = Number(data?.data?.duration?.split(" ")[0])
                  if (duration && duration > 0) {
                    expiryDateAndTime.setMonth(expiryDateAndTime.getMonth() + duration)
                  }
                  await Transactions.update({
                    active: 1,
                    payment_status: "success",
                    transactionid: response?.data?.order_id,
                    buydate: new Date(),
                    expirydate: expiryDateAndTime
                  }, {
                    where: {
                      id: findData?.id,
                      userid: findData?.userid
                    }
                  })

                  let findOneData = await Transactions.findOne({
                    where: {
                      orderid: orderid,
                      active: 1,
                      transactionid: response?.data?.order_id,
                      userid: findData?.userid
                    }
                  })
                  if (findOneData) {
                    const createSales = await Packagesales.create({
                      packageid: findOneData?.packageid,
                      userid: findOneData?.userid,
                      passid: findOneData?.passid,
                      bundleid: findOneData?.bundleid,
                      couponid: findOneData?.couponid,
                      transactionid: findOneData?.transactionid,
                      currency: findOneData?.currency,
                      active: 1,
                      amount: findOneData?.payable_amount,
                      payment_method: findOneData?.payment_method,
                      buydate: findOneData?.buydate,
                      expirydate: findOneData?.expirydate,
                      transaction_id: findOneData?.id
                    })
                    if (createSales) {
                      let successResult = {
                        currency: findOneData?.currency,
                        payment_method: "CashFree",
                        amount: findOneData?.payable_amount,
                        transaction_id: response?.data?.order_id
                      }
                      emailTemplatePaymentSuccess(successResult, findOneData?.userid)
                      res.redirect(
                        `https://lms.testerika.com/dashboard/payment-success?reference=${response?.data?.order_id}`,
                      )
                    }
                  }
                } else {
                  res.redirect(
                    `https://lms.testerika.com/dashboard/payment-failed`,
                  )
                }
              } else {
                await Transactions.update({
                  active: 1,
                  payment_status: "success",
                  transactionid: response?.data?.order_id,
                  buydate: new Date(),
                  expirydate: expiryDateAndTime
                }, {
                  where: {
                    id: findData?.id,
                    userid: findData?.userid
                  }
                })

                let findOneData = await Transactions.findOne({
                  where: {
                    orderid: orderid,
                    active: 1,
                    transactionid: response?.data?.order_id,
                    userid: findData?.userid
                  }
                })
                if (findOneData) {
                  const createSales = await Packagesales.create({
                    packageid: findOneData?.packageid,
                    userid: findOneData?.userid,
                    passid: findOneData?.passid,
                    bundleid: findOneData?.bundleid,
                    couponid: findOneData?.couponid,
                    transactionid: findOneData?.transactionid,
                    currency: findOneData?.currency,
                    active: 1,
                    amount: findOneData?.payable_amount,
                    payment_method: findOneData?.payment_method,
                    buydate: findOneData?.buydate,
                    expirydate: findOneData?.expirydate,
                    transaction_id: findOneData?.id
                  })
                  if (createSales) {
                    let successResult = {
                      currency: findOneData?.currency,
                      payment_method: "CashFree",
                      amount: findOneData?.payable_amount,
                      transaction_id: response?.data?.order_id
                    }
                    emailTemplatePaymentSuccess(successResult, findOneData?.userid)
                    res.redirect(
                      `https://lms.testerika.com/dashboard/payment-success?reference=${response?.data?.order_id}`,
                    )
                  }
                }
              }

            } else {
              res.redirect(
                `https://lms.testerika.com/dashboard/payment-failed`,
              )
            }

          } else if (response.data.order_status == "ACTIVE") {
            res.redirect(
              `https://lms.testerika.com/dashboard/payment-failed`,
            )
          } else {
            res.redirect(
              `https://lms.testerika.com/dashboard/payment-failed`,
            )
          }
        })
        .catch(function (error) {
          res.redirect(
            `https://lms.testerika.com/dashboard/payment-failed`,
          )
        })
    }
  } catch (error) {
    res.redirect(
      `https://lms.testerika.com/dashboard/payment-failed`,
    )
  }
}

exports.paypalPaymentVerification = async (req, res) => {
  try {
    const { payableAmount, packageDetail, userDetail, currency, couponDetail, couponDiscount, type, paypalData } = req.body
    if (type == "Pass") {
      payload = {
        packageid: null,
        userid: userDetail?.id,
        passid: packageDetail?.id,
        bundleid: null,
        couponid: couponDetail ? couponDetail?.id : null,
        orderid: null,
        currency,
        payment_method: "PayPal",
        payment_status: "success",
        total_amount: paypalData?.amount,
        coupon_discount: (payableAmount > 0 && couponDetail && couponDiscount > 0) ? couponDiscount : null,
        payable_amount: (payableAmount > 0 && couponDetail && couponDiscount > 0) ? payableAmount : currency == "INR" ? packageDetail?.price_inr : packageDetail?.price_usd
      }
    }
    else if (type == "Package") {
      payload = {
        passid: null,
        userid: userDetail?.id,
        packageid: packageDetail?.id,
        bundleid: null,
        couponid: couponDetail ? couponDetail?.id : null,
        orderid: null,
        currency,
        payment_method: "PayPal",
        payment_status: "success",
        total_amount: paypalData?.amount,
        coupon_discount: (payableAmount > 0 && couponDetail && couponDiscount > 0) ? couponDiscount : null,
        payable_amount: (payableAmount > 0 && couponDetail && couponDiscount > 0) ? payableAmount : currency == "INR" ? packageDetail?.price_inr : packageDetail?.price_usd
      }
    }
    else if (type == "Bundle") {
      payload = {
        passid: null,
        userid: userDetail?.id,
        packageid: null,
        bundleid: packageDetail?.id,
        couponid: couponDetail ? couponDetail?.id : null,
        orderid: null,
        currency,
        payment_method: "PayPal",
        payment_status: "success",
        total_amount: paypalData?.amount,
        coupon_discount: (payableAmount > 0 && couponDetail && couponDiscount > 0) ? couponDiscount : null,
        payable_amount: (payableAmount > 0 && couponDetail && couponDiscount > 0) ? payableAmount : currency == "INR" ? packageDetail?.price_inr : packageDetail?.price_usd
      }
    }

    let expiryDateAndTime = new Date()
    if (type != "Pass") {
      expiryDateAndTime.setFullYear(expiryDateAndTime.getFullYear() + 1)
    } else {
      let duration = Number(packageDetail?.duration?.split(" ")[0])
      if (duration && duration > 0) {
        expiryDateAndTime.setMonth(expiryDateAndTime.getMonth() + duration)
      }
    }
    let createdTransaction = await Transactions.create({
      ...payload,
      active: 1,
      transactionid: paypalData?.transaction_id,
      buydate: new Date(),
      expirydate: expiryDateAndTime
    })
    if (createdTransaction) {
      const createSales = await Packagesales.create({
        packageid: createdTransaction?.packageid,
        userid: createdTransaction?.userid,
        passid: createdTransaction?.passid,
        bundleid: createdTransaction?.bundleid,
        couponid: createdTransaction?.couponid,
        transactionid: createdTransaction?.transactionid,
        currency: createdTransaction?.currency,
        active: 1,
        amount: createdTransaction?.payable_amount,
        payment_method: createdTransaction?.payment_method,
        buydate: createdTransaction?.buydate,
        expirydate: createdTransaction?.expirydate,
        transaction_id: createdTransaction?.id
      })
      if (createSales) {
        let successResult = {
          currency: currency,
          payment_method: "PayPal",
          amount: createdTransaction?.payable_amount,
          transaction_id: paypalData?.transaction_id
        }
        emailTemplatePaymentSuccess(successResult, createdTransaction?.userid)
        res.status(200).json({
          success: true,
          payment_id: createSales?.transactionid
        })
      } else {
        res.status(200).json({
          success: false,
          payment_id: null
        })
      }
    } else {
      res.status(200).json({
        success: false,
        payment_id: null
      })
    }
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.addPaymentDetail = async (req, res) => {
  try {
    const { payableAmount, packageDetail, userDetail, currency, couponDetail, couponDiscount, type, paypalData } = req.body
    if (type == "Pass") {
      payload = {
        packageid: null,
        userid: userDetail?.id,
        passid: packageDetail?.id,
        bundleid: null,
        couponid: couponDetail ? couponDetail?.id : null,
        orderid: null,
        currency,
        payment_method: "RazorPay",
        payment_status: "success",
        total_amount: currency == "INR" ? packageDetail?.price_inr : packageDetail?.price_usd,
        coupon_discount: couponDiscount,
        payable_amount: 0
      }
    }
    else if (type == "Package") {
      payload = {
        passid: null,
        userid: userDetail?.id,
        packageid: packageDetail?.id,
        bundleid: null,
        couponid: couponDetail ? couponDetail?.id : null,
        orderid: null,
        currency,
        payment_method: "RazorPay",
        payment_status: "success",
        total_amount: currency == "INR" ? packageDetail?.price_inr : packageDetail?.price_usd,
        coupon_discount: couponDiscount,
        payable_amount: 0
      }
    }
    else if (type == "Bundle") {
      payload = {
        passid: null,
        userid: userDetail?.id,
        packageid: null,
        bundleid: packageDetail?.id,
        couponid: couponDetail ? couponDetail?.id : null,
        orderid: null,
        currency,
        payment_method: "RazorPay",
        payment_status: "success",
        total_amount: currency == "INR" ? packageDetail?.price_inr : packageDetail?.price_usd,
        coupon_discount: couponDiscount,
        payable_amount: 0
      }
    }

    let expiryDateAndTime = new Date()
    if (type != "Pass") {
      expiryDateAndTime.setFullYear(expiryDateAndTime.getFullYear() + 1)
    } else {
      let duration = Number(packageDetail?.duration?.split(" ")[0])
      if (duration && duration > 0) {
        expiryDateAndTime.setMonth(expiryDateAndTime.getMonth() + duration)
      }
    }
    let createdTransaction = await Transactions.create({
      ...payload,
      active: 1,
      transactionid: "DISCOUNT_PAYMENT_ADMIN",
      buydate: new Date(),
      expirydate: expiryDateAndTime
    })
    if (createdTransaction) {
      const createSales = await Packagesales.create({
        packageid: createdTransaction?.packageid,
        userid: createdTransaction?.userid,
        passid: createdTransaction?.passid,
        bundleid: createdTransaction?.bundleid,
        couponid: createdTransaction?.couponid,
        transactionid: createdTransaction?.transactionid,
        currency: createdTransaction?.currency,
        active: 1,
        amount: createdTransaction?.payable_amount,
        payment_method: createdTransaction?.payment_method,
        buydate: createdTransaction?.buydate,
        expirydate: createdTransaction?.expirydate,
        transaction_id: createdTransaction?.id
      })
      if (createSales) {
        //  let successResult={
        //          currency:currency,
        //          payment_method:currency=="INR"?"CashFree":"PayPal",
        //          amount:createdTransaction?.payable_amount,
        //          transaction_id:"DISCOUNT_PAYMENT_ADMIN"
        //  }
        //  emailTemplatePaymentSuccess(successResult,createdTransaction?.userid)
        res.status(200).json({
          success: true,
          payment_id: createSales?.transactionid
        })
      } else {
        res.status(200).json({
          success: false,
          payment_id: null
        })
      }
    } else {
      res.status(200).json({
        success: false,
        payment_id: null
      })
    }
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}





exports.generateLeaderBoardForExamResultUsingBundleIdPackageId = async (req, res) => {
  try {
    const { bundleid, packageid, subpackageid, examid, userid } = req.body
    const findExam = await Exams.findOne({
      where: { id: examid },
      include: [
        {
          model: ExamSections,
          as: "examsections",
          required: true,
          include: [
            {
              model: ExamSectionQuestions,
              as: "questions",
              required: true,
            }
          ]
        }
      ]
    })

    if (!findExam) {
      return res.status(200).json({
        success: false,
        message: "Unauthorized Access"
      })
    } else {
      const findCurrentResult = await ExamResultAnalysis.findAll({
        where: {
          bundleid, packageid, subpackageid, examid, exam_status: "completed"
        },
        include: [
          {
            model: ExamResults,
            as: "examresults",
            required: true
          }
        ],
        attributes: ["id", "userid", "bundleid", "packageid", "subpackageid", "examid", "exam_status", "createdAt"]
      })

      if (!findCurrentResult || findCurrentResult?.length <= 0) {
        return res.status(200).json({
          success: false,
          message: "Unauthorized Access"
        })
      } else {
        let getAllQuestionBankId = findExam?.examsections?.map((item) => item?.questions?.map((item2) => item2?.question_bank_id))
        const flattenedArr = [...new Set(getAllQuestionBankId.flat())];
        const { data } = await axios.post(`${QUESTION_URL}/getAllQuestionWithCorrectOption`, { data: flattenedArr })
        if (data && data?.data) {
          let questionDetails = data?.data
          // console.log(questionDetails,"questiondetails>>>>>>>>>>>>>>>>>>>>>>>")
          if (findCurrentResult?.length > 0) {
            let finalResult = []
            for (const resultItem of findCurrentResult) {
              if (resultItem?.examresults?.length > 0) {
                let total_points = 0
                let total_questions = getAllQuestionBankId.flat()?.length > 0 ? getAllQuestionBankId.flat()?.length : 0
                let total_correct = 0
                let total_incorrect = 0
                let correct_section_id = []
                let incorrect_section_id = []
                let section_wise_points = []

                resultItem?.examresults?.map(async (item2, index) => {
                  const findQuesBank = questionDetails?.find((qb) => qb?.id == item2?.question_bank_id)
                  const findQues = findQuesBank?.questions?.find((qu) => qu?.id == item2?.question_id)
                  const findOps = findQues?.options?.find((op) => op?.id == item2?.user_ans_option_id && op?.right_option == 1)
                  // console.log(findOps,"correct Or Not")

                  const findSection = section_wise_points?.length > 0 ? section_wise_points?.find((item) => item?.section_id == item2?.examsectionid) : null

                  if (findSection) {
                    let filteredData = section_wise_points?.filter((item) => item?.section_id != item2?.examsectionid)
                    let dataToUpdate = section_wise_points?.find((item) => item?.section_id == item2?.examsectionid)
                    if (!findOps || findOps == undefined) {
                      dataToUpdate = {
                        ...dataToUpdate,
                        points: dataToUpdate?.points - Number(findQuesBank?.marks?.negative_marks),
                        total_points: dataToUpdate?.total_points + Number(findQuesBank?.marks?.marks)
                      }
                      section_wise_points = [
                        ...filteredData, dataToUpdate
                      ]
                    } else {
                      dataToUpdate = {
                        ...dataToUpdate,
                        points: dataToUpdate?.points + Number(findQuesBank?.marks?.marks),
                        total_points: dataToUpdate?.total_points + Number(findQuesBank?.marks?.marks)
                      }
                      section_wise_points = [
                        ...filteredData, dataToUpdate
                      ]
                    }
                  } else {
                    if (!findOps || findOps == undefined) {
                      let dataToUpdate = {
                        section_id: item2?.examsectionid,
                        points: 0 - Number(findQuesBank?.marks?.negative_marks),
                        total_points: Number(findQuesBank?.marks?.marks)
                      }
                      section_wise_points.push(dataToUpdate)

                    } else {
                      let dataToUpdate = {
                        section_id: item2?.examsectionid,
                        points: Number(findQuesBank?.marks?.marks),
                        total_points: Number(findQuesBank?.marks?.marks)

                      }
                      section_wise_points.push(dataToUpdate)

                    }
                  }
                  if (!findOps || findOps == undefined) {
                    total_incorrect += 1
                    total_points = total_points - Number(findQuesBank?.marks?.negative_marks)
                    incorrect_section_id.push(item2?.examsectionid)
                  } else {
                    total_correct += 1
                    total_points += Number(findQuesBank?.marks?.marks)
                    correct_section_id.push(item2?.examsectionid)
                  }
                })

                const findTime = await ExamSectionResultAnalysis.findAll({
                  where: {
                    resultanalysisid: resultItem?.id,
                  },
                  attributes: ["time_taken", "id", "examsectionid"]
                })
                let payload = {
                  user_id: resultItem?.userid,
                  total_correct,
                  total_incorrect,
                  total_points,
                  total_questions,
                  section_wise_points,
                  correct_percentage: (total_correct / total_questions) * 100,
                  incorrect_percentage: (total_incorrect / total_questions) * 100,
                  not_attempted: total_questions - (total_correct + total_incorrect),
                  not_attempted_percentage: ((total_questions - (total_correct + total_incorrect)) / total_questions) * 100,
                  total_time_taken: findTime?.map((item) => Number(item?.time_taken))?.reduce((curr, acc) => acc + curr, 0),
                  total_section: findExam?.examsections?.map((item) => {
                    return {
                      section_id: item?.id,
                      section_name: item?.section_name,
                      duration: item?.duration
                    }
                  }),
                  correct_section_id,
                  incorrect_section_id,
                  section_time_taken: findTime?.map((item) => {
                    return {
                      section_id: item?.examsectionid,
                      time_taken: item?.time_taken,
                    }
                  }),
                  exam: findExam,
                  attempted_on: resultItem?.createdAt
                }
                finalResult.push(payload)
                // examReport = payload
              }
            }


            if (finalResult?.length > 0) {
              const bestResults = Object.values(
                finalResult.reduce((acc, curr) => {
                  if (
                    !acc[curr.user_id] ||
                    curr.total_points > acc[curr.user_id].total_points ||
                    (curr.total_points === acc[curr.user_id].total_points && curr.total_time_taken < acc[curr.user_id].total_time_taken) ||
                    (curr.total_points === acc[curr.user_id].total_points && curr.total_time_taken === acc[curr.user_id].total_time_taken && curr.attempted_on < acc[curr.user_id].attempted_on)
                  ) {
                    acc[curr.user_id] = curr;
                  }
                  return acc;
                }, {})
              );

              const sortedResults = [...bestResults].sort((a, b) => {
                if (b.total_points !== a.total_points) {
                  return b.total_points - a.total_points; // Higher points first
                }
                if (a.total_time_taken !== b.total_time_taken) {
                  return a.total_time_taken - b.total_time_taken; // Less time first
                }
                if (a.attempted_on !== b.attempted_on) {
                  return new Date(a.attempted_on) - new Date(b.attempted_on); // Earlier attempt first
                }
                return a.user_id - b.user_id; // Lower user ID first
              });

              return res.status(200).json({
                success: true,
                message: "Result Declared Successfully",
                data: sortedResults.map((result, index) => ({
                  rank: index + 1,
                  user_id: result.user_id,
                  total_time_taken: result.total_time_taken,
                  total_points: result.total_points,

                  // ✅ Include extra fields ONLY for the topper and current user
                  ...(index === 0 || result.user_id === userid
                    ? {
                      total_section: result.total_section,
                      section_time_taken: result.section_time_taken,
                      exam: result.exam,
                      correct_section_id: result.correct_section_id,
                      incorrect_section_id: result.incorrect_section_id,
                      total_questions: result.total_questions,
                      correct_percentage: result.correct_percentage,
                      incorrect_percentage: result.incorrect_percentage,
                      not_attempted: result.not_attempted,
                      not_attempted_percentage: result.not_attempted_percentage,
                      attempted_on: result.attempted_on,
                      total_correct: result.total_correct,
                      total_incorrect: result.total_incorrect,
                      section_wise_points: result.section_wise_points
                    }
                    : {}),
                }))
              });

            } else {
              return res.status(200).json({
                success: false,
                message: "Result not declared",
              })

            }



            // console.log(finalResult)
            //  return res.status(200).json({
            //   success: true,
            //   message: "Result Declared Successfully",
            //   // allAttempt: findAllAttempt?.length,
            //   data: payload
            // })
          }

        }
      }
    }

  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}


exports.addPaymentDetailManually = async (req, res) => {
  try {
    const { packageid, type, userid, passid, bundleid, orderid, transactionid, currency, amount, payment_method, buydate, expirydate } = req.body
    let payload = undefined
    if (type == "Pass") {
      payload = {
        packageid: null,
        userid,
        passid,
        bundleid: null,
        orderid,
        currency,
        payment_method,
        transactionid,
        payment_status: "success",
        total_amount: amount,
        coupon_discount: null,
        payable_amount: amount,
        buydate,
        expirydate
      }
    }
    else if (type == "Package") {
      payload = {
        packageid,
        userid,
        passid: null,
        bundleid: null,
        orderid,
        currency,
        transactionid,
        payment_method,
        payment_status: "success",
        total_amount: amount,
        coupon_discount: null,
        payable_amount: amount,
        buydate,
        expirydate
      }
    }
    else if (type == "Bundle") {
      payload = {
        packageid: null,
        userid,
        passid: null,
        bundleid,
        orderid,
        currency,
        transactionid,
        payment_method,
        payment_status: "success",
        total_amount: amount,
        coupon_discount: null,
        payable_amount: amount,
        buydate,
        expirydate
      }
    }

    let createdTransaction = await Transactions.create({
      ...payload,
      active: 1
    })

    if (createdTransaction) {
      const createSales = await Packagesales.create({
        packageid: createdTransaction?.packageid,
        userid: createdTransaction?.userid,
        passid: createdTransaction?.passid,
        bundleid: createdTransaction?.bundleid,
        couponid: createdTransaction?.couponid,
        transactionid: createdTransaction?.transactionid,
        currency: createdTransaction?.currency,
        active: 1,
        amount: createdTransaction?.total_amount,
        payment_method: createdTransaction?.payment_method,
        buydate: createdTransaction?.buydate,
        expirydate: createdTransaction?.expirydate,
        transaction_id: createdTransaction?.id
      })
      if (createSales) {
        return res.status(200).json({
          success: true,
          message: "Payment added successfully"
        })
      } else {
        return res.status(200).json({
          success: false,
          message: "Something went wrong"
        })
      }
    } else {
      return res.status(200).json({
        success: false,
        message: "Something went wrong"
      })
    }

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    })

  }
}


exports.getAllPaymentDetailsUsingUserId = async (req, res) => {
  try {
    const { transactionids } = req.body
    const data = await Packagesales.findAll({
      where: {
        id: transactionids
      },
      order: [["id", "DESC"]]
    })

    if (data?.length > 0) {
      return res.status(200).json({
        success: true,
        data
      })
    } else {
      return res.status(200).json({
        success: false,
        data: []
      })
    }
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}


exports.getAllPremiumOrExpiredUser = async (req, res) => {
  try {
    const { status } = req.params

    let { page, items_per_page } = req.query
    let data
    page = parseInt(page)
    items_per_page = parseInt(items_per_page)
    const offset = (page - 1) * items_per_page
    const limit = items_per_page
    let total_amount = await Packagesales.findAll({
      attributes: ["id", "amount"]
    })
    total_amount = total_amount?.map((item) => Number(item?.dataValues?.amount))
    total_amount = total_amount?.reduce((a, b) => a + b, 0)
    if (status == "active") {
      data = await Packagesales.findAndCountAll({
        where: {
          expirydate: {
            [Op.gte]: new Date()
          }
        },
        include: [
          {
            model: Transactions,
            require: false
          }
        ],
        distinct: true,
        offset,
        limit,
        order: [['id', 'DESC']]
      })
    } else {
      data = await Packagesales.findAndCountAll({
        where: {
          expirydate: {
            [Op.lt]: new Date()
          }
        },
        include: [
          {
            model: Transactions,
            require: false
          }
        ],
        distinct: true,
        offset,
        limit,
        order: [['id', 'DESC']]
      })
    }


    let last_page = data.count / items_per_page <= page ? page : page + 1
    let previos = {
      active: false,
      label: '&laquo; Previous',
      page: page == 1 ? null : page - 1,
      url: page == 1 ? null : `/?page=${page - 1}`
    }
    let next = {
      active: false,
      label: 'Next &raquo;',
      page: page == last_page ? null : page + 1,
      url: page == last_page ? null : `/?page=${page + 1}`
    }
    let links = Array(last_page)
      .fill()
      .flatMap((_, i) => [
        {
          active: i + 1 == page ? true : false,
          label: `${i + 1}`,
          page: i + 1,
          url: `/?page=${i + 1}`
        }
      ])
    links = [previos, ...links, next]
    return res.status(200).json({
      data: data.rows,
      total_amount,
      payload: {
        pagination: {
          first_page_url: '/?page=1',
          from: offset + 1,
          items_per_page,
          last_page,
          links,
          next_page_url: page == last_page ? null : `/?page=${page + 1}`,
          page: page,
          prev_page_url: page == 1 ? null : `/?page=${page - 1}`,
          to: limit,
          total: data.count
        }
      }
    })
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.getTodayLoginUserViewStatus = async (req, res) => {
  try {
    const { userIds } = req.body
    const data = await Packagesales.findAll({
      where: {
        userid: userIds,
        expirydate: {
          [Op.gt]: new Date()
        }
      },
      include: [
        {
          model: Transactions,
          require: false
        }
      ]
    })
    if (data?.length > 0) {
      return res.status(200).json({
        success: true,
        data
      })
    } else {
      return res.status(200).json({
        success: false,
        data: []
      })
    }
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}


function calculateTScoreForSection(correctCount, mean, sd) {
  if (sd === 0) return 50; // All users performed the same
  return 50 + 10 * ((correctCount - mean) / sd);
}

exports.generateAllReportForExamResultUsingBundleIdPackageId = async (req, res) => {
  try {
    const {userid, bundleid, packageid, subpackageid, examid } = req.body;

    const findPackage = await Packages.findOne({
      where: {
        id: packageid,
        live: 1,
        result_publish_date: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (findPackage) {
      return res.status(200).json({
        success: false,
        message: "Unauthorized Access"
      });
    }

    const findExam = await Exams.findOne({
      where: { id: examid },
      include: [
        {
          model: ExamSections,
          as: "examsections",
          include: [
            {
              model: ExamSectionQuestions,
              as: "questions",
            }
          ]
        }
      ]
    });

    const allResults = await ExamResultAnalysis.findAll({
      where: {
        bundleid, packageid, subpackageid, examid,
        exam_status: "completed"
      },
      include: [
        {
          model: ExamResults,
          as: "examresults"
        }
      ]
    });

    const allSectionIds = findExam.examsections.map(sec => sec.id);
    const questionBankIds = [...new Set(
      findExam.examsections.flatMap(sec => sec.questions.map(q => q.question_bank_id))
    )];

    const { data } = await axios.post(`${QUESTION_URL}/getAllQuestionWithCorrectOption`, { data: questionBankIds });
    if (!data || !data.data) {
      return res.status(500).json({ success: false, message: "Failed to fetch question details" });
    }

    const questionDetails = data.data;

    // 🧠 Build a map of section_id => [correctCount per user]
    const sectionWiseCorrectCounts = {};  // { section_id: [correctCount1, correctCount2, ...] }
    const userSectionCorrectMap = {};     // { userId: { section_id: correctCount } }

    for (const result of allResults) {
      const userId = result.userid;
      const sectionCorrectMap = {}; // for this user

      for (const sectionId of allSectionIds) {
        sectionCorrectMap[sectionId] = 0;
      }

      for (const answer of result.examresults) {
        const qb = questionDetails.find(q => q.id === answer.question_bank_id);
        const question = qb?.questions?.find(q => q.id === answer.question_id);
        const isCorrect = question?.options?.some(op => op.id === answer.user_ans_option_id && op.right_option === 1);
        if (isCorrect) {
          if (sectionCorrectMap[answer.examsectionid] !== undefined) {
            sectionCorrectMap[answer.examsectionid]++;
          }
        }
      }

      userSectionCorrectMap[userId] = sectionCorrectMap;

      for (const [sectionId, correct] of Object.entries(sectionCorrectMap)) {
        if (!sectionWiseCorrectCounts[sectionId]) sectionWiseCorrectCounts[sectionId] = [];
        sectionWiseCorrectCounts[sectionId].push(correct);
      }
    }

    // ✅ Calculate mean and std deviation for each section
    const sectionStats = {};
    for (const [sectionId, correctCounts] of Object.entries(sectionWiseCorrectCounts)) {
      const n = correctCounts.length;
      const mean = correctCounts.reduce((a, b) => a + b, 0) / n;
      const variance = correctCounts.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / n;
      const sd = Math.sqrt(variance);
      sectionStats[sectionId] = { mean, sd };
    }

    // ✅ Build final result with T-scores
    const finalResults = Object.entries(userSectionCorrectMap).map(([userId, sectionMap]) => {
      const sectionScores = Object.entries(sectionMap).map(([sectionId, correctCount]) => {
        const { mean, sd } = sectionStats[sectionId];
        const tScore = calculateTScoreForSection(correctCount, mean, sd);
        return {
          section_id: sectionId,
          correct: correctCount,
          t_score: parseFloat(tScore.toFixed(2))
        };
      });

      return {
        user_id: userId,
        sections: sectionScores
      };
    });

    return res.status(200).json({
      success: true,
      message: "T-scores computed successfully",
      section_wise_t_scores: finalResults?.find((itemUser)=>itemUser?.user_id==userid)
    });

  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


