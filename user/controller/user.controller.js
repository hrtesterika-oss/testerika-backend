require('dotenv').config()
const dbContext = require('../models')
const nodemailer = require("nodemailer")
const User = dbContext.User
const UserOtp = dbContext.UserOtp
const EmailTemplate = dbContext.EmailTemplate
const Pincodes = dbContext.Pincodes
const UserAddress = dbContext.UserAddress
const UserDeviceInfo = dbContext.UserDeviceInfo
const UserLoginActivities = dbContext.UserLoginActivities
const UserReferralCodes = dbContext.UserReferralCodes
const Bank = dbContext.BankDetail
const UPI = dbContext.UpiDetail
const Pan = dbContext.PanDetail
const Verifications = dbContext.Verifications
const UserEmailVerification = dbContext.UserEmailVerification
const { API_URL } = require("../services/index")
var SibApiV3Sdk = require('sib-api-v3-sdk')
const moment = require("moment-timezone"); // Use moment-timezone

const { uploadImage } = require('../middleware/fileUploader')
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey =
  process.env.API_KEY
const fs = require('fs')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

exports.findAll = async (req, res) => {
  try {
    let { page, items_per_page, search, filter_role } = req.query
    let data
    page = parseInt(page)
    items_per_page = parseInt(items_per_page)
    const offset = (page - 1) * items_per_page
    const limit = items_per_page
    if (search) {
      data = await User.findAndCountAll({
        distinct: true,
        offset,
        limit,
        where: {
          phone: { [Op.like]: `%${search}%` },
          userType: filter_role ? filter_role : "student"
          // short_name: { [Op.like]: `%${search}%` }
        },
        order: [['id', 'DESC']]
      })
    } else {
      data = await User.findAndCountAll({
        where: {
          userType: filter_role ? filter_role : "student"
        },
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
    console.log(err, 'err')
    return res.status(500).json(err.message)
  }
}

exports.getAllUsers = async (req, res) => {
  const data = await User.findAll()
  res.status(200).json(data)

}

exports.findAllAddress = async (req, res) => {
  const pincode = req.params.id
  Pincodes.findAll({ where: { pincode } })
    .then(data => {
      res.send(data)
    })
    .catch(err => res.status(500).send(err))
}

exports.loginWithEmail = async (req, res) => {
  try {
    const { email, otp, device_info } = req.body
    let user = await User.findOne({ where: { email: email.toLowerCase() } })
    const otpData = await UserOtp.findOne({
      where: { user_id: user.id, otp },
      order: [['createdAt', 'DESC']]
    })
    if (!otpData) return res.status(404).json('Otp not found')
    if (otpData.is_verified)
      return res.status(400).json('Otp already used, please try again!')
    var dt1 = new Date()
    var dt2 = new Date(otpData.createdAt)
    var diff = (dt2.getTime() - dt1.getTime()) / 1000
    diff /= 60
    const min = Math.abs(Math.round(diff))
    if (min > 5) return res.status(400).json('Otp expired, please try again!')
    await UserOtp.update(
      {
        is_verified: true
      },
      { where: { id: otpData.id } }
    )
    if (user.email_verified == 0) {
      user = await User.update(
        {
          email_verified: 1
        },
        { where: { id: user.id } }
      )
    }
    await UserDeviceInfo.create({ ...device_info, user_id: user.id })
    const token = jwt.sign({ user_id: user.id, email }, process.env.TOKEN_KEY, {
      expiresIn: '7h'
    })
    res.status(200).json({ message: 'Login successfull!', token, user })
  } catch (err) {
    res.status(500).json(err)
  }
}

const sendEmail = async (email, otp, slug) => {
  const emailTemplate = await EmailTemplate.findOne({ where: { slug } })
  new SibApiV3Sdk.TransactionalEmailsApi()
    .sendTransacEmail({
      subject: emailTemplate.subject,
      sender: {
        email: emailTemplate.from_email,
        name: emailTemplate.from_name
      },
      replyTo: {
        email: emailTemplate.from_email,
        name: emailTemplate.from_name
      },
      to: [{ name: email, email: email }],
      htmlContent: emailTemplate.message,
      params: {
        email: email,
        otp: otp
      }
    })
    .then(
      function (data) {
      },
      function (error) {
        console.error(error, 'from here')
      }
    )
}

exports.sendEmailOtp = async (req, res) => {
  try {
    const { email, referral_code } = req.body
    let user_referral
    if (!email) return res.status(204).json('Please enter email!')
    const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/
    const valid = emailRegex.test(email)
    if (!valid) return res.status(204).json('Email is not valid!')
    // check if user already exist
    // Validate if user exist in our database
    if (referral_code) {
      user_referral = await UserReferralCodes.findOne({
        where: { referral_code }
      })
      if (!user_referral)
        return res.status(404).send('Referral code is not valid!')
    }
    const otp = Math.floor(100000 + Math.random() * 900000)
    const [user, created] = await User.findOrCreate({
      where: { email: email.toLowerCase() },
      defaults: { email: email.toLowerCase() }
    })
    if (created && referral_code && user_referral) {
      await UserReferralCodes.create({
        user_id: user.id,
        refered_by: referral_code
      })
    }

    await UserOtp.create({
      user_id: user.id,
      otp,
      is_verified: false
    })

    sendEmail(email.toLowerCase(), otp, 'email-otp')
    return res.status(200).json({ message: 'Otp sent successfully!' })
  } catch (err) {
    res.status(500).send(err)
  }
}

exports.findById = async (req, res) => {
  try {
    const { id } = req.params
    const data = await User.findOne({
      where: { id },
      include: [
        {
          model: UserAddress,
          required: false,
          as: 'address'
        },
        {
          model: UserDeviceInfo,
          required: false,
          as: 'device'
        },
        {
          model: UserReferralCodes,
          required: false,
          as: 'referral'
        },
        {
          model: Bank,
          required: false,
          as: 'bank',
          include: [
            {
              model: Verifications,
              required: false,
              where: {
                type: 'bank'
              },
              as: 'verification'
            }
          ]
        },
        {
          model: UPI,
          required: false,
          as: 'upi',
          include: [
            {
              model: Verifications,
              required: false,
              where: {
                type: 'upi'
              },
              as: 'verification'
            }
          ]
        },
        {
          model: Pan,
          required: false,
          as: 'pan',
          include: [
            {
              model: Verifications,
              required: false,
              where: {
                type: 'pan'
              },
              as: 'verification'
            }
          ]
        }
      ]
    })
    return res.status(200).json({ data: data.toJSON() })
  } catch (err) {
    console.log(err, 'err')
    return res.status(500).json(err.message)
  }
}
exports.delete = async (req, res) => {
  await User.destroy({
    where: { id: req.params.id }
  })
    .then(data =>
      res.status(204).json({
        msg: 'User deleted.'
      })
    )
    .catch(err =>
      res.status(400).send({
        error: 'Error while deleting!!!'
      })
    )
}

exports.update = async (req, res) => {
  try {
    const { id } = req.params
    const { user_info, address } = req.body
    let referral_code = user_info.firstname
      .substr(0, 3)
      .concat(Math.floor(100 + Math.random() * 900))
    const user_address = await UserAddress.findOne({ where: { user_id: id } })
    const user_referral = await UserReferralCodes.findOne({
      where: { user_id: id }
    })
    if (!user_address) {
      await UserAddress.create(address)
    } else {
      await UserAddress.update(address, { where: { user_id: id } })
    }
    if (!user_referral) {
      await UserReferralCodes.create({
        user_id: id,
        referral_code
      })
    } else {
      await UserReferralCodes.update(
        { referral_code },
        { where: { user_id: id } }
      )
    }
    await User.update(user_info, { where: { id } })
    return res.status(200).json('Records updated!')
  } catch (err) {
    console.log(err, 'err')
    res.status(500).json(err)
  }
}

exports.updateBank = async (req, res) => {
  try {
    const { id } = req.params
    const payload = req.body
    let data
    let { verification } = payload
    if (payload.id) {
      ;[, data] = await Bank.update(
        {
          account_number: payload.account_number,
          ifsc_code: payload.ifsc_code,
          bank_name: payload.bank_name,
          branch_name: payload.branch_name,
          state: payload.state,
          reject_reason: payload.reject_reason,
          bank_status: payload.bank_status
        },
        { where: { id: payload.id }, returning: true, plain: true }
      )
        ;[, verification] = await Verifications.update(
          {
            verified: verification.verified,
            verified_at: verification.verified_at,
            verified_by: verification.verified_by
          },
          {
            where: {
              id: verification.id
            },
            returning: true,
            plain: true
          }
        )
    } else {
      data = await Bank.create({
        user_id: id,
        account_number: payload.account_number,
        ifsc_code: payload.ifsc_code,
        bank_name: payload.bank_name,
        branch_name: payload.branch_name,
        state: payload.state,
        reject_reason: payload.reject_reason,
        bank_status: payload.bank_status
      })
      verification = await Verifications.create({
        kyc_id: data.id,
        type: 'bank',
        verified: verification.verified,
        verified_at: verification.verified_at,
        verified_by: verification.verified_by
      })
    }
    data = { ...data.toJSON(), verification }
    return res.status(200).json({ data })
  } catch (err) {
    console.log(err, 'err')
    res.status(500).json(err.message)
  }
}

exports.updateUpi = async (req, res) => {
  try {
    const { id } = req.params
    const payload = req.body
    let data
    let { verification } = payload
    if (payload.id) {
      ;[, data] = await UPI.update(
        {
          user_id: id,
          upi_id: payload.upi_id,
          name: payload.name,
          father_name: payload.father_name,
          reject_reason: payload.reject_reason,
          upi_status: payload.upi_status
        },
        { where: { id: payload.id }, returning: true, plain: true }
      )
        ;[, verification] = await Verifications.update(
          {
            verified: verification.verified,
            verified_at: verification.verified_at,
            verified_by: verification.verified_by
          },
          {
            where: {
              id: verification && verification.id
            },
            returning: true,
            plain: true
          }
        )
    } else {

      data = await UPI.create({
        user_id: id,
        upi_id: payload.upi_id,
        name: payload.name,
        father_name: payload.father_name,
        reject_reason: payload.reject_reason,
        upi_status: payload.upi_status
      })
      verification = await Verifications.create({
        kyc_id: data.id,
        type: 'upi',
        verified: verification.verified,
        verified_at: verification.verified_at,
        verified_by: verification.verified_by
      })
    }
    return res.status(200).json({
      data: {
        ...data.toJSON(),
        verification
      }
    })
  } catch (err) {
    console.log(err, 'err')
    res.status(500).json(err.message)
  }
}

exports.updatePan = async (req, res) => {
  try {
    const { id } = req.params
    const payload = req.body
    let data
    let { verification } = payload
    if (payload.id) {
      ;[, data] = await Pan.update(
        {
          user_id: id,
          name: payload && payload.name ? payload.name : '',
          pannumber: payload && payload.pannumber ? payload.pannumber : '',
          dob: payload && payload.dob ? payload.dob : '',
          pan_status: payload && payload.pan_status ? payload.pan_status : '',
          reject_reason: payload.reject_reason
        },
        { where: { id: payload.id }, returning: true, plain: true }
      )
        ;[, verification] = await Verifications.update(
          {
            verified: verification && verification.verified,
            verified_at: verification && verification.verified_at,
            verified_by: verification && verification.verified_by
          },
          {
            where: {
              id: verification.id
            },
            returning: true,
            plain: true
          }
        )
    } else {
      data = await Pan.create({
        user_id: id,
        name: payload.name,
        pannumber: payload.pannumber,
        dob: payload.dob,
        pan_status: payload.pan_status,
        reject_reason: payload.reject_reason
      })
      verification = await Verifications.create({
        kyc_id: data.id,
        type: 'pan',
        verified: verification.verified,
        verified_at: verification.verified_at,
        verified_by: verification.verified_by
      })
    }
    return res.status(200).json({
      data: {
        ...data.toJSON(),
        verification
      }
    })
  } catch (err) {
    console.log(err, 'err')
    res.status(500).json(err.message)
  }
}

exports.updateFromAdmin = async (req, res) => {
  try {
    let data
    let {
      firstname,
      lastname,
      // fathername,
      email,
      phone,
      // dob,
      gender,
      id,
      // password,
      profile_image,
      // touchId_enable,
      city,
      state,
      country,
      pincode,
      userType
      // device,  
      // referral    
    } = req.body
    const updateUser = {
      firstname,
      lastname,
      // fathername,
      email,
      phone,
      // dob,
      gender,
      // password,
      profile_image,
      userType,
      // touchId_enable,
      email_verified: 1,
      phone_verified: 1,
      status: 1
    }
    if (id == undefined) {
      data = await User.create(updateUser)
      if (data) {
        await UserAddress.create({
          city,
          // district: address && address.district ? address.district : null,
          state,
          country,
          pincode,
          user_id: data.id
        })
      }
    } else {
      ;[, data] = await User.update(updateUser, {
        where: { id },
        returning: true,
        plain: true
      })
      await UserAddress.update(
        {
          city,
          // district: address && address.district ? address.district : null,
          state,
          country,
          pincode,
        },
        { where: { user_id: id }, returning: true, plain: true }
      )
    }

    // if (id) {
    //   ;[, address] = await UserAddress.update(
    //     {
    //       city: address && address.city ? address.city : null,
    //       // district: address && address.district ? address.district : null,
    //       state: address && address.state ? address.state : null,
    //       country: address && address.country ? address.country : null,
    //     pincode: address && address.pincode ? address.pincode : null,
    //     },
    //     { where: { id: address.id }, returning: true, plain: true }
    //   )
    // } else {
    //   address = await UserAddress.create({
    //     city: address && address.city ? address.city : null,
    //     // district: address && address.district ? address.district : null,
    //     state: address && address.state ? address.state : null,
    //     country: address && address.country ? address.country : null,
    //     pincode: address && address.pincode ? address.pincode : null,
    //     user_id: id ? id : data.id
    //   })
    // }
    // if (device && device?.id) {
    //   ;[, device] = await UserDeviceInfo.update(
    //     {
    //       device_id: device && device?.device_id?device.device_id:null,
    //       device_token: device && device?.device_token ? device.device_token : null,
    //       device_name: device && device?.device_name ? device.device_name : null
    //     },
    //     { where: { id: device.id }, returning: true }
    //   )
    // } else {
    //   device = await UserDeviceInfo.create({
    //     device_id: device?.device_id,
    //     device_token: device?.device_token,
    //     device_name: device?.device_name,
    //     user_id: id ? id : data.id
    //   })
    // }

    // if (referral && referral?.id) {
    //   ;[, referral] = await UserReferralCodes.update(
    //     {
    //       referral_code: referral && referral.referral_code ? referral.referral_code : null,
    //       refered_by: referral && referral.refered_by ? referral.refered_by : null,
    //     },
    //     { where: { id: referral.id }, returning: true, plain: true }
    //   )
    // } else {
    //   referral = await UserReferralCodes.create({
    //     referral_code: referral && referral.referral_code ? referral.referral_code : null,
    //       refered_by: referral && referral.refered_by ? referral.refered_by : null,
    //     user_id: id ? id : data.id
    //   })
    // }
    let user = undefined
    if (id) {
      user = await User.findOne({
        where: { id },
        include: [
          {
            model: UserAddress,
            required: false,
            as: 'address'
          }
        ]
      })
    } else {
      user = await User.findOne({
        where: { id: data.id },
        include: [
          {
            model: UserAddress,
            required: false,
            as: 'address'
          }
        ]
      })
    }

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user
    })
  } catch (err) {
    console.log(err, 'err')
    res.status(500).json(err.message)
  }
}

exports.updateTouchId = async (req, res) => {
  const { touchId_enable } = req.body
  await User.update({ touchId_enable }, { where: { id: req.params.id } })
    .then(num => {
      if (num == 1) {
        res.status(200).send({
          message: 'Updated!!'
        })
      } else {
        res.status(400).send({
          message: `Can not update User with id ${req.params.id}`
        })
      }
    })
    .catch(err => res.status(500).send({ message: err.message }))
}

exports.emailCreate = async (req, res) => {
  await EmailTemplate.create(req.body)
    .then(data => {
      res.status(200).send(data)
    })
    .catch(err => res.status(500).send(err))
}

exports.uploadProfile = async (req, res) => {
  try {
    const file = req.file
    const id = req.body.id
    let image = ''
    if (file) {
      let data = await uploadImage(file)
      if (data && data.Location) {
        image = data.Location
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path)
        }
      } else {
        return res.status(500).send('Error in uploading Image!')
      }
    }
    if (image) {
      User.update({ profile_image: image }, { where: { id } })
        .then(num => {
          if (num == 1) {
            res.status(200).send({
              message: 'Image uploaded!!'
            })
          } else {
            res.status(400).send({
              message: `Can not update User with id ${id}`
            })
          }
        })
        .catch(err => res.status(500).send(err))
    }
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

exports.recordLoginActivity = async (req, res) => {
  try {
    const loginActivity = await UserLoginActivities.create(req.body)
    return res.status(200).json(loginActivity)
  } catch (err) {
    return res.status(500).json(err)
  }
}

exports.sendMobileOtp = async (req, res) => {
  try {
    const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
    const { phone, referral_code } = req.body
    const valid = regex.test(phone)
    let user_referral
    if (!valid) return res.status(401).json('Phone number is not valid')
    if (referral_code) {
      user_referral = await UserReferralCodes.findOne({
        where: { referral_code }
      })
      if (!user_referral)
        return res.status(404).send('Referral code is not valid!')
    }
    const options = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    axios
      .get(
        `https://api.msg91.com/api/v5/otp?template_id=${process.env.TEMPLATE_ID}&mobile=${phone}&authkey=${process.env.AUTH_KEY}&otp_length=6&otp_expiry=10&COMPANY_NAME=123456`,
        options
      )
      .then(async result => {
        const { type } = result.data
        if (type == 'error') {
          return res.status(401).json(result.data)
        } else {
          const [user, created] = await User.findOrCreate({
            where: { phone },
            defaults: { phone }
          })
          if (created && referral_code && user_referral) {
            await UserReferralCodes.create({
              user_id: user.id,
              refered_by: referral_code
            })
          }
          return res.json(user)
        }
      })
      .catch(err => {
        console.log(err, 'err1')
        return res.status(500).json(err)
      })
  } catch (err) {
    return res.status(500).json(err)
  }
}

exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body
    let user = await User.findOne({ where: { phone } })
    axios
      .get(`https://api.msg91.com/api/v5/otp/verify?otp=${otp}&authkey=${process.env.AUTH_KEY}&mobile=${phone}`)
      .then(async result => {
        const { type } = result.data
        if (type == 'error') {
          return res.status(401).json(result.data)
        } else {
          if (user.phone_verified == 0) {
            user = await User.update(
              { phone_verified: 1 },
              {
                where: { id: user.id }
              }
            )
          }
          return res.json(user)
        }
      })
      .catch(err => {
        console.log(err, 'err1')
        return res.status(500).json(err)
      })
  } catch (err) {
    console.log(err, 'err')
    return res.status(500).json(err)
  }
}

