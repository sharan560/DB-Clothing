import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  RotateCcw,
  Sparkles,
  ZoomIn,
  ZoomOut,
  ShoppingBag,
  Check,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from 'lucide-react';
import { useCartStore } from '../../store';
import toast from 'react-hot-toast';

interface Garment3DItem {
  id: string;
  name: string;
  tagline: string;
  category: string;
  price: number;
  formattedPrice: string;
  fabric: string;
  gsm: string;
  origin: string;
  badge: string;
  colors: {
    name: string;
    hex: string;
    fabricTint: string;
  }[];
  hotspots: {
    id: string;
    name: string;
    description: string;
    x: number; // percentage (0-100)
    y: number;
    zoomLevel: number;
  }[];
  images: {
    front: string;
    side: string;
    back: string;
    macro: string;
  };
}

const INFINITE_GARMENTS: Garment3DItem[] = [
  {
    id: 'garment-linen-shirt',
    name: 'Architectural Camp-Collar Linen Shirt',
    tagline: '100% Pure Belgian Flax • Open Breathable Plain Weave',
    category: 'Architectural Shirts',
    price: 3499,
    formattedPrice: '₹3,499',
    fabric: 'Pure Long-Staple European Flax Linen',
    gsm: '190 GSM',
    origin: 'Flanders, Belgium',
    badge: 'Drop 01 • SS26 Resort',
    colors: [
      { name: 'Sandstone Natural', hex: '#D5CFC3', fabricTint: '#D5CFC3' },
      { name: 'French Olive', hex: '#585D4E', fabricTint: '#585D4E' },
      { name: 'Obsidian Noir', hex: '#1C1B19', fabricTint: '#1C1B19' },
      { name: 'Chalk White', hex: '#F9F8F6', fabricTint: '#F9F8F6' },
    ],
    hotspots: [
      {
        id: 'camp-collar',
        name: 'Camp-Collar Roll',
        description: 'Single-piece convertible collar engineered to lay flat with effortless drape.',
        x: 50,
        y: 22,
        zoomLevel: 2.2,
      },
      {
        id: 'pearl-buttons',
        name: 'Australian Mother-of-Pearl',
        description: '18-ligne ocean pearl buttons with cross-stitched thread anchor.',
        x: 50,
        y: 45,
        zoomLevel: 2.5,
      },
    ],
    images: {
      front: '/images/hero2.jpg',
      side: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&q=85',
      back: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=900&q=85',
      macro: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=85',
    },
  },
  {
    id: 'garment-box-tee',
    name: 'Minimalist Heavyweight Box Tee',
    tagline: '320 GSM French Terry • Drop Shoulder Boxy Silhouette',
    category: 'Heavyweight Tees',
    price: 2499,
    formattedPrice: '₹2,499',
    fabric: 'Pre-Shrunk 100% Combed Long-Staple Supima',
    gsm: '320 GSM',
    origin: 'Maharashtra, India',
    badge: 'Atelier Signature Pillar',
    colors: [
      { name: 'Onyx Black', hex: '#0D0C0B', fabricTint: '#0D0C0B' },
      { name: 'Chalk White', hex: '#FAF9F7', fabricTint: '#FAF9F7' },
      { name: 'Slate Charcoal', hex: '#2C2A27', fabricTint: '#2C2A27' },
      { name: 'Washed Olive', hex: '#484D3F', fabricTint: '#484D3F' },
    ],
    hotspots: [
      {
        id: 'dense-rib',
        name: '1x1 Reinforced Rib Collar',
        description: '30mm wide high-density neck ribbing that retains structure wash after wash.',
        x: 50,
        y: 20,
        zoomLevel: 2.3,
      },
      {
        id: 'french-terry',
        name: '320 GSM Terry Interior',
        description: 'Micro-loop combed interior delivering substantial, non-transparent architectural drape.',
        x: 50,
        y: 55,
        zoomLevel: 2.6,
      },
    ],
    images: {
      front: '/images/hero1.jpg',
      side: '/images/cat_tees.jpg',
      back: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&q=85',
      macro: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900&q=85',
    },
  },
  {
    id: 'garment-velvet-tuxedo',
    name: 'Obsidian Velvet Double-Breasted Dinner Jacket',
    tagline: 'Haute Ceremonial Velvet • Pure Silk Grosgrain Peak Lapel',
    category: 'Ceremonial Suite',
    price: 16999,
    formattedPrice: '₹16,999',
    fabric: 'Super 130s Italian Wool & Lyon Silk Velvet',
    gsm: '360 GSM',
    origin: 'Milan, Italy',
    badge: 'Black-Tie Ceremonial',
    colors: [
      { name: 'Deep Midnight Noir', hex: '#0A0A0A', fabricTint: '#0A0A0A' },
      { name: 'Bordeaux Velvet', hex: '#3B121B', fabricTint: '#3B121B' },
    ],
    hotspots: [
      {
        id: 'silk-lapel',
        name: 'Grosgrain Silk Peak Lapel',
        description: 'Hand-rolled silk facing with structured roped shoulder sleevehead.',
        x: 42,
        y: 30,
        zoomLevel: 2.4,
      },
      {
        id: 'horn-buttons',
        name: 'Silk-Covered Buttons',
        description: 'Hand-covered satin buttons on a 6x2 double-breasted closure.',
        x: 50,
        y: 58,
        zoomLevel: 2.3,
      },
    ],
    images: {
      front: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&q=85',
      side: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=900&q=85',
      back: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&q=85',
      macro: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900&q=85',
    },
  },
  {
    id: 'garment-pleated-trouser',
    name: 'Double-Pleated Relaxed Trouser',
    tagline: 'Italian Wool Twill • Double Forward Reverse Deep Pleats',
    category: 'Tailored Trousers',
    price: 4199,
    formattedPrice: '₹4,199',
    fabric: 'Italian Virgin Wool & Structured Combed Cotton',
    gsm: '280 GSM',
    origin: 'Biella, Italy',
    badge: 'Architectural Tailoring',
    colors: [
      { name: 'Slate Charcoal', hex: '#2C2A27', fabricTint: '#2C2A27' },
      { name: 'Warm Khaki', hex: '#B0A898', fabricTint: '#B0A898' },
      { name: 'Pitch Black', hex: '#141312', fabricTint: '#141312' },
    ],
    hotspots: [
      {
        id: 'forward-pleats',
        name: 'Double Deep Pleats',
        description: 'Deep forward pleats providing structural volume and graceful movement through the leg.',
        x: 48,
        y: 35,
        zoomLevel: 2.2,
      },
    ],
    images: {
      front: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&q=85',
      side: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=900&q=85',
      back: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&q=85',
      macro: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&q=85',
    },
  },
  {
    id: 'garment-selvedge-denim',
    name: '14.5oz Japanese Selvedge Raw Denim',
    tagline: 'Vintage Shuttle Loom • Rope-Dyed Indigo with Red-Line Selvedge',
    category: 'Selvedge Denim',
    price: 4999,
    formattedPrice: '₹4,999',
    fabric: '100% Ring-Spun Cotton Rope-Dyed Indigo',
    gsm: '14.5 oz',
    origin: 'Kojima, Okayama, Japan',
    badge: 'Vintage Shuttle Loom',
    colors: [
      { name: 'Raw Deep Indigo', hex: '#192841', fabricTint: '#192841' },
      { name: 'Vintage Stone Wash', hex: '#687D94', fabricTint: '#687D94' },
    ],
    hotspots: [
      {
        id: 'selvedge-id',
        name: 'Red-Line Selvedge Outseam',
        description: 'Woven on restored 1960s Toyoda shuttle looms with self-finished red-line ID edge.',
        x: 65,
        y: 80,
        zoomLevel: 2.5,
      },
    ],
    images: {
      front: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&q=85',
      side: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=900&q=85',
      back: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&q=85',
      macro: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=900&q=85',
    },
  },
  {
    id: 'garment-cashmere-overcoat',
    name: 'Structured Wool-Cashmere Atelier Overcoat',
    tagline: 'Double-Faced Wool Cashmere • Sculpted Architectural Lapels',
    category: 'Outerwear',
    price: 12499,
    formattedPrice: '₹12,499',
    fabric: '85% Virgin Wool, 15% Mongolian Cashmere',
    gsm: '540 GSM',
    origin: 'Biella, Italy',
    badge: 'Atelier Outerwear',
    colors: [
      { name: 'Camel Tan', hex: '#C19A6B', fabricTint: '#C19A6B' },
      { name: 'Midnight Charcoal', hex: '#232528', fabricTint: '#232528' },
    ],
    hotspots: [
      {
        id: 'coat-lapel',
        name: 'Sculpted Notch Lapel',
        description: 'Broad architectural notch lapels with clean pick-stitching along the canvas edge.',
        x: 48,
        y: 28,
        zoomLevel: 2.2,
      },
    ],
    images: {
      front: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&q=85',
      side: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&q=85',
      back: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&q=85',
      macro: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&q=85',
    },
  },
];

