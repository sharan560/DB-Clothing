const mongoose = require('mongoose');

const productImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  alt: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { _id: false });

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true }, // S, M, L, XL, XXL, 28, 30, 32...
  color: { type: String, default: 'Default' },
  colorHex: { type: String, default: '#000000' },
  sku: { type: String, unique: true, sparse: true },
  stock: { type: Number, required: true, min: 0, default: 0 },
  priceOverride: { type: Number, min: 0 }, // if different from base price
  isActive: { type: Boolean, default: true },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 200 },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  material: { type: String },
  care: { type: String },
  basePrice: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 }, // crossed-out price (before discount)
  images: [productImageSchema],
  variants: [variantSchema],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  collections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }],
  tags: [{ type: String, lowercase: true }],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isBestseller: { type: Boolean, default: false },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  totalSold: { type: Number, default: 0 },
  seoTitle: { type: String, maxlength: 60 },
  seoDescription: { type: String, maxlength: 160 },
  seoKeywords: [{ type: String }],
  weight: { type: Number }, // grams, for shipping
  fit: { type: String }, // Regular, Slim, Oversized
  occasion: [{ type: String }], // Casual, Formal, Party, etc.
}, { timestamps: true });

// Text index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1, isFeatured: 1 });

// Virtual: discountPercent
productSchema.virtual('discountPercent').get(function () {
  if (this.originalPrice && this.originalPrice > this.basePrice) {
    return Math.round(((this.originalPrice - this.basePrice) / this.originalPrice) * 100);
  }
  return 0;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
