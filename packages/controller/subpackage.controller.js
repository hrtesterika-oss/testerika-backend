const { Op } = require("sequelize");
const dbContext = require("../models");
const SubPackages=dbContext.SubPackages
const SubpackageCourses=dbContext.SubpackageCourses
const PackageSubpackages =dbContext.PackageSubpackages
const SubPackageExams=dbContext.SubPackageExams
exports.createUpdateSubpackage=async (req,res)=>{
   try{
     const {id,coursesIds}=req.body
     if(id){
        await SubPackages.update(req?.body,{where:{
           id
        }})

        let allCoursesIds=await  SubpackageCourses.findAll({
           where:{
            subpackageid:id
           },
           attributes:["id","subpackageid","courseid"]
        })
        if(allCoursesIds && allCoursesIds?.length>0){
            let currIds=allCoursesIds?.map((item)=>item?.courseid)
            let newIds=coursesIds
            let deletedIds=currIds?.filter((item)=>!newIds?.includes(item))?.map((item)=>item)
            let createdIds=newIds?.filter((item)=>!currIds?.includes(item))?.map((item)=>item)
            if(deletedIds && deletedIds?.length>0){
                await SubpackageCourses.destroy({where:{subpackageid:id,courseid:deletedIds}})
            }

            if(createdIds && createdIds?.length>0){
                let subPackageCourseIds=createdIds?.flatMap((item)=>[{subpackageid:id,courseid:item}])
                await SubpackageCourses.bulkCreate(subPackageCourseIds)
            }
        }
        return res.status(200).json({
            success:true,
            message:"Sub-Package Updated Successfully"
        })
     }else{
        const data=await SubPackages.create(req?.body)
        if(data){
            let subPackageCourseIds=coursesIds?.flatMap((item)=>[{subpackageid:data?.id,courseid:item}])
            if(subPackageCourseIds && subPackageCourseIds?.length>0){
                 await SubpackageCourses.bulkCreate(subPackageCourseIds)
            }
            return res.status(200).json({
                success:true,
                message:"Sub-Package Created Successfully"
            }) 
        }else{
            return res.status(500).json({
                success:false,
                message:"Sub-Package Not Created"
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

exports.getSubpackages = async (req, res) => {
    try {
      let { page, items_per_page, search } = req.query
      let data
      page = parseInt(page)
      items_per_page = parseInt(items_per_page)
      const offset = (page - 1) * items_per_page
      const limit = items_per_page
      if (search) {
        data = await SubPackages.findAndCountAll({
          distinct: true,
          offset,
          limit,
          where: {
            name: { [Op.like]: `%${search}%` }
            // level: { [Op.like]: `%${search}%` }
          },
          attributes:["id","name","description"],
          include:[
            {
                model:SubpackageCourses,
                required:false,
                as:"subpackagecourses",
                attributes:["id","subpackageid","courseid"]
            }
          ],
          order: [['id', 'DESC']]
        })
      } else {
        data = await SubPackages.findAndCountAll({
          distinct: true,
          offset,
          limit,
          attributes:["id","name","description"],
          include:[
            {
                model:SubpackageCourses,
                required:false,
                as:"subpackagecourses",
                attributes:["id","subpackageid","courseid"]
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

exports.getSubpackagesById= async (req, res) => {
    try {
            let { page, items_per_page, search} = req.query
      let {id}=req.params
      let data
      page = parseInt(page)
      items_per_page = parseInt(items_per_page)
      const offset = (page - 1) * items_per_page
      const limit = items_per_page
      if (search) {
        data = await SubPackages.findAndCountAll({
          distinct: true,
          offset,
          limit,
          where: {
            name: { [Op.like]: `%${search}%` },
            id
            // level: { [Op.like]: `%${search}%` }
          },
          attributes:["id","name","description"],
          include:[
            {
                model:SubpackageCourses,
                required:false,
                as:"subpackagecourses",
                attributes:["id","subpackageid","courseid"]
            }
          ],
          order: [['id', 'DESC']]
        })
      } else {
        data = await SubPackages.findAndCountAll({
           where:{
             id
          },
          attributes:["id","name","description"],
          include:[
            {
                model:SubpackageCourses,
                required:false,
                as:"subpackagecourses",
                attributes:["id","subpackageid","courseid"]
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

exports.getSubpackageById=async (req,res)=>{
     try{
        const {id}=req.params
        const data=await SubPackages.findOne({
            where:{
                id
            },
            attributes:["id","name","description"],
            include:[
                {
                    model:SubpackageCourses,
                    as:"subpackagecourses",
                    required:false
                }
            ]
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

exports.deleteSubPackageById=async (req,res)=>{
  try{
     await SubpackageCourses.destroy({
        where:{
           subpackageid:req.params.id
        }
     })

     await PackageSubpackages.destroy({
        where:{
            subpackageid:req.params.id
        }
     })
     await SubPackageExams.destroy({
      where:{
         subpackageid:req.params.id
      }
   }) 

     await SubPackages.destroy({where:{
        id:req.params.id
     }})
     return res.status(200).json({
        success:true,
        message:"SubPackage Deleted Successfully"
     })
  }catch(err){
    return res.status(500).json({
        success:false
    })
  }
}