const mongoose = require('mongoose');

const returnRequestSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  orderItem: { type: mongoose.Schema.Types.ObjectId, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: {
    type: String,
    enum: ['wrong_size', 'wrong_item', 'damaged', 'not_as_described', 'changed_mind', 'other'],
    required: true,
  },
  description: { type: String, maxlength: 1000 },
  images: [{ type: String }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'processed'],
    default: 'pending',
  },
  adminNotes: { type: String },
  refundAmount: { type: Number },
  refundStatus: { type: String, enum: ['pending', 'initiated', 'completed'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('ReturnRequest', returnRequestSchema);
