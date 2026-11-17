import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

interface EditColumn {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  description: string;
}

const OCCASION_EDITS: EditColumn[] = [
  {
    id: 'edit-1',
    badge: 'Ceremonial & Evening',
    title: 'The Black-Tie Gala',
    subtitle: 'Bespoke Satin Lapels & Barathea Wool',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
    link: '/shop',
    description: 'Precision cut tuxedos and silk dinner jackets engineered for celebratory occasions.',
  },
  {
    id: 'edit-2',
    badge: 'Daily Essential Architecture',
    title: 'Metropolitan Street',
    subtitle: '320 GSM French Terry & Heavy Supima',
    image: '/images/hero1.jpg',
    link: '/shop?category=t-shirts',
    description: 'Structured boxy tees and loopback hoodies designed to maintain clean architectural drapes.',
  },
  {
    id: 'edit-3',
    badge: 'Resort & Warm Weather',
    title: 'The Belgian Riviera',
    subtitle: 'Pure Long-Staple Flax Linen',
    image: '/images/hero2.jpg',
    link: '/shop?category=shirts',
    description: 'Breezy camp-collar shirts and airy drawstring trousers for effortless temperate ease.',
  },
  {
    id: 'edit-4',
    badge: 'Artisanal Selvedge',
    title: 'Tokyo Shuttle Loom',
    subtitle: '14.5oz Raw Rope-Dyed Indigo',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
    link: '/shop?category=jeans',
    description: 'Woven on restored vintage shuttle looms in Okayama, developing unique personal patina.',
  },
];

export default function OccasionEditsSpread() {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-db-neutral-50 border-b border-db-neutral-200">
      <div className="max-w-[1440px] mx-auto">
        {/* Header layout matching video 00:16 ("EDITS for every occasion") */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-db-neutral-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-db-gold/15 border border-db-gold/40 text-db-gold text-[10px] font-bold tracking-[0.25em] uppercase mb-3">
              <Sparkles className="w-3 h-3 text-db-gold" />
              <span>Wardrobe Archetypes</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-db-black">
              EDITS <span className="italic font-normal lowercase font-serif text-db-gold">for every occasion</span>
            </h2>
          </div>
          <Link
            to="/shop"
            className="mt-4 md:mt-0 text-xs font-bold tracking-[0.2em] uppercase text-db-black hover:text-db-gold inline-flex items-center gap-2 group transition-colors"
          >
            <span>Explore All Edits</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4 Tall Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {OCCASION_EDITS.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <Link
                to={item.link}
                className="group relative aspect-[3/4.6] overflow-hidden bg-db-neutral-200 flex flex-col justify-end p-6 border border-db-neutral-300 shadow-md block transition-all duration-500 hover:shadow-2xl hover:border-db-gold/60"
              >
                {/* Background Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-300 group-hover:from-black/95" />

                {/* Floating Content */}
                <div className="relative z-10 transform transition-transform duration-300 group-hover:-translate-y-2">
                  <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest mb-3 border border-white/20">
                    {item.badge}
                  </span>
                  <p className="text-[10px] text-db-gold uppercase tracking-[0.2em] font-semibold mb-1">
                    {item.subtitle}
                  </p>
                  <h3 className="font-serif text-2xl font-bold text-white uppercase tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-db-neutral-300 font-light leading-relaxed mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white group-hover:text-db-gold font-bold transition-colors">
                    <span>Acquire Edit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
