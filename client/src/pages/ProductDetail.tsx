import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Ruler,
  Truck,
  RotateCcw,
  ShieldCheck,
  Star,
  ChevronDown,
  Check,
  Share2,
} from 'lucide-react';
import SizeGuideModal from '../components/product/SizeGuideModal';
import ProductCard from '../components/product/ProductCard';
import type { ProductItem } from '../types';
import { useCartStore, useWishlistStore } from '../store';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('fabric');
  const [relatedProducts, setRelatedProducts] = useState<ProductItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const { addToCart, openDrawer } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res: any = await api.get(`/products/${slug}`);
        const data = res.data?.data || res.data;
        if (data) {
          setProduct(data);
          // Auto-select first in-stock size
          const firstInStock = data.variants?.find((v: any) => v.stock > 0);
          if (firstInStock) setSelectedSize(firstInStock.size);
        }
      } catch {
        // Fallback demo product
        setProduct({
          _id: 'demo-p1',
          title: 'Minimalist Heavyweight Box Tee — Onyx Black',
          slug: slug || 'minimalist-heavyweight-box-tee-black',
          price: 2499,
          compareAtPrice: 3199,
          category: { name: 'T-Shirts', slug: 't-shirts' },
          description:
            'Engineered for maximum drape and durability. Milled from 320 GSM combed Supima cotton with a compact knit that holds its architectural silhouette after continuous wear and washing.',
          images: [
            { url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=85', altText: 'Front studio view' },
            { url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&q=85', altText: 'Lifestyle back view' },
            { url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&q=85', altText: 'Fabric detail closeup' },
          ],
          variants: [
            { sku: 'TEE-BLK-S', size: 'S', colorName: 'Onyx Black', stock: 5 },
            { sku: 'TEE-BLK-M', size: 'M', colorName: 'Onyx Black', stock: 14 },
            { sku: 'TEE-BLK-L', size: 'L', colorName: 'Onyx Black', stock: 10 },
            { sku: 'TEE-BLK-XL', size: 'XL', colorName: 'Onyx Black', stock: 3 },
            { sku: 'TEE-BLK-XXL', size: 'XXL', colorName: 'Onyx Black', stock: 0 },
          ],
          fabricCare: {
            composition: '100% Combed Long-Staple Supima Cotton',
            weightGsm: 320,
            weave: 'Single Jersey Compact Knit',
            origin: 'Crafted in Mumbai Atelier',
            careInstructions: 'Machine wash cold inside-out. Reshape whilst damp and dry flat in shade. Do not tumble dry.',
          },
          fitDetails: {
            silhouette: 'Architectural Drop-Shoulder Box Cut',
            modelWearing: "Model is 6'1\" (185cm) wearing size Large for an oversized drape.",
          },
        });
        setSelectedSize('M');
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-db-black border-t-transparent rounded-full" />
      </div>
    );
  }

  const isWishlisted = isInWishlist(product._id);
  const images = product.images && product.images.length > 0 ? product.images : [{ url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800' }];
  const currentVariant = product.variants?.find((v: any) => v.size === selectedSize);
  const isOutOfStock = !currentVariant || currentVariant.stock <= 0;

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error('Please choose a size');
      return;
    }
    if (isOutOfStock) {
      toast.error(`Size ${selectedSize} is currently sold out`);
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
        image: images[0]?.url,
        sku: currentVariant?.sku || `${product.slug}-${selectedSize}`,
      });
      toast.success(`Added ${product.title} to your bag`);
    } catch {
      toast.error('Unable to add to bag');
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/checkout');
  };

  const toggleAccordion = (key: string) => {
    setActiveAccordion(activeAccordion === key ? null : key);
  };

  return (
    <div className="min-h-screen pt-28 lg:pt-36 pb-20 transition-colors" style={{ backgroundColor: 'var(--site-bg)', color: 'var(--site-text)' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumbs */}
        <div className="text-[11px] uppercase tracking-[0.2em] text-db-neutral-500 mb-8">
          <Link to="/" className="hover:text-db-black">Home</Link> /{' '}
          <Link to="/shop" className="hover:text-db-black">Menswear</Link> /{' '}
          <span className="text-db-black font-semibold">{product.title}</span>
        </div>

        {/* ── Main Product Section ──────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Gallery (7 cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnail rail */}
            {images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:w-20 flex-shrink-0">
                {images.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`aspect-[3/4] w-16 md:w-full overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImageIndex === idx
                        ? 'border-db-black'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image */}
            <div className="flex-1 aspect-[3/4] bg-db-neutral-100 overflow-hidden relative group">
              <img
                src={images[selectedImageIndex]?.url}
                alt={product.title}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="absolute top-4 left-4 bg-db-gold text-db-black text-[11px] font-bold tracking-[0.15em] uppercase px-3 py-1">
                  Save {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                </span>
              )}
            </div>
          </div>

          {/* Right Product Buy Box (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-db-gold font-bold mb-2">
                DB CLOTHING ATELIER
              </p>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-tight text-db-black leading-snug">
                {product.title}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-2xl font-bold text-db-black tracking-wide">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-base text-db-neutral-400 line-through">
                    ₹{product.compareAtPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-[11px] text-db-neutral-500 uppercase tracking-wider">
                  Inclusive of all taxes
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-db-neutral-600 leading-relaxed border-t border-db-neutral-200 pt-4">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="border-t border-db-neutral-200 pt-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-db-black">
                  Select Size
                </span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-xs text-db-neutral-600 hover:text-db-black flex items-center gap-1 font-medium underline"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size & Measurement Guide</span>
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {(product.variants || []).map((v: any) => {
                  const isSelected = selectedSize === v.size;
                  const isSoldOut = v.stock <= 0;
                  return (
                    <button
                      key={v.size}
                      disabled={isSoldOut}
                      onClick={() => setSelectedSize(v.size)}
                      className={`py-3 text-xs font-semibold uppercase tracking-wider border transition-all relative ${
                        isSelected
                          ? 'bg-db-black text-white border-db-black font-bold'
                          : isSoldOut
                          ? 'bg-db-neutral-100 text-db-neutral-300 border-db-neutral-200 line-through cursor-not-allowed'
                          : 'bg-white text-db-neutral-800 border-db-neutral-300 hover:border-db-black'
                      }`}
                    >
                      {v.size}
                      {v.stock > 0 && v.stock <= 3 && (
                        <span className="absolute -top-1.5 -right-1 bg-amber-500 text-white text-[8px] font-bold px-1 rounded">
                          {v.stock} left
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {currentVariant && currentVariant.stock > 0 && currentVariant.stock <= 5 && (
                <p className="text-[11px] text-amber-700 font-medium mt-2">
                  Hurry, only {currentVariant.stock} remaining in size {selectedSize}.
                </p>
              )}
            </div>

            {/* Quantity Stepper & Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <div className="inline-flex items-center border border-db-neutral-300 bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2.5 text-xs hover:bg-db-neutral-100 text-db-black"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-bold text-db-black">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2.5 text-xs hover:bg-db-neutral-100 text-db-black"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || isOutOfStock}
                  className="flex-1 py-3.5 bg-db-black text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-db-charcoal flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isAdding ? 'Adding...' : isOutOfStock ? 'Sold Out' : 'Add To Bag'}</span>
                </button>

                <button
                  onClick={() => {
                    toggleWishlist(product._id);
                    toast.success(
                      isWishlisted ? 'Removed from wishlist' : 'Added to wishlist'
                    );
                  }}
                  className={`p-3.5 border transition-colors ${
                    isWishlisted
                      ? 'border-db-gold bg-db-gold/10 text-db-gold'
                      : 'border-db-neutral-300 text-db-neutral-600 hover:text-db-black hover:border-db-black'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-db-gold' : ''}`} />
                </button>
              </div>

              {!isOutOfStock && (
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 bg-db-gold text-db-black text-xs font-bold tracking-[0.2em] uppercase hover:bg-amber-400 transition-colors shadow-sm"
                >
                  Instant Buy Now &rarr;
                </button>
              )}
            </div>

            {/* Micro Delivery Perks */}
            <div className="border-t border-db-neutral-200 pt-5 space-y-2.5 text-xs text-db-neutral-600">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-db-gold flex-shrink-0" />
                <span>Complimentary Express Shipping on orders over ₹2,500</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-db-gold flex-shrink-0" />
                <span>7-Day Frictionless Return or Size Exchange</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-db-gold flex-shrink-0" />
                <span>Authentic DB Atelier Garment • Guaranteed Quality</span>
              </div>
            </div>

            {/* ── Collapsible Accordions ────────────────── */}
            <div className="border-t border-db-neutral-200 pt-4 divide-y divide-db-neutral-200 text-xs">
              {/* Fabric & Composition */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('fabric')}
                  className="w-full flex items-center justify-between text-left font-bold uppercase tracking-wider text-db-black"
                >
                  <span>Fabric & Engineering</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      activeAccordion === 'fabric' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeAccordion === 'fabric' && (
                  <div className="pt-3 space-y-1.5 text-db-neutral-600">
                    <p><strong>Composition:</strong> {product.fabricCare?.composition || '100% Long-Staple Combed Cotton'}</p>
                    <p><strong>Fabric Weight:</strong> {product.fabricCare?.weightGsm || 320} GSM Heavyweight Knit</p>
                    <p><strong>Origin:</strong> {product.fabricCare?.origin || 'DB Clothing Atelier, Mumbai'}</p>
                    <p><strong>Care:</strong> {product.fabricCare?.careInstructions || 'Machine wash cold inside out with similar darks. Flat dry.'}</p>
                  </div>
                )}
              </div>

              {/* Fit & Measurements */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('fit')}
                  className="w-full flex items-center justify-between text-left font-bold uppercase tracking-wider text-db-black"
                >
                  <span>Fit & Dimensions</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      activeAccordion === 'fit' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeAccordion === 'fit' && (
                  <div className="pt-3 space-y-1.5 text-db-neutral-600">
                    <p>{product.fitDetails?.silhouette || 'Relaxed architectural cut with structured shoulders.'}</p>
                    <p>{product.fitDetails?.modelWearing || "Model is 6'1\" wearing size Large."}</p>
                  </div>
                )}
              </div>

              {/* Shipping & Returns */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full flex items-center justify-between text-left font-bold uppercase tracking-wider text-db-black"
                >
                  <span>Delivery & Returns</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      activeAccordion === 'shipping' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeAccordion === 'shipping' && (
                  <div className="pt-3 space-y-1.5 text-db-neutral-600">
                    <p>Dispatch within 24–48 hours from our Mumbai atelier.</p>
                    <p>Express air courier delivery in 2–4 business days across major metros.</p>
                    <p>7-day doorstep return pickup and instant size exchanges.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </div>
  );
}
