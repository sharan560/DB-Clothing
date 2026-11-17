import { useState } from 'react';
import {
  X,
  Palette,
  Sliders,
  Type,
  Image as ImageIcon,
  Check,
  RotateCcw,
  Sparkles,
  Save,
  Megaphone,
  Layers,
  ShieldCheck,
  Plus,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { useStorefrontCustomizer } from '../../store/customizerStore';
import type {
  ThemeCanvasMode,
  FontPairingOption,
  BorderRadiusOption,
  MarqueeSpeedOption,
} from '../../store/customizerStore';

const PRESET_ACCENT_COLORS = [
  { name: 'Luxury Gold (Default)', hex: '#C5A880' },
  { name: 'Imperial Champagne', hex: '#D4AF37' },
  { name: 'Emerald Atelier', hex: '#1E5136' },
  { name: 'Royal Sapphire', hex: '#1E3A8A' },
  { name: 'Bordeaux Noir', hex: '#831843' },
  { name: 'Terracotta Warmth', hex: '#C86D51' },
  { name: 'Rose Gold Luxe', hex: '#D48B80' },
  { name: 'Monochromatic Slate', hex: '#94A3B8' },
];

const PRESET_HERO_IMAGES = [
  { label: 'Brutalist Gallery (Black Tee)', url: '/images/hero1.jpg' },
  { label: 'Sandstone Resort (Linen Shirt)', url: '/images/hero2.jpg' },
  { label: 'Minimalist Studio Lookbook', url: '/images/cat_tees.jpg' },
  { label: 'Atmospheric Editorial', url: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1920&q=85' },
];

const FONT_PAIRING_OPTIONS: { id: FontPairingOption; label: string; serifSample: string; desc: string }[] = [
  {
    id: 'playfair-inter',
    label: 'Modern Luxury Atelier',
    serifSample: 'Playfair Display + Inter',
    desc: 'The iconic high-end editorial standard',
  },
  {
    id: 'cormorant-montserrat',
    label: 'High-Fashion Editorial',
    serifSample: 'Cormorant Garamond + Montserrat',
    desc: 'Ultra-refined Parisian atelier aesthetic',
  },
  {
    id: 'syne-jakarta',
    label: 'Contemporary Avant-Garde',
    serifSample: 'Syne + Plus Jakarta Sans',
    desc: 'Bold sculptural and streetwear architectural feel',
  },
  {
    id: 'cinzel-inter',
    label: 'Heritage Imperial',
    serifSample: 'Cinzel + Inter',
    desc: 'Regal classical proportions and timeless authority',
  },
];

const BORDER_RADIUS_OPTIONS: { id: BorderRadiusOption; label: string; desc: string; radiusPx: string }[] = [
  { id: 'sharp', label: 'Sharp Brutalist', desc: '0px high-fashion sharp edges', radiusPx: '0px' },
  { id: 'tailored', label: 'Subtle Tailored', desc: '3px refined slight rounding', radiusPx: '3px' },
  { id: 'soft', label: 'Modern Soft', desc: '8px contemporary rounded', radiusPx: '8px' },
  { id: 'pill', label: 'Curved Pill', desc: '20px fluid modern curves', radiusPx: '20px' },
];

export default function LiveStoreCustomizer() {
  const customizer = useStorefrontCustomizer();
  const [activeTab, setActiveTab] = useState<'theme' | 'announcements' | 'hero' | 'marquee' | 'sections' | 'policies'>('theme');
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  if (!customizer.isCustomizerOpen) {
    return (
      <button
        onClick={customizer.openCustomizer}
        className="fixed bottom-6 left-6 z-40 bg-db-black text-db-gold hover:text-white px-4 py-2.5 rounded-full border border-db-gold/40 shadow-2xl flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:scale-105 group"
        title="Open Live Storefront Studio"
      >
        <Palette className="w-4 h-4 text-db-gold group-hover:rotate-45 transition-transform" />
        <span className="hidden sm:inline">Customize Store</span>
      </button>
    );
  }

  const currentSlide = customizer.heroSlides[activeSlideIdx] || customizer.heroSlides[0];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={customizer.closeCustomizer}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-r border-db-neutral-200">
          {/* Header */}
          <div className="px-6 py-5 bg-db-black text-white flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-db-gold" />
              <div>
                <h2 className="font-serif text-sm font-bold uppercase tracking-wider text-white">
                  Storefront Studio
                </h2>
                <p className="text-[10px] text-db-neutral-400">Complete Live Customization Engine</p>
              </div>
            </div>
            <button
              onClick={customizer.closeCustomizer}
              className="text-white/60 hover:text-white p-1"
              aria-label="Close customizer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-db-neutral-100 border-b border-db-neutral-200 overflow-x-auto text-[11px] font-semibold uppercase tracking-wider divide-x divide-db-neutral-200 no-scrollbar">
            <button
              onClick={() => setActiveTab('theme')}
              className={`px-3.5 py-2.5 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'theme' ? 'bg-white text-db-black font-bold' : 'text-db-neutral-600 hover:text-db-black'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-db-gold" /> Theme
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`px-3.5 py-2.5 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'announcements' ? 'bg-white text-db-black font-bold' : 'text-db-neutral-600 hover:text-db-black'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5 text-db-gold" /> Banner
            </button>
            <button
              onClick={() => setActiveTab('hero')}
              className={`px-3.5 py-2.5 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'hero' ? 'bg-white text-db-black font-bold' : 'text-db-neutral-600 hover:text-db-black'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-db-gold" /> Hero
            </button>
            <button
              onClick={() => setActiveTab('marquee')}
              className={`px-3.5 py-2.5 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'marquee' ? 'bg-white text-db-black font-bold' : 'text-db-neutral-600 hover:text-db-black'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-db-gold" /> Ticker
            </button>
            <button
              onClick={() => setActiveTab('sections')}
              className={`px-3.5 py-2.5 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'sections' ? 'bg-white text-db-black font-bold' : 'text-db-neutral-600 hover:text-db-black'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-db-gold" /> Sections
            </button>
            <button
              onClick={() => setActiveTab('policies')}
              className={`px-3.5 py-2.5 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'policies' ? 'bg-white text-db-black font-bold' : 'text-db-neutral-600 hover:text-db-black'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-db-gold" /> Policies
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-db-neutral-700">
            {/* ── 1. THEME, FONTS & CANVAS ──────────────────────── */}
            {activeTab === 'theme' && (
              <div className="space-y-6">
                {/* Brand Name & Tagline */}
                <div className="space-y-3 pb-5 border-b border-db-neutral-200">
                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-db-black mb-1">
                      Store Brand Name
                    </label>
                    <input
                      type="text"
                      value={customizer.storeName}
                      onChange={(e) => customizer.updateSetting('storeName', e.target.value)}
                      className="w-full px-3 py-2 border border-db-neutral-300 focus:outline-none focus:border-db-black font-serif text-sm"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-db-black mb-1">
                      Brand Tagline / Descriptor
                    </label>
                    <input
                      type="text"
                      value={customizer.storeTagline}
                      onChange={(e) => customizer.updateSetting('storeTagline', e.target.value)}
                      className="w-full px-3 py-2 border border-db-neutral-300 focus:outline-none focus:border-db-black text-xs"
                    />
                  </div>
                </div>

                {/* Canvas Surface Mode */}
                <div className="space-y-2 pb-5 border-b border-db-neutral-200">
                  <label className="block uppercase tracking-wider font-semibold text-db-black">
                    Storefront Canvas Mode
                  </label>
                  <p className="text-[11px] text-db-neutral-500 mb-2">
                    Controls overall background surface and ambient light.
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'light', label: 'Light Atelier', bg: '#FFFFFF', text: '#0D0C0B' },
                      { id: 'noir', label: 'Noir Dark', bg: '#0D0C0B', text: '#FAF8F5' },
                      { id: 'sandstone', label: 'Warm Sand', bg: '#F7F5F0', text: '#1E1B18' },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => customizer.setThemeMode(mode.id as ThemeCanvasMode)}
                        className={`p-2.5 border text-center transition-all ${
                          customizer.themeMode === mode.id
                            ? 'border-db-black ring-1 ring-db-black font-bold shadow-sm'
                            : 'border-db-neutral-200 hover:border-db-neutral-400'
                        }`}
                        style={{ backgroundColor: mode.bg, color: mode.text }}
                      >
                        <span className="block text-[11px] uppercase tracking-wider">{mode.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Typography Font Pairings */}
                <div className="space-y-2 pb-5 border-b border-db-neutral-200">
                  <label className="block uppercase tracking-wider font-semibold text-db-black">
                    Typography Pairing System
                  </label>
                  <p className="text-[11px] text-db-neutral-500 mb-2">
                    Instantly changes headlines and body typefaces across all pages.
                  </p>
                  <div className="space-y-2">
                    {FONT_PAIRING_OPTIONS.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => customizer.setFontPairing(f.id)}
                        className={`w-full text-left p-3 border transition-all ${
                          customizer.fontPairing === f.id
                            ? 'border-db-black bg-db-neutral-50 font-bold'
                            : 'border-db-neutral-200 hover:border-db-neutral-400'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-db-black font-semibold">{f.label}</span>
                          {customizer.fontPairing === f.id && <Check className="w-3.5 h-3.5 text-db-gold" />}
                        </div>
                        <p className="text-[11px] text-db-gold mt-0.5">{f.serifSample}</p>
                        <p className="text-[10px] text-db-neutral-500 mt-0.5">{f.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Border Radius Geometry */}
                <div className="space-y-2 pb-5 border-b border-db-neutral-200">
                  <label className="block uppercase tracking-wider font-semibold text-db-black">
                    Element Geometry & Corner Radius
                  </label>
                  <p className="text-[11px] text-db-neutral-500 mb-2">
                    Controls curvature on buttons, badges, inputs, and cards.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {BORDER_RADIUS_OPTIONS.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => customizer.setBorderRadiusStyle(r.id)}
                        className={`p-2.5 border text-left transition-all ${
                          customizer.borderRadiusStyle === r.id
                            ? 'border-db-black bg-db-neutral-50 font-bold'
                            : 'border-db-neutral-200 hover:border-db-neutral-400'
                        }`}
                        style={{ borderRadius: r.radiusPx }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] text-db-black">{r.label}</span>
                          {customizer.borderRadiusStyle === r.id && (
                            <Check className="w-3 h-3 text-db-gold" />
                          )}
                        </div>
                        <span className="text-[10px] text-db-neutral-500 block mt-0.5">
                          {r.radiusPx}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accent Color Palette */}
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-db-black mb-1">
                    Brand Accent Gold &amp; Highlight Color
                  </label>
                  <p className="text-[11px] text-db-neutral-500 mb-3">
                    Applied in real-time to badges, CTA hover accents, active tabs, and marquee stars.
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {PRESET_ACCENT_COLORS.map((col) => (
                      <button
                        key={col.hex}
                        onClick={() => customizer.setAccentColor(col.hex)}
                        className={`flex items-center gap-2 p-2 border text-left transition-all ${
                          customizer.accentColor.toLowerCase() === col.hex.toLowerCase()
                            ? 'border-db-black bg-db-neutral-50 font-bold'
                            : 'border-db-neutral-200 hover:border-db-neutral-400'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-black/20 flex-shrink-0"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span className="text-[10px] truncate">{col.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] font-medium text-db-neutral-600">Custom Picker:</span>
                    <input
                      type="color"
                      value={customizer.accentColor}
                      onChange={(e) => customizer.setAccentColor(e.target.value)}
                      className="w-7 h-7 p-0 border border-db-neutral-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customizer.accentColor}
                      onChange={(e) => customizer.setAccentColor(e.target.value)}
                      className="w-24 px-2 py-1 text-xs font-mono border border-db-neutral-300 uppercase"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── 2. ANNOUNCEMENTS ───────────────────────── */}
            {activeTab === 'announcements' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-db-neutral-200">
                  <span className="font-semibold text-db-black uppercase tracking-wider">
                    Display Announcement Banner
                  </span>
                  <input
                    type="checkbox"
                    checked={customizer.isAnnouncementBarVisible}
                    onChange={(e) => customizer.updateSetting('isAnnouncementBarVisible', e.target.checked)}
                    className="w-4 h-4 text-db-black rounded border-db-neutral-300 focus:ring-db-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pb-3 border-b border-db-neutral-200">
                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-db-black mb-1">
                      Banner Background
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customizer.announcementBgColor || '#0D0C0B'}
                        onChange={(e) => customizer.updateSetting('announcementBgColor', e.target.value)}
                        className="w-6 h-6 p-0 border rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customizer.announcementBgColor || '#0D0C0B'}
                        onChange={(e) => customizer.updateSetting('announcementBgColor', e.target.value)}
                        className="w-full px-2 py-1 text-xs font-mono border border-db-neutral-300 uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-db-black mb-1">
                      Banner Text Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customizer.announcementTextColor || '#C5A880'}
                        onChange={(e) => customizer.updateSetting('announcementTextColor', e.target.value)}
                        className="w-6 h-6 p-0 border rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customizer.announcementTextColor || '#C5A880'}
                        onChange={(e) => customizer.updateSetting('announcementTextColor', e.target.value)}
                        className="w-full px-2 py-1 text-xs font-mono border border-db-neutral-300 uppercase"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-db-black mb-1">
                    Announcement Message 1
                  </label>
                  <input
                    type="text"
                    value={customizer.announcement1}
                    onChange={(e) => customizer.updateSetting('announcement1', e.target.value)}
                    className="w-full px-3 py-2 border border-db-neutral-300 focus:outline-none focus:border-db-black text-xs"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-db-black mb-1">
                    Announcement Message 2
                  </label>
                  <input
                    type="text"
                    value={customizer.announcement2}
                    onChange={(e) => customizer.updateSetting('announcement2', e.target.value)}
                    className="w-full px-3 py-2 border border-db-neutral-300 focus:outline-none focus:border-db-black text-xs"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-db-black mb-1">
                    Announcement Message 3 (Promo Voucher)
                  </label>
                  <input
                    type="text"
                    value={customizer.announcement3}
                    onChange={(e) => customizer.updateSetting('announcement3', e.target.value)}
                    className="w-full px-3 py-2 border border-db-neutral-300 focus:outline-none focus:border-db-black text-xs"
                  />
                </div>
              </div>
            )}

            {/* ── 3. HERO SLIDES ─────────────────────────── */}
            {activeTab === 'hero' && (
              <div className="space-y-5">
                {/* Slide Switcher & Controls */}
                <div className="flex items-center gap-1.5 pb-3 border-b border-db-neutral-200 overflow-x-auto">
                  {customizer.heroSlides.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveSlideIdx(idx)}
                      className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border transition-colors ${
                        activeSlideIdx === idx
                          ? 'bg-db-black text-white border-db-black'
                          : 'bg-white text-db-neutral-700 border-db-neutral-300'
                      }`}
                    >
                      Slide 0{s.id}
                    </button>
                  ))}

                  <button
                    onClick={customizer.addHeroSlide}
                    className="px-2.5 py-1.5 bg-db-neutral-100 hover:bg-db-neutral-200 border border-db-neutral-300 text-db-black text-xs font-bold"
                    title="Add new slide"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>

                  {customizer.heroSlides.length > 1 && (
                    <button
                      onClick={() => {
                        customizer.removeHeroSlide(activeSlideIdx);
                        setActiveSlideIdx(Math.max(0, activeSlideIdx - 1));
                      }}
                      className="px-2.5 py-1.5 text-db-neutral-400 hover:text-rose-600 border border-db-neutral-300 text-xs"
                      title="Delete current slide"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Selected Slide Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-db-black mb-1">
                      Collection Badge
                    </label>
                    <input
                      type="text"
                      value={currentSlide.badge}
                      onChange={(e) => customizer.updateHeroSlide(activeSlideIdx, { badge: e.target.value })}
                      className="w-full px-3 py-2 border border-db-neutral-300 focus:outline-none focus:border-db-black"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block uppercase tracking-wider font-semibold text-db-black mb-1">
                        Title Line 1
                      </label>
                      <input
                        type="text"
                        value={currentSlide.titleLine1}
                        onChange={(e) => customizer.updateHeroSlide(activeSlideIdx, { titleLine1: e.target.value })}
                        className="w-full px-3 py-2 border border-db-neutral-300 focus:outline-none focus:border-db-black"
                      />
                    </div>
                    <div>
                      <label className="block uppercase tracking-wider font-semibold text-db-black mb-1">
                        Title Line 2 (Italic)
                      </label>
                      <input
                        type="text"
                        value={currentSlide.titleLine2}
                        onChange={(e) => customizer.updateHeroSlide(activeSlideIdx, { titleLine2: e.target.value })}
                        className="w-full px-3 py-2 border border-db-neutral-300 focus:outline-none focus:border-db-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-db-black mb-1">
                      Gold Subtitle
                    </label>
                    <input
                      type="text"
                      value={currentSlide.subtitle}
                      onChange={(e) => customizer.updateHeroSlide(activeSlideIdx, { subtitle: e.target.value })}
                      className="w-full px-3 py-2 border border-db-neutral-300 focus:outline-none focus:border-db-black"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-db-black mb-1">
                      Description Narrative
                    </label>
                    <textarea
                      rows={3}
                      value={currentSlide.description}
                      onChange={(e) => customizer.updateHeroSlide(activeSlideIdx, { description: e.target.value })}
                      className="w-full px-3 py-2 border border-db-neutral-300 focus:outline-none focus:border-db-black"
                    />
                  </div>

                  {/* Image: Custom URL or Presets */}
                  <div className="space-y-2">
                    <label className="block uppercase tracking-wider font-semibold text-db-black">
                      Background Image (Custom URL or Preset)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="https://... or /images/..."
                        value={currentSlide.image}
                        onChange={(e) => customizer.updateHeroSlide(activeSlideIdx, { image: e.target.value })}
                        className="flex-1 px-3 py-2 border border-db-neutral-300 text-xs font-mono"
                      />
                      {currentSlide.image && (
                        <div className="w-10 h-10 border overflow-hidden flex-shrink-0 bg-db-neutral-100">
                          <img src={currentSlide.image} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      {PRESET_HERO_IMAGES.map((img) => (
                        <button
                          key={img.url}
                          type="button"
                          onClick={() => customizer.updateHeroSlide(activeSlideIdx, { image: img.url })}
                          className={`text-left px-2.5 py-1.5 text-[10px] border truncate ${
                            currentSlide.image === img.url
                              ? 'border-db-black bg-db-neutral-100 font-bold'
                              : 'border-db-neutral-200 hover:bg-db-neutral-50'
                          }`}
                        >
                          {img.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block uppercase tracking-wider font-semibold text-db-black mb-1">
                        Primary CTA Label
                      </label>
                      <input
                        type="text"
                        value={currentSlide.primaryCtaLabel}
                        onChange={(e) => customizer.updateHeroSlide(activeSlideIdx, { primaryCtaLabel: e.target.value })}
                        className="w-full px-3 py-2 border border-db-neutral-300"
                      />
                    </div>
                    <div>
                      <label className="block uppercase tracking-wider font-semibold text-db-black mb-1">
                        Secondary CTA Label
                      </label>
                      <input
                        type="text"
                        value={currentSlide.secondaryCtaLabel}
                        onChange={(e) => customizer.updateHeroSlide(activeSlideIdx, { secondaryCtaLabel: e.target.value })}
                        className="w-full px-3 py-2 border border-db-neutral-300"
                      />
                    </div>
                  </div>

                  {/* Hotspot garment meta */}
                  <div className="p-3 bg-db-neutral-50 border border-db-neutral-200 space-y-2 mt-2">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-db-gold">
                      Interactive Garment Hotspot Pin
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Garment Title"
                        value={currentSlide.hotspotTitle || ''}
                        onChange={(e) => customizer.updateHeroSlide(activeSlideIdx, { hotspotTitle: e.target.value })}
                        className="px-2 py-1.5 text-[11px] border border-db-neutral-300 bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Price (₹)"
                        value={currentSlide.hotspotPrice || ''}
                        onChange={(e) => customizer.updateHeroSlide(activeSlideIdx, { hotspotPrice: e.target.value })}
                        className="px-2 py-1.5 text-[11px] border border-db-neutral-300 bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── 4. MARQUEE TICKER ──────────────────────── */}
            {activeTab === 'marquee' && (
              <div className="space-y-4">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-db-black mb-1">
                    Continuous Marquee Text
                  </label>
                  <p className="text-[11px] text-db-neutral-500 mb-2">
                    This text scrolls smoothly in an infinite loop below the hero. Separate phrases with dots or bullets.
                  </p>
                  <textarea
                    rows={5}
                    value={customizer.marqueeText}
                    onChange={(e) => customizer.updateSetting('marqueeText', e.target.value)}
                    className="w-full px-3 py-2 border border-db-neutral-300 focus:outline-none focus:border-db-black leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-db-black mb-2">
                    Scroll Animation Speed
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'fast', label: 'Fast (18s)' },
                      { id: 'normal', label: 'Normal (28s)' },
                      { id: 'slow', label: 'Slow (42s)' },
                    ].map((spd) => (
                      <button
                        key={spd.id}
                        onClick={() => customizer.updateSetting('marqueeSpeed', spd.id as MarqueeSpeedOption)}
                        className={`p-2 border text-center text-xs ${
                          customizer.marqueeSpeed === spd.id
                            ? 'border-db-black bg-db-neutral-100 font-bold'
                            : 'border-db-neutral-200 hover:bg-db-neutral-50'
                        }`}
                      >
                        {spd.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── 5. HOMEPAGE SECTIONS ────────────────────── */}
            {activeTab === 'sections' && (
              <div className="space-y-5">
                <p className="text-[11px] text-db-neutral-500">
                  Toggle and customize titles for every homepage content section.
                </p>

                {/* Section: Pillars */}
                <div className="p-3 border border-db-neutral-200 bg-db-neutral-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-db-black uppercase tracking-wider text-xs">
                      1. Curated Wardrobe Pillars
                    </span>
                    <input
                      type="checkbox"
                      checked={customizer.showPillarsSection}
                      onChange={(e) => customizer.updateSetting('showPillarsSection', e.target.checked)}
                      className="w-4 h-4 text-db-black rounded"
                    />
                  </div>
                  <input
                    type="text"
                    value={customizer.pillarsTitle}
                    onChange={(e) => customizer.updateSetting('pillarsTitle', e.target.value)}
                    placeholder="Section Title"
                    className="w-full px-2.5 py-1.5 text-xs border border-db-neutral-300 bg-white"
                  />
                </div>

                {/* Section: Essential Rotation */}
                <div className="p-3 border border-db-neutral-200 bg-db-neutral-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-db-black uppercase tracking-wider text-xs">
                      2. Essential Rotation (Featured Drops)
                    </span>
                    <input
                      type="checkbox"
                      checked={customizer.showRotationSection}
                      onChange={(e) => customizer.updateSetting('showRotationSection', e.target.checked)}
                      className="w-4 h-4 text-db-black rounded"
                    />
                  </div>
                  <input
                    type="text"
                    value={customizer.rotationTitle}
                    onChange={(e) => customizer.updateSetting('rotationTitle', e.target.value)}
                    placeholder="Section Title"
                    className="w-full px-2.5 py-1.5 text-xs border border-db-neutral-300 bg-white"
                  />
                </div>

                {/* Section: Atelier Craftsmanship */}
                <div className="p-3 border border-db-neutral-200 bg-db-neutral-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-db-black uppercase tracking-wider text-xs">
                      3. Atelier Philosophy &amp; Craftsmanship
                    </span>
                    <input
                      type="checkbox"
                      checked={customizer.showCraftsmanshipSection}
                      onChange={(e) => customizer.updateSetting('showCraftsmanshipSection', e.target.checked)}
                      className="w-4 h-4 text-db-black rounded"
                    />
                  </div>
                  <input
                    type="text"
                    value={customizer.craftsmanshipTitle}
                    onChange={(e) => customizer.updateSetting('craftsmanshipTitle', e.target.value)}
                    placeholder="Section Title"
                    className="w-full px-2.5 py-1.5 text-xs border border-db-neutral-300 bg-white mb-2"
                  />
                  <div>
                    <label className="text-[10px] uppercase font-bold text-db-neutral-500 block mb-1">
                      Atelier Director Quote
                    </label>
                    <textarea
                      rows={2}
                      value={customizer.atelierQuote}
                      onChange={(e) => customizer.updateSetting('atelierQuote', e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-db-neutral-300 bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="text-[10px] text-db-neutral-500 uppercase">Fabric GSM</label>
                      <input
                        type="text"
                        value={customizer.gsmNumber}
                        onChange={(e) => customizer.updateSetting('gsmNumber', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-db-neutral-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-db-neutral-500 uppercase">Natural Fibers</label>
                      <input
                        type="text"
                        value={customizer.fiberOrigin}
                        onChange={(e) => customizer.updateSetting('fiberOrigin', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-db-neutral-300 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Section: Acclaim Testimonial */}
                <div className="p-3 border border-db-neutral-200 bg-db-neutral-50 flex items-center justify-between">
                  <span className="font-semibold text-db-black uppercase tracking-wider text-xs">
                    4. Editorial Review &amp; Acclaim Banner
                  </span>
                  <input
                    type="checkbox"
                    checked={customizer.showAcclaimSection}
                    onChange={(e) => customizer.updateSetting('showAcclaimSection', e.target.checked)}
                    className="w-4 h-4 text-db-black rounded"
                  />
                </div>

                {/* Section: Delivery Perks */}
                <div className="p-3 border border-db-neutral-200 bg-db-neutral-50 flex items-center justify-between">
                  <span className="font-semibold text-db-black uppercase tracking-wider text-xs">
                    5. Bottom Hero Delivery Perks Strip
                  </span>
                  <input
                    type="checkbox"
                    checked={customizer.showDeliveryStrip}
                    onChange={(e) => customizer.updateSetting('showDeliveryStrip', e.target.checked)}
                    className="w-4 h-4 text-db-black rounded"
                  />
                </div>

                {/* Section: Hotspot Pin */}
                <div className="p-3 border border-db-neutral-200 bg-db-neutral-50 flex items-center justify-between">
                  <span className="font-semibold text-db-black uppercase tracking-wider text-xs">
                    6. Hero Interactive Garment Pin
                  </span>
                  <input
                    type="checkbox"
                    checked={customizer.showHotspotPin}
                    onChange={(e) => customizer.updateSetting('showHotspotPin', e.target.checked)}
                    className="w-4 h-4 text-db-black rounded"
                  />
                </div>
              </div>
            )}

            {/* ── 6. POLICIES & CONCIERGE ─────────────────── */}
            {activeTab === 'policies' && (
              <div className="space-y-4">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-db-black mb-1">
                    Free Express Shipping Threshold (₹)
                  </label>
                  <p className="text-[11px] text-db-neutral-500 mb-1.5">
                    Orders at or above this amount automatically unlock complimentary shipping in bag &amp; checkout.
                  </p>
                  <input
                    type="number"
                    value={customizer.freeShippingThreshold}
                    onChange={(e) => customizer.updateSetting('freeShippingThreshold', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-db-neutral-300 focus:outline-none focus:border-db-black"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-db-black mb-1">
                    Doorstep Return / Size Exchange Window (Days)
                  </label>
                  <input
                    type="number"
                    value={customizer.returnWindowDays}
                    onChange={(e) => customizer.updateSetting('returnWindowDays', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-db-neutral-300 focus:outline-none focus:border-db-black"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-db-black mb-1">
                    Concierge Support Email
                  </label>
                  <input
                    type="email"
                    value={customizer.contactEmail}
                    onChange={(e) => customizer.updateSetting('contactEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-db-neutral-300 focus:outline-none focus:border-db-black"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-db-black mb-1">
                    WhatsApp Concierge Number
                  </label>
                  <input
                    type="text"
                    value={customizer.contactPhone}
                    onChange={(e) => customizer.updateSetting('contactPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-db-neutral-300 focus:outline-none focus:border-db-black"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-db-black mb-1">
                    Official Instagram Link
                  </label>
                  <input
                    type="text"
                    value={customizer.instagramUrl}
                    onChange={(e) => customizer.updateSetting('instagramUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-db-neutral-300 focus:outline-none focus:border-db-black"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-db-neutral-50 border-t border-db-neutral-200 flex items-center justify-between gap-3">
            <button
              onClick={customizer.resetToDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-db-neutral-600 hover:text-rose-600 uppercase tracking-wider transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={() => {
                customizer.saveSettingsToServer();
                customizer.closeCustomizer();
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-db-black text-white text-xs font-bold uppercase tracking-wider hover:bg-db-charcoal shadow-sm transition-all"
            >
              <Save className="w-3.5 h-3.5 text-db-gold" />
              <span>Save &amp; Publish</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
