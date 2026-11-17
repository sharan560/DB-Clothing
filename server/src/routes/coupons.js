const express = require('express');
const Coupon = require('../models/Coupon');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/validate', async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    const coupon = await Coupon.findOne({ code: code?.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Invalid coupon code.' });

    const now = new Date();
    if (coupon.expiresAt && now > coupon.expiresAt) {
      return res.status(400).json({ success: false, message: 'This coupon has expired.' });
    }
    if (subtotal < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value of ₹${coupon.minOrderValue} required.`,
      });
    }

    res.json({ success: true, data: { type: coupon.type, value: coupon.value, maxDiscount: coupon.maxDiscountAmount } });
  } catch (err) { next(err); }
});

// Admin CRUD
router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, data: coupons });
  } catch (err) { next(err); }
});

router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const coupon = await Coupon.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: coupon });
  } catch (err) { next(err); }
});

router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: coupon });
  } catch (err) { next(err); }
});

router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Coupon deleted.' });
  } catch (err) { next(err); }
});

module.exports = router;