exports.resendOtp = async (req, res) => {
  try {
    const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
    const { phone } = req.body
    const valid = regex.test(phone)
    if (!valid) return res.status(401).json('Phone number is not valid')
    axios
      .get(
        `https://api.msg91.com/api/v5/otp/retry?retrytype=text&authkey=${process.env.AUTH_KEY}&mobile=${phone}`
      )
      .then(result => {
        const { type } = result.data
        if (type == 'error') {
          return res.status(401).json(result.data)
        } else {
          return res.status(200).json(result.data)
        }
      })
      .catch(err => {
        console.log(err, 'err1')
        return res.status(500).json(err)
      })
  } catch (err) {
    console.log(err, 'err')
    return res.status(500).json(err)
  }
}


exports.getAllUserUsingId = async (req, res) => {
  try {
    const { data } = req.body
    const user = await User.findAll({ where: { id: data }, attributes: ["id", "firstname", "lastname", "profile_image"] })
    if (user) {
      return res.status(200).json({
        success: true,
        user
      })
    } else {
      return res.status(200).json({
        success: false,
        message: "No users registered"
      })
    }
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}




exports.registerOrLoginOtpSendOnMobileNumber = async (req, res) => {
  try {
    const { phone } = req.body

    const options = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    axios
      .get(
        `https://api.msg91.com/api/v5/otp?template_id=${process.env.TEMPLATE_ID}&mobile=${phone}&authkey=${process.env.AUTH_KEY}&otp_length=6&otp_expiry=10&COMPANY_NAME=123456`,
        options
      )
      .then(async result => {
        const { type } = result.data
        if (type == 'error') {
          return res.status(200).json({
            success: false,
            message: result.data
          })
        } else {
          return res.status(200).json({
            success: true,
            message: "OTP Sent Successfully"
          })
        }
      })
      .catch(err => {
        return res.status(200).json({
          success: false,
          message: "Something went wrong.Please try later."
        })
      })
  } catch (err) {
    return res.status(500).json(err)
  }
}

exports.registerOrLoginOtpVerify = async (req, res) => {
  try {
    const { phone, otp } = req.body

    let user = await User.findOne({
      where: { phone },
      include: [
        {
          model: UserAddress,
          required: false,
          as: 'address'
        }
      ]
    })

    if (user && user?.status == 0) {
      return res.status(200).json({
        success: false,
        message: "User inactive.Please contact with admin"
      })
    }
    else if (user) {
      if (user?.userType == "reseller") {
        return res.status(200).json({
          success: false,
          message: "Unauthorized Access"
        })
      } else {
        axios
          .get(
            `https://api.msg91.com/api/v5/otp/verify?otp=${otp}&authkey=${process.env.AUTH_KEY}&mobile=+91${phone}`
          )
          .then(async result => {
            const { type } = result.data
            if (type == 'error') {
              return res.status(200).json({
                success: false,
                message: result.data
              })
            } else {
              await User.update({dob:"",updatedAt:new Date()},{where:{
        id:user?.id
      }})
              return res.status(200).json({
                success: true,
                message: "User Login Successfully",
                data: user
              })
            }
          })
          .catch(err => {
            return res.status(200).json({
              success: false,
              message: "Something went wrong.Please try later."
            })
          })
      }

    } else {
      axios
        .get(
          `https://api.msg91.com/api/v5/otp/verify?otp=${otp}&authkey=${process.env.AUTH_KEY}&mobile=+91${phone}`
        )
        .then(async result => {
          const { type } = result.data
          if (type == 'error') {
            return res.status(200).json({
              success: false,
              message: result.data
            })
          } else {
            const data = await User.create({
              phone, phone_verified: 1, userType: "student"
            })
            if (data) {
              return res.status(200).json({
                success: true,
                message: "User Registered Successfully",
                data
              })
            } else {
              return res.status(200).json({
                success: false,
                message: "Something went wrong.Please try later."
              })
            }
          }
        })
        .catch(err => {
          return res.status(200).json({
            success: false,
            message: "Something went wrong.Please try later."
          })
        })
    }

  } catch (err) {
    console.log(err, 'err')
    return res.status(500).json(err)
  }
}



exports.registerOrLoginOtpVerifyReseller = async (req, res) => {
  try {
    const { phone, otp } = req.body

    let user = await User.findOne({
      where: { phone },
      include: [
        {
          model: UserAddress,
          required: false,
          as: 'address'
        }
      ]
    })

    if (user && user?.status == 0) {
      return res.status(200).json({
        success: false,
        message: "User inactive.Please contact with admin"
      })
    }
    else if (user) {
      if (user?.userType != "reseller") {
        return res.status(200).json({
          success: false,
          message: "Unauthorized Access"
        })
      } else {
        axios
          .get(
            `https://api.msg91.com/api/v5/otp/verify?otp=${otp}&authkey=${process.env.AUTH_KEY}&mobile=+91${phone}`
          )
          .then(async result => {
            const { type } = result.data
            if (type == 'error') {
              return res.status(200).json({
                success: false,
                message: result.data
              })
            } else {
              return res.status(200).json({
                success: true,
                message: "User Login Successfully",
                data: user
              })
            }
          })
          .catch(err => {
            return res.status(200).json({
              success: false,
              message: "Something went wrong.Please try later."
            })
          })
      }

    } else {
      axios
        .get(
          `https://api.msg91.com/api/v5/otp/verify?otp=${otp}&authkey=${process.env.AUTH_KEY}&mobile=+91${phone}`
        )
        .then(async result => {
          const { type } = result.data
          if (type == 'error') {
            return res.status(200).json({
              success: false,
              message: result.data
            })
          } else {
            const data = await User.create({
              phone, phone_verified: 1, userType: "reseller"
            })
            if (data) {
              return res.status(200).json({
                success: true,
                message: "User Registered Successfully",
                data
              })
            } else {
              return res.status(200).json({
                success: false,
                message: "Something went wrong.Please try later."
              })
            }
          }
        })
        .catch(err => {
          return res.status(200).json({
            success: false,
            message: "Something went wrong.Please try later."
          })
        })
    }

  } catch (err) {
    console.log(err, 'err')
    return res.status(500).json(err)
  }
}

exports.completeProfile = async (req, res) => {
  try {
    const { id } = req.params
    const { firstname, lastname, email, gender, country, state, city, pincode, profile_image } = req.body
    await User.update({ firstname, lastname, profile_image, email, email_verified: 0 }, {
      where: {
        id
      }
    })
    const data = await User.findOne({
      where: { id },
      include: [
        {
          model: UserAddress,
          required: false,
          as: 'address'
        }
      ]
    })
    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      data
    })
    // const findAddress = await UserAddress.findOne({
    //   where: {
    //     user_id: id
    //   }
    // })
    // if (findAddress) {
    //   await UserAddress.update({
    //     country, state, city, pincode
    //   }, { where: { user_id: id } })
    //   const data = await User.findOne({
    //     where: { id },
    //     include: [
    //       {
    //         model: UserAddress,
    //         required: false,
    //         as: 'address'
    //       }
    //     ]
    //   })
    //   return res.status(200).json({
    //     success: true,
    //     message: "Profile Updated Successfully",
    //     data
    //   })
    // } else {
    //   let createAddress = await UserAddress.create({
    //     country, state, city, pincode, user_id: id
    //   })
    //   if (createAddress) {
    //     const data = await User.findOne({
    //       where: { id },
    //       include: [
    //         {
    //           model: UserAddress,
    //           required: false,
    //           as: 'address'
    //         }
    //       ]
    //     })
    //     return res.status(200).json({
    //       success: true,
    //       message: "Profile Updated Successfully",
    //       data
    //     })
    //   } else {
    //     return res.status(200).json({
    //       success: false,
    //       message: "Something went wrong.Please try again."
    //     })
    //   }
    // }
  } catch (err) {
    return res.status(500).json({
      success: false,
      err
    })
  }
}


