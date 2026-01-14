require('dotenv').config();
const dbContext = require("../models");
const SubjectCourses = dbContext.SubjectCourses


exports.findAll = async (req, res) => {
    try {
        const data = await SubjectCourses.findAll();
        return res.status(200).json(data)
    }
    catch (err) {
        return res.status(500).json(err)
    }
}

exports.create = async (req, res) => {
    try {
        const data = await SubjectCourses.create(req.body);
        return res.status(200).json(data)
    }
    catch (err) {
        return res.status(500).json(err)
    }
}

exports.findById = async (req, res) => {
    try {
        const { id } = req.params
        const data = await SubjectCourses.findOne({
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
        const { id } = req.params
        let payload = req.body
        const [count, data] = await SubjectCourses.update(payload, {
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
        await SubjectCourses.destroy({
            where: { id }
        });
        return res.status(200).json("Record deleted")
    }
    catch (err) {
        return res.status(500).json(err)
    }
}