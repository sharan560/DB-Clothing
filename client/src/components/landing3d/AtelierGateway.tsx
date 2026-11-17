import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronDown } from 'lucide-react';

interface AtelierGatewayProps {
  onEnter?: () => void;
}

export default function AtelierGateway({ onEnter }: AtelierGatewayProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleEnter = () => {
    setIsDismissed(true);
    if (onEnter) onEnter();
  };

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96, y: -40 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full bg-db-black py-16 px-6 border-b border-db-gold/30 text-white overflow-hidden shadow-2xl"
        >
          {/* Subtle Damask / Architectural Grid Watermark Pattern in DB Brand Colors */}
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, #C5A880 2%, transparent 0%), radial-gradient(circle at 75px 75px, #C5A880 2%, transparent 0%)`,
              backgroundSize: '100px 100px',
            }}
          />

          <div className="max-w-4xl mx-auto relative z-10 text-center flex flex-col items-center">
            {/* Monogram Seal Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 border border-db-gold/40 bg-black/60 backdrop-blur-md text-db-gold text-[10px] tracking-[0.3em] uppercase mb-5">
              <Shield className="w-3.5 h-3.5 text-db-gold" />
              <span>DB Clothing Atelier • Mumbai 2026</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight text-white mb-3">
              Haute Sartorial Architecture
            </h2>
            <p className="max-w-xl text-xs sm:text-sm text-db-neutral-300 font-light tracking-wide leading-relaxed mb-8">
              Experience the 3D scroll showroom crafted for the modern gentleman. Woven from 320 GSM French Terry, Belgian Flax linen, and vintage Japanese selvedge.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleEnter}
                className="px-8 py-3.5 bg-db-gold text-db-black text-xs font-bold tracking-[0.25em] uppercase hover:bg-white transition-all shadow-xl flex items-center gap-2 group cursor-pointer"
              >
                <span>Enter 3D Showroom</span>
                <ChevronDown className="w-4 h-4 transform group-hover:translate-y-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Gold Hairline Corner Brackets */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-db-gold/50 pointer-events-none" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-db-gold/50 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-db-gold/50 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-db-gold/50 pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
