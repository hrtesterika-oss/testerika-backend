require('dotenv').config();
const dbContext = require("../models");
const QuestionCourses = dbContext.QuestionCourses;
const Questions = dbContext.Questions;

exports.create = async (req, res) => {
    try {
        const { subject_id, question_bank_id, course_id } = req.body;
        const courses = course_id.flatMap((item, index) => [{
            question_bank_id,
            course_id: item
        }])
        await Questions.update({
            subject_id
        }, { where: { id: question_bank_id } })
        await QuestionCourses.bulkCreate(courses)
            .then((data) => {
                res.status(200).json(data)
            })
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.findAll = async (req, res) => {
    try {
        const data = await QuestionCourses.findAll();
        return res.status(200).json(data)
    }
    catch (err) {
        return res.status(500).json(err)
    }
}

exports.findById = async (req, res) => {
    try {
        const { id } = req.params
        const data = await QuestionCourses.findOne({
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
        const {
            subject_id,
            course_id,
        } = req.body;
        const { id } = req.params
        const courses = await QuestionCourses.findAll({ where: { question_bank_id: id } });
        let courses_ids = courses.flatMap(item => [item.course_id])
        for (let item of course_id) {
            let course = courses_ids.find((x) => x == item)
            if (!course) {
                QuestionCourses.create({ question_bank_id: id, course_id: item })
            }
        }
        for (let item of courses_ids) {
            let course = course_id.find(x => x == item)
            if (!course) {
                QuestionCourses.destroy({ where: { course_id: item } })
            }
        }
        await Questions.update({
            subject_id
        }, { where: { id } })
        return res.status(200).json({ message: "records updated." })
    }
    catch (err) {
        return res.status(500).json(err)
    }
}

exports.delete = async (req, res) => {
    try {
        const { id } = req.params
        await QuestionCourses.destroy({
            where: { id }
        });
        return res.status(200).json("Record deleted")
    }
    catch (err) {
        return res.status(500).json(err)
    }
}