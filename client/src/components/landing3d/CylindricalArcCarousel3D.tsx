import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useSpring } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Play,
  Pause,
  ShoppingBag,
} from 'lucide-react';
import { useCartStore } from '../../store';
import toast from 'react-hot-toast';

export interface CylindricalCard {
  id: string;
  title: string;
  tag: string;
  price: number;
  formattedPrice: string;
  category: string;
  fabric: string;
  image: string;
  slug: string;
}

const DEFAULT_COLLECTION_CARDS: CylindricalCard[] = [
  {
    id: 'card-tuxedo',
    title: 'Bespoke Velvet Tuxedo',
    tag: 'Haute Ceremonial',
    price: 16999,
    formattedPrice: '₹16,999',
    category: 'Ceremonial Suite',
    fabric: 'Super 130s Wool & Lyon Silk Velvet',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&q=85',
    slug: 'minimalist-heavyweight-box-tee-black',
  },
  {
    id: 'card-blazer',
    title: 'Double-Breasted Blazer',
    tag: 'Italian Barathea',
    price: 14499,
    formattedPrice: '₹14,499',
    category: 'Architectural Tailoring',
    fabric: 'Pure Wool Barathea & Horn Buttons',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=900&q=85',
    slug: 'architectural-camp-collar-linen-shirt-sandstone',
  },
  {
    id: 'card-bandhgala',
    title: 'Architectural Bandhgala',
    tag: 'Heritage Atelier',
    price: 15999,
    formattedPrice: '₹15,999',
    category: 'Royal Heritage',
    fabric: 'Structured Matka Raw Silk & Mandarin Collar',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900&q=85',
    slug: 'minimalist-heavyweight-box-tee-black',
  },
  {
    id: 'card-overcoat',
    title: 'Cashmere Atelier Overcoat',
    tag: 'Milan Milled',
    price: 12499,
    formattedPrice: '₹12,499',
    category: 'Outerwear',
    fabric: 'Double-Faced Wool Cashmere Blend',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&q=85',
    slug: 'double-pleated-relaxed-trouser-charcoal',
  },
  {
    id: 'card-linen-shirt',
    title: 'Belgian Camp-Collar Shirt',
    tag: 'Belgian Flax',
    price: 3499,
    formattedPrice: '₹3,499',
    category: 'Resort Capsule',
    fabric: '100% Flanders Long-Staple Flax',
    image: '/images/hero2.jpg',
    slug: 'architectural-camp-collar-linen-shirt-sandstone',
  },
  {
    id: 'card-selvedge',
    title: '14.5oz Okayama Selvedge',
    tag: 'Vintage Shuttle',
    price: 4999,
    formattedPrice: '₹4,999',
    category: 'Japanese Denim',
    fabric: 'Rope-Dyed Indigo Ring-Spun Cotton',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&q=85',
    slug: 'japanese-selvedge-raw-denim-indigo',
  },
];

export interface CylindricalArcCarouselProps {
  cards?: CylindricalCard[];
  radius?: number; // Cylinder radius in px, default 480
  sectionTitle?: string;
  sectionSubtitle?: string;
  badgeLabel?: string;
  autoPlay?: boolean;
}

