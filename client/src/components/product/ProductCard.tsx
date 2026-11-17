import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { useCartStore, useWishlistStore } from '../../store';
import toast from 'react-hot-toast';
import type { ProductItem, ProductVariant, ProductImage } from '../../types';

export type { ProductItem, ProductVariant, ProductImage };

interface ProductCardProps {
  product: ProductItem;
  onQuickView?: (product: ProductItem) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const { addToCart } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const isWishlisted = isInWishlist(product._id);
  const primaryImg = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80';
  const secondaryImg = product.images?.[1]?.url || primaryImg;

  // Extract unique sizes with stock
  const availableSizes = Array.from(
    new Map(
      (product.variants || []).map((v) => [
        v.size,
        { size: v.size, stock: v.stock, sku: v.sku },
      ])
    ).values()
  );

  // Discount calculation
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const handleQuickAdd = async (sizeObj: { size: string; stock: number; sku: string }) => {
    if (sizeObj.stock <= 0) {
      toast.error(`Size ${sizeObj.size} is currently sold out`);
      return;
    }
    setIsAdding(true);
    setSelectedSize(sizeObj.size);
    try {
      await addToCart({
        productId: product._id,
        title: product.title,
        price: product.price,
        image: primaryImg,
        size: sizeObj.size,
        sku: sizeObj.sku,
        quantity: 1,
      });
      toast.success(`Added ${product.title} (${sizeObj.size}) to your bag`);
    } catch {
      toast.error('Unable to add item to bag');
    } finally {
      setIsAdding(false);
      setTimeout(() => setSelectedSize(null), 1200);
    }
  };

  return (
    <div
      className="group relative flex flex-col bg-white transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Image Container ────────────────────────── */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-db-neutral-100">
        <Link to={`/product/${product.slug}`} className="block h-full w-full">
          {/* Primary Image */}
          <img
            src={primaryImg}
            alt={product.title}
            className={`h-full w-full object-cover object-top transition-all duration-700 ease-out ${
              isHovered && secondaryImg !== primaryImg
                ? 'opacity-0 scale-105'
                : 'opacity-100 scale-100'
            }`}
            loading="lazy"
          />

          {/* Secondary Hover Image */}
          {secondaryImg !== primaryImg && (
            <img
              src={secondaryImg}
              alt={`${product.title} alternate view`}
              className={`absolute inset-0 h-full w-full object-cover object-top transition-all duration-700 ease-out ${
                isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              loading="lazy"
            />
          )}
        </Link>

        {/* ── Badges ─────────────────────────────── */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.isNewArrival && (
            <span className="bg-db-black text-db-white text-[10px] font-semibold tracking-[0.2em] uppercase px-2.5 py-1">
              New Drop
            </span>
          )}
          {hasDiscount && (
            <span className="bg-db-gold text-db-black text-[10px] font-bold tracking-[0.15em] uppercase px-2.5 py-1">
              {discountPercent}% Off
            </span>
          )}
          {product.isBestSeller && !product.isNewArrival && (
            <span className="bg-white/90 backdrop-blur-sm text-db-black text-[10px] font-medium tracking-[0.2em] uppercase px-2.5 py-1">
              Bestseller
            </span>
          )}
        </div>

        {/* ── Wishlist Button ──────────────────────── */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product._id);
            toast.success(
              isWishlisted
                ? 'Removed from wishlist'
                : 'Added to your private wishlist'
            );
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 z-10 ${
            isWishlisted
              ? 'bg-db-black text-db-gold shadow-md scale-110'
              : 'bg-white/80 backdrop-blur-sm text-db-black/70 hover:bg-white hover:text-db-black hover:scale-105 shadow-sm'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-transform ${
              isWishlisted ? 'fill-db-gold text-db-gold' : ''
            }`}
          />
        </button>

        {/* ── Quick Actions Overlay (Slide Up on Hover) ──── */}
        <div
          className={`absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-md p-3 transition-all duration-300 transform border-t border-db-neutral-200 z-20 ${
            isHovered
              ? 'translate-y-0 opacity-100'
              : 'translate-y-full opacity-0 pointer-events-none'
          }`}
        >
          <div className="text-[10px] uppercase tracking-[0.15em] text-db-neutral-500 font-medium mb-1.5 flex items-center justify-between">
            <span>Quick Select Size</span>
            {onQuickView && (
              <button
                onClick={() => onQuickView(product)}
                className="hover:text-db-black flex items-center gap-1 font-semibold"
              >
                <Eye className="w-3 h-3" /> Details
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {availableSizes.length > 0 ? (
              availableSizes.map((s) => {
                const isSelected = selectedSize === s.size;
                const isOutOfStock = s.stock <= 0;
                return (
                  <button
                    key={s.size}
                    disabled={isOutOfStock || isAdding}
                    onClick={() => handleQuickAdd(s)}
                    className={`flex-1 min-w-[34px] py-1 text-[11px] font-medium tracking-wider uppercase border transition-all ${
                      isSelected
                        ? 'bg-db-gold text-db-black border-db-gold font-bold'
                        : isOutOfStock
                        ? 'bg-db-neutral-100 text-db-neutral-400 border-db-neutral-200 line-through cursor-not-allowed'
                        : 'bg-white text-db-black border-db-neutral-300 hover:border-db-black hover:bg-db-black hover:text-white'
                    }`}
                  >
                    {isSelected ? <Check className="w-3 h-3 mx-auto" /> : s.size}
                  </button>
                );
              })
            ) : (
              <Link
                to={`/product/${product.slug}`}
                className="w-full text-center py-1.5 bg-db-black text-white text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-db-charcoal"
              >
                View Options
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Product Meta Details ───────────────────── */}
      <div className="pt-3 pb-2 flex flex-col flex-1">
        <div className="text-[10px] tracking-[0.2em] uppercase text-db-neutral-500 mb-1">
          {typeof product.category === 'object' && product.category
            ? product.category.name
            : 'MENSWEAR'}
        </div>

        <Link
          to={`/product/${product.slug}`}
          className="text-sm font-medium text-db-black hover:text-db-charcoal transition-colors line-clamp-1 leading-snug"
        >
          {product.title}
        </Link>

        {/* Pricing */}
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-sm font-semibold text-db-black tracking-wide">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {hasDiscount && (
            <span className="text-xs text-db-neutral-400 line-through">
              ₹{product.compareAtPrice!.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
