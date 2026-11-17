const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  line1: { type: String, required: true },
  line2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true, match: /^[1-9][0-9]{5}$/ },
  country: { type: String, default: 'India' },
}, { _id: false });

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: { type: String, required: true }, // snapshot
  productImage: { type: String },
  size: { type: String, required: true },
  color: { type: String },
  sku: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true }, // snapshot at purchase time
  totalPrice: { type: Number, required: true },
}, { _id: true });

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', sparse: true },
  guestEmail: { type: String }, // for guest checkout
  guestName: { type: String },
  guestPhone: { type: String },

  items: [orderItemSchema],

  shippingAddress: { type: addressSchema, required: true },
  billingAddress: { type: addressSchema },

  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  shippingCharge: { type: Number, default: 0 },
  total: { type: Number, required: true },

  coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
  couponCode: { type: String },

  // Payment
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending',
  },
  paymentMethod: { type: String, default: 'razorpay' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String, select: false },

  // Fulfilment
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending',
  },
  trackingNumber: { type: String },
  trackingUrl: { type: String },
  courier: { type: String },
  estimatedDelivery: { type: Date },

  notes: { type: String },
  adminNotes: { type: String },
  cancelledAt: { type: Date },
  cancelReason: { type: String },
  deliveredAt: { type: Date },

  idempotencyKey: { type: String, unique: true, sparse: true },
}, { timestamps: true });

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ razorpayOrderId: 1 });

module.exports = mongoose.model('Order', orderSchema);
