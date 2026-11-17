const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variantIndex: { type: Number, required: true }, // index in product.variants array
  size: { type: String, required: true },
  color: { type: String, default: 'Default' },
  quantity: { type: Number, required: true, min: 1, max: 10 },
  price: { type: Number, required: true }, // snapshot at add-to-cart time
}, { _id: true });

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', sparse: true },
  sessionId: { type: String, sparse: true }, // for guest carts
  items: [cartItemSchema],
  coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
  couponDiscount: { type: Number, default: 0 },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
}, { timestamps: true });

cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

cartSchema.virtual('subtotal').get(function () {
  return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

cartSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Cart', cartSchema);
