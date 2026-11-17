const express = require('express');
const Category = require('../models/Category');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { active } = req.query;
    const query = active === 'false' ? {} : { isActive: true };
    const categories = await Category.find(query).sort({ order: 1, name: 1 });
    res.json({ success: true, data: categories });
  } catch (err) { next(err); }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });
    res.json({ success: true, data: category });
  } catch (err) { next(err); }
});

router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (err) { next(err); }
});

router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });
    res.json({ success: true, data: category });
  } catch (err) { next(err); }
});

router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    await Category.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Category deactivated.' });
  } catch (err) { next(err); }
});

module.exports = router;
