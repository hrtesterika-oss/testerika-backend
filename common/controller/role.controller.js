require('dotenv').config();
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const dbContext = require("../models");
const Roles = dbContext.Roles
const Permissions = dbContext.Permissions
const RolePermissions = dbContext.RolePermissions
const Staff = dbContext.Staff

exports.findAll = async (req, res) => {
    try {
        let { page, items_per_page, search } = req.query
        let data;
        page = parseInt(page)
        items_per_page = parseInt(items_per_page)
        const offset = (page - 1) * items_per_page;
        const limit = items_per_page;
        if (search) {
            data = await Roles.findAndCountAll({
                distinct: true,
                offset,
                limit,
                where: {
                    name: { [Op.like]: `%${search}%` }
                    // short_name: { [Op.like]: `%${search}%` }
                },
                include: [
                    {
                        model: Staff,
                        required: false,
                        as: 'assigned_to'
                    }
                ],
                order: [
                    ['id', 'DESC']
                ],
            })
        } else {
            data = await Roles.findAndCountAll({
                distinct: true,
                offset,
                limit,
                include: [
                    {
                        model: Staff,
                        required: false,
                        as: 'assigned_to'
                    }
                ],
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

exports.getRoles = async (req, res) => {
    try {
        const data = await Roles.findAll();

        return res.status(200).json({ data })
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.findAllPermissions = async (req, res) => {
    try {
        const data = await Permissions.findAll({
            where: {
                core_permission: true
            }
        });

        return res.status(200).json({ data })
    }
    catch (err) {
        console.log(err, "err")
        return res.status(500).json(err.message)
    }
}

exports.create = async (req, res) => {
    try {
        const { name, role_permission } = req.body
        
        const data = await Roles.create({ name });
        if(role_permission && role_permission?.length>0){
            const role_permissions = role_permission?.flatMap((item, i) => [{
                role_id: data.id,
                permission_id: item.permission_id,
                can_view: item.can_view,
                can_view_own: item.can_view_own,
                can_create: item.can_create,
                can_edit: item.can_edit,
                can_delete: item.can_delete
            }]);
            await RolePermissions.bulkCreate(role_permissions);
        }
       
        return res.status(200).json({ data, message: "Records created!" })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

exports.findById = async (req, res) => {
    try {
        const { id } = req.params
        const data = await Roles.findOne({
            where: { id },
            include: [
                {
                    model: RolePermissions,
                    required: false,
                    as: 'permissions'
                }
            ]
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
        let { name, permissions } = req.body

        for (let item of permissions) {
            const [data, created] = await RolePermissions.findOrCreate({
                where: { permission_id: item.permission_id, role_id: id },
                defaults: item
            });
            if (!created) {
                await RolePermissions.update(item, {
                    where: { id: item.id }
                })
            }
        }
        const [count, data] = await Roles.update({ name }, {
            where: { id }, returning: true, plain: true
        });
        return res.status(200).json({ data })
    }
    catch (err) {
        console.log(err, "err")
        return res.status(500).json(err.message)
    }
}

exports.delete = async (req, res) => {
    try {
        const { id } = req.params
        const data = await RolePermissions.findAll({
            where: { role_id: id }
        })
        const ids = data.flatMap(x => [x.id])
        await RolePermissions.destroy({ where: { id: ids } })
        await Roles.destroy({
            where: { id }
        });
        return res.status(200).json("Record deleted")
    }
    catch (err) {
        console.log(err, "err")
        return res.status(500).json(err.message)
    }
}