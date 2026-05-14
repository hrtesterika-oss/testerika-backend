require('dotenv').config();
const dbContext = require("../models");
const QuestionBanks = dbContext.QuestionBanks;
const QuestionCourses = dbContext.QuestionCourses;
const Courses = dbContext.Courses;
const Subjects = dbContext.Subjects;
const Marks = dbContext.QuestionMarks;
const Sequelize = require('sequelize');
const QuestionOptions=dbContext.QuestionOptions
const QuestionVerified=dbContext.QuestionVerified
const QuestionSolutions=dbContext.QuestionSolutions
const QuestionHints=dbContext.QuestionHints
const Questions=dbContext.Questions
const ReportQuestion=dbContext.ReportQuestion
const SavedQuestion=dbContext.SavedQuestion
const Passages=dbContext.Passages
const PassageBanks=dbContext.PassageBanks
const Op = Sequelize.Op
const axios=require("axios");
const { QUIZ_URL , QUESTION_BANK_URL} = require('../services');

exports.create = async (req, res) => {
    try {
        let {
            id, subject_id,
            question_type,
            level,
            courses,
            marks,passage_bank_id } = req.body
        let data
        if (id == undefined) {
            data = await QuestionBanks.create({
                subject_id,
                question_type,
                level,
                passage_bank_id
            })
            courses = courses.flatMap((item) => [{
                question_bank_id: data.id,
                course_id: item.id
            }])
            courses = await QuestionCourses.bulkCreate(courses)
            marks = { ...marks, question_bank_id: data.id }
            marks = await Marks.create(marks)
        } else {
            [, data] = await QuestionBanks.update({
                subject_id,
                question_type,
                level,
                passage_bank_id:passage_bank_id?passage_bank_id:null
            }, {
                where: { id },
                returning: true,
                plain: true
            });
            const coursesOld = await QuestionCourses.findAll({ where: { question_bank_id: id } });
            for (let item of courses) {
                let course = coursesOld.find((x) => x.course_id == item.id)
                if (!course) {
                    await QuestionCourses.create({ question_bank_id: id, course_id: item.id })
                }
            }
            for (let item of coursesOld) {
                let course = courses.find(x => x.id == item.course_id)
                if (!course) {
                    await QuestionCourses.destroy({ where: { id: item.id } })
                }
            }
            [, marks] = await Marks.update(marks, { where: { id: marks.id }, returning: true, plain: true })
        }
        return res.status(200).json({
            data: {
                ...data.toJSON(),
                courses,
                marks
            }
        })
    } catch (err) {
        res.status(500).json(err.message)
    }
}

