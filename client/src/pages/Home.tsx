import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '../components/product/ProductCard';
import type { ProductItem } from '../types';
import QuickViewModal from '../components/product/QuickViewModal';
import api from '../lib/api';
import { useStorefrontCustomizer } from '../store/customizerStore';

// 3D Landing Page Components inspired by the luxury showcase video
import ScrollWalkthroughHero3D from '../components/landing3d/ScrollWalkthroughHero3D';
import CylindricalArcCarousel3D from '../components/landing3d/CylindricalArcCarousel3D';
import SartorialMoodsGallery from '../components/landing3d/SartorialMoodsGallery';
import SculpturalWaveDivider from '../components/landing3d/SculpturalWaveDivider';
import DarkAtelierCollection from '../components/landing3d/DarkAtelierCollection';
import InteractiveLookBuilder3D from '../components/landing3d/InteractiveLookBuilder3D';
import OccasionEditsSpread from '../components/landing3d/OccasionEditsSpread';
import LatestTrendsSplit from '../components/landing3d/LatestTrendsSplit';


const CATEGORIES = [
  {
    name: 'Heavyweight Tees',
    slug: 't-shirts',
    subtitle: '320 GSM French Terry & Supima Cotton',
    image: '/images/cat_tees.jpg',
    link: '/shop?category=t-shirts',
    tag: 'Drop Shoulder Boxy Cut',
  },
  {
    name: 'Architectural Shirts',
    slug: 'shirts',
    subtitle: 'Crisp Japanese Poplin & Structured Oxford',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
    link: '/shop?category=shirts',
    tag: 'Custom Mother of Pearl Buttons',
  },
  {
    name: 'Tailored Trousers',
    slug: 'trousers',
    subtitle: 'Pleated Italian Twill & Breathable Linen',
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80',
    link: '/shop?category=trousers',
    tag: 'Double Deep Pleats',
  },
  {
    name: 'Selvedge Denim',
    slug: 'jeans',
    subtitle: '14.5oz Raw & Vintage Hand-Washed',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
    link: '/shop?category=jeans',
    tag: 'Vintage Shuttle Loom',
  },
];

const FALLBACK_PRODUCTS: ProductItem[] = [
  {
    _id: 'demo-1',
    title: 'Minimalist Heavyweight Box Tee — Onyx Black',
    slug: 'minimalist-heavyweight-box-tee-black',
    price: 2499,
    compareAtPrice: 3199,
    category: { name: 'T-Shirts', slug: 't-shirts' },
    isNewArrival: true,
    isBestSeller: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80' },
    ],
    variants: [
      { sku: 'TEE-BLK-S', size: 'S', colorName: 'Onyx Black', stock: 12 },
      { sku: 'TEE-BLK-M', size: 'M', colorName: 'Onyx Black', stock: 18 },
      { sku: 'TEE-BLK-L', size: 'L', colorName: 'Onyx Black', stock: 15 },
      { sku: 'TEE-BLK-XL', size: 'XL', colorName: 'Onyx Black', stock: 8 },
    ],
  },
  {
    _id: 'demo-2',
    title: 'Architectural Camp-Collar Linen Shirt — Sandstone',
    slug: 'architectural-camp-collar-linen-shirt-sandstone',
    price: 3499,
    compareAtPrice: 4299,
    category: { name: 'Shirts', slug: 'shirts' },
    isNewArrival: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80' },
    ],
    variants: [
      { sku: 'SHIRT-SND-M', size: 'M', colorName: 'Sandstone', stock: 9 },
      { sku: 'SHIRT-SND-L', size: 'L', colorName: 'Sandstone', stock: 14 },
      { sku: 'SHIRT-SND-XL', size: 'XL', colorName: 'Sandstone', stock: 6 },
    ],
  },
  {
    _id: 'demo-3',
    title: 'Double-Pleated Relaxed Trouser — Slate Charcoal',
    slug: 'double-pleated-relaxed-trouser-charcoal',
    price: 4199,
    category: { name: 'Trousers', slug: 'trousers' },
    isBestSeller: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=800&q=80' },
    ],
    variants: [
      { sku: 'TRS-CHR-30', size: 'S', colorName: 'Charcoal', stock: 7 },
      { sku: 'TRS-CHR-32', size: 'M', colorName: 'Charcoal', stock: 12 },
      { sku: 'TRS-CHR-34', size: 'L', colorName: 'Charcoal', stock: 9 },
    ],
  },
  {
    _id: 'demo-4',
    title: '14.5oz Japanese Selvedge Raw Denim — Indigo',
    slug: 'japanese-selvedge-raw-denim-indigo',
    price: 4999,
    compareAtPrice: 5999,
    category: { name: 'Jeans', slug: 'jeans' },
    isNewArrival: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80' },
    ],
    variants: [
      { sku: 'DNM-IND-30', size: 'S', colorName: 'Raw Indigo', stock: 5 },
      { sku: 'DNM-IND-32', size: 'M', colorName: 'Raw Indigo', stock: 10 },
      { sku: 'DNM-IND-34', size: 'L', colorName: 'Raw Indigo', stock: 8 },
    ],
  },
];

