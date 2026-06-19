const Settings = require('../models/Settings');

exports.getAll = async (req, res, next) => {
  try {
    const settings = await Settings.find();
    const map = {};
    settings.forEach((s) => { map[s.key] = s.value; });
    res.json(map);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updates = req.body;
    const results = {};
    for (const [key, value] of Object.entries(updates)) {
      results[key] = await Settings.findOneAndUpdate(
        { key },
        { value },
        { upsert: true, new: true }
      );
    }
    res.json({ message: 'Settings updated' });
  } catch (error) {
    next(error);
  }
};