export default function CylindricalArcCarousel3D({
  cards = DEFAULT_COLLECTION_CARDS,
  radius = 480,
  sectionTitle = 'Curved Perspective Showcase',
  sectionSubtitle = 'Bespoke tuxedos, structured blazers, and architectural overcoats mathematically curved along a 3D cylindrical arc.',
  badgeLabel = '3D CYLINDRICAL ARC ARCHIVE',
  autoPlay = false,
}: CylindricalArcCarouselProps) {
  const [targetRotation, setTargetRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startAngle, setStartAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(autoPlay);

  const containerRef = useRef<HTMLDivElement>(null);
  const { addToCart, openDrawer } = useCartStore();

  const totalCards = cards.length;
  const anglePerCard = 360 / totalCards; // 60 degrees per card for 6 cards

  // Smooth rotation spring physics for zero stutter
  const smoothRotation = useSpring(targetRotation, {
    stiffness: 85,
    damping: 24,
    restDelta: 0.001,
  });

  // Keep smoothRotation synced when targetRotation changes
  useEffect(() => {
    smoothRotation.set(targetRotation);
  }, [targetRotation, smoothRotation]);

  // Continuous auto-orbit loop
  useEffect(() => {
    if (!autoRotate || isDragging) return;
    const interval = setInterval(() => {
      setTargetRotation((prev) => prev - 0.28);
    }, 28);
    return () => clearInterval(interval);
  }, [autoRotate, isDragging]);

  // Previous and Next Card Controls
  const handlePrev = () => {
    setTargetRotation((prev) => Math.round(prev / anglePerCard) * anglePerCard + anglePerCard);
  };

  const handleNext = () => {
    setTargetRotation((prev) => Math.round(prev / anglePerCard) * anglePerCard - anglePerCard);
  };

  // Mouse Drag Tracking
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setAutoRotate(false);
    setStartX(e.clientX);
    setStartAngle(targetRotation);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      setTargetRotation(startAngle + deltaX * 0.35);
    },
    [isDragging, startX, startAngle]
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

  // Touch Swipe for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setAutoRotate(false);
    setStartX(e.touches[0].clientX);
    setStartAngle(targetRotation);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startX;
    setTargetRotation(startAngle + deltaX * 0.42);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Quick Acquire
  const handleQuickAdd = async (card: CylindricalCard) => {
    try {
      await addToCart({
        productId: card.id,
        title: card.title,
        price: card.price,
        image: card.image,
        size: 'L',
        quantity: 1,
      });
      toast.success(`Acquired ${card.title}`);
      openDrawer();
    } catch {
      toast.error('Unable to acquire garment');
    }
  };

  return (
    <section
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden relative select-none border-t"
      style={{
        backgroundColor: 'var(--color-bg-primary, #0b0f17)',
        borderColor: 'rgba(197, 160, 89, 0.2)',
        color: 'var(--color-text-primary, #f8fafc)',
      }}
    >
      {/* Background Architectural Accent Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[160px] pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(197, 160, 89, 0.08) 0%, rgba(11, 15, 23, 0) 70%)',
        }}
      />

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1 text-[10px] font-bold tracking-[0.25em] uppercase mb-3 border shadow"
              style={{
                borderColor: 'rgba(197, 160, 89, 0.4)',
                backgroundColor: 'rgba(19, 27, 38, 0.65)',
                color: 'var(--color-accent-gold, #c5a059)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{badgeLabel}</span>
            </div>
            <h2
              className="text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight"
              style={{ fontFamily: 'var(--font-serif, "Playfair Display", serif)' }}
            >
              {sectionTitle}
            </h2>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <p
              className="hidden sm:block text-xs font-light max-w-xs text-right"
              style={{ color: 'var(--color-text-muted, #94a3b8)' }}
            >
              {sectionSubtitle}
            </p>

            {/* Play/Pause Auto-drift */}
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className="p-3 rounded-full border transition-colors shadow-sm cursor-pointer"
              style={{
                borderColor: 'rgba(197, 160, 89, 0.35)',
                backgroundColor: 'var(--color-bg-secondary, #131b26)',
                color: 'var(--color-text-primary, #f8fafc)',
              }}
              title={autoRotate ? 'Pause 3D Orbit' : 'Resume 3D Orbit'}
              aria-label="Toggle auto orbit"
            >
              {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* Prev & Next controls */}
            <button
              onClick={handlePrev}
              className="p-3 rounded-full border transition-all shadow-sm cursor-pointer hover:scale-105"
              style={{
                borderColor: 'rgba(197, 160, 89, 0.35)',
                backgroundColor: 'var(--color-bg-secondary, #131b26)',
                color: 'var(--color-text-primary, #f8fafc)',
              }}
              aria-label="Previous card in 3D arc"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-3 rounded-full border transition-all shadow-sm cursor-pointer hover:scale-105"
              style={{
                borderColor: 'rgba(197, 160, 89, 0.35)',
                backgroundColor: 'var(--color-bg-secondary, #131b26)',
                color: 'var(--color-text-primary, #f8fafc)',
              }}
              aria-label="Next card in 3D arc"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── 3D CYLINDRICAL STAGE CONTAINER ─────────────────── */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-full h-[540px] sm:h-[600px] flex items-center justify-center cursor-grab active:cursor-grabbing perspective-1400"
          style={{ perspectiveOrigin: '50% 50%' }}
        >
          {/* Central 3D Rotating Axis */}
          <motion.div
            style={{
              rotateY: smoothRotation,
              transformStyle: 'preserve-3d',
            }}
            className="relative w-[280px] sm:w-[320px] h-[450px] sm:h-[490px]"
          >
            {cards.map((card, index) => {
              const cardAngle = index * anglePerCard;
              // Angle distance from center view
              const currentAngle = (cardAngle + targetRotation) % 360;
              const normalizedAngle =
                currentAngle > 180
                  ? currentAngle - 360
                  : currentAngle < -180
                  ? currentAngle + 360
                  : currentAngle;

              // Center Card Prominence calculation
              const isCenter = Math.abs(normalizedAngle) < anglePerCard / 2;
              const isAdjacent = Math.abs(normalizedAngle) < anglePerCard * 1.5;
              const isBehind = Math.abs(normalizedAngle) > 95;

              return (
                <div
                  key={card.id}
                  onClick={(e) => {
                    if (!isCenter) {
                      e.preventDefault();
                      setTargetRotation((prev) => prev - normalizedAngle);
                    }
                  }}
                  className={`absolute inset-0 backface-hidden transition-all duration-300 ${
                    isBehind ? 'pointer-events-none opacity-15' : ''
                  }`}
                  style={{
                    transform: `rotateY(${cardAngle}deg) translateZ(${radius}px)`,
                    filter: isCenter ? 'blur(0px)' : isAdjacent ? 'blur(1.2px)' : 'blur(3px)',
                    opacity: isCenter ? 1.0 : isAdjacent ? 0.65 : 0.25,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div
                    className={`w-full h-full border overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                      isCenter
                        ? 'scale-100 shadow-3d-luxury'
                        : 'scale-[0.92] hover:scale-[0.95]'
                    }`}
                    style={{
                      backgroundColor: 'var(--color-bg-secondary, #131b26)',
                      borderColor: isCenter
                        ? 'var(--color-accent-gold, #c5a059)'
                        : 'rgba(197, 160, 89, 0.2)',
                      boxShadow: isCenter
                        ? '0 25px 50px -12px rgba(0,0,0,0.65), 0 0 35px rgba(197, 160, 89, 0.2)'
                        : '0 10px 25px -5px rgba(0,0,0,0.4)',
                    }}
                  >
                    {/* Arched Top Image Window */}
                    <div className="relative aspect-[3/3.8] w-full p-3 pb-0">
                      <div className="w-full h-full arch-mask overflow-hidden relative shadow-inner">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="w-full h-full object-cover object-top filter brightness-[0.95] contrast-[1.05] transition-transform duration-700 hover:scale-105"
                          loading="lazy"
                        />
                        {/* Top Tag Pill */}
                        <div
                          className="absolute top-2.5 right-2.5 px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase border"
                          style={{
                            backgroundColor: 'rgba(11, 15, 23, 0.85)',
                            borderColor: 'rgba(197, 160, 89, 0.4)',
                            color: 'var(--color-accent-gold, #c5a059)',
                            backdropFilter: 'blur(6px)',
                          }}
                        >
                          {card.tag}
                        </div>
                      </div>
                    </div>

                    {/* Card Meta Content */}
                    <div
                      className="p-4 flex flex-col justify-between flex-1 border-t"
                      style={{
                        borderColor: 'rgba(197, 160, 89, 0.15)',
                        backgroundColor: 'var(--color-bg-secondary, #131b26)',
                      }}
                    >
                      <div>
                        <span
                          className="text-[9px] uppercase tracking-[0.2em] font-bold block mb-1"
                          style={{ color: 'var(--color-accent-gold, #c5a059)' }}
                        >
                          {card.category}
                        </span>
                        <h4
                          className="text-base font-bold uppercase tracking-tight line-clamp-1"
                          style={{
                            fontFamily: 'var(--font-serif, "Playfair Display", serif)',
                            color: 'var(--color-text-primary, #f8fafc)',
                          }}
                        >
                          {card.title}
                        </h4>
                        <p
                          className="text-[11px] font-light mt-0.5 line-clamp-1"
                          style={{ color: 'var(--color-text-muted, #94a3b8)' }}
                        >
                          {card.fabric}
                        </p>
                      </div>

                      <div
                        className="mt-3 pt-3 border-t flex items-center justify-between"
                        style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}
                      >
                        <span
                          className="text-base font-bold"
                          style={{
                            fontFamily: 'var(--font-serif, "Playfair Display", serif)',
                            color: 'var(--color-accent-gold, #c5a059)',
                          }}
                        >
                          {card.formattedPrice}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickAdd(card);
                          }}
                          className="px-3.5 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
                          style={{
                            backgroundColor: isCenter
                              ? 'var(--color-accent-gold, #c5a059)'
                              : 'var(--color-text-primary, #f8fafc)',
                            color: 'var(--color-bg-primary, #0b0f17)',
                          }}
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Acquire</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* 3D Arc Status Bar Indicator */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {cards.map((card, idx) => {
            const cardAngle = idx * anglePerCard;
            const currentAngle = (cardAngle + targetRotation) % 360;
            const normalizedAngle =
              currentAngle > 180
                ? currentAngle - 360
                : currentAngle < -180
                ? currentAngle + 360
                : currentAngle;
            const isClosest = Math.abs(normalizedAngle) < anglePerCard / 2;

            return (
              <button
                key={card.id}
                onClick={() => setTargetRotation((prev) => prev - normalizedAngle)}
                className="h-1.5 transition-all duration-300 rounded-none cursor-pointer"
                style={{
                  width: isClosest ? '32px' : '8px',
                  backgroundColor: isClosest
                    ? 'var(--color-accent-gold, #c5a059)'
                    : 'rgba(148, 163, 184, 0.3)',
                }}
                aria-label={`Jump to ${card.title}`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
