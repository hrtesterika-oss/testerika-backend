require('dotenv').config();
const dbContext = require("../models");
const CouponDates = dbContext.CouponDates

exports.findAll = async (req, res) => {
  try {
    const data = await CouponDates.findAll();
    return res.status(200).json(data)
  }
  catch (err) {
    return res.status(500).json(err)
  }
}

exports.create = async (req, res) => {
  try {
    const data = await CouponDates.create(req.body);
    return res.status(200).json(data)
  }
  catch (err) {
    return res.status(500).json(err)
  }
}

exports.findById = async (req, res) => {
  try {
    const { id } = req.params
    const data = await CouponDates.findOne({
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
    const [count, data] = await CouponDates.update(req.body, {
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
    await CouponDates.destro({
      where: { id }
    });
    return res.status(200).json("Record deleted")
  }
  catch (err) {
    return res.status(500).json(err)
  }
}