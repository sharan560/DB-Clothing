const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String },
  image: { type: String },
  bannerImage: { type: String },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  type: {
    type: String,
    enum: ['new-arrivals', 'bestsellers', 'seasonal', 'featured', 'sale', 'editorial', 'custom'],
    default: 'custom',
  },
  badge: { type: String }, // e.g., "NEW", "HOT", "SALE"
  seoTitle: { type: String },
  seoDescription: { type: String },
}, { timestamps: true });

collectionSchema.index({ isActive: 1, order: 1 });

module.exports = mongoose.model('Collection', collectionSchema);