exports.findAll = async (req, res) => {
    try {
        let { page, items_per_page, search, filter_id,filter_verified } = req.query
        let data;
        page = parseInt(page)
        items_per_page = parseInt(items_per_page)
        const offset = (page - 1) * items_per_page;
        const limit = items_per_page;
        const include = [
            {
                model: QuestionCourses,
                required: false,
                as: 'courses'
            },
            {
                model: Marks,
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
                    question_type: { [Op.like]: `%${search}%` }
                    // level: { [Op.like]: `%${search}%` }
                },
                order: [
                    ['id', 'DESC']
                ],
                include: include
            })
        } else if (filter_id) {
            data = await QuestionBanks.findAndCountAll({
                offset,
                limit,
                distinct: true,
                where: {
                    subject_id: filter_id,
                },
                order: [
                    ['id', 'DESC']
                ],
                include: include
            })
        } else {
            data = await QuestionBanks.findAndCountAll({
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
        return res.status(500).json(err)
    }
}


exports.getFilteredQuestions = async (req, res) => {
    try {
        const id=req.params.id

         const getQuizDetail=await axios.get(`${QUIZ_URL}/getQuizDetailAccordingToSubjectAndOtherFilteredData/${id}`)
          const {quiz,questionBankIdToExclude}=getQuizDetail.data
          let {subject_id,language,questions}=quiz
          const questionBanks=await QuestionBanks.findAll({where:{subject_id}})
          const questionbankIds=questionBanks.map((item)=>item.id)
          const allQuestions=await Questions.findAll({where:{question_bank_id:questionbankIds}})
          const questionsIds=allQuestions.map((item)=>item.id)
          const verifiedQuestions=await QuestionVerified.findAll({where:{question_id:questionsIds,is_verified:1}})
          const verifiedQuestionsId=verifiedQuestions.map((item)=>item.question_id)
        let { page, items_per_page, search, filter_question_type, filter_level } = req.query
        let data;
        page = parseInt(page)
        items_per_page = parseInt(items_per_page)
        const offset = (page - 1) * items_per_page;
        const limit = items_per_page;              
        const include = [
            {
                model: QuestionCourses,
                required: false,
                as: 'courses'
            },
            {
                model: Marks,
                required: false,
                as: 'marks'
            },
            {
                model: Questions,
                required: false,
                as: 'questions',
                where:{
                   language:{
                    [Op.in]:language.split(",")
                   },
                   id:verifiedQuestionsId
                },
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
                        as: 'verified', 
                        // is_verified:1                      
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
                    subject_id:subject_id,
                    id:{
                        [Op.notIn]: questionBankIdToExclude,
                    }
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
                    level: filter_level,
                    subject_id:subject_id,
                    id:{
                        [Op.notIn]: questionBankIdToExclude,
                    }
                },
                order: [
                    ['id', 'DESC']
                ],
                include: include
            })
        } else {
            data = await QuestionBanks.findAndCountAll({
                offset,
                limit,
                distinct: true,
                order: [
                    ['id', 'DESC']
                ],
                where:{
                        subject_id:subject_id,
                        id:{
                            [Op.notIn]: questionBankIdToExclude,
                        }
                },
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

        data.rows=data.rows.filter((item)=>item?.dataValues?.questions?.length>0)
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
        return res.status(500).json(err)
    }
}

exports.findAllCourses = async (req, res) => {
    try {
        const data = await Courses.findAll();
        return res.status(200).json(data)
    }
    catch (err) {
        return res.status(500).json(err)
    }
}

exports.findAllSubjects = async (req, res) => {
    try {
        const { ids } = req.body
        const data = await Subjects.findAll({
            where: { course_id: ids }
        });
        return res.status(200).json(data)
    }
    catch (err) {
        return res.status(500).json(err.message)
    }
}

exports.findById = async (req, res) => {
    try {
        const { id } = req.params
        const data = await QuestionBanks.findOne({
            where: { id },
            include: [
                {
                    model: QuestionCourses,
                    required: false,
                    as: 'courses'
                },
                {
                    model: Marks,
                    required: false,
                    as: 'marks'
                },
                {
                    model: Questions,
                    required: false,
                    as: 'questions',
                    order: [
                        ['id', 'ASC'],
                    ],
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
                            order:[['id', 'ASC']],
                        },
                        {
                            model: QuestionVerified,
                            required: false,
                            as: 'verified'
                        }
                    ]
                },

            ]
        });
        return res.status(200).json({ data: data.toJSON() });
    }
    catch (err) {
        return res.status(500).json(err);
    }
}

exports.update = async (req, res) => {
    try {
        const { id } = req.params
        let payload = req.body
        const [count, data] = await QuestionBanks.update(payload, {
            where: { id }, returning: true, plain: true
        });
        return res.status(200).json({ data })
    }
    catch (err) {
        return res.status(500).json(err.message)
    }
}

exports.delete = async (req, res) => {
    try {
        const { id } = req.params
        await QuestionBanks.destroy({
            where: { id }
        });
        return res.status(200).json("Record deleted")
    }
    catch (err) {
        return res.status(500).json(err)
    }
}






