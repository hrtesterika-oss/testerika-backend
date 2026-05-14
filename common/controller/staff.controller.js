require('dotenv').config();
const dbContext = require("../models");
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const Staff = dbContext.Staff
const StaffEmailOtp=dbContext.StaffEmailOtp
const bcryptJS=require("bcryptjs")
const nodemailer=require("nodemailer")
const { uploadImage } = require('../middleware/fileUploader');
const fs = require('fs');
const axios = require('axios')
const { StaffPermissions, RolePermissions } = require('../models');
const jwt = require('jsonwebtoken');
const { hashPassword, createTokenForAuthentication, decryptPassword } = require('../services');
const Roles = dbContext.Roles
const Options=dbContext.Options
const Coupons=dbContext.Coupons


exports.findAll = async (req, res) => {
    try {
        let { page, items_per_page, search } = req.query
        let data;
        page = parseInt(page)
        items_per_page = parseInt(items_per_page)
        const offset = (page - 1) * items_per_page;
        const limit = items_per_page;
        if (search) {
            data = await Staff.findAndCountAll({
                distinct: true,
                offset,
                limit,
                where: {
                    first_name: { [Op.like]: `%${search}%` }
                    // short_name: { [Op.like]: `%${search}%` }
                },
                order: [
                    ['id', 'DESC']
                ],
            })
        } else {
            data = await Staff.findAndCountAll({
                distinct: true,
                offset,
                limit,
                order: [
                    ['id', 'DESC']
                ],
            });
        }
        let last_page = (data.count / items_per_page) <= page ? page : page + 1;
        let previos = {
            active: false,
            label: "&laquo; Previous",
            page: page == 1 ? null : page - 1,
            url: page == 1 ? null : `/?page=${page - 1}`,
        }
        let next = {
            active: false,
            label: "Next &raquo;",
            page: page == last_page ? null : page + 1,
            url: page == last_page ? null : `/?page=${page + 1}`,
        }
        let links = Array(last_page).fill().flatMap((_, i) => [
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
                    first_page_url: "/?page=1",
                    from: offset + 1,
                    items_per_page,
                    last_page,
                    links,
                    next_page_url: page == last_page ? null : `/?page=${page + 1}`,
                    page: page,
                    prev_page_url: page == 1 ? null : `/?page=${page - 1}`,
                    to: limit,
                    total: data.count,
                }
            }
        })
    }
    catch (err) {
        console.log(err, "err")
        return res.status(500).json(err)
    }
}

exports.create = async (req, res) => {
    try {
        const file = req.file
        let { permissions } = req.body
        let profile_image = null
        if (file) {
            let data = await uploadImage(file)
            if (data && data.Location) {
                profile_image = data.Location
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            } else {
                return res.status(500).send('Error in uploading Image!')
            }
        }
        const data = await Staff.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            phone_number: req.body.phone_number,
            password: req.body.password.toString(),
            profile_image,
            admin: req.body.admin,
            role_id: req.body.role_id,
        });
        const permission = JSON.parse(permissions).flatMap((item, i) => [{
            staff_id: data.id,
            permission_id: item.permission_id,
            can_view: item.can_view,
            can_view_own: item.can_view_own,
            can_create: item.can_create,
            can_edit: item.can_edit,
            can_delete: item.can_delete
        }]);
        await StaffPermissions.bulkCreate(permission);
        return res.status(200).json({ data })
    }

    catch (err) {
        console.log(err, "err")
        return res.status(500).json(err)
    }
}


exports.register=async(req,res)=>{
    try{
          const {email,phone_number,password}=req.body
          const data1=await Staff.findOne({where:{email:email.toLowerCase()}})
          const data2=await Staff.findOne({where:{phone_number}})
          if(data1){
            return res.status(200).json({
                success:false,
                message:"Email already exist"
            })
          }
          if(data2){
            return res.status(200).json({
                success:false,
                message:"Phone number already exist"
            })
          }
          const hashPasswordForUser=await bcryptJS.hash(req.body.password,12)
          if(hashPasswordForUser){
            let data=await Staff.create({...req.body,password:hashPasswordForUser,email:email.toLowerCase()})
            const token=await createTokenForAuthentication(data.id)
            data = { ...data.toJSON(), token,password }
            if(data){
                return res.status(200).json({
                    success:true,
                    message:"Registration successful",
                    data
                })
            }
          }
    }catch(err){
        return res.status(500).json({
            success:false,
        })
    }
}

exports.checkEmail = async (req, res) => {
    try {
        const { email } = req.query
        const data = await Staff.findOne({
            where: { email:email.toLowerCase() }
        });

        if (data) {
            return res.status(200).json({ data: 'Email already exists' })
        }
        else {
            return res.status(200).json({ data: 'Email not found' })
        }

    } catch (err) {
        console.log(err, "err")
        res.status(500).json(err.message)
    }
}

