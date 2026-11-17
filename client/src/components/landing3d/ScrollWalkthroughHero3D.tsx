import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Plus,
  ShoppingBag,
} from 'lucide-react';
import { useCartStore } from '../../store';
import toast from 'react-hot-toast';

export interface WalkthroughHeroProps {
  curtainImage?: string;
  chamberImage?: string;
  badgeText?: string;
  gatewayTitle1?: string;
  gatewayTitle2?: string;
  gatewaySubtitle?: string;
  chamberTitle1?: string;
  chamberTitle2?: string;
  chamberSubtitle?: string;
  chamberDescription?: string;
  featuredProductName?: string;
  featuredProductPrice?: string;
  featuredProductSlug?: string;
}

export default function ScrollWalkthroughHero3D({
  curtainImage = 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1920&q=85',
  chamberImage = '/images/hero1.jpg',
  badgeText = 'SPRING / SUMMER 2026 ATELIER',
  gatewayTitle1 = 'ARCHITECTURAL',
  gatewayTitle2 = 'SILHOUETTES.',
  gatewaySubtitle = 'HAUTE SARTORIAL ATELIER',
  chamberTitle1 = 'THE RUNWAY',
  chamberTitle2 = 'CHAMBER.',
  chamberSubtitle = 'UNCOMPROMISING BESPOKE LUXURY',
  chamberDescription = 'Woven from 320 GSM French Terry, pure Belgian flax linen, and vintage Japanese selvedge denim. Sculpted in Mumbai for the discerning sartorial gentleman.',
  featuredProductName = 'Minimalist Heavyweight Box Tee — Onyx Black',
  featuredProductPrice = '₹2,499',
  featuredProductSlug = 'minimalist-heavyweight-box-tee-black',
}: WalkthroughHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHotspotOpen, setIsHotspotOpen] = React.useState(false);
  const { addToCart, openDrawer } = useCartStore();

  // Scroll Progress Tracker over the pinned 280vh distance
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Silky smooth spring smoothing for weightless, zero-stutter feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  });

  // ── 1. LAYER A: THE FABRIC / CURTAIN GATEWAY (Foreground) ──
  // Starts at scale(1) / z(0). As user scrolls (0 -> 0.48), scales up dramatically to scale(4.5),
  // blurs, and fades out, creating the physical spatial illusion of camera flying through the fabric.
  const gateScale = useTransform(smoothProgress, [0, 0.48], [1, 4.5]);
  const gateZ = useTransform(smoothProgress, [0, 0.48], [0, 650]);
  const gateOpacity = useTransform(smoothProgress, [0, 0.32, 0.48], [1, 0.85, 0]);
  const gateBlur = useTransform(smoothProgress, [0, 0.48], ['blur(0px)', 'blur(18px)']);

  // Gateway Overlay Typography (staggered slide-up and fade-out)
  const gateTextY = useTransform(smoothProgress, [0, 0.32], [0, -70]);
  const gateTextOpacity = useTransform(smoothProgress, [0, 0.28], [1, 0]);
  const gateTextScale = useTransform(smoothProgress, [0, 0.32], [1, 1.15]);

  // ── 2. LAYER B: THE SHOWROOM / RUNWAY CHAMBER (Deep Layer) ──
  // Begins slightly scaled down (0.82) with negative translateZ(-420px).
  // As foreground fades, it smoothly zooms forward into crisp focus (1.0 / translateZ(0)).
  const chamberScale = useTransform(smoothProgress, [0.18, 0.65], [0.82, 1.0]);
  const chamberZ = useTransform(smoothProgress, [0.18, 0.65], [-420, 0]);
  const chamberOpacity = useTransform(smoothProgress, [0.15, 0.45], [0.15, 1.0]);
  const chamberBlur = useTransform(smoothProgress, [0.15, 0.52], ['blur(8px)', 'blur(0px)']);

  // Chamber Content (Staggered reveal as the chamber reaches crisp focus)
  const chamberContentY = useTransform(smoothProgress, [0.38, 0.72], [40, 0]);
  const chamberContentOpacity = useTransform(smoothProgress, [0.35, 0.65], [0, 1]);

  // Quick Acquire
  const handleQuickAcquire = async () => {
    try {
      await addToCart({
        productId: 'demo-1',
        title: featuredProductName,
        price: 2499,
        image: chamberImage,
        size: 'L',
        quantity: 1,
      });
      toast.success(`Acquired ${featuredProductName}`);
      openDrawer();
    } catch {
      toast.error('Unable to acquire garment');
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[280vh]"
      style={{
        backgroundColor: 'var(--color-bg-primary, #0b0f17)',
        color: 'var(--color-text-primary, #f8fafc)',
      }}
    >
      {/* ── STICKY VIEWPORT CONTAINER (Pinned for 280vh) ───── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center perspective-1200">
        {/* Ambient Radial Spotlight Haze */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 40%, rgba(197, 160, 89, 0.12) 0%, rgba(11, 15, 23, 0) 70%)',
          }}
        />

        {/* ══════════════════════════════════════════════════════════
            LAYER B (DEEP LAYER): THE SHOWROOM / RUNWAY CHAMBER
        ══════════════════════════════════════════════════════════ */}
        <motion.div
          style={{
            scale: chamberScale,
            z: chamberZ,
            opacity: chamberOpacity,
            filter: chamberBlur,
            transformStyle: 'preserve-3d',
          }}
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
        >
          {/* Deep Chamber Runway Image */}
          <img
            src={chamberImage}
            alt="DB Clothing Sartorial Atelier Runway Chamber"
            className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.08]"
          />

          {/* Multilayered Noir Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/30 pointer-events-none" />
          <div className="absolute inset-0 bg-radial-vignette opacity-70 pointer-events-none" />

          {/* Interactive Lookbook Hotspot Pin inside Chamber */}
          <div
            className="absolute z-30 transition-all duration-300 hidden md:block"
            style={{ top: '38%', left: '49%' }}
          >
            <div className="relative">
              <button
                onClick={() => setIsHotspotOpen(!isHotspotOpen)}
                className="w-7 h-7 rounded-full flex items-center justify-center shadow-2xl animate-pulse-glow transition-transform hover:scale-125 cursor-pointer"
                style={{
                  backgroundColor: 'var(--color-accent-gold, #c5a059)',
                  color: 'var(--color-bg-primary, #0b0f17)',
                }}
                aria-label="View look item details"
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
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 p-4 shadow-2xl text-left border z-40"
                    style={{
                      backgroundColor: 'rgba(11, 15, 23, 0.96)',
                      borderColor: 'rgba(197, 160, 89, 0.4)',
                      backdropFilter: 'blur(16px)',
                    }}
                  >
                    <p
                      className="text-[9px] uppercase tracking-[0.25em] font-bold"
                      style={{ color: 'var(--color-accent-gold, #c5a059)' }}
                    >
                      Atelier Runway Garment
                    </p>
                    <h4
                      className="text-sm font-bold mt-1 leading-snug"
                      style={{
                        fontFamily: 'var(--font-serif, "Playfair Display", serif)',
                        color: 'var(--color-text-primary, #f8fafc)',
                      }}
                    >
                      {featuredProductName}
                    </h4>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: 'var(--color-accent-gold, #c5a059)' }}
                      >
                        {featuredProductPrice}
                      </span>
                      <button
                        onClick={handleQuickAcquire}
                        className="text-[10px] font-bold uppercase tracking-wider text-white hover:underline flex items-center gap-1 cursor-pointer"
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

          {/* Chamber Revealed Typography & CTAs */}
          <motion.div
            style={{
              y: chamberContentY,
              opacity: chamberContentOpacity,
            }}
            className="relative z-20 max-w-4xl mx-auto px-6 text-center flex flex-col items-center pt-8"
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 border text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] uppercase mb-4 shadow-xl"
              style={{
                borderColor: 'rgba(197, 160, 89, 0.4)',
                backgroundColor: 'rgba(11, 15, 23, 0.65)',
                color: 'var(--color-accent-gold, #c5a059)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{badgeText}</span>
            </div>

            <h2
              className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight uppercase leading-[0.95] drop-shadow-2xl"
              style={{ fontFamily: 'var(--font-serif, "Playfair Display", serif)' }}
            >
              <span>{chamberTitle1}</span> <br />
              <span
                className="italic font-normal"
                style={{ color: 'var(--color-text-muted, #94a3b8)' }}
              >
                {chamberTitle2}
              </span>
            </h2>

            <p
              className="text-base sm:text-xl uppercase tracking-[0.2em] font-medium mt-3"
              style={{ color: 'var(--color-accent-gold, #c5a059)' }}
            >
              {chamberSubtitle}
            </p>

            <p
              className="max-w-xl text-xs sm:text-sm font-light tracking-wide mt-3 mb-8 leading-relaxed"
              style={{ color: 'var(--color-text-muted, #94a3b8)' }}
            >
              {chamberDescription}
            </p>

            {/* Chamber Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={handleQuickAcquire}
                className="px-9 py-4 text-xs font-bold tracking-[0.25em] uppercase transition-all duration-300 shadow-2xl flex items-center justify-center gap-2 group cursor-pointer"
                style={{
                  backgroundColor: 'var(--color-text-primary, #f8fafc)',
                  color: 'var(--color-bg-primary, #0b0f17)',
                }}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Acquire Signature Look • {featuredProductPrice}</span>
              </button>

              <Link
                to="/shop"
                className="px-9 py-4 border text-xs font-semibold tracking-[0.25em] uppercase transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  borderColor: 'rgba(248, 250, 252, 0.4)',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(8px)',
                  color: 'var(--color-text-primary, #f8fafc)',
                }}
              >
                <span>Explore Full Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════
            LAYER A (TOP LAYER): THE FABRIC / CURTAIN GATEWAY
        ══════════════════════════════════════════════════════════ */}
        <motion.div
          style={{
            scale: gateScale,
            z: gateZ,
            opacity: gateOpacity,
            filter: gateBlur,
            transformStyle: 'preserve-3d',
            pointerEvents: useTransform(smoothProgress, (p) => (p > 0.45 ? 'none' : 'auto')),
          }}
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
        >
          {/* High-Texture Fabric / Curtain Background */}
          <img
            src={curtainImage}
            alt="DB Clothing Fabric Gateway"
            className="w-full h-full object-cover object-center filter brightness-[0.55] contrast-[1.12]"
          />

          {/* Gold Damask & Architectural Grid Watermark Pattern */}
          <div
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, #c5a059 2%, transparent 0%), radial-gradient(circle at 75px 75px, #c5a059 2%, transparent 0%)`,
              backgroundSize: '100px 100px',
            }}
          />

          {/* Cinematic Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/35 pointer-events-none" />

          {/* Gateway Overlay Typography */}
          <motion.div
            style={{
              y: gateTextY,
              opacity: gateTextOpacity,
              scale: gateTextScale,
            }}
            className="relative z-30 max-w-4xl mx-auto px-6 text-center flex flex-col items-center"
          >
            {/* Monogram Seal Pill */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 border text-[10px] tracking-[0.3em] uppercase mb-6 shadow-xl"
              style={{
                borderColor: 'rgba(197, 160, 89, 0.45)',
                backgroundColor: 'rgba(11, 15, 23, 0.75)',
                color: 'var(--color-accent-gold, #c5a059)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>DB Clothing Atelier • Mumbai MMXXVI</span>
            </div>

            {/* Gateway Grand Headline */}
            <h1
              className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tight uppercase leading-[0.95] drop-shadow-2xl"
              style={{ fontFamily: 'var(--font-serif, "Playfair Display", serif)' }}
            >
              <span>{gatewayTitle1}</span> <br />
              <span
                className="italic font-normal"
                style={{ color: 'var(--color-accent-gold, #c5a059)' }}
              >
                {gatewayTitle2}
              </span>
            </h1>

            <p
              className="text-xs sm:text-base uppercase tracking-[0.25em] font-medium mt-4 drop-shadow-md"
              style={{ color: 'var(--color-text-muted, #94a3b8)' }}
            >
              {gatewaySubtitle}
            </p>

            {/* Scroll Indicator Prompt */}
            <div className="mt-10 flex flex-col items-center gap-2">
              <span
                className="text-[10px] uppercase font-bold tracking-[0.3em]"
                style={{ color: 'var(--color-accent-gold, #c5a059)' }}
              >
                Scroll To Enter Atelier
              </span>
              <div
                className="w-5 h-9 rounded-full border flex items-start justify-center p-1"
                style={{ borderColor: 'rgba(197, 160, 89, 0.5)' }}
              >
                <motion.div
                  animate={{ y: [0, 14, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: 'var(--color-accent-gold, #c5a059)' }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── WALKTHROUGH DEPTH SCRUBBER (Bottom HUD) ─────────── */}
        <div className="absolute bottom-6 inset-x-8 z-40 flex items-center justify-between text-[10px] uppercase tracking-widest font-mono text-white/50 pointer-events-none">
          <span>01 // GATEWAY THRESHOLD</span>
          <div className="w-36 h-0.5 bg-white/20 overflow-hidden rounded-full">
            <motion.div
              style={{
                width: useTransform(smoothProgress, [0, 1], ['0%', '100%']),
                backgroundColor: 'var(--color-accent-gold, #c5a059)',
              }}
              className="h-full"
            />
          </div>
          <span>02 // RUNWAY CHAMBER</span>
        </div>
      </div>
    </div>
  );
}
