const { Op } = require("sequelize");
const dbContext = require("../models");
const crypto=require("crypto")
const Packages=dbContext.Packages
const PackageCourses=dbContext.PackageCourses
const SubpackageCourses=dbContext.SubpackageCourses
const PackageSubpackages =dbContext.PackageSubpackages
const SubPackages =dbContext.SubPackages
const BundlePackageids =dbContext.BundlePackageids
const PackageCart=dbContext.PackageCart
const PackageWishlist=dbContext.PackageWishlist
const SubPackageExams =dbContext.SubPackageExams
const ExamSections = dbContext.ExamSections
const ExamSectionQuestions = dbContext.ExamSectionQuestions
const ExamResults = dbContext.ExamResults
const ExamResultAnalysis = dbContext.ExamResultAnalysis
const ExamSectionResultAnalysis = dbContext.ExamSectionResultAnalysis
const Exams=dbContext.Exams
const axios=require("axios");
const { QUESTION_URL } = require("../services");
exports.createUpdatepackage=async (req,res)=>{
    try{
        const {id, thumbnail,premiumType,name,price_inr,price_usd,slug,description,coursesIds,featured,sub_packages_ids,total_test,live,reg_start_date,reg_end_date,result_publish_date,start_date,end_date}=req.body
        if(id){
            await Packages.update({name,slug,description,price_inr,price_usd,thumbnail,premiumType,featured,total_test,live,reg_start_date,reg_end_date,result_publish_date,start_date,end_date},{where:{
               id
            }})

            let allCoursesIds=await PackageCourses.findAll({
            where:{
                packageid:id
            },
            attributes:["id","packageid","courseid"]
            })
            let allPackageSUbPackageIds=await PackageSubpackages.findAll({
                where:{
                    packageid:id
                },
                attributes:["id","packageid","subpackageid"]
             })
            if(allCoursesIds && allCoursesIds?.length>0){
                let currIds=allCoursesIds?.map((item)=>item?.courseid)
                let newIds=coursesIds
                let deletedIds=currIds?.filter((item)=>!newIds?.includes(item))?.map((item)=>item)
                let createdIds=newIds?.filter((item)=>!currIds?.includes(item))?.map((item)=>item)
                if(deletedIds && deletedIds?.length>0){
                    await PackageCourses.destroy({where:{packageid:id,courseid:deletedIds}})
                }

                if(createdIds && createdIds?.length>0){
                    let packageCourseIds=createdIds?.flatMap((item)=>[{packageid:id,courseid:item}])
                    await PackageCourses.bulkCreate(packageCourseIds)
                }
            }
            if(allPackageSUbPackageIds && allPackageSUbPackageIds?.length>0){
                let currIds=allPackageSUbPackageIds?.map((item)=>item?.subpackageid)
                let newIds=sub_packages_ids
                let deletedIds=currIds?.filter((item)=>!newIds?.includes(item))?.map((item)=>item)
                let createdIds=newIds?.filter((item)=>!currIds?.includes(item))?.map((item)=>item)
                if(deletedIds && deletedIds?.length>0){
                    await PackageSubpackages.destroy({where:{packageid:id,subpackageid:deletedIds}})
                }

                if(createdIds && createdIds?.length>0){
                    let packageSubPackagesIds=createdIds?.flatMap((item)=>[{packageid:id,subpackageid:item}])
                    await PackageSubpackages.bulkCreate(packageSubPackagesIds)
                }
            }
            return res.status(200).json({
                success:true,
                message:"Package Updated Successfully"
            })
        }else{
            let key = crypto.randomBytes(128).toString('hex')
            if(key){
            let findKey=await Packages.findOne({where:{hash:key}})
            while(findKey){
                key = crypto.randomBytes(128).toString('hex')
                if(key){
                findKey=await Packages.findOne({where:{hash:key}})
                }
            }
            }
            const data=await Packages.create({name,slug,hash:key,description,price_inr,price_usd,thumbnail,premiumType,featured,total_test,live,reg_start_date,reg_end_date,result_publish_date,start_date,end_date})
            if(data){
                let packageCourseIds=coursesIds?.flatMap((item)=>[{packageid:data?.id,courseid:item}])
                if(packageCourseIds && packageCourseIds?.length>0){
                    await PackageCourses.bulkCreate(packageCourseIds)
                }
                let packageSubPackageIds=sub_packages_ids?.flatMap((item)=>[{packageid:data?.id,subpackageid:item}])
                if(packageSubPackageIds && packageSubPackageIds?.length>0){
                    await PackageSubpackages.bulkCreate(packageSubPackageIds)
                }
                return res.status(200).json({
                    success:true,
                    message:"Package Created Successfully"
                }) 
            }else{
                return res.status(500).json({
                    success:false,
                    message:"Package Not Created"
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

exports.getPackages = async (req, res) => {
    try {
      let { page, items_per_page, search } = req.query
      let data
      page = parseInt(page)
      items_per_page = parseInt(items_per_page)
      const offset = (page - 1) * items_per_page
      const limit = items_per_page
      if (search) {
        data = await Packages.findAndCountAll({
          distinct: true,
          offset,
          limit,
          where: {
            name: { [Op.like]: `%${search}%` }
            // level: { [Op.like]: `%${search}%` }
          },
          attributes:["id","name","slug","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt","total_test","live","reg_start_date","reg_end_date","result_publish_date","start_date","end_date"],
          include:[
            {
                model:PackageCourses,
                required:false,
                as:"packagecourses",
                attributes:["id","packageid","courseid"]
            }
          ],
          order: [['id', 'DESC']]
        })
      } else {
        data = await Packages.findAndCountAll({
          distinct: true,
          offset,
          limit,
          attributes:["id","name","slug","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt","total_test","live","reg_start_date","reg_end_date","result_publish_date","start_date","end_date"],
          include:[
            {
                model:PackageCourses,
                required:false,
                as:"packagecourses",
                attributes:["id","packageid","courseid"]
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

exports.getPackagesById= async (req, res) => {
    try {
      let { page, items_per_page, search,id } = req.query
      let data
      page = parseInt(page)
      items_per_page = parseInt(items_per_page)
      const offset = (page - 1) * items_per_page
      const limit = items_per_page
      if (search) {
        data = await Packages.findAndCountAll({
          distinct: true,
          offset,
          limit,
          where: {
            name: { [Op.like]: `%${search}%` },
            id
            // level: { [Op.like]: `%${search}%` }
          },
          attributes:["id","name","slug","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt","total_test","live","reg_start_date","reg_end_date","result_publish_date","start_date","end_date"],
          include:[
            {
                model:PackageCourses,
                required:false,
                as:"packagecourses",
                attributes:["id","packageid","courseid"]
            }
          ],
          order: [['id', 'DESC']]
        })
      } else {
        data = await Packages.findAndCountAll({
           where:{
             id
          },
          attributes:["id","name","slug","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt","total_test","live","reg_start_date","reg_end_date","result_publish_date","start_date","end_date"],
          include:[
            {
                model:PackageCourses,
                required:false,
                as:"packagecourses",
                attributes:["id","packageid","courseid"]
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

exports.getPackageById=async (req,res)=>{
     try{
        const {id}=req.params
        const data=await Packages.findOne({
            where:{
                id
            },
            attributes:["id","name","slug","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt","total_test","live","reg_start_date","reg_end_date","result_publish_date","start_date","end_date"],
            include:[
              {
                  model:PackageCourses,
                  required:false,
                  as:"packagecourses",
                  attributes:["id","packageid","courseid"]
              },
              {
                model:PackageSubpackages,
                required:false,
                as:"subpackages",
                attributes:["id","packageid","subpackageid"]
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
        return res.status(500).json({
            success:false
        })
     }
}

exports.deletePackageById=async (req,res)=>{
  try{
     await PackageSubpackages.destroy({
        where:{
           packageid:req.params.id
        }
     })
     await BundlePackageids.destroy({
      where:{
        packageid:req.params.id
      }
     })

     await PackageCourses.destroy({
        where:{
            packageid:req.params.id
        }
     })

     await Packages.destroy({where:{
        id:req.params.id
     }})
     return res.status(200).json({
        success:true,
        message:"Packages Deleted Successfully"
     })
  }catch(err){
    return res.status(500).json({
        success:false
    })
  }
}


exports.getAllSubPackages=async (req,res)=>{
    try{
       const data=await SubPackages.findAll({
        attributes:["id","name","description"],
        include:[
            {
                model:SubpackageCourses,
                required:false,
                as:"subpackagecourses",
                attributes:["id","subpackageid","courseid"]
            }
        ]
       })
       if(data){
        return res.status(200).json({
            success:true,
            data
        })
       }else{
        return res.status(200).json({
            success:false,
            message:"SubPackages Not Found"
         })
       }
      
    }catch(err){
      return res.status(500).json({
          success:false
      })
    }
  }


//user panel router
  exports.getPackagesUser=async (req,res)=>{
    try {
      let { page, items_per_page,category} = req.query
      let subpackageIds=[]
      let data
      page = parseInt(page)
      items_per_page = parseInt(items_per_page)
      const offset = (page - 1) * items_per_page
      const limit = items_per_page
      
      if(category && category!="undefined"){
        let packagesId=await PackageCourses.findAll({
          where:{
            courseid:category
          },
          order:[["id","DESC"]],
          attributes:["id","packageid"]
        })
       let packageIds=packagesId?.map((item)=>item?.packageid)
        data = await Packages.findAndCountAll({
          distinct: true,
          offset,
          limit,
            where:{
              id:packageIds,
              live:0
            },
            include:[
              {
                model:PackageSubpackages,
                required:false,
                as:"subpackages",
                attributes:["id",'packageid',"subpackageid"]
            }
            ],
          attributes:["id","categoryid","slug","name","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt","total_test","live","reg_start_date","reg_end_date","result_publish_date","start_date","end_date"],
          order: [['id', 'DESC']]
        })
      }
      else {
        data = await Packages.findAndCountAll({
          where:{
            live:0
          },
          distinct: true,
          offset,
          limit,
          include:[
            {
              model:PackageSubpackages,
              required:false,
              as:"subpackages",
              attributes:["id",'packageid',"subpackageid"]
          }
          ],
          attributes:["id","categoryid","slug","name","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt","total_test","live","reg_start_date","reg_end_date","result_publish_date","start_date","end_date"],
          order: [['id', 'DESC']]
        })
      }


      let subpackagesExam=[]
      let examids=[]
      let exams=[]


      if(data){
        subpackageIds=data?.rows?.map((item)=>item?.subpackages?.map((item2)=>item2?.subpackageid))?.flat()
        if(subpackageIds){
          subpackagesExam=await SubPackages.findAll({
            where:{
              id:subpackageIds
            },
            attributes:["id"],
            include:[
              {
                model:SubPackageExams,
                required:false,
                as:"exams",
                attributes:["id","subpackageid","examid","type"]
              }
            ],
          })
          if(subpackagesExam){
            examids=await subpackagesExam?.map((item)=>item?.exams?.map((item2)=>item2?.examid))?.flat()
            if(examids){
              exams=await Exams.findAll({
                where:{
                  id:examids
                },
                include:[
                  {
                    model:dbContext.ExamTypes,
                    required:false
                  },
                  {
                    model:ExamSections,
                    as :"examsections",
                    order:[["id","ASC"]],
                    separate:true,
                    attributes:["section_name"]
                  }
                ]
              })
            }
          }
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
        data: {
          packages:data.rows,
          subpackagesExam,
          exams},
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

  exports.getPackagesUsingSlugAndKey=async (req,res)=>{
     try{

          const {id,hash,user_id}=req.params
          let packages=undefined
          let subPackages=undefined
          let subPackageExam=undefined
          
          const findSubpackageId=await PackageSubpackages.findAll({
            where:{
              packageid:id
            },
            order:[["id","ASC"]],
            attributes:["id","packageid","subpackageid"]
          })
          if(findSubpackageId){
              let subPackagesIds=findSubpackageId?.map((item)=>item?.subpackageid)
               subPackages=await SubPackages.findAll({
                where:{
                  id:subPackagesIds
                },
                order:[["id","ASC"]],
                attributes:["id","name","description"]
               })
          }
          if(findSubpackageId){
            let subPackagesIds=findSubpackageId?.map((item)=>item?.subpackageid)
            let examIds=await SubPackageExams.findAll({
              where:{
                subpackageid:subPackagesIds
              },
              order:[["id","ASC"]],
            })
            if(examIds){
              let examIdsDetail=examIds?.map((item)=>item?.dataValues?.examid)
              if(examIdsDetail?.length>0){
                subPackageExam=await Exams.findAll({
                  where:{
                    id:examIdsDetail,
                    draft:0
                  },
                  order:[["id","ASC"]],
                  attributes:["id","key","name","exam_duration","total_questions","total_marks","createdAt","reg_start_date"],
                  include:[
                    {
                      model:ExamSections,
                      as :"examsections",
                      order:[["id","ASC"]],
                      separate:true,
                      attributes:["section_name"]
                    },
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
          packages=await Packages.findOne({
            where:{
              id,
              hash
            },
            attributes:["id","slug","name","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt","total_test","live","reg_start_date","reg_end_date","result_publish_date","start_date","end_date"]
          })
          
          if(packages && subPackages){
            return res.status(200).json({
              success:true,
              packages,
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

  exports.addPackageToCart=async (req,res)=>{
     try{
        const {user_id,package_id}=req.body
        const data=await PackageCart.findOne({
          where:{
            package_id,user_id
          }
        }) 
        if(data){
          await PackageCart.destroy({
            where:{
              user_id,package_id
            }
          })
          return res.status(200).json({
            success:true,
            message:"Remove From Cart Successfully"
          })
        }else{
          await PackageCart.create({user_id,package_id})
          return res.status(200).json({
            success:true,
            message:"Package Added to Cart Successfully"
          })
        }
     }catch(err){
      return res.status(500).json({
        success:false
      })
     }
  }

  exports.addPackageToWishlist=async (req,res)=>{
    try{
       const {user_id,package_id}=req.body
       const data=await PackageWishlist.findOne({
         where:{
           package_id,user_id
         }
       }) 
       if(data){
         await PackageWishlist.destroy({
           where:{
             user_id,package_id
           }
         })
         return res.status(200).json({
           success:true,
           message:"Remove From Wishlist Successfully"
         })
       }else{
         await PackageWishlist.create({user_id,package_id})
         return res.status(200).json({
           success:true,
           message:"Package Added to Wishlist Successfully"
         })
       }
    }catch(err){
     return res.status(500).json({
       success:false
     })
    }
 }


exports.getWishListPackagesUser=async (req,res)=>{
  try {
    let { page, items_per_page, search,category,startPrice,endPrice,currency,user_id} = req.query
    let packageIds=[]
    let packageIds2=[]
    let findWishListData=undefined

    if(user_id){
        findWishListData=await PackageWishlist.findAll({
        where:{
            user_id
        },
          order: [['id', 'DESC']]
       })
       packageIds2=findWishListData?.map((item)=>item?.package_id)
      //  let packagesId=
    }
    if(packageIds2){
         if(category && category!="undefined"&& typeof category!="undefined"){
          let packagesId=await PackageCourses.findAll({
            where:{
              courseid:category,
              packageid:packageIds2
            },
            order:[["id","DESC"]],
            attributes:["id","packageid"]
          })
         packageIds=packagesId?.map((item)=>item?.packageid)
         }else{
          let packagesId=await PackageCourses.findAll({
            where:{
              packageid:packageIds2
            },
            order:[["id","DESC"]],
            attributes:["id","packageid"]
          })
         packageIds=packagesId?.map((item)=>item?.packageid)
         }
    }
    let data
    page = parseInt(page)
    items_per_page = parseInt(items_per_page)
    const offset = (page - 1) * items_per_page
    const limit = items_per_page
    if (search) {
      data = await Packages.findAndCountAll({
        distinct: true,
        offset,
        limit,
         where:{
          name:search,
          id:packageIds
        },
        attributes:["id","categoryid","slug","name","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt"],
        order: [['id', 'DESC']]
      })
    } 
    else if(category && category!="undefined"){
       if(startPrice && endPrice && typeof startPrice!="undefined" && startPrice!="undefined"){
          if(currency=="INR"){
                if(endPrice=="More"){
                  data = await Packages.findAndCountAll({
                    distinct: true,
                    offset,
                    limit,
                    where:{
                      id:packageIds,
                      price_inr:{
                        [Op.gte]: startPrice }
                      },
                    attributes:["id","categoryid","slug","name","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt"],
                    order: [['id', 'DESC']]
                  })
                }else{
                  data = await Packages.findAndCountAll({
                    distinct: true,
                    offset,
                    limit,
                    where:{
                      id:packageIds,
                      price_inr:{
                        [Op.and]: [
                          { [Op.gte]: startPrice }, // Greater than or equal to 100
                          { [Op.lt]: endPrice }   // Less than 200
                        ]
                      }},
                    attributes:["id","categoryid","slug","name","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt"],
                    order: [['id', 'DESC']]
                  })
                }
          }else{
            if(endPrice=="More"){
              data = await Packages.findAndCountAll({
                distinct: true,
                offset,
                limit,
                where:{
                  id:packageIds,
                  price_usd:{
                     [Op.gte]: startPrice } // Greater than or equal to 100
                  },
                attributes:["id","categoryid","slug","name","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt"],
                order: [['id', 'DESC']]
              })
            }else{
              data = await Packages.findAndCountAll({
                distinct: true,
                offset,
                limit,
                where:{
                  id:packageIds,
                  price_usd:{
                    [Op.and]: [
                      { [Op.gte]: startPrice }, // Greater than or equal to 100
                      { [Op.lt]: endPrice }   // Less than 200
                    ]
                  }},
                attributes:["id","categoryid","slug","name","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt"],
                order: [['id', 'DESC']]
              })
            }
          }
       }else{
        data = await Packages.findAndCountAll({
          distinct: true,
          offset,
          limit,
          where:{
            id:packageIds
          },
          attributes:["id","categoryid","slug","name","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt"],
          order: [['id', 'DESC']]
        })
       }
    }
    else {
      if(startPrice && typeof startPrice!="undefined" && startPrice!="undefined" && packageIds){
        if(currency=="INR"){
          if(endPrice=="More"){
            data = await Packages.findAndCountAll({
              distinct: true,
              offset,
              limit,
              where:{
                price_inr:{
                  [Op.gte]: startPrice },
                  id:packageIds
              },
              attributes:["id","categoryid","slug","name","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt"],
              order: [['id', 'DESC']]
            })
          }else{
            data = await Packages.findAndCountAll({
              distinct: true,
              offset,
              limit,
              where:{
                price_inr:{
                  [Op.and]: [
                    { [Op.gte]: startPrice }, // Greater than or equal to 100
                    { [Op.lt]: endPrice }   // Less than 200
                  ]
                },          
                id:packageIds
              },
              attributes:["id","categoryid","slug","name","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt"],
              order: [['id', 'DESC']]
            })
          }
        }else{
          if(endPrice=="More"){
            data = await Packages.findAndCountAll({
              distinct: true,
              offset,
              limit,
              where:{
                price_usd:{
                  [Op.gte]: startPrice },
                  id:packageIds

              },
              attributes:["id","categoryid","slug","name","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt"],
              order: [['id', 'DESC']]
            })
          }else{
            data = await Packages.findAndCountAll({
              distinct: true,
              offset,
              limit,
              where:{
                price_usd:{
                  [Op.and]: [
                    { [Op.gte]: startPrice }, // Greater than or equal to 100
                    { [Op.lt]: endPrice }   // Less than 200
                  ]
                },
                id:packageIds
              },
              attributes:["id","categoryid","slug","name","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt"],
              order: [['id', 'DESC']]
            })
          }
        }
     }else{
      data = await Packages.findAndCountAll({
        distinct: true,
        where:{
          id:packageIds
        },
        offset,
        limit,
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

exports.getCartListPackagesUser=async (req,res)=>{
  try {
    let { user_id} = req.query
    let packageIds=[]

    if(user_id){
        findWishListData=await PackageCart.findAll({
        where:{
            user_id
        },
          order: [['id', 'DESC']]
       })
       packageIds=findWishListData?.map((item)=>item?.package_id)
    }
    let data
    if(packageIds){
      data = await Packages.findAndCountAll({
        where:{
            id:packageIds
        },
        attributes:["id","categoryid","slug","name","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt"],
        order: [['id', 'DESC']]
      })
    }
    return res.status(200).json({
      data: data.rows,
      payload: {
        pagination: {
          total: data.count
        }
      }
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json(err.message)
  }
}




exports.getPackagesHomePage = async (req, res) => {
  try {
     const data=await Packages.findAll({
       limit:8,
       offset:0,
       order:[["id","DESC"]],
       attributes:["id","name","description","price_inr","thumbnail"]
     })
     if(data && data?.length>0){
       return res.status(200).json({
        success:true,
        data
       })
     }else{
        return res.status(200).json({
          success:false
        })
     }
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
}




exports.getReportSectionWIse = async (req, res) => {
  try {
    const { bundleid, packageid, subpackageid, examid, userid,sectionid } = req.body
    const findExam = await Exams.findOne({
      where: { id: examid },
      include: [
        {
          model: ExamSections,
          as: "examsections",
          where:{
             id:sectionid
          },
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
      const findCurrentResult = await ExamResultAnalysis.findOne({
        where: {
          bundleid, packageid, subpackageid, examid,userid
        },
        limit:1,
        order:[["id","DESC"]],
        offset:0,
        include: [
          {
            model: ExamResults,
            as: "examresults",
            required: true,
            where:{
              examsectionid:sectionid
            }
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
          let questionDetails = data?.data;
        
          let finalArray = [];
        
          await Promise.all(
            sectionid.map(async (section_id) => {
        
              let findResult = findCurrentResult?.examresults?.filter(
                (item) => section_id == item?.examsectionid
              );

        
              let totalQuestion = findExam?.examsections
                ?.find((item2) => item2?.id == section_id)
                ?.questions?.map((item) => item?.question_bank_id);
        
              if (findResult?.length > 0) {

                let total_points = 0;
                let total_questions =
                  totalQuestion?.length > 0 ? totalQuestion?.length : 0;
                let total_correct = 0;
                let total_incorrect = 0;
        
                for (const item2 of findResult) {
                  const findQuesBank = questionDetails?.find(
                    (qb) => qb?.id == item2?.question_bank_id
                  );
                  const findQues = findQuesBank?.questions?.find(
                    (qu) => qu?.id == item2?.question_id
                  );
                  const findOps = findQues?.options?.find(
                    (op) =>
                      op?.id == item2?.user_ans_option_id && op?.right_option == 1
                  );
        
                  if (!findOps || findOps == undefined) {
                    total_incorrect += 1;
                    total_points -= Number(findQuesBank?.marks?.negative_marks);
                  } else {
                    total_correct += 1;
                    total_points += Number(findQuesBank?.marks?.marks);
                  }
                }
        
                // ✅ Use await to make sure findTime completes before proceeding
                const findTime = await ExamSectionResultAnalysis.findOne({
                  where: {
                    resultanalysisid: findCurrentResult?.id,
                    userid,
                    examsectionid: section_id,
                  },
                  attributes: ["time_taken", "id", "examsectionid"],
                });
        
                let payload = {
                  user_id: userid,
                  section_id:section_id,
                  total_correct,
                  total_incorrect,
                  total_points,
                  total_questions,
                  correct_percentage: (
                    (total_correct / total_questions) *
                    100
                  )?.toFixed(2),
                  incorrect_percentage: (
                    (total_incorrect / total_questions) *
                    100
                  )?.toFixed(2),
                  not_attempted: total_questions - (total_correct + total_incorrect),
                  not_attempted_percentage: (
                    ((total_questions - (total_correct + total_incorrect)) /
                      total_questions) *
                    100
                  )?.toFixed(2),
                  total_time_taken: findTime?.time_taken,
                };        
                finalArray.push(payload);
              }
            })
          );
        
          // ✅ Send response after loop finishes
          if (finalArray?.length > 0) {
            return res.status(200).json({
              success: true,
              data:finalArray?.filter((item)=>item?.section_id),
            });
          } else {
            return res.status(200).json({
              success: false,
              data:finalArray?.filter((item)=>item?.section_id),
            });
          }
        } else {
          return res.status(200).json({
            success: false,
            message: "Unauthorized Access",
          });
        }
        
      }
    }
    
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false
    })
  }
}


exports.getSolutionSection=async (req,res)=>{
  try{
     const {bundleid,packageid,subpackageid,examid,userid,sectionid,offset}=req.body
     const findCurrentResult = await ExamResultAnalysis.findOne({
      where: {
        bundleid, packageid, subpackageid, examid,userid
      },
      limit:1,
      order:[["id","DESC"]],
      offset,
      include: [
        {
          model: ExamResults,
          as: "examresults",
          required: true,
          where:{
            examsectionid:sectionid
          }
        }
      ],
      attributes: ["id", "userid", "bundleid", "packageid", "subpackageid", "examid", "exam_status", "createdAt"]
    })

    const findAllAttempt = await ExamResultAnalysis.findAll({
      where: {
        userid, bundleid, packageid, subpackageid, examid, exam_status: "completed"
      },
      order: [["id", "ASC"]],
      attributes: ["id"]
    })


    if(findCurrentResult){
      return res.status(200).json({
        success:true,
        data:findCurrentResult,
        allAttempt:findAllAttempt?.length
      })
    }else{
      return res.status(200).json({
        success:false,
        data:[]
      })
    }
  }catch(err){

  }
}



exports.getLivePackagesUser=async (req,res)=>{
  try {
    let {category} = req.query
    let subpackageIds=[]
    let data
    if(category=="Live"){
      data = await Packages.findAll({
          where:{
            live:1,
            start_date: { [Op.lte]: new Date() },  
            end_date:   { [Op.gt]:  new Date() }, 
          },
          include:[
            {
              model:PackageSubpackages,
              required:false,
              as:"subpackages",
              attributes:["id",'packageid',"subpackageid"]
          }
          ],
        attributes:["id","categoryid","slug","name","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt","total_test","live","reg_start_date","reg_end_date","result_publish_date","start_date","end_date"],
        order: [['id', 'DESC']]
      })
    }
    else {
      data = await Packages.findAll({
        where:{
          live:1,
          start_date: { [Op.gt]: new Date() }  
        },
        include:[
          {
            model:PackageSubpackages,
            required:false,
            as:"subpackages",
            attributes:["id",'packageid',"subpackageid"]
        }
        ],
      attributes:["id","categoryid","slug","name","description","price_inr","price_usd","thumbnail","premiumType","hash","type","featured","createdAt","total_test","live","reg_start_date","reg_end_date","result_publish_date","start_date","end_date"],
      order: [['id', 'DESC']]
    })
    }


    let subpackagesExam=[]
    let examids=[]
    let exams=[]
    if(data?.length>0){
      subpackageIds=data?.map((item)=>item?.subpackages?.map((item2)=>item2?.subpackageid))?.flat()
      if(subpackageIds?.length>0){
        subpackagesExam=await SubPackages.findAll({
          where:{
            id:subpackageIds
          },
          attributes:["id"],
          include:[
            {
              model:SubPackageExams,
              required:false,
              as:"exams",
              attributes:["id","subpackageid","examid","type"]
            }
          ],
        })
        if(subpackagesExam?.length>0){
          examids=await subpackagesExam?.map((item)=>item?.exams?.map((item2)=>item2?.examid))?.flat()
          if(examids?.length>0){
            exams=await Exams.findAll({
              where:{
                id:examids
              },
              include:[
                {
                  model:dbContext.ExamTypes,
                  required:false
                },
                {
                  model:ExamSections,
                  as :"examsections",
                  order:[["id","ASC"]],
                  separate:true,
                  attributes:["section_name"]
                }
              ]
            })

            if(exams?.length>0){
              return res.status(200).json({
                success:true,
                data: {
                  packages:data,
                  subpackagesExam,
                  exams}
              })
            }else{
              return res.status(200).json({
                success:false
              })
            }
          }else{
            return res.status(200).json({
              success:false
            })
          }
        }else{
          return res.status(200).json({
            success:false
          })
        }
      }else{
        return res.status(200).json({
          success:false,
          data:[]
        })
      }
    }else{
      return res.status(200).json({
        success:false,
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json(err.message)
  }
}




exports.generateLeaderBoardForExamResultUsingBundleIdPackageId = async (req, res) => {
  try {
    const {packageid} = req.body
    let subpackageid=undefined
    let examid=undefined
    let bundleid=null
      let data = await Packages.findOne({
          where:{
            live:1,
            id:packageid 
          },
          include:[
            {
              model:PackageSubpackages,
              required:false,
              as:"subpackages",
              attributes:["id",'packageid',"subpackageid"]
          }
          ],
        attributes:["id"],
        order: [['id', 'DESC']]
      })

      if(data){
        subpackageid=data?.subpackages[0].subpackageid

        let subpackagesExam=await SubPackages.findOne({
          where:{
            id:subpackageid
          },
          attributes:["id"],
          include:[
            {
              model:SubPackageExams,
              required:false,
              as:"exams",
              attributes:["id","subpackageid","examid","type"]
            }
          ],
        })
        examid=await subpackagesExam?.exams[0]?.examid
      }
      
      if(packageid && subpackageid && examid){
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
                        data: sortedResults?.map((result, index) => ({
                          rank: index + 1,
                          user_id: result?.user_id,
                          total_time_taken: result?.total_time_taken,
                          total_points: result?.total_points,
                          total_marks:findExam?.total_marks
                          // ✅ Include extra fields ONLY for the topper and current user
                          // ...(index === 0 || result.user_id === userid
                          //   ? {
                          //     total_section: result.total_section,
                          //     section_time_taken: result.section_time_taken,
                          //     exam: result.exam,
                          //     correct_section_id: result.correct_section_id,
                          //     incorrect_section_id: result.incorrect_section_id,
                          //     total_questions: result.total_questions,
                          //     correct_percentage: result.correct_percentage,
                          //     incorrect_percentage: result.incorrect_percentage,
                          //     not_attempted: result.not_attempted,
                          //     not_attempted_percentage: result.not_attempted_percentage,
                          //     attempted_on: result.attempted_on,
                          //     total_correct: result.total_correct,
                          //     total_incorrect: result.total_incorrect,
                          //     section_wise_points: result.section_wise_points
                          //   }
                          //   : {}),
                        }))
                      });
        
                    } else {
                      return res.status(200).json({
                        success: false,
                        message: "Result not declared",
                      })
        
                    }
                  }
        
                }
              }
            }
      }

  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false
    })
  }
}
