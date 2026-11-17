import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Plus,
  ShoppingBag,
  Check,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
} from 'lucide-react';
import { useCartStore } from '../../store';
import toast from 'react-hot-toast';

export interface HeroGarment {
  id: string;
  badge: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  description: string;
  name: string;
  price: number;
  formattedPrice: string;
  category: string;
  slug: string;
  fabricSpecs: string;
  images: {
    front: string;
    side: string;
    back: string;
    macro: string;
  };
  colors: { name: string; hex: string }[];
  hotspot: {
    title: string;
    price: string;
    category: string;
    x: string;
    y: string;
  };
}

const HERO_GARMENTS: HeroGarment[] = [
  {
    id: 'hero-garment-1',
    badge: 'SPRING / SUMMER 2026 ATELIER',
    titleLine1: 'ARCHITECTURAL',
    titleLine2: 'SILHOUETTES.',
    subtitle: 'UNCOMPROMISING LUXURY.',
    description:
      'Engineered in Mumbai from 320 GSM French Terry, bespoke Italian selvedge denim, and structured Japanese poplin. Tailored for the modern sartorial gentleman.',
    name: 'Minimalist Heavyweight Box Tee — Onyx Black',
    price: 2499,
    formattedPrice: '₹2,499',
    category: 'Heavyweight Supima',
    slug: 'minimalist-heavyweight-box-tee-black',
    fabricSpecs: '320 GSM Combed Supima Cotton • Pre-Shrunk Loopback',
    images: {
      front: '/images/hero1.jpg',
      side: '/images/cat_tees.jpg',
      back: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&q=85',
      macro: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900&q=85',
    },
    colors: [
      { name: 'Onyx Black', hex: '#0D0C0B' },
      { name: 'Chalk White', hex: '#FAF9F7' },
      { name: 'Slate Charcoal', hex: '#2C2A27' },
    ],
    hotspot: {
      title: 'Minimalist Box Tee — Onyx Black',
      price: '₹2,499',
      category: 'Heavyweight Supima',
      x: '50%',
      y: '38%',
    },
  },
  {
    id: 'hero-garment-2',
    badge: 'RESORT & LINEN CAPSULE',
    titleLine1: 'SUMMER IN',
    titleLine2: 'SANDSTONE.',
    subtitle: 'EFFORTLESS SARTORIAL EASE.',
    description:
      'Woven from 100% pure Belgian flax linen. Relaxed camp-collar shirts and double-pleated tailored trousers designed to breathe through temperate climates.',
    name: 'Architectural Camp-Collar Linen Shirt — Sandstone',
    price: 3499,
    formattedPrice: '₹3,499',
    category: '100% Belgian Flax',
    slug: 'architectural-camp-collar-linen-shirt-sandstone',
    fabricSpecs: '190 GSM Long-Staple European Flax • Open Weave',
    images: {
      front: '/images/hero2.jpg',
      side: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&q=85',
      back: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=900&q=85',
      macro: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=85',
    },
    colors: [
      { name: 'Sandstone Natural', hex: '#D5CFC3' },
      { name: 'French Olive', hex: '#585D4E' },
      { name: 'Obsidian Noir', hex: '#1C1B19' },
    ],
    hotspot: {
      title: 'Camp-Collar Linen Shirt — Sandstone',
      price: '₹3,499',
      category: '100% Belgian Flax',
      x: '54%',
      y: '34%',
    },
  },
  {
    id: 'hero-garment-3',
    badge: 'BLACK-TIE CEREMONIAL ATELIER',
    titleLine1: 'OBSIDIAN',
    titleLine2: 'ELEGANCE.',
    subtitle: 'HAUTE DINNER SUITE.',
    description:
      'Crafted from Lyon silk velvet with hand-rolled satin peak lapels. Tailored with structured roped shoulder architecture for high-profile galas.',
    name: 'Obsidian Velvet Double-Breasted Dinner Jacket',
    price: 16999,
    formattedPrice: '₹16,999',
    category: 'Silk & Velvet Atelier',
    slug: 'minimalist-heavyweight-box-tee-black',
    fabricSpecs: 'Super 130s Italian Wool & Silk Velvet • Satin Facing',
    images: {
      front: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&q=85',
      side: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=900&q=85',
      back: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&q=85',
      macro: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900&q=85',
    },
    colors: [
      { name: 'Midnight Noir', hex: '#0D0C0B' },
      { name: 'Bordeaux Velvet', hex: '#3B121B' },
    ],
    hotspot: {
      title: 'Obsidian Velvet Dinner Jacket',
      price: '₹16,999',
      category: 'Haute Velvet',
      x: '50%',
      y: '36%',
    },
  },
  {
    id: 'hero-garment-4',
    badge: 'ARCHITECTURAL TAILORING',
    titleLine1: 'SCULPTED',
    titleLine2: 'DRAPES.',
    subtitle: 'ITALIAN TWILL VOLUMES.',
    description:
      'Double-reverse forward pleats providing structural volume and graceful movement through the leg. Engineered with a bespoke high-rise waistband.',
    name: 'Double-Pleated Relaxed Trouser — Slate Charcoal',
    price: 4199,
    formattedPrice: '₹4,199',
    category: 'Italian Wool Twill',
    slug: 'double-pleated-relaxed-trouser-charcoal',
    fabricSpecs: '280 GSM Virgin Wool & Structured Combed Cotton',
    images: {
      front: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&q=85',
      side: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=900&q=85',
      back: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&q=85',
      macro: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&q=85',
    },
    colors: [
      { name: 'Slate Charcoal', hex: '#2C2A27' },
      { name: 'Warm Khaki', hex: '#B0A898' },
      { name: 'Pitch Black', hex: '#141312' },
    ],
    hotspot: {
      title: 'Double-Pleated Trouser — Charcoal',
      price: '₹4,199',
      category: 'Italian Twill',
      x: '52%',
      y: '48%',
    },
  },
  {
    id: 'hero-garment-5',
    badge: 'VINTAGE SHUTTLE LOOM',
    titleLine1: 'OKAYAMA',
    titleLine2: 'SELVEDGE.',
    subtitle: '14.5OZ RAW INDIGO PATINA.',
    description:
      'Woven on restored 1960s Toyoda shuttle looms in Kojima. Deep rope-dyed natural indigo with authentic red-line selvedge ID on the outseam.',
    name: '14.5oz Japanese Selvedge Raw Denim — Indigo',
    price: 4999,
    formattedPrice: '₹4,999',
    category: 'Japanese Selvedge',
    slug: 'japanese-selvedge-raw-denim-indigo',
    fabricSpecs: '14.5oz Ring-Spun Rope-Dyed Indigo • Red-Line ID',
    images: {
      front: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&q=85',
      side: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=900&q=85',
      back: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&q=85',
      macro: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=900&q=85',
    },
    colors: [
      { name: 'Raw Deep Indigo', hex: '#192841' },
      { name: 'Vintage Stone Wash', hex: '#687D94' },
    ],
    hotspot: {
      title: '14.5oz Japanese Selvedge Denim',
      price: '₹4,999',
      category: 'Vintage Shuttle',
      x: '52%',
      y: '45%',
    },
  },
  {
    id: 'hero-garment-6',
    badge: 'ATELIER OUTERWEAR',
    titleLine1: 'DOUBLE-FACED',
    titleLine2: 'CASHMERE.',
    subtitle: 'STRUCTURED OVERCOAT.',
    description:
      'Tailored from 540 GSM virgin wool blended with Mongolian cashmere. Broad architectural lapels and hand-finished pick-stitching along the canvas edge.',
    name: 'Structured Wool-Cashmere Atelier Overcoat — Camel',
    price: 12499,
    formattedPrice: '₹12,499',
    category: 'Virgin Wool Cashmere',
    slug: 'double-pleated-relaxed-trouser-charcoal',
    fabricSpecs: '540 GSM Double-Faced Cashmere Blend • Milan Atelier',
    images: {
      front: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&q=85',
      side: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&q=85',
      back: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&q=85',
      macro: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&q=85',
    },
    colors: [
      { name: 'Camel Tan', hex: '#C19A6B' },
      { name: 'Midnight Charcoal', hex: '#232528' },
    ],
    hotspot: {
      title: 'Wool-Cashmere Overcoat',
      price: '₹12,499',
      category: 'Cashmere Atelier',
      x: '48%',
      y: '32%',
    },
  },
];

