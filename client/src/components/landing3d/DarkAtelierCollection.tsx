import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShoppingBag, Check } from 'lucide-react';
import { useCartStore } from '../../store';
import toast from 'react-hot-toast';

interface CeremonialItem {
  id: string;
  title: string;
  price: number;
  formattedPrice: string;
  tag: string;
  image: string;
  slug: string;
  fabric: string;
}

const CEREMONIAL_ITEMS: CeremonialItem[] = [
  {
    id: 'cer-1',
    title: 'Double-Breasted Obsidian Tuxedo',
    price: 16999,
    formattedPrice: '₹16,999',
    tag: 'Silk Grosgrain Peak Lapel',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
    slug: 'minimalist-heavyweight-box-tee-black',
    fabric: 'Super 130s Italian Wool & Silk',
  },
  {
    id: 'cer-2',
    title: 'Velvet Atelier Dinner Jacket — Noir',
    price: 14499,
    formattedPrice: '₹14,499',
    tag: 'Plush Cotton Velvet',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80',
    slug: 'architectural-camp-collar-linen-shirt-sandstone',
    fabric: 'Deep Black Lyon Silk Velvet',
  },
  {
    id: 'cer-3',
    title: 'Pleated Ceremonial Dress Shirt',
    price: 4999,
    formattedPrice: '₹4,999',
    tag: 'Mother-of-Pearl Studs',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
    slug: 'architectural-camp-collar-linen-shirt-sandstone',
    fabric: '200s 2-Ply Giza Egyptian Cotton',
  },
  {
    id: 'cer-4',
    title: 'Sartorial Tuxedo Trouser — Midnight',
    price: 6499,
    formattedPrice: '₹6,499',
    tag: 'Silk Satin Side Braid',
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80',
    slug: 'double-pleated-relaxed-trouser-charcoal',
    fabric: 'Pure Wool Barathea Weave',
  },
];

export default function DarkAtelierCollection() {
  const { addToCart } = useCartStore();
  const [addingId, setAddingId] = useState<string | null>(null);

  const handleQuickAdd = async (item: CeremonialItem) => {
    setAddingId(item.id);
    try {
      await addToCart({
        productId: item.id,
        title: item.title,
        price: item.price,
        image: item.image,
        size: 'L',
        quantity: 1,
      });
      toast.success(`Added ${item.title} to bag`);
    } catch {
      toast.error('Unable to add garment');
    } finally {
      setTimeout(() => setAddingId(null), 1000);
    }
  };

  return (
    <section className="bg-db-black text-white py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient Gold Radial Spotlight in Background */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-db-gold/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Section Header matching "The Bridal Collection" in video */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1 border border-db-gold/40 bg-black/60 backdrop-blur-md text-db-gold text-[10px] font-bold tracking-[0.3em] uppercase mb-4">
            <Sparkles className="w-3 h-3 text-db-gold" />
            <span>Ceremonial & Evening Wear</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white mb-3">
            The Black-Tie Atelier
          </h2>
          <p className="text-xs sm:text-sm text-db-neutral-300 font-light leading-relaxed">
            Uncompromising formal elegance crafted for galas, weddings, and high-fashion soirees. Silk lapels, barathea wools, and handcrafted horn buttons.
          </p>
        </div>

        {/* Layout matching video 00:09: Large featured arched card on left + product cards on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Arched Feature Card */}
          <div className="lg:col-span-4 relative">
            <div className="relative aspect-[3/4.2] w-full arch-mask overflow-hidden border border-db-gold/40 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&q=80"
                alt="The Ceremonial Suite"
                className="w-full h-full object-cover object-top filter brightness-[0.88] contrast-[1.08] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 text-left">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-db-gold block mb-1">
                  Atelier Showcase MMXXVI
                </span>
                <h3 className="font-serif text-2xl font-bold text-white uppercase tracking-tight mb-2">
                  The Tuxedo Suite
                </h3>
                <p className="text-xs text-db-neutral-300 mb-4 line-clamp-2">
                  Engineered with satin peak lapels and structured shoulder architecture.
                </p>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-db-gold text-db-black text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-white transition-all shadow-xl"
                >
                  <span>View Complete Suite</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Product Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CEREMONIAL_ITEMS.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-db-near-black/80 border border-white/10 hover:border-db-gold/60 transition-all duration-300 flex flex-col justify-between group shadow-xl"
              >
                {/* Image */}
                <div className="relative aspect-[3/3.8] overflow-hidden bg-black/40">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/80 backdrop-blur-md text-[9px] font-bold tracking-widest text-db-gold uppercase border border-db-gold/30">
                    {item.tag}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wide group-hover:text-db-gold transition-colors line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-db-neutral-400 font-light mt-1">
                      {item.fabric}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="font-serif text-sm font-bold text-db-gold">
                      {item.formattedPrice}
                    </span>

                    <button
                      onClick={() => handleQuickAdd(item)}
                      disabled={addingId === item.id}
                      className="px-3 py-1.5 border border-white/30 text-white text-[10px] font-bold tracking-widest uppercase hover:bg-db-gold hover:text-db-black hover:border-db-gold transition-all flex items-center gap-1.5"
                      aria-label={`Quick add ${item.title}`}
                    >
                      {addingId === item.id ? (
                        <>
                          <Check className="w-3 h-3 text-db-gold" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3 h-3" />
                          <span>Acquire</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
