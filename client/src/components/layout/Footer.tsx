import { Link } from 'react-router-dom';
import { Mail, MessageCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useStorefrontCustomizer } from '../../store/customizerStore';

const InstagramIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FOOTER_LINKS = {
  shop: [
    { label: 'T-Shirts', href: '/shop?category=t-shirts' },
    { label: 'Shirts', href: '/shop?category=shirts' },
    { label: 'Jeans', href: '/shop?category=jeans' },
    { label: 'All Products', href: '/shop' },
    { label: 'New Arrivals', href: '/collections/new-arrivals' },
    { label: 'Sale', href: '/collections/sale' },
  ],
  account: [
    { label: 'Sign In', href: '/login' },
    { label: 'My Account', href: '/account' },
    { label: 'Orders', href: '/account/orders' },
    { label: 'Wishlist', href: '/account/wishlist' },
    { label: 'Track Order', href: '/track-order' },
  ],
  support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shipping Policy', href: '/policies/shipping' },
    { label: 'Returns & Refunds', href: '/policies/returns' },
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'FAQ', href: '/faq' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/policies/privacy' },
    { label: 'Terms & Conditions', href: '/policies/terms' },
    { label: 'Cancellation Policy', href: '/policies/cancellation' },
  ],
};

export default function Footer() {
  const customizer = useStorefrontCustomizer();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const brandParts = (customizer.storeName || 'DB Clothing').split(' ');
  const brandFirst = brandParts[0] || 'DB';
  const brandRest = brandParts.slice(1).join(' ') || 'Clothing';

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-db-near-black text-db-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="container-db py-16">
          <div className="max-w-xl">
            <p className="section-label text-db-mid-grey mb-3">Stay in the loop</p>
            <h2 className="font-editorial text-3xl text-db-white mb-6">
              Drops, edits & early access.
            </h2>
            {!subscribed ? (
              <form onSubmit={handleNewsletter} className="flex gap-0">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 bg-white/5 border border-white/20 px-4 py-3 text-sm text-db-white placeholder-db-mid-grey focus:outline-none focus:border-white/50 transition-colors"
                />
                <button type="submit" className="bg-db-white text-db-near-black px-6 py-3 hover:bg-db-cream transition-colors duration-200 flex items-center gap-2 text-sm font-medium tracking-wide">
                  Subscribe <ArrowRight size={14} />
                </button>
              </form>
            ) : (
              <p className="text-db-mid-grey text-sm">
                ✓ You're in. Watch your inbox for exclusive drops.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-db py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="font-editorial text-3xl font-bold">{brandFirst}</span>
              <span className="font-sans text-xs tracking-[0.25em] uppercase ml-1.5 text-db-mid-grey">{brandRest}</span>
            </Link>
            <p className="text-sm text-db-mid-grey leading-relaxed max-w-[200px]">
              {customizer.storeTagline || 'Premium menswear for the modern Indian man.'}
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href={customizer.instagramUrl || 'https://www.instagram.com/dbclothing.20/'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-db-mid-grey hover:text-db-white transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon size={20} />
              </a>
              <a
                href={`mailto:${customizer.contactEmail || 'concierge@dbclothing.in'}`}
                className="text-db-mid-grey hover:text-db-white transition-colors"
                aria-label="Email"
              >
                <Mail size={20} strokeWidth={1.5} />
              </a>
              <a
                href={`https://wa.me/${(customizer.contactPhone || '').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-db-mid-grey hover:text-db-white transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={20} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-db-mid-grey mb-5">Shop</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.shop.map(l => (
                <li key={l.label}>
                  <Link to={l.href} className="text-sm text-db-white/70 hover:text-db-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-db-mid-grey mb-5">Account</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.account.map(l => (
                <li key={l.label}>
                  <Link to={l.href} className="text-sm text-db-white/70 hover:text-db-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-db-mid-grey mb-5">Support</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.support.map(l => (
                <li key={l.label}>
                  <Link to={l.href} className="text-sm text-db-white/70 hover:text-db-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-db-mid-grey mb-5">Legal</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.legal.map(l => (
                <li key={l.label}>
                  <Link to={l.href} className="text-sm text-db-white/70 hover:text-db-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-db py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-db-mid-grey">
          <span>© {new Date().getFullYear()} DB Clothing. All rights reserved.</span>
          <span className="flex items-center gap-2">
            <span>Payments secured by Razorpay</span>
            <span>·</span>
            <span>Made with care in India 🇮🇳</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