export default function HeroInfiniteRunway3D() {
  // Infinite virtual index
  const [virtualIndex, setVirtualIndex] = useState(0);
  const total = HERO_GARMENTS.length;
  const activeIndex = ((virtualIndex % total) + total) % total;
  const activeGarment = HERO_GARMENTS[activeIndex];

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isHotspotOpen, setIsHotspotOpen] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, rotX: 0, rotY: 0 });
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const { addToCart, openDrawer } = useCartStore();

  // Auto-cruise through 3D garments every 6.5s
  useEffect(() => {
    if (!isAutoPlay || isHovered || isDragging) return;
    const interval = setInterval(() => {
      setVirtualIndex((prev) => prev + 1);
      setSelectedColorIndex(0);
      setRotation({ x: 0, y: 0 });
      setZoomLevel(1.0);
      setIsHotspotOpen(false);
    }, 6500);
    return () => clearInterval(interval);
  }, [isAutoPlay, isHovered, isDragging]);

  const handleNext = () => {
    setVirtualIndex((prev) => prev + 1);
    setSelectedColorIndex(0);
    setRotation({ x: 0, y: 0 });
    setZoomLevel(1.0);
    setIsHotspotOpen(false);
  };

  const handlePrev = () => {
    setVirtualIndex((prev) => prev - 1);
    setSelectedColorIndex(0);
    setRotation({ x: 0, y: 0 });
    setZoomLevel(1.0);
    setIsHotspotOpen(false);
  };

  const handleJump = (idx: number) => {
    const diff = (idx - activeIndex + total) % total;
    setVirtualIndex((prev) => prev + (diff > total / 2 ? diff - total : diff));
    setSelectedColorIndex(0);
    setRotation({ x: 0, y: 0 });
    setZoomLevel(1.0);
    setIsHotspotOpen(false);
  };

  // Mouse Wheel Infinite 3D Scroll Listener on Hero
  const lastWheelTime = useRef(0);
  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTime.current > 420) {
      if (Math.abs(e.deltaY) > 25 || Math.abs(e.deltaX) > 25) {
        lastWheelTime.current = now;
        if (e.deltaY > 0 || e.deltaX > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }
  };

  // 360 Drag rotation on active garment
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      rotX: rotation.x,
      rotY: rotation.y,
    });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      setRotation({
        x: Math.max(-20, Math.min(20, dragStart.rotX - deltaY * 0.25)),
        y: (dragStart.rotY + deltaX * 0.4) % 360,
      });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) setIsDragging(false);
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Touch Swipe for mobile
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handlePrev();
      else handleNext();
    }
  };

  // Instant Add to Cart
  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart({
        productId: activeGarment.id,
        title: `${activeGarment.name} (${activeGarment.colors[selectedColorIndex].name})`,
        price: activeGarment.price,
        image: activeGarment.images.front,
        size: 'L',
        quantity: 1,
      });
      setIsAdded(true);
      toast.success(`Acquired ${activeGarment.name} (L)`);
      openDrawer();
    } catch {
      toast.error('Unable to add item');
    } finally {
      setIsAdding(false);
      setTimeout(() => setIsAdded(false), 2500);
    }
  };

  // 3D Depth Card Array (Offset -1, 0, 1)
  const depthOffsets = [-1, 0, 1];

  return (
    <section
      ref={heroRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative h-screen min-h-[750px] max-h-[1050px] w-full flex items-center justify-center overflow-hidden bg-db-black text-white select-none perspective-1400"
    >
      {/* ── 3D DEPTH STACKED RUNWAY BACKGROUND ──────────────── */}
      <div className="absolute inset-0 preserve-3d flex items-center justify-center pointer-events-none">
        {depthOffsets.map((offset) => {
          const idx = ((((virtualIndex + offset) % total) + total) % total);
          const garment = HERO_GARMENTS[idx];
          const isCenter = offset === 0;

          // Spatial 3D positioning along Z-depth axis
          const zTranslate = offset * -450;
          const xTranslate = offset * 420;
          const yRotation = offset * -22;
          const scale = isCenter ? 1.0 * zoomLevel : 0.75;
          const opacity = isCenter ? 1.0 : 0.28;

          return (
            <motion.div
              key={`${virtualIndex + offset}-${garment.id}`}
              initial={false}
              animate={{
                x: xTranslate,
                z: zTranslate,
                rotateY: isCenter ? rotation.y : yRotation,
                rotateX: isCenter ? rotation.x : 0,
                scale,
                opacity,
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex items-center justify-center preserve-3d"
            >
              <img
                src={garment.images.front}
                alt={garment.name}
                className="w-full h-full object-cover object-center filter brightness-[0.68] contrast-[1.08]"
              />
            </motion.div>
          );
        })}

        {/* Cinematic Multilayer Vignette & Radial Spotlight */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/35 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-vignette opacity-80 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,168,128,0.12)_0%,transparent_65%)] pointer-events-none" />
      </div>

      {/* ── INTERACTIVE 3D HOTSPOT PIN ON MODEL ─────────────── */}
      <div
        className="absolute z-20 transition-all duration-300 hidden md:block"
        style={{
          top: activeGarment.hotspot.y,
          left: activeGarment.hotspot.x,
        }}
      >
        <div className="relative">
          <button
            onClick={() => setIsHotspotOpen(!isHotspotOpen)}
            className="w-8 h-8 rounded-full bg-db-gold text-db-black flex items-center justify-center shadow-2xl animate-pulse-glow transition-transform hover:scale-125 cursor-pointer"
            aria-label="View 3D look item details"
          >
            <Plus className="w-4 h-4 font-bold" />
          </button>

          <AnimatePresence>
            {isHotspotOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 w-72 bg-db-black/95 backdrop-blur-xl border border-db-gold/40 p-4 shadow-2xl text-left z-30"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] uppercase tracking-[0.25em] text-db-gold font-bold">
                    3D Spotlight Garment
                  </span>
                  <span className="text-[10px] text-white/60 uppercase">
                    0{activeIndex + 1} / 0{total}
                  </span>
                </div>
                <h4 className="font-serif text-sm font-bold text-white leading-snug">
                  {activeGarment.name}
                </h4>
                <p className="text-[11px] text-db-neutral-400 mt-1 line-clamp-2">
                  {activeGarment.fabricSpecs}
                </p>

                {/* Colorway preview */}
                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/10">
                  <span className="text-[10px] uppercase text-db-neutral-400">Colorway:</span>
                  <div className="flex items-center gap-1.5">
                    {activeGarment.colors.map((c, i) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColorIndex(i)}
                        className={`w-4 h-4 rounded-full border ${
                          selectedColorIndex === i ? 'border-db-gold scale-110' : 'border-white/30'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                  <span className="text-sm font-semibold text-db-gold">
                    {activeGarment.formattedPrice}
                  </span>
                  <button
                    onClick={handleAddToCart}
                    className="text-[10px] font-bold uppercase tracking-wider text-white hover:text-db-gold flex items-center gap-1.5"
                  >
                    <span>Acquire</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── HERO CENTRAL EDITORIAL CONTENT ──────────────────── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center pt-6">
        {/* Animated Badge Pill */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`badge-${activeGarment.id}`}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 border border-db-gold/40 bg-black/60 backdrop-blur-md text-db-gold text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] uppercase mb-4 shadow-xl"
          >
            <Sparkles className="w-3.5 h-3.5 text-db-gold" />
            <span>{activeGarment.badge}</span>
            <span className="text-white/40 ml-1">
              [ 0{activeIndex + 1} / 0{total} ]
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Main Headline with 3D Depth Transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`title-${activeGarment.id}`}
            initial={{ opacity: 0, y: 25, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 1.02 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white uppercase leading-[0.95] drop-shadow-2xl">
              <span>{activeGarment.titleLine1}</span> <br />
              <span className="italic font-normal text-db-neutral-200">{activeGarment.titleLine2}</span>
            </h1>
            <p className="font-serif text-base sm:text-xl md:text-2xl text-db-gold uppercase tracking-[0.2em] font-medium mt-3 drop-shadow-md">
              {activeGarment.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Subtitle / Description */}
        <AnimatePresence mode="wait">
          <motion.p
            key={`desc-${activeGarment.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-2xl text-xs sm:text-sm md:text-base text-db-neutral-300 font-light tracking-wide mt-4 mb-7 leading-relaxed drop-shadow"
          >
            {activeGarment.description}
          </motion.p>
        </AnimatePresence>

        {/* Action Buttons & Quick Acquire */}
        <motion.div
          key={`cta-${activeGarment.id}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          {/* Quick Acquire Button directly from 3D Hero */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full sm:w-auto px-9 py-4 bg-white text-db-black text-xs font-bold tracking-[0.25em] uppercase hover:bg-db-gold hover:text-black transition-all duration-300 shadow-2xl flex items-center justify-center gap-2 group cursor-pointer"
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 text-db-gold" />
                <span>Acquired To Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Acquire Look • {activeGarment.formattedPrice}</span>
              </>
            )}
          </button>

          <Link
            to={`/product/${activeGarment.slug}`}
            className="w-full sm:w-auto px-9 py-4 border border-white/60 bg-white/10 backdrop-blur-md text-white text-xs font-semibold tracking-[0.25em] uppercase hover:bg-white hover:text-db-black transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>Explore Garment</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* ── 3D DRAG / MACRO ZOOM INLINE CONTROLS (Top Right) ── */}
      <div className="absolute top-20 right-4 sm:right-8 z-30 flex flex-col items-end gap-2">
        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/20 p-1 shadow-xl">
          <button
            onClick={() => setZoomLevel((prev) => Math.max(1.0, prev - 0.25))}
            className="p-1.5 text-white hover:text-db-gold transition-colors"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="px-1.5 text-[10px] font-bold text-db-gold font-mono">
            {zoomLevel.toFixed(1)}x
          </span>
          <button
            onClick={() => setZoomLevel((prev) => Math.min(2.2, prev + 0.25))}
            className="p-1.5 text-white hover:text-db-gold transition-colors"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setRotation({ x: 0, y: 0 });
              setZoomLevel(1.0);
            }}
            className="p-1.5 text-white hover:text-db-gold transition-colors ml-1"
            title="Reset 3D Angle"
            aria-label="Reset 3D Angle"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Drag rotation helper pill */}
        <div
          onMouseDown={handleMouseDown}
          className="px-3 py-1 bg-black/70 backdrop-blur-md border border-white/10 text-[9px] font-bold uppercase tracking-wider text-db-neutral-300 shadow cursor-grab active:cursor-grabbing hover:border-db-gold hover:text-white transition-all flex items-center gap-1.5"
        >
          <Sparkles className="w-3 h-3 text-db-gold" />
          <span>Click & Drag to Rotate 3D</span>
        </div>
      </div>

      {/* ── PREVIOUS / NEXT SLIDE ARROW BUTTONS ─────────────── */}
      <button
        onClick={handlePrev}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-db-black transition-all duration-300 group cursor-pointer"
        aria-label="Previous 3D garment"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-db-black transition-all duration-300 group cursor-pointer"
        aria-label="Next 3D garment"
      >
        <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* ── BOTTOM INFINITE RUNWAY DECK & PROGRESS ───────────── */}
      <div className="absolute bottom-16 sm:bottom-20 z-30 flex items-center gap-3 sm:gap-6">
        <button
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          className="p-1.5 rounded-full border border-white/20 bg-black/40 text-white hover:border-db-gold hover:text-db-gold transition-colors"
          title={isAutoPlay ? 'Pause auto-cruise' : 'Start auto-cruise'}
          aria-label="Toggle auto cruise"
        >
          {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        {HERO_GARMENTS.map((garment, idx) => (
          <button
            key={garment.id}
            onClick={() => handleJump(idx)}
            className="group flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer"
          >
            <span
              className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
                activeIndex === idx ? 'text-db-gold' : 'text-white/45 group-hover:text-white'
              }`}
            >
              0{idx + 1} // {garment.titleLine1}
            </span>
            <div className="w-12 sm:w-20 md:w-24 h-0.5 bg-white/20 overflow-hidden rounded-full">
              <div
                className={`h-full bg-db-gold transition-all duration-500 ${
                  activeIndex === idx ? 'w-full' : 'w-0'
                }`}
              />
            </div>
          </button>
        ))}
      </div>

      {/* ── BOTTOM FLOATING DELIVERY PERKS STRIP ────────────── */}
      <div className="absolute bottom-0 inset-x-0 border-t border-white/10 bg-black/80 backdrop-blur-md hidden lg:block z-20">
        <div className="max-w-7xl mx-auto px-6 py-3.5 grid grid-cols-3 divide-x divide-white/10 text-center text-xs tracking-widest text-db-neutral-300 uppercase">
          <div className="flex items-center justify-center gap-2">
            <Truck className="w-4 h-4 text-db-gold" />
            <span>Complimentary Express Shipping over ₹2500</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-db-gold" />
            <span>Heavyweight 320 GSM Supima Cotton</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 text-db-gold" />
            <span>7-Day Frictionless Return & Size Exchange</span>
          </div>
        </div>
      </div>
    </section>
  );
}
