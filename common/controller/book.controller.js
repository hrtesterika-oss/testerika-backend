require('dotenv').config()
const dbContext = require('../models')
const Books = dbContext.Books
const { uploadImage } = require('../middleware/fileUploader')
const fs = require('fs')
const crypto = require('crypto')
const Sequelize = require('sequelize')
const { BookCourses } = require('../models')
const Op = Sequelize.Op

exports.findAll = async (req, res) => {
  try {
    let { page, items_per_page, search } = req.query
    let data
    page = parseInt(page)
    items_per_page = parseInt(items_per_page)
    const offset = (page - 1) * items_per_page
    const limit = items_per_page
    if (search) {
      data = await Books.findAndCountAll({
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
            model: BookCourses,
            required: false,
            as: 'courses'
          }
        ]
      })
    } else {
      data = await Books.findAndCountAll({
        distinct: true,
        offset,
        limit,
        order: [['id', 'DESC']],
        include: [
          {
            model: BookCourses,
            required: false,
            as: 'courses'
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
    return res.status(500).json(err)
  }
}

exports.create = async (req, res) => {
  try {
    let { id, courses } = req.body
    let data
    if (id == undefined) {
      const hash = crypto.randomBytes(32).toString('hex')
      data = await Books.create({ ...req.body, hash })
      courses = courses.flatMap(item => [
        {
          book_id: data.id,
          course_id: item.id
        }
      ])
      courses = await BookCourses.bulkCreate(courses)
    } else {
      ;[, data] = await Books.update(req.body, {
        where: { id },
        returning: true,
        plain: true
      })
      const coursesOld = await BookCourses.findAll({ where: { book_id: id } })
      for (let item of courses) {
        let course = coursesOld.find(x => x.course_id == item.id)
        if (!course) {
          await BookCourses.create({ book_id: id, course_id: item.id })
        }
      }
      for (let item of coursesOld) {
        let course = courses.find(x => x.id == item.course_id)
        if (!course) {
          await BookCourses.destroy({ where: { id: item.id } })
        }
      }
    }
    return res.status(200).json({
      data: {
        ...data.toJSON(),
        courses
      }
    })
  } catch (err) {
    console.log(err, 'err')
    return res.status(500).json(err)
  }
}

exports.findById = async (req, res) => {
  try {
    const { id } = req.params
    const data = await Books.findOne({
      where: { id },
      include: [
        {
          model: BookCourses,
          required: false,
          as: 'courses'
        }
      ]
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
    const [count, data] = await Books.update(payload, {
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
    const courses = await BookCourses.findAll({ where: { book_id: id } })
    for (let item of courses) {
      await BookCourses.destroy({
        where: { id: item.id }
      })
    }
    await Books.destroy({
      where: { id }
    })
    return res.status(200).json('Record deleted')
  } catch (err) {
    return res.status(500).json(err)
  }
}
