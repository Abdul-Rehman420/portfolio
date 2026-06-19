const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    duration: { type: String, default: '' },
    cgpa: { type: String, default: '' },
    description: { type: String, default: '' },
    certificates: [{ type: String }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Education', educationSchema);