export default function Home() {
  const customizer = useStorefrontCustomizer();
  const [featuredProducts, setFeaturedProducts] = useState<ProductItem[]>(FALLBACK_PRODUCTS);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res: any = await api.get('/products?isFeatured=true&limit=8');
        const list = res.data?.data?.products || res.data?.products;
        if (list && list.length > 0) {
          const normalized = list.map((p: any) => ({
            _id: p._id,
            title: p.title || p.name,
            slug: p.slug,
            price: p.price || p.basePrice,
            compareAtPrice: p.compareAtPrice,
            images: p.images || [],
            variants: p.variants || [],
            category: p.category,
            isNewArrival: p.isNewArrival,
            isBestSeller: p.isBestSeller,
          }));
          setFeaturedProducts(normalized);
        }
      } catch {
        // Fallback pre-populated
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="bg-white overflow-hidden text-db-black">
      {/* ── 1. SCROLL-DRIVEN 3D WALKTHROUGH HERO (Pinned 280vh) ── */}
      <div id="section-hero">
        <ScrollWalkthroughHero3D />
      </div>

      {/* ── 2. SEAMLESS INFINITE LUXURY MARQUEE TICKER ───────────── */}
      <div className="bg-db-black text-db-gold py-4 border-y border-db-gold/25 overflow-hidden relative">
        <div className="animate-marquee whitespace-nowrap text-xs font-semibold tracking-[0.3em] uppercase flex items-center">
          <span className="mx-6 flex items-center gap-3">
            <span>{customizer.marqueeText || 'HAUTE SARTORIAL ARCHITECTURE • 320 GSM HEAVYWEIGHT TERRY • BELGIAN FLAX LINEN • JAPANESE SELVEDGE'}</span>
          </span>
          <span className="mx-6 flex items-center gap-3">
            <span>{customizer.marqueeText || 'HAUTE SARTORIAL ARCHITECTURE • 320 GSM HEAVYWEIGHT TERRY • BELGIAN FLAX LINEN • JAPANESE SELVEDGE'}</span>
          </span>
        </div>
      </div>

      {/* ── 3. CYLINDRICAL 3D ARC CAROUSEL SHOWCASE ──────────────── */}
      <div id="section-cylindrical">
        <CylindricalArcCarousel3D />
      </div>

      {/* ── 4. SIX SARTORIAL MOODS ──────────────────────────────── */}
      <div id="section-moods">
        <SartorialMoodsGallery />
      </div>

        {/* ── 5. SCULPTURAL WAVE TRANSITION INTO NOIR ATELIER ───────── */}
        <SculpturalWaveDivider topColor="#FAF9F7" bottomColor="#0D0C0B" />

        {/* ── 6. THE BLACK-TIE & CEREMONIAL ATELIER (00:09 in Video) ── */}
        <div id="section-ceremonial">
          <DarkAtelierCollection />
        </div>

        {/* ── 7. SCULPTURAL WAVE TRANSITION BACK TO LIGHT ──────────── */}
        <SculpturalWaveDivider topColor="#0D0C0B" bottomColor="#FFFFFF" inverted={true} />

        {/* ── 8. INTERACTIVE 3D LOOK BUILDER (00:13 - 00:15 in Video) ─ */}
        <div id="section-lookbuilder">
          <InteractiveLookBuilder3D />
        </div>

        {/* ── 9. EDITS FOR EVERY OCCASION (00:16 in Video) ─────────── */}
        <div id="section-edits">
          <OccasionEditsSpread />
        </div>

        {/* ── 10. CURATED WARDROBE PILLARS (Original Grid) ─────────── */}
        {customizer.showPillarsSection !== false && (
          <section className="py-24 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 border-b border-db-neutral-200 pb-5">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-db-gold mb-1 block">
                  Curated Wardrobe Pillars
                </span>
                <h2 className="font-serif text-3xl md:text-5xl font-bold text-db-black uppercase tracking-tight">
                  {customizer.pillarsTitle || 'Signature Silhouettes'}
                </h2>
              </div>
              <Link
                to="/shop"
                className="mt-4 md:mt-0 text-xs font-bold tracking-[0.2em] uppercase text-db-black hover:text-db-gold inline-flex items-center gap-2 group transition-colors"
              >
                <span>Explore All Garments</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {CATEGORIES.map((cat, idx) => (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                >
                  <Link
                    to={cat.link}
                    className="group relative aspect-[3/4] overflow-hidden bg-db-neutral-100 flex flex-col justify-end p-6 border border-db-neutral-200 shadow-sm block"
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent transition-opacity duration-300 group-hover:from-black/95" />

                    <div className="relative z-10 transform transition-transform duration-300 group-hover:-translate-y-1.5">
                      <span className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest mb-2">
                        {cat.tag}
                      </span>
                      <p className="text-[10px] text-db-gold uppercase tracking-[0.2em] font-medium mb-1">
                        {cat.subtitle}
                      </p>
                      <h3 className="font-serif text-2xl font-bold text-white uppercase tracking-wider mb-2">
                        {cat.name}
                      </h3>
                      <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-white/90 group-hover:text-db-gold font-bold transition-colors">
                        <span>Acquire Pillar</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── 11. FEATURED ATELIER ROTATION (Essential Drop) ──────── */}
        {customizer.showRotationSection !== false && (
          <section className="py-20 bg-db-neutral-50 px-6 border-y border-db-neutral-200">
            <div className="max-w-7xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-db-gold mb-2 block">
                  Spring / Summer 2026 Release
                </span>
                <h2 className="font-serif text-3xl md:text-5xl font-bold text-db-black uppercase tracking-tight mb-3">
                  {customizer.rotationTitle || 'The Essential Rotation'}
                </h2>
                <p className="text-xs sm:text-sm text-db-neutral-600">
                  Limited batch drops created with custom fabric milling and precision architectural cuts.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
                {featuredProducts.slice(0, 4).map((p) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    onQuickView={(prod) => setQuickViewProduct(prod)}
                  />
                ))}
              </div>

              <div className="mt-16 text-center">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-3 px-10 py-4 bg-db-black text-white text-xs font-semibold tracking-[0.25em] uppercase hover:bg-db-charcoal transition-all shadow-md group"
                >
                  <span>Explore Complete Atelier Catalogue</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── 12. THE ATELIER PHILOSOPHY & CRAFTSMANSHIP ───────────── */}
        {customizer.showCraftsmanshipSection !== false && (
          <section className="py-24 px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="relative aspect-[4/5] bg-db-neutral-100 overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1000&q=80"
                  alt="DB Clothing atelier craftsmanship"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/95 backdrop-blur-md border border-db-neutral-200">
                  <p className="text-[10px] text-db-gold uppercase tracking-[0.2em] font-bold mb-1">
                    Atelier Grade Precision
                  </p>
                  <p className="font-serif text-base font-bold text-db-black uppercase">
                    {customizer.atelierQuote || 'Every stitch serves an architectural purpose.'}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-db-gold block">
                  The Architecture
                </span>
                <h2 className="font-serif text-3xl md:text-5xl font-bold text-db-black uppercase tracking-tight leading-tight">
                  {customizer.craftsmanshipTitle || 'Heavyweight Fabrics. Sculpted Drapes.'}
                </h2>
                <p className="text-sm text-db-neutral-600 leading-relaxed">
                  Every garment in the DB Clothing collection begins with bespoke fabric formulation. We reject synthetic blends in favor of 100% combed long-staple cotton, French Terry pre-shrunk at the yarn level, and selvedge denims woven on vintage shuttle looms.
                </p>
                <p className="text-sm text-db-neutral-600 leading-relaxed">
                  Our silhouettes are balanced between relaxed streetwear architecture and formal bespoke proportions—designed to hold their structure wash after wash, season after season.
                </p>

                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-db-neutral-200">
                  <div>
                    <h4 className="font-serif text-3xl font-bold text-db-black mb-1">{customizer.gsmNumber || '320 GSM'}</h4>
                    <p className="text-xs text-db-neutral-500 uppercase tracking-wider">
                      {customizer.gsmLabel || 'Heavyweight French Terry'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-serif text-3xl font-bold text-db-black mb-1">{customizer.fiberOrigin || '100% Long-Staple'}</h4>
                    <p className="text-xs text-db-neutral-500 uppercase tracking-wider">
                      {customizer.fiberLabel || 'Combed Supima Fiber'}
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-db-black hover:text-db-gold border-b-2 border-db-black pb-1 transition-colors"
                  >
                    <span>Read The DB Brand Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── 13. LATEST TRENDS ASYMMETRICAL SPLIT (00:19 in Video) ── */}
        <LatestTrendsSplit />

        {/* ── 14. PRESS & CRITICAL ACCLAIM ─────────────────────────── */}
        {customizer.showAcclaimSection !== false && (
          <section className="py-20 bg-db-black text-white px-6 relative overflow-hidden">
            <div className="max-w-5xl mx-auto text-center relative z-10">
              <div className="flex justify-center gap-1.5 mb-5 text-db-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-db-gold" />
                ))}
              </div>
              <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl italic font-normal text-db-neutral-200 mb-8 max-w-3xl mx-auto leading-relaxed">
                "DB Clothing has quietly established the benchmark for high-end menswear in India—delivering the heavyweight luxury drapes usually reserved for Parisian fashion houses."
              </blockquote>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-db-gold">
                — THE GENTLEMAN'S EDITORIAL REVIEW, 2026
              </p>
            </div>
          </section>
        )}

        {/* Quick View Modal */}
        {quickViewProduct && (
          <QuickViewModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
          />
        )}
      </div>
  );
}
