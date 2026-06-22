const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Category name is required'],
      unique: true,
      trim: true 
    },
    slug: { 
      type: String, 
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true 
    },
    description: { 
      type: String, 
      default: '' 
    },
    isHidden: { 
      type: Boolean, 
      default: false 
    },
    order: { 
      type: Number, 
      default: 0 
    },
  },
  { timestamps: true }
);

// Auto-generate slug from name
categorySchema.pre('save', async function(next) {
  try {
    if (this.isModified('name') || this.isNew) {
      let baseSlug = this.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      // Handle empty slug
      if (!baseSlug) {
        baseSlug = 'category';
      }
      
      // Make slug unique
      const Category = mongoose.model('Category');
      let slug = baseSlug;
      let counter = 1;
      let existing = await Category.findOne({ slug });
      
      // If this is an update, exclude the current document from the check
      while (existing && (!this._id || existing._id.toString() !== this._id.toString())) {
        slug = `${baseSlug}-${counter}`;
        existing = await Category.findOne({ slug });
        counter++;
      }
      
      this.slug = slug;
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-validate hook to ensure slug is always set
categorySchema.pre('validate', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    if (!this.slug) {
      this.slug = 'category';
    }
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);