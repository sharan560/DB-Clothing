import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

interface MoodItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  tag: string;
  image: string;
  link: string;
}

const SARTORIAL_MOODS: MoodItem[] = [
  {
    id: 'noir-tuxedo',
    number: '01',
    title: 'Noir Atelier',
    subtitle: 'Ceremonial & Black-Tie',
    tag: 'Silk & Velvet',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
    link: '/shop?category=shirts',
  },
  {
    id: 'heavyweight-street',
    number: '02',
    title: 'Boxy Heavyweight',
    subtitle: 'French Terry & Supima',
    tag: '320 GSM Cut',
    image: '/images/cat_tees.jpg',
    link: '/shop?category=t-shirts',
  },
  {
    id: 'riviera-linen',
    number: '03',
    title: 'Belgian Riviera',
    subtitle: 'Flax Camp-Collars',
    tag: 'Pure Flax',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
    link: '/shop?category=shirts',
  },
  {
    id: 'selvedge-craft',
    number: '04',
    title: 'Tokyo Selvedge',
    subtitle: '14.5oz Raw Loom Denim',
    tag: 'Vintage Shuttle',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
    link: '/shop?category=jeans',
  },
  {
    id: 'double-pleat',
    number: '05',
    title: 'Pleated Architecture',
    subtitle: 'Italian Twill Drape',
    tag: 'Deep Pleats',
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80',
    link: '/shop?category=trousers',
  },
  {
    id: 'sculpted-coat',
    number: '06',
    title: 'Heritage Outerwear',
    subtitle: 'Wool Cashmere Overcoats',
    tag: 'Structured Cut',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80',
    link: '/shop',
  },
];

export default function SartorialMoodsGallery() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto bg-white">
      {/* Header layout matching the video */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 border-b border-db-neutral-200 pb-6">
        <div>
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] text-db-gold mb-2 block">
            Atelier Curations • Spring / Summer 2026
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-db-black">
            SIX SARTORIAL MOODS
          </h2>
        </div>
        <p className="mt-4 md:mt-0 max-w-md text-xs sm:text-sm text-db-neutral-600 font-light leading-relaxed">
          Six distinct silhouettes designed for the contemporary wardrobe. Engineered from architectural cuts, custom-milled heavyweight yarns, and unhurried craftsmanship.
        </p>
      </div>

      {/* 6 Arched Mood Cards in Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
        {SARTORIAL_MOODS.map((mood, idx) => (
          <motion.div
            key={mood.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: idx * 0.08 }}
            className="group"
          >
            <Link
              to={mood.link}
              className="flex flex-col h-full bg-db-neutral-50 border border-db-neutral-200 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-db-gold/60"
            >
              {/* Arched Photo Window */}
              <div className="relative aspect-[3/4.2] w-full overflow-hidden bg-db-neutral-100 p-2 sm:p-2.5 pb-0">
                <div className="relative w-full h-full arch-mask overflow-hidden shadow-inner">
                  <img
                    src={mood.image}
                    alt={mood.title}
                    className="w-full h-full object-cover object-top filter brightness-[0.95] contrast-[1.02] transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Floating index pill */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-bold tracking-widest text-white border border-white/20">
                    {mood.number}
                  </div>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between text-center bg-white border-t border-db-neutral-100">
                <div>
                  <span className="inline-block text-[9px] font-bold uppercase tracking-widest text-db-gold mb-1">
                    {mood.tag}
                  </span>
                  <h3 className="font-serif text-sm sm:text-base font-bold text-db-black uppercase tracking-wide group-hover:text-db-gold transition-colors">
                    {mood.title}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-db-neutral-500 font-light mt-0.5 line-clamp-1">
                    {mood.subtitle}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-db-neutral-100 flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider text-db-black group-hover:text-db-gold">
                  <span>Explore Mood</span>
                  <ArrowUpRight className="w-3 h-3 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
