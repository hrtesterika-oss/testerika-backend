const nodemailer = require("nodemailer")


exports.memberKYCPending = async (req, res) => {
    try {
        console.log(req.body)
        const {email,fullname}=req.body
        // const {email,phonenumber}
        var transporter = nodemailer.createTransport({
            // service: 'gmail',
            host: "smtp.gmail.com",
            port: "465",
            secure: true,
            auth: {
                user: "noreply@liaison360.com",
                pass: "smuh rpdg nhni qxio"
            },
            tls: { rejectUnauthorized: false }

        });

        var mailOptions = {
            from: "noreply@liaison360.com",
            to: "noreply@liaison360.com",
            cc: email, // Add your CC email(s) here
            subject: `${fullname} KYC Pending!`,

            html: `
                <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Liaison360 Registration</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">

    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f4f4; padding:20px 0;">
      <tr>
        <td align="center">
          <!--[if (gte mso 9)|(IE)]>
          <table width="600" align="center" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
          <![endif]-->
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; background-color:#ffffff; border-radius:8px; overflow:hidden;">
            <!-- Header -->
            <tr>
              <td align="center" style="background: linear-gradient(135deg, #0033cc, #3366ff); padding: 40px 20px;">
                <img src="https:\/\/api.liaison360.com\/uploads\/users\/23\/cce499103890d0a4fade7d20e73f0c28.png" alt="KYC Pending" style="max-width:160px;">
                <h1 style="margin:0; font-size:24px; color:#ffffff;margin-top:10px;">KYC Under Review</h1>
                <p style="margin:10px 0 0; font-size:16px; color:#ffffff;">Your application has been submitted</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 30px 20px; color:#333333; font-size:16px; line-height:1.6;">
                <p style="margin: 0 0 15px;">Dear <strong>${fullname}</strong>,</p>
                <p style="margin: 0 0 15px;">Thank you for your interest in <strong>Liaison360</strong>.</p>
                <p style="margin: 0 0 15px;">We have received your application for registration. Our team is currently reviewing the details, and we will notify you once your membership is activated.</p>
                <p style="margin: 0 0 15px;">Meanwhile, if you have any questions or need assistance, feel free to reach out to us:</p>

                <p style="margin: 0 0 5px;"><strong>📧 Email:</strong> <a href="mailto:membership@liaison360.com" style="color:#0033cc; text-decoration:none;">membership@liaison360.com</a></p>
                <p style="margin: 0 0 15px;"><strong>📞 Call:</strong> <a href="tel:9252192521" style="color:#0033cc; text-decoration:none;">92521-92521</a></p>

                <p style="margin: 0 0 20px;">We’re excited to have you on board and look forward to supporting your journey with Liaison360.</p>

                <p style="margin: 0;"><strong>Warm regards,</strong><br />
                  Team Liaison360<br />
                  <a href="https://www.liaison360.com" style="color:#0033cc; text-decoration:none;">www.liaison360.com</a>
                </p>
              </td>
            </tr>

            <!-- Button -->
            <!-- <tr>
              <td align="center" style="padding: 20px;">
                <a href="https://www.liaison360.com/dashboard" 
                   style="background-color:#337ef7; color:#ffffff; text-decoration:none; padding:12px 24px; font-size:16px; border-radius:4px; display:inline-block;">
                  Go to Dashboard
                </a>
              </td>
            </tr> -->

            <!-- Footer -->
            <tr>
              <td align="center" style="padding: 10px 20px; font-size:12px; color:#999999;">
                &copy; 2025 Liaison360. All rights reserved.
              </td>
            </tr>

          </table>
          <!--[if (gte mso 9)|(IE)]>
              </td>
            </tr>
          </table>
          <![endif]-->
        </td>
      </tr>
    </table>

  </body>
</html>
               `
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
                return res.status(400).json({
                    "message": "Something went wrong",
                    "success": false
                })
            } else {
                return res.status(200).json({
                    message: info.response,
                    success: true
                })
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

exports.vendorKYCPending = async (req, res) => {
    try {
        console.log(req.body)
         const {email,fullname}=req.body
        var transporter = nodemailer.createTransport({
            // service: 'gmail',
            host: "smtp.gmail.com",
            port: "465",
            secure: true,
            auth: {
                user: "noreply@liaison360.com",
                pass: "smuh rpdg nhni qxio"
            },
            tls: { rejectUnauthorized: false }

        });

        var mailOptions = {
            from: "noreply@liaison360.com",
            to: "noreply@liaison360.com",
            cc: email, // Add your CC email(s) here
            subject: `${fullname} KYC Pending!`,

            html: `
                <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">

    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f4f4; padding:20px 0;">
      <tr>
        <td align="center">
          <!--[if (gte mso 9)|(IE)]>
          <table width="600" align="center" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
          <![endif]-->
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; background-color:#ffffff; border-radius:8px; overflow:hidden;">
            <!-- Header -->
            <tr>
              <td align="center" style="background: linear-gradient(135deg, #0033cc, #3366ff); padding: 40px 20px;">
                <img src="https:\/\/api.liaison360.com\/uploads\/users\/23\/f03c2b1c8077b2d73302708ba7a31796.png" alt="KYC Pending" style="max-width:160px;">
                <h1 style="margin:10px 0 0; font-size:24px; color:#ffffff;">Vendor KYC Under Review</h1>
                <p style="margin:10px 0 0; font-size:16px; color:#ffffff;">Your application has been submitted</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 30px 20px; color:#333333; font-size:16px; line-height:1.6;">
                <p style="margin: 0 0 15px;">Dear <strong>${fullname}</strong>,</p>

                <p style="margin: 0 0 15px;">Thank you for registering as a vendor on <strong>Liaison360</strong>.</p>

                <p style="margin: 0 0 15px;">We have received your application for registration. Our team is reviewing your information, and you will be notified once your KYC is verified and your account is activated.</p>

                <p style="margin: 0 0 15px;">If you have any questions in the meantime, feel free to contact us:</p>

                <p style="margin: 0 0 5px;"><strong>📧 Email:</strong> <a href="mailto:membership@liaison360.com" style="color:#0033cc; text-decoration:none;">membership@liaison360.com</a></p>
                <p style="margin: 0 0 20px;"><strong>📞 Call:</strong> <a href="tel:9252192521" style="color:#0033cc; text-decoration:none;">92521-92521</a></p>

                <p style="margin: 0 0 20px;">We look forward to connecting you with institutions across India.</p>

                <p style="margin: 0;"><strong>Regards,</strong><br />
                  Team Liaison360<br />
                  <a href="https://www.liaison360.com" style="color:#0033cc; text-decoration:none;">www.liaison360.com</a>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="padding: 10px 20px; font-size:12px; color:#999999;">
                &copy; 2025 Liaison360. All rights reserved.
              </td>
            </tr>

          </table>
          <!--[if (gte mso 9)|(IE)]>
              </td>
            </tr>
          </table>
          <![endif]-->
        </td>
      </tr>
    </table>

  </body>
               `
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
                return res.status(400).json({
                    "message": "Something went wrong",
                    "success": false
                })
            } else {
                return res.status(200).json({
                    message: info.response,
                    success: true
                })
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

exports.memberKYCVerified = async (req, res) => {
    try {
        const {email,fullname}=req.body
        var transporter = nodemailer.createTransport({
            // service: 'gmail',
            host: "smtp.gmail.com",
            port: "465",
            secure: true,
            auth: {
                user: "noreply@liaison360.com",
                pass: "smuh rpdg nhni qxio"
            },
            tls: { rejectUnauthorized: false }

        });

        var mailOptions = {
            from: "noreply@liaison360.com",
            to: email,
            cc: "noreply@liaison360.com", // Add your CC email(s) here
            subject: `${fullname} KYC Verified!`,

            html: `
                 <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">

    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f4f4; padding:20px 0;">
      <tr>
        <td align="center">
          <!--[if (gte mso 9)|(IE)]>
          <table width="600" align="center" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
          <![endif]-->
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; background-color:#ffffff; border-radius:8px; overflow:hidden;">
            <!-- Header -->
            <tr>
              <td align="center" style="background: linear-gradient(135deg, #0033cc, #3366ff); padding: 40px 20px;">
                <img src="https:\/\/api.liaison360.com\/uploads\/users\/23\/ef9bad1fd17c112a9ffa91d4c018d39e.png" alt="KYC Verified" style="max-width:160px;">
                <h1 style="margin:10px 0 0; font-size:24px; color:#ffffff;">KYC Verified Successfully</h1>
                <p style="margin:10px 0 0; font-size:16px; color:#ffffff;">Your membership is now active</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 30px 20px; color:#333333; font-size:16px; line-height:1.6;">
                <p style="margin: 0 0 15px;">Dear <strong>${fullname}</strong>,</p>

                <p style="margin: 0 0 15px;">We’re happy to inform you that your KYC verification is complete and your <strong>Liaison360</strong> membership account is now active.</p>
                
                <p style="margin: 0 0 15px;">You can now log in and start exploring vendor partnerships, posting requirements, and accessing all member-exclusive services at:</p>

                <p style="margin: 0 0 15px;"><strong>🌐 Website:</strong> <a href="https://www.liaison360.com" style="color:#0033cc; text-decoration:none;">www.liaison360.com</a></p>

                <p style="margin: 0 0 15px;">If you have any questions or need support, feel free to contact us:</p>

                <p style="margin: 0 0 5px;"><strong>📧 Email:</strong> <a href="mailto:membership@liaison360.com" style="color:#0033cc; text-decoration:none;">membership@liaison360.com</a></p>
                <p style="margin: 0 0 20px;"><strong>📞 Call:</strong> <a href="tel:9252192521" style="color:#0033cc; text-decoration:none;">92521-92521</a></p>

                <p style="margin: 0 0 20px;">We’re excited to support your institutional growth and collaboration through Liaison360.</p>

                <p style="margin: 0;"><strong>Welcome aboard!</strong><br />
                  Team Liaison360<br />
                  <a href="https://www.liaison360.com" style="color:#0033cc; text-decoration:none;">www.liaison360.com</a>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="padding: 10px 20px; font-size:12px; color:#999999;">
                &copy; 2025 Liaison360. All rights reserved.
              </td>
            </tr>

          </table>
          <!--[if (gte mso 9)|(IE)]>
              </td>
            </tr>
          </table>
          <![endif]-->
        </td>
      </tr>
    </table>

  </body>
               `
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
                return res.status(400).json({
                    "message": "Something went wrong",
                    "success": false
                })
            } else {
                return res.status(200).json({
                    message: info.response,
                    success: true
                })
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

exports.vendorKYCVerified = async (req, res) => {
    try {
        console.log(req.body)
                const {email,fullname}=req.body

        var transporter = nodemailer.createTransport({
            // service: 'gmail',
            host: "smtp.gmail.com",
            port: "465",
            secure: true,
            auth: {
                user: "noreply@liaison360.com",
                pass: "smuh rpdg nhni qxio"
            },
            tls: { rejectUnauthorized: false }

        });

        var mailOptions = {
            from: "noreply@liaison360.com",
            to: email,
            cc: "noreply@liaison360.com",
            subject: `${fullname} KYC Verified`,

            html: `
                  <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">

    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f4f4; padding:20px 0;">
      <tr>
        <td align="center">
          <!--[if (gte mso 9)|(IE)]>
          <table width="600" align="center" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
          <![endif]-->
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; background-color:#ffffff; border-radius:8px; overflow:hidden;">
            <!-- Header -->
            <tr>
              <td align="center" style="background: linear-gradient(135deg, #0033cc, #3366ff); padding: 40px 20px;">
                <img src="https:\/\/api.liaison360.com\/uploads\/users\/23\/eb4e76b146366a6d4fb8d81a8467125c.png" alt="KYC Verified" style="max-width:160px;">
                <h1 style="margin:10px 0 0; font-size:24px; color:#ffffff;">Vendor KYC Completed</h1>
                <p style="margin:10px 0 0; font-size:16px; color:#ffffff;">Your account is now active</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 30px 20px; color:#333333; font-size:16px; line-height:1.6;">
                <p style="margin: 0 0 15px;">Dear <strong>${fullname}</strong>,</p>

                <p style="margin: 0 0 15px;">We’re excited to let you know that your KYC verification is complete, and your <strong>Liaison360</strong> vendor account is now active.</p>

                <p style="margin: 0 0 15px;">You can now log in to your dashboard, showcase your services, and connect with verified colleges and institutions across India:</p>

                <p style="margin: 0 0 15px;"><strong>🌐 Website:</strong> <a href="https://www.liaison360.com" style="color:#0033cc; text-decoration:none;">www.liaison360.com</a></p>

                <p style="margin: 0 0 15px;">For any assistance, please don’t hesitate to reach out:</p>

                <p style="margin: 0 0 5px;"><strong>📧 Email:</strong> <a href="mailto:membership@liaison360.com" style="color:#0033cc; text-decoration:none;">membership@liaison360.com</a></p>
                <p style="margin: 0 0 20px;"><strong>📞 Call:</strong> <a href="tel:9252192521" style="color:#0033cc; text-decoration:none;">92521-92521</a></p>

                <p style="margin: 0 0 20px;">Welcome to the Liaison360 vendor network!</p>

                <p style="margin: 0;"><strong>Best regards,</strong><br />
                  Team Liaison360<br />
                  <a href="https://www.liaison360.com" style="color:#0033cc; text-decoration:none;">www.liaison360.com</a>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="padding: 10px 20px; font-size:12px; color:#999999;">
                &copy; 2025 Liaison360. All rights reserved.
              </td>
            </tr>

          </table>
          <!--[if (gte mso 9)|(IE)]>
              </td>
            </tr>
          </table>
          <![endif]-->
        </td>
      </tr>
    </table>

  </body>
               `
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
                return res.status(400).json({
                    "message": "Something went wrong",
                    "success": false
                })
            } else {
                return res.status(200).json({
                    message: info.response,
                    success: true
                })
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}