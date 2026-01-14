require('dotenv').config();
const dbContext = require("../models");
const crypto = require('crypto')
const QuestionOptions = dbContext.QuestionOptions;
const QuizCourses = dbContext.QuizCourses;
const QuizDates = dbContext.QuizDates;
const QuizPrizeDetails = dbContext.QuizPrizeDetails;
const QuizQuestions = dbContext.QuizQuestions;
const QuizResultAnalysis = dbContext.QuizResultAnalysis;
const QuizResults = dbContext.QuizResults;
const { uploadImage } = require('../middleware/fileUploader');
const Questions = dbContext.Questions
const QuestionHints = dbContext.QuestionHints
const QuestionSolutions = dbContext.QuestionSolutions
const QuestionVerified = dbContext.QuestionVerified
const QuestionBanks = dbContext.QuestionBanks
const QuestionCourses = dbContext.QuestionCourses
const QuestionMarks = dbContext.QuestionMarks
const PassageBank = dbContext.PassageBanks
const Passages = dbContext.Passages
const PassageCourse = dbContext.PassageCourse
const PassageMarks = dbContext.PassageMarks
const axios = require("axios");
const { QUIZ_URL } = require('../services');


// create Passage 
exports.create = async (req, res) => {
    try {
        const { passageDetail, id } = req.body
        let { passage, language } = passageDetail
        let data;
        if (id == undefined || !id) {
            data = await PassageBank.create({
                status: 1
            })
        } else {
            await PassageBank.update({
                status: 1
            }, {
                where: { id },
                returning: true,
                plain: true
            });
        }

        passage = await Passages.create({
            passage_bank_id: data?.id ? data?.id : id,
            passage: passage.passage,
            language: language.label
        })
        return res.status(200).json({
            success: true,
            message: "Passage Added Successfully",
            data: {
                id: data?.id ? data?.id : id,
                passage,
                language
            }
        })
    }
    catch (err) {
        console.log(err, "err")
        res.status(500).send(err.message)
    }
};


exports.findAll = async (req, res) => {
    try {
        let { page, items_per_page } = req.query
        let data;
        page = parseInt(page)
        items_per_page = parseInt(items_per_page)
        const offset = (page - 1) * items_per_page;
        const limit = items_per_page;
        const include = [
            {
                model: Passages,
                required: false,
                as: 'passages'
            }
        ]

        data = await PassageBank.findAndCountAll({
            offset,
            limit,
            distinct: true,
            order: [
                ['id', 'DESC']
            ],
            include: include
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
    }
    catch (err) {
        return res.status(500).json(err)
    }
}


exports.getPassageDetails = async (req, res) => {
    try {
        const { passageBankId } = req.params
        const data = await PassageBank.findOne({
            where: { id: passageBankId },
            include: [
                {
                    model: Passages,
                    required: false,
                    as: 'passages',
                    order: [["id", "ASC"]]
                }
            ]
        })
        return res.status(200).json({
            success: true,
            data
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false
        })
    }
}

exports.updatePassage = async (req, res) => {
    try {
        const { passageBankId, passageId } = req.params
        const { passageDetail } = req.body
        let { passage, language } = passageDetail
        await Passages.update({ passage: passage.passage }, { where: { id: passageId,passage_bank_id:passageBankId }, returning: true, plain: true })
        return res.status(200).json({
            success: true,
            message: "Passage Updated Successfully",
            data: {
                id:passageBankId,
                passage,
                language
            }
        })
    }
    catch (err) {
        console.log(err, "err")
        res.status(500).send(err.message)
    }
};

exports.getQuestionUsingPassageBankIdAndLanguage = async (req, res) => {
    try {
        const { passageBankId, language } = req.params
        const data = await Passages.findOne({
            where: { passage_bank_id: passageBankId, language }
        })
        return res.status(200).json({
            success: true,
            data
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false
        })
    }
}
exports.delete = async (req, res) => {
    let question_ids = []
    let question_bank_ids = []

    const findQuesBank = await QuestionBanks.findAll({
        where: {
            passage_bank_id: req.params.id
        },
        attributes: ["id","passage_bank_id"]
    })
    question_bank_ids = findQuesBank?.map((item) => item?.id)
    const findQues = await Questions.findAll({
        where: {
            question_bank_id: question_bank_ids
        },
        attributes: ["id","question_bank_id"]
    })
    question_ids = findQues?.map((item) => item?.id)

    await QuestionOptions.destroy({
        where: {
            question_id: question_ids
        }
    })
    await Questions.destroy({
        where: {
            id: question_ids
        }
    })
    await QuestionBanks.destroy({
        where:{
            passage_bank_id:req.params.id
        }
    })

    await Passages.destroy({
        where: { passage_bank_id: req.params.id },
    })
    await PassageBank.destroy({ where: { id: req.params.id } })
    res.status(200).json({
        msg: "Passage deleted.",
    })
};
exports.deletePassage = async (req, res) => {
    const findPassage = await Passages.findOne({
        where: {
            id: req.params.id
        }
    })
    if (findPassage) {
        const findLength = await Passages.findAll({
            where: {
                passage_bank_id: findPassage?.passage_bank_id
            }
        })
        if (findLength?.length <= 1) {
            let question_ids = []
            let question_bank_ids = []
        
            const findQuesBank = await QuestionBanks.findAll({
                where: {
                    passage_bank_id: findPassage?.passage_bank_id
                },
                attributes: ["id","passage_bank_id"]
            })
            question_bank_ids = findQuesBank?.map((item) => item?.id)
            const findQues = await Questions.findAll({
                where: {
                    question_bank_id: question_bank_ids
                },
                attributes: ["id","question_bank_id"]
            })
            question_ids = findQues?.map((item) => item?.id)
        
            await QuestionOptions.destroy({
                where: {
                    question_id: question_ids
                }
            })
            await Questions.destroy({
                where: {
                    id: question_ids
                }
            })
            await QuestionBanks.destroy({
                where:{
                    passage_bank_id:findPassage?.passage_bank_id
                }
            })
        
            await Passages.destroy({
                where: { passage_bank_id: req.params.id },
            })
            await PassageBank.destroy({ where: { id: req.params.id } })
            res.status(200).json({
                msg: "Passage deleted.",
            })
        } else {
            await Passages.destroy({ where: { id: req.params.id } })
            res.status(200).json({
                msg: "Passage deleted.",
            })
        }
    } else {
        return res.status(200).json({
            status: false
        })
    }
};




exports.createQuestion = async (req, res) => {
    try {

        const { id, questionDetail } = req.body
        let { question, language, options } = questionDetail
        const passageBank = await PassageBank.findOne({
            where: {
                id
            }
        })
        if (!passageBank) {
            return res.status(200).json({
                success: false
            })
        } else {

            let findPassage = await Passages.findOne({
                where: {
                    passage_bank_id: passageBank?.id,
                    language: language?.label
                }
            })
            if (!findPassage) {
                return res.status(200).json({
                    success: false,
                    message: "Passage not found"
                })
            } else {
                const findQuestion = await Questions.findOne({
                    where: {
                        passage_id: findPassage?.id,
                        language: language?.label
                    }
                })
                if (!findQuestion) {
                    question = await Questions.create({
                        passage_id: findPassage?.id,
                        question: question.question,
                        language: language.label
                    })
                    if (question && question?.id) {
                        options = options.flatMap(x => [{
                            question_id: question.id,
                            option: x.option,
                            right_option: x.right_option
                        }])
                        options = await QuestionOptions.bulkCreate(options)

                        question = await Questions.findOne({
                            where: {
                                id: question?.id
                            },
                            include: [
                                {
                                    model: QuestionOptions,
                                    required: false,
                                    as: "options"
                                }
                            ]
                        })
                        return res.status(200).json({
                            success: true,
                            message: "Question added successfully",
                            id,
                            questionDetail: {
                                question,
                                language
                            }
                        })
                    } else {
                        return res.status(200).json({
                            success: false,
                            message: "Something went wrong"
                        })
                    }
                } else {
                    await Questions.update({
                        question: question.question
                    }, {
                        where: {
                            id: question?.id,
                            passage_id: findPassage?.id,
                            language: language?.label
                        }
                    })
                    let findAllOptions = await QuestionOptions.findAll({ where: { question_id: question?.id } })
                    let ids = findAllOptions.map((item) => item.id)
                    for (let item of options) {
                        if (item?.id && ids.includes(item?.id)) {
                            if (item.right_option === 1) {
                                await QuestionOptions.update({ option: item.option, right_option: 1 }, { where: { id: item.id, question_id: question?.id } })
                            } else {
                                await QuestionOptions.update({ option: item.option, right_option: 0 }, { where: { id: item.id, question_id: question?.id } })
                            }
                        } else {
                            const data2 = await QuestionOptions.create({ option: item.option, right_option: item.right_option, question_id: Number(question?.id) })
                        }
                    }

                    question = await Questions.findOne({
                        where: {
                            id: question?.id
                        },
                        include: [
                            {
                                model: QuestionOptions,
                                required: false,
                                as: "options"
                            }
                        ]
                    })
                    return res.status(200).json({
                        success: true,
                        message: "Question added successfully",
                        id,
                        questionDetail: {
                            question,
                            language
                        }
                    })
                }
            }
        }
    }
    catch (err) {
        console.log(err, "err")
        res.status(500).send(err.message)
    }
};

exports.getQuestionUsingLanguage = async (req, res) => {
    try {
        const { id, language } = req.body
        const passageBank = await PassageBank.findOne({
            where: {
                id
            }
        })
        if (!passageBank) {
            return res.status(200).json({
                success: false
            })
        } else {
            let findPassage = await Passages.findOne({
                where: {
                    passage_bank_id: passageBank?.id,
                    language: language?.label
                }
            })
            if (!findPassage) {
                return res.status(200).json({
                    success: false,
                    message: "Passage not found"
                })
            } else {
                const findQuestion = await Questions.findOne({
                    where: {
                        passage_id: findPassage?.id,
                        language: language?.label
                    },
                    include: [
                        {
                            model: QuestionOptions,
                            required: false,
                            as: "options"
                        }
                    ]
                })
                if (!findQuestion) {
                    return res.status(200).json({
                        success: false,
                        message: "Question not found"
                    })
                } else {
                    return res.status(200).json({
                        success: true,
                        findQuestion,
                        language
                    })
                }
            }
        }
    }
    catch (err) {
        console.log(err, "err")
        res.status(500).send(err.message)
    }
};

exports.deleteOption = async (req, res) => {
    try {
        const { id } = req.params
        const data = await QuestionOptions.destroy({ where: { id } });
        res.status(200).json({
            success: true,
            message: "Option Deleted Successfully"
        })
    } catch (err) {
        console.log(err, "err")
        res.status(500).json(err)
    }
}



exports.getPassages = async (req, res) => {
    try {
        const { id } = req.params
        const data = await Passages.findAll({
            where: { passage_bank_id:id }
        })
        return res.status(200).json({
            success: true,
            data
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false
        })
    }
}
