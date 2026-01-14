require('dotenv').config();
const { Op } = require('sequelize');
const dbContext = require("../models");
const Coupons = dbContext.Coupons
const CouponUses = dbContext.CouponUses
const CouponDates = dbContext.CouponDates
const ResellerSales = dbContext.ResellerSales
const Sequelize = require('sequelize');
const e = require('express');

exports.findAll = async (req, res) => {
    try {
        let { page, items_per_page, search, filter_question_type, filter_level } = req.query
        let data;
        page = parseInt(page)
        items_per_page = parseInt(items_per_page)
        const offset = (page - 1) * items_per_page;
        const limit = items_per_page;
        const include = [
            {
                model: CouponUses,
                required: false,
                as: 'coupon_uses'
            },
            {
                model: CouponDates,
                required: false,
                as: 'coupon_dates'
            }
        ]
        if (search) {
            data = await Coupons.findAndCountAll({
                distinct: true,
                offset,
                limit,
                where: {
                    question_type: { [Op.like]: `%${search}%` }
                    // level: { [Op.like]: `%${search}%` }
                },
                order: [
                    ['id', 'DESC']
                ],
                include: include
            })
        }

        else {
            data = await Coupons.findAndCountAll({
                distinct: true,
                offset,
                limit,
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
        return res.status(500).json(err.message)
    }
}

exports.create = async (req, res) => {
    try {
        let {
            id
        } = req.body
        let payload = {
            coupon_title: req.body.coupon_title,
            coupon_code: req.body.coupon_code,
            percentage: req.body.percentage,
            minimum_order_price: req.body.minimum_order_price,
            avail_on_purchase: req.body.avail_on_purchase,
            visible_on_app: req.body.visible_on_app,
            description: req.body.description,
        }
        let data
        if (id == undefined) {
            data = await Coupons.create(payload);
        } else {
            [, data] = await Coupons.update(payload, { where: { id }, returning: true, plain: true })
        }
        return res.status(200).json({ data: data.toJSON() })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(err.message)
    }
}

exports.updateCouponSetting = async (req, res) => {
    try {
        let {
            coupon_dates,
            coupon_uses
        } = req.body
        if (coupon_dates.id == undefined && coupon_uses.id == undefined) {
            await CouponDates.create(coupon_dates);
            await CouponUses.create(coupon_uses);
        } else {
            await CouponDates.update(coupon_dates, { where: { id: coupon_dates.id }, returning: true, plain: true })
            await CouponUses.update(coupon_uses, { where: { id: coupon_uses.id }, returning: true, plain: true })
        }
        return res.status(200).json({ message: 'Coupon settings updated!' })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(err.message)
    }
}

exports.findById = async (req, res) => {
    try {
        const { id } = req.params
        const data = await Coupons.findOne({
            where: { id },
            include: [
                {
                    model: CouponUses,
                    required: false,
                    as: 'coupon_uses'
                },
                {
                    model: CouponDates,
                    required: false,
                    as: 'coupon_dates'
                }
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
        const payload = req.body
        const id = req.params.id
        const [count, data] = await Coupons.update(payload, {
            where: { id }, returning: true, plain: true
        });
        return res.status(200).json({ data })
    }
    catch (err) {
        return res.status(500).json(err)
    }
}

exports.delete = async (req, res) => {
    try {
        const { id } = req.params
        await Coupons.destroy({
            where: { id }
        });
        return res.status(200).json("Record deleted")
    }
    catch (err) {
        return res.status(500).json(err)
    }
}


exports.createCoupon = async (req, res) => {
    try {
        const { coupon_code } = req.body
        let data2 = await Coupons.findOne({ where: { coupon_code: coupon_code?.trim() } })
        if (data2) {
            return res.status(200).json({
                success: false,
                message: "Coupon Already Exist.Please try again"
            })
        } else {
            const data = await Coupons.create(req.body)
            if (data) {
                return res.status(201).json({
                    success: true,
                    data
                })
            }
        }
    } catch (err) {
        return res.status(500).json({
            success: false
        })
    }
}
exports.getAllCoupon = async (req, res) => {
    try {
        let { page, items_per_page, search } = req.query
        let data;
        page = parseInt(page)
        items_per_page = parseInt(items_per_page)
        const offset = (page - 1) * items_per_page;
        const limit = items_per_page;
        if (search) {
            data = await Coupons.findAndCountAll({
                distinct: true,
                offset,
                limit,
                where: {
                    coupon_name: { [Op.like]: `%${search}%` }
                    // short_name: { [Op.like]: `%${search}%` }
                },
                order: [
                    ['id', 'DESC']
                ],
            })
        } else {
            data = await Coupons.findAndCountAll({
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

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false
        })
    }
}
exports.getCouponById = async (req, res) => {
    try {
        const data = await Coupons.findOne({ where: { id: req.params.id } })
        if (data) {
            return res.status(200).json({
                success: true,
                data
            })
        }
    } catch (err) {
        return res.status(500).json({
            success: false
        })
    }
}
exports.updateCouponById = async (req, res) => {
    try {
        const { coupon_code } = req.body
        let data2 = await Coupons.findOne({
            where: {
                coupon_code: coupon_code?.trim(), id: {
                    [Op.ne]: req.body.id
                }
            }
        })
        if (data2) {
            return res.status(200).json({
                success: false,
                message: "Coupon Already Exist.Please try again"
            })
        } else {
            await Coupons.update(req.body, { where: { id: req.params.id } })
            return res.status(200).json({
                success: true,
                message: "Coupon Updated Successfully"
            })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false
        })
    }
}
exports.deleteCouponById = async (req, res) => {
    try {
        await Coupons.destroy({ where: { id: req.params.id } })
        return res.status(200).json({
            success: true,
            message: "Coupon Deleted Successfully"
        })
    } catch (err) {
        return res.status(500).json({
            success: false
        })
    }
}
exports.checkCouponByCode = async (req, res) => {
    try {
        let { code } = req.params
        let data = await Coupons.findOne({ where: { coupon_code: code?.trim() } })
        if (data) {
            return res.status(200).json({
                success: true,
                error: false,
                message: "Coupon Already Exist"
            })
        } else {
            return res.status(200).json({
                success: false,
                error: false,
                message: "This is new Coupon Code"
            })
        }

    } catch (err) {
        return res.status(500).json({
            success: false
        })
    }
}



exports.getAllAuthorizedCouponForUser = async (req, res) => {
    try {
        const { id, email } = req.params
        let coupon_id_contain = []
        //   //getting all coupon (which has been not expired)
        const rows = await Coupons.findAll({
            where: {
                expiry_date: {
                    [Op.gte]: new Date()
                }, reseller: 0
            }
        })
        //   //filtering ALL coupon using user_id (or for everyone)
        rows.filter((item, index) => {
            let data = item?.user_id
            data?.map((item2) => {
                if (item2?.value == "Everyone") {
                    coupon_id_contain.push(item.id)
                } else if (item2?.value?.split("-")[0] == `${id}`) {
                    coupon_id_contain.push(item.id)
                }
            })
        })

        const dataCoupon = await Coupons.findAll({
            where: {
                id: coupon_id_contain, expiry_date: {
                    [Op.gte]: new Date()
                },
                visible_on_panel: 1
            }
        })
        return res.status(200).json({
            success: true,
            data: dataCoupon
        })
    } catch (err) {
        ErrorLogsFunction(err)
        return res.status(500).json({
            success: false
        })
    }
}

exports.getCouponUsingCouponCode = async (req, res) => {
    try {
        //   const {id,email}=req.params
        const { code, user_id, email } = req.body
        let coupon_id_contain = []
        //   //getting all coupon (which has been not expired)
        const rows = await Coupons.findOne({
            where: {
                coupon_code: code,
                expiry_date: {
                    [Op.gte]: new Date()
                }
            }
        })
        //   //filtering ALL coupon using user_id (or for everyone)
        if (rows) {
            let data = rows?.user_id
            data?.map((item2) => {
                if (rows?.reseller == 1) {
                    coupon_id_contain.push(rows.id)
                }
                else if (item2?.value == "Everyone") {
                    coupon_id_contain.push(rows.id)
                } else if (item2?.value?.split("-")[0] == `${user_id}`) {
                    coupon_id_contain.push(rows.id)
                }
            })
            if (coupon_id_contain?.length > 0) {
                const dataCoupon = await Coupons.findAll({
                    where: {
                        id: coupon_id_contain, expiry_date: {
                            [Op.gte]: new Date()
                        }
                        // visible_on_panel: 1
                    }
                })
                return res.status(200).json({
                    success: true,
                    data: dataCoupon
                })
            } else {
                return res.status(200).json({
                    success: false,
                    message: "Invalid Coupon code"
                })
            }


        } else {
            return res.status(200).json({
                success: false,
                message: "Invalid Coupon code"
            })
        }
    } catch (err) {
        ErrorLogsFunction(err)
        return res.status(500).json({
            success: false
        })
    }
}

exports.resellerSalesData = async (req, res) => {
    try {
        const { userid, couponid, transactionid } = req.body
        const findCoupon = await Coupons.findOne({
            where: {
                id: couponid,
                reseller: 1
            },
            attributes: ["id", "user_id", "reseller_payable_amount"]
        })

        if (!findCoupon) {
            return res.status(200).json({
                success: false,
                message: "Invalid details"
            })
        } else {
            const data = await ResellerSales.create({ reseller_id: findCoupon?.user_id[0]?.value?.split("-")[0], user_id: userid, sales_id: transactionid, coupon_id: findCoupon?.id, amount: findCoupon?.reseller_payable_amount, status: 0 })
            if (data) {
                return res.status(200).json({
                    success: true,
                    message: "Sales Created Successfully"
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

exports.getResellerCoupon = async (req, res) => {
    try {
        const { id } = req.params
        const findCoupon = await Coupons.findAll({
            where: {
                reseller: 1,
                [Sequelize.Op.and]: Sequelize.literal(`
            EXISTS (
              SELECT 1 FROM jsonb_array_elements("user_id"::jsonb) AS elem
              WHERE
                split_part(elem->>'value', '-', 1)::int = ${id} AND
                elem->>'value' NOT ILIKE 'Everyone%'
            )
          `)
            },
            attributes: ["id", "user_id", "coupon_name", "coupon_code", "description", "reseller", "reseller_payable_amount"]
        });

        if (findCoupon?.length <= 0) {
            return res.status(200).json({
                success: false,
                message: "Invalid details"
            })
        } else {
            return res.status(200).json({
                success: true,
                data: findCoupon
            })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false
        })
    }
}


exports.getAllSalesResellerCoupon = async (req, res) => {
    try {
        const { id, user_id } = req.params
        let { page, items_per_page } = req.query
        let data;
        page = parseInt(page)
        items_per_page = parseInt(items_per_page)
        const offset = (page - 1) * items_per_page;
        const limit = items_per_page;
        data = await ResellerSales.findAndCountAll({
            where: {
                reseller_id: user_id,
                coupon_id: id
            },
            distinct: true,
            offset,
            limit,
            order: [["id", "DESC"]],
            attributes: ["id", "reseller_id", "coupon_id", "user_id", "sales_id", "createdAt", "amount", "status"]
        });

        const coupons = await Coupons.findOne({
            where: {
                id,
                reseller: 1
            },
            attributes: ["id", "user_id", "coupon_name", "coupon_code", "description", "reseller", "reseller_payable_amount"]
        })
        if (coupons) {
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
                coupons,
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
        } else {
            return res.status(200).json({
                success: false,
                message: "Invalid details"
            })
        }

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false
        })
    }
}


exports.updateResellerSalesStatus = async (req, res) => {
    try {
        const { status } = req.body
        await ResellerSales.update({
            status
        }, {
            where: {
                id: req.params.id
            }
        })
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

exports.deleteResellerSalesStatus = async (req, res) => {
    try {
        await ResellerSales.destroy({
            where: {
                id: req.params.id
            }
        })
        return res.status(200).json({
            success: true,
            message: "Sales Deleted Successfully"
        })
    } catch (err) {
        return res.status(500).json({
            success: false
        })
    }
}




exports.getAllResellerSales = async (req, res) => {
    try {
        const { id } = req.params
        let { page, items_per_page } = req.query
        let data;
        page = parseInt(page)
        items_per_page = parseInt(items_per_page)
        const offset = (page - 1) * items_per_page;
        const limit = items_per_page;
        data = await ResellerSales.findAndCountAll({
            where: {
                reseller_id: id
            },
            distinct: true,
            offset,
            limit,
            order: [["id", "DESC"]],
            attributes: ["id", "reseller_id", "coupon_id", "user_id", "sales_id", "createdAt", "amount", "status"]
        });
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
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false
        })
    }
}



exports.getAllResellerSalesCounter = async (req, res) => {
    try {
        const { id } = req.params
        const findSales = await ResellerSales.findAll({
            where: {
                reseller_id: id
            },
            order: [["id", "DESC"]],
            attributes: ["id", "reseller_id", "coupon_id", "user_id", "sales_id", "createdAt", "amount", "status"]
        });



        if (findSales?.length <= 0) {
            return res.status(200).json({
                success: false,
                message: "Invalid details"
            })
        } else {

            return res.status(200).json({
                success: true,
                data: findSales,
            })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false
        })
    }
}