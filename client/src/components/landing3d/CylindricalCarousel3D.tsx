import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Play, Pause } from 'lucide-react';

export interface CylindricalCardItem {
  id: string;
  title: string;
  tag: string;
  price: string;
  category: string;
  slug: string;
  image: string;
  fabric: string;
}

const CAROUSEL_ITEMS: CylindricalCardItem[] = [
  {
    id: 'c1',
    title: 'Minimalist Box Tee — Onyx',
    tag: '320 GSM Supima',
    price: '₹2,499',
    category: 'Heavyweight Tees',
    slug: 'minimalist-heavyweight-box-tee-black',
    image: '/images/hero1.jpg',
    fabric: '100% Pre-Shrunk Combed Cotton',
  },
  {
    id: 'c2',
    title: 'Camp-Collar Linen Shirt',
    tag: 'Belgian Flax',
    price: '₹3,499',
    category: 'Architectural Shirts',
    slug: 'architectural-camp-collar-linen-shirt-sandstone',
    image: '/images/hero2.jpg',
    fabric: 'Pure Long-Staple European Flax',
  },
  {
    id: 'c3',
    title: 'Double-Pleated Trousers',
    tag: 'Italian Twill',
    price: '₹4,199',
    category: 'Tailored Trousers',
    slug: 'double-pleated-relaxed-trouser-charcoal',
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80',
    fabric: 'Virgin Wool & Structured Cotton',
  },
  {
    id: 'c4',
    title: '14.5oz Raw Selvedge Denim',
    tag: 'Vintage Loom',
    price: '₹4,999',
    category: 'Selvedge Denim',
    slug: 'japanese-selvedge-raw-denim-indigo',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
    fabric: 'Ring-Spun Rope Dyed Indigo',
  },
  {
    id: 'c5',
    title: 'Sartorial Velvet Tuxedo',
    tag: 'Haute Noir',
    price: '₹16,999',
    category: 'Ceremonial Suite',
    slug: 'minimalist-heavyweight-box-tee-black',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
    fabric: 'Silk-Faced Silk Velvet',
  },
  {
    id: 'c6',
    title: 'Japanese Poplin Band Shirt',
    tag: 'Chalk White',
    price: '₹3,899',
    category: 'Architectural Shirts',
    slug: 'architectural-camp-collar-linen-shirt-sandstone',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
    fabric: 'High-Density 120s Compact Yarn',
  },
  {
    id: 'c7',
    title: 'Structured Cashmere Coat',
    tag: 'Camel Drape',
    price: '₹12,499',
    category: 'Outerwear',
    slug: 'double-pleated-relaxed-trouser-charcoal',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80',
    fabric: 'Double-Faced Wool Cashmere Blend',
  },
];

