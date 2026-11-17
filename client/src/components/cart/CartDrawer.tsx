import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check } from 'lucide-react';
import { useCartStore } from '../../store';
import { useStorefrontCustomizer } from '../../store/customizerStore';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, applyCoupon, removeCoupon } = useCartStore();
  const customizer = useStorefrontCustomizer();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  if (!isOpen) return null;

  const freeShippingThreshold = customizer.freeShippingThreshold || 2500;
  const items = cart?.items || [];
  const subtotal = cart?.subtotal || items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const discount = cart?.discount || 0;
  const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 150;
  const total = Math.max(0, subtotal - discount + shipping);

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError('');
    try {
      await applyCoupon(couponInput.trim().toUpperCase());
      setCouponInput('');
    } catch (err: any) {
      setCouponError(err.response?.data?.message || 'Invalid or expired coupon');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-db-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-db-black" />
              <h2 className="text-base font-serif font-bold tracking-wider text-db-black uppercase">
                Shopping Bag ({items.reduce((acc, item) => acc + item.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-db-neutral-500 hover:text-db-black transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-db-neutral-100 px-6 py-3 border-b border-db-neutral-200">
            <div className="flex justify-between items-center text-xs font-medium text-db-neutral-700 mb-1.5">
              <span>
                {amountNeededForFreeShipping === 0 ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> You unlocked Complimentary Express Shipping!
                  </span>
                ) : (
                  <>Add <span className="font-bold text-db-black">₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</span> more for Free Shipping</>
                )}
              </span>
              <span className="text-[10px] text-db-neutral-500 uppercase tracking-wider">
                Goal: ₹{FREE_SHIPPING_THRESHOLD}
              </span>
            </div>
            <div className="w-full bg-db-neutral-300 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-db-gold h-full transition-all duration-500 ease-out"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-db-neutral-200">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-db-neutral-100 flex items-center justify-center mb-4 text-db-neutral-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-base font-serif font-semibold text-db-black mb-1">
                  Your bag is currently empty
                </p>
                <p className="text-xs text-db-neutral-500 mb-6 max-w-xs">
                  Discover our new arrivals and timeless menswear essentials.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/shop');
                  }}
                  className="px-6 py-3 bg-db-black text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-db-charcoal transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="py-4 flex gap-4">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200'}
                    alt={item.title}
                    className="w-20 h-24 object-cover object-top bg-db-neutral-100 flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-xs font-medium text-db-black line-clamp-1 pr-2">
                          {item.title}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.productId, item.size)}
                          className="text-db-neutral-400 hover:text-rose-600 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-db-neutral-500 uppercase tracking-wider mt-0.5">
                        Size: <span className="font-semibold text-db-black">{item.size}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="inline-flex items-center border border-db-neutral-300">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                          className="px-2 py-1 text-db-neutral-600 hover:bg-db-neutral-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-db-black min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                          className="px-2 py-1 text-db-neutral-600 hover:bg-db-neutral-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-xs font-semibold text-db-black">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="border-t border-db-neutral-200 px-6 py-5 bg-db-neutral-50 space-y-4">
              {/* Coupon Code Input */}
              <form onSubmit={handleApplyCoupon} className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-db-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="PROMO CODE (e.g. DBWELCOME)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs tracking-wider uppercase border border-db-neutral-300 bg-white focus:outline-none focus:border-db-black"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isApplyingCoupon || !couponInput.trim()}
                    className="px-4 py-2 bg-db-neutral-800 text-white text-xs font-medium tracking-wider uppercase hover:bg-db-black disabled:opacity-50 transition-colors"
                  >
                    {isApplyingCoupon ? '...' : 'Apply'}
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}
                {cart?.couponCode && (
                  <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-2 py-1 border border-emerald-200">
                    <span>Applied: <strong>{cart.couponCode}</strong></span>
                    <button
                      type="button"
                      onClick={() => removeCoupon()}
                      className="text-emerald-900 underline text-[10px]"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-db-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-db-black">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-medium text-db-black">
                    {shipping === 0 ? 'COMPLIMENTARY' : `₹${shipping}`}
                  </span>
                </div>
                <div className="border-t border-db-neutral-200 pt-2 flex justify-between text-sm font-semibold text-db-black">
                  <span>Estimated Total</span>
                  <span className="font-bold">₹{total.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[10px] text-db-neutral-400 text-center pt-1">
                  Applicable GST included. Shipping & taxes calculated at checkout.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 bg-db-black text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-db-charcoal flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/cart');
                  }}
                  className="w-full py-2.5 text-center text-xs font-medium text-db-neutral-700 hover:text-db-black uppercase tracking-wider transition-colors"
                >
                  View Full Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
