const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  description: { type: String },
  type: { type: String, enum: ['percentage', 'fixed'], required: true },
  value: { type: Number, required: true, min: 0 }, // percent (0–100) or INR amount
  minOrderValue: { type: Number, default: 0 },
  maxDiscountAmount: { type: Number }, // cap for percentage discounts
  maxUses: { type: Number }, // null = unlimited
  usedCount: { type: Number, default: 0 },
  perUserLimit: { type: Number, default: 1 },
  applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // empty = all
  applicableCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  startsAt: { type: Date },
  expiresAt: { type: Date },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
