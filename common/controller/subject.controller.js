require('dotenv').config()
const dbContext = require('../models')
const Subjects = dbContext.Subjects
const Sequelize = require('sequelize')
const { SubjectCourses } = require('../models')
const Op = Sequelize.Op

exports.findAll = async (req, res) => {
  try {
    let {
      page,
      items_per_page,
      search,
      filter_question_type,
      filter_level
    } = req.query
    let data
    page = parseInt(page)
    items_per_page = parseInt(items_per_page)
    const offset = (page - 1) * items_per_page
    const limit = items_per_page
    // const include = [
    //   {
    //     model: SubjectCourses,
    //     required: false,
    //     as: 'courses'
    //   }
    // ]
    if (search) {
      data = await Subjects.findAndCountAll({
        distinct: true,
        offset,
        limit,
        // include: include,
        where: {
          subject_name: { [Op.like]: `%${search}%` }
          // level: { [Op.like]: `%${search}%` }
        },
        order: [['id', 'DESC']]
      })
    } else {
      data = await Subjects.findAndCountAll({
        distinct: true,
        offset,
        limit,
        order: [['id', 'DESC']],
        // include: include
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

exports.getAll = async (req, res) => {
  try {
    const data = await Subjects.findAll()
    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json(err)
  }
}

exports.create = async (req, res) => {
  try {
    let { id, courses, subject_name } = req.body
    let data
    if (id == undefined) {
      // data = await Subjects.create({ subject_name })
      // courses = courses.flatMap(item => [
      //   {
      //     subject_id: data.id,
      //     course_category_id: item.id
      //   }
      // ])
      // courses = await SubjectCourses.bulkCreate(courses)
        const ids=courses?.map((item)=>item?.id)
        data = await Subjects.create({subject_name,course_ids:JSON.stringify(ids)})
    } else {
      // ;[, data] = await Subjects.update(
      //   { subject_name },
      //   {
      //     where: { id },
      //     returning: true,
      //     plain: true
      //   }
      // )
      // const coursesOld = await SubjectCourses.findAll({
      //   where: { subject_id: id }
      // })
      // for (let item of courses) {
      //   let course = coursesOld.find(x => x.course_category_id == item.id)
      //   if (!course) {
      //     await SubjectCourses.create({
      //       subject_id: id,
      //       course_category_id: item.id
      //     })
      //   }
      // }
      // for (let item of coursesOld) {
      //   let course = courses.find(x => x.id == item.course_category_id)
      //   if (!course) {
      //     await SubjectCourses.destroy({ where: { id: item.id } })
      //   }
      // }


      // new Code 
      const ids=courses?.map((item)=>item?.id)
        data = await Subjects.update({subject_name,course_ids:JSON.stringify(ids)},{where:{id}})
    
    }
    return res.status(200).json({
      message:"Subject Updated Successfully"
    })
  } catch (err) {
    return res.status(500).json(err)
  }
}

exports.findById = async (req, res) => {
  try {
    const { id } = req.params
    const data = await Subjects.findOne({
      where: { id },
      // include: [
      //   {
      //     model: SubjectCourses,
      //     required: false,
      //     as: 'courses'
      //   }
      // ]
    })
    return res.status(200).json({ data })
  } catch (err) {
    return res.status(500).json(err)
  }
}

exports.update = async (req, res) => {
  try {
    const { id } = req.params
    let payload = req.body
    const [count, data] = await Subjects.update(payload, {
      where: { id },
      returning: true
    })
    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json(err)
  }
}

exports.delete = async (req, res) => {
  try {
    const { id } = req.params
    // const courses = await SubjectCourses.findAll({ where: { subject_id: id } })
    // for (let item of courses) {
    //   await SubjectCourses.destroy({
    //     where: { id: item.id }
    //   })
    // }
    await Subjects.destroy({
      where: { id }
    })
    return res.status(200).json('Record deleted')
  } catch (err) {
    return res.status(500).json(err)
  }
}
