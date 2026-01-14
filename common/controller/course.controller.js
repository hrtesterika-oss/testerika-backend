require('dotenv').config();
const dbContext = require("../models");
const Courses = dbContext.Courses
const { CourseCategories } = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op

exports.findAll = async (req, res) => {
    try {
        const data = await Courses.findAll();
        return res.status(200).json(data)
    }
    catch (err) {
        return res.status(500).json(err)
    }
}


exports.getAll = async (req, res) => {
    try {
        let { page, items_per_page, search, filter_question_type, filter_level } = req.query
        let data;
        page = parseInt(page)
        items_per_page = parseInt(items_per_page)
        const offset = (page - 1) * items_per_page;
        const limit = items_per_page;
        if (search) {
            data = await Courses.findAndCountAll({
                distinct: true,
                offset,
                limit,
                where: {
                    course_name: { [Op.like]: `%${search}%` }
                    // level: { [Op.like]: `%${search}%` }
                },
                order: [
                    ['id', 'DESC']
                ],
            })
        }

        else {
            data = await Courses.findAndCountAll({
                distinct: true,
                offset,
                limit,
                order: [
                    ['id', 'DESC']
                ],
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
        return res.status(500).json(err.message)
    }
}

exports.create = async (req, res) => {
    try {
        if (req.body.id == undefined) {
            await Courses.create(req.body);
        } else {
            await Courses.update(req.body, { where: { id: req.body.id } })
        }
        return res.status(200).json({ message: 'Course created!' })
    }
    catch (err) {
        return res.status(500).json(err)
    }
}

exports.findById = async (req, res) => {
    try {
        const { id } = req.params
        const data = await Courses.findOne({
            where: { id }
        });
        return res.status(200).json({ data });
    }
    catch (err) {
        return res.status(500).json(err);
    }
}

exports.update = async (req, res) => {
    try {
        const { id } = req.params
        let payload = req.body
        const [count, data] = await Courses.update(payload, {
            where: { id }, returning: true
        });
        return res.status(200).json(data)
    }
    catch (err) {
        return res.status(500).json(err)
    }
}

exports.delete = async (req, res) => {
    try {
        const { id } = req.params
        await Courses.destroy({
            where: { id }
        });
        return res.status(200).json("Record deleted")
    }
    catch (err) {
        return res.status(500).json(err)
    }
}