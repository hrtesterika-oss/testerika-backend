require('dotenv').config();
const { Op } = require('sequelize');
const dbContext = require("../models");

const AWS = require('aws-sdk');
const axios =require("axios");
const { API_URL } = require('../services');
const Passes = dbContext.Passes
const PassType=dbContext.PassType
const PassTypeFeature=dbContext.PassTypeFeature
exports.createPasses=async (req,res)=>{
    try{
        const {pass_name,duration,price_inr,price_usd,pass_type}=req.body
        const data=await Passes.create({pass_name,duration,price_inr,price_usd,pass_type_id:pass_type?.id})
        if(data){
            return res.status(201).json({
                success:true,
                data
            })
        }
    }catch(err){
        return res.status(500).json({
            success:false
        })
    }
}
exports.getAllPasses=async (req,res)=>{
    try{
        // const data3=await axios.get(`${API_URL}/quizophy_AWS_settings`)

        // // Configure AWS credentials
        
        // AWS.config.update({
        // accessKeyId:data3?.data.value.quizophy_aws_s3_access_key,
        // secretAccessKey: data3?.data.value.quizophy_aws_s3_access_secret_key,
        // region: 'ap-south-1', // e.g., 'us-east-1'
        // });

        // // Create S3 instance
        // const s3 = new AWS.S3();

        // // Define parameters for listing objects in the bucket
        // const params = {
        // Bucket: data3?.data.value.quizophy_aws_s3_bucket_name,
        // Prefix: '50c96987', // Prefix to filter objects
        // };

        // // List objects in the S3 bucket with the specified prefix
        // s3.listObjects(params, (err, data) => {
        // if (err) {
        //     console.error('Error listing objects:', err);
        // } else {
        //     // Log the list of image files
        //     console.log('Images in the bucket:', data.Contents);
        // }
        // });

        const features=await PassTypeFeature.findAll({
            attributes:["id","pass_type_id","feature"],
            order:[["id","DESC"]]
        })
        const data=await Passes.findAll({
           attributes:["id","pass_name","pass_type_id","price_inr","price_usd","duration","status"],
           include:[
            {
                model:PassType,
                required:false,
                attributes:["id","name","visible"],
                include:[
                    {
                        model:PassTypeFeature,
                        required:false,
                        as:"features",
                        attributes:["id","pass_type_id","feature"],
                        order:[["id","DESC"]]
                    }
                ],
                order:[["id","DESC"]]
            }
           ],
           order:[["id","DESC"]]
        })
        const data2=await PassType.findAll({
            where:{
               visible:1
            },
            attributes:["id","name","visible"],
            include:[
                {
                    model:PassTypeFeature,
                    required:false,
                    as:"features",
                    attributes:["id","pass_type_id","feature"],
                    order:[["id","DESC"]]
                }
            ],
            
            order:[["id","DESC"]]
         })
        return res.status(200).json({
            success:true,
            data,
            features,
            data2
        })
    
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success:false
        })
    }
}
exports.findAll = async (req, res) => {
    try {
        let { page, items_per_page, search } = req.query
        let data;
        page = parseInt(page)
        items_per_page = parseInt(items_per_page)
        const offset = (page - 1) * items_per_page;
        const limit = items_per_page;
        if (search) {
            data = await Passes.findAndCountAll({
                distinct: true,
                offset,
                limit,
                where: {
                    pass_name: { [Op.like]: `%${search}%` }
                    // level: { [Op.like]: `%${search}%` }
                },
                order: [
                    ['id', 'DESC']
                ]
            })
        }
        
        else {
            data = await Passes.findAndCountAll({
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
        return res.status(500).json(err.message)
    }
}
exports.getPassesById=async (req,res)=>{
    try{
       const data=await Passes.findOne({where:{id:req.params.id}})
       if(data){
        return res.status(200).json({
            success:true,
            data
        })
       }
    }catch(err){
        return res.status(500).json({
            success:false
        })
    }
}
exports.updatePassesById=async (req,res)=>{
    try{
        const {pass_name,duration,price_inr,price_usd,pass_type}=req.body
        await Passes.update({pass_name,duration,price_inr,price_usd,pass_type_id:pass_type?.id},{where:{id:req.params.id}})
        return res.status(200).json({
            success:true,
            message:"Passes Updated Successfully"
        })
       
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success:false
        })
    }
}
exports.deletePassesById=async (req,res)=>{
    try{
       await Passes.destroy({where:{id:req.params.id}})
        return res.status(200).json({
            success:true,
            message:"Passes Deleted Successfully"
        })
    }catch(err){
        return res.status(500).json({
            success:false
        })
    }
}

exports.createPassesCategory=async (req,res)=>{
    try{
        const {features}=req.body
        const data=await PassType.create(req.body)

        if(data){
            if(features?.length>0){
                let featuresData=features.flatMap((item)=>[{
                    feature:item?.value,
                    pass_type_id:data?.id
                }])
                await PassTypeFeature.bulkCreate(featuresData)
            }
            return res.status(201).json({
                success:true,
                message:"Pass Created Successfully"
            })
        }else{
            return res.status(200).json({
                success:false,
                message:"Please try again."
            })
        }
    }catch(err){
        return res.status(500).json({
            success:false
        })
    }

}

exports.updatePassesCategory=async (req,res)=>{
    try{
         const {id}=req.params
         const {name,visible,features}=req.body
            await PassType.update({name,visible},{where:{
                id
            }})

            let allPassTypeFeatures=await PassTypeFeature.findAll({
                where:{pass_type_id:id}
            })
            if(allPassTypeFeatures){
                let currIds=features?.map((item)=>item?.id)
                let preIds=allPassTypeFeatures?.map((item)=>item?.id)
                let newTempIds=preIds?.filter((item)=>{
                    return !currIds?.includes(item)
                })
                await PassTypeFeature.destroy({where:{
                     id:newTempIds
                }})
            }


        if(features?.length>0){
            features?.map(async (item)=>{
                if(item?.id){
                    await PassTypeFeature.update({feature:item?.value},{where:{id:item?.id}})
                }else{
                    await PassTypeFeature.create({feature:item?.value,pass_type_id:id})
                }
            })
        }

            return res.status(201).json({
                success:true,
                message:"Pass Updated Successfully"
            })
       
    }catch(err){
        return res.status(500).json({
            success:false
        })
    }

}

exports.getAllPassCategory=async (req,res)=>{
    try {
        let { page, items_per_page, search } = req.query
        let data;
        page = parseInt(page)
        items_per_page = parseInt(items_per_page)
        const offset = (page - 1) * items_per_page;
        const limit = items_per_page;
        if (search) {
            data = await PassType.findAndCountAll({
                distinct: true,
                offset,
                limit,
                where: {
                    name: { [Op.like]: `%${search}%` }
                    // level: { [Op.like]: `%${search}%` }
                },
                order: [
                    ['id', 'DESC']
                ],
                include:[
                    {
                        model:PassTypeFeature,
                        as:"features",
                        required:false
                    }
                ]
            })
        }
        
        else {
            data = await PassType.findAndCountAll({
                distinct: true,
                offset,
                limit,
                order: [
                    ['id', 'DESC']
                ],
                include:[
                    {
                        model:PassTypeFeature,
                        as:"features",
                        required:false
                    }
                ]
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
        return res.status(500).json(err.message)
    }

}

exports.getPassCategoryById=async (req,res)=>{
    try{
       const data=await PassType.findOne({where:{id:req.params.id},include:[
        {
            model: PassTypeFeature,
            required: false,
            as: 'features'
        }
       ]})
       if(data){
        return res.status(200).json({
            success:true,
            data
        })
       }
    }catch(err){
        return res.status(500).json({
            success:false
        })
    }
}

exports.deletePassCategoryById=async (req,res)=>{
    try{
        await PassTypeFeature.destroy({where:{
            pass_type_id:req.params.id
        }})
       await PassType.destroy({where:{id:req.params.id}})
        return res.status(200).json({
            success:true,
            message:"Pass Category Deleted Successfully"
        })
    }catch(err){
        return res.status(500).json({
            success:false
        })
    }
}

exports.getAllPassTypeDetail=async (req,res)=>{
   try{
     const findAllPassType=await PassType.findAll({
        where:{
            visible:1
        },
        attributes:["id","name","visible"]

     })
     return res.status(200).json({
        success:true,
        data:findAllPassType
     })
   }catch(err){
    console.log(err)
    return res.status(500).json({
        success:false
    })
   }
}

exports.findPassesById=async (req,res)=>{
   try{
      const {id}=req.params
      const data=await Passes.findOne({
        where:{
            id
        }
      })
      if(data){
        return res.status(200).json({
            success:true,
            data
        })
      }
   }catch(err){
     return res.status(500).json({
        success:false
     })
   }
}


exports.findAllPasses=async (req,res)=>{
    try{
        const data=await Passes.findAll({
            attributes:["id","pass_name"]
        })
        if(data?.length>0){
           return res.status(200).json({
            success:true,
            data
           })
        }else{
            return res.status(200).json({
                success:false,
                data:[]
               })
        }
    }catch(err){
        return res.status(500).json({
            success:false
        })
    }
}