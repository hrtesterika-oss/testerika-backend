require('dotenv').config();
const dbContext = require("../models");
const CouponUses = dbContext.CouponUses
const { uploadImage } = require('../middleware/fileUploader');
const fs = require('fs')


exports.findAll = async (req, res) => {
    try {
        const data = await CouponUses.findAll();
        return res.status(200).json(data)
    }
    catch (err) {
        return res.status(500).json(err)
    }
}

exports.create = async (req, res) => {
    try {
        const data = await CouponUses.create(req.body);
        return res.status(200).json(data)
    }
    catch (err) {
        return res.status(500).json(err)
    }
}

exports.findById = async (req, res) => {
    try {
        const { id } = req.params
        const data = await CouponUses.findOne({
            where: { id }
        });
        return res.status(200).json(data);
    }
    catch (err) {
        return res.status(500).json(err);
    }
}

exports.update = async (req, res) => {
    try {
        const payload = req.body
        const [count, data] = await CouponUses.update(payload, {
            where: { id }, returning: true
        });
        return res.status(200).json(data)
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

exports.delete = async (req, res) => {
    try {
        const { id } = req.params
        await CouponUses.destro({
            where: { id }
        });
        return res.status(200).json("Record deleted")
    }
    catch (err) {
        return res.status(500).json(err)
    }
}