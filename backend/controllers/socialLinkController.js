const SocialLink = require('../models/SocialLink');

exports.getAll = async (req, res, next) => {
  try {
    const links = await SocialLink.find().sort({ order: 1 });
    res.json(links);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const link = await SocialLink.create(req.body);
    res.status(201).json(link);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const link = await SocialLink.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!link) return res.status(404).json({ message: 'Social link not found' });
    res.json(link);
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const link = await SocialLink.findByIdAndDelete(req.params.id);
    if (!link) return res.status(404).json({ message: 'Social link not found' });
    res.json({ message: 'Social link deleted' });
  } catch (error) {
    next(error);
  }
};
