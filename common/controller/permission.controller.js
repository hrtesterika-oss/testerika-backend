require('dotenv').config();
const Sequelize = require('sequelize')
const dbContext = require("../models");
const Permissions = dbContext.Permissions
const Op = Sequelize.Op



exports.findAll = async (req, res) => {
    try {
        let { page, items_per_page, search } = req.query
        let data;
        page = parseInt(page)
        items_per_page = parseInt(items_per_page)
        const offset = (page - 1) * items_per_page;
        const limit = items_per_page;
        if (search) {
            data = await Permissions.findAndCountAll({
                distinct: true,
                offset,
                limit,
                where: {
                    name: { [Op.like]: `%${search}%` }
                    // short_name: { [Op.like]: `%${search}%` }
                },
                order: [
                    ['id', 'DESC']
                ],
            })
        } else {
            data = await Permissions.findAndCountAll({
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
        console.log(err, "err")
        return res.status(500).json(err.message)
    }
}

exports.create = async (req, res) => {
    try {
        const data = await Permissions.create(req.body);
        return res.status(200).json(data)
    }
    catch (err) {
        return res.status(500).json(err.message)
    }
}

exports.findById = async (req, res) => {
    try {
        const { id } = req.params
        const data = await Permissions.findOne({
            where: { id }
        });
        return res.status(200).json({ data: data.toJSON() });
    }
    catch (err) {
        return res.status(500).json(err.message);
    }
}

exports.update = async (req, res) => {
    try {
        const { id } = req.params
        let payload = req.body
        const [count, data] = await Permissions.update(payload, {
            where: { id }, returning: true, plain: true
        });
        return res.status(200).json({ data })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(err.message)
    }
}

exports.delete = async (req, res) => {
    try {
        const { id } = req.params
        await Permissions.destroy({
            where: { id }
        });
        return res.status(200).json("Record deleted")
    }
    catch (err) {
        return res.status(500).json(err.message)
    }
}