exports.getRoles = async (req, res) => {
    try {
        const data = await Roles.findAll({
            include: [
                {
                    model: RolePermissions,
                    required: false,
                    as: 'permissions'
                }
            ]
        });
        return res.status(200).json({ data })
    } catch (err) {
        console.log(err, "err")
        res.status(500).json(err)
    }
}

exports.findById = async (req, res) => {
    try {
        const { id } = req.params
        const data = await Staff.findOne({
            where: { id },
            include: [
                {
                    model: StaffPermissions,
                    as: 'permissions',
                    required: false
                }
            ]
        });

        return res.status(200).json({ data });
    }
    catch (err) {
        return res.status(500).json(err);
    }
}

exports.update = async (req, res) => {
    try{
        const {email,phone_number,password,first_name,last_name,profile_image}=req.body
        const {id}=req.params
        const data=await Staff.findOne({where:{id}})
        const data1=await Staff.findOne({where:{email:email.toLowerCase(),id:{[Op.ne]: id}}})
        const data2=await Staff.findOne({where:{phone_number,id:{[Op.ne]:id}}})
        
        if(data1){
           return res.status(200).json({
              success:false,
              message:"Email already exist"
           })
        }

        if(data2){
          return res.status(200).json({
             success:false,
             message:"Phone Number already exist"
          })
       }
          const decryptPasswordForUser=await decryptPassword(password,data.password)
          if(!decryptPasswordForUser){
              let hashpasswordForUser=await hashPassword(password)
              await Staff.update({
                  first_name, last_name,email,phone_number,profile_image,password:hashpasswordForUser
              }, {
                  where: { id }, returning: true, plain: true
              });
              const findStaff=await Staff.findOne({where:{id}})
              findStaff.password=password
          }else{
            await Staff.update({
                first_name, last_name,email,phone_number,profile_image
            }, {
                where: { id }, returning: true, plain: true
            });
          }
          
          const findStaff=await Staff.findOne({where:{id}})
          findStaff.password=password
              return res.status(200).json({
                  success:true,
                  message:"Profile updated successfully",
                  data:findStaff
              })
        }
  catch(err){
      console.log(err)
      return res.status(500).json({
          success:false,
      })
  }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        let data = await Staff.findOne({
            where: { email:email.toLowerCase() }
        });
        if (!data) {
            return res.json({ 
            success:false,
            message: 'Invalid Email!' 
        })
      }
        

        // const decryptPasswordForStaff=await decryptPassword(password,data?.dataValues?.password)
        const decryptPasswordForStaff=await bcryptJS.compare(req.body.password,data.dataValues.password)
        if(decryptPasswordForStaff){
            const token=await createTokenForAuthentication(data.id)
            data = { ...data.toJSON(), token ,password}
            return res.status(200).json({
                success:true,
                message:"Login succcessfully",
                data
            })
            // const options = {
            //     headers: {
            //         "Content-Type": "application/json"
            //     }
            // };
          
            // axios.get(`https://api.msg91.com/api/v5/otp?template_id=${process.env.TEMPLATE_ID}&mobile=${data.phone_number}&authkey=${process.env.AUTH_KEY}&otp_length=6&otp_expiry=10&COMPANY_NAME=123456`, options)
            //     .then(async (result) => {
            //         const { type } = result.data
            //         if (type == 'error') {
            //             return res.json({
            //                 success:false,
            //                 message:"Something went wrong",
            //                 data:result.data})
            //         } else {
            //             return res.status(200).json({
            //                 success:true,
            //                 message:"OTP sent succcessfully",
            //                 data})
            //         }
            //     }).catch(err => {
            //         return res.status(500).json(err.message)
            //     })
        }else{
            return res.status(200).json({
                success:false,
                message:"Invalid Password"
            })
        }
      
    }
    catch (err) {
        return res.status(500).json(err.message)
    }
}

exports.verifyOtp = async (req, res) => {
    try {
        const { phone_number, otp } = req.body
        let staff = await Staff.findOne({ where: { phone_number } });
        await axios.get(`https://api.msg91.com/api/v5/otp/verify?otp=${otp}&authkey=${process.env.AUTH_KEY}&mobile=${phone_number}`)
            .then(async (result) => {
                const { type } = result.data
                if (type == 'error') {
                    return res.json({
                        success:false,
                        message:result.data?.message})
                } else {
                     staff.dataValues.password=undefined;
                     await Staff.findOne({last_login:new Date()},{ where: { phone_number } });
                    return res.status(200).json({
                        success:true,
                        message:"Login Successfully",
                        data:staff.dataValues})
                }
            }).catch(err => {
                return res.status(500).json(err.message)
            })
    }
    catch (err) {
        return res.status(500).json(err.message);
    }
}

