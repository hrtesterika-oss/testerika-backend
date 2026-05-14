const { Op } = require("sequelize");
const dbContext = require("../models");
const UserDoubt=dbContext.UserDoubt
const UserDoubtSolution=dbContext.UserDoubtSolution
// const UserDoubtReport=dbContext.UserDoubtReport
exports.createDoubt=async (req,res)=>{
    try{
        const {userid}=req.body
        if(userid){
            const data=await UserDoubt.create(req.body)
            if(data){
                return res.status(200).json({
                    success:true,
                    message:"Your doubt saved successfully"
                })
            }else{
                return res.status(200).json({
                    success:false,
                    message:"Invalid payload"
                })
            }
        }else{
            return res.status(200).json({
                success:false,
                message:"Invalid user details"
            })
        }
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

exports.updateDoubt=async (req,res)=>{
    try{
        const {id}=req.params
        if(id){
                await UserDoubt.update(req.body,{where:{id}})
                return res.status(200).json({
                    success:true,
                    message:"Your doubt updated successfully"
                })
        }else{
            return res.status(200).json({
                success:false,
                message:"Invalid details"
            })
        }
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

exports.getAllDoubt=async (req,res)=>{
    try {
        let { page, items_per_page, search ,subject_ids,other_subject} = req.query
        if(subject_ids)
          subject_ids=subject_ids?.split(",")
        else
          subject_ids=[]
        if(other_subject)
          other_subject=other_subject?.split(",")
        else
          other_subject=[]


        let data
        page = parseInt(page)
        items_per_page = parseInt(items_per_page)
        const offset = (page - 1) * items_per_page
        const limit = items_per_page
        if (search) {
          data = await UserDoubt.findAndCountAll({
            distinct: true,
            offset,
            limit,
            where: {
              question: { [Op.like]: `%${search}%` },
              active:1
              // level: { [Op.like]: `%${search}%` }
            },
            attributes:["id","userid","course_id","subject_id","active","other_subject","question","hint_or_reference","image","createdAt","status"],
            include:[
              {
                  model:UserDoubtSolution,
                  required:false,
                  attributes:["id","userid","doubt_id","solution",'hint_or_reference',"image","status","createdAt"],
                  as:"solutions"
              }
            ],
            order: [['id', 'DESC']]
          })
        } 
        else if(subject_ids?.length>0 || other_subject?.length>0){
          data = await UserDoubt.findAndCountAll({
            distinct: true,
            offset,
            limit,
            where: {
              [Op.or]: [
                { subject_id: subject_ids },
                { other_subject: other_subject}
              ],
              active:1
              // level: { [Op.like]: `%${search}%` }
            },
            attributes:["id","userid","course_id","subject_id","active","other_subject","question","hint_or_reference","image","createdAt","status"],
            include:[
              {
                  model:UserDoubtSolution,
                  required:false,
                  attributes:["id","userid","doubt_id","solution",'hint_or_reference',"image","status","createdAt"],
                  as:"solutions"
              }
            ],
            order: [['id', 'DESC']]
          })
        }
        else {
          data = await UserDoubt.findAndCountAll({
            distinct: true,
            offset,
            limit,
            where:{
                active:1
            },
            attributes:["id","userid","course_id","subject_id","active","other_subject","question","hint_or_reference","image","createdAt","status"],
            include:[
                {
                    model:UserDoubtSolution,
                    required:false,
                    attributes:["id","userid","doubt_id","solution",'hint_or_reference',"image","status","createdAt"],
                    as:"solutions"
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


        let userIds=[]
        if(data?.rows?.length>0){
          userIds=data.rows?.map((item)=>item?.userid)
        }
        return res.status(200).json({
          data: data.rows,
          userIds,
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

exports.getMyDoubtById= async (req, res) => {
    try {
      let { page, items_per_page, search,userid,subject_ids,other_subject } = req.query
      if(subject_ids)
        subject_ids=subject_ids?.split(",")
      else
        subject_ids=[]
      if(other_subject)
        other_subject=other_subject?.split(",")
      else
        other_subject=[]
      let data
      page = parseInt(page)
      items_per_page = parseInt(items_per_page)
      const offset = (page - 1) * items_per_page
      const limit = items_per_page
      if (search) {
        data = await UserDoubt.findAndCountAll({
          distinct: true,
          offset,
          limit,
          where: {
            question: { [Op.like]: `%${search}%` },
            userid
            // level: { [Op.like]: `%${search}%` }
          },
          attributes:["id","userid","course_id","subject_id","active","other_subject","question","hint_or_reference","image","createdAt","status"],
          include:[
            {
                model:UserDoubtSolution,
                required:false,
                attributes:["id","userid","doubt_id","solution",'hint_or_reference',"image","status","createdAt"],
                as:"solutions"
            }
          ],
          order: [['id', 'DESC']]
        })
      } else if(subject_ids?.length>0 || other_subject?.length>0){
        data = await UserDoubt.findAndCountAll({
          distinct: true,
          offset,
          limit,
          where: {
            userid,
            [Op.or]: [
              { subject_id: subject_ids },
              { other_subject: other_subject}
            ],
            active:1
            // level: { [Op.like]: `%${search}%` }
          },
          attributes:["id","userid","course_id","subject_id","active","other_subject","question","hint_or_reference","image","createdAt","status"],
          include:[
            {
                model:UserDoubtSolution,
                required:false,
                attributes:["id","userid","doubt_id","solution",'hint_or_reference',"image","status","createdAt"],
                as:"solutions"
            }
          ],
          order: [['id', 'DESC']]
        })
      }else {
        data = await UserDoubt.findAndCountAll({
           where:{
             userid
          },
          attributes:["id","userid","course_id","subject_id","active","other_subject","question","hint_or_reference","image","createdAt","status"],
          include:[
            {
                model:UserDoubtSolution,
                required:false,
                attributes:["id","userid","doubt_id","solution",'hint_or_reference',"image","status","createdAt"],
                as:"solutions"
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
      console.log(err)
      return res.status(500).json(err)
    }
}

exports.getDoubtSolutionById= async (req, res) => {
    try {
      let { page, items_per_page,id } = req.query
      page = parseInt(page)
      items_per_page = parseInt(items_per_page)
      const offset = (page - 1) * items_per_page
      const limit = items_per_page
      const data=await UserDoubt.findOne({
        where:{
            id
        },
        attributes:["id","userid","course_id","subject_id","active","other_subject","question","hint_or_reference","image","createdAt","status"],
      })
      let doubtSolution=undefined
      if(data){
          doubtSolution=await UserDoubtSolution.findAndCountAll({
            limit,
            offset,
            distinct: true,
            where:{
                doubt_id:data?.id,
                status:1
            },
            attributes:["id","userid","doubt_id","solution",'hint_or_reference',"image","status","createdAt"]
          })
      }

      if(doubtSolution && data){
          return res.status(200).json({
            doubt:data,
            solution:doubtSolution.rows,
            total:doubtSolution.count
          })
      }else{
        return res.status(200).json({
            success:false,
            message:"Something went wrong"
        })
    }
      
    } catch (err) {
      return res.status(500).json(err)
    }
}


exports.deleteDoubt=async (req,res)=>{
    try{
           const {id}=req.params
           await UserDoubtSolution.destroy({
                where:{
                    doubt_id:id
                }
           })
           await UserDoubt.destroy({
                where:{
                    id
                }
           })

           return res.status(200).json({
            success:true,
            message:"Doubt deleted successfully"
           })
    }catch(err){
        return res.status(500).json({
            success:false
        })
    }
}

exports.deleteDoubtSolution=async (req,res)=>{
    try{
           const {doubt_id,id,userid}=req.params
           await UserDoubtSolution.destroy({
                where:{
                    doubt_id,
                    id,
                    userid
                }
           })
           return res.status(200).json({
            success:true,
            message:"Solution deleted successfully"
           })
    }catch(err){
        return res.status(500).json({
            success:false
        })
    }
}


exports.createDoubtSolution=async (req,res)=>{
    try{
       const {doubt_id,userid,solution,hint_or_reference,image,status}=req.body

       const findDoubtSolution=await UserDoubtSolution.findOne({
        where:{
            userid,doubt_id
        }
       })
       if(findDoubtSolution){
        await UserDoubtSolution.update({
          solution,hint_or_reference,image
        },{
          where:{
            userid,doubt_id,id:findDoubtSolution?.id
          }
        })
        return res.status(200).json({
            success:true,
            message:"Solution updated successfully"
        })
       }else{
          const data=await UserDoubtSolution.create({
            userid,doubt_id,solution,hint_or_reference,image,status
          })
          if(data){
            return res.status(200).json({
                success:true,
                message:"Solution added successfully"
            })
          }else{
            return res.status(200).json({
                success:false,
                message:"Something went wrong"
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

exports.updateDoubtSolution=async (req,res)=>{
     try{
        const {doubt_id,id,userid}=req.params
        await UserDoubtSolution.update(req.body,{where:{
            id,doubt_id,userid
        }})
        return res.status(200).json({
            success:true,
            message:"Doubt Solution Updated Successfully"
        })
     }catch(err){
         return res.status(500).json({
            success:false
         })
     }
}

exports.updateDoubtStatus=async (req,res)=>{
    try{
        const {id,userid}=req.params
        const {status}=req.body
        if(id && userid){
                await UserDoubt.update({status},{where:{id,userid}})
                return res.status(200).json({
                    success:true,
                    message:"Your doubt status updated successfully"
                })
        }else{
            return res.status(200).json({
                success:false,
                message:"Invalid details"
            })
        }
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}


exports.updateDoubtSolutionStatus=async (req,res)=>{
    try{
        const {id,userid,doubt_id}=req.params
        const {status}=req.body
        if(id && userid && doubt_id){
                await UserDoubtSolution.update({status},{where:{id,userid,doubt_id}})
                return res.status(200).json({
                    success:true,
                    message:"Doubt solution status updated successfully"
                })
        }else{
            return res.status(200).json({
                success:false,
                message:"Invalid details"
            })
        }
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}


exports.updateDoubtActiveStatus=async (req,res)=>{
  try{
    const {id,userid,active}=req.body
    await UserDoubt.update({active},{where:{id,userid}})
    return res.status(200).json({
      success:true,
      message:"Doubt Status updated Successfully"
    })
  }catch(err){
    return res.status(500).json({
      success:false
    })
  }
}

// exports.reportDoubt=async (req,res)=>{
//   try{
//      const {id,userid,report_reason}=req.body
//      const data=await UserDoubtReport.create({userid,doubt_id:id,report_reason})
//      if(data){
//       return res.status(200).json({
//         success:true,
//         message:"Your report generated successfully"
//       })
//      }else{
//       return res.status(500).json({
//         success:false,
//         message:"Something went wrong"
//       })
//      }
//   }catch(err){
//     return res.status(500).json({
//       success:false
//     })
//   }
// }

exports.addedToMyDoubt=async (req,res)=>{
   try{
      const {id,userid}=req.body
      const findDoubt=await UserDoubt.findOne({
        where:{
          id
        }
      })
      if(findDoubt){
        const data=await UserDoubt.create({
           userid,course_id:findDoubt?.course_id,subject_id:findDoubt?.subject_id,other_subject:findDoubt?.other_subject,question:findDoubt?.question,hint_or_reference:findDoubt?.hint_or_reference,image:findDoubt?.image,active:1,status:findDoubt?.status
        })
        if(data){
          return res.status(200).json({
            success:true,
            message:"Doubt added successfully"
          })
        }else{
          return res.status(200).json({
            success:false,
            message:"Something went wrong"
          })
        }
      }else{
        return res.status(200).json({
          success:false,
          message:"Invalid details"
        })
      }
     
   }catch(err){
    return res.status(500).json({
      success:false
    })
   }
}

// exports.markDoubtAsReported=async (req,res)=>{
//    try{
//       const {id}=req.params
//       await UserDoubtReport.update({mark_reported:1},{where:{
//         doubt_id:id
//       }})
//       return res.status(200).json({
//         success:true,
//         message:"Doubt marked as reported"
//       })
//    }catch(err){
//     return res.status(500).json({
//       success:false
//     })
//    }
// }



exports.getSingleDoubtSolution= async (req, res) => {
  try {
    const {id}=req.params
    const data=await UserDoubt.findOne({
            where: {
              active:1,
              id
            },
            attributes:["id","userid","course_id","subject_id","active","other_subject","question","hint_or_reference","image","createdAt","status"],
            include:[
              {
                  model:UserDoubtSolution,
                  required:false,
                  attributes:["id","userid","doubt_id","solution",'hint_or_reference',"image","status","createdAt"],
                  as:"solutions"
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
          message:"Something went wrong"
      })
  }
    
  } catch (err) {
    return res.status(500).json(err)
  }
}

exports.getAllDoubtsCoursesAndSubjectSId=async (req,res)=>{
  try{
    const data=await UserDoubt.findAll({
      attributes:["id","subject_id","other_subject"]
    })
    return res.status(200).json({
      success:true,
      data
    })
  }catch(err){
    return res.status(500).json({
      success:false
    })
  }
}