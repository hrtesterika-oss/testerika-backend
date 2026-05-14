require('dotenv').config();
const dbContext = require("../models");
const crypto = require('crypto')
const QuestionOptions = dbContext.QuestionOptions;
const QuizCourses = dbContext.QuizCourses;
const QuizDates = dbContext.QuizDates;
const QuizPrizeDetails = dbContext.QuizPrizeDetails;
const QuizQuestions = dbContext.QuizQuestions;
const QuizResultAnalysis = dbContext.QuizResultAnalysis;
const QuizResults = dbContext.QuizResults;
const { uploadImage } = require('../middleware/fileUploader');
const Questions=dbContext.Questions
const QuestionHints=dbContext.QuestionHints
const QuestionSolutions=dbContext.QuestionSolutions
const QuestionVerified=dbContext.QuestionVerified
const QuestionBanks =dbContext.QuestionBanks
const QuestionCourses=dbContext.QuestionCourses
const QuestionMarks=dbContext.QuestionMarks
const axios=require("axios");
const { QUIZ_URL } = require('../services');
exports.findAll = async (req, res) => {
  await Questions.findAll()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err, "err")
      res.status(500).send(err)
    });
};

exports.create = async (req, res) => {
  try {
    const {questionBankDetail,questionDetail}=req.body
    let {id,question_type,level,subject,course,marks,passage_bank_id}=questionBankDetail
    let {question,options,language,hint,solution}=questionDetail
    let data;
    if(id==undefined){
        data = await QuestionBanks.create({
          subject_id:subject.id,
          question_type:question_type.value,
          level:level.value,
          passage_bank_id:passage_bank_id?passage_bank_id:null
      })
      course = course.flatMap((item) => [{
          question_bank_id: data.id,
          course_id: item.id
      }])
      course = await QuestionCourses.bulkCreate(course)
      // marks = {question_bank_id: data.id ,marks,negative_marks}
      marks = await QuestionMarks.create({question_bank_id: data.id ,marks:marks.marks,negative_marks:marks.negative_marks})
    }else{
      [, data] = await QuestionBanks.update({
        subject_id:subject.id,
        question_type:question_type.value,
        level:level.value,
        passage_bank_id:passage_bank_id?passage_bank_id:null
    }, {
        where: { id },
        returning: true,
        plain: true
    });
    const coursesOld = await QuestionCourses.findAll({ where: { question_bank_id: id } });
    for (let item of course) {
        let course = coursesOld.find((x) => x.course_id == item.course_id)
        if (!course) {
            await QuestionCourses.create({ question_bank_id: id, course_id: item.id })
        }
    }
    for (let item of coursesOld) {
        let course2 = course.find(x => x.course_id == item.course_id)
        if (!course2) {
            await QuestionCourses.destroy({ where: { id: item.id } })
        }
    }
    [, marks] = await QuestionMarks.update({marks:marks.marks,negative_marks:marks.negative_marks}, { where: { id: marks.id }, returning: true, plain: true })
    }

        question = await Questions.create({
          question_bank_id:data?.id?data?.id:id,
          question:question.question,
          language:language.label
        })
        if(hint.hint.replace( /(<([^>]+)>)/ig, '')?.trim()!=="" && hint.hint.replace( /(<([^>]+)>)/ig, '')?.trim()){
          hint = await QuestionHints.create({
            question_id: question.id,
            hint:hint.hint
          })
        }
        if(solution.solution.replace( /(<([^>]+)>)/ig, '')?.trim()!=="" && solution.solution.replace( /(<([^>]+)>)/ig, '')?.trim()){
          solution = await QuestionSolutions.create({
            question_id: question.id,
            solution:solution.solution
          })
        }
        options = options.flatMap(x => [{
          question_id: question.id,
          option: x.option,
          right_option: x.right_option
        }])
        options = await QuestionOptions.bulkCreate(options)
        return res.status(200).json({
          success:true,
          message:"Question Added Successfully",
          data: {
           id:data?.id?data?.id:id,
           passage_bank_id:passage_bank_id?passage_bank_id:null,
           course,
           subject,
           marks,
           question,
           options,
           hint,
           solution,
           question_type,
           level,
           language
          }
        })
  }
  catch (err) {
    console.log(err, "err")
    res.status(500).send(err.message)
  }
};