export default function CylindricalCarousel3D() {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startAngle, setStartAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const total = CAROUSEL_ITEMS.length;
  const anglePerItem = 360 / total; // ~51.4 degrees per item

  // Auto rotation loop
  useEffect(() => {
    if (!autoRotate || isDragging) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => prev - 0.25);
    }, 30);
    return () => clearInterval(interval);
  }, [autoRotate, isDragging]);

  const handlePrev = () => {
    setRotationAngle((prev) => Math.round(prev / anglePerItem) * anglePerItem + anglePerItem);
  };

  const handleNext = () => {
    setRotationAngle((prev) => Math.round(prev / anglePerItem) * anglePerItem - anglePerItem);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setStartAngle(rotationAngle);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      setRotationAngle(startAngle + deltaX * 0.35);
    },
    [isDragging, startX, startAngle]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }
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

  // Touch support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setStartAngle(rotationAngle);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startX;
    setRotationAngle(startAngle + deltaX * 0.4);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Cylinder radius in px for responsive layout
  const cylinderRadius = 480;

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-db-neutral-50 overflow-hidden relative border-y border-db-neutral-200 select-none">
      {/* Background Architectural Grid Accent */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#1A1917_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header matching the video ("Woven to Be Remembered") */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-db-gold/15 border border-db-gold/40 text-db-gold text-[10px] font-bold tracking-[0.25em] uppercase mb-3">
              <Sparkles className="w-3 h-3 text-db-gold" />
              <span>3D Cylindrical Showroom</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-db-black">
              Woven to Be Remembered
            </h2>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <p className="hidden sm:block text-xs text-db-neutral-500 font-light max-w-xs text-right">
              Drag horizontally or use the controls to rotate through the 3D cylindrical archive.
            </p>
            {/* Play/Pause Auto-drift */}
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className="p-3 rounded-full border border-db-neutral-300 bg-white text-db-black hover:border-db-gold hover:text-db-gold transition-colors shadow-sm"
              aria-label={autoRotate ? 'Pause 3D orbit' : 'Resume 3D orbit'}
              title={autoRotate ? 'Pause auto-orbit' : 'Resume auto-orbit'}
            >
              {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            {/* Previous / Next buttons */}
            <button
              onClick={handlePrev}
              className="p-3 rounded-full border border-db-neutral-300 bg-white text-db-black hover:bg-db-black hover:text-white transition-all shadow-sm"
              aria-label="Previous garment in 3D arc"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-3 rounded-full border border-db-neutral-300 bg-white text-db-black hover:bg-db-black hover:text-white transition-all shadow-sm"
              aria-label="Next garment in 3D arc"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── 3D CYLINDRICAL STAGE ──────────────────────────── */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-full h-[520px] sm:h-[580px] flex items-center justify-center cursor-grab active:cursor-grabbing perspective-1400"
          style={{ perspectiveOrigin: '50% 50%' }}
        >
          {/* Central 3D Rotating Cylinder Axis */}
          <div
            className="relative w-[280px] sm:w-[320px] h-[440px] sm:h-[480px] preserve-3d transition-transform duration-100 ease-out"
            style={{
              transform: `rotateY(${rotationAngle}deg)`,
            }}
          >
            {CAROUSEL_ITEMS.map((item, index) => {
              const itemAngle = index * anglePerItem;
              // Normalize angle relative to front view (-180 to 180)
              const currentItemAngle = (itemAngle + rotationAngle) % 360;
              const normalizedAngle =
                currentItemAngle > 180
                  ? currentItemAngle - 360
                  : currentItemAngle < -180
                  ? currentItemAngle + 360
                  : currentItemAngle;

              // Opacity and scale based on angle distance from front
              const isFront = Math.abs(normalizedAngle) < 35;
              const isFacingBack = Math.abs(normalizedAngle) > 95;

              return (
                <div
                  key={item.id}
                  onClick={(e) => {
                    // If not front, clicking rotates it to front
                    if (!isFront) {
                      e.preventDefault();
                      setRotationAngle((prev) => prev - normalizedAngle);
                    }
                  }}
                  className={`absolute inset-0 backface-hidden transition-opacity duration-300 ${
                    isFacingBack ? 'pointer-events-none opacity-20' : 'opacity-100'
                  }`}
                  style={{
                    transform: `rotateY(${itemAngle}deg) translateZ(${cylinderRadius}px)`,
                  }}
                >
                  <div
                    className={`w-full h-full bg-white border border-db-neutral-200 overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-xl ${
                      isFront
                        ? 'ring-2 ring-db-gold/60 scale-100 shadow-2xl'
                        : 'scale-[0.96] hover:scale-[0.98]'
                    }`}
                  >
                    {/* Arched Top Image Window */}
                    <div className="relative aspect-[3/3.8] w-full p-2.5 pb-0 bg-db-neutral-100">
                      <div className="w-full h-full arch-mask overflow-hidden relative shadow-inner bg-db-neutral-200">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover object-top filter brightness-[0.96] contrast-[1.03] transition-transform duration-700 hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-black/75 backdrop-blur-md text-[9px] font-bold tracking-widest text-db-gold uppercase border border-db-gold/30">
                          {item.tag}
                        </div>
                      </div>
                    </div>

                    {/* Garment Details Card */}
                    <div className="p-4 bg-white flex flex-col justify-between flex-1 border-t border-db-neutral-100">
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-db-neutral-500 block mb-1">
                          {item.category}
                        </span>
                        <h4 className="font-serif text-base font-bold text-db-black uppercase tracking-tight line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-db-neutral-500 font-light mt-0.5 line-clamp-1">
                          {item.fabric}
                        </p>
                      </div>

                      <div className="mt-3 pt-3 border-t border-db-neutral-100 flex items-center justify-between">
                        <span className="font-serif text-base font-bold text-db-black">
                          {item.price}
                        </span>
                        <Link
                          to={`/product/${item.slug}`}
                          className="px-3.5 py-1.5 bg-db-black text-white text-[10px] font-bold tracking-widest uppercase hover:bg-db-gold hover:text-black transition-colors flex items-center gap-1.5"
                        >
                          <span>Acquire</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3D Arc Status Bar Indicator */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {CAROUSEL_ITEMS.map((item, idx) => {
            const itemAngle = idx * anglePerItem;
            const currentItemAngle = (itemAngle + rotationAngle) % 360;
            const normalizedAngle =
              currentItemAngle > 180
                ? currentItemAngle - 360
                : currentItemAngle < -180
                ? currentItemAngle + 360
                : currentItemAngle;
            const isClosest = Math.abs(normalizedAngle) < anglePerItem / 2;

            return (
              <button
                key={item.id}
                onClick={() => setRotationAngle((prev) => prev - normalizedAngle)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isClosest ? 'w-8 bg-db-gold' : 'w-2 bg-db-neutral-300 hover:bg-db-neutral-400'
                }`}
                aria-label={`Jump to item ${idx + 1}`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
