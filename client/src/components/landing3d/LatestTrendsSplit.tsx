import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function LatestTrendsSplit() {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white border-b border-db-neutral-200">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Bold Editorial Headline matching video 00:19 */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-db-gold/15 border border-db-gold/40 text-db-gold text-[10px] font-bold tracking-[0.25em] uppercase">
              <Sparkles className="w-3 h-3 text-db-gold" />
              <span>Seasonal Runway Architecture</span>
            </div>

            <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-db-black leading-[0.95]">
              LATEST <br />
              <span className="italic font-normal text-db-gold">TRENDS</span>
            </h2>

            <p className="text-sm text-db-neutral-600 font-light leading-relaxed max-w-md">
              Relaxed luxury silhouettes built with razor-sharp tailoring. From Belgian linen camp-collars to 14.5oz Kojima selvedge, curated for the discerning gentleman.
            </p>

            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-3 px-8 py-4 bg-db-black text-white text-xs font-bold tracking-[0.25em] uppercase hover:bg-db-gold hover:text-black transition-all shadow-xl group"
              >
                <span>Discover Now</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>

            {/* Quick Stats or Highlights */}
            <div className="pt-8 border-t border-db-neutral-200 grid grid-cols-2 gap-4">
              <div>
                <p className="font-serif text-2xl font-bold text-db-black">320 GSM</p>
                <p className="text-[10px] text-db-neutral-500 uppercase tracking-widest mt-0.5">
                  Heavyweight French Terry
                </p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-db-black">100%</p>
                <p className="text-[10px] text-db-neutral-500 uppercase tracking-widest mt-0.5">
                  Belgian Flax Linen
                </p>
              </div>
            </div>
          </div>

          {/* Right: Framed Lookbook Portrait & Explorer matching video 00:19 */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* Framed Duo Photo */}
            <div className="sm:col-span-8 relative">
              <div className="relative aspect-[4/5] bg-db-neutral-100 overflow-hidden border-8 border-white shadow-2xl">
                <img
                  src="/images/hero2.jpg"
                  alt="DB Clothing seasonal trend showcase"
                  className="w-full h-full object-cover object-top filter brightness-[0.97]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-left">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-db-gold font-bold">
                    Drop 02 • SS26
                  </p>
                  <p className="font-serif text-lg font-bold uppercase">
                    The Sandstone Linen Collection
                  </p>
                </div>
              </div>
            </div>

            {/* Mini Category Explorer List matching right side in video */}
            <div className="sm:col-span-4 bg-db-neutral-50 p-6 border border-db-neutral-200 space-y-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-db-black border-b border-db-neutral-200 pb-2">
                Explore The Range
              </p>
              <ul className="space-y-3 text-xs font-semibold uppercase tracking-wider text-db-neutral-600">
                <li>
                  <Link to="/shop?category=t-shirts" className="hover:text-db-gold transition-colors flex items-center justify-between">
                    <span>Heavyweight Tees</span>
                    <ArrowRight className="w-3 h-3 text-db-neutral-400" />
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=shirts" className="hover:text-db-gold transition-colors flex items-center justify-between">
                    <span>Linen & Poplin Shirts</span>
                    <ArrowRight className="w-3 h-3 text-db-neutral-400" />
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=trousers" className="hover:text-db-gold transition-colors flex items-center justify-between">
                    <span>Pleated Trousers</span>
                    <ArrowRight className="w-3 h-3 text-db-neutral-400" />
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=jeans" className="hover:text-db-gold transition-colors flex items-center justify-between">
                    <span>Raw Selvedge Denim</span>
                    <ArrowRight className="w-3 h-3 text-db-neutral-400" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
