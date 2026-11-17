const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true }, // must be verified purchaser
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, maxlength: 100 },
  body: { type: String, maxlength: 2000 },
  isApproved: { type: Boolean, default: false },
  isVerifiedPurchase: { type: Boolean, default: true },
  adminNote: { type: String },
}, { timestamps: true });

reviewSchema.index({ product: 1, isApproved: 1 });
reviewSchema.index({ user: 1, product: 1 }, { unique: true }); // one review per product per user

module.exports = mongoose.model('Review', reviewSchema);
