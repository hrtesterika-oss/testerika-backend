require('dotenv').config()
const dbContext = require('../models')
const crypto = require('crypto')
const Quizzes = dbContext.Quizzes
const QuizTypes = dbContext.QuizTypes
const QuizCourses = dbContext.QuizCourses
const QuizDates = dbContext.QuizDates
const QuizPrizeDetails = dbContext.QuizPrizeDetails
const QuizQuestions = dbContext.QuizQuestions
const QuizResultAnalysis = dbContext.QuizResultAnalysis
const QuizResults = dbContext.QuizResults
const UserRegistration = dbContext.UserRegistration
const QuizNotifications = dbContext.QuizNotifications
const Passage = dbContext.Passage
const PassageBank = dbContext.PassageBank
const QuizReview = dbContext.QuizReview
const { uploadImage } = require('../middleware/fileUploader')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const axios = require("axios")
const { userInfo } = require('os')
const { QUESTION_BANK_URL, USER_URL, QUESTION_URL } = require('../services')
exports.findAll = async (req, res) => {
  try {
    let { page, items_per_page, search } = req.query
    let data
    page = parseInt(page) || 1
    items_per_page = parseInt(items_per_page) || 10
    const offset = (page - 1) * items_per_page
    const limit = items_per_page
    if (search) {
      data = await Quizzes.findAndCountAll({
        distinct: true,
        offset,
        limit,
        where: {
          name: { [Op.like]: `%${search}%` }
          // level: { [Op.like]: `%${search}%` }
        },
        order: [['id', 'DESC']],
        include: [
          {
            model: QuizDates,
            required: false,
            as: 'dates'
          },
          {
            model: QuizCourses,
            required: false,
            as: 'courses'
          },
          {
            model: QuizPrizeDetails,
            required: false,
            as: 'prize'
          },
          {
            model: QuizQuestions,
            required: false,
            as: 'questions'
          }
        ]
      })
    } else {
      data = await Quizzes.findAndCountAll({
        distinct: true,
        offset,
        limit,
        order: [['id', 'DESC']],
        include: [
          {
            model: QuizDates,
            required: false,
            as: 'dates'
          },
          {
            model: QuizCourses,
            required: false,
            as: 'courses'
          },
          {
            model: QuizPrizeDetails,
            required: false,
            as: 'prize'
          },
          {
            model: QuizQuestions,
            required: false,
            as: 'questions'
          }
        ]
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
    return res.status(500).json(err.message)
  }
}

exports.getAllCompletedQuiz = async (req, res) => {
  try {
    let { page, items_per_page, search } = req.query
    let data
    page = parseInt(page) || 1
    items_per_page = parseInt(items_per_page) || 10
    const offset = (page - 1) * items_per_page
    const limit = items_per_page

    let quizCompletedDetail = await QuizResults.findAll({
      attributes: ['quiz_id'], // Only selecting the quiz_id column
      group: ['quiz_id'],
    })
    let quizIds = quizCompletedDetail.map((item) => item.quiz_id)

    if (search) {
      data = await Quizzes.findAndCountAll({
        distinct: true,
        offset,
        limit,
        where: {
          name: { [Op.like]: `%${search}%` },
          id: quizIds
          // level: { [Op.like]: `%${search}%` }
        },
        order: [['id', 'DESC']],
        include: [
          {
            model: QuizDates,
            required: false,
            as: 'dates'
          },
          {
            model: QuizCourses,
            required: false,
            as: 'courses'
          },
          {
            model: QuizPrizeDetails,
            required: false,
            as: 'prize'
          },
          {
            model: QuizQuestions,
            required: false,
            as: 'questions'
          }
        ]
      })
    } else {
      data = await Quizzes.findAndCountAll({
        where: {
          id: quizIds
        },
        distinct: true,
        offset,
        limit,
        order: [['id', 'DESC']],
        include: [
          {
            model: QuizDates,
            required: false,
            as: 'dates'
          },
          {
            model: QuizCourses,
            required: false,
            as: 'courses'
          },
          {
            model: QuizPrizeDetails,
            required: false,
            as: 'prize'
          },
          {
            model: QuizQuestions,
            required: false,
            as: 'questions'
          }
        ]
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
    return res.status(500).json(err.message)
  }
}

exports.getAllQuiz = async (req, res) => {
  Quizzes.findAll()
    .then(data => {
      res.status(200).json(data)
    })
    .catch(err => res.status(500).send(err))
}

exports.quizQuestions = async (req, res) => {
  try {
    const data = await QuizQuestions.findOne({
      where: { question_bank_id: req.params.id, quiz_id: req.params.quiz_id }
    })
    return res.status(200).json(data ? true : false)
  } catch (err) {
    res.status(500).json(err.message)
  }
}

exports.getQuizQuestions = async (req, res) => {
  try {
    const data = await QuizQuestions.findAll({
      where: { quiz_id: req.params.id }
    })
    return res.status(200).json(data)
  } catch (err) {
    res.status(500).json(err.message)
  }
}

exports.createQuiz = async (req, res) => {
  try {
    let {
      id,
      quiz_type_id,
      subject_id,
      courses,
      name,
      duration,
      total_questions,
      marks,
      language,
      prize,
      dates,
      quizQuestionAddedChoice,
      questionSelectionType,
      question_visibility
    } = req.body
    let lang = language.map((item) => item.value)
    let data
    if (id == undefined) {
      let key = crypto.randomBytes(64).toString('hex')
      if (key) {
        let findKey = await Quizzes.findOne({ where: { key } })
        while (findKey) {
          key = crypto.randomBytes(64).toString('hex')
          if (key) {
            findKey = await Quizzes.findOne({ where: { key } })
          }
        }
      }
      const quizPayload = {
        key,
        quiz_type_id,
        name,
        duration,
        question_visibility,
        total_questions,
        marks,
        language: lang.join(","),
        subject_id,
        question_choices: quizQuestionAddedChoice.value,
        question_added_to_quiz_type: JSON.stringify(questionSelectionType)
      }

      data = await Quizzes.create(quizPayload)
      courses = courses.flatMap(item => [
        {
          quiz_id: data.id,
          course_id: item.id
        }
      ])
      courses = await QuizCourses.bulkCreate(courses)

      // prize=await QuizPrizeDetails.create({quiz_id:data.id,...prize})
      dates = await QuizDates.create({ quiz_id: data.id, ...dates })
    } else {
      ;[, data] = await Quizzes.update(
        {
          quiz_type_id,
          name,
          duration,
          total_questions,
          marks,
          question_visibility,
          language: lang.join(","),
          subject_id,
          question_choices: quizQuestionAddedChoice.value,
          question_added_to_quiz_type: JSON.stringify(questionSelectionType)
        },
        {
          where: { id },
          returning: true,
          plain: true
        }
      )
      const coursesOld = await QuizCourses.findAll({ where: { quiz_id: id } })
      for (let item of courses) {
        let course = coursesOld.find(x => x.course_id == item.id)
        if (!course) {
          await QuizCourses.create({ quiz_id: id, course_id: item.id })
        }
      }
      for (let item of coursesOld) {
        let course = courses.find(x => x.id == item.course_id)
        if (!course) {
          await QuizCourses.destroy({ where: { id: item.id } })
        }
      }


      // [,prize]=await QuizPrizeDetails.update({quiz_id:id,...prize},{where:{id:prize.id},plain:true,returning:true})
      await QuizDates.update({ quiz_id: id, ...dates }, { where: { id: dates.id }, plain: true, returning: true })
    }


    if (quizQuestionAddedChoice.value === "Random") {
      const quizQuestionbank = await QuizQuestions.findAll()
      let questionUsed = (questionSelectionType)
      let questionUsedType = questionUsed.map((item) => item.value)
      let tempdata = []
      if (questionUsedType.includes("Any")) {
        tempdata.push(0)
      }
      else if (questionUsedType.includes("Not Used Yet (Fresh)")) {
        const questionbankIds = quizQuestionbank.map((item) => item.question_bank_id)
        for (let item of questionbankIds) {
          if (!tempdata.includes(Number(item)))
            tempdata.push(Number(item))
        }
      }
      else {
        let count = questionUsedType.map((item) => {
          let x = item.split(" ")[3]
          return Number(x)
        })
        let maxCount = Math.max(...count)
        let questionbankIds = quizQuestionbank.map((item) => item.question_bank_id)
        const map = new Map()
        for (let item of questionbankIds) {
          if (map.has(item)) {
            let temp = map.get(item)
            map.set(item, Number(temp) + 1)
          } else {
            map.set(item, 1)
          }
        }

        if (map.size > 0) {
          let mapKeys = map.keys()
          for (let item of mapKeys) {
            if (map.has(item)) {
              let countQuestionBankId = map.get(item)
              if (countQuestionBankId >= maxCount) {
                data.push(Number(item))
              }
            }
          }
        } else {
          tempdata.push(0)
        }
      }

      const data2 = await axios.post(`${QUESTION_BANK_URL}/getRandomQuestionForCreatingQuiz`, { subject_id, total_questions, excludeQuestionBankId: tempdata })
      if (data2.data.success) {
        await QuizQuestions.destroy({ where: { quiz_id: data.id } })
        const question_bank_id_data = data2.data.data.flatMap((item) => [{ quiz_id: data.id, question_bank_id: item }])
        await QuizQuestions.bulkCreate(question_bank_id_data)
      } else {
        return res.status(200).json({
          data: "You have limited number of verified questions"
        })
      }
    }
    return res.status(200).json({
      data: {
        ...data.toJSON(),
        courses,
        // prize,
        dates
      }
    })
  } catch (err) {
    console.log(err, 'err')
    res.status(500).send(err)
  }
}

exports.createQuizSetting = async (req, res) => {
  try {
    let { id, dates, prize } = req.body
    if (dates && dates.id == undefined && prize && prize.id == undefined) {
      dates = { ...dates, quiz_id: id }
      prize = { ...prize, quiz_id: id }
      dates = await QuizDates.create(dates)
      prize = await QuizPrizeDetails.create(prize)
    } else {
      ;[, dates] = await QuizDates.update(dates, {
        where: { id: dates.id },
        returning: true,
        plain: true
      })
        ;[, prize] = await QuizPrizeDetails.update(prize, {
          where: { id: prize.id },
          returning: true,
          plain: true
        })
    }

    return res.status(200).json({
      data: {
        dates,
        prize
      }
    })
  } catch (err) {
    console.log(err, 'err')
    res.status(500).send(err.message)
  }
}

exports.updateQuiz = async (req, res) => {
  try {
    const { id } = req.params
    const [count, quiz] = await Quizzes.update(req.body, {
      where: { id },
      returning: true,
      plain: true
    })
    return res.status(200).json({ message: 'Quiz successfully updated', quiz })
  } catch (err) {
    console.log(err, 'err')
    res.status(500).send(err)
  }
}

exports.createQuizDate = async (req, res) => {
  try {
    const quizDate = await QuizDates.create(req.body)
    return res
      .status(200)
      .json({ message: 'Dates successfully created', quizDate })
  } catch (err) {
    console.log(err, 'err')
    res.status(500).send(err)
  }
}

exports.updateQuizDate = async (req, res) => {
  try {
    const { id } = req.params
    const [count, quizDate] = await QuizDates.update(req.body, {
      where: { id },
      returning: true,
      plain: true
    })
    return res
      .status(200)
      .json({ message: 'Dates successfully updated', quizDate })
  } catch (err) {
    console.log(err, 'err')
    res.status(500).send(err)
  }
}

exports.createQuizDetail = async (req, res) => {
  try {
    const prizeDetail = await QuizPrizeDetails.create(req.body)
    return res
      .status(200)
      .json({ message: 'Quiz details successfully created', prizeDetail })
  } catch (err) {
    console.log(err, 'err')
    res.status(500).send(err)
  }
}

exports.updateQuizDetail = async (req, res) => {
  try {
    // const {
    //   quiz_id,
    //   total_spots,
    //   entry_fee,
    //   total_winner_percentage,
    //   prize_distribution_percentage,
    //   first_prize,
    //   prize_pool,
    //   entry_fee_algo } = req.body;
    const { id } = req.params
    // const prizeDetailPayload = {
    //   quiz_id,
    //   total_spots,
    //   entry_fee,
    //   entry_fee_algo,
    //   prize_pool,
    //   first_prize,
    //   total_winner_percentage,
    //   prize_distribution_percentage
    // }
    const [count, prizeDetail] = await QuizPrizeDetails.update(req.body, {
      where: { id },
      returning: true,
      plain: true
    })
    return res
      .status(200)
      .json({ message: 'Quiz details successfully updated', prizeDetail })
  } catch (err) {
    console.log(err, 'err')
    res.status(500).send(err)
  }
}

exports.createQuizCourse = async (req, res) => {
  try {
    const { subject_id, quiz_id, course_id } = req.body
    const courses = course_id.flatMap((item, index) => [
      {
        quiz_id,
        course_id: item
      }
    ])
    const updateQuiz = await Quizzes.update(
      {
        subject_id
      },
      { where: { id: quiz_id } }
    )
    const courseCreated = await QuizCourses.bulkCreate(courses)
    return res
      .status(200)
      .json({ message: 'Quiz courses successfully created', courseCreated })
  } catch (err) {
    console.log(err, 'err')
    res.status(500).send(err)
  }
}

exports.updateQuizCourse = async (req, res) => {
  try {
    const { subject_id, course_id } = req.body
    const { id } = req.params
    const courses = await QuizCourses.findAll({ where: { quiz_id: id } })
    let courses_ids = courses.flatMap(item => [item.course_id])
    for (let item of course_id) {
      let course = courses_ids.find(x => x == item)
      if (!course) {
        QuizCourses.create({ quiz_id: id, course_id: item })
      }
    }
    for (let item of courses_ids) {
      let course = course_id.find(x => x == item)
      if (!course) {
        QuizCourses.destroy({ where: { course_id: item } })
      }
    }
    const updateQuiz = await Quizzes.update(
      {
        subject_id
      },
      { where: { id } }
    )
    return res
      .status(200)
      .json({ message: 'Quiz courses successfully updated' })
  } catch (err) {
    console.log(err, 'err')
    res.status(500).send(err)
  }
}

exports.findById = async (req, res) => {
  try {
    const data = await Quizzes.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: QuizDates,
          required: false,
          as: 'dates'
        },
        // {
        //   model: QuizTypes,
        //   required: false
        // },
        {
          model: QuizCourses,
          required: false,
          as: 'courses'
        },
        {
          model: QuizPrizeDetails,
          required: false,
          as: 'prize'
        },
        {
          model: QuizQuestions,
          required: false,
          as: 'questions'
        }
      ]
    })
    res.status(200).json({ data: data.toJSON() })
  } catch (err) {
    res.status(204).send(err)
  }
}

exports.delete = async (req, res) => {
  await Quizzes.destroy({
    where: { id: req.params.id }
  })
    .then(data =>
      res.status(204).json({
        msg: 'Quizzes deleted.'
      })
    )
    .catch(err =>
      res.status(400).send({
        error: 'Error while deleting!!!'
      })
    )
}

exports.deleteQuestion = async (req, res) => {
  await QuizQuestions.destroy({
    where: { question_bank_id: req.params.id, quiz_id: req.params.quiz_id }
  })
    .then(data =>
      res.status(200).json({
        msg: 'Quizzes deleted.'
      })
    )
    .catch(err => res.status(400).send(err.message))
}

exports.addQuestion = async (req, res) => {
  const { quiz_id, question_bank_id } = req.body
  const quizQuestionsAll = await QuizQuestions.findAll({ where: { quiz_id } })
  const quiz = await Quizzes.findOne({ where: { id: quiz_id } })
  if (quiz && quiz.total_questions == quizQuestionsAll.length) {
    return res.status(200).json({
      success: false,
      message: "Question Limit Exceeded"
    })
  }

  const data = await QuizQuestions.findOne({ where: { quiz_id, question_bank_id } })
  if (!data) {
    await QuizQuestions.create(req.body)
      .then(data =>
        res.status(200).json({
          success: true,
          data
        })
      )
      .catch(err => res.status(500).send(err.message))
  } else {
    res.status(200).json({
      success: true,
      data
    })
  }
}


exports.getQuizTypeById = async (req, res) => {
  try {
    const { quizTypeId } = req.params
    const data = await QuizTypes.findOne({ where: { id: quizTypeId } })
    return res.status(200).json({
      success: true,
      data
    })
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.findQuizDetail = async (req, res) => {
  try {
    const { key, user_id } = req.params
    const findQuiz = await Quizzes.findOne({
      where: {
        key
      }
    })
    const quizResultAnalysis = await QuizResultAnalysis.findOne({
      where: {
        user_id, quiz_id: findQuiz?.id, quiz_status: {
          [Op.or]: ["initialized", "running"]
        }
      }
    })

    const quiz = await Quizzes.findOne({
      where: {
        key
      },
      attributes: ["id", "key", "language", "marks", "name", "duration", "total_questions", "question_visibility"],
      include: [
        {
          model: QuizQuestions,
          required: false,
          as: 'questions',
          attributes: ["id", "quiz_id", "question_bank_id"]
        },
        {
          model: QuizResults,
          required: false,
          where: {
            user_id,
            result_analysis_id: quizResultAnalysis?.id
          },
          as: 'results',
          attributes: ["id", "quiz_id", "user_id", "question_id", "user_ans_option_id"]
        },
      ]
    })

    return res.status(200).json({
      success: true,
      quiz,
      time_taken: quizResultAnalysis?.time_taken ? quizResultAnalysis?.time_taken : 0
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false
    })
  }
}


exports.getQuizDetailsAccordingToSubjectId = async (req, res) => {
  try {
    const { quiz_id } = req.params
    const quiz = await Quizzes.findOne({
      where: { id: quiz_id }, include: [
        {
          model: QuizDates,
          required: false,
          as: 'dates'
        },
        {
          model: QuizCourses,
          required: false,
          as: 'courses'
        },
        {
          model: QuizPrizeDetails,
          required: false,
          as: 'prize'
        },
        {
          model: QuizQuestions,
          required: false,
          as: 'questions'
        }
      ]
    })
    const quizQuestionbank = await QuizQuestions.findAll()
    let questionUsed = JSON.parse(quiz.question_added_to_quiz_type)
    let questionUsedType = questionUsed.map((item) => item.value)
    let data = [];
    if (questionUsedType.includes("Any")) {
      data.push(0)
    }
    else if (questionUsedType.includes("Not Used Yet (Fresh)")) {
      const questionbankIds = quizQuestionbank.map((item) => item.question_bank_id)
      for (let item of questionbankIds) {
        if (!data.includes(Number(item)))
          data.push(Number(item))
      }
    }
    else {
      let count = questionUsedType.map((item) => {
        let x = item.split(" ")[3]
        return Number(x)
      })
      let maxCount = Math.max(...count)
      let questionbankIds = quizQuestionbank.map((item) => item.question_bank_id)
      const map = new Map()
      for (let item of questionbankIds) {
        if (map.has(item)) {
          let temp = map.get(item)
          map.set(item, Number(temp) + 1)
        } else {
          map.set(item, 1)
        }
      }

      if (map.size > 0) {
        let mapKeys = map.keys()
        for (let item of mapKeys) {
          if (map.has(item)) {
            let countQuestionBankId = map.get(item)
            if (countQuestionBankId >= maxCount) {
              data.push(Number(item))
            }
          }
        }
      } else {
        data.push(0)
      }
    }
    return res.status(200).json({
      success: true,
      quiz,
      questionBankIdToExclude: data
    })
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}


exports.submittingUserAnswer = async (req, res) => {
  try {
    const { quiz_id, question_id, option_id, user_id, total_duration, time_taken, question_bank_id, total_questions } = req.body

    const data = await QuizResultAnalysis.findOne({
      where: {
        user_id, quiz_id, quiz_status: {
          [Op.or]: ["initialized", "running"]
        }
      }
    })
    if (!data) {
      return res.status(200).json({
        success: false,
        message: "Unauthorized Access"
      })
    }
    await QuizResultAnalysis.update({ total_questions, time_taken, quiz_status: "running" }, { where: { id: data?.id } })
    const findResult = await QuizResults.findOne({
      where: {
        user_id,
        quiz_id,
        question_id,
        result_analysis_id: data?.id
      }
    })
    if (findResult) {
      await QuizResults.update({
        user_ans_option_id: option_id,
      }, {
        where: {
          id: findResult.id
        }
      })
    } else {
      await QuizResults.create({
        user_id,
        quiz_id,
        question_id,
        user_ans_option_id: option_id,
        result_analysis_id: data?.id
      })
    }

    return res.status(200).json({
      success: true,
      message: "Answer Saved Successfully"
    })
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.getQuizResultWithToQuizId = async (req, res) => {
  try {
    const { quiz_id } = req.params
    const data = await QuizResults.findAll({ where: { quiz_id } })
    let userIdsArr = data.map((item) => item.user_id)
    const set = new Set(userIdsArr)
    userIdsArr = []
    set.forEach(function (value) {
      userIdsArr.push(value)
    })

    const userList = await axios.post(`${USER_URL}/getAllRegisteredUserThroughId`, { ids: userIdsArr })
    let userLists = userList.data.data

    let resultArr = []
    userIdsArr.map((item) => {
      let result = data.filter((item2) => item2.user_id == item)
      let temp = {
        user_id: item,
        result
      }
      resultArr.push(temp)
    })
    let resultDeclaredArray = []

    resultArr.map((item) => {
      let total_points = item.result.map((item) => item.points).reduce((acc, curr) => acc + curr, 0)
      let total_time_taken = item.result.map((item) => item.time_taken_in_miliseconds).reduce((acc, curr) => acc + curr, 0)
      let total_questions_attempted = item.result.length
      let total_correct_answer = item.result.filter((item) => item.correct == 1).length
      let total_incorrect_answer = item.result.filter((item) => item.correct == 0).length
      let userDetail = userLists.find((itemName) => itemName.id == item.user_id)
      resultDeclaredArray.push({
        user_id: item.user_id,
        total_points,
        total_time_taken,
        total_correct_answer,
        total_incorrect_answer,
        total_questions_attempted,
        userDetail
      })
    })
    let finalizingRank = resultDeclaredArray.slice().sort((a, b) => {
      if (a.total_points > b.total_points) {
        return -1
      } else if (a.total_points == b.total_points) {
        if (a.total_time_taken < b.total_time_taken) {
          return -1
        } else {
          return 0
        }
      }
    })
    let newData = finalizingRank.flatMap((item, i) => [{ ...item, rank: i + 1 }])


    return res.status(200).json({
      success: true,
      data: newData
    })

  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.userRegistration = async (req, res) => {
  try {
    const { id, user_id, transaction_id, payment_status, amount_paid } = req.body

    // 1. Fetch Quiz details and check entry fee
    const quiz = await Quizzes.findOne({
      where: { id },
      include: [
        {
          model: QuizPrizeDetails,
          required: false,
          as: 'prize'
        }
      ]
    })

    if (!quiz) {
      return res.status(200).json({
        success: false,
        message: "Quiz not found!"
      })
    }

    // Check if already registered
    const existingRegistration = await UserRegistration.findOne({
      where: { quiz_id: id, user_id }
    })
    if (existingRegistration) {
      return res.status(200).json({
        success: false,
        message: "You are already registered for this quiz!"
      })
    }

    // 2. Validate payment if it's a paid quiz
    const entryFee = quiz.prize ? parseFloat(quiz.prize.entry_fee) : 0
    if (entryFee > 0) {
      if (!transaction_id || payment_status !== "SUCCESS" || !amount_paid) {
        return res.status(200).json({
          success: false,
          message: "Payment validation failed. Transaction details are required for paid quizzes."
        })
      }
      if (parseFloat(amount_paid) < entryFee) {
        return res.status(200).json({
          success: false,
          message: `Incorrect payment amount. Entry fee is ${entryFee}.`
        })
      }
    }

    // 3. Register user
    const data = await UserRegistration.create({
      quiz_id: id,
      user_id,
      transaction_id: transaction_id || null,
      payment_status: payment_status || null,
      amount_paid: amount_paid || null
    })

    if (data) {
      return res.status(200).json({
        success: true,
        message: "Registration Successful",
        data
      })
    } else {
      return res.status(200).json({
        success: false,
        message: "Please try again!"
      })
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}


exports.getAllRegisteredusers = async (req, res) => {
  try {
    const { id } = req.params
    const quiz = await Quizzes.findOne({
      where: { id },
      include: [
        {
          model: UserRegistration,
          required: false,
          as: "users"
        }
      ]
    })
    const userIds = quiz.users.map((item) => item.user_id)

    const { data } = await axios.post(`${USER_URL}/getAllRegisteredUserThroughId`, { ids: userIds })
    if (data.success) {
      return res.status(200).json({
        success: true,
        data: data.data
      })
    } else {
      return res.status(200).json({
        success: false,
        message: "Please try again!"
      })
    }
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}


// notifications controiller

exports.createNotifications = async (req, res) => {
  try {
    const data = await QuizNotifications.create(req.body)
    if (data)
      return res.status(201).json({
        success: true,
        message: "Notification Created Successfully",
        data
      })
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.updateNotifications = async (req, res) => {
  try {
    await QuizNotifications.update(req.body, { where: { id: req.params.id } })
    return res.status(201).json({
      success: true,
      message: "Notification Updated Successfully",
    })
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.getAllNotifications = async (req, res) => {
  try {
    let { page, items_per_page, search } = req.query
    let data
    page = parseInt(page)
    items_per_page = parseInt(items_per_page)
    const offset = (page - 1) * items_per_page
    const limit = items_per_page
    if (search) {
      data = await QuizNotifications.findAndCountAll({
        distinct: true,
        offset,
        limit,
        where: {
          name: { [Op.like]: `%${search}%` }
          // level: { [Op.like]: `%${search}%` }
        },
        order: [['id', 'DESC']],
        // include: [
        //   {
        //     model: Quizzes,
        //     required: false,
        //     // as: 'quizzes'
        //   }
        // ]
      })
    } else {
      data = await QuizNotifications.findAndCountAll({
        distinct: true,
        offset,
        limit,
        order: [['id', 'DESC']],
        // include: [
        //   {
        //     model: Quizzes,
        //     required: false,
        //     // as: 'quizzes'
        //   },
        // ]


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
    return res.status(500).json({
      success: false
    })
  }
}

exports.updateNotificationStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    await QuizNotifications.update({ status }, { where: { id } })
    return res.status(200).json({
      success: true,
      message: "Status Updated Successfully"
    })
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}


exports.deleteNotifications = async (req, res) => {
  try {
    const { id } = req.params
    await QuizNotifications.destroy({ where: { id } })
    return res.status(200).json({
      success: true,
      message: "Notifications Deleted Successfully"
    })
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.getNotificationById = async (req, res) => {
  try {
    const { id } = req.params
    let data = await QuizNotifications.findOne({ where: { id } })
    return res.status(200).json({
      success: true,
      data
    })
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}




// Passage Controller

exports.createPassage = async (req, res) => {
  try {
    const { id, passage_english, otherPassage } = req.body

    if (id) {
      await PassageBank.update({ passage_english }, { where: { id } })
      const findOnePassage = await Passage.findOne({ where: { passage_bank_id: id, language: otherPassage?.language } })
      if (findOnePassage) {
        await Passage.update({ passage: otherPassage?.passage }, {
          where: {
            id: findOnePassage?.id,
            passage_bank_id: findOnePassage?.passage_bank_id
          }
        })
      } else {
        if (otherPassage?.language?.trim() != "" && otherPassage?.passage?.trim() != "") {
          await Passage.create({ language: otherPassage?.language, passage: otherPassage?.passage, passage_bank_id: id })
        }
      }

      const findPassage = await PassageBank.findOne({
        where: { id },
        include: [
          {
            model: Passage,
            as: "passages",
            required: false
          }
        ]
      })
      return res.status(201).json({
        success: true,
        message: "Passage Updated Successfully",
        data: findPassage
      })

    } else {
      const data = await PassageBank.create({ passage_english })
      if (data) {
        if (otherPassage?.language?.trim() != "" && otherPassage?.passage?.trim() != "") {
          const data2 = await Passage.create({ language: otherPassage?.language, passage: otherPassage?.passage, passage_bank_id: data?.id })
          if (data2) {
            const findPassage = await PassageBank.findOne({
              where: { id: data?.id },
              include: [
                {
                  model: Passage,
                  as: "passages",
                  required: false,
                }
              ]
            })
            return res.status(201).json({
              success: true,
              message: "Passage Created Successfully",
              data: findPassage
            })
          }
        } else {
          const findPassage = await PassageBank.findOne({
            where: { id: data?.id },
            include: [
              {
                model: Passage,
                as: "passages",
                required: false,
              }
            ]
          })
          return res.status(201).json({
            success: true,
            message: "Passage Created Successfully",
            data: findPassage
          })
        }
      } else {
        return res.status(200).json({
          success: false
        })
      }
    }

  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.updatePassage = async (req, res) => {
  try {
    const { id, passage_english, otherPassage } = req.body
    await PassageBank.update({ passage_english }, { where: { id } })
    otherPassage?.map(async (item) => {
      const findOnePassage = await Passage.findOne({ where: { id: item?.id, passage_bank_id: id, language: item?.language } })
      if (findOnePassage) {
        await Passage.update({ passage: item?.passage }, {
          where: {
            id: findOnePassage?.id,
            passage_bank_id: findOnePassage?.passage_bank_id
          }
        })
      } else {
        await Passage.create({ language: item?.language, passage: item?.passage, passage_bank_id: id })
      }
    })
    return res.status(201).json({
      success: true,
      message: "Passage Created Successfully",
      data
    })
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.getAllPassage = async (req, res) => {
  try {
    let { page, items_per_page, search } = req.query
    let data
    page = parseInt(page)
    items_per_page = parseInt(items_per_page)
    const offset = (page - 1) * items_per_page
    const limit = items_per_page
    if (search) {
      data = await PassageBank.findAndCountAll({
        distinct: true,
        offset,
        limit,
        where: {
          name: { [Op.like]: `%${search}%` }
          // level: { [Op.like]: `%${search}%` }
        },
        order: [['id', 'DESC']],
        include: [
          {
            model: Passage,
            required: false,
            as: 'passages'
          }
        ]
      })
    } else {
      data = await PassageBank.findAndCountAll({
        distinct: true,
        offset,
        limit,
        order: [['id', 'DESC']],
        include: [
          {
            model: Passage,
            required: false,
            as: 'passages'
          },
        ]


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
    return res.status(500).json({
      success: false
    })
  }
}

exports.updatePassageStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    await Passage.update({ status }, { where: { id } })
    return res.status(200).json({
      success: true,
      message: "Status Updated Successfully"
    })
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}


exports.deletePassage = async (req, res) => {
  try {
    const { id } = req.params
    await Passage.destroy({ where: { passage_bank_id: id } })
    await PassageBank.destroy({ where: { id } })
    return res.status(200).json({
      success: true,
      message: "Passage Deleted Successfully"
    })
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.getPassageById = async (req, res) => {
  try {
    const { id } = req.params
    let data = await PassageBank.findOne({
      where: { id },
      include: [
        {
          model: Passage,
          required: false,
          as: 'passages'
        }
      ]
    })
    return res.status(200).json({
      success: true,
      data
    })
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}


exports.getQuizDetailsUserPanel = async (req, res) => {
  try {
    let { page, items_per_page, search, category, type } = req.query
    let data
    page = parseInt(page) || 1
    items_per_page = parseInt(items_per_page) || 10
    const offset = (page - 1) * items_per_page
    const limit = items_per_page
    let getIds = []

    if (type == "Quizzes") {
      const findQuizType = await QuizTypes.findAll({
        where: {
          quiz_type: {
            [Op.in]: ["Free Quiz", "Premium Quiz"]
          }
        }
      })
      getIds = findQuizType.map((item) => item?.id)

    } else {
      const findQuizType = await QuizTypes.findAll({
        where: {
          quiz_type: "Live Quiz"
        }
      })
      getIds = findQuizType.map((item) => item?.id)

    }
    if (getIds) {
      if (search) {
        data = await Quizzes.findAndCountAll({
          distinct: true,
          offset,
          limit,
          where: {
            subject_id: category,
            status: 1,
            quiz_type_id: getIds
          },
          attributes: ["id", "key", "subject_id", "quiz_type_id", "name", "duration", "total_questions", "marks", "language", "createdAt"],
          order: [['id', 'DESC']],
          include: [
            {
              model: QuizDates,
              required: false,
              as: 'dates',
              attributes: ["id", "quiz_id", "start_date", "reg_open_date", "result_publish_date"]
            },
            {
              model: QuizTypes,
              required: false,
              attributes: ["id", "quiz_type"]
            },
            {
              model: QuizCourses,
              required: false,
              as: 'courses',
              attributes: ["id", "quiz_id", "course_id"]
            },
            {
              model: QuizPrizeDetails,
              required: false,
              as: 'prize',
            },
            // {
            //   model: QuizQuestions,
            //   required: false,
            //   as: 'questions',
            //   attributes:["id","quiz_id","question_bank_id"]
            // }
          ]
        })
      }
      else if (category && category != "undefined") {
        data = await Quizzes.findAndCountAll({
          distinct: true,
          offset,
          limit,
          where: {
            subject_id: category,
            status: 1,
            quiz_type_id: getIds
          },
          attributes: ["id", "key", "subject_id", "quiz_type_id", "name", "duration", "total_questions", "marks", "language", "createdAt"],
          order: [['id', 'DESC']],
          include: [
            {
              model: QuizDates,
              required: false,
              as: 'dates',
              attributes: ["id", "quiz_id", "start_date", "reg_open_date", "result_publish_date"]
            },
            {
              model: QuizTypes,
              required: false,
              attributes: ["id", "quiz_type"]
            },
            {
              model: QuizCourses,
              required: false,
              as: 'courses',
              attributes: ["id", "quiz_id", "course_id"]
            },
            {
              model: QuizPrizeDetails,
              required: false,
              as: 'prize',
            },
            // {
            //   model: QuizQuestions,
            //   required: false,
            //   as: 'questions',
            //   attributes:["id","quiz_id","question_bank_id"]
            // }
          ]
        })
      }
      else {
        data = await Quizzes.findAndCountAll({
          distinct: true,
          offset,
          limit,
          attributes: ["id", "key", "subject_id", "quiz_type_id", "name", "duration", "total_questions", "marks", "language", "createdAt"],
          order: [['id', 'DESC']],
          where: {
            status: 1,
            quiz_type_id: getIds
          },
          include: [
            {
              model: QuizDates,
              required: false,
              as: 'dates',
              attributes: ["id", "quiz_id", "start_date", "reg_open_date", "result_publish_date"]
            },
            {
              model: QuizTypes,
              required: false,
              attributes: ["id", "quiz_type"]
            },
            {
              model: QuizCourses,
              required: false,
              as: 'courses',
              attributes: ["id", "quiz_id", "course_id"]
            },

            // console.log("heloooooooooooooooooooooooooo",data)
            {
              model: QuizPrizeDetails,
              required: false,
              as: 'prize',
            },
            // {
            //   model: QuizQuestions,
            //   required: false,
            //   as: 'questions',
            //   attributes:["id","quiz_id","question_bank_id"]
            // }
          ]
        })
      }
    } else {
      data = null
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
    return res.status(500).json(err.message)
  }
}


exports.getLiveQuizDetailsUserPanel = async (req, res) => {
  try {
    let { page, items_per_page, search, category, type, status } = req.query
    let data
    page = parseInt(page) || 1
    items_per_page = parseInt(items_per_page) || 10
    const offset = (page - 1) * items_per_page
    const limit = items_per_page
    let getIds = []
    const findQuizType = await QuizTypes.findAll({
      where: {
        quiz_type: "Live Quiz"
      }
    })
    getIds = findQuizType.map((item) => item?.id)



    // let getQuizzesDetail=
    if (getIds) {
      if (search) {
        data = await Quizzes.findAndCountAll({
          distinct: true,
          offset,
          limit,
          where: {
            subject_id: category,
            status: 1,
            quiz_type_id: getIds
          },
          attributes: ["id", "key", "subject_id", "quiz_type_id", "name", "duration", "total_questions", "marks", "language", "createdAt"],
          order: [['id', 'DESC']],
          include: [
            {
              model: QuizDates,
              required: false,
              as: 'dates',
              attributes: ["id", "quiz_id", "start_date", "reg_open_date", "result_publish_date"]
            },
            {
              model: QuizTypes,
              required: false,
              attributes: ["id", "quiz_type"]
            },
            {
              model: QuizCourses,
              required: false,
              as: 'courses',
              attributes: ["id", "quiz_id", "course_id"]
            },
            {
              model: QuizPrizeDetails,
              required: false,
              as: 'prize',
            },
            // {
            //   model: QuizQuestions,
            //   required: false,
            //   as: 'questions',
            //   attributes:["id","quiz_id","question_bank_id"]
            // }
          ]
        })
      }
      else if (category && category != "undefined") {
        data = await Quizzes.findAndCountAll({
          distinct: true,
          offset,
          limit,
          where: {
            subject_id: category,
            status: 1,
            quiz_type_id: getIds
          },
          attributes: ["id", "key", "subject_id", "quiz_type_id", "name", "duration", "total_questions", "marks", "language", "createdAt"],
          order: [['id', 'DESC']],
          include: [
            {
              model: QuizDates,
              required: false,
              as: 'dates',
              attributes: ["id", "quiz_id", "start_date", "reg_open_date", "result_publish_date"]
            },
            {
              model: QuizTypes,
              required: false,
              attributes: ["id", "quiz_type"]
            },
            {
              model: QuizCourses,
              required: false,
              as: 'courses',
              attributes: ["id", "quiz_id", "course_id"]
            },
            {
              model: QuizPrizeDetails,
              required: false,
              as: 'prize',
            },
            // {
            //   model: QuizQuestions,
            //   required: false,
            //   as: 'questions',
            //   attributes:["id","quiz_id","question_bank_id"]
            // }
          ]
        })
      }
      else {
        data = await Quizzes.findAndCountAll({
          distinct: true,
          offset,
          limit,
          attributes: ["id", "key", "subject_id", "quiz_type_id", "name", "duration", "total_questions", "marks", "language", "createdAt"],
          order: [['id', 'DESC']],
          where: {
            status: 1,
            quiz_type_id: getIds
          },
          include: [
            {
              model: QuizDates,
              required: false,
              as: 'dates',
              attributes: ["id", "quiz_id", "start_date", "reg_open_date", "result_publish_date"]
            },
            {
              model: QuizTypes,
              required: false,
              attributes: ["id", "quiz_type"]
            },
            {
              model: QuizCourses,
              required: false,
              as: 'courses',
              attributes: ["id", "quiz_id", "course_id"]
            },

            // console.log("heloooooooooooooooooooooooooo",data)
            {
              model: QuizPrizeDetails,
              required: false,
              as: 'prize',
            },
            // {
            //   model: QuizQuestions,
            //   required: false,
            //   as: 'questions',
            //   attributes:["id","quiz_id","question_bank_id"]
            // }
          ]
        })
      }
    } else {
      data = null
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
    return res.status(500).json(err.message)
  }
}

exports.submitQuizResult = async (req, res) => {
  try {

    const { user_id, quiz_id } = req.body
    const findResultAnalysis = await QuizResultAnalysis.findOne({
      where: {
        user_id, quiz_id, quiz_status: "running"
      }
    })

    if (findResultAnalysis) {
      const data = await QuizResults.findOne({
        where: {
          user_id, quiz_id, result_analysis_id: findResultAnalysis?.id
        }
      })
      if (!data) {
        return res.status(200).json({
          success: false,
          message: "At least one answer is required"
        })
      } else {
        const data = await QuizResultAnalysis.update({ quiz_status: "completed" }, { where: { id: findResultAnalysis?.id, user_id, quiz_id } })
        if (data) {
          return res.status(200).json({
            success: true,
            message: "Quiz Submitted Successfully"
          })
        } else {
          return res.status(200).json({
            success: false,
            message: "Something went wrong.Plaese try again"
          })
        }
      }
    } else {
      return res.status(200).json({
        success: false,
        message: "At least one answer is required"
      })
    }
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.getQuizResultUsingUserIdAndQuizKey = async (req, res) => {
  try {
    const { user_id, quiz_key, offset_data = 0 } = req.body
    const userId = user_id

    const findQuiz = await Quizzes.findOne({
      where: { key: quiz_key },
      include: [
        {
          model: QuizQuestions,
          as: "questions",
          required: false
        },
        {
          model: QuizPrizeDetails,
          as: "prize",
          required: false
        }
      ]
    })
    if (!findQuiz) {
      return res.status(200).json({
        success: false,
        message: "Quiz not found"
      })
    }

    const findCurrentResult = await QuizResultAnalysis.findOne({
      where: {
        user_id: userId,
        quiz_id: findQuiz.id,
        quiz_status: "completed"
      },
      limit: 1,
      offset: parseInt(offset_data, 10) || 0,
      order: [["id", "DESC"]]
    })

    const findAllAttempt = await QuizResultAnalysis.findAll({
      where: {
        user_id: userId,
        quiz_id: findQuiz.id,
        quiz_status: "completed"
      },
      order: [["id", "ASC"]],
      attributes: ["id", "user_id", "quiz_id", "quiz_status"]
    })

    if (!findCurrentResult) {
      return res.status(200).json({
        success: false,
        message: "No completed attempt found. Submit the quiz first."
      })
    }

    const getAllQuestionBankId = (findQuiz.questions || [])
      .map((item) => item?.question_bank_id)
      .filter((id) => id != null && id !== "")

    if (getAllQuestionBankId.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No questions linked to this quiz"
      })
    }

    let questionResponse
    try {
      questionResponse = await axios.post(
        `${QUESTION_URL}/getAllQuestionWithCorrectOption`,
        { data: getAllQuestionBankId },
        { timeout: 30000 }
      )
    } catch (axiosErr) {
      console.log("getQuizResult question service error:", axiosErr.message)
      return res.status(200).json({
        success: false,
        message: "Question service unavailable. Is port 6002 running?"
      })
    }

    const questionDetails = questionResponse?.data?.data
    if (!questionDetails || !Array.isArray(questionDetails) || questionDetails.length === 0) {
      return res.status(200).json({
        success: false,
        message: "Answer key not available (check question marks on banks)"
      })
    }

    const resultAnalysisData = await QuizResultAnalysis.findAll({
      where: {
        quiz_id: findQuiz.id,
        quiz_status: "completed"
      },
      include: [
        {
          model: QuizResults,
          as: "resultAnalysis",
          required: false
        }
      ]
    })

    const resultArr = []

    for (const analysis of resultAnalysisData || []) {
      if (!analysis?.resultAnalysis?.length) continue

      let total_points = 0
      let total_correct = 0
      let total_incorrect = 0
      const total_time_taken = analysis.time_taken || 0
      const result_analysis_id = analysis.id
      let user_id_detail = analysis.user_id

      for (const item2 of analysis.resultAnalysis) {
        user_id_detail = item2.user_id
        const questionId = item2.question_id
        const userOptionId = item2.user_ans_option_id

        for (const qBank of questionDetails) {
          const marks = qBank.marks || qBank.dataValues?.marks
          const correctMarks = marks?.marks ?? marks?.dataValues?.marks ?? 0
          const negativeMarks = marks?.negative_marks ?? marks?.dataValues?.negative_marks ?? 0

          for (const ques of qBank.questions || []) {
            const options = ques.options || ques.dataValues?.options || []
            const findCorrectOption = options.find((opt) => opt.right_option == 1)
            const quesId = ques.id ?? ques.dataValues?.id

            if (quesId == questionId) {
              if (findCorrectOption?.id == userOptionId) {
                total_points += Number(correctMarks)
                total_correct += 1
              } else {
                total_points -= Number(negativeMarks)
                total_incorrect += 1
              }
            }
          }
        }
      }

      resultArr.push({
        user_id: user_id_detail,
        total_correct,
        total_incorrect,
        total_points,
        total_time_taken,
        result_analysis_id
      })
    }

    resultArr.sort((a, b) => {
      if (b.total_points !== a.total_points) {
        return b.total_points - a.total_points
      }
      return (a.total_time_taken || 0) - (b.total_time_taken || 0)
    })

    const newData = resultArr.map((item, i) => ({ ...item, rank: i + 1 }))
    const filterData = newData.find(
      (item) => item.result_analysis_id == findCurrentResult.id
    )

    if (!filterData) {
      return res.status(200).json({
        success: false,
        message: "Could not calculate your score"
      })
    }

    // Dynamic Prize Won Calculation based on Rank and Distribution Percentage
    let prize_won = "0.00";
    if (findQuiz.prize) {
      const { total_winner_percentage, prize_pool, first_prize } = findQuiz.prize;
      const rank = filterData.rank;
      const totalUsers = resultArr.length;

      const winnerCount = Math.ceil(totalUsers * (parseFloat(total_winner_percentage || 0) / 100));

      if (rank <= winnerCount && totalUsers > 0) {
        if (rank === 1) {
          prize_won = parseFloat(first_prize || 0).toFixed(2);
        } else {
          const poolValue = parseFloat(prize_pool || 0);
          const firstPrizeValue = parseFloat(first_prize || 0);
          const remainingPool = poolValue - firstPrizeValue;
          const remainingWinners = winnerCount - 1;

          if (remainingWinners > 0 && remainingPool > 0) {
            let sumWeights = 0;
            for (let r = 2; r <= winnerCount; r++) {
              sumWeights += (winnerCount - r + 1);
            }
            const rankWeight = winnerCount - rank + 1;
            const share = remainingPool * (rankWeight / sumWeights);
            prize_won = share.toFixed(2);
          } else {
            prize_won = "0.00";
          }
        }
      }
    }
    filterData.prize_won = prize_won;

    return res.status(200).json({
      success: true,
      message: "Result Declared Successfully",
      total_user: newData.length,
      data: filterData,
      allAttempt: findAllAttempt
    })
  } catch (err) {
    console.log("getQuizResult error:", err)
    return res.status(500).json({
      success: false,
      message: err.message || "Server error"
    })
  }
}

exports.submitQuizReview = async (req, res) => {
  try {
    const { quiz_key, rate, user_id, review } = req.body
    const findQuiz = await Quizzes.findOne({
      where: {
        key: quiz_key
      }
    })
    if (!findQuiz) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access"
      })
    } else {
      const data = await QuizReview.create({ user_id, quiz_id: findQuiz?.id, rate, review })
      if (data) {
        return res.status(200).json({
          success: true,
          message: "Review Submitted Successfully"
        })
      } else {
        return res.status(401).json({
          success: false,
          message: "Unauthorized Access"
        })
      }
    }
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}
exports.initializedQuizStatus = async (req, res) => {
  try {
    const { user_id, quiz_id } = req.body

    // Verify registration first
    const registered = await UserRegistration.findOne({
      where: { user_id, quiz_id }
    })
    if (!registered) {
      return res.status(200).json({
        success: false,
        message: "You must register for this quiz before starting!"
      })
    }

    const findQuiz = await QuizResultAnalysis.findOne({
      where: {
        user_id, quiz_id, quiz_status: {
          [Op.or]: ["initialized", "running"]
        }
      }
    })
    if (findQuiz) {
      return res.status(200).json({
        success: true,
        message: "Quiz Started Successfully"
      })
    } else {
      const findQuizDetail = await QuizQuestions.count({
        where: {
          quiz_id
        }
      })
      if (!findQuizDetail) {
        return res.status(200).json({
          success: false,
          message: "Quiz is inactive now.Please contact with support."
        })
      } else {
        const createResultAnalysis = await QuizResultAnalysis.create({ user_id, quiz_id, quiz_status: "initialized" })
        if (createResultAnalysis) {
          return res.status(200).json({
            success: true,
            message: "Quiz Started Successfully"
          })
        } else {
          return res.status(200).json({
            success: false,
            message: "Please try again."
          })
        }
      }

    }
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.reAttemptQuizStatus = async (req, res) => {
  try {
    const { user_id, quiz_key } = req.body
    const findQuizDetail = await Quizzes.findOne({
      where: { key: quiz_key }
    })
    if (!findQuizDetail) {
      return res.status(200).json({
        success: false,
        message: "Please try again."
      })
    } else {
      // Verify registration first
      const registered = await UserRegistration.findOne({
        where: { user_id, quiz_id: findQuizDetail.id }
      })
      if (!registered) {
        return res.status(200).json({
          success: false,
          message: "You must register for this quiz before starting!"
        })
      }

      const findQuiz = await QuizResultAnalysis.findOne({
        where: {
          user_id, quiz_id: findQuizDetail?.id, quiz_status: {
            [Op.or]: ["initialized", "running"]
          }
        }
      })
      if (findQuiz) {
        return res.status(200).json({
          success: true,
          message: "Quiz Started Successfully"
        })
      } else {
        const createResultAnalysis = await QuizResultAnalysis.create({ user_id, quiz_id: findQuizDetail?.id, quiz_status: "initialized" })
        if (createResultAnalysis) {
          return res.status(200).json({
            success: true,
            message: "Quiz Started Successfully"
          })
        } else {
          return res.status(200).json({
            success: false,
            message: "Please try again."
          })
        }
      }
    }
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.getAllReview = async (req, res) => {
  try {
    const { key } = req.params
    let ids = []
    const findQuiz = await Quizzes.findOne({ where: { key } })
    if (!findQuiz) {
      return res.status(200).json({
        success: false,
        message: "Unauthorized Access"
      })
    } else {
      const allReview = await QuizReview.findAll({
        where: {
          quiz_id: findQuiz?.id
        },
        attributes: ["id", "rate", "review", "user_id", "createdAt", "quiz_id"]
      })


      let obj = {
        five: allReview?.filter((item) => item?.dataValues?.rate == 5)?.length,
        four: allReview?.filter((item) => item?.dataValues?.rate == 4)?.length,
        three: allReview?.filter((item) => item?.dataValues?.rate == 3)?.length,
        two: allReview?.filter((item) => item?.dataValues?.rate == 2)?.length,
        one: allReview?.filter((item) => item?.dataValues?.rate == 1)?.length
      }



      let user_ids = allReview?.map((item) => item?.user_id)
      const set = new Set(user_ids)
      user_ids = []
      set.forEach(function (value) {
        user_ids.push(value)
      })
      const data = await axios.post(`${USER_URL}/getAllUserUsingId`, { data: user_ids })
      setTimeout(() => {
        if (data?.data?.success) {
          return res.status(200).json({
            success: true,
            data: data?.data?.user,
            review: allReview,
            obj
          })
        } else {
          return res.status(200).json({
            success: false,
            message: "No Review Available"
          })
        }
      }, 2000)
    }

    // 
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.editQuizReview = async (req, res) => {
  try {
    const { quiz_key, rate, user_id, review } = req.body
    const { id } = req.params
    const findQuiz = await Quizzes.findOne({
      where: {
        key: quiz_key
      }
    })
    if (!findQuiz) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access"
      })
    } else {
      await QuizReview.update({ rate, review }, { where: { id, user_id, quiz_id } })
      return res.status(200).json({
        success: true,
        message: "Review Updated Successfully"
      })
    }
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.deleteQuizReview = async (req, res) => {
  try {
    const { id } = req.params
    await QuizReview.destroy({ where: { id } })
    return res.status(200).json({
      success: true,
      message: "Review Deleted Successfully"
    })
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.getQuizReportStatus = async (req, res) => {
  try {
    const { user_id, quiz_ids } = req.body
    if (user_id && quiz_ids?.length > 0) {
      const data = await QuizResultAnalysis.findAll({
        attributes: [
          'user_id',
          'quiz_id',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'total_rows'],
        ],
        where: {
          user_id, quiz_id: quiz_ids,
          quiz_status: "completed"
        },
        group: ['user_id', 'quiz_id']
      })
      if (data?.length > 0) {
        return res.status(200).json({
          success: true,
          data
        })
      } else {
        return res.status(200).json({
          success: false
        })
      }
    }
    else {
      return res.status(200).json({
        success: false
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false
    })
  }
}


exports.updateTimeForQuizzes = async (req, res) => {
  try {
    const { quiz_id, user_id, time_taken } = req.body
    const findQuiz = await QuizResultAnalysis.findOne({
      where: {
        user_id, quiz_id, quiz_status: {
          [Op.or]: ["initialized", "running"]
        }
      },
      order: [["id", "DESC"]],
      limit: 1,
      offset: 0
    })
    if (findQuiz) {
      await QuizResultAnalysis.update({ time_taken: time_taken * 1000 }, {
        where: {
          user_id,
          quiz_id,
          id: findQuiz?.id
        }
      })
      return res.status(200).json({
        success: true,
        message: "Time Updated Successfully"
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

exports.resetTimeForQuizzes = async (req, res) => {
  try {
    const { quiz_id, user_id } = req.body
    const findQuiz = await QuizResultAnalysis.findOne({
      where: {
        user_id, quiz_id, quiz_status: {
          [Op.or]: ["initialized", "running"]
        }
      },
      order: [["id", "DESC"]],
      limit: 1,
      offset: 0
    })
    if (findQuiz) {
      await QuizResultAnalysis.update({ time_taken: null }, {
        where: {
          user_id,
          quiz_id,
          id: findQuiz?.id
        }
      })
      return res.status(200).json({
        success: true,
        message: "Time Updated Successfully"
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
exports.getUserAttemptedQuizzes = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { status } = req.query;

    let statusFilter = "completed";
    if (status === "progress") {
      statusFilter = { [Op.or]: ["initialized", "running"] };
    }

    const attempts = await QuizResultAnalysis.findAll({
      where: {
        user_id: user_id,
        quiz_status: statusFilter
      },
      include: [
        {
          model: Quizzes,
          attributes: ["id", "name", "marks", "duration", "total_questions", "language", "key"],
          include: [
            {
              model: QuizDates,
              required: false,
              as: "dates",
              attributes: ["id", "quiz_id", "start_date", "reg_open_date", "result_publish_date"]
            },
            {
              model: QuizPrizeDetails,
              required: false,
              as: "prize"
            }
          ]
        }
      ],
      order: [["id", "DESC"]]
    });

    return res.status(200).json({
      success: true,
      data: attempts
    });
  } catch (err) {
    console.error("getUserAttemptedQuizzes Error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getQuizAttemptDetails = async (req, res) => {
  try {
    const { result_analysis_id } = req.params;

    // 1. Fetch the attempt and user answers
    const attempt = await QuizResultAnalysis.findOne({
      where: { id: result_analysis_id, quiz_status: "completed" },
      include: [
        {
          model: QuizResults,
          as: "resultAnalysis",
          required: false
        },
        {
          model: Quizzes,
          required: true,
          include: [{ model: QuizQuestions, as: "questions", required: false }]
        }
      ]
    });

    if (!attempt) {
      return res.status(404).json({ success: false, message: "Attempt not found or not completed" });
    }

    // 2. Extract Question Bank IDs
    const quiz = attempt.tblquiz || attempt.tblquizzes || attempt.Quiz || attempt.quiz || attempt.Quizze || attempt.quizze;
    const qbIds = quiz?.questions?.map(q => q.question_bank_id).filter(id => id) || [];

    if (qbIds.length === 0) {
      return res.status(200).json({ success: true, data: { attempt, details: [] } });
    }

    // 3. Fetch detailed questions and answers from Question microservice
    let questionsData = [];
    try {
      const { QUESTION_BANK_URL } = require('../services');
      const axios = require('axios');
      const qRes = await axios.post(`${QUESTION_BANK_URL}/getAllQuestionsWithAnswerUsingQuestionBankIds`, { questionBankIds: qbIds });
      if (qRes.data && qRes.data.success) {
        questionsData = qRes.data.data;
      }
    } catch (err) {
      console.error("Error calling Question service:", err.message);
      return res.status(500).json({ success: false, message: "Error fetching questions from question service" });
    }

    // 4. Map user answers to the detailed questions
    const userAnswers = attempt.resultAnalysis || [];

    const detailedResults = questionsData.map(qBank => {
      // Find matching user answer
      const userAns = userAnswers.find(ua => ua.question_id == qBank.questions?.[0]?.id);

      const marksData = qBank.marks || {};
      const correctMarks = marksData.marks || marksData.dataValues?.marks || 0;
      const negativeMarks = marksData.negative_marks || marksData.dataValues?.negative_marks || 0;

      const questionObj = qBank.questions?.[0] || {};
      const options = questionObj.options || [];

      let isCorrect = false;
      let marksEarned = 0;

      if (userAns && userAns.user_ans_option_id) {
        const selectedOption = options.find(opt => opt.id == userAns.user_ans_option_id);
        if (selectedOption && selectedOption.right_option == 1) {
          isCorrect = true;
          marksEarned = Number(correctMarks);
        } else {
          isCorrect = false;
          marksEarned = -Number(negativeMarks);
        }
      }

      return {
        question_bank_id: qBank.id,
        question_id: questionObj.id,
        question: questionObj.question,
        language: questionObj.language,
        options: options.map(opt => ({
          id: opt.id,
          option: opt.option,
          is_correct_option: opt.right_option == 1
        })),
        user_selected_option_id: userAns ? userAns.user_ans_option_id : null,
        is_correct: isCorrect,
        marks_earned: marksEarned,
        correct_marks: correctMarks,
        negative_marks: negativeMarks
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        attempt_summary: {
          id: attempt.id,
          user_id: attempt.user_id,
          quiz_id: attempt.quiz_id,
          time_taken: attempt.time_taken,
          quiz_name: quiz?.name
        },
        detailed_results: detailedResults
      }
    });

  } catch (err) {
    console.error("getQuizAttemptDetails Error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getUserRegisteredQuizzes = async (req, res) => {
  try {
    const { user_id } = req.params;
    const data = await UserRegistration.findAll({
      where: { user_id },
      include: [
        {
          model: Quizzes,
          include: [
            {
              model: QuizDates,
              required: false,
              as: 'dates'
            },
            {
              model: QuizPrizeDetails,
              required: false,
              as: 'prize'
            }
          ]
        }
      ],
      order: [['id', 'DESC']]
    });
    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    console.error("getUserRegisteredQuizzes Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
