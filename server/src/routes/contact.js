const express = require('express');
const rateLimit = require('express-rate-limit');
const { sendEmail } = require('../utils/email');

const router = express.Router();

const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5 });

router.post('/', contactLimiter, async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@dbclothing.in',
      subject: `[DB Clothing Contact] ${subject || 'New message'} — from ${name}`,
      html: `
        <div style="font-family: Inter, sans-serif; padding: 24px;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f5f5f5; padding: 16px; border-radius: 4px;">${message.replace(/\n/g, '<br/>')}</div>
        </div>
      `,
    });

    res.json({ success: true, message: 'Your message has been sent. We\'ll get back to you soon.' });
  } catch (err) { next(err); }
});

module.exports = router;
