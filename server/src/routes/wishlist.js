const express = require('express');
const Wishlist = require('../models/Wishlist');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate({
        path: 'products',
        match: { isActive: true },
        select: 'name slug basePrice originalPrice images averageRating reviewCount',
      });
    res.json({ success: true, data: wishlist?.products || [] });
  } catch (err) { next(err); }
});

router.post('/toggle', protect, async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ success: false, message: 'Product ID required.' });

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = new Wishlist({ user: req.user._id, products: [] });

    const idx = wishlist.products.indexOf(productId);
    let added;
    if (idx > -1) {
      wishlist.products.splice(idx, 1);
      added = false;
    } else {
      wishlist.products.push(productId);
      added = true;
    }
    await wishlist.save();
    res.json({ success: true, added, message: added ? 'Added to wishlist.' : 'Removed from wishlist.' });
  } catch (err) { next(err); }
});

module.exports = router;
