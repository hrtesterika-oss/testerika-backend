const express = require('express');
const router = express.Router();
const dbContext = require('../models');
const Options = dbContext.Options;

// Generic GET: fetch by setting name
const getByName = (name) => async (req, res) => {
  try {
    const data = await Options.findOne({ where: { name } });
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Generic POST/PUT: upsert by setting name
const upsertByName = (name) => async (req, res) => {
  try {
    const existing = await Options.findOne({ where: { name } });
    const value = JSON.stringify(req.body.value !== undefined ? req.body.value : req.body);
    if (existing) {
      await Options.update({ value }, { where: { name } });
    } else {
      await Options.create({ name, value, auto_load: 0 });
    }
    return res.status(200).json({ success: true, message: 'Settings updated successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const SETTING_NAMES = ['finance', 'customers', 'pdf', 'sms', 'cron-jobs', 'misc', 'cash-bonus', 'app-current-version'];

SETTING_NAMES.forEach((name) => {
  router.get(`/${name}`, getByName(name));
  router.post(`/${name}`, upsertByName(name));
  router.put(`/${name}`, upsertByName(name));
});

module.exports = router;
