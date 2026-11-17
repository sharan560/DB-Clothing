const express = require('express');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/products — list with filters, search, sort, pagination
router.get('/', async (req, res, next) => {
  try {
    const {
      page = 1, limit = 20, search, category, collection,
      minPrice, maxPrice, size, color, sort = 'createdAt',
      featured, newArrival, bestseller, isActive = 'true',
    } = req.query;

    const query = {};

    if (isActive !== 'all') query.isActive = isActive === 'true';
    if (featured === 'true') query.isFeatured = true;
    if (newArrival === 'true') query.isNewArrival = true;
    if (bestseller === 'true') query.isBestseller = true;
    if (category) query.category = category;
    if (collection) query.collections = collection;

    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = Number(minPrice);
      if (maxPrice) query.basePrice.$lte = Number(maxPrice);
    }

    if (size) {
      query['variants.size'] = { $in: Array.isArray(size) ? size : [size] };
      query['variants.isActive'] = true;
    }

    if (color) {
      query['variants.color'] = { $regex: color, $options: 'i' };
    }

    if (search) {
      query.$text = { $search: search };
    }

    const sortOptions = {
      'createdAt': { createdAt: -1 },
      'price-asc': { basePrice: 1 },
      'price-desc': { basePrice: -1 },
      'rating': { averageRating: -1 },
      'popular': { totalSold: -1 },
      'featured': { isFeatured: -1, createdAt: -1 },
    };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sortOptions[sort] || { createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .select('-__v'),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        total, page: Number(page), limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) { next(err); }
});

// GET /api/products/search — full-text search
router.get('/search', async (req, res, next) => {
  try {
    const { q, limit = 10 } = req.query;
    if (!q) return res.json({ success: true, data: [] });

    const products = await Product.find(
      { $text: { $search: q }, isActive: true },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(Number(limit))
      .select('name slug basePrice images category')
      .populate('category', 'name slug');

    res.json({ success: true, data: products });
  } catch (err) { next(err); }
});

// GET /api/products/:slug — single product by slug
router.get('/:slug', async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
      .populate('category', 'name slug')
      .populate('collections', 'name slug');

    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    // Related products (same category, excluding current)
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true,
    }).limit(8).select('name slug basePrice originalPrice images averageRating reviewCount');

    res.json({ success: true, data: product, related });
  } catch (err) { next(err); }
});

// ── Admin Routes ─────────────────────────────────────────────

// POST /api/products — create (admin)
router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) { next(err); }
});

// PUT /api/products/:id — update (admin)
router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, data: product });
  } catch (err) { next(err); }
});

// PATCH /api/products/:id/stock — adjust variant stock (admin)
router.patch('/:id/stock', protect, adminOnly, async (req, res, next) => {
  try {
    const { variantIndex, stock } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    if (variantIndex < 0 || variantIndex >= product.variants.length) {
      return res.status(400).json({ success: false, message: 'Invalid variant index.' });
    }
    product.variants[variantIndex].stock = Math.max(0, stock);
    await product.save();
    res.json({ success: true, data: product });
  } catch (err) { next(err); }
});

// DELETE /api/products/:id — soft delete (admin)
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Product archived successfully.' });
  } catch (err) { next(err); }
});

module.exports = router;