exports.addOption = async (req, res) => {
  try {
    const data = await QuestionOptions.create(req.body);
    res.status(200).json(data)
  } catch (err) {
    console.log(err, "err")
    res.status(500).json(err)
  }
}

exports.deleteOption = async (req, res) => {
  try {
    const { id } = req.params
    const data = await QuestionOptions.destroy({ where: { id } });
    res.status(200).json({
      success:true,
      message:"Option Deleted Successfully"
    })
  } catch (err) {
    console.log(err, "err")
    res.status(500).json(err)
  }
}

exports.updateQuestion = async (req, res) => {
  try {
    const {questionBankId,questionId}=req.params
    const {questionBankDetail,questionDetail}=req.body
    let {id,question_type,level,subject,course,marks,passage_bank_id}=questionBankDetail
    let {question,options,language,hint,solution,verify}=questionDetail
    let data;
    
      [, data] = await QuestionBanks.update({
        subject_id:subject.id,
        question_type:question_type.value,
        level:level.value,
        passage_bank_id:passage_bank_id?passage_bank_id:null
    }, {
        where: { id },
        returning: true,
        plain: true
    });
    const coursesOld = await QuestionCourses.findAll({ where: { question_bank_id: id } });
    for (let item of course) {
        let course = coursesOld.find((x) => x.course_id == item.course_id)
        if (!course) {
            await QuestionCourses.create({ question_bank_id: id, course_id: item.id })
        }
    }
    for (let item of coursesOld) {
        let course2 = course.find(x => x.course_id == item.course_id)
        if (!course2) {
            await QuestionCourses.destroy({ where: { id: item.id } })
        }
    }
    [,marks] = await QuestionMarks.update({marks:marks.marks,negative_marks:marks.negative_marks}, { where: { id: marks.id }, returning: true, plain: true })
    
        if(hint?.id){
          [,hint] = await QuestionHints.update({
            hint:hint.hint
          },{where:{question_id:questionId},returning:true,plain:true})
        }else{
          hint = await QuestionHints.create({
            hint:hint.hint,
            question_id:questionId
          })
        }
        if(solution?.id){
          [,solution] = await QuestionSolutions.update({
            solution:solution.solution
          },{where:{question_id:questionId},returning:true,plain:true})
        }else{
          solution = await QuestionSolutions.create({
            solution:solution.solution,
            question_id:questionId
          })
        }
        [, question] = await Questions.update({question:question.question,language:language.label},{where:{id:questionId},returning:true,plain:true})

        if(verify?.id){
          [,verify]=await QuestionVerified.update({is_verified:verify.is_verified,verified_by:verify.verified_by},{where:{question_id:questionId},plain:true,returning:true})
        }else{
          if(verify.verified_by!=="" && verify.verified_by)
          verify=await QuestionVerified.create({is_verified:verify.is_verified,verified_by:verify.verified_by,question_id:questionId})
        }
        let findAllOptions=await QuestionOptions.findAll({where:{question_id:questionId}})
        let ids2=options.map((item)=>item.id!==undefined && item?.id)
        let ids=findAllOptions.map((item)=>item.id)

        for (let item of options){
           if(ids.includes(item.id)){
              if(item.right_option===1){
                await QuestionOptions.update({option:item.option,right_option:1},{where:{id:item.id,question_id:questionId}})
              }else{
                await QuestionOptions.update({option:item.option,right_option:0},{where:{id:item.id,question_id:questionId}})
              }
           }else{
             const data2=await QuestionOptions.create({option:item.option,right_option:item.right_option,question_id:Number(questionId)})
           }
        }

        options = await QuestionOptions.findAll({where:{question_id:questionId}})
        ids=options.map((item)=>item.id)
        // for(let item of ids){
        //   console.log("ids2:   ",ids2)
        //   console.log("ids:   ",ids)

        //     if(!ids2.includes(item)){
        //       await QuestionOptions.destroy({where:{id:item}})
        //     }
        // }
        return res.status(200).json({
          success:true,
          message:"Question Updated Successfully",
          data: {
           id,
           passage_bank_id:passage_bank_id?passage_bank_id:null,
           course,
           subject,
           marks,
           question,
           options,
           hint,
           solution,
           question_type,
           level,
           language
          }
        })
  }
  catch (err) {
    console.log(err, "err")
    res.status(500).send(err.message)
  }
};

exports.updateOptions = async (req, res) => {
  try {
    const { id } = req.params
    const [x, option] = await QuestionOptions.update(req.body, {
      where: { id }, returning: true, plain: true
    });
    return res.status(200).json({ message: "Option successfully updated", option })
  }
  catch (err) {
    console.log(err, "err")
    res.status(500).send(err)
  }
};

exports.findById = async (req, res) => {
  await Questions.findOne({
    where: { id: req.params.id },
    include: [
      {
        model: QuizDates,
        required: false
      },
      {
        model: QuestionOptions,
        required: false
      },
      {
        model: QuizCourses,
        required: false
      },
      {
        model: QuizPrizeDetails,
        required: false
      }
    ]
  })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => res.status(204).send(err));
};

exports.delete = async (req, res) => {
  const findOneQues=await Questions.findAll({where:{question_bank_id:req.params.id}})
  let ids=findOneQues.map((item)=>item.id)
  
  await QuestionVerified.destroy({
    where:{question_id:ids}
  })
  await QuestionHints.destroy({
    where:{question_id:ids}
  })
  await QuestionSolutions.destroy({
    where:{question_id:ids}
  })
  await QuestionOptions.destroy({
    where: { question_id:ids},
  })
  await QuestionCourses.destroy({
    where:{question_bank_id:req.params.id}
  })
  await QuestionMarks.destroy({where:{question_bank_id:req.params.id}})
  await Questions.destroy({
    where: { question_bank_id: req.params.id },
  })
  await QuestionBanks.destroy({where:{id:req.params.id}})

      res.status(200).json({
        msg: "Questions deleted.",
      })
};


exports.deleteQuestions = async (req, res) => {
  const findOneQues=await Questions.findOne({where:{id:req.params.id}})
  const {id}=req.params
  await QuestionVerified.destroy({
    where:{question_id:id}
  })
  await QuestionHints.destroy({
    where:{question_id:id}
  })
  await QuestionSolutions.destroy({
    where:{question_id:id}
  })
  await QuestionOptions.destroy({
    where: { question_id:id},
  })
 
  await Questions.destroy({
    where: { id },
  })

      res.status(200).json({
        msg: "Questions deleted.",
      })
};


exports.getQuestionDetails=async (req,res)=>{
   try{
      const {questionBankId,questionId}=req.params
      const data = await QuestionBanks.findOne({
        where: { id:questionBankId },
        include: [
            {
                model: QuestionCourses,
                required: false,
                as: 'courses'
            },
            {
                model: QuestionMarks,
                required: false,
                as: 'marks'
            },
            {
                model: Questions,
                required: false,
                as: 'questions',
                order:[["id","ASC"]],
                include: [
                    {
                        model: QuestionHints,
                        required: false,
                        as: 'hint'
                    },
                    {
                        model: QuestionSolutions,
                        required: false,
                        as: 'solution'
                    },
                    {
                        model: QuestionOptions,
                        required: false,
                        as: 'options',
                        separate: true,
                        order:[["id","ASC"]],
                    },
                    {
                        model: QuestionVerified,
                        required: false,
                        as: 'verified'
                    }
                ]
            },

        ]
    })   
    return res.status(200).json({
      suiccess:true,
      data
    })
   }catch(err){
    console.log(err)
    return res.status(500).json({
      success:false
    })
   }
}


exports.getQuestionUsingQuestionBankIdAndLanguage=async (req,res)=>{
    try{
        const {questionBankId,language}=req.params

        const data=await Questions.findOne({where:{question_bank_id:questionBankId,language},  
        include:[
          {
            model: QuestionOptions,
            required: false,
            as: 'options',
            order:[["id","ASC"]],
            separate:true
          },
          {
                model: QuestionHints,
                required: false,
                as: 'hint'
            },
            {
                model: QuestionSolutions,
                required: false,
                as: 'solution'
            },
            {
                model: QuestionVerified,
                required: false,
                as: 'verified'
            }
        ]})
        return res.status(200).json({
          success:true,
          data
        })
    }catch(err){
      console.log(err)
      return res.status(500).json({
        success:false
      })
    }
}




exports.getAllQuestionsUsingQuizId = async (req, res) => {
  try {
    const {quiz_id}=req.params

    const quizDetail=await axios.get(`${QUIZ_URL}/getQuizDetailForgettingQuestion/${quiz_id}`)

    const {questions}=quizDetail.data.quiz
    const questionbankId=questions.map((item)=>item.question_bank_id)
    let { page, items_per_page, search, filter_question_type, filter_level } = req.query
    let data;
    page = parseInt(page)
    items_per_page = parseInt(items_per_page)
    const offset = (page - 1) * items_per_page;
    const limit = items_per_page;
    const include = [
        {
            model: QuestionMarks,
            required: false,
            as: 'marks'
        },
        {
            model: Questions,
            required: false,
            as: 'questions',
            include: [
                {
                    model: QuestionHints,
                    required: false,
                    as: 'hint'
                },
                {
                    model: QuestionSolutions,
                    required: false,
                    as: 'solution'
                },
                {
                    model: QuestionOptions,
                    required: false,
                    as: 'options'
                },
                {
                    model: QuestionVerified,
                    required: false,
                    as: 'verified'
                }
            ]
        },
    ]
    if (search) {
        data = await QuestionBanks.findAndCountAll({
            offset,
            limit,
            distinct: true,
            where: {
                question_type: { [Op.like]: `%${search}%` },
                id:questionbankId
                // level: { [Op.like]: `%${search}%` }
            },
            order: [
                ['id', 'DESC']
            ],
            include: include
        })
    } else if (filter_level && filter_question_type) {
        data = await QuestionBanks.findAndCountAll({
            offset,
            limit,
            distinct: true,
            where: {
                question_type: filter_question_type,
                level: filter_level
            },
            order: [
                ['id', 'DESC']
            ],
            include: include
        })
    } else {
        data = await QuestionBanks.findAndCountAll({
            where:{id:questionbankId},
            offset,
            limit,
            distinct: true,
            order: [
                ['id', 'DESC']
            ],
            include: include
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
    console.log(err)
    return res.status(500).json(err)
}
}


exports.checkAnswerIsCorrectOrNot=async (req,res)=>{
   try{
      const {question_id,option_id}=req.body
      const findQuestion=await Questions.findOne({
        where:{
          id:question_id
        },
        include:[
          {
            model:QuestionOptions,
            required:false,
            as:"options"
          }
        ]
      })
      const getQuestionBankDetail=await QuestionBanks.findOne({where:{id:findQuestion?.question_bank_id},include:[
        {
          model: QuestionMarks,
          required: false,
          as: 'marks'
        }
      ]})
     
      const result=findQuestion?.options?.find((item)=>item.question_id===question_id && item.id===option_id && item.right_option===1)

      if(result){
        return res.status(200).json({
          correct:true,
          points:getQuestionBankDetail.marks.marks
        }) 
      }else{
        return res.status(200).json({
          correct:false,
          points:getQuestionBankDetail.marks.negative_marks
        }) 
      }
   }catch(err){
    return res.status(500).json({
      success:false
    })
   }
}


exports.getAllQuestionDetailUsingQuestionBankId=async (req,res)=>{
  try{
     const {data}=req.body
        const findQuestionBankWithQuestions=await QuestionBanks.findAll({
          where:{id:data},
          attributes:["id"],
          include:[
            {
              model:Questions,
              required:true,
              as:"questions",
              attributes:["id","question_bank_id"],
              include:[{
                model:QuestionOptions,
                required:true,
                as:"options",
                attributes:["id","question_id","right_option"],
              }]
            },
            {
              model:QuestionMarks,
              required:true,
              as:"marks",
              attributes:["id","question_bank_id","marks","negative_marks"]
            }
          ]
         })    
    //  const findQuestion=await Questions.findOne({
    //    where:{
    //      id:question_id
    //    },
    //    include:[
    //      {
    //        model:QuestionOptions,
    //        required:false,
    //        as:"options"
    //      }
    //    ]
    //  })
    //  const getQuestionBankDetail=await QuestionBanks.findOne({where:{id:findQuestion?.question_bank_id},include:[
    //    {
    //      model: QuestionMarks,
    //      required: false,
    //      as: 'marks'
    //    }
    //  ]})
    
    //  const result=findQuestion?.options?.find((item)=>item.question_id===question_id && item.id===option_id && item.right_option===1)

     if(findQuestionBankWithQuestions){
       return res.status(200).json({
          data:findQuestionBankWithQuestions
       }) 
     }else{
       return res.status(200).json({
         data:null
       }) 
     }
  }catch(err){
    console.log(err)
   return res.status(500).json({
     success:false
   })
  }
}