const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

const getCartQuery = (req) => {
  if (req.user) return { user: req.user._id };
  if (req.headers['x-session-id']) return { sessionId: req.headers['x-session-id'] };
  return null;
};

// GET /api/cart
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const query = getCartQuery(req);
    if (!query) return res.json({ success: true, data: null });

    const cart = await Cart.findOne(query).populate({
      path: 'items.product',
      select: 'name slug images basePrice variants isActive',
    }).populate('coupon', 'code type value');

    res.json({ success: true, data: cart });
  } catch (err) { next(err); }
});

// POST /api/cart/add
router.post('/add', optionalAuth, async (req, res, next) => {
  try {
    let { productId, variantIndex, size, quantity = 1 } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product is required.' });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    if (variantIndex === undefined && size) {
      variantIndex = product.variants.findIndex((v) => v.size === size);
    }
    if (variantIndex === undefined || variantIndex < 0 || variantIndex >= product.variants.length) {
      variantIndex = 0; // Default to first available variant
    }

    const variant = product.variants[variantIndex];
    if (!variant || (variant.isActive !== undefined && !variant.isActive)) {
      return res.status(400).json({ success: false, message: 'Selected variant is not available.' });
    }
    if (variant.stock < quantity) {
      return res.status(400).json({ success: false, message: `Only ${variant.stock} items available in stock.` });
    }

    const price = variant.priceOverride || product.basePrice;
    const query = getCartQuery(req);
    if (!query) return res.status(400).json({ success: false, message: 'Session ID required for guest cart.' });

    let cart = await Cart.findOne(query);
    if (!cart) cart = new Cart({ ...query, items: [] });

    const existingIdx = cart.items.findIndex(
      (i) => i.product.toString() === productId && i.variantIndex === variantIndex
    );

    if (existingIdx > -1) {
      const newQty = cart.items[existingIdx].quantity + quantity;
      if (newQty > variant.stock) {
        return res.status(400).json({ success: false, message: `Cannot add more. Only ${variant.stock} available.` });
      }
      cart.items[existingIdx].quantity = Math.min(newQty, 10);
    } else {
      cart.items.push({
        product: productId,
        variantIndex,
        size: variant.size,
        color: variant.color,
        quantity: Math.min(quantity, 10),
        price,
      });
    }

    await cart.save();
    const populated = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug images basePrice variants',
    });

    res.json({ success: true, data: populated, message: 'Item added to cart.' });
  } catch (err) { next(err); }
});

// PATCH /api/cart/item/:itemId — update quantity
router.patch('/item/:itemId', optionalAuth, async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const query = getCartQuery(req);
    if (!query) return res.status(400).json({ success: false, message: 'Cart not found.' });

    const cart = await Cart.findOne(query);
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found.' });

    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found in cart.' });

    if (quantity <= 0) {
      item.deleteOne();
    } else {
      item.quantity = Math.min(quantity, 10);
    }

    await cart.save();
    const populated = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug images basePrice variants',
    });

    res.json({ success: true, data: populated });
  } catch (err) { next(err); }
});

// DELETE /api/cart/item/:itemId
router.delete('/item/:itemId', optionalAuth, async (req, res, next) => {
  try {
    const query = getCartQuery(req);
    const cart = await Cart.findOne(query);
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found.' });

    cart.items.id(req.params.itemId)?.deleteOne();
    await cart.save();
    res.json({ success: true, message: 'Item removed.' });
  } catch (err) { next(err); }
});

// POST /api/cart/coupon — apply coupon
router.post('/coupon', optionalAuth, async (req, res, next) => {
  try {
    const { code } = req.body;
    const query = getCartQuery(req);
    const cart = await Cart.findOne(query).populate('items.product');
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found.' });

    const coupon = await Coupon.findOne({ code: code?.toUpperCase(), isActive: true });
    if (!coupon) return res.status(400).json({ success: false, message: 'Invalid or expired coupon code.' });

    const now = new Date();
    if (coupon.startsAt && now < coupon.startsAt) {
      return res.status(400).json({ success: false, message: 'This coupon is not yet active.' });
    }
    if (coupon.expiresAt && now > coupon.expiresAt) {
      return res.status(400).json({ success: false, message: 'This coupon has expired.' });
    }
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ success: false, message: 'This coupon has reached its usage limit.' });
    }

    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (subtotal < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value of ₹${coupon.minOrderValue} required for this coupon.`,
      });
    }

    let discount = coupon.type === 'percentage'
      ? (subtotal * coupon.value) / 100
      : coupon.value;

    if (coupon.maxDiscountAmount) discount = Math.min(discount, coupon.maxDiscountAmount);
    discount = Math.min(discount, subtotal);

    cart.coupon = coupon._id;
    cart.couponDiscount = Math.round(discount);
    await cart.save();

    res.json({
      success: true,
      message: `Coupon applied! You save ₹${Math.round(discount).toLocaleString('en-IN')}.`,
      discount: Math.round(discount),
    });
  } catch (err) { next(err); }
});

// DELETE /api/cart/coupon — remove coupon
router.delete('/coupon', optionalAuth, async (req, res, next) => {
  try {
    const query = getCartQuery(req);
    await Cart.findOneAndUpdate(query, { $unset: { coupon: '', couponDiscount: 0 } });
    res.json({ success: true, message: 'Coupon removed.' });
  } catch (err) { next(err); }
});

// DELETE /api/cart — clear cart
router.delete('/', optionalAuth, async (req, res, next) => {
  try {
    const query = getCartQuery(req);
    await Cart.findOneAndUpdate(query, { items: [], coupon: undefined, couponDiscount: 0 });
    res.json({ success: true, message: 'Cart cleared.' });
  } catch (err) { next(err); }
});

module.exports = router;