exports.getRandomQuestionsForCreatingQuiz = async (req, res) => {
    try {
        const {excludeQuestionBankId,subject_id,total_questions}=req.body
          const questionBanks=await QuestionBanks.findAll({where:{subject_id,id:{
            [Op.notIn]:excludeQuestionBankId
          }}})
          const questionbankIds=questionBanks.map((item)=>item.id)
          let currentIndex = questionbankIds.length,  randomIndex;

          // While there remain elements to shuffle.
          while (currentIndex != 0) {
        
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
        
            // And swap it with the current element.
            [questionbankIds[currentIndex], questionbankIds[randomIndex]] = [
            questionbankIds[randomIndex], questionbankIds[currentIndex]];
          }
        //   questionbankIds=questionbankIds.slice(0,total_questions)
        //   console.log(questionbankIds,"Suffled and only total question >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
        
         let newArr=[]

          for(let item of questionbankIds){
            if(newArr.length<total_questions){
                const allQuestions=await Questions.findAll({where:{question_bank_id:item}})
                const questionsIds=allQuestions.map((item)=>item.id)
                const verifiedQuestions=await QuestionVerified.findAll({where:{question_id:questionsIds,is_verified:1}})
                const verifiedQuestionsId=verifiedQuestions.map((item)=>item.question_id)
                if(verifiedQuestionsId?.length===questionsIds.length){
                     newArr.push(item)
                }
            }
            else{
                break;
            }
          }
        if(newArr.length<total_questions){
            return res.status(200).json({
                success:false,
                message:"You have limited verified number of questions."
            })
        }else{
            return res.status(200).json({
                success:true,
                data: newArr,
            })
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}




exports.getAllQuestionsWithQuizId=async (req,res)=>{
   try{
    const {quiz_key,user_id}=req.params
    const quizDetail=await axios.get(`${QUIZ_URL}/getQuizDetailForgettingQuestion/${quiz_key}/${user_id}`)
    const {questions,language}=quizDetail?.data?.quiz
    let time_taken=quizDetail?.data?.time_taken

    let questionbankId=questions.map((item)=>item.question_bank_id)

    const data=await QuestionBanks.findAll({where:{id:questionbankId},
        include:[
        {
            model: Questions,
            required: false,
            as: 'questions',
            attributes:{
                exclude:['createdAt','updatedAt','deletedAt']
            },
            include: [
                {
                    model: QuestionOptions,
                    required: false,
                    as: 'options',
                    attributes:{
                        exclude:['right_option','createdAt','updatedAt','deletedAt','status']
                    }
                }
            ]
        },
    ]})

    data.reverse().forEach((item, index) => {
        const j = Math.floor(Math.random() * (index + 1));
        [data[index], data[j]] = [data[j], data[index]];
    });

    let finalArr=[]

    for(let item of data){
        let tempArr=[]
       let dataItem=item.questions.map((item2)=>{
            const newArray = [...item2.options]
            newArray.reverse().forEach((item, index) => {
                const j = Math.floor(Math.random() * (index + 1));
                [newArray[index], newArray[j]] = [newArray[j], newArray[index]];
            });
            let option=[]
            newArray.map((item)=>{
               let temp={
                id:item.id,
                question_id:item.question_id,
                option:item.option
               }
               option.push(temp)
            })
             let obj={
                question:item2.question,
                id:item2.id,
                language:item2.language,
                question_bank_id:item2.question_bank_id,
                options:option
             }
             tempArr.push(obj)
        })
       finalArr.push(tempArr)

    }

    return res.status(200).json({
        success:true,
        data:finalArr,
        quiz:quizDetail?.data?.quiz,
        time_taken
    })


   }catch(err){
    return res.status(500).json({
        success:false
    })
   }
}



exports.uploadQuestionsFromExcelSheet=async (req,res)=>{
    try{
         const {questionDetail,questionBank}=req.body
           let questionBankDetail={
              subject_id:questionDetail.subject.id,
              question_type:questionDetail.question_type.value,
              level:questionDetail.level.value,
              passage_bank_id:questionDetail?.passage_bank_id
           }
           let {course,marks}=questionDetail
         if(questionBank?.length>0){
              questionBank.map(async (item)=>{
                let data = await QuestionBanks.create(questionBankDetail)
                course.map(async (item2)=>{
                    await QuestionCourses.create({question_bank_id:data.id,course_id:item2.id})
                })
               await Marks.create({marks:marks.marks,negative_marks:marks.negative_marks,question_bank_id:data.id})
               let createdQues= await Questions.create({question_bank_id:data.id,question:item.question,language:"English"})
                const options=item.options.flatMap((item2)=>[{question_id:createdQues.id,option:item2.option,right_option:item2.right_option}])
                await QuestionOptions.bulkCreate(options)
                if(item.hint!==""){
                    await QuestionHints.create({question_id:createdQues.id,hint:item.hint})
                }
                if(item.solution!==""){
                    await QuestionSolutions.create({question_id:createdQues.id,solution:item.solution})
                }  
              })
         }

         return res.status(200).json({
            success:true,
            message:"Questions created Successfully"
         })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success:false
        })
    }
}


exports.getAllQuestionBankWithQuestions=async (req,res)=>{
    try {
        const questionBanks=await QuestionBanks.findAll({where:{subject_id:req.params?.subject_id},attributes:["id"]})
        const questionbankIds=questionBanks.map((item)=>item.id)
        const allQuestions=await Questions.findAll({where:{question_bank_id:questionbankIds}})
        const questionsIds=allQuestions.map((item)=>item.id)

        const verifiedQuestions=await QuestionVerified.findAll({where:{question_id:questionsIds,is_verified:1}})
        const verifiedQuestionsId=verifiedQuestions.map((item)=>item.question_id)

        const questionBankDetailWIthQuestion=await QuestionBanks?.findAll({
            where:{
                subject_id:req.params?.subject_id
            },
            attributes:["id","subject_id","passage_bank_id"],
            include:[
                {
                    model:Questions,
                    as:"questions",
                    required:false,
                    attributes:["id"],
                    include:[{
                        model: QuestionVerified,
                        required: false,
                        as: 'verified', 
                        attributes:["id","question_id","is_verified"],
                        // is_verified:1   
                                        
                    }]
                }
            ]
        })
        let questionBankIds=[]
        if(questionBankDetailWIthQuestion && questionBankDetailWIthQuestion?.length>0){
            questionBankDetailWIthQuestion?.map((item)=>{
                let dataItem=item?.questions?.every((item2)=>item2?.verified?.id && item2?.verified?.is_verified==1)
                if(dataItem){
                    questionBankIds.push(item?.id)
                }
            })
        }
        let { page, items_per_page, search } = req.query
        let data;
        page = parseInt(page)
        items_per_page = parseInt(items_per_page)
        const offset = (page - 1) * items_per_page;
        const limit = items_per_page;
        const include = [
            {
                model: QuestionCourses,
                required: false,
                as: 'courses',
                attributes:["id","question_bank_id","course_id"]
            },
            {
                model: Marks,
                required: false,
                as: 'marks',
                attributes:["id","question_bank_id","marks","negative_marks"]
            },
            {
                model: Questions,
                required: false,
                as: 'questions',
                attributes:["id","question_bank_id","question"],
                where:{
                    id:verifiedQuestionsId
                },
                include: [
                    {
                        model: QuestionOptions,
                        required: false,
                        as: 'options',
                        attributes:["id","question_id","option"],
                    },
                    {
                        model: QuestionVerified,
                        required: false,
                        as: 'verified', 
                        attributes:["id","question_id","is_verified"],
                        // is_verified:1   
                                        
                    }
                ]
            },
        ]
        if (search) {
            data = await QuestionBanks.findAndCountAll({
                offset,
                limit,
                distinct: true,
                where:{
                    subject_id:req?.params?.subject_id,
                    id:{
                        [Op.in]:questionBankIds
                    }
                },
                attributes:["id","subject_id","passage_bank_id"],
                order: [
                    ['id', 'DESC']
                ],
                include: include
            })
        }else {
            data = await QuestionBanks.findAndCountAll({
                offset,
                limit,
                distinct: true,
                order: [
                    ['id', 'DESC']
                ],
                where:{
                    subject_id:req?.params?.subject_id,
                    id:{
                        [Op.in]:questionBankIds
                    }
                },
                attributes:["id","subject_id","passage_bank_id"],
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
   
    catch(err){
        return res.status(500).json({
            success:false
        })
    }
}


exports.getAllQuestionsUsingQuestionBankIds=async (req,res)=>{
   try{
        const {questionBankIds}=req.body
        const include = [
            {
                model: PassageBanks,
                required: false,
                attributes:["id"],
                include:[
                    {
                        model: Passages,
                        required: false,
                        as: 'passages',
                        attributes:["id","passage_bank_id","passage","language"]
                    }
                ]
            },
            {
                model: Marks,
                required: false,
                as: 'marks',
                attributes:["id","question_bank_id","marks","negative_marks"]
            },
            {
                model: Questions,
                required: true,
                as: 'questions',
                order:[["id","ASC"]],
                separate:true,
                attributes:["id","question_bank_id","question","language"],
                include: [
                    {
                        model: QuestionOptions,
                        required: true,
                        as: 'options',
                        separate:true,
                        order:[["id","ASC"]],
                        attributes:["id","question_id","option"]
                    }
                ]
            },
        ]

        let data = await QuestionBanks.findAll({
            where: {
               id:questionBankIds
                // level: { [Op.like]: `%${search}%` }
            },
            attributes:["id","passage_bank_id"],
            order: [
                ['id', 'ASC']
            ],
            include: include
        })
        if(data){
            return res.status(200).json({
                success:true,
                data
            })
        }else{
            return res.status(200).json({
                success:false
            })
        }
   }catch(err){
    return res.status(500).json({
        success:false
    })
   }
}


exports.questionsGetUsingQuestionBankIdView=async (req,res)=>{
    try{
         const {questionBankIds}=req.body
         let { page, items_per_page, search } = req.query
         let data;
         page = parseInt(page)
         items_per_page = parseInt(items_per_page)
         const offset = (page - 1) * items_per_page;
         const limit = items_per_page;
         const include = [
             {
                 model: PassageBanks,
                 required: false,
                 attributes:["id"],
                 include:[
                     {
                         model: Passages,
                         required: false,
                         as: 'passages',
                         attributes:["id","passage_bank_id","passage","language"]
                     }
                 ]
             },
             {
                 model: Marks,
                 required: false,
                 as: 'marks',
                 attributes:["id","question_bank_id","marks","negative_marks"]
             },
             {
                 model: Questions,
                 required: true,
                 as: 'questions',
                 order:[["id","ASC"]],
                 separate:true,
                 attributes:["id","question_bank_id","question","language"],
                 include: [
                     {
                         model: QuestionOptions,
                         required: true,
                         as: 'options',
                         separate:true,
                         order:[["id","ASC"]],
                         attributes:["id","question_id","option"]
                     }
                 ]
             },
         ]
 
         data = await QuestionBanks.findAndCountAll({
            offset,
            limit,
            distinct: true,
            where:{
                id:{
                    [Op.in]:questionBankIds
                }
            },
            attributes:["id","subject_id","passage_bank_id"],
            order: [
                ['id', 'DESC']
            ],
            include: include
        })
         if(data){
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
         }else{
             return res.status(200).json({
                 success:false
             })
         }
    }catch(err){
     return res.status(500).json({
         success:false
     })
    }
 }

exports.getAllQuestionsUsingQuestionIds=async (req,res)=>{
    try{
         const {questionBankIds,passageIds}=req.body        
 
         let data = await Questions.findAll({
             where: {
                id:questionBankIds
                 // level: { [Op.like]: `%${search}%` }
             },
             attributes:["id","question"],
             order: [
                 ['id', 'ASC']
             ],
             include: [
                {
                    model: QuestionOptions,
                    required: true,
                    as: 'options',
                    separate:true,
                    order:[["id","ASC"]],
                    attributes:["id","question_id","option","right_option"]
                }
             ]
         })

         let passages = await Passages.findAll({
            where: {
               id:passageIds
                // level: { [Op.like]: `%${search}%` }
            },
            attributes:["id","passage"],
            order: [
                ['id', 'ASC']
            ]
        })
         if(data){
             return res.status(200).json({
                 success:true,
                 data,
                 passages:passages
             })
         }else{
             return res.status(200).json({
                 success:false
             })
         }
    }catch(err){
     return res.status(500).json({
         success:false
     })
    }
 }


exports.getAllQuestionsWithAnswerUsingQuestionBankIds=async (req,res)=>{
    try{
         const {questionBankIds}=req.body
         const include = [
            {
                model: PassageBanks,
                required: false,
                attributes:["id"],
                include:[
                    {
                        model: Passages,
                        required: false,
                        as: 'passages',
                        attributes:["id","passage_bank_id","passage","language"]
                    }
                ]
            },
             {
                 model: Marks,
                 required: true,
                 as: 'marks',
                 attributes:["id","question_bank_id","marks","negative_marks"]
             },
             {
                 model: Questions,
                 required: true,
                 as: 'questions',
                 order:[["id","ASC"]],
                 separate:true,
                 attributes:["id","question_bank_id","question","language"],
                 include: [
                     {
                         model: QuestionOptions,
                         required: true,
                         as: 'options',
                         separate:true,
                         order:[["id","ASC"]],
                         attributes:["id","question_id","option","right_option"]
                     }
                 ]
             },
         ]
 
         let data = await QuestionBanks.findAll({
             where: {
                id:questionBankIds
                 // level: { [Op.like]: `%${search}%` }
             },
             attributes:["id","passage_bank_id"],
             order: [
                 ['id', 'ASC']
             ],
             include: include
         })
         if(data){
             return res.status(200).json({
                 success:true,
                 data
             })
         }else{
             return res.status(200).json({
                 success:false
             })
         }
    }catch(err){
     return res.status(500).json({
         success:false
     })
    }
 }











//Report Exam Controller
exports.findReportQuestion=async (req,res)=>{
    try{
        const {userid}=req.params
        let { page, items_per_page, search } = req.query
        let data
        page = parseInt(page)
        items_per_page = parseInt(items_per_page)
        const offset = (page - 1) * items_per_page
        const limit = items_per_page
          data = await ReportQuestion.findAndCountAll({
            distinct: true,
            offset,
            limit,
            where:{
              userid
            },
            attributes:["id","userid","question_bank_id","question_id","report_reason","reported","createdAt"],
            order: [['id', 'DESC']]
          })
          if(data  && data?.rows?.length>0){
            let questionBankIds=[]
            data?.rows?.map((item)=>{
                  if(!questionBankIds?.includes(item?.question_bank_id)){
                        questionBankIds.push(item?.question_bank_id)
                  }
            })
   
            if(questionBankIds?.length>0){
             // console.log(questionBankIds)
              const data2=await axios.post(`${QUESTION_BANK_URL}/getAllQuestionsUsingQuestionBankIds`,{questionBankIds})
              if(data2?.data?.success){
                  return res.status(200).json({
                     success:true,
                     questions:data2?.data?.data,
                     reportQuizdetail:data?.rows,
                     totalCount:data?.count
                  })
              }else{
                 return res.status(200).json({
                    success:false,
                    message:"Questions not found"
                 })
              }
            }else{
             return res.status(200).json({
               success:false,
               message:"No report questions found"
             })
            }
          }else{
            return res.status(200).json({
              success:false,
              message:"No report questions found"
            })
          }
    }catch(err){
        return res.status(500).json({
          success:false
        })
    }
  }
  
  exports.reportQuizQuestion=async (req,res)=>{
    try{
       const {userid,question_bank_id,question_id,report_reason} = req.body
       
       const data=await ReportQuestion.findOne({
          where:{
            userid,question_bank_id,question_id
          }
        })
      
       if(data){
           return res.status(200).json({
            success:false,
            message:"Question already reported"
           })
       }else{
          const data2=await ReportQuestion.create(req.body)
          if(data2){
            return res.status(200).json({
              success:true,
              message:"Questions reported successfully"
            })
          }else{
            return res.status(200).json({
              success:false,
              message:"Invalid details"
            })
          }
       }
    }catch(err){
      return res.status(500).json({
        success:false
      })
    }
  }
  
  exports.removeReportQuestion=async (req,res)=>{
    try{
      const {userid,question_bank_id,question_id} = req.body
      const data=await ReportQuestion.findOne({
         where:{
           userid,question_bank_id,question_id
         }
       })
      if(data){
            await ReportQuestion.destroy({
              where:{
                userid,question_bank_id,question_id
              }
            })
          return res.status(200).json({
           success:true,
           message:"Question removed successfully"
          })
      }
   }catch(err){
     return res.status(500).json({
       success:false
     })
   }
  }
  
  exports.getSingleReportQuizQuestionDetails=async(req,res)=>{
    try{
      const {userid,question_bank_id,question_id} = req.body
       const data=undefined
      
        data=await ReportQuestion.findOne({
          where:{
            userid,question_bank_id,question_id
          }
        })
       if(data){
          const data2=await axios.get(`${QUESTION_BANK_URL}/${data?.question_bank_id}`)
          if(data2?.data){
            return res.status(200).json({
              success:true,
              question:data2?.data,
              reportQuiz:data
            })
          }else{
            return res.status(200).json({
              success:false,
              message:"Question not reported"
             })
          }
       }else{
         return res.status(200).json({
          success:false,
          message:"Question not reported"
         })
       }
    }catch(err){
       return res.status(500).json({
        success:false
       })
    }
  }
  
  


  

//Saved Exam Controller
exports.findSavedQuestion=async (req,res)=>{
    try{
        const {userid}=req.params
        let { page, items_per_page, search } = req.query
        let data
        page = parseInt(page)
        items_per_page = parseInt(items_per_page)
        const offset = (page - 1) * items_per_page
        const limit = items_per_page
          data = await SavedQuestion.findAndCountAll({
            distinct: true,
            offset,
            limit,
            where:{
              userid
            },
            attributes:["id","userid","question_bank_id","question_id","createdAt"],
            order: [['id', 'DESC']]
          })
          if(data  && data?.rows?.length>0){
            let questionBankIds=[]
            data?.rows?.map((item)=>{
                  if(!questionBankIds?.includes(item?.question_bank_id)){
                        questionBankIds.push(item?.question_bank_id)
                  }
            })
   
            if(questionBankIds?.length>0){
             // console.log(questionBankIds)
              const data2=await axios.post(`${QUESTION_BANK_URL}/getAllQuestionsUsingQuestionBankIds`,{questionBankIds})
              if(data2?.data?.success){
                  return res.status(200).json({
                     success:true,
                     questions:data2?.data?.data,
                     savedQuizdetail:data?.rows,
                     totalCount:data?.count
                  })
              }else{
                 return res.status(200).json({
                    success:false,
                    message:"Questions not found"
                 })
              }
            }else{
             return res.status(200).json({
               success:false,
               message:"No saved questions found"
             })
            }
          }else{
            return res.status(200).json({
              success:false,
              message:"No saved questions found"
            })
          }
    }catch(err){
        return res.status(500).json({
          success:false
        })
    }
  }
  
  exports.savedQuizQuestion=async (req,res)=>{
    try{
       const {userid,question_bank_id,question_id} = req.body
       
       const data=await SavedQuestion.findOne({
          where:{
            userid,question_bank_id,question_id
          }
        })
      
       if(data){
           return res.status(200).json({
            success:false,
            message:"Question already saved"
           })
       }else{
          const data2=await SavedQuestion.create(req.body)
          if(data2){
            return res.status(200).json({
              success:true,
              message:"Questions saved successfully"
            })
          }else{
            return res.status(200).json({
              success:false,
              message:"Invalid details"
            })
          }
       }
    }catch(err){
      return res.status(500).json({
        success:false
      })
    }
  }
  
  exports.removeSavedQuestion=async (req,res)=>{
    try{
      const {userid,question_bank_id,question_id} = req.body
      const data=await SavedQuestion.findOne({
         where:{
           userid,question_bank_id,question_id
         }
       })
      if(data){
            await SavedQuestion.destroy({
              where:{
                userid,question_bank_id,question_id
              }
            })
          return res.status(200).json({
           success:true,
           message:"Question removed successfully"
          })
      }
   }catch(err){
     return res.status(500).json({
       success:false
     })
   }
  }
  
  exports.getSingleSavedQuizQuestionDetails=async(req,res)=>{
    try{
      const {userid,question_bank_id,question_id} = req.body
       const data=undefined
      
        data=await SavedQuestion.findOne({
          where:{
            userid,question_bank_id,question_id
          }
        })
       if(data){
          const data2=await axios.get(`${QUESTION_BANK_URL}/${data?.question_bank_id}`)
          if(data2?.data){
            return res.status(200).json({
              success:true,
              question:data2?.data,
              savedQuiz:data
            })
          }else{
            return res.status(200).json({
              success:false,
              message:"Question not saved"
             })
          }
       }else{
         return res.status(200).json({
          success:false,
          message:"Question not saved"
         })
       }
    }catch(err){
       return res.status(500).json({
        success:false
       })
    }
  }
  