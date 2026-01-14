require('dotenv').config();
const { uploadImage } = require('../middleware/fileUploader');
const dbContext = require("../models");
const Sliders = dbContext.Sliders
const fs = require('fs')

exports.findAll = async (req, res) => {
    try {
        const data = await Sliders.findAll();
        return res.status(200).json(data)
    }
    catch (err) {
        return res.status(500).json(err)
    }
}

exports.create = async (req, res) => {
    try {
        const file = req.file
        let image = ''
        if (file) {
            let data = await uploadImage(file)
            if (data && data.Location) {
                image = data.Location
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            } else {
                return res.status(500).send('Error in uploading Image!')
            }
        }
        const data = await Sliders.create({ ...req.body, image });
        return res.status(200).json(data)
    }
    catch (err) {
        return res.status(500).json(err)
    }
}

exports.findById = async (req, res) => {
    try {
        const { id } = req.params
        const data = await Sliders.findOne({
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
        const file = req.file
        let payload = req.body
        if (file) {
            let data = await uploadImage(file)
            if (data && data.Location) {
                payload = { ...payload, image: data.Location }
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            } else {
                return res.status(500).send('Error in uploading Image!')
            }
        }
        const [count, data] = await Sliders.update(payload, {
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
        await Sliders.destroy({
            where: { id }
        });
        return res.status(200).json("Record deleted")
    }
    catch (err) {
        return res.status(500).json(err)
    }
}