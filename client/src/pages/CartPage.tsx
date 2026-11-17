import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, ShieldCheck, Truck } from 'lucide-react';
import { useCartStore } from '../store';
import { useStorefrontCustomizer } from '../store/customizerStore';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, applyCoupon, removeCoupon } = useCartStore();
  const customizer = useStorefrontCustomizer();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const freeShippingMin = customizer.freeShippingThreshold || 2500;
  const items = cart?.items || [];
  const subtotal = cart?.subtotal || items.reduce((acc, i) => acc + (i.price || 0) * i.quantity, 0);
  const discount = cart?.discount || cart?.couponDiscount || 0;
  const shipping = subtotal >= freeShippingMin || subtotal === 0 ? 0 : 150;
  const total = Math.max(0, subtotal - discount + shipping);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setIsApplying(true);
    setCouponError('');
    try {
      await applyCoupon(couponCode.trim().toUpperCase());
      setCouponCode('');
    } catch (err: any) {
      setCouponError(err.response?.data?.message || 'Invalid or expired coupon');
    } finally {
      setIsApplying(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-white">
        <div className="max-w-2xl mx-auto px-6 text-center py-16">
          <div className="w-20 h-20 mx-auto rounded-full bg-db-neutral-100 flex items-center justify-center text-db-neutral-400 mb-6">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-db-black mb-3">
            Your Bag Is Empty
          </h1>
          <p className="text-sm text-db-neutral-600 mb-8 max-w-md mx-auto">
            You haven't added any garments to your bag yet. Explore our latest Spring / Summer drop and timeless menswear essentials.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-db-black text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-db-charcoal transition-colors shadow-sm"
          >
            <span>Explore The Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 lg:pt-36 pb-20 transition-colors" style={{ backgroundColor: 'var(--site-bg)', color: 'var(--site-text)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="border-b border-db-neutral-200 pb-6 mb-10">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-tight text-db-black">
            Your Shopping Bag
          </h1>
          <p className="text-xs sm:text-sm text-db-neutral-500 mt-1">
            {items.reduce((acc, i) => acc + i.quantity, 0)} items in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* ── Left Items List (8 cols) ─────────────── */}
          <div className="lg:col-span-8 divide-y divide-db-neutral-200 border-t border-b border-db-neutral-200">
            {items.map((item) => (
              <div
                key={`${item.productId || item._id}-${item.size}`}
                className="py-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center"
              >
                <img
                  src={item.image || item.product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300'}
                  alt={item.title || item.product?.name || 'Product'}
                  className="w-24 h-32 object-cover object-top bg-db-neutral-100 flex-shrink-0"
                />

                <div className="flex-1 space-y-1">
                  <h3 className="font-serif text-base font-bold text-db-black">
                    {item.title || item.product?.name}
                  </h3>
                  <p className="text-xs text-db-neutral-500 uppercase tracking-wider">
                    Size: <span className="font-semibold text-db-black">{item.size}</span>
                  </p>
                  <p className="text-xs text-db-neutral-500 uppercase tracking-wider">
                    Unit Price: ₹{(item.price || 0).toLocaleString('en-IN')}
                  </p>
                </div>

                {/* Quantity Stepper */}
                <div className="inline-flex items-center border border-db-neutral-300 bg-white">
                  <button
                    onClick={() => updateQuantity(item.productId || item._id!, item.size, item.quantity - 1)}
                    className="px-3 py-1.5 text-xs text-db-neutral-700 hover:bg-db-neutral-100"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-bold text-db-black min-w-[24px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId || item._id!, item.size, item.quantity + 1)}
                    className="px-3 py-1.5 text-xs text-db-neutral-700 hover:bg-db-neutral-100"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Line Total */}
                <div className="text-right sm:min-w-[100px]">
                  <span className="text-sm font-bold text-db-black">
                    ₹{((item.price || 0) * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.productId || item._id!, item.size)}
                  className="text-db-neutral-400 hover:text-rose-600 transition-colors p-2"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* ── Right Order Summary (4 cols) ─────────── */}
          <div className="lg:col-span-4 bg-db-neutral-50 p-6 sm:p-8 border border-db-neutral-200 space-y-6">
            <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-db-black pb-3 border-b border-db-neutral-200">
              Order Summary
            </h2>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-db-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="PROMO CODE"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs tracking-wider uppercase border border-db-neutral-300 bg-white focus:outline-none focus:border-db-black"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isApplying || !couponCode.trim()}
                  className="px-5 py-2.5 bg-db-black text-white text-xs font-semibold tracking-wider uppercase hover:bg-db-charcoal disabled:opacity-50"
                >
                  {isApplying ? '...' : 'Apply'}
                </button>
              </div>
              {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}
              {cart?.couponCode && (
                <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1.5 border border-emerald-200">
                  <span>Applied: <strong>{cart.couponCode}</strong></span>
                  <button
                    type="button"
                    onClick={() => removeCoupon()}
                    className="underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              )}
            </form>

            {/* Calculations */}
            <div className="space-y-3 text-xs text-db-neutral-600 pt-2 border-t border-db-neutral-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-db-black">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Promo Discount</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-medium text-db-black">
                  {shipping === 0 ? (
                    <span className="text-emerald-700 font-semibold">FREE</span>
                  ) : (
                    `₹${shipping}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-db-black pt-3 border-t border-db-neutral-200">
                <span>Estimated Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[10px] text-db-neutral-400 text-center">
                Inclusive of GST. Delivery times & details confirmed at checkout.
              </p>
            </div>

            {/* Proceed Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-db-black text-white text-xs font-semibold tracking-[0.25em] uppercase hover:bg-db-charcoal flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Security Badges */}
            <div className="space-y-2 pt-4 border-t border-db-neutral-200 text-[11px] text-db-neutral-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-db-gold" />
                <span>256-Bit Encrypted Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-db-gold" />
                <span>Express Dispatches within 24–48 Hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