exports.resendOtp = async (req, res) => {
    try {
        const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        const { phone_number } = req.body
        const valid = regex.test(phone_number)
        if (!valid) return res.status(401).json({
            success:false,
            message:'Phone number is not valid'})
        axios.get(`https://api.msg91.com/api/v5/otp/retry?retrytype=text&authkey=${process.env.AUTH_KEY}&mobile=${phone_number}`)
            .then(result => {
                const { type } = result.data
                if (type == 'error') {
                    return res.status(401).json({
                        success:false,
                        message:result.data.message})
                } else {
                    return res.status(200).json({
                        success:true,
                        message:"OTP sent successfully"})
                }
            }).catch(err => {
                return res.status(500).json(err)
            })
    }
    catch (err) {
        console.log(err, "err")
        return res.status(500).json(err);
    }
}

exports.delete = async (req, res) => {
    try {
        const { id } = req.params
        await Staff.destroy({
            where: { id }
        });
        return res.status(200).json({
            success:true,
            message:"Record deleted",
        })
    }
    catch (err) {
        return res.status(500).json(err)
    }
}


exports.updateStaff=async(req,res)=>{
    try{
          const {email,phone_number,password,first_name,last_name,profile_image,role_id,permissions,admin}=req.body
          const {id}=req.params
          const data=await Staff.findOne({where:{id}})
          const data1=await Staff.findOne({where:{email:email.toLowerCase(),id:{[Op.ne]: id}}})
          const data2=await Staff.findOne({where:{phone_number,id:{[Op.ne]:id}}})
          
          if(data1){
             return res.status(200).json({
                success:false,
                message:"Email already exist"
             })
          }

          if(data2){
            return res.status(200).json({
               success:false,
               message:"Phone Number already exist"
            })
         }
            for(let item of permissions){
                const [count,createdData]=await StaffPermissions.findOrCreate({where:{permission_id:item.permission_id,staff_id:id},
                defaults: item})
                if(!createdData){
                        await StaffPermissions.update(item, {
                            where: { id: item.id }
                        })
                }
            }
            const decryptPasswordForUser=await decryptPassword(password,data.password)
            if(!decryptPasswordForUser){
                await Staff.update({
                    first_name, last_name,email,phone_number,profile_image,role_id,admin
                }, {
                    where: { id }, returning: true, plain: true
                });
                const findStaff=await Staff.findOne({where:{id}})
                findStaff.password=password
            }
            await Staff.update({
                first_name, last_name,email,phone_number,profile_image,role_id,admin
            }, {
                where: { id }, returning: true, plain: true
            });
            const findStaff=await Staff.findOne({where:{id}})
            findStaff.password=password
                return res.status(200).json({
                    success:true,
                    message:"Staff updated successfully",
                    data:findStaff
                })
          }
    catch(err){
        return res.status(500).json({
            success:false,
        })
    }
}

exports.createStaff=async(req,res)=>{
    try{
          const {email,phone_number,password,role_id,first_name,last_name,profile_image,permissions}=req.body
          const data1=await Staff.findOne({where:{email:email.toLowerCase()}})
          const data2=await Staff.findOne({where:{phone_number}})
          if(data1){
             return res.status(200).json({
                success:false,
                message:"Email already exist"
             })
          }

          if(data2){
            return res.status(200).json({
               success:false,
               message:"Phone Number already exist"
            })
         }
            const hashPasswordForUser=await hashPassword(password)
            const data=await Staff.create({first_name,last_name,email:email?.toLowerCase(),phone_number,password:hashPasswordForUser,role_id,profile_image})
            let permissiondata=permissions.flatMap((item,i)=>[
                {
                    staff_id:data?.id,
                    permission_id: item.permission_id,
                    can_view: item.can_view,
                    can_view_own: item.can_view_own,
                    can_create: item.can_create,
                    can_edit: item.can_edit,
                    can_delete: item.can_delete
                }
            ])
            let data4=await StaffPermissions.bulkCreate(permissiondata);
            return res.status(200).json({
                success:true,
                message:"Staff created successfully",
                data
            })
          
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
        })
    }
}

