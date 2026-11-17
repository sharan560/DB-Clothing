const express = require('express');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/orders — customer's orders
router.get('/', protect, async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .select('-razorpaySignature'),
      Order.countDocuments({ user: req.user._id }),
    ]);
    res.json({ success: true, data: orders, pagination: { total, page: Number(page), limit: Number(limit) } });
  } catch (err) { next(err); }
});

// GET /api/orders/:id — single order
router.get('/:id', protect, async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
      .select('-razorpaySignature');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
});

// GET /api/orders/track/:orderNumber — order tracking (public, with email verification)
router.get('/track/:orderNumber', async (req, res, next) => {
  try {
    const { email } = req.query;
    const query = { orderNumber: req.params.orderNumber };
    if (email) query.$or = [{ guestEmail: email.toLowerCase() }];

    const order = await Order.findOne(query)
      .select('orderNumber status paymentStatus trackingNumber courier estimatedDelivery items shippingAddress createdAt');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
});

// PATCH /api/orders/:id/cancel — customer cancel (pending orders only)
router.patch('/:id/cancel', protect, async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage.' });
    }
    order.status = 'cancelled';
    order.cancelReason = req.body.reason || 'Cancelled by customer';
    order.cancelledAt = new Date();
    await order.save();
    res.json({ success: true, message: 'Order cancelled successfully.', data: order });
  } catch (err) { next(err); }
});

// ── Admin Routes ─────────────────────────────────────────────

// GET /api/orders/admin/all
router.get('/admin/all', protect, adminOnly, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, paymentStatus, search } = req.query;
    const query = {};
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (search) query.orderNumber = { $regex: search, $options: 'i' };
    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 }).skip(skip).limit(Number(limit))
        .populate('user', 'name email')
        .select('-razorpaySignature'),
      Order.countDocuments(query),
    ]);
    res.json({ success: true, data: orders, pagination: { total, page: Number(page), limit: Number(limit) } });
  } catch (err) { next(err); }
});

// PATCH /api/orders/admin/:id — update status, tracking (admin)
router.patch('/admin/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const { status, trackingNumber, trackingUrl, courier, estimatedDelivery, adminNotes, paymentStatus } = req.body;
    const update = {};
    if (status) update.status = status;
    if (trackingNumber !== undefined) update.trackingNumber = trackingNumber;
    if (trackingUrl !== undefined) update.trackingUrl = trackingUrl;
    if (courier !== undefined) update.courier = courier;
    if (estimatedDelivery !== undefined) update.estimatedDelivery = estimatedDelivery;
    if (adminNotes !== undefined) update.adminNotes = adminNotes;
    if (paymentStatus) update.paymentStatus = paymentStatus;
    if (status === 'delivered') update.deliveredAt = new Date();

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
});

module.exports = router;
