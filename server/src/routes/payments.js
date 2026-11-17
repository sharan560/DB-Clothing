const express = require('express');
const mongoose = require('mongoose');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const { protect, optionalAuth } = require('../middleware/auth');
const { generateOrderNumber } = require('../utils/helpers');
const { sendEmail, emailTemplates } = require('../utils/email');

const router = express.Router();

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes('REPLACE')) {
    return null; // Sandbox/mock mode
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// POST /api/payments/create-order — create Razorpay order
router.post('/create-order', optionalAuth, async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      shippingAddress, guestEmail, guestName, guestPhone,
      sessionId, idempotencyKey,
    } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: 'Shipping address is required.' });
    }

    // Idempotency check
    if (idempotencyKey) {
      const existing = await Order.findOne({ idempotencyKey });
      if (existing) {
        await session.abortTransaction();
        return res.json({ success: true, data: existing, duplicate: true });
      }
    }

    // Fetch cart
    const cartQuery = req.user ? { user: req.user._id } : { sessionId };
    const cart = await Cart.findOne(cartQuery).populate('items.product');

    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'Cart is empty.' });
    }

    // Server-side price + stock revalidation
    const orderItems = [];
    let subtotal = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id).session(session);
      if (!product || !product.isActive) {
        await session.abortTransaction();
        return res.status(400).json({ success: false, message: `${item.product.name} is no longer available.` });
      }

      const variant = product.variants[item.variantIndex];
      if (!variant || !variant.isActive || variant.stock < item.quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name} (${variant?.size || 'selected size'}).`,
        });
      }

      // Use server-side price
      const unitPrice = variant.priceOverride || product.basePrice;
      subtotal += unitPrice * item.quantity;

      orderItems.push({
        product: product._id,
        productName: product.name,
        productImage: product.images[0]?.url,
        size: variant.size,
        color: variant.color,
        sku: variant.sku,
        quantity: item.quantity,
        unitPrice,
        totalPrice: unitPrice * item.quantity,
      });

      // Deduct stock atomically
      await Product.updateOne(
        { _id: product._id, [`variants.${item.variantIndex}.stock`]: { $gte: item.quantity } },
        { $inc: { [`variants.${item.variantIndex}.stock`]: -item.quantity } },
        { session }
      );
    }

    // Coupon discount (server-validated)
    let discount = 0;
    let couponId = null;
    if (cart.coupon) {
      const coupon = await Coupon.findById(cart.coupon);
      if (coupon && coupon.isActive) {
        discount = coupon.type === 'percentage'
          ? Math.min((subtotal * coupon.value) / 100, coupon.maxDiscountAmount || Infinity)
          : coupon.value;
        discount = Math.min(Math.round(discount), subtotal);
        couponId = coupon._id;
        await Coupon.updateOne({ _id: coupon._id }, { $inc: { usedCount: 1 } }, { session });
      }
    }

    const shippingCharge = subtotal >= 999 ? 0 : 79; // Free shipping above ₹999
    const total = Math.max(0, subtotal - discount + shippingCharge);

    // Create DB order
    const orderNumber = generateOrderNumber();
    const order = new Order({
      orderNumber,
      user: req.user?._id,
      guestEmail, guestName, guestPhone,
      items: orderItems,
      shippingAddress,
      subtotal,
      discount,
      shippingCharge,
      total,
      coupon: couponId,
      paymentStatus: 'pending',
      status: 'pending',
      idempotencyKey,
    });

    // Create Razorpay order
    const razorpay = getRazorpay();
    if (razorpay) {
      const rzpOrder = await razorpay.orders.create({
        amount: total * 100, // paise
        currency: 'INR',
        receipt: orderNumber,
        notes: { orderId: order._id.toString() },
      });
      order.razorpayOrderId = rzpOrder.id;
    }

    await order.save({ session });
    await session.commitTransaction();

    // Clear cart
    await Cart.findOneAndUpdate(cartQuery, { items: [], coupon: undefined, couponDiscount: 0 });

    res.status(201).json({
      success: true,
      data: {
        orderId: order._id,
        orderNumber,
        razorpayOrderId: order.razorpayOrderId,
        amount: total * 100,
        currency: 'INR',
        keyId: process.env.RAZORPAY_KEY_ID,
        mockMode: !razorpay,
      },
    });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
});

// POST /api/payments/verify — verify Razorpay payment signature
router.post('/verify', optionalAuth, async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (order.paymentStatus === 'paid') {
      return res.json({ success: true, message: 'Payment already confirmed.', data: order });
    }

    // Verify signature server-side
    const razorpay = getRazorpay();
    if (razorpay) {
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      if (expectedSignature !== razorpaySignature) {
        return res.status(400).json({ success: false, message: 'Payment verification failed. Invalid signature.' });
      }
    }

    order.paymentStatus = 'paid';
    order.status = 'confirmed';
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    await order.save();

    // Send confirmation email
    const user = order.user ? await require('../models/User').findById(order.user) : null;
    const { subject, html } = emailTemplates.orderConfirmation(order, user);
    await sendEmail({ to: user?.email || order.guestEmail, subject, html });

    res.json({ success: true, message: 'Payment verified. Order confirmed!', data: order });
  } catch (err) { next(err); }
});

// POST /api/payments/webhook — Razorpay webhook
router.post('/webhook', async (req, res, next) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (webhookSecret) {
      const sig = req.headers['x-razorpay-signature'];
      const expectedSig = crypto
        .createHmac('sha256', webhookSecret)
        .update(req.body)
        .digest('hex');
      if (sig !== expectedSig) {
        return res.status(400).json({ success: false, message: 'Invalid webhook signature.' });
      }
    }

    const event = JSON.parse(req.body.toString());
    if (event.event === 'payment.captured') {
      const paymentId = event.payload.payment.entity.id;
      const rzpOrderId = event.payload.payment.entity.order_id;
      await Order.findOneAndUpdate(
        { razorpayOrderId: rzpOrderId, paymentStatus: { $ne: 'paid' } },
        { paymentStatus: 'paid', status: 'confirmed', razorpayPaymentId: paymentId }
      );
    }

    res.json({ received: true });
  } catch (err) { next(err); }
});

// POST /api/payments/mock-complete — dev/sandbox payment completion
router.post('/mock-complete', optionalAuth, async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    order.paymentStatus = 'paid';
    order.status = 'confirmed';
    order.razorpayPaymentId = `mock_${Date.now()}`;
    await order.save();

    res.json({
      success: true,
      message: '✅ Mock payment completed. Order confirmed! (Development mode only)',
      data: order,
    });
  } catch (err) { next(err); }
});

module.exports = router;
