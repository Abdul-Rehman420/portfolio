const Certification = require('../models/Certification');

exports.getAll = async (req, res, next) => {
  try {
    const certifications = await Certification.find().sort({ order: 1 });
    res.json(certifications);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const certification = await Certification.create(req.body);
    res.status(201).json(certification);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const certification = await Certification.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!certification) return res.status(404).json({ message: 'Certification not found' });
    res.json(certification);
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const certification = await Certification.findByIdAndDelete(req.params.id);
    if (!certification) return res.status(404).json({ message: 'Certification not found' });
    res.json({ message: 'Certification deleted' });
  } catch (error) {
    next(error);
  }
};
