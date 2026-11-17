import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Plus, Minus, ShoppingBag, Check, Sparkles } from 'lucide-react';
import { useCartStore } from '../../store';
import toast from 'react-hot-toast';

interface LookConfig {
  id: string;
  label: string;
  title: string;
  price: number;
  formattedPrice: string;
  rating: number;
  reviewsCount: number;
  description: string;
  badge: string;
  image: string;
  swatches: { name: string; hex: string }[];
  sizes: string[];
  fabricSpecs: { gsm: string; origin: string; weave: string };
  slug: string;
}

const ATELIER_LOOKS: LookConfig[] = [
  {
    id: 'look-1',
    label: 'Look 01',
    title: 'Minimalist Heavyweight Box Tee',
    price: 2499,
    formattedPrice: '₹2,499',
    rating: 4.9,
    reviewsCount: 142,
    description:
      'Engineered with an architectural drop-shoulder cut from custom-milled 320 GSM French Terry. Retains sharp structured drape through repeated wear.',
    badge: 'Signature Atelier Pillar',
    image: '/images/hero1.jpg',
    swatches: [
      { name: 'Onyx Black', hex: '#0D0C0B' },
      { name: 'Chalk White', hex: '#FAF9F7' },
      { name: 'Slate Charcoal', hex: '#2C2A27' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fabricSpecs: { gsm: '320 GSM', origin: 'Indian Long-Staple', weave: 'Pre-Shrunk French Terry' },
    slug: 'minimalist-heavyweight-box-tee-black',
  },
  {
    id: 'look-2',
    label: 'Look 02',
    title: 'Architectural Camp-Collar Linen Shirt',
    price: 3499,
    formattedPrice: '₹3,499',
    rating: 4.85,
    reviewsCount: 98,
    description:
      'Woven from 100% Belgian flax linen with custom mother-of-pearl buttons. Relaxed Cuban camp-collar tailored for effortless Mediterranean ease.',
    badge: 'Resort Capsule 2026',
    image: '/images/hero2.jpg',
    swatches: [
      { name: 'Sandstone Natural', hex: '#D5CFC3' },
      { name: 'French Olive', hex: '#555845' },
      { name: 'Midnight Navy', hex: '#1B263B' },
    ],
    sizes: ['M', 'L', 'XL'],
    fabricSpecs: { gsm: '190 GSM', origin: 'Flanders, Belgium', weave: 'Open Breathable Plain Weave' },
    slug: 'architectural-camp-collar-linen-shirt-sandstone',
  },
  {
    id: 'look-3',
    label: 'Look 03',
    title: 'Double-Pleated Tailored Trouser',
    price: 4199,
    formattedPrice: '₹4,199',
    rating: 4.95,
    reviewsCount: 114,
    description:
      'Sculpted with double-reverse forward pleats and high-rise tailored waistband. Crafted from Italian cotton-wool twill for fluid drape and movement.',
    badge: 'Architectural Tailoring',
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80',
    swatches: [
      { name: 'Charcoal Grey', hex: '#2C2A27' },
      { name: 'Warm Khaki', hex: '#B0A898' },
      { name: 'Pitch Black', hex: '#141312' },
    ],
    sizes: ['30 (S)', '32 (M)', '34 (L)', '36 (XL)'],
    fabricSpecs: { gsm: '280 GSM', origin: 'Biella, Italy', weave: 'Worsted Twill Drape' },
    slug: 'double-pleated-relaxed-trouser-charcoal',
  },
  {
    id: 'look-4',
    label: 'Look 04',
    title: '14.5oz Japanese Selvedge Raw Denim',
    price: 4999,
    formattedPrice: '₹4,999',
    rating: 5.0,
    reviewsCount: 86,
    description:
      'Woven on vintage 1960s Toyoda shuttle looms in Kojima, Okayama. Natural indigo rope-dyed warp yarns with classic red-line selvedge ID on the outseam.',
    badge: 'Vintage Shuttle Loom',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
    swatches: [
      { name: 'Raw Deep Indigo', hex: '#192841' },
      { name: 'Vintage Stone Wash', hex: '#687D94' },
    ],
    sizes: ['30 (S)', '32 (M)', '34 (L)', '36 (XL)'],
    fabricSpecs: { gsm: '14.5 oz', origin: 'Kojima, Japan', weave: 'Right-Hand Shuttle Twill' },
    slug: 'japanese-selvedge-raw-denim-indigo',
  },
];

export default function InteractiveLookBuilder3D() {
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [selectedSwatch, setSelectedSwatch] = useState(0);
  const [selectedSize, setSelectedSize] = useState('L');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const { addToCart, openDrawer } = useCartStore();
  const currentLook = ATELIER_LOOKS[activeLookIndex];

  const handleLookSelect = (index: number) => {
    setActiveLookIndex(index);
    setSelectedSwatch(0);
    setIsAdded(false);
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart({
        productId: currentLook.id,
        title: `${currentLook.title} — ${currentLook.swatches[selectedSwatch].name}`,
        price: currentLook.price,
        image: currentLook.image,
        size: selectedSize,
        quantity: quantity,
      });
      setIsAdded(true);
      toast.success(`Acquired ${currentLook.title} (${selectedSize})`);
      openDrawer();
    } catch {
      toast.error('Unable to add item');
    } finally {
      setIsAdding(false);
      setTimeout(() => setIsAdded(false), 2500);
    }
  };

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white border-y border-db-neutral-200">
      <div className="max-w-[1440px] mx-auto">
        {/* Header matching the video */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-db-gold/15 border border-db-gold/40 text-db-gold text-[10px] font-bold tracking-[0.25em] uppercase mb-3">
            <Sparkles className="w-3 h-3 text-db-gold" />
            <span>Interactive Atelier Suite</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-db-black mb-3">
            Sartorial Look Builder
          </h2>
          <p className="text-xs sm:text-sm text-db-neutral-500 font-light">
            Switch looks, inspect fabric specifications, and acquire tailor-crafted garments directly in 3D.
          </p>
        </div>

        {/* 3-Column Interactive Look Builder Layout from Video 00:13 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Column 1: "Change Look" Thumbnail Stack (matching video left side) */}
          <div className="lg:col-span-2 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-3 lg:pb-0 scrollbar-none">
            <p className="hidden lg:block text-[11px] font-bold uppercase tracking-[0.25em] text-db-neutral-500 mb-2">
              Change Look
            </p>
            {ATELIER_LOOKS.map((look, idx) => (
              <button
                key={look.id}
                onClick={() => handleLookSelect(idx)}
                className={`relative flex-shrink-0 w-24 lg:w-full p-2 border transition-all text-left group ${
                  activeLookIndex === idx
                    ? 'border-db-gold bg-db-gold/5 shadow-md'
                    : 'border-db-neutral-200 bg-white hover:border-db-neutral-400'
                }`}
              >
                <div className="aspect-[3/4] w-full overflow-hidden bg-db-neutral-100 mb-2">
                  <img
                    src={look.image}
                    alt={look.title}
                    className="w-full h-full object-cover object-top filter brightness-[0.95]"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-db-black group-hover:text-db-gold transition-colors">
                    {look.label}
                  </span>
                  {activeLookIndex === idx && (
                    <span className="w-2 h-2 rounded-full bg-db-gold animate-pulse" />
                  )}
                </div>
                <p className="text-[10px] text-db-neutral-500 font-medium truncate mt-0.5">
                  {look.formattedPrice}
                </p>
              </button>
            ))}
          </div>

          {/* Column 2: Large Central 3D Model Display (matching video center) */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[3/4.2] w-full bg-db-neutral-100 overflow-hidden border border-db-neutral-200 shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentLook.id}
                  src={currentLook.image}
                  alt={currentLook.title}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full object-cover object-top filter brightness-[0.96] contrast-[1.03]"
                />
              </AnimatePresence>

              {/* Floating Badge Tag (Matching "New Drop 2026" from video) */}
              <div className="absolute bottom-6 left-6 px-3.5 py-1.5 bg-db-black/85 backdrop-blur-md border border-db-gold/40 text-db-gold text-[10px] font-bold tracking-[0.25em] uppercase shadow-xl flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-db-gold" />
                <span>{currentLook.badge}</span>
              </div>
            </div>
          </div>

          {/* Column 3: Floating Specs & Purchase Card (matching video right side) */}
          <div className="lg:col-span-5 bg-db-neutral-50 border border-db-neutral-200 p-6 sm:p-8 shadow-xl flex flex-col justify-between">
            <div>
              {/* Star Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-db-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-db-gold" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-db-neutral-600">
                  {currentLook.rating} ({currentLook.reviewsCount} atelier reviews)
                </span>
              </div>

              {/* Garment Title & Price */}
              <h3 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-tight text-db-black leading-tight mb-2">
                {currentLook.title}
              </h3>
              <p className="font-serif text-2xl font-bold text-db-gold mb-4">
                {currentLook.formattedPrice}
              </p>
              <p className="text-xs sm:text-sm text-db-neutral-600 font-light leading-relaxed mb-6">
                {currentLook.description}
              </p>

              {/* Fabric Specs Badges */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-db-neutral-200 mb-6 text-center">
                <div className="p-2 bg-white border border-db-neutral-200">
                  <p className="text-[9px] uppercase tracking-wider text-db-neutral-500 font-medium">Density</p>
                  <p className="text-xs font-bold text-db-black font-serif">{currentLook.fabricSpecs.gsm}</p>
                </div>
                <div className="p-2 bg-white border border-db-neutral-200">
                  <p className="text-[9px] uppercase tracking-wider text-db-neutral-500 font-medium">Origin</p>
                  <p className="text-xs font-bold text-db-black font-serif truncate">{currentLook.fabricSpecs.origin}</p>
                </div>
                <div className="p-2 bg-white border border-db-neutral-200">
                  <p className="text-[9px] uppercase tracking-wider text-db-neutral-500 font-medium">Weave</p>
                  <p className="text-xs font-bold text-db-black font-serif truncate">{currentLook.fabricSpecs.weave}</p>
                </div>
              </div>

              {/* Swatch Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-db-black">
                    Selected Color:
                  </span>
                  <span className="text-xs text-db-gold font-medium">
                    {currentLook.swatches[selectedSwatch].name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {currentLook.swatches.map((swatch, idx) => (
                    <button
                      key={swatch.name}
                      onClick={() => setSelectedSwatch(idx)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        selectedSwatch === idx
                          ? 'border-db-gold scale-110 shadow-md ring-2 ring-db-gold/30'
                          : 'border-db-neutral-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: swatch.hex }}
                      aria-label={`Select ${swatch.name}`}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-db-black">
                    Select Fit & Size:
                  </span>
                  <span className="text-[10px] text-db-neutral-500 font-semibold uppercase tracking-wider">
                    True to Bespoke Fit
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentLook.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3.5 py-2 text-xs font-bold tracking-wider transition-all border ${
                        selectedSize === size
                          ? 'bg-db-black text-white border-db-black shadow'
                          : 'bg-white text-db-black border-db-neutral-300 hover:border-db-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Counter */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[11px] font-bold uppercase tracking-widest text-db-black">
                  Quantity:
                </span>
                <div className="inline-flex items-center border border-db-neutral-300 bg-white">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="p-2 text-db-black hover:bg-db-neutral-100 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((prev) => Math.min(10, prev + 1))}
                    className="p-2 text-db-black hover:bg-db-neutral-100 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic Add to Cart / Acquire Button (Matching 00:15 in video) */}
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full py-4 bg-db-black text-white text-xs font-bold tracking-[0.25em] uppercase hover:bg-db-gold hover:text-black transition-all shadow-xl flex items-center justify-center gap-3 cursor-pointer"
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 text-db-gold" />
                  <span>Added To Atelier Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Acquire Garment • {currentLook.formattedPrice}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