exports.forgotPassword=async(req,res)=>{
    const {email}=req.body
    const userPresent=await Staff.findOne({where:{email:email?.toLowerCase()}})
    if(!userPresent){
       return res.status(200).json({
           success:false,
           message:"Email Not Registered"
       })
    }else{
       let otp=String(Math.floor((Math.random()*1000000)+1));
       if(otp.length<6){
          otp=otp+"0"
       }
       const previousData=await StaffEmailOtp.findAll({where:{email:email.toLowerCase()}})
       if(previousData.length>0){
           await StaffEmailOtp.destroy({where:{email:email.toLowerCase()}})
       }
       let expireTime=new Date()
       expireTime.setMinutes(((expireTime.getMinutes())+40))
       const dataInTable=await StaffEmailOtp.create({email:email.toLowerCase(),expires:expireTime,otp:Number(otp)})
       if(dataInTable){
        let emailDetail=await Options.findOne({where:{name:"email_details"}})
        let iconSetting=await Options.findOne({where:{name:"quizophy_icons_container"}})

           var transporter = nodemailer.createTransport({
               // service: 'gmail',
               host: emailDetail.value.SMTP_Host,
               port: emailDetail.value.SMTP_Port,
               secure: true,
               auth: {
                 user: emailDetail.value.Email,
                 pass: emailDetail.value.SMTP_Password
               },
               tls:{rejectUnauthorized:false}
           
             });
             
             var mailOptions = {
               from:emailDetail.value.Email,
               to: email,
               subject: 'testerika Email Verification OTP',

               html:`
                 <div class="" style="background-color:#fbf0f0; padding:30px; width:550px;margin:auto;box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;">
 
                 <a href="https://live.testerika.com"><img style="width:120px; margin-bottom:20px"src=${iconSetting.value.quizophy_dark_logo} alt="testerika Pvt Ltd" border="0" /></a>




                   <h1 >Confirm Your Email</h1>
                   <p style="color:black;font-size:22px;text-align:left;letter-spacing:1px;margin-left:0px;opacity:0.6">OTP Requested</p>
                   <p style="color:black;font-size:19px;text-align:left;letter-spacing:1px;margin-left:0px;opacity:0.6">Hi</p>
                   <table>
                     <tr>
                        <td>
                        <p style="color:black;font-size:19px;text-align:left;letter-spacing:1px;opacity:0.6;margin:0">Your One Time Password (OTP) is</p>
                        </td>
                        <td >
                        <span style="font-size:20px;color:white;opacity:1;margin:0px ; background-color:#1150f1; padding:10px;border-radius:10px">
                         ${otp}</span>


                        </td>
                     </tr>
                     <tr>
                       <td>
                       <p style="color:black;font-size:19px;text-align:left;letter-spacing:1px;margin-left:0px;opacity:0.6">OTP Will Expire in next 5 minutes</p>
                       <p style="color:black;font-size:19px;text-align:left;letter-spacing:1px;opacity:0.6; margin:0px">Thank You,</p>
                       <p style="color:black;font-size:19px;text-align:left;letter-spacing:1px;margin-left:0px;opacity:1">testerika PVT LTD</p>
                        </td>
                     </tr>

                     <tr>
                       <td>
                       <a href="https://play.google.com/store/apps/details?id=com.testerika" target="_blank" style="padding:10px;border-radius:10px; text-decoration:none ; width:100px; height:100px">
                         <img  style="width:150px;height:50px;" src=${iconSetting.value.play_store_icon}/>
                       </a>

                        </td>
                     </tr>
                   </table>




                 </div>
               `
             };
             
             transporter.sendMail(mailOptions, function(error, info){
               if (error) {
                console.log(error)

                return res.status(400).json({
                   "message":"Something went wrong",
                   "success":false
                 })
               } else {
                return res.status(200).json({
                   message:info.response,
                   success:true
                 })
               }
             });
       }else{
           return res.status(500).json({
               success:false,
           })
       }
       
    }

   
 }

 exports.restPassword=async(req,res)=>{
   const {email,otp,password}=req.body
   const findEmail=await StaffEmailOtp.findOne({where:{email,otp,expires:{[Op.gte]: new Date()}}})
    
   if(!findEmail){
       return res.status(200).json({
           success:false,
           message:"Please Enter Valid OTP"
       })
   }else{
       if(otp===findEmail.otp){
        const hashPasswordForUser=await hashPassword(password)
        await Staff.update({password:hashPasswordForUser},{where:{email}})
          return res.status(200).json({
               success:true,
               message:"Password Reset Successfully"
           })
       }else{
           return res.status(404).json({
               success:false,
           })
       }
   }
}


exports.uploadImageData=async (req,res)=>{
    try{
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
            success:true,
            image:image
          })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success:false
        })
    }
   
}

exports.uploadMediaImageData=async (req,res)=>{
    try{
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
        let images=await Options.findOne({
            where:{
                name:"media"
            }
        })

        if(images && images?.id){
            if(!images?.value){
                let payload=[image]
                await Options.update({value:payload},{where:{
                    id:images?.id
                }})
                return res.status(200).json({
                    success:true,
                    image:image
                  })
            }else{
                let payload=[image,...images.value]
                await Options.update({value:payload},{where:{
                    id:images?.id
                }})
                return res.status(200).json({
                    success:true,
                    image:image
                })
            }
            
        }
        
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success:false
        })
    }
   
}

