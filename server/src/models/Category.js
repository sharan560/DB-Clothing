const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String },
  image: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  seoTitle: { type: String },
  seoDescription: { type: String },
}, { timestamps: true });

categorySchema.index({ isActive: 1, order: 1 });

module.exports = mongoose.model('Category', categorySchema);
