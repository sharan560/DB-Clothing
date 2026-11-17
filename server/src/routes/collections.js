const express = require('express');
const Collection = require('../models/Collection');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { featured } = req.query;
    const query = { isActive: true };
    if (featured === 'true') query.isFeatured = true;
    const collections = await Collection.find(query).sort({ order: 1 });
    res.json({ success: true, data: collections });
  } catch (err) { next(err); }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const collection = await Collection.findOne({ slug: req.params.slug, isActive: true })
      .populate({
        path: 'products',
        match: { isActive: true },
        select: 'name slug basePrice originalPrice images averageRating reviewCount isFeatured',
        populate: { path: 'category', select: 'name slug' },
      });
    if (!collection) return res.status(404).json({ success: false, message: 'Collection not found.' });
    res.json({ success: true, data: collection });
  } catch (err) { next(err); }
});

router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const collection = await Collection.create(req.body);
    res.status(201).json({ success: true, data: collection });
  } catch (err) { next(err); }
});

router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const collection = await Collection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!collection) return res.status(404).json({ success: false, message: 'Collection not found.' });
    res.json({ success: true, data: collection });
  } catch (err) { next(err); }
});

router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    await Collection.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Collection deactivated.' });
  } catch (err) { next(err); }
});

module.exports = router;