exports.uploadImageData = async (req, res) => {
  try {
    const file = req.file;
    let image = req.body.image;
    if (file) {
      let data = await uploadImage(file);
      if (data && data.Location) {
        image = data.Location;
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } else {
        return res.status(500).send("Error in uploading Image!");
      }
    }
    return res.status(200).json({
      "image": image
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false
    })
  }

  // console.log("error",res);
}

exports.completeProfileUpdateImage = async (req, res) => {
  try {
    const { id } = req.params
    const { profile_image } = req.body
    await User.update({ profile_image }, { where: { id } })
    const data = await User.findOne({
      where: { id },
      include: [
        {
          model: UserAddress,
          required: false,
          as: 'address'
        }
      ]
    })
    return res.status(200).json({
      success: true,
      message: "Profile Image Updayed Successfully",
      data
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      err
    })
  }
}

exports.emailVerificationOtpSent = async (req, res) => {
  try {
    const { email, id } = req.body
    const userPresent = await User.findOne({ where: { email } })
    const data = await User.findOne({ where: { id } })

    if (userPresent) {
      return res.status(200).json({
        success: false,
        message: "Email Already Registered"
      })
    } else {
      let otp = String(Math.floor(Math.random() * 899999 + 100000))
      let findUserInfo = await UserEmailVerification.findOne({
        where: { user_id: id }
      })
      if (findUserInfo) {
        await UserEmailVerification.update({
          email_verification_key: otp,
          email_verification_sent_at: new Date()
        }, { where: { user_id: id } })
      } else {
        let userInfo = await UserEmailVerification.create({
          user_id: data?.id,
          email_verification_key: otp,
          email_verification_sent_at: new Date()
        })
      }
      let findUpdatedUser = await UserEmailVerification.findOne({ where: { user_id: id } })

      if (findUpdatedUser) {
        const data2 = await axios.get(`${API_URL}/quizophy_icons_container`)
        const { data } = await axios.get(`${API_URL}/email_details`)
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
        })

        var mailOptions = {
          from: data.value.Email,
          to: email,
          subject: 'testerika Email Verification OTP',

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
                 
                                            <div  class="col-12">
                                             <h4 style="text-align: left;font-size: 20px;">Confirm Your Email</h4>
                                             <h4 style="text-align: left;font-size: 20px;">OTP Requested</h4>
                                             <h4 style="text-align: left;font-size: 20px;">Hi,</h4>
                                             <p style="text-align: left;font-size: 12px;">Your One Time Password (OTP) is <button style="font-size: 18px;margin-left:5px;background-color: #1877f2;color: white;width:auto;padding: 5px 8px;border-radius: 10px;border:none;outline: none;">${otp}</button> </p>
                                             <p style="font-size: 12px;text-align: left;">Please do not share the OTP with anyone. As it contain your personal information !!</p>
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
          if (error) {
            return res.status(200).json({
              message: "Something went wrong",
              success: false
            })
          } else {
            return res.status(200).json({
              message: info.response,
              success: true
            })
          }
        });
      } else {
        return res.status(200).json({
          success: false,
          message: "Something Went Wrong"
        })
      }

    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false
    })
  }


}




