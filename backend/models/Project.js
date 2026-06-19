const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    longDescription: { type: String },
    image: { type: String, default: '' },
    images: [{ type: String }],
    github: { type: String, default: '' },
    liveDemo: { type: String, default: '' },
    caseStudy: { type: String, default: '' },
    technologies: [{ type: String }],
    category: { type: String, default: 'Full Stack' },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['Live', 'Development', 'Archived'], default: 'Live' },
    date: { type: String, default: '' },
    features: [{ type: String }],
    role: { type: String, default: '' },
    architecture: { type: String },
    problem: { type: String },
    challenges: { type: String },
    solution: { type: String },
    performance: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
