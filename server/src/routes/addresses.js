const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

const addressSchema = {
  validate: (addr) => {
    if (!addr.line1 || !addr.city || !addr.state || !addr.pincode) {
      return 'Line 1, city, state, and pincode are required.';
    }
    if (!/^[1-9][0-9]{5}$/.test(addr.pincode)) return 'Invalid pincode.';
    return null;
  },
};

// GET /api/addresses
router.get('/', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('addresses');
    res.json({ success: true, data: user?.addresses || [] });
  } catch (err) { next(err); }
});

module.exports = router;