export default function InteractiveShirtShowcase3D() {
  // Infinite virtual index that wraps around smoothly
  const [virtualIndex, setVirtualIndex] = useState(0);
  const totalGarments = INFINITE_GARMENTS.length;
  // Modulo math for active item index
  const activeIndex = ((virtualIndex % totalGarments) + totalGarments) % totalGarments;
  const currentGarment = INFINITE_GARMENTS[activeIndex];

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('L');
  const [rotation, setRotation] = useState({ x: 4, y: 0 }); // 3D rotation angles in deg
  const [zoomLevel, setZoomLevel] = useState(1.0); // 1.0x to 2.8x
  const [isDraggingGarment, setIsDraggingGarment] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, rotX: 0, rotY: 0 });
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [isAutoScroll, setIsAutoScroll] = useState(false);
  const [showMacroWeave, setShowMacroWeave] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const { addToCart, openDrawer } = useCartStore();
  const currentColor = currentGarment.colors[selectedColorIndex] || currentGarment.colors[0];

  // Auto-scroll through garments like an endless runway
  useEffect(() => {
    if (!isAutoScroll) return;
    const interval = setInterval(() => {
      setVirtualIndex((prev) => prev + 1);
      setSelectedColorIndex(0);
      setRotation({ x: 4, y: 0 });
      setZoomLevel(1.0);
      setShowMacroWeave(false);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoScroll]);

  // Navigate to Next garment in 3D depth
  const handleNextGarment = () => {
    setVirtualIndex((prev) => prev + 1);
    setSelectedColorIndex(0);
    setRotation({ x: 4, y: 0 });
    setZoomLevel(1.0);
    setShowMacroWeave(false);
    setActiveHotspot(null);
  };

  // Navigate to Previous garment in 3D depth
  const handlePrevGarment = () => {
    setVirtualIndex((prev) => prev - 1);
    setSelectedColorIndex(0);
    setRotation({ x: 4, y: 0 });
    setZoomLevel(1.0);
    setShowMacroWeave(false);
    setActiveHotspot(null);
  };

  // Jump directly to specific garment
  const handleJumpToGarment = (targetIndex: number) => {
    const diff = (targetIndex - activeIndex + totalGarments) % totalGarments;
    setVirtualIndex((prev) => prev + (diff > totalGarments / 2 ? diff - totalGarments : diff));
    setSelectedColorIndex(0);
    setRotation({ x: 4, y: 0 });
    setZoomLevel(1.0);
    setShowMacroWeave(false);
    setActiveHotspot(null);
  };

  // Mouse Wheel Infinite 3D Scroll Listener
  // When scrolling over this section, wheel scrolls forward/backward through dresses/shirts in 3D!
  const lastWheelTime = useRef(0);
  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    // Throttle wheel triggers so each scroll notch advances 1 garment cleanly
    if (now - lastWheelTime.current > 380) {
      if (Math.abs(e.deltaY) > 20 || Math.abs(e.deltaX) > 20) {
        lastWheelTime.current = now;
        if (e.deltaY > 0 || e.deltaX > 0) {
          handleNextGarment();
        } else {
          handlePrevGarment();
        }
      }
    }
  };

  // Drag rotation for active 3D garment
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDraggingGarment(true);
    setIsAutoScroll(false);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      rotX: rotation.x,
      rotY: rotation.y,
    });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingGarment) return;
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      setRotation({
        x: Math.max(-25, Math.min(25, dragStart.rotX - deltaY * 0.3)),
        y: (dragStart.rotY + deltaX * 0.45) % 360,
      });
    },
    [isDraggingGarment, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    if (isDraggingGarment) setIsDraggingGarment(false);
  }, [isDraggingGarment]);

  useEffect(() => {
    if (isDraggingGarment) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingGarment, handleMouseMove, handleMouseUp]);

  // Touch Swipe on mobile
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handlePrevGarment();
      else handleNextGarment();
    }
  };

  // Hotspot click
  const handleHotspotClick = (spot: typeof currentGarment.hotspots[0]) => {
    setActiveHotspot(spot.id);
    setZoomLevel(spot.zoomLevel);
    if (spot.zoomLevel >= 2.2) setShowMacroWeave(true);
  };

  // Add to cart
  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart({
        productId: currentGarment.id,
        title: `${currentGarment.name} — ${currentColor.name}`,
        price: currentGarment.price,
        image: currentGarment.images.front,
        size: selectedSize,
        quantity: 1,
      });
      setIsAdded(true);
      toast.success(`Acquired ${currentGarment.name} (${selectedSize})`);
      openDrawer();
    } catch {
      toast.error('Unable to add garment');
    } finally {
      setIsAdding(false);
      setTimeout(() => setIsAdded(false), 2500);
    }
  };

  // Normalized rotation to pick angle image
  const normalizedY = ((rotation.y % 360) + 360) % 360;
  let activeImage = currentGarment.images.front;
  if (showMacroWeave) {
    activeImage = currentGarment.images.macro;
  } else if (normalizedY > 45 && normalizedY < 135) {
    activeImage = currentGarment.images.side;
  } else if (normalizedY >= 135 && normalizedY <= 225) {
    activeImage = currentGarment.images.back;
  } else if (normalizedY > 225 && normalizedY < 315) {
    activeImage = currentGarment.images.side;
  }

  // Generate 5 items in depth perspective: [-2, -1, 0, 1, 2]
  const depthCards = [-2, -1, 0, 1, 2].map((offset) => {
    const idx = ((((virtualIndex + offset) % totalGarments) + totalGarments) % totalGarments);
    return {
      offset,
      garment: INFINITE_GARMENTS[idx],
      key: `${virtualIndex + offset}-${INFINITE_GARMENTS[idx].id}`,
    };
  });

  return (
    <section
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="py-24 sm:py-32 bg-db-neutral-50 px-4 sm:px-6 lg:px-8 border-y border-db-neutral-200 select-none overflow-hidden relative"
    >
      {/* Background Architectural Studio Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,168,128,0.08)_0%,transparent_75%)] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 border-b border-db-neutral-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-db-gold/15 border border-db-gold/40 text-db-gold text-[10px] font-bold tracking-[0.25em] uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-db-gold" />
              <span>Infinite 3D Sartorial Scroll Runway</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-db-black">
              Endless 3D Dress & Shirt Runway
            </h2>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <p className="hidden md:block text-xs text-db-neutral-500 font-light max-w-xs text-right">
              Scroll with your wheel or swipe to infinitely bring up new garments in 3D.
            </p>
            {/* Auto-scroll toggle */}
            <button
              onClick={() => setIsAutoScroll(!isAutoScroll)}
              className="p-3 rounded-full border border-db-neutral-300 bg-white text-db-black hover:border-db-gold hover:text-db-gold transition-colors shadow-sm"
              title={isAutoScroll ? 'Pause infinite auto-runway' : 'Start infinite auto-runway'}
              aria-label="Toggle auto runway"
            >
              {isAutoScroll ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            {/* Prev / Next controls */}
            <button
              onClick={handlePrevGarment}
              className="p-3 rounded-full border border-db-neutral-300 bg-white text-db-black hover:bg-db-black hover:text-white transition-all shadow-sm"
              aria-label="Previous garment in 3D depth"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextGarment}
              className="p-3 rounded-full border border-db-neutral-300 bg-white text-db-black hover:bg-db-black hover:text-white transition-all shadow-sm"
              aria-label="Next garment in 3D depth"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── 3D INFINITE RUNWAY STAGE ───────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main 3D Perspective Depth Stage */}
          <div className="lg:col-span-8 relative">
            <div
              ref={stageRef}
              className="relative aspect-[3/3.6] sm:aspect-[16/11] w-full bg-white border border-db-neutral-300 overflow-hidden shadow-2xl flex items-center justify-center perspective-1400"
              style={{ perspectiveOrigin: '50% 50%' }}
            >
              {/* Dynamic 3D depth floor shadow */}
              <div className="absolute bottom-6 inset-x-12 h-10 bg-black/15 blur-2xl rounded-full pointer-events-none transform rotateX(60deg)" />

              {/* 3D Infinite Depth Layer Container */}
              <div className="relative w-full h-full preserve-3d flex items-center justify-center">
                {depthCards.map(({ offset, garment, key }) => {
                  const isCenter = offset === 0;
                  // 3D positioning along Z-depth & X-axis
                  const zTranslate = offset * -320;
                  const xTranslate = offset * 260;
                  const yRotation = offset * -18;
                  const scale = Math.max(0.65, 1 - Math.abs(offset) * 0.22);
                  const opacity = Math.max(0, 1 - Math.abs(offset) * 0.42);

                  return (
                    <motion.div
                      key={key}
                      onClick={() => {
                        if (!isCenter) handleJumpToGarment(INFINITE_GARMENTS.indexOf(garment));
                      }}
                      initial={false}
                      animate={{
                        x: xTranslate,
                        z: zTranslate,
                        rotateY: isCenter ? rotation.y : yRotation,
                        rotateX: isCenter ? rotation.x : 4,
                        scale: isCenter ? scale * zoomLevel : scale,
                        opacity,
                      }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className={`absolute w-[280px] sm:w-[380px] aspect-[3/4] flex items-center justify-center ${
                        isCenter
                          ? 'z-30 cursor-grab active:cursor-grabbing'
                          : 'z-10 cursor-pointer pointer-events-auto hover:opacity-85'
                      }`}
                      style={{
                        transformStyle: 'preserve-3d',
                      }}
                      onMouseDown={isCenter ? handleMouseDown : undefined}
                    >
                      {/* Active Center Card Container */}
                      <div
                        className={`relative w-full h-full p-4 sm:p-6 bg-white/95 border transition-all duration-300 flex items-center justify-center ${
                          isCenter
                            ? 'border-db-gold/60 shadow-3d-luxury ring-1 ring-db-gold/40'
                            : 'border-db-neutral-300 shadow-lg brightness-90 filter blur-[0.5px]'
                        }`}
                      >
                        {/* Garment Image */}
                        <img
                          src={isCenter ? activeImage : garment.images.front}
                          alt={garment.name}
                          className="max-w-full max-h-full object-contain filter drop-shadow-xl"
                          draggable={false}
                          style={{
                            filter: `brightness(${isCenter && zoomLevel > 1.8 ? 1.05 : 0.98}) contrast(1.03)`,
                          }}
                        />

                        {/* Microscopic Weave Texture when zoomed in */}
                        {isCenter && zoomLevel > 1.8 && (
                          <div
                            className="absolute inset-0 opacity-25 pointer-events-none mix-blend-overlay"
                            style={{
                              backgroundImage: `radial-gradient(#000 1px, transparent 1px), radial-gradient(#fff 1px, transparent 1px)`,
                              backgroundSize: '4px 4px',
                              backgroundPosition: '0 0, 2px 2px',
                            }}
                          />
                        )}

                        {/* Hotspot Pins on Active Garment */}
                        {isCenter && Math.abs(normalizedY) < 55 && !showMacroWeave && (
                          <>
                            {currentGarment.hotspots.map((spot) => (
                              <button
                                key={spot.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleHotspotClick(spot);
                                }}
                                className={`absolute z-40 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                                  activeHotspot === spot.id
                                    ? 'bg-db-gold text-db-black scale-125 ring-4 ring-db-gold/40'
                                    : 'bg-db-black text-white hover:bg-db-gold hover:text-db-black shadow-xl ring-2 ring-white/80'
                                }`}
                                style={{
                                  top: `${spot.y}%`,
                                  left: `${spot.x}%`,
                                  transform: 'translate(-50%, -50%)',
                                }}
                                title={spot.name}
                                aria-label={`Inspect ${spot.name}`}
                              >
                                <span className="w-2 h-2 rounded-full bg-current" />
                              </button>
                            ))}
                          </>
                        )}

                        {/* Top Badge on card */}
                        <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-md text-[9px] font-bold tracking-widest text-db-gold uppercase border border-db-gold/30">
                          {garment.badge}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Top HUD: Current Garment Index & Angle info */}
              <div className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-none">
                <div className="px-3.5 py-1.5 bg-db-black/90 backdrop-blur-md border border-db-gold/40 text-white text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 shadow-xl">
                  <span className="w-2 h-2 rounded-full bg-db-gold animate-pulse" />
                  <span>
                    RUNWAY {activeIndex + 1} / {totalGarments} • {currentGarment.name}
                  </span>
                </div>

                <div className="px-3 py-1 bg-white/95 backdrop-blur-md border border-db-neutral-300 text-db-black text-[10px] font-bold tracking-widest uppercase shadow hidden sm:block">
                  {showMacroWeave ? 'Macro Weave Lens' : `Zoom: ${zoomLevel.toFixed(1)}x`}
                </div>
              </div>

              {/* Bottom HUD: Zoom In/Out & Macro Weave Controls */}
              <div className="absolute bottom-4 left-4 right-4 z-40 flex items-center justify-between">
                <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-db-neutral-300 p-1 shadow-md">
                  <button
                    onClick={() => {
                      setZoomLevel((prev) => Math.max(1.0, prev - 0.3));
                      if (zoomLevel <= 1.4) setShowMacroWeave(false);
                    }}
                    className="p-1.5 hover:bg-db-neutral-100 text-db-black transition-colors"
                    title="Zoom Out"
                    aria-label="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="px-2 text-xs font-bold text-db-black font-mono">
                    {zoomLevel.toFixed(1)}x
                  </span>
                  <button
                    onClick={() => {
                      setZoomLevel((prev) => {
                        const next = Math.min(2.8, prev + 0.3);
                        if (next > 2.0) setShowMacroWeave(true);
                        return next;
                      });
                    }}
                    className="p-1.5 hover:bg-db-neutral-100 text-db-black transition-colors"
                    title="Zoom In"
                    aria-label="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <div className="w-px h-4 bg-db-neutral-300 mx-1" />
                  <button
                    onClick={() => {
                      setShowMacroWeave(!showMacroWeave);
                      setZoomLevel(showMacroWeave ? 1.0 : 2.5);
                    }}
                    className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      showMacroWeave
                        ? 'bg-db-gold text-db-black'
                        : 'bg-db-neutral-100 text-db-black hover:bg-db-neutral-200'
                    }`}
                  >
                    Macro Weave
                  </button>
                  <button
                    onClick={() => {
                      setRotation({ x: 4, y: 0 });
                      setZoomLevel(1.0);
                      setShowMacroWeave(false);
                    }}
                    className="p-1.5 hover:bg-db-neutral-100 text-db-black transition-colors"
                    title="Reset 3D View"
                    aria-label="Reset 3D View"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider text-db-neutral-500 bg-white/90 px-3 py-1 border border-db-neutral-300">
                  <span>Scroll Wheel or Drag to orbit</span>
                </div>
              </div>
            </div>

            {/* Infinite Runway Scrubber Bar */}
            <div className="mt-4 flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-db-neutral-500">
                Runway Deck
              </span>
              <div className="flex items-center gap-2 flex-1 max-w-md mx-4">
                {INFINITE_GARMENTS.map((g, idx) => (
                  <button
                    key={g.id}
                    onClick={() => handleJumpToGarment(idx)}
                    className={`h-2 flex-1 transition-all duration-300 rounded-none ${
                      activeIndex === idx
                        ? 'bg-db-gold shadow'
                        : 'bg-db-neutral-300 hover:bg-db-neutral-400'
                    }`}
                    title={g.name}
                    aria-label={`Jump to ${g.name}`}
                  />
                ))}
              </div>
              <span className="font-serif text-xs font-bold text-db-black">
                0{activeIndex + 1} / 0{totalGarments}
              </span>
            </div>
          </div>

          {/* Right Column: Garment Specs, Swatches & Instant Acquisition */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-db-neutral-200 p-6 sm:p-7 shadow-xl space-y-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-db-gold block mb-1">
                  {currentGarment.category}
                </span>
                <h3 className="font-serif text-2xl font-bold uppercase text-db-black leading-snug">
                  {currentGarment.name}
                </h3>
                <p className="font-serif text-2xl font-bold text-db-gold mt-2">
                  {currentGarment.formattedPrice}
                </p>
                <p className="text-xs text-db-neutral-600 font-light leading-relaxed mt-2">
                  {currentGarment.tagline}
                </p>
              </div>

              {/* Fabric Architecture Specs */}
              <div className="grid grid-cols-2 gap-3 py-3 border-y border-db-neutral-200 text-xs">
                <div>
                  <span className="text-db-neutral-500 block text-[9px] uppercase tracking-wider">Milled Density:</span>
                  <span className="font-bold text-db-black font-serif text-sm">{currentGarment.gsm}</span>
                </div>
                <div>
                  <span className="text-db-neutral-500 block text-[9px] uppercase tracking-wider">Yarn Origin:</span>
                  <span className="font-bold text-db-black font-serif text-sm truncate">{currentGarment.origin}</span>
                </div>
              </div>

              {/* Colorway Swatches */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-db-black">
                    Selected Color:
                  </span>
                  <span className="text-xs text-db-gold font-medium">
                    {currentColor.name}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  {currentGarment.colors.map((color, idx) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColorIndex(idx)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        selectedColorIndex === idx
                          ? 'border-db-gold scale-110 shadow-md ring-2 ring-db-gold/40'
                          : 'border-db-neutral-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                      aria-label={`Select ${color.name}`}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-db-black mb-2">
                  Select Size (True to Bespoke Fit):
                </span>
                <div className="flex items-center gap-2">
                  {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`flex-1 py-2 text-xs font-bold transition-all border ${
                        selectedSize === sz
                          ? 'bg-db-black text-white border-db-black shadow'
                          : 'bg-white text-db-black border-db-neutral-300 hover:border-db-black'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-full py-4 bg-db-black text-white text-xs font-bold tracking-[0.25em] uppercase hover:bg-db-gold hover:text-black transition-all shadow-xl flex items-center justify-center gap-2.5 cursor-pointer"
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4 text-db-gold" />
                    <span>Added To Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Acquire Garment • {currentGarment.formattedPrice}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
