const { Op } = require("sequelize");
const dbContext = require("../models");
const crypto=require("crypto")
const Packages=dbContext.Packages
const PackageCourses=dbContext.PackageCourses
const SubpackageCourses=dbContext.SubpackageCourses
const PackageSubpackages =dbContext.PackageSubpackages
const SubPackages =dbContext.SubPackages
const BundlePackages=dbContext.BundlePackages
const BundlePackageids =dbContext.BundlePackageids
const SubPackageExams=dbContext.SubPackageExams
const Exams=dbContext.Exams
exports.createUpdateBundle=async (req,res)=>{
    try{
        const {id, thumbnail,premiumType,name,price_inr,price_usd,slug,description,featured,packages_ids}=req.body
        if(id){
            await BundlePackages.update({name,slug,description,price_inr,price_usd,thumbnail,premiumType,featured},{where:{
               id
            }})
            let allBundlePackageIds=await BundlePackageids.findAll({
                where:{
                  bundleid:id
                },
                attributes:["id","packageid","bundleid"]
             })
           
            if(allBundlePackageIds && allBundlePackageIds?.length>0){
                let currIds=allBundlePackageIds?.map((item)=>item?.packageid)
                let newIds=packages_ids
                let deletedIds=currIds?.filter((item)=>!newIds?.includes(item))?.map((item)=>item)
                let createdIds=newIds?.filter((item)=>!currIds?.includes(item))?.map((item)=>item)
                if(deletedIds && deletedIds?.length>0){
                    await BundlePackageids.destroy({where:{bundleid:id,packageid:deletedIds}})
                }

                if(createdIds && createdIds?.length>0){
                    let bundlePackagesIds=createdIds?.flatMap((item)=>[{bundleid:id,packageid:item}])
                    await BundlePackageids.bulkCreate(bundlePackagesIds)
                }
            }
            return res.status(200).json({
                success:true,
                message:"Bundle Updated Successfully"
            })
        }else{
            let key = crypto.randomBytes(128).toString('hex')
            if(key){
            let findKey=await BundlePackages.findOne({where:{hash:key}})
            while(findKey){
                key = crypto.randomBytes(128).toString('hex')
                if(key){
                findKey=await BundlePackages.findOne({where:{hash:key}})
                }
            }
            }
            const data=await BundlePackages.create({name,slug,hash:key,description,price_inr,price_usd,thumbnail,premiumType,featured})
            if(data){
                
                let bundlePackageIds=packages_ids?.flatMap((item)=>[{bundleid:data?.id,packageid:item}])
                if(bundlePackageIds && bundlePackageIds?.length>0){
                    await BundlePackageids.bulkCreate(bundlePackageIds)
                }
                return res.status(200).json({
                    success:true,
                    message:"Bundle Created Successfully"
                }) 
            }else{
                return res.status(500).json({
                    success:false,
                    message:"Bundle Not Created"
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

exports.getBundlePackage = async (req, res) => {
    try {
      let { page, items_per_page, search } = req.query
      let data
      page = parseInt(page)
      items_per_page = parseInt(items_per_page)
      const offset = (page - 1) * items_per_page
      const limit = items_per_page
      if (search) {
        data = await BundlePackages.findAndCountAll({
          distinct: true,
          offset,
          limit,
          where: {
            name: { [Op.like]: `%${search}%` }
            // level: { [Op.like]: `%${search}%` }
          },
          attributes:["id","name","slug","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt"],
          include:[
            {
                model:BundlePackageids,
                required:false,
                as:"bundlepackages",
                attributes:["id","packageid","bundleid"]
            }
          ],
          order: [['id', 'DESC']]
        })
      } else {
        data = await BundlePackages.findAndCountAll({
          distinct: true,
          offset,
          limit,
          attributes:["id","name","slug","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt"],
          include:[
            {
                model:BundlePackageids,
                required:false,
                as:"bundlepackages",
                attributes:["id","packageid","bundleid"]
            }
          ],
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
      console.log(err)
      return res.status(500).json(err)
    }
  }

exports.getBundlesById= async (req, res) => {
    try {
      let { page, items_per_page, search,id } = req.query
      let data
      page = parseInt(page)
      items_per_page = parseInt(items_per_page)
      const offset = (page - 1) * items_per_page
      const limit = items_per_page
      if (search) {
        data = await BundlePackages.findAndCountAll({
          distinct: true,
          offset,
          limit,
          where: {
            name: { [Op.like]: `%${search}%` },
            id
            // level: { [Op.like]: `%${search}%` }
          },
          attributes:["id","name","slug","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt"],
          include:[
            {
                model:BundlePackageids,
                required:false,
                as:"bundlepackages",
                attributes:["id","packageid","bundleid"]
            }
          ],
          order: [['id', 'DESC']]
        })
      } else {
        data = await BundlePackages.findAndCountAll({
           where:{
             id
          },
          attributes:["id","name","slug","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt"],
          include:[
            {
                model:BundlePackageids,
                required:false,
                as:"bundlepackages",
                attributes:["id","packageid","bundleid"]
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
      return res.status(500).json(err)
    }
}

exports.getBundleById=async (req,res)=>{
     try{
        const {id}=req.params
        const data=await BundlePackages.findOne({
            where:{
                id
            },
            attributes:["id","name","slug","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt"],
            include:[
              {
                  model:BundlePackageids,
                  required:false,
                  as:"bundlepackages",
                  attributes:["id","packageid","bundleid"]
              }
            ],
        })
        if(data){
            return res.status(200).json({
                success:true,
                data
            })
        }else{
            return res.status(500).json({
                success:false
            })
        }
     }catch(err){
        console.log(err)
        return res.status(500).json({
            success:false
        })
     }
}

exports.deleteBundleById=async (req,res)=>{
  try{
     await BundlePackageids.destroy({
        where:{
           bundleid:req.params.id
        }
     })

    

     await BundlePackages.destroy({where:{
        id:req.params.id
     }})
     return res.status(200).json({
        success:true,
        message:"Bundle Deleted Successfully"
     })
  }catch(err){
    return res.status(500).json({
        success:false
    })
  }
}


exports.getAllPackages=async (req,res)=>{
    try{
       const data=await Packages.findAll({
        attributes:["id","name"]
       })
       if(data){
        return res.status(200).json({
            success:true,
            data
        })
       }else{
        return res.status(200).json({
            success:false,
            message:"Packages Not Found"
         })
       }
      
    }catch(err){
      return res.status(500).json({
          success:false
      })
    }
  }



  exports.getBundlePackagesUser=async (req,res)=>{
    try {
      let { page, items_per_page, search,startPrice,endPrice,currency} = req.query
      let packageIds=[]
      let data
      page = parseInt(page)
      items_per_page = parseInt(items_per_page)
      const offset = (page - 1) * items_per_page
      const limit = items_per_page
      if (search) {
        data = await BundlePackages.findAndCountAll({
          distinct: true,
          offset,
          limit,
           where:{
            name:search
          },
          include:[
            {
                model:BundlePackageids,
                required:false,
                as:"bundlepackages",
                attributes:["id","packageid","bundleid"]
            }
          ],
          attributes:["id","categoryid","slug","name","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt"],
          order: [['id', 'DESC']]
        })
      }
      else {
        if(startPrice && typeof startPrice!="undefined" && startPrice!="undefined"){
          if(currency=="INR"){
            if(endPrice=="More"){
              data = await BundlePackages.findAndCountAll({
                distinct: true,
                offset,
                limit,
                where:{
                  price_inr:{
                    [Op.gte]: startPrice }
                },
                include:[
                  {
                      model:BundlePackageids,
                      required:false,
                      as:"bundlepackages",
                      attributes:["id","packageid","bundleid"]
                  }
                ],
                attributes:["id","categoryid","slug","name","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt"],
                order: [['id', 'DESC']]
              })
            }else{
              data = await BundlePackages.findAndCountAll({
                distinct: true,
                offset,
                limit,
                where:{
                  price_inr:{
                    [Op.and]: [
                      { [Op.gte]: startPrice }, // Greater than or equal to 100
                      { [Op.lt]: endPrice }   // Less than 200
                    ]
                  }},
                  include:[
                    {
                        model:BundlePackageids,
                        required:false,
                        as:"bundlepackages",
                        attributes:["id","packageid","bundleid"]
                    }
                  ],
                attributes:["id","categoryid","slug","name","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt"],
                order: [['id', 'DESC']]
              })
            }
          }else{
            if(endPrice=="More"){
              data = await BundlePackages.findAndCountAll({
                distinct: true,
                offset,
                limit,
                where:{
                  price_usd:{
                    [Op.gte]: startPrice }
                },
                include:[
                  {
                      model:BundlePackageids,
                      required:false,
                      as:"bundlepackages",
                      attributes:["id","packageid","bundleid"]
                  }
                ],
                attributes:["id","categoryid","slug","name","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt"],
                order: [['id', 'DESC']]
              })
            }else{
              data = await BundlePackages.findAndCountAll({
                distinct: true,
                offset,
                limit,
                where:{
                  price_usd:{
                    [Op.and]: [
                      { [Op.gte]: startPrice }, // Greater than or equal to 100
                      { [Op.lt]: endPrice }   // Less than 200
                    ]
                  }},
                  include:[
                    {
                        model:BundlePackageids,
                        required:false,
                        as:"bundlepackages",
                        attributes:["id","packageid","bundleid"]
                    }
                  ],
                attributes:["id","categoryid","slug","name","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt"],
                order: [['id', 'DESC']]
              })
            }
          }
       }else{
        data = await BundlePackages.findAndCountAll({
          distinct: true,
          offset,
          limit,
          include:[
            {
                model:BundlePackageids,
                required:false,
                as:"bundlepackages",
                attributes:["id","packageid","bundleid"]
            }
          ],
          attributes:["id","categoryid","slug","name","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt"],
          order: [['id', 'DESC']]
        })
       }
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
      console.log(err)
      return res.status(500).json(err.message)
    }
  }


 exports.getBundlePackagesUsingSlugAndKey=async (req,res)=>{
    try{
         const {id,hash,user_id}=req.params
         let bundle=undefined
         let bundlePackages=undefined
         let subPackages=undefined
         let subPackageExam=undefined
         let bundlePackagesIds=await BundlePackageids.findAll({
          where:{
            bundleid:id
          },
          attributes:["id","bundleid","packageid"]
         })
         if(bundlePackagesIds && bundlePackagesIds?.length>0){
            let packageIds=bundlePackagesIds.map((item)=>item?.packageid)
            if(packageIds && packageIds?.length>0){
              bundlePackages=await Packages.findAll({
                where:{
                  id:packageIds
                },
                attributes:["id","slug","name","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt"]
               })

               if(packageIds && packageIds?.length>0){
                const findSubpackageId=await PackageSubpackages.findAll({
                  where:{
                    packageid:packageIds
                  },
                  attributes:["id","packageid","subpackageid"]
                })
                if(findSubpackageId){
                    let subPackagesIds=findSubpackageId?.map((item)=>item?.subpackageid)
                     subPackages=await SubPackages.findAll({
                      where:{
                        id:subPackagesIds
                      },
                      include:[
                        {
                          model:PackageSubpackages,
                          as:"subpackages",
                          required:false,
                          attributes:["id","subpackageid","packageid"]
                        }
                      ],
                      attributes:["id","name","description"]
                     })
                }
                if(findSubpackageId){
                  let subPackagesIds=findSubpackageId?.map((item)=>item?.subpackageid)
                  let examIds=await SubPackageExams.findAll({
                    where:{
                      subpackageid:subPackagesIds
                    }
                  })
                  if(examIds){
                    let examIdsDetail=examIds?.map((item)=>item?.examid)
                    subPackageExam=await Exams.findAll({
                      where:{
                        id:examIdsDetail,
                        draft:0
                      },
                      attributes:["id","key","name","exam_duration","total_questions","total_marks","createdAt"],
                      include:[
                        {
                          model:SubPackageExams,
                          as:"exams",
                          required:false,
                          attributes:["id","subpackageid","examid","type"]
                        }
                      ]
                    })
                  }
                }
               }
            }
         }
         bundle=await BundlePackages.findOne({
          where:{
            id
          },
          attributes:["id","slug","name","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt"],
         })         
         if(bundle && bundlePackages && subPackages && subPackageExam){
           return res.status(200).json({
             success:true,
             bundle,
             bundlePackages,
             subPackages,
             subPackageExam
           })
         }else{
           return res.status(204).json({
             success:false
           })
         }
    }catch(err){
          console.log(err)
          return res.status(500).json({
           success:false
          })
    }
 }