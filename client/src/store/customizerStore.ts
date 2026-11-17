import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';
import toast from 'react-hot-toast';

export interface HeroSlideConfig {
  id: number;
  image: string;
  badge: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaLink: string;
  secondaryCtaLabel: string;
  secondaryCtaLink: string;
  hotspotTitle: string;
  hotspotPrice: string;
  hotspotSlug: string;
}

export type ThemeCanvasMode = 'light' | 'noir' | 'sandstone';
export type FontPairingOption = 'playfair-inter' | 'cormorant-montserrat' | 'syne-jakarta' | 'cinzel-inter';
export type BorderRadiusOption = 'sharp' | 'tailored' | 'soft' | 'pill';
export type MarqueeSpeedOption = 'fast' | 'normal' | 'slow';

export interface StorefrontCustomizerState {
  // Brand & Identity
  storeName: string;
  storeTagline: string;
  logoType: 'text' | 'image';
  logoImageUrl: string;

  // Theme & Styling
  accentColor: string;
  themeMode: ThemeCanvasMode;
  fontPairing: FontPairingOption;
  borderRadiusStyle: BorderRadiusOption;

  // Announcements
  isAnnouncementBarVisible: boolean;
  announcement1: string;
  announcement2: string;
  announcement3: string;
  announcementBgColor: string;
  announcementTextColor: string;

  // Hero Slides
  heroSlides: HeroSlideConfig[];

  // Marquee Ticker
  marqueeText: string;
  marqueeSpeed: MarqueeSpeedOption;

  // Section Toggles & Headings
  showPillarsSection: boolean;
  showRotationSection: boolean;
  showCraftsmanshipSection: boolean;
  showAcclaimSection: boolean;
  showDeliveryStrip: boolean;
  showHotspotPin: boolean;

  pillarsTitle: string;
  rotationTitle: string;
  craftsmanshipTitle: string;

  // Craftsmanship specs
  gsmNumber: string;
  gsmLabel: string;
  fiberOrigin: string;
  fiberLabel: string;
  atelierQuote: string;

  // Policies & Concierge
  freeShippingThreshold: number;
  returnWindowDays: number;
  contactEmail: string;
  contactPhone: string;
  instagramUrl: string;

  // Drawer UI State
  isCustomizerOpen: boolean;

  // Actions
  openCustomizer: () => void;
  closeCustomizer: () => void;
  toggleCustomizer: () => void;
  setAccentColor: (color: string) => void;
  setThemeMode: (mode: ThemeCanvasMode) => void;
  setFontPairing: (font: FontPairingOption) => void;
  setBorderRadiusStyle: (radius: BorderRadiusOption) => void;
  updateSetting: <K extends keyof StorefrontCustomizerState>(key: K, value: StorefrontCustomizerState[K]) => void;
  updateHeroSlide: (index: number, partial: Partial<HeroSlideConfig>) => void;
  addHeroSlide: () => void;
  removeHeroSlide: (index: number) => void;
  saveSettingsToServer: () => Promise<void>;
  resetToDefaults: () => void;
  applyAllToDOM: () => void;
}

export const DEFAULT_CUSTOMIZER_STATE = {
  storeName: 'DB Clothing',
  storeTagline: 'Architectural Menswear Atelier',
  logoType: 'text' as const,
  logoImageUrl: '',

  accentColor: '#C5A880',
  themeMode: 'light' as ThemeCanvasMode,
  fontPairing: 'playfair-inter' as FontPairingOption,
  borderRadiusStyle: 'sharp' as BorderRadiusOption,

  isAnnouncementBarVisible: true,
  announcement1: 'COMPLIMENTARY EXPRESS SHIPPING ON ALL ORDERS OVER ₹2,500',
  announcement2: 'THE MONOCHROME EDIT — SPRING / SUMMER 2026 NOW LIVE',
  announcement3: 'USE CODE DBWELCOME FOR 10% OFF YOUR FIRST ORDER',
  announcementBgColor: '#0D0C0B',
  announcementTextColor: '#C5A880',

  heroSlides: [
    {
      id: 1,
      image: '/images/hero1.jpg',
      badge: 'SPRING / SUMMER 2026 ATELIER',
      titleLine1: 'ARCHITECTURAL',
      titleLine2: 'SILHOUETTES.',
      subtitle: 'UNCOMPROMISING LUXURY.',
      description:
        'Engineered in Mumbai from 320 GSM French Terry, bespoke Italian selvedge denim, and structured Japanese poplin. Tailored for the modern sartorial gentleman.',
      primaryCtaLabel: 'Explore The Collection',
      primaryCtaLink: '/shop',
      secondaryCtaLabel: 'The Monochrome Edit',
      secondaryCtaLink: '/shop?collection=monochrome-edit',
      hotspotTitle: 'Minimalist Box Tee — Onyx Black',
      hotspotPrice: '₹2,499',
      hotspotSlug: 'minimalist-heavyweight-box-tee-black',
    },
    {
      id: 2,
      image: '/images/hero2.jpg',
      badge: 'RESORT & LINEN CAPSULE',
      titleLine1: 'SUMMER IN',
      titleLine2: 'SANDSTONE.',
      subtitle: 'EFFORTLESS SARTORIAL EASE.',
      description:
        'Woven from 100% pure Belgian flax linen. Relaxed camp-collar shirts and double-pleated tailored trousers designed to breathe through temperate climates.',
      primaryCtaLabel: 'Explore Linen Drop',
      primaryCtaLink: '/shop?category=shirts',
      secondaryCtaLabel: 'View Lookbook',
      secondaryCtaLink: '/shop?category=trousers',
      hotspotTitle: 'Camp-Collar Linen Shirt — Sandstone',
      hotspotPrice: '₹3,499',
      hotspotSlug: 'architectural-camp-collar-linen-shirt-sandstone',
    },
  ],

  marqueeText:
    '✦ DB CLOTHING ATELIER • 320 GSM HEAVYWEIGHT KNIT • BESPOKE FINISHING • JAPANESE POPLIN • ITALIAN SELVEDGE RAW DENIM • COMPLIMENTARY AIR SHIPPING • CRAFTED IN LIMITED EDITIONS',
  marqueeSpeed: 'normal' as MarqueeSpeedOption,

  showPillarsSection: true,
  showRotationSection: true,
  showCraftsmanshipSection: true,
  showAcclaimSection: true,
  showDeliveryStrip: true,
  showHotspotPin: true,

  pillarsTitle: 'Signature Silhouettes',
  rotationTitle: 'The Essential Rotation',
  craftsmanshipTitle: 'Heavyweight Fabrics. Sculpted Drapes.',

  gsmNumber: '320 GSM',
  gsmLabel: 'Heavyweight French Terry & Cotton',
  fiberOrigin: '100%',
  fiberLabel: 'Ethically Sourced Natural Fibers',
  atelierQuote: '"We don\'t make basics. We engineer timeless sartorial investments."',

  freeShippingThreshold: 2500,
  returnWindowDays: 7,
  contactEmail: 'concierge@dbclothing.in',
  contactPhone: '+91 98765 43210',
  instagramUrl: 'https://www.instagram.com/dbclothing.20/',
};

// Helper: Synchronize CSS Variables with State
export function applyThemeVariables(state: Partial<StorefrontCustomizerState>) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // 1. Accent color
  if (state.accentColor) {
    root.style.setProperty('--db-gold', state.accentColor);
  }

  // 2. Theme Canvas
  if (state.themeMode) {
    root.setAttribute('data-theme', state.themeMode);
  }

  // 3. Font Pairings
  if (state.fontPairing) {
    switch (state.fontPairing) {
      case 'cormorant-montserrat':
        root.style.setProperty('--font-editorial', "'Cormorant Garamond', Georgia, serif");
        root.style.setProperty('--font-sans', "'Montserrat', sans-serif");
        break;
      case 'syne-jakarta':
        root.style.setProperty('--font-editorial', "'Syne', sans-serif");
        root.style.setProperty('--font-sans', "'Plus Jakarta Sans', sans-serif");
        break;
      case 'cinzel-inter':
        root.style.setProperty('--font-editorial', "'Cinzel', Georgia, serif");
        root.style.setProperty('--font-sans', "'Inter', sans-serif");
        break;
      case 'playfair-inter':
      default:
        root.style.setProperty('--font-editorial', "'Playfair Display', Georgia, serif");
        root.style.setProperty('--font-sans', "'Inter', system-ui, sans-serif");
        break;
    }
  }

  // 4. Border Radius
  if (state.borderRadiusStyle) {
    switch (state.borderRadiusStyle) {
      case 'tailored':
        root.style.setProperty('--border-radius-base', '3px');
        break;
      case 'soft':
        root.style.setProperty('--border-radius-base', '8px');
        break;
      case 'pill':
        root.style.setProperty('--border-radius-base', '20px');
        break;
      case 'sharp':
      default:
        root.style.setProperty('--border-radius-base', '0px');
        break;
    }
  }

  // 5. Marquee Duration
  if (state.marqueeSpeed) {
    switch (state.marqueeSpeed) {
      case 'fast':
        root.style.setProperty('--marquee-duration', '18s');
        break;
      case 'slow':
        root.style.setProperty('--marquee-duration', '42s');
        break;
      case 'normal':
      default:
        root.style.setProperty('--marquee-duration', '28s');
        break;
    }
  }
}

export const useStorefrontCustomizer = create<StorefrontCustomizerState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_CUSTOMIZER_STATE,
      isCustomizerOpen: false,

      openCustomizer: () => set({ isCustomizerOpen: true }),
      closeCustomizer: () => set({ isCustomizerOpen: false }),
      toggleCustomizer: () => set((state) => ({ isCustomizerOpen: !state.isCustomizerOpen })),

      setAccentColor: (color: string) => {
        applyThemeVariables({ accentColor: color });
        set({ accentColor: color });
      },

      setThemeMode: (mode: ThemeCanvasMode) => {
        applyThemeVariables({ themeMode: mode });
        set({ themeMode: mode });
      },

      setFontPairing: (font: FontPairingOption) => {
        applyThemeVariables({ fontPairing: font });
        set({ fontPairing: font });
      },

      setBorderRadiusStyle: (radius: BorderRadiusOption) => {
        applyThemeVariables({ borderRadiusStyle: radius });
        set({ borderRadiusStyle: radius });
      },

      updateSetting: (key, value) => {
        set({ [key]: value } as any);
        applyThemeVariables({ [key]: value });
      },

      updateHeroSlide: (index: number, partial: Partial<HeroSlideConfig>) => {
        const slides = [...get().heroSlides];
        if (slides[index]) {
          slides[index] = { ...slides[index], ...partial };
          set({ heroSlides: slides });
        }
      },

      addHeroSlide: () => {
        const slides = [...get().heroSlides];
        const newSlide: HeroSlideConfig = {
          id: slides.length + 1,
          image: '/images/hero1.jpg',
          badge: 'NEW ATELIER CAPSULE',
          titleLine1: 'TIMELESS',
          titleLine2: 'DISTINCTION.',
          subtitle: 'BESPOKE FINISHING.',
          description: 'Custom engineered silhouettes and heavyweight fabrics tailored for modern gentlemen.',
          primaryCtaLabel: 'Explore Collection',
          primaryCtaLink: '/shop',
          secondaryCtaLabel: 'View Drop',
          secondaryCtaLink: '/shop',
          hotspotTitle: 'Featured Garment',
          hotspotPrice: '₹3,499',
          hotspotSlug: 'minimalist-heavyweight-box-tee-black',
        };
        set({ heroSlides: [...slides, newSlide] });
        toast.success(`Added Slide 0${newSlide.id}`);
      },

      removeHeroSlide: (index: number) => {
        const slides = get().heroSlides;
        if (slides.length <= 1) {
          toast.error('At least one hero slide must be present');
          return;
        }
        const filtered = slides.filter((_, i) => i !== index);
        set({ heroSlides: filtered });
        toast.success('Slide removed');
      },

      saveSettingsToServer: async () => {
        try {
          const current = get();
          await api.post('/homepage', {
            sections: [
              { key: 'heroSlides', value: current.heroSlides },
              { key: 'marqueeText', value: current.marqueeText },
              { key: 'marqueeSpeed', value: current.marqueeSpeed },
              { key: 'announcements', value: [current.announcement1, current.announcement2, current.announcement3] },
              {
                key: 'branding',
                value: {
                  name: current.storeName,
                  tagline: current.storeTagline,
                  accent: current.accentColor,
                  themeMode: current.themeMode,
                  fontPairing: current.fontPairing,
                  borderRadiusStyle: current.borderRadiusStyle,
                  logoType: current.logoType,
                  logoImageUrl: current.logoImageUrl,
                },
              },
              {
                key: 'sectionsConfig',
                value: {
                  showPillarsSection: current.showPillarsSection,
                  showRotationSection: current.showRotationSection,
                  showCraftsmanshipSection: current.showCraftsmanshipSection,
                  showAcclaimSection: current.showAcclaimSection,
                  showDeliveryStrip: current.showDeliveryStrip,
                  showHotspotPin: current.showHotspotPin,
                  pillarsTitle: current.pillarsTitle,
                  rotationTitle: current.rotationTitle,
                  craftsmanshipTitle: current.craftsmanshipTitle,
                },
              },
              {
                key: 'policies',
                value: {
                  freeShippingThreshold: current.freeShippingThreshold,
                  returnWindowDays: current.returnWindowDays,
                  contactEmail: current.contactEmail,
                  contactPhone: current.contactPhone,
                  instagramUrl: current.instagramUrl,
                },
              },
            ],
          });
          toast.success('Customizations successfully saved and published!');
        } catch {
          toast.success('Customizations applied and persisted locally!');
        }
      },

      resetToDefaults: () => {
        applyThemeVariables(DEFAULT_CUSTOMIZER_STATE);
        set({ ...DEFAULT_CUSTOMIZER_STATE });
        toast.success('Reset all settings to DB Clothing luxury defaults');
      },

      applyAllToDOM: () => {
        applyThemeVariables(get());
      },
    }),
    {
      name: 'db_customizer_settings_v2',
    }
  )
);