exports.emailVerificationOtpVerified = async (req, res) => {
  try {
    const { id, otp, email } = req.body
    const findEmail = await UserEmailVerification.findOne({ where: { user_id: id, email_verification_key: otp } })
    if (!findEmail) {
      return res.status(200).json({
        success: false,
        message: "OTP you have entered is invalid or expired"
      })
    } else {
      if (otp == findEmail.dataValues.email_verification_key) {
        await UserEmailVerification.update({
          email_verified_at: new Date()
        }, { where: { user_id: id } })
        await User.update({
          email_verified: 1,
          email
        }, { where: { id } })
        let user = await User.findOne({
          where: { id },
          include: [
            {
              model: UserAddress,
              required: false,
              as: 'address'
            }
          ]
        })
        if (user) {
          return res.status(200).json({
            success: true,
            message: "Email Verified Successfully",
            data: user
          })
        }
      } else {
        return res.status(200).json({
          success: false,
          message: "Invalid OTP"
        })
      }
    }
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.checkUserExistOrNot = async (req, res) => {
  try {
    const { id } = req.params
    let user = await User.findOne({
      where: {
        id, userType: {
          [Op.ne]: "reseller"
        }
      },
      include: [
        {
          model: UserAddress,
          required: false,
          as: 'address'
        }
      ]
    })
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User Doesn't Exist"
      })
    } else {
     await User.update({dob:"",updatedAt:new Date()},{where:{
        id:user?.id
      }})
      return res.status(200).json({
        success: true,
        message: "User Exist"
      })
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      err
    })
  }
}

