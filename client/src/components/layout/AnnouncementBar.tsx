import { useState, useEffect } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStorefrontCustomizer } from '../../store/customizerStore';

export default function AnnouncementBar() {
  const customizer = useStorefrontCustomizer();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  const announcements = [
    { text: customizer.announcement1, link: '/shop' },
    { text: customizer.announcement2, link: '/shop?collection=monochrome-edit' },
    { text: customizer.announcement3, link: '/shop' },
  ].filter((a) => Boolean(a.text));

  useEffect(() => {
    if (announcements.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [announcements.length]);

  if (!customizer.isAnnouncementBarVisible || isDismissed || announcements.length === 0) {
    return null;
  }

  const current = announcements[currentIndex % announcements.length];

  return (
    <aside
      aria-label="Announcements and promotions"
      style={{
        backgroundColor: customizer.announcementBgColor || '#0D0C0B',
        color: customizer.announcementTextColor || 'var(--db-gold, #C5A880)',
      }}
      className="text-[10px] sm:text-[11px] tracking-[0.2em] font-medium uppercase py-2 px-4 transition-all duration-300 relative border-b border-white/10 z-50 select-none"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="w-6 hidden md:block" />

        <div className="flex-1 text-center truncate">
          <Link
            to={current.link}
            className="inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity duration-200"
          >
            <span className="truncate">{current.text}</span>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
          </Link>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-db-gold/60 hover:text-white transition-colors p-0.5 ml-2"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
