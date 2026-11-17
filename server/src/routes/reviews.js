const express = require('express');
const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/reviews/:productId
router.get('/:productId', async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, isApproved: true })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (err) { next(err); }
});

// POST /api/reviews — verified purchasers only
router.post('/', protect, async (req, res, next) => {
  try {
    const { productId, orderId, rating, title, body } = req.body;

    // Verify purchase
    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
      paymentStatus: 'paid',
      'items.product': productId,
    });
    if (!order) {
      return res.status(403).json({ success: false, message: 'You can only review products you have purchased.' });
    }

    const existing = await Review.findOne({ product: productId, user: req.user._id });
    if (existing) {
      return res.status(409).json({ success: false, message: 'You have already reviewed this product.' });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      order: orderId,
      rating,
      title,
      body,
      isVerifiedPurchase: true,
    });

    // Update product rating
    const all = await Review.find({ product: productId, isApproved: true });
    const avg = all.reduce((s, r) => s + r.rating, 0) / (all.length || 1);
    await Product.findByIdAndUpdate(productId, { averageRating: avg.toFixed(1), reviewCount: all.length });

    res.status(201).json({ success: true, data: review, message: 'Review submitted for approval.' });
  } catch (err) { next(err); }
});

// PATCH /api/reviews/:id/approve — admin
router.patch('/:id/approve', protect, adminOnly, async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: req.body.approved !== false, adminNote: req.body.note },
      { new: true }
    );
    // Recalculate rating
    const all = await Review.find({ product: review.product, isApproved: true });
    const avg = all.reduce((s, r) => s + r.rating, 0) / (all.length || 1);
    await Product.findByIdAndUpdate(review.product, { averageRating: avg.toFixed(1), reviewCount: all.length });
    res.json({ success: true, data: review });
  } catch (err) { next(err); }
});

// GET /api/reviews/admin/pending — admin
router.get('/admin/pending', protect, adminOnly, async (req, res, next) => {
  try {
    const reviews = await Review.find({ isApproved: false })
      .populate('user', 'name email')
      .populate('product', 'name slug');
    res.json({ success: true, data: reviews });
  } catch (err) { next(err); }
});

module.exports = router;
