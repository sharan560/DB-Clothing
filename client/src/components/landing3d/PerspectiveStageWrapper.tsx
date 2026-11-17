import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  RotateCcw,
  Sparkles,
  Maximize2,
  Minimize2,
  Compass,
} from 'lucide-react';

interface PerspectiveStageWrapperProps {
  children: React.ReactNode;
}

export default function PerspectiveStageWrapper({ children }: PerspectiveStageWrapperProps) {
  // 3D stage mode is enabled by default to deliver the exact video 3D perspective experience
  const [is3DStageMode, setIs3DStageMode] = useState(false);
  const [zoomDepth, setZoomDepth] = useState<number>(-40); // translateZ depth in px
  const [mouseRotation, setMouseRotation] = useState({ x: 8, y: -4 });
  const [scrollProgress, setScrollProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Mouse tilt tracking in 3D mode
  useEffect(() => {
    if (!is3DStageMode) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xPercent = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const yPercent = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1

      // Subtle realistic tilt
      setMouseRotation({
        x: 8 - yPercent * 6,
        y: -4 + xPercent * 8,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [is3DStageMode]);

  // Track scroll depth in 3D mode
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const resetCamera = () => {
    setMouseRotation({ x: 8, y: -4 });
    setZoomDepth(-40);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full">
      {/* ── FLOATING LUXURY 3D CONTROLLER HUD ────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5">
        {/* Expanded Controls when in 3D mode */}
        {is3DStageMode && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="bg-db-black/95 backdrop-blur-xl border border-db-gold/40 p-3 shadow-2xl text-white flex flex-col gap-2.5 rounded-none max-w-xs"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-db-gold">
                <Compass className="w-3.5 h-3.5 text-db-gold" />
                <span>3D Stage Studio HUD</span>
              </div>
              <button
                onClick={resetCamera}
                className="text-[9px] uppercase tracking-wider text-db-neutral-400 hover:text-white flex items-center gap-1"
                title="Reset Camera Angle"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Depth Zoom Slider (simulating "scrolling it goes in") */}
            <div>
              <div className="flex items-center justify-between text-[9px] uppercase tracking-wider text-db-neutral-400 mb-1">
                <span>Spatial Camera Depth</span>
                <span className="text-db-gold">{zoomDepth}px</span>
              </div>
              <input
                type="range"
                min="-180"
                max="80"
                value={zoomDepth}
                onChange={(e) => setZoomDepth(Number(e.target.value))}
                className="w-full accent-db-gold h-1 bg-white/20 rounded-none cursor-pointer"
              />
            </div>

            {/* Quick Section Jump Pills */}
            <div>
              <p className="text-[9px] uppercase tracking-wider text-db-neutral-400 mb-1.5">
                Jump To 3D Segment
              </p>
              <div className="grid grid-cols-2 gap-1 text-[9px] font-semibold uppercase tracking-wider">
                <button
                  onClick={() => scrollToSection('section-gateway')}
                  className="px-2 py-1 bg-white/10 hover:bg-db-gold hover:text-black transition-colors text-left truncate"
                >
                  01. Intro Monogram
                </button>
                <button
                  onClick={() => scrollToSection('section-moods')}
                  className="px-2 py-1 bg-white/10 hover:bg-db-gold hover:text-black transition-colors text-left truncate"
                >
                  02. Six Moods
                </button>
                <button
                  onClick={() => scrollToSection('section-cylindrical')}
                  className="px-2 py-1 bg-white/10 hover:bg-db-gold hover:text-black transition-colors text-left truncate"
                >
                  03. 3D Arc Cylinder
                </button>
                <button
                  onClick={() => scrollToSection('section-lookbuilder')}
                  className="px-2 py-1 bg-white/10 hover:bg-db-gold hover:text-black transition-colors text-left truncate"
                >
                  04. Look Builder
                </button>
                <button
                  onClick={() => scrollToSection('section-ceremonial')}
                  className="px-2 py-1 bg-white/10 hover:bg-db-gold hover:text-black transition-colors text-left truncate"
                >
                  05. Black-Tie
                </button>
                <button
                  onClick={() => scrollToSection('section-edits')}
                  className="px-2 py-1 bg-white/10 hover:bg-db-gold hover:text-black transition-colors text-left truncate"
                >
                  06. Occasion Edits
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Master Toggle Button */}
        <button
          onClick={() => setIs3DStageMode(!is3DStageMode)}
          className="group px-4 py-2.5 bg-db-black text-white border border-db-gold/60 backdrop-blur-xl shadow-2xl flex items-center gap-2.5 hover:bg-db-gold hover:text-db-black transition-all cursor-pointer"
          title={is3DStageMode ? 'Switch to Full Immersive View' : 'Switch to 3D Isometric Showroom'}
        >
          <div className="w-2 h-2 rounded-full bg-db-gold group-hover:bg-db-black animate-pulse" />
          <Sparkles className="w-3.5 h-3.5 text-db-gold group-hover:text-db-black" />
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em]">
            {is3DStageMode ? 'Exit 3D Stage Mode' : '✨ 3D Atelier Perspective Stage'}
          </span>
          {is3DStageMode ? (
            <Minimize2 className="w-3.5 h-3.5 text-db-gold group-hover:text-db-black" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5 text-db-gold group-hover:text-db-black" />
          )}
        </button>
      </div>

      {/* ── STAGE RENDERING ────────────────────────────────────── */}
      {is3DStageMode ? (
        <div
          ref={containerRef}
          className="relative min-h-screen bg-db-black py-12 sm:py-20 px-3 sm:px-8 overflow-hidden perspective-1400"
        >
          {/* Ambient Spotlight Glow (Matching video background) */}
          <div className="fixed inset-0 pointer-events-none stage-glow-ambient" />
          <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_30%,rgba(13,12,11,0.95)_100%)]" />

          {/* 3D Floating Webpage Canvas */}
          <div
            ref={contentRef}
            className="relative mx-auto max-w-[1500px] bg-white border border-db-gold/40 shadow-3d-luxury preserve-3d transition-transform duration-300 ease-out origin-center"
            style={{
              transform: `rotateX(${mouseRotation.x}deg) rotateY(${mouseRotation.y}deg) translateZ(${
                zoomDepth + scrollProgress * 50
              }px)`,
            }}
          >
            {/* Top 3D Browser Stage Header Bar */}
            <div className="bg-db-black border-b border-db-gold/30 px-4 py-2.5 flex items-center justify-between text-white select-none">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-db-gold font-bold ml-2">
                  DB CLOTHING • 3D ATELIER SHOWROOM MMXXVI
                </span>
              </div>
              <div className="text-[9px] uppercase tracking-widest text-db-neutral-400 hidden sm:block">
                Tilt: X:{mouseRotation.x.toFixed(1)}° Y:{mouseRotation.y.toFixed(1)}° | Scroll Depth Active
              </div>
            </div>

            {/* Embedded Page Content */}
            <div className="relative w-full overflow-hidden">{children}</div>
          </div>
        </div>
      ) : (
        /* Full immersive normal layout */
        <div className="relative w-full overflow-hidden">{children}</div>
      )}
    </div>
  );
}
