const nodemailer = require('nodemailer');

const createTransport = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    // Dev fallback: log emails to console
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransport();

  if (!transporter) {
    // Dev mode: log to console instead
    console.log('\n📧 [DEV EMAIL]');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log('(SMTP not configured — email logged to console only)');
    return { messageId: 'dev-console', devMode: true };
  }

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'DB Clothing <noreply@dbclothing.in>',
    to,
    subject,
    html,
  });

  return info;
};

const emailTemplates = {
  orderConfirmation: (order, user) => ({
    subject: `Order Confirmed — #${order.orderNumber}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; padding: 40px;">
        <h1 style="font-size: 24px; font-weight: 700; color: #1A1917; border-bottom: 1px solid #E8E5E0; padding-bottom: 20px;">
          Order Confirmed
        </h1>
        <p style="color: #5C5751;">Hi ${user?.name || order.guestName || 'there'},</p>
        <p style="color: #5C5751;">Thank you for your order! We're getting it ready for you.</p>
        <div style="background: #FAF9F7; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0; color: #9B9590; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em;">Order Number</p>
          <p style="margin: 4px 0 0; font-size: 20px; font-weight: 700; color: #1A1917;">${order.orderNumber}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          ${order.items.map(item => `
            <tr style="border-bottom: 1px solid #E8E5E0;">
              <td style="padding: 12px 0; color: #2C2A27;">${item.productName}</td>
              <td style="padding: 12px 0; color: #9B9590; text-align: center;">${item.size} / ${item.color} × ${item.quantity}</td>
              <td style="padding: 12px 0; color: #2C2A27; text-align: right;">₹${item.totalPrice.toLocaleString('en-IN')}</td>
            </tr>
          `).join('')}
        </table>
        <div style="margin-top: 20px; text-align: right;">
          <p style="color: #9B9590;">Subtotal: ₹${order.subtotal.toLocaleString('en-IN')}</p>
          ${order.discount > 0 ? `<p style="color: #4CAF50;">Discount: -₹${order.discount.toLocaleString('en-IN')}</p>` : ''}
          <p style="font-size: 18px; font-weight: 700; color: #1A1917;">Total: ₹${order.total.toLocaleString('en-IN')}</p>
        </div>
        <p style="color: #9B9590; font-size: 12px; margin-top: 40px;">
          This is an automated email from DB Clothing. For support, please contact us through our website.
        </p>
      </div>
    `,
  }),

  passwordReset: (resetUrl) => ({
    subject: 'Reset Your Password — DB Clothing',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; padding: 40px;">
        <h1 style="font-size: 24px; font-weight: 700; color: #1A1917;">Reset Your Password</h1>
        <p style="color: #5C5751;">Click the button below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display: inline-block; margin: 24px 0; background: #1A1917; color: #fff; padding: 14px 28px; border-radius: 4px; text-decoration: none; font-weight: 600;">Reset Password</a>
        <p style="color: #9B9590; font-size: 12px;">If you didn't request a password reset, you can safely ignore this email.</p>
      </div>
    `,
  }),
};

module.exports = { sendEmail, emailTemplates };