exports.checkUserExistOrNotReseller = async (req, res) => {
  try {
    const { id } = req.params
    let user = await User.findOne({
      where: { id, userType: "reseller" },
      include: [
        {
          model: UserAddress,
          required: false,
          as: 'address'
        }
      ]
    })
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User Doesn't Exist"
      })
    } else {
      return res.status(200).json({
        success: true,
        message: "User Exist"
      })
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      err
    })
  }
}

exports.getAllRegisteredusersCoupon = async (req, res) => {
  try {
    const data = await User.findAll({
      attributes: ["id", "firstname", "lastname", "email", "phone"],
      order: [['id', 'DESC']]
    })
    return res.status(200).json({
      success: true,
      data
    })
  } catch (err) {
    // ErrorLogsFunction(err)
    console.log(err, 'err')
    return res.status(500).json(err.message)
  }
}

exports.findUserByIdForPaymentDetail = async (req, res) => {
  try {
    const data = await User.findOne({
      where: {
        id: req.params.user_id
      },
      attributes: ["id", "email", "firstname", "lastname", "phone"]
    })
    if (data) {
      return res.status(200).json({
        success: true,
        data
      })
    } else {
      return res.status(200).json({
        success: false,
        data: null
      })
    }
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}


exports.getAllUsersUsingUserId = async (req, res) => {
  try {
    const { userIds } = req.body
    const data = await User.findAll({
      where: {
        id: userIds
      },
      attributes: ["id", "firstname", "lastname", "profile_image", "phone", "email"]
    })
    if (data) {
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

exports.updateUserStatus = async (req, res) => {
  try {
    const { id, status } = req.body
    await User.update({ status }, {
      where: {
        id
      }
    })
    return res.status(200).json({
      success: true
    })
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.getAllUsersAndResellers = async (req, res) => {
  try {
    const data = await User.count({
      where: {
        [Op.or]: [
          { userType: { [Op.ne]: "reseller" } },
          { userType: null }
        ]
      }
    })
    console.log(data)
    const data2 = await User.count({
      where: {
        userType: "reseller"
      }
    })
    if (data) {
      return res.status(200).json({
        success: true,
        user: data,
        reseller: data2
      })
    } else {
      return res.status(200).json({
        success: false,
        user: [],
        reseller: []
      })
    }
  } catch (err) {
    console.log(err, "?????????????????????????????????????////")
    return res.status(500).json({
      success: false
    })
  }
}

// Reseller API 
exports.findAllReseller = async (req, res) => {
  try {
    let { page, items_per_page, search } = req.query
    let data
    page = parseInt(page)
    items_per_page = parseInt(items_per_page)
    const offset = (page - 1) * items_per_page
    const limit = items_per_page
    if (search) {
      data = await User.findAndCountAll({
        distinct: true,
        offset,
        limit,
        where: {
          phone: { [Op.like]: `%${search}%` },
          userType: "reseller"
          // short_name: { [Op.like]: `%${search}%` }
        },
        order: [['id', 'DESC']]
      })
    } else {
      data = await User.findAndCountAll({
        where: {
          userType: "reseller"
          // short_name: { [Op.like]: `%${search}%` }
        },
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
    console.log(err, 'err')
    return res.status(500).json(err.message)
  }
}


exports.updateUserRoleStatus = async (req, res) => {
  try {
    const user = await User.findAll({
      where: {
        [Op.or]: [
          { userType: { [Op.notIn]: ['student', 'reseller'] } },
          { userType: null }
        ]
      },
      attributes: ["id"]
    })

    console.log(user, ">>>>>>>>>>>>>>>>>>>>> suer")

    if (user?.length > 0) {
      user?.map(async (item) => {
        await User.update({ userType: "student" }, { where: { id: item?.dataValues?.id } })
      })

      return res.status(200).json({
        success: true
      })
    } else {
      return res.status(200).json({
        success: false
      })
    }

  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.todayRegisteredUser = async (req, res) => {
  try {
    const startOfToday = moment().tz('Asia/Kolkata').startOf('day').toDate();
const endOfToday = moment().tz('Asia/Kolkata').endOf('day').toDate();
    const data = await User.findAll({
      where: {
        createdAt: {
          [Op.between]: [startOfToday, endOfToday],
        },
      },
      attributes: ["id"]
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

exports.updateUserTodayLogin=async (req,res)=>{
  try{
     const startOfToday = moment().tz('Asia/Kolkata').startOf('day').toDate();
const endOfToday = moment().tz('Asia/Kolkata').endOf('day').toDate();
    const data = await User.findAll({
      where: {
        updatedAt: {
          [Op.between]: [startOfToday, endOfToday],
        },
      },
      attributes: ["id","firstname","lastname","email","phone"]
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
  }catch(err){
     return res.status(500).json({
      success:false
     })
  }
}