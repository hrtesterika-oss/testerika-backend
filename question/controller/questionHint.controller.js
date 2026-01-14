require('dotenv').config();
const dbContext = require("../models");
const QuestionHints = dbContext.QuestionHints;

exports.create = async (req, res) => {
    try {
      await QuestionHints.create(req.body)
            .then((data) => {
                res.status(200).json(data)
            })
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.findAll = async (req, res) => {
    try {
        const data = await QuestionHints.findAll();
        return res.status(200).json(data)
    }
    catch (err) {
        return res.status(500).json(err)
    }
}

exports.findById = async (req, res) => {
    try {
        const { id } = req.params
        const data = await QuestionHints.findOne({
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
        const [count, data] = await QuestionHints.update(payload, {
            where: { id }, returning: true, plain: true
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
        await QuestionHints.destroy({
            where: { id }
        });
        return res.status(200).json("Record deleted")
    }
    catch (err) {
        return res.status(500).json(err)
    }
}