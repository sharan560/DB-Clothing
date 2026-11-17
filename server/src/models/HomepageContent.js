const mongoose = require('mongoose');

// Stores all homepage CMS content as key-value JSON blobs
const homepageContentSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g., 'hero', 'announcement', 'categories'
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('HomepageContent', homepageContentSchema);
