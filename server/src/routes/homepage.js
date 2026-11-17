const express = require('express');
const HomepageContent = require('../models/HomepageContent');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/homepage — all sections
router.get('/', async (req, res, next) => {
  try {
    const sections = await HomepageContent.find();
    const data = sections.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {});
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

// POST /api/homepage — save/upsert multiple sections (admin or customizer)
router.post('/', async (req, res, next) => {
  try {
    const { sections } = req.body;
    if (Array.isArray(sections)) {
      for (const s of sections) {
        if (s.key) {
          await HomepageContent.findOneAndUpdate(
            { key: s.key },
            { value: s.value },
            { upsert: true, new: true }
          );
        }
      }
    }
    const updated = await HomepageContent.find();
    const data = updated.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {});
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

module.exports = router;
