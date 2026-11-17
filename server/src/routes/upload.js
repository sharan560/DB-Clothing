const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Placeholder for Cloudinary/local file upload
// In production replace with Cloudinary multer-storage-cloudinary
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only JPEG, PNG, WebP, and AVIF images are allowed.'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

router.post('/', protect, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });

  const url = `${process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`}/uploads/${req.file.filename}`;
  res.json({ success: true, url, filename: req.file.filename });
});

router.post('/multiple', protect, upload.array('files', 10), (req, res) => {
  if (!req.files?.length) return res.status(400).json({ success: false, message: 'No files uploaded.' });

  const baseUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
  const urls = req.files.map(f => ({ url: `${baseUrl}/uploads/${f.filename}`, filename: f.filename }));
  res.json({ success: true, data: urls });
});

module.exports = router;
