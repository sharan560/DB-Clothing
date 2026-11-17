const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const ReturnRequest = require('../models/ReturnRequest');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();
router.use(protect, adminOnly);

// GET /api/admin/dashboard
router.get('/dashboard', async (req, res, next) => {
  try {
    const [totalOrders, totalRevenue, pendingOrders, lowStockProducts, recentOrders, totalCustomers] = await Promise.all([
      Order.countDocuments({ paymentStatus: 'paid' }),
      Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.countDocuments({ status: 'pending' }),
      Product.countDocuments({ 'variants.stock': { $lte: 5 }, isActive: true }),
      Order.find({ paymentStatus: 'paid' }).sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
      User.countDocuments({ role: 'customer' }),
    ]);

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingOrders,
        lowStockProducts,
        totalCustomers,
        recentOrders,
      },
    });
  } catch (err) { next(err); }
});

// GET /api/admin/customers
router.get('/customers', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = { role: 'customer' };
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
    const skip = (Number(page) - 1) * Number(limit);
    const [customers, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(query),
    ]);
    res.json({ success: true, data: customers, pagination: { total, page: Number(page), limit: Number(limit) } });
  } catch (err) { next(err); }
});

// GET /api/admin/returns
router.get('/returns', async (req, res, next) => {
  try {
    const returns = await ReturnRequest.find()
      .populate('order', 'orderNumber total')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: returns });
  } catch (err) { next(err); }
});

// PATCH /api/admin/returns/:id
router.patch('/returns/:id', async (req, res, next) => {
  try {
    const ret = await ReturnRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: ret });
  } catch (err) { next(err); }
});

module.exports = router;
