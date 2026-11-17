import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, ShoppingBag, Check, ArrowRight } from 'lucide-react';
import type { ProductItem } from '../../types';
import { useCartStore, useWishlistStore } from '../../store';
import toast from 'react-hot-toast';

interface QuickViewModalProps {
  product: ProductItem | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const { addToCart } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  if (!product) return null;

  const isWishlisted = isInWishlist(product._id);
  const images = product.images && product.images.length > 0 ? product.images : [{ url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800' }];

  const handleAdd = async () => {
    if (!selectedSize) {
      toast.error('Please select a size first');
      return;
    }
    const variant = product.variants?.find((v) => v.size === selectedSize);
    if (variant && variant.stock < quantity) {
      toast.error(`Only ${variant.stock} available in size ${selectedSize}`);
      return;
    }

    setIsAdding(true);
    try {
      await addToCart({
        productId: product._id,
        size: selectedSize,
        quantity,
        title: product.title,
        price: product.price,
        image: images[0].url,
        sku: variant?.sku || `${product.slug}-${selectedSize}`,
      });
      toast.success(`Added ${product.title} to bag`);
      onClose();
    } catch {
      toast.error('Failed to add to bag');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        <div className="relative transform overflow-hidden bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-3xl border border-db-neutral-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-1.5 text-db-neutral-500 hover:text-db-black bg-white/80 rounded-full"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Gallery */}
            <div className="bg-db-neutral-100 flex flex-col justify-between">
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <img
                  src={images[activeImgIndex]?.url}
                  alt={product.title}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto bg-white border-t border-db-neutral-200">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImgIndex(idx)}
                      className={`w-14 h-16 flex-shrink-0 border-2 overflow-hidden ${
                        activeImgIndex === idx ? 'border-db-black' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover object-top" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Meta */}
            <div className="p-6 md:p-8 flex flex-col justify-between">
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-db-neutral-500 mb-1">
                  DB CLOTHING MENSWEAR
                </p>
                <h2 className="font-serif text-xl font-bold text-db-black mb-2">
                  {product.title}
                </h2>

                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-lg font-bold text-db-black">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span className="text-sm text-db-neutral-400 line-through">
                      ₹{product.compareAtPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                {/* Size Selector */}
                <div className="mb-6">
                  <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider mb-2 text-db-black">
                    <span>Select Size</span>
                    {selectedSize && <span className="text-db-neutral-500">{selectedSize}</span>}
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {(product.variants || []).map((v) => {
                      const isSelected = selectedSize === v.size;
                      const isSoldOut = v.stock <= 0;
                      return (
                        <button
                          key={v.size}
                          disabled={isSoldOut}
                          onClick={() => setSelectedSize(v.size)}
                          className={`py-2 text-xs font-semibold uppercase tracking-wider border transition-all ${
                            isSelected
                              ? 'bg-db-black text-white border-db-black'
                              : isSoldOut
                              ? 'bg-db-neutral-100 text-db-neutral-300 border-db-neutral-200 line-through cursor-not-allowed'
                              : 'bg-white text-db-neutral-800 border-db-neutral-300 hover:border-db-black'
                          }`}
                        >
                          {v.size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs font-semibold uppercase tracking-wider text-db-black">Quantity</span>
                  <div className="inline-flex items-center border border-db-neutral-300">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2.5 py-1 text-xs hover:bg-db-neutral-100"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2.5 py-1 text-xs hover:bg-db-neutral-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-db-neutral-200">
                <div className="flex gap-2">
                  <button
                    onClick={handleAdd}
                    disabled={isAdding}
                    className="flex-1 py-3 bg-db-black text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-db-charcoal flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isAdding ? 'Adding...' : 'Add To Bag'}</span>
                  </button>
                  <button
                    onClick={() => toggleWishlist(product._id)}
                    className={`p-3 border transition-colors ${
                      isWishlisted
                        ? 'border-db-gold bg-db-gold/10 text-db-gold'
                        : 'border-db-neutral-300 text-db-neutral-600 hover:text-db-black hover:border-db-black'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-db-gold' : ''}`} />
                  </button>
                </div>

                <Link
                  to={`/product/${product.slug}`}
                  onClick={onClose}
                  className="block text-center text-xs font-medium text-db-neutral-600 hover:text-db-black uppercase tracking-wider"
                >
                  View Full Product Details &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
