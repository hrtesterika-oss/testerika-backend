const { Op } = require("sequelize");
const dbContext = require("../models");
const crypto = require("crypto");
const axios = require("axios");
const { QUESTION_BANK_URL } = require("../services");
const e = require("express");
const Packages = dbContext.Packages
const PackageCourses = dbContext.PackageCourses
const SubpackageCourses = dbContext.SubpackageCourses
const PackageSubpackages = dbContext.PackageSubpackages
const SubPackages = dbContext.SubPackages
const BundlePackages = dbContext.BundlePackages
const BundlePackageids = dbContext.BundlePackageids
const ExamCourses = dbContext.ExamCourses
const Exams = dbContext.Exams
const ExamTypes = dbContext.ExamTypes
const ExamSections = dbContext.ExamSections
const ExamSectionQuestions = dbContext.ExamSectionQuestions
const ExamResults = dbContext.ExamResults
const ExamResultAnalysis = dbContext.ExamResultAnalysis
const SubPackageExams = dbContext.SubPackageExams
const ExamSectionResultAnalysis = dbContext.ExamSectionResultAnalysis
const SavedExamQuestion = dbContext.SavedExamQuestion
const ReportExamQuestion = dbContext.ReportExamQuestion
exports.createUpdateExam = async (req, res) => {
  try {
    const { id, name, examtypesid, exam_duration, total_questions, total_marks, negative_marking, draft, result_publish_instantly, result_publish_date, question_suffling, option_suffling, section_wise_time, attempt_limit, instructions, courses_ids, skip_button, registration_exam, reg_start_date, reg_end_date } = req.body
    if (id) {
      await Exams.update({ name, exam_duration, examtypesid, total_questions, total_marks, negative_marking, draft, result_publish_instantly, result_publish_date, question_suffling, option_suffling, section_wise_time, attempt_limit, instructions, skip_button, registration_exam, reg_start_date, reg_end_date }, {
        where: {
          id
        }
      })
      let allCoursesIds = await ExamCourses.findAll({
        where: {
          examid: id
        },
        attributes: ["id", "courseid", "examid"]
      })

      if (allCoursesIds && allCoursesIds?.length > 0) {
        let currIds = allCoursesIds?.map((item) => item?.courseid)
        let newIds = courses_ids
        let deletedIds = currIds?.filter((item) => !newIds?.includes(item))?.map((item) => item)
        let createdIds = newIds?.filter((item) => !currIds?.includes(item))?.map((item) => item)
        if (deletedIds && deletedIds?.length > 0) {
          await ExamCourses.destroy({ where: { examid: id, courseid: deletedIds } })
        }
        if (createdIds && createdIds?.length > 0) {
          let bundlePackagesIds = createdIds?.flatMap((item) => [{ examid: id, courseid: item }])
          await ExamCourses.bulkCreate(bundlePackagesIds)
        }
      }
      return res.status(200).json({
        success: true,
        message: "Exam Updated Successfully"
      })
    } else {
      let key = crypto.randomBytes(128).toString('hex')
      if (key) {
        let findKey = await Exams.findOne({ where: { key } })
        while (findKey) {
          key = crypto.randomBytes(128).toString('hex')
          if (key) {
            findKey = await Exams.findOne({ where: { key } })
          }
        }
      }
      const data = await Exams.create({ name, exam_duration, examtypesid, total_questions, total_marks, negative_marking, draft, result_publish_instantly, result_publish_date, question_suffling, option_suffling, section_wise_time, attempt_limit, instructions, key, skip_button, registration_exam, reg_start_date, reg_end_date })
      if (data) {
        let examCoursesIds = courses_ids?.flatMap((item) => [{ examid: data?.id, courseid: item }])
        if (examCoursesIds && examCoursesIds?.length > 0) {
          await ExamCourses.bulkCreate(examCoursesIds)
        }
        return res.status(200).json({
          success: true,
          message: "Exam Created Successfully"
        })
      } else {
        return res.status(500).json({
          success: false,
          message: "Exam Not Created"
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

exports.getExams = async (req, res) => {
  try {
    let { page, items_per_page, search } = req.query
    let data
    page = parseInt(page)
    items_per_page = parseInt(items_per_page)
    const offset = (page - 1) * items_per_page
    const limit = items_per_page
    if (search) {
      data = await Exams.findAndCountAll({
        distinct: true,
        offset,
        limit,
        where: {
          name: { [Op.like]: `%${search}%` }
          // level: { [Op.like]: `%${search}%` }
        },
        attributes: ["id", "name", "exam_duration", "examtypesid", "total_questions", "total_marks", "draft"],
        include: [
          {
            model: ExamTypes,
            required: false,
            attributes: ["id", "name"]
          }
        ],
        order: [['id', 'DESC']]
      })
    } else {
      data = await Exams.findAndCountAll({
        distinct: true,
        offset,
        limit,
        attributes: ["id", "name", "exam_duration", "examtypesid", "total_questions", "total_marks", "draft"],
        include: [
          {
            model: ExamTypes,
            required: false,
            attributes: ["id", "name"]
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

exports.getExamsById = async (req, res) => {
  try {
    let { page, items_per_page, search, id } = req.query
    let data
    page = parseInt(page)
    items_per_page = parseInt(items_per_page)
    const offset = (page - 1) * items_per_page
    const limit = items_per_page
    if (search) {
      data = await Exams.findAndCountAll({
        distinct: true,
        offset,
        limit,
        where: {
          name: { [Op.like]: `%${search}%` },
          id
          // level: { [Op.like]: `%${search}%` }
        },
        attributes: ["id", "name", "exam_duration", "examtypesid", "total_questions", "total_marks", "draft"],
        include: [
          {
            model: ExamTypes,
            required: false,
            attributes: ["id", "name"]
          }
        ],
        order: [['id', 'DESC']]
      })
    } else {
      data = await Exams.findAndCountAll({
        where: {
          id
        },
        attributes: ["id", "name", "exam_duration", "examtypesid", "total_questions", "total_marks", "draft"],
        include: [
          {
            model: ExamTypes,
            required: false,
            attributes: ["id", "name"]
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

exports.getExamById = async (req, res) => {
  try {
    const { id } = req.params
    const data = await Exams.findOne({
      where: {
        id
      },
      attributes: {
        exclude: ['updatedAt', 'deletedAt', "key"]
      },
      include: [
        {
          model: ExamTypes,
          required: false,
          attributes: ["id", "name"]
        },
        {
          model: ExamCourses,
          required: false,
          as: "examcourses",
          attributes: ["id", "examid", "courseid"]
        }
      ],
    })
    if (data) {
      return res.status(200).json({
        success: true,
        data
      })
    } else {
      return res.status(500).json({
        success: false
      })
    }
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.deleteExamById = async (req, res) => {
  try {
    await ExamCourses.destroy({
      where: {
        examid: req.params.id
      }
    })
    await ExamResults.destroy({
      where: {
        examid: req.params.id
      }
    })
    await ExamResultAnalysis.destroy({
      where: {
        examid: req.params.id
      }
    })
    await ExamSections.destroy({
      where: {
        examid: req.params.id
      }
    })
    await SubPackageExams.destroy({
      where: {
        examid: req.params.id
      }
    })

    await Exams.destroy({
      where: {
        id: req.params.id
      }
    })
    return res.status(200).json({
      success: true,
      message: "Exam Deleted Successfully"
    })
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}


exports.getAllExamTypes = async (req, res) => {
  try {
    const data = await ExamTypes.findAll({
      attributes: ["id", "name"]
    })
    if (data) {
      return res.status(200).json({
        success: true,
        data
      })
    } else {
      return res.status(200).json({
        success: false,
        message: "Exam Types Not Found"
      })
    }

  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.createUpdateExamTypes = async (req, res) => {
  try {
    const { id, name } = req.body
    if (id) {
      await ExamTypes.update({ name }, {
        where: {
          id
        }
      })
      return res.status(200).json({
        success: true,
        message: "Exam Types Updated Successfully"
      })
    } else {
      let data = await ExamTypes.create({ name })
      if (data) {
        return res.status(200).json({
          success: true,
          message: "Exam Types Created Successfully"
        })
      } else {
        return res.status(200).json({
          success: false,
          message: "Please try again"
        })
      }

    }
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.getExamTypes = async (req, res) => {
  try {
    let { page, items_per_page, search } = req.query
    let data
    page = parseInt(page)
    items_per_page = parseInt(items_per_page)
    const offset = (page - 1) * items_per_page
    const limit = items_per_page
    if (search) {
      data = await ExamTypes.findAndCountAll({
        distinct: true,
        offset,
        limit,
        where: {
          name: { [Op.like]: `%${search}%` }
          // level: { [Op.like]: `%${search}%` }
        },
        attributes: ["id", "name", "createdAt"],
        order: [['id', 'DESC']]
      })
    } else {
      data = await ExamTypes.findAndCountAll({
        distinct: true,
        offset,
        limit,
        attributes: ["id", "name", "createdAt"],
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
exports.getExamTypesById = async (req, res) => {
  try {
    const { id } = req.params
    const data = await ExamTypes.findOne({
      where: {
        id
      },
      attributes: ["id", "name"]
    })
    if (data) {
      return res.status(200).json({
        success: true,
        data
      })
    } else {
      return res.status(500).json({
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

exports.deleteExamTypesById = async (req, res) => {
  try {
    await Exams.destroy({
      where: {
        examtypesid: req.params.id
      }
    })
    await ExamTypes.destroy({
      where: {
        id: req.params.id
      }
    })
    return res.status(200).json({
      success: true,
      message: "Exam Types Deleted Successfully"
    })
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}




exports.createUpdateExamSections = async (req, res) => {
  try {
    const { id, examid, subjectid, section_name, duration, instruction, instruction_duration, memoryTest, memoryQuestion, memory_duration } = req.body
    if (id) {
      await ExamSections.update({ examid, subjectid, section_name, duration, instruction, instruction_duration, memoryTest, memoryQuestion, memory_duration }, {
        where: {
          id
        }
      })
      return res.status(200).json({
        success: true,
        message: "Exam Section Updated Successfully"
      })
    } else {
      let data = await ExamSections.create({ examid, subjectid, section_name, duration, instruction, instruction_duration, memoryTest, memoryQuestion, memory_duration })
      if (data) {
        return res.status(200).json({
          success: true,
          message: "Exam Section Created Successfully"
        })
      } else {
        return res.status(200).json({
          success: false,
          message: "Please try again"
        })
      }

    }
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.getExamSection = async (req, res) => {
  try {
    let { page, items_per_page, search } = req.query
    const { id } = req.params
    let data
    page = parseInt(page)
    items_per_page = parseInt(items_per_page)
    const offset = (page - 1) * items_per_page
    const limit = items_per_page
    if (search) {
      data = await ExamSections.findAndCountAll({
        distinct: true,
        offset,
        limit,
        where: {
          section_name: { [Op.like]: `%${search}%` },
          examid: id
          // level: { [Op.like]: `%${search}%` }
        },
        attributes: ["id", "examid", "subjectid", "section_name", "duration", "createdAt", "instruction", "instruction_duration", "memoryTest", "memoryQuestion", "memory_duration"],
        order: [['id', 'DESC']]
      })
    } else {
      data = await ExamSections.findAndCountAll({
        where: {
          examid: id
        },
        distinct: true,
        offset,
        limit,
        attributes: ["id", "examid", "subjectid", "section_name", "duration", "createdAt", "instruction", "instruction_duration", "memoryTest", "memoryQuestion", "memory_duration"],
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
exports.getExamSectionsById = async (req, res) => {
  try {
    const { id } = req.params
    const data = await ExamSections.findOne({
      where: {
        id
      },
      attributes: ["id", "examid", "subjectid", "section_name", "duration", "createdAt", "instruction", "instruction_duration", "memoryTest", "memoryQuestion", "memory_duration"]
    })
    if (data) {
      return res.status(200).json({
        success: true,
        data
      })
    } else {
      return res.status(500).json({
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

exports.deleteExamSectionsById = async (req, res) => {
  try {
    await ExamSections.destroy({
      where: {
        id: req.params.id
      }
    })

    return res.status(200).json({
      success: true,
      message: "Exam Sections Deleted Successfully"
    })
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.getAllExamCoursesDetail = async (req, res) => {
  try {
    let data = await ExamCourses.findAll({
      where: {
        examid: req.params.id
      },
      attributes: ["id", "examid", "courseid"]
    })
    if (data) {
      return res.status(200).json({
        success: true,
        data
      })
    } else {
      return res.status(200).json({
        success: false,
        message: "Exam not available"
      })
    }
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}


exports.getAllQuestionsUsingExamAndSectionId = async (req, res) => {
  try {
    const { exam_id, section_id } = req.params
    const findExamSection = await ExamSections.findOne({
      where: {
        id: section_id,
        examid: exam_id
      },
      attributes: ["id", "examid", "section_name", "subjectid", "duration", "instruction", "memoryTest", "memoryQuestion", "memory_duration"]
    })



    if (findExamSection) {
      const response = await fetch(`${QUESTION_BANK_URL}/get/questions/getAllQuestionBankWithQuestionsUsingSubjectId/${findExamSection?.dataValues?.subjectid}?page=${req?.query?.page}&items_per_page=${req?.query?.items_per_page}`);
      const data = await response.json();
      const questionbankIds = data?.data?.map((item) => item?.id)

      let alreadyUsedpayload = []
      for (let item of questionbankIds) {
        const findAvail = await ExamSectionQuestions.findOne({
          where: {
            question_bank_id: item
          },
          offset: 0,
          limit: 1,
          order: [["id", "DESC"]]
        })
        if (findAvail) {
          alreadyUsedpayload.push(item)
        }
      }
      let finalPayload = []
      for (let item of data?.data) {
        if (alreadyUsedpayload?.includes(item?.id)) {
          finalPayload.push({ ...item, present: 1 })
        } else {
          finalPayload.push({ ...item, present: 0 })
        }
      }

      let finalResult = {
        data: finalPayload, payload: data?.payload
      }
      //  console.log("executring>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.")
      //  fetch(`${QUESTION_BANK_URL}/get/questions/getAllQuestionBankWithQuestionsUsingSubjectId/${findExamSection?.dataValues?.subjectid}?page=${req?.query?.page}&items_per_page=${req?.query?.items_per_page}`).then((data)=>{
      //      console.log(data)
      //  })
      //  const {data}=await axios.get(`${QUESTION_BANK_URL}/get/questions/getAllQuestionBankWithQuestionsUsingSubjectId/${findExamSection?.dataValues?.subjectid}?page=${req?.query?.page}&items_per_page=${req?.query?.items_per_page}`)
      if (data) {
        return res.status(200).json(finalResult)
      } else {
        return res.status(200).json({
          success: false,
          data: []
        })
      }

    } else {
      return res.status(200).json({
        success: false,
        data: []
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false
    })
  }
}


exports.viewAllQuestionsUsingExamAndSectionId = async (req, res) => {
  try {
    const { exam_id, section_id } = req.params
    const findExamSection = await ExamSectionQuestions.findAll({
      where: {
        examsectionid: section_id
      },
      attributes: ["id", "examsectionid", "question_bank_id"]
    })



    if (findExamSection?.length > 0) {
      let questionBankIds = findExamSection?.map((item) => item?.dataValues?.question_bank_id)
      const response = await axios.post(`${QUESTION_BANK_URL}/questionsGetUsingQuestionBankIdView?page=${req?.query?.page}&items_per_page=${req?.query?.items_per_page}`, { questionBankIds });
      // const data = await response.json();
      if (response?.data) {
        return res.status(200).json(response?.data)
      } else {
        return res.status(200).json({
          success: false,
          data: []
        })
      }

    } else {
      return res.status(200).json({
        success: false,
        data: []
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false
    })
  }
}

exports.addRemoveQuestionsToExamSections = async (req, res) => {
  try {
    const { section_id, question_bank_id } = req.body
    const findOneExamQuestions = await ExamSectionQuestions.findOne({
      where: {
        examsectionid: section_id,
        question_bank_id
      }
    })
    if (findOneExamQuestions) {
      await ExamSectionQuestions.destroy({
        where: {
          examsectionid: section_id,
          question_bank_id
        }
      })
      return res.status(200).json({
        success: true,
        message: "Question Removed Successfully"
      })
    } else {
      const data = await ExamSectionQuestions.create({ examsectionid: section_id, question_bank_id })
      if (data) {
        return res.status(200).json({
          success: true,
          message: "Question Added Successfully"
        })
      } else {
        return res.status(200).json({
          success: false,
          message: "Something went wrong.Please try again."
        })
      }
    }
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.getAllExamSectionQuestions = async (req, res) => {
  try {
    const { section_id } = req.params
    const questionPresent = await ExamSectionQuestions.findAll({
      where: {
        examsectionid: section_id
      },
      attributes: ["id", "examsectionid", "question_bank_id"]
    })
    if (questionPresent) {
      return res.status(200).json({
        success: true,
        questionPresent
      })
    } else {
      return res.status(200).json({
        success: false,
        questionPresent: []
      })
    }

  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.getExamstoAssign = async (req, res) => {
  try {
    const { id } = req.params
    const data = await SubPackageExams.findAll({
      where: {
        subpackageid: id
      }
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
    console.log(err)
    return res.status(500).json(err)
  }
}

exports.assignExamToSubPackages = async (req, res) => {
  try {
    const { exam_id, subpackage_id } = req.body

    const data = await SubPackageExams.findOne({
      where: {
        subpackageid: subpackage_id,
        examid: exam_id
      }
    })
    if (data) {
      await SubPackageExams.destroy({
        where: {
          subpackageid: subpackage_id,
          examid: exam_id
        }
      })
      const data = await SubPackageExams.findAll({
        where: {
          subpackageid: subpackage_id
        }
      })
      return res.status(200).json({
        success: true,
        data,
        message: "Exam Removed Successfully"
      })
    } else {
      await SubPackageExams.create({ subpackageid: subpackage_id, examid: exam_id, type: "Premium" })
      const data = await SubPackageExams.findAll({
        where: {
          subpackageid: subpackage_id
        }
      })
      return res.status(200).json({
        success: true,
        data,
        message: "Exam Assigned Successfully"
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
}


exports.assignExamTypeToSubPackagesStatus = async (req, res) => {
  try {
    const { exam_id, subpackage_id, type } = req.body
    await SubPackageExams.update({ type: type },
      {
        where: {
          subpackageid: subpackage_id,
          examid: exam_id
        }
      })

    const data = await SubPackageExams.findAll({
      where: {
        subpackageid: subpackage_id
      }
    })
    return res.status(200).json({
      success: true,
      data,
      message: "Status Updated Successfully"
    })

  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
}

exports.initializedPackageExamStatus = async (req, res) => {
  try {
    const { userid, bundleid, packageid, subpackageid, examid, total_questions } = req.body

    const findPackage=await Packages.findOne({
      where:{
        id:packageid,
        live:1
      },
      attributes:["id"]
    })

    if(findPackage){
      return res.status(200).json({
        success: false,
        message: "Please try again."
      })
    }else{
      const findExam = await ExamResultAnalysis.findOne({
        where: {
          userid, bundleid, packageid, subpackageid, examid, exam_status: {
            [Op.or]: ["initialized", "running", "paused"]
          }
        }
      })
      if (findExam) {
        return res.status(200).json({
          success: true,
          message: "Exam Started Successfully"
        })
      } else {
  
        const findAndCountExam = await ExamResultAnalysis.count({
          where: {
            userid, bundleid, packageid, subpackageid, examid, exam_status: "completed"
          }
        })
        const findExam = await Exams.findOne({
          where: {
            id: examid
          },
          attributes: ["id", "attempt_limit"]
        })
        if (findAndCountExam == findExam?.attempt_limit) {
          return res.status(200).json({
            success: false,
            message: "Attempt Limit Exceeded."
          })
        } else {
          const createResultAnalysis = await ExamResultAnalysis.create({ userid, bundleid, packageid, subpackageid, examid, total_questions, start_date: new Date(), exam_status: "initialized" })
          if (createResultAnalysis) {
            return res.status(200).json({
              success: true,
              message: "Exam Started Successfully"
            })
          } else {
            return res.status(200).json({
              success: false,
              message: "Please try again."
            })
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

exports.setTimeTakenExamSectionAndQuestion = async (req, res) => {
  try {
    const { userid, packageid, subpackageid, examid, examsectionid, bundleid, question_bank_id, question_id, user_ans_option_id, question_status, exam_section_time_taken } = req.body
    const findResultAnalysisdata = await ExamResultAnalysis.findOne({
      where: {
        userid, packageid, subpackageid, bundleid, examid, exam_status: {
          [Op.or]: ["initialized", "running", "paused"]
        }
      },
      include: [
        {
          model: ExamSectionResultAnalysis,
          as: "examsections",
          required: false,
          where: {
            examsectionid
          },
          attributes: ["id"]
        }
      ]
    })

    if (findResultAnalysisdata) {
      const findexamresult = await ExamResults.findOne({
        where: {
          userid, bundleid, packageid, subpackageid, examid, examsectionid, question_bank_id, resultanalysisid: findResultAnalysisdata?.id
        }
      })
      if (findexamresult) {
        if (question_status == "Marked") {
          await ExamResults.update({
            question_status
          }, {
            where: {
              id: findexamresult?.id,
              resultanalysisid: findResultAnalysisdata?.id
            }
          })
        }
        if (question_status == "Answered") {
          await ExamResults.update({
            question_status
          }, {
            where: {
              id: findexamresult?.id,
              resultanalysisid: findResultAnalysisdata?.id
            }
          })
        }
        if (question_status == "Marked Answered") {
          await ExamResults.update({
            question_status
          }, {
            where: {
              id: findexamresult?.id,
              resultanalysisid: findResultAnalysisdata?.id
            }
          })
        }
        if (findResultAnalysisdata?.examsections && findResultAnalysisdata?.examsections[0]?.id) {
          await ExamSectionResultAnalysis.update({
            time_taken: exam_section_time_taken
          }, {
            where: {
              id: findResultAnalysisdata?.examsections[0]?.id,
              resultanalysisid: findResultAnalysisdata?.id
            }
          })
          let findAllQuestionAndOption = await ExamResults.findAll({
            where: {
              userid, bundleid, packageid, subpackageid, examid, resultanalysisid: findResultAnalysisdata?.id
            },
            attributes: ["id", "examsectionid", "question_id", "user_ans_option_id", "question_status", "question_bank_id"]
          })
          return res.status(200).json({
            success: true,
            data: findAllQuestionAndOption
          })
        } else {
          await ExamSectionResultAnalysis.create({
            userid, resultanalysisid: findResultAnalysisdata?.id, examsectionid, time_taken: exam_section_time_taken
          })

          let findAllQuestionAndOption = await ExamResults.findAll({
            where: {
              userid, bundleid, packageid, subpackageid, examid, resultanalysisid: findResultAnalysisdata?.id
            },
            attributes: ["id", "examsectionid", "question_id", "user_ans_option_id", "question_status", "question_bank_id"]
          })
          return res.status(200).json({
            success: true,
            data: findAllQuestionAndOption
          })
        }
      } else {
        const createExamResult = await ExamResults.create({
          userid, bundleid, packageid, subpackageid, examid, examsectionid, resultanalysisid: findResultAnalysisdata?.id, question_bank_id, question_id, user_ans_option_id, question_status
        })
        if (question_status == "Marked") {
          await ExamResults.update({
            question_status
          }, {
            where: {
              id: findexamresult?.id,
              resultanalysisid: findResultAnalysisdata?.id
            }
          })
        }
        if (question_status == "Answered") {
          await ExamResults.update({
            question_status
          }, {
            where: {
              id: findexamresult?.id,
              resultanalysisid: findResultAnalysisdata?.id
            }
          })
        }
        if (question_status == "Marked Answered") {
          await ExamResults.update({
            question_status
          }, {
            where: {
              id: findexamresult?.id,
              resultanalysisid: findResultAnalysisdata?.id
            }
          })
        }
        if (findResultAnalysisdata?.examsections && findResultAnalysisdata?.examsections[0]?.id) {
          await ExamSectionResultAnalysis.update({
            time_taken: exam_section_time_taken
          }, {
            where: {
              id: findResultAnalysisdata?.examsections[0]?.id,
              resultanalysisid: findResultAnalysisdata?.id
            }
          })

          let findAllQuestionAndOption = await ExamResults.findAll({
            where: {
              userid, bundleid, packageid, subpackageid, examid, resultanalysisid: findResultAnalysisdata?.id
            },
            attributes: ["id", "examsectionid", "question_id", "user_ans_option_id", "question_status", "question_bank_id"]
          })
          return res.status(200).json({
            success: true,
            data: findAllQuestionAndOption
          })
        } else {
          await ExamSectionResultAnalysis.create({
            userid, resultanalysisid: findResultAnalysisdata?.id, examsectionid, time_taken: exam_section_time_taken
          })
          let findAllQuestionAndOption = await ExamResults.findAll({
            where: {
              userid, bundleid, packageid, subpackageid, examid, resultanalysisid: findResultAnalysisdata?.id
            },
            attributes: ["id", "examsectionid", "question_id", "user_ans_option_id", "question_status", "question_bank_id"]
          })
          return res.status(200).json({
            success: true,
            data: findAllQuestionAndOption
          })
        }
      }
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


exports.submitQuestionWithExamExamStarted = async (req, res) => {
  try {
    const { userid, packageid, subpackageid, examid, examsectionid, bundleid, question_id, question_bank_id, user_ans_option_id, question_status, exam_section_time_taken } = req.body
    const findResultAnalysisdata = await ExamResultAnalysis.findOne({
      where: {
        userid, packageid, subpackageid, bundleid, examid, exam_status: {
          [Op.or]: ["initialized", "running", "paused"]
        }
      },
      include: [
        {
          model: ExamSectionResultAnalysis,
          as: "examsections",
          required: false,
          where: {
            examsectionid
          },
          attributes: ["id"]
        }
      ]
    })
    if (findResultAnalysisdata) {
      const findexamresult = await ExamResults.findOne({
        where: {
          userid, bundleid, packageid, subpackageid, examid, examsectionid, question_bank_id, resultanalysisid: findResultAnalysisdata?.id
        }
      })
      if (findexamresult) {
        await ExamResults.update({
          user_ans_option_id, question_status, question_id, question_bank_id
        }, {
          where: {
            id: findexamresult?.id,
            resultanalysisid: findResultAnalysisdata?.id
          }
        })
        if (findResultAnalysisdata?.examsections && findResultAnalysisdata?.examsections[0]?.id) {
          await ExamSectionResultAnalysis.update({
            time_taken: exam_section_time_taken
          }, {
            where: {
              id: findResultAnalysisdata?.examsections[0]?.id,
              resultanalysisid: findResultAnalysisdata?.id
            }
          })
          let findAllQuestionAndOption = await ExamResults.findAll({
            where: {
              userid, bundleid, packageid, subpackageid, examid, resultanalysisid: findResultAnalysisdata?.id
            },
            attributes: ["id", "examsectionid", "question_id", "user_ans_option_id", "question_status", "question_bank_id"]
          })
          return res.status(200).json({
            success: true,
            data: findAllQuestionAndOption
          })
        } else {
          await ExamSectionResultAnalysis.create({
            userid, resultanalysisid: findResultAnalysisdata?.id, examsectionid, time_taken: exam_section_time_taken
          })
          let findAllQuestionAndOption = await ExamResults.findAll({
            where: {
              userid, bundleid, packageid, subpackageid, examid, resultanalysisid: findResultAnalysisdata?.id
            },
            attributes: ["id", "examsectionid", "question_id", "user_ans_option_id", "question_status", "question_bank_id"]
          })
          return res.status(200).json({
            success: true,
            data: findAllQuestionAndOption
          })
        }
      } else {
        const createExamResult = await ExamResults.create({
          userid, bundleid, packageid, subpackageid, examid, examsectionid, resultanalysisid: findResultAnalysisdata?.id, question_bank_id, question_id, user_ans_option_id, question_status
        })

        if (findResultAnalysisdata?.examsections && findResultAnalysisdata?.examsections[0]?.id) {
          await ExamSectionResultAnalysis.update({
            time_taken: exam_section_time_taken
          }, {
            where: {
              id: findResultAnalysisdata?.examsections[0]?.id,
              resultanalysisid: findResultAnalysisdata?.id
            }
          })

          let findAllQuestionAndOption = await ExamResults.findAll({
            where: {
              userid, bundleid, packageid, subpackageid, examid, resultanalysisid: findResultAnalysisdata?.id
            },
            attributes: ["id", "examsectionid", "question_id", "user_ans_option_id", "question_status", "question_bank_id"]
          })
          return res.status(200).json({
            success: true,
            data: findAllQuestionAndOption
          })
        } else {
          await ExamSectionResultAnalysis.create({
            userid, resultanalysisid: findResultAnalysisdata?.id, examsectionid, time_taken: exam_section_time_taken
          })
          let findAllQuestionAndOption = await ExamResults.findAll({
            where: {
              userid, bundleid, packageid, subpackageid, examid, resultanalysisid: findResultAnalysisdata?.id
            },
            attributes: ["id", "examsectionid", "question_id", "user_ans_option_id", "question_status", "question_bank_id"]
          })
          return res.status(200).json({
            success: true,
            data: findAllQuestionAndOption
          })
        }
      }
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

exports.getExamQuestionStatus = async (req, res) => {
  try {
    const { userid, packageid, subpackageid, examid, bundleid } = req.body
    const findResultAnalysisdata = await ExamResultAnalysis.findOne({
      where: {
        userid, packageid, subpackageid, bundleid, examid, exam_status: {
          [Op.or]: ["initialized", "running", "paused"]
        }
      }
    })
    if (findResultAnalysisdata) {
      let findAllQuestionAndOption = await ExamResults.findAll({
        where: {
          userid, bundleid, packageid, subpackageid, examid, resultanalysisid: findResultAnalysisdata?.id
        },
        attributes: ["id", "examsectionid", "question_id", "user_ans_option_id", "question_status", "question_bank_id"]
      })
      return res.status(200).json({
        success: true,
        data: findAllQuestionAndOption
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


exports.clearResponseQuestionAndAnswer = async (req, res) => {
  try {
    const { userid, packageid, subpackageid, examid, examsectionid, bundleid, question_bank_id, question_id } = req.body
    const findResultAnalysisdata = await ExamResultAnalysis.findOne({
      where: {
        userid, packageid, bundleid, subpackageid, examid, exam_status: {
          [Op.or]: ["initialized", "running", "paused"]
        }
      }
    })
    const findResult = await ExamResults.findOne({
      where: {
        userid, packageid, subpackageid, examid, examsectionid, bundleid, question_bank_id, question_id, resultanalysisid: findResultAnalysisdata?.id
      }
    })
    if (findResult) {
      await ExamResults.destroy({
        where: {
          id: findResult?.id
        }
      })
      let findAllQuestionAndOption = await ExamResults.findAll({
        where: {
          userid, bundleid, packageid, subpackageid, examid
        },
        attributes: ["id", "examsectionid", "question_id", "user_ans_option_id", "question_status", "question_bank_id"]
      })
      return res.status(200).json({
        success: true,
        data: findAllQuestionAndOption
      })
    }
    else {
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



//not section-wise api
exports.updateTimeStatusOnEverySeconds = async (req, res) => {
  try {
    const { userid, packageid, subpackageid, examid, bundleid, exam_section_time_taken } = req.body
    const findResultAnalysis = await ExamResultAnalysis.findOne({
      where: {
        userid, packageid, subpackageid, bundleid, examid, exam_status: {
          [Op.or]: ["initialized", "running", "paused"]
        }
      }
    })
    if (findResultAnalysis) {
      await ExamSectionResultAnalysis.update({
        time_taken: exam_section_time_taken
      }, {
        where: {
          userid, resultanalysisid: findResultAnalysis?.id
        }
      })
      const findOneExamSection = await ExamSectionResultAnalysis.findOne({
        where: {
          userid, resultanalysisid: findResultAnalysis?.id
        },
        limit: 1,
        order: [["id", "ASC"]],
        offset: 0,
        attributes: ["id", "time_taken", "examsectionid", "userid"]
      })
      return res.status(200).json({
        success: true,
        data: findOneExamSection
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


//section-wise-api
exports.updateTimeStatusOnEverySecondsSectionWise = async (req, res) => {
  try {
    const { userid, packageid, subpackageid, examid, bundleid, exam_section_time_taken, examsectionid } = req.body
    const findResultAnalysis = await ExamResultAnalysis.findOne({
      where: {
        userid, packageid, subpackageid, bundleid, examid, exam_status: {
          [Op.or]: ["initialized", "running", "paused"]
        }
      }
    })
    if (findResultAnalysis) {
      await ExamSectionResultAnalysis.update({
        time_taken: exam_section_time_taken,
      }, {
        where: {
          userid, resultanalysisid: findResultAnalysis?.id, examsectionid
        }
      })
      const findOneExamSection = await ExamSectionResultAnalysis.findOne({
        where: {
          userid, resultanalysisid: findResultAnalysis?.id, examsectionid
        },
        attributes: ["id", "time_taken", "examsectionid", "userid"]
      })
      return res.status(200).json({
        success: true,
        data: findOneExamSection
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

//Not section-wise time
exports.timeTakenForSectionUsingExamSectionIdANdUserId = async (req, res) => {
  try {
    const { userid, packageid, subpackageid, examid, bundleid } = req.body
    const findResultAnalysis = await ExamResultAnalysis.findOne({
      where: {
        userid, packageid, subpackageid, bundleid, examid, exam_status: {
          [Op.or]: ["initialized", "running", "paused"]
        }
      }
    })
    if (findResultAnalysis) {
      const findExamSection = await ExamSectionResultAnalysis.findOne({
        where: {
          userid, resultanalysisid: findResultAnalysis?.id
        },
        order: [["id", "ASC"]],
        attributes: ["id", "time_taken", "examsectionid", "userid"]
      })

      if (findExamSection) {
        return res.status(200).json({
          success: true,
          data: findExamSection
        })
      } else {
        return res.status(200).json({
          success: false,
        })
      }
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

// section-wise time
exports.timeTakenForSectionUsingExamSectionIdANdUserIdSectionWise = async (req, res) => {
  try {
    const { userid, packageid, subpackageid, examid, bundleid, examsectionid } = req.body
    const findResultAnalysis = await ExamResultAnalysis.findOne({
      where: {
        userid, packageid, subpackageid, bundleid, examid, exam_status: {
          [Op.or]: ["initialized", "running", "paused"]
        }
      }
    })
    if (findResultAnalysis) {
      const findExamSection = await ExamSectionResultAnalysis.findOne({
        where: {
          userid, resultanalysisid: findResultAnalysis?.id, examsectionid
        },
        attributes: ["id", "time_taken", "examsectionid", "userid"]
      })

      if (findExamSection) {
        return res.status(200).json({
          success: true,
          data: findExamSection
        })
      } else {
        return res.status(200).json({
          success: false,
        })
      }
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


exports.submiteExamForPackages = async (req, res) => {
  try {
    const { userid, packageid, subpackageid, examid, bundleid } = req.body

    const findResultAnalysis = await ExamResultAnalysis.findOne({
      where: {
        userid, packageid, subpackageid, bundleid, examid, exam_status: {
          [Op.or]: ["initialized", "running", "paused"]
        }
      }
    })
    if (findResultAnalysis) {

      const findResult = await ExamResults.count({
        where: {
          userid, packageid, subpackageid, bundleid, examid, resultanalysisid: findResultAnalysis?.id
        }
      })
      if (!findResult) {
        await ExamResultAnalysis.update({
          exam_status: "completed"
        }, {
          where: {
            id: findResultAnalysis?.id,
            userid
          }
        })
        return res.status(200).json({
          success: true,
          message: "Exam Submitted Successfully"
        })
      } else {
        await ExamResultAnalysis.update({
          exam_status: "completed"
        }, {
          where: {
            id: findResultAnalysis?.id,
            userid
          }
        })
        return res.status(200).json({
          success: true,
          message: "Exam Submitted Successfully"
        })
      }
    } else {
      return res.status(200).json({
        success: false,
        message: "Something Went wrong.Please try again"
      })
    }
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}


exports.findTimeLeftForExamAndExamsection = async (req, res) => {
  try {
    const { userid, packageid, subpackageid, examid, bundleid } = req.body
    const findResultAnalysis = await ExamResultAnalysis.findOne({
      where: {
        userid, packageid, subpackageid, bundleid, examid, exam_status: {
          [Op.or]: ["initialized", "running", "paused"]
        }
      }
    })

    if (findResultAnalysis) {
      const findExamSectionAll = await ExamSections.findAll({
        where: {
          examid
        },
        order: [["id", "ASC"]],
        attributes: ["id", "duration"]
      })

      const findAllExamSectionPresent = await ExamSectionResultAnalysis.findAll({
        where: {
          userid, resultanalysisid: findResultAnalysis?.id
        },
        attributes: ["id", "time_taken", "resultanalysisid", "examsectionid"]
      })

      if (findExamSectionAll && findExamSectionAll?.length > 0 && findAllExamSectionPresent?.length > 0) {
        let newTemp = []
        findExamSectionAll?.map(async (item) => {
          const findExamSectionAnalysis = findAllExamSectionPresent.find((item2) => {
            return item2?.examsectionid == item?.id && item2?.resultanalysisid == findResultAnalysis?.id && item2?.time_taken == item?.duration * 60
          })
          if (findExamSectionAnalysis) {
          } else {
            newTemp.push(item)
            return
          }
        })


        if (newTemp?.length > 0) {
          let findOneData = await ExamSectionResultAnalysis.findOne({
            where: {
              userid, resultanalysisid: findResultAnalysis?.id, examsectionid: newTemp[0]?.id
            }
          })
          if (findOneData) {
            return res.status(200).json({
              success: true,
              time_taken: findOneData?.time_taken,
              examsectionid: findOneData?.examsectionid
            })
          } else {
            const createExamSectionDetail = await ExamSectionResultAnalysis.create({
              userid, resultanalysisid: findResultAnalysis?.id, examsectionid: newTemp[0]?.id, time_taken: 0
            })
            if (createExamSectionDetail) {
              return res.status(200).json({
                success: true,
                time_taken: 0,
                examsectionid: createExamSectionDetail?.examsectionid
              })
            }
          }
        } else {
          return res.status(200).json({
            success: false
          })
        }
      }
    } else {
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


exports.findExamWhichIsAdrteadyGivenForUser = async (req, res) => {
  try {
    const { bundleid, packageid, userid } = req.body
    let findExam = []
    let findExamStatusStarted = []
    if (bundleid) {
      findExam = await ExamResultAnalysis.findAll({
        where: {
          userid, bundleid, exam_status: "completed"
        },
        attributes: ["id", "userid", "bundleid", "packageid", "subpackageid", "examid"]
      })

      findExamStatusStarted = await ExamResultAnalysis.findAll({
        where: {
          userid, bundleid, exam_status: {
            [Op.or]: ["initialized", "running", "paused"]
          }
        },
        attributes: ["id", "userid", "bundleid", "packageid", "subpackageid", "examid"]
      })
    } else {
      findExam = await ExamResultAnalysis.findAll({
        where: {
          userid, bundleid, packageid, exam_status: "completed"
        },
        attributes: ["id", "userid", "bundleid", "packageid", "subpackageid", "examid"]
      })
      findExamStatusStarted = await ExamResultAnalysis.findAll({
        where: {
          userid, bundleid, packageid, exam_status: {
            [Op.or]: ["initialized", "running", "paused"]
          }
        },
        attributes: ["id", "userid", "bundleid", "packageid", "subpackageid", "examid"]
      })
    }

    if (findExam) {
      return res.status(200).json({
        success: true,
        data: findExam,
        findExamStatusStarted
      })
    } else {
      return res.status(200).json({
        success: false,
        data: [],
        findExamStatusStarted: []
      })
    }
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}


exports.findLiveExamWhichIsAdrteadyGivenForUser = async (req, res) => {
  try {
    const { bundleid, packageid, userid, subpackageid, examid } = req.body
    let findExam = await ExamResultAnalysis.findOne({
      where: {
        userid, bundleid, packageid, subpackageid, examid
      },
      attributes: ["id", "userid", "bundleid", "packageid", "subpackageid", "examid", "exam_status"]
    })

    let findUserCount = await ExamResultAnalysis.findAll({
      where: {
        bundleid, packageid, subpackageid, examid
      },
      attributes: ["id"]
    })

    if (findExam) {
      if (findExam?.exam_status == "initialized") {
        return res.status(200).json({
          success: true,
          data: {
            status: "initialized",
            count:findUserCount?.length
          }
        })
      }
      else if (findExam?.exam_status == "completed") {
        return res.status(200).json({
          success: true,
          data: {
            status: "completed",
            count:findUserCount?.length
          }
        })
      } else {
        return res.status(200).json({
          success: true,
          data: {
            status: "not completed",
            count:findUserCount?.length
          }
        })
      }
    } else {
      return res.status(200).json({
        success: false,
        data: {
          status: "not registered",
          count:findUserCount?.length
        }
      })
    }
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.joinNowLiveExam = async (req, res) => {
  try {
    const { userid, bundleid, packageid, subpackageid, examid, total_questions } = req.body
    const findPackage=await Packages.findOne({
      where: {
        id: packageid,
        [Op.and]: {
          reg_start_date: {
            [Op.lte]: new Date(),
          },
          reg_end_date: {
            [Op.gt]: new Date(),
          },
        },
      },
      attributes:["id"]
    })

    if(findPackage){
      const createResultAnalysis = await ExamResultAnalysis.create({ userid, bundleid, packageid, subpackageid, examid, total_questions, start_date: new Date(), exam_status: "initialized" })
      if (createResultAnalysis) {
        return res.status(200).json({
          success: true,
          message: "Joined"
        })
      } else {
        return res.status(200).json({
          success: false,
          message: "Please try again."
        })
      }
    }else{
      return res.status(200).json({
        success: false,
        message: "Not authorized."
      })
    }
    
  } catch (err) {
    return res.status(500).json({
      success: false,
    })
  }
}




//Saved Exam Controller
exports.findSavedExamDetailWithQuestion = async (req, res) => {
  try {
    const { userid } = req.params
    let { page, items_per_page, search } = req.query
    let data
    page = parseInt(page)
    items_per_page = parseInt(items_per_page)
    const offset = (page - 1) * items_per_page
    const limit = items_per_page
    data = await SavedExamQuestion.findAndCountAll({
      distinct: true,
      offset,
      limit,
      where: {
        userid
      },
      attributes: ["id", "userid", "question_id", "option_id", "passage_id", "createdAt"],
      order: [['id', 'DESC']]
    })

    if (data && data?.rows?.length > 0) {
      let questionBankIds = []
      let passageIds = []
      data?.rows?.map((item) => {
        if (!questionBankIds?.includes(item?.question_id)) {
          questionBankIds.push(item?.question_id)
        }
        if (!passageIds?.includes(item?.passage_id) && item?.passage_id) {
          passageIds.push(item?.passage_id)
        }
      })

      if (questionBankIds?.length > 0) {
        // console.log(questionBankIds)
        const data2 = await axios.post(`${QUESTION_BANK_URL}/questionsAll/get`, { questionBankIds, passageIds })
        if (data2?.data?.success) {
          return res.status(200).json({
            success: true,
            questions: data2?.data?.data,
            passages: data2?.data?.passages,
            savedExamdetail: data?.rows,
            totalCount: data?.count
          })
        } else {
          return res.status(200).json({
            success: false,
            message: "Questions not found"
          })
        }
      } else {
        return res.status(200).json({
          success: false,
          message: "No saved questions found"
        })
      }
    } else {
      return res.status(200).json({
        success: false,
        message: "No saved questions found"
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false
    })
  }
}

exports.savedExamQuestion = async (req, res) => {
  try {
    const { userid, question_id, option_id, passage_id } = req.body

    const data = await SavedExamQuestion.findOne({
      where: {
        userid, question_id, option_id, passage_id
      }
    })
    if (data) {
      return res.status(200).json({
        success: false,
        message: "Question already saved"
      })
    } else {
      const data2 = await SavedExamQuestion.create(req.body)
      if (data2) {
        return res.status(200).json({
          success: true,
          message: "Questions saved successfully"
        })
      } else {
        return res.status(200).json({
          success: false,
          message: "Invalid details"
        })
      }
    }
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.removeSavedQuestion = async (req, res) => {
  try {
    const { userid, question_id, passage_id } = req.body
    await SavedExamQuestion.destroy({
      where: {
        userid, question_id, passage_id
      }
    })
    return res.status(200).json({
      success: true,
      message: "Question removed successfully"
    })
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.getSingleSavedExamQuestionDetails = async (req, res) => {
  try {
    const { userid, question_id, passage_id } = req.params

    const data = await SavedExamQuestion.findOne({
      where: {
        userid, question_id, passage_id
      },
      attributes: ["id", "userid", "question_id", "option_id", "passage_id", "createdAt"],
    })

    if (data) {
      let questionBankIds = []
      questionBankIds.push(data?.question_id)
      let passageIds = []
      passageIds.push(data?.passage_id)


      if (questionBankIds?.length > 0) {
        // console.log(questionBankIds)
        const data2 = await axios.post(`${QUESTION_BANK_URL}/questionsAll/get`, { questionBankIds, passageIds })
        if (data2?.data?.success) {
          return res.status(200).json({
            success: true,
            questions: data2?.data?.data,
            passages: data2?.data?.passages,
            savedExamdetail: data
          })
        } else {
          return res.status(200).json({
            success: false,
            message: "Questions not found"
          })
        }
      } else {
        return res.status(200).json({
          success: false,
          message: "No saved questions found"
        })
      }
    } else {
      return res.status(200).json({
        success: false,
        message: "No saved questions found"
      })
    }
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.getAllSavedExamQuestionsUsingOrderId = async (req, res) => {
  try {
    const { userid } = req.params

    const data = await SavedExamQuestion.findAll({
      where: {
        userid
      },
      attributes: ["question_id"],
    })

    if (data?.length > 0) {
      return res.status(200).json({
        success: true,
        data
      })
    } else {
      return res.status(200).json({
        success: false,
        message: "No saved questions found"
      })
    }
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}


//Report Exam Controller
exports.findReportExamDetailWithQuestion = async (req, res) => {
  try {
    const { userid } = req.params
    let { page, items_per_page, search } = req.query
    let data
    page = parseInt(page)
    items_per_page = parseInt(items_per_page)
    const offset = (page - 1) * items_per_page
    const limit = items_per_page
    data = await ReportExamQuestion.findAndCountAll({
      distinct: true,
      offset,
      limit,
      where: {
        userid
      },
      attributes: ["id", "userid", "bundleid", "packageid", "subpackageid", "examid", "examsectionid", "question_bank_id", "question_id", "report_reason", "reported", "createdAt"],
      order: [['id', 'DESC']]
    })
    if (data && data?.rows?.length > 0) {
      let questionBankIds = []
      data?.rows?.map((item) => {
        if (!questionBankIds?.includes(item?.question_bank_id)) {
          questionBankIds.push(item?.question_bank_id)
        }
      })

      if (questionBankIds?.length > 0) {
        // console.log(questionBankIds)
        const data2 = await axios.post(`${QUESTION_BANK_URL}/getAllQuestionsUsingQuestionBankIds`, { questionBankIds })
        if (data2?.data?.success) {
          return res.status(200).json({
            success: true,
            questions: data2?.data?.data,
            reportExamdetail: data?.rows,
            totalCount: data?.count
          })
        } else {
          return res.status(200).json({
            success: false,
            message: "Questions not found"
          })
        }
      } else {
        return res.status(200).json({
          success: false,
          message: "No report questions found"
        })
      }
    } else {
      return res.status(200).json({
        success: false,
        message: "No report questions found"
      })
    }
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.reportExamQuestion = async (req, res) => {
  try {
    const { userid, bundleid, packageid, subpackageid, examid, examsectionid, question_bank_id, question_id, report_reason } = req.body

    const data = undefined
    if (bundleid) {
      data = await ReportExamQuestion.findOne({
        where: {
          userid, bundleid, packageid, subpackageid, examid, examsectionid, question_bank_id, question_id
        }
      })
    } else {
      data = await ReportExamQuestion.findOne({
        where: {
          userid, packageid, subpackageid, examid, examsectionid, question_bank_id, question_id
        }
      })
    }
    if (data) {
      return res.status(200).json({
        success: false,
        message: "Question already reported"
      })
    } else {
      const data2 = await ReportExamQuestion.create(req.body)
      if (data2) {
        return res.status(200).json({
          success: true,
          message: "Questions reported successfully"
        })
      } else {
        return res.status(200).json({
          success: false,
          message: "Invalid details"
        })
      }
    }
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.removeReportQuestion = async (req, res) => {
  try {
    const { userid, bundleid, packageid, subpackageid, examid, examsectionid, question_bank_id, question_id } = req.body
    const data = undefined
    if (bundleid) {
      data = await ReportExamQuestion.findOne({
        where: {
          userid, bundleid, packageid, subpackageid, examid, examsectionid, question_bank_id, question_id
        }
      })
    } else {
      data = await ReportExamQuestion.findOne({
        where: {
          userid, packageid, subpackageid, examid, examsectionid, question_bank_id, question_id
        }
      })
    }
    if (data) {
      if (bundleid) {
        await ReportExamQuestion.destroy({
          where: {
            userid, bundleid, packageid, subpackageid, examid, examsectionid, question_bank_id, question_id
          }
        })
      } else {
        await ReportExamQuestion.destroy({
          where: {
            userid, packageid, subpackageid, examid, examsectionid, question_bank_id, question_id
          }
        })
      }
      return res.status(200).json({
        success: true,
        message: "Question removed successfully"
      })
    }
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.getSingleReportExamQuestionDetails = async (req, res) => {
  try {
    const { userid, bundleid, packageid, subpackageid, examid, examsectionid, question_bank_id, question_id } = req.body
    const data = undefined
    if (bundleid) {
      data = await ReportExamQuestion.findOne({
        where: {
          userid, bundleid, packageid, subpackageid, examid, examsectionid, question_bank_id, question_id
        }
      })
    } else {
      data = await ReportExamQuestion.findOne({
        where: {
          userid, packageid, subpackageid, examid, examsectionid, question_bank_id, question_id
        }
      })
    }
    if (data) {
      const data2 = await axios.get(`${QUESTION_BANK_URL}/${data?.question_bank_id}`)
      if (data2?.data) {
        return res.status(200).json({
          success: true,
          question: data2?.data,
          reportExam: data
        })
      } else {
        return res.status(200).json({
          success: false,
          message: "Question not reported"
        })
      }
    } else {
      return res.status(200).json({
        success: false,
        message: "Question not reported"
      })
    }
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}


exports.examAlreadyAttempted = async (req, res) => {
  try {
    let { page, items_per_page, search } = req.query
    const { user_id } = req.params
    let data
    page = parseInt(page)
    items_per_page = parseInt(items_per_page)
    const offset = (page - 1) * items_per_page
    const limit = items_per_page
    data = await ExamResultAnalysis.findAndCountAll({
      distinct: true,
      offset,
      limit,
      attributes: ["id", "userid", "bundleid", "packageid", "subpackageid", "examid", "exam_status", "createdAt"],
      order: [['id', 'DESC']],
      where: {
        userid: user_id,
        exam_status: "completed"
      }
    })

    let exams
    if (data?.rows?.length > 0) {

      let examid = data?.rows?.map((item) => item?.examid)

      exams = await Exams.findAll({
        where: {
          id: examid
        },
        attributes: ["id", "key", "name"]
      })


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
        data: data.rows, exams,
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
    } else {
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
        data: [], exams: null,
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
    }


  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
}
exports.adminExamAlreadyAttempted = async (req, res) => {
  try {
    let { page, items_per_page, search } = req.query
    const { user_id } = req.params
    let data
    page = parseInt(page)
    items_per_page = parseInt(items_per_page)
    const offset = (page - 1) * items_per_page
    const limit = items_per_page
    data = await ExamResultAnalysis.findAndCountAll({
      distinct: true,
      offset,
      limit,
      attributes: ["id", "userid", "bundleid", "packageid", "subpackageid", "examid", "exam_status", "createdAt"],
      order: [['id', 'DESC']],
      where: {
        userid: user_id,
      }
    })

    let exams
    if (data?.rows?.length > 0) {

      let examid = data?.rows?.map((item) => item?.examid)

      exams = await Exams.findAll({
        where: {
          id: examid
        },
        attributes: ["id", "key", "name"]
      })


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
        data: data.rows, exams,
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
    } else {
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
        data: [], exams: null,
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
    }


  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
}

exports.deleteExamAlreadyAttempted = async (req, res) => {
  try {
    const { id } = req.params
    await ExamResults.destroy({
      where: {
        resultanalysisid: id
      }
    })
    await ExamResultAnalysis.destroy({
      where: {
        id
      }
    })
    return res.status(200).json({
      success: true
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
}


exports.quizAlreadyAttempted = async (req, res) => {
  try {
    let { page, items_per_page, search } = req.query
    const { user_id } = req.params
    let data
    page = parseInt(page)
    items_per_page = parseInt(items_per_page)
    const offset = (page - 1) * items_per_page
    const limit = items_per_page
    data = await ExamResultAnalysis.findAndCountAll({
      distinct: true,
      offset,
      limit,
      attributes: ["id", "userid", "bundleid", "packageid", "subpackageid", "examid", "exam_status", "createdAt"],
      order: [['id', 'DESC']],
      where: {
        userid: user_id,
        exam_status: "completed"
      }
    })

    let exams
    if (data?.rows?.length > 0) {

      let examid = data?.rows?.map((item) => item?.examid)
      exams = await Exams.findAll({
        where: {
          id: examid
        },
        attributes: ["id", "key"]
      })


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
        exams,
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
    } else {
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
        data: [], exams: null,
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
    }


  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
}


exports.clearResponse = async (req, res) => {
  try {
    const { userid, packageid, subpackageid, bundleid, examid, examsectionid } = req.body
    const findResultAnalysisdata = await ExamResultAnalysis.findOne({
      where: {
        userid, packageid, subpackageid, bundleid, examid, exam_status: {
          [Op.or]: ["initialized", "running", "paused"]
        }
      }
    })
    if (findResultAnalysisdata) {
      await ExamResults.destroy({
        where: {
          userid, packageid, subpackageid, examid, examsectionid, resultanalysisid: findResultAnalysisdata?.id
        }
      })
      return res.status(200).json({
        success: true,
        message: "Response Cleared Successfully"
      })
    } else {
      return res.status(200).json({
        success: false,
        message: "Something went wrong"
      })
    }
  } catch (err) {
    return res.status(500).json({
      success: false
    })
  }
}

exports.registeredLiveExam = async (req, res) => {
  try {

  } catch (err) {

  }
}

exports.deleteResultAnalysisDatausingPackageIdSubpackageIdAndExamId=async (req,res)=>{
  try{
     const {packageid,subpackageid}=req.params
     const {examid}=req.body
     await ExamResultAnalysis.destroy({
      where:{
        packageid,subpackageid,examid:examid
      }
     })
     return res.status(200).json({
      success:true
  })
  }catch(err){
    console.log(err)
    return res.status(500).json({
      success:false
    })
  }
}