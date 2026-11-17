import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';
import LiveStoreCustomizer from '../customizer/LiveStoreCustomizer';
import { useCartStore } from '../../store';
import { useStorefrontCustomizer } from '../../store/customizerStore';

export default function RootLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const { isDrawerOpen, closeDrawer } = useCartStore();
  const customizer = useStorefrontCustomizer();

  // Apply all customizer variables (color, font, theme canvas, border radius) to document root
  useEffect(() => {
    customizer.applyAllToDOM();
  }, [
    customizer.accentColor,
    customizer.themeMode,
    customizer.fontPairing,
    customizer.borderRadiusStyle,
    customizer.marqueeSpeed,
  ]);

  if (isAdmin) {
    return (
      <>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Outlet />
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-db-black antialiased selection:bg-db-gold selection:text-db-black">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '0px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            border: '1px solid #E5E5E5',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          },
        }}
      />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      {/* Slide-over cart drawer */}
      <CartDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />

      {/* Floating Live Storefront Customizer Studio */}
      <LiveStoreCustomizer />
    </div>
  );
}
