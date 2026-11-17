import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, User, Search, Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore, useCartStore } from '../../store';
import { useStorefrontCustomizer } from '../../store/customizerStore';
import AnnouncementBar from './AnnouncementBar';

const NAV_LINKS = [
  { label: 'Shop', href: '/shop', children: [
    { label: 'T-Shirts', href: '/shop?category=t-shirts' },
    { label: 'Shirts', href: '/shop?category=shirts' },
    { label: 'Jeans', href: '/shop?category=jeans' },
    { label: 'Trousers', href: '/shop?category=trousers' },
    { label: 'All Products', href: '/shop' },
  ]},
  { label: 'New Arrivals', href: '/collections/new-arrivals' },
  { label: 'Collections', href: '/collections', children: [
    { label: 'New Arrivals', href: '/collections/new-arrivals' },
    { label: 'Bestsellers', href: '/collections/bestsellers' },
    { label: 'Everyday Essentials', href: '/collections/everyday-essentials' },
    { label: 'Sale', href: '/collections/sale' },
  ]},
];

export default function Navbar() {
  const customizer = useStorefrontCustomizer();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getItemCount, openDrawer } = useCartStore();
  const cartCount = getItemCount();

  const isTransparent = location.pathname === '/' && !scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const brandParts = (customizer.storeName || 'DB Clothing').split(' ');
  const brandFirst = brandParts[0] || 'DB';
  const brandRest = brandParts.slice(1).join(' ') || 'Clothing';

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <AnnouncementBar />
        <header
          className={`transition-all duration-300 ${
            isTransparent
              ? 'bg-gradient-to-b from-black/85 via-black/35 to-transparent text-white'
              : 'bg-white/95 backdrop-blur-md text-db-black border-b border-db-neutral-200 shadow-sm'
          }`}
        >
          <div className="container-db">
            <div className="flex items-center justify-between h-16 lg:h-20">

              {/* Logo */}
              <Link to="/" className="flex-shrink-0">
                <span className={`font-editorial text-2xl font-bold tracking-[-0.02em] transition-colors duration-300 ${
                  isTransparent ? 'text-white' : 'text-db-black'
                }`}>
                  {brandFirst}
                </span>
                <span className={`font-sans text-xs tracking-[0.25em] uppercase ml-1 transition-colors duration-300 ${
                  isTransparent ? 'text-white/80' : 'text-db-neutral-600'
                }`}>
                  {brandRest}
                </span>
              </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={link.href}
                    className={`flex items-center gap-1 text-[13px] font-medium tracking-wide hover:opacity-70 transition-opacity duration-150 ${
                      isTransparent ? 'text-db-white' : 'text-db-charcoal'
                    }`}
                  >
                    {link.label}
                    {link.children && <ChevronDown size={12} className="mt-px" />}
                  </Link>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {link.children && activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-db-white border border-db-light-grey shadow-lg z-50"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            to={child.href}
                            className="block px-5 py-3 text-[13px] text-db-charcoal hover:bg-db-off-white hover:text-db-near-black transition-colors duration-150 border-b border-db-light-grey/50 last:border-0"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className={`p-2 hover:opacity-70 transition-opacity duration-150 ${
                  isTransparent ? 'text-db-white' : 'text-db-charcoal'
                }`}
                aria-label="Search"
              >
                <Search size={20} strokeWidth={1.5} />
              </button>

              {/* Wishlist */}
              <Link
                to="/account/wishlist"
                className={`p-2 hover:opacity-70 transition-opacity duration-150 ${
                  isTransparent ? 'text-db-white' : 'text-db-charcoal'
                }`}
                aria-label="Wishlist"
              >
                <Heart size={20} strokeWidth={1.5} />
              </Link>

              {/* Account */}
              <Link
                to={isAuthenticated ? '/account' : '/login'}
                className={`p-2 hover:opacity-70 transition-opacity duration-150 hidden sm:block ${
                  isTransparent ? 'text-db-white' : 'text-db-charcoal'
                }`}
                aria-label="Account"
              >
                <User size={20} strokeWidth={1.5} />
              </Link>

              {/* Cart */}
              <button
                type="button"
                onClick={openDrawer}
                className={`p-2 hover:opacity-70 transition-opacity duration-150 relative ${
                  isTransparent ? 'text-db-white' : 'text-db-charcoal'
                }`}
                aria-label={`Cart, ${cartCount} items`}
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-db-near-black text-db-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden p-2 transition-opacity duration-150 ${
                  isTransparent ? 'text-db-white' : 'text-db-charcoal'
                }`}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-db-near-black/80 backdrop-blur-sm flex items-start pt-24"
            onClick={() => setSearchOpen(false)}
          >
            <div
              className="container-db"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearch} className="relative">
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-db-white text-db-near-black text-2xl px-6 py-5 pr-16 placeholder-db-mid-grey focus:outline-none border-none"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-db-mid-grey hover:text-db-near-black"
                  aria-label="Close search"
                >
                  <X size={24} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-50 w-80 bg-db-white border-l border-db-light-grey overflow-y-auto lg:hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-db-light-grey">
              <span className="font-editorial text-xl font-bold">Menu</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>
            <nav className="p-6 space-y-1">
              {NAV_LINKS.map((link) => (
                <div key={link.label}>
                  <Link
                    to={link.href}
                    className="block py-3 text-sm font-medium tracking-wide text-db-charcoal hover:text-db-near-black border-b border-db-light-grey/50"
                  >
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="pl-4 space-y-1 mt-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="block py-2 text-sm text-db-mid-grey hover:text-db-charcoal"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t border-db-light-grey space-y-3">
                <Link to={isAuthenticated ? '/account' : '/login'} className="block py-2 text-sm font-medium text-db-charcoal">
                  {isAuthenticated ? `Hi, ${user?.name?.split(' ')[0]}` : 'Sign In'}
                </Link>
                {isAuthenticated && (
                  <button onClick={logout} className="block py-2 text-sm text-db-mid-grey hover:text-db-charcoal text-left w-full">
                    Sign Out
                  </button>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile overlay backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-db-black/30 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
