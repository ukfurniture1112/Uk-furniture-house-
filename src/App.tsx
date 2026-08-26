import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { CategoryGrid } from './components/home/CategoryGrid';
import { FeaturedSection } from './components/home/FeaturedSection';
import { WhyChooseUs } from './components/home/WhyChooseUs';
import { CustomerReviews } from './components/home/CustomerReviews';
import { DeliveryInfoSection } from './components/home/DeliveryInfoSection';
import { FaqSection } from './components/home/FaqSection';
import { ProductGrid } from './components/products/ProductGrid';
import { ProductDetailPage } from './components/products/ProductDetailPage';
import { AboutUsPage } from './components/pages/AboutUsPage';
import { ContactUsPage } from './components/pages/ContactUsPage';
import { BasketDrawer } from './components/basket/BasketDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderSuccessModal } from './components/checkout/OrderSuccessModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ToastContainer } from './components/common/Toast';
import { Phone } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentView, selectedProduct, settings, navigateTo } = useStore();
  const { isAuthenticated } = useAdmin();
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // If in admin view and authenticated, render full AdminDashboard
  if (currentView === 'admin') {
    if (isAuthenticated) {
      return (
        <>
          <AdminDashboard />
          <ToastContainer />
        </>
      );
    } else {
      // Prompt login modal and redirect
      return (
        <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xl max-w-md w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 font-serif font-bold text-2xl flex items-center justify-center mx-auto">
              UK
            </div>
            <h2 className="font-serif font-bold text-xl text-stone-900">Admin Authentication Required</h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Please sign in with your staff credentials to access order dispatches and catalogue management.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => setIsAdminLoginOpen(true)}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-3 rounded-xl text-xs"
              >
                Sign In to Admin
              </button>
              <button
                onClick={() => navigateTo('home')}
                className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold py-2.5 rounded-xl text-xs"
              >
                Back to Customer Store
              </button>
            </div>
          </div>
          <AdminLoginModal
            isOpen={isAdminLoginOpen}
            onClose={() => setIsAdminLoginOpen(false)}
            onSuccess={() => navigateTo('admin')}
          />
          <ToastContainer />
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-amber-200 selection:text-stone-900">
      {/* Header */}
      <Header onOpenAdminLogin={() => setIsAdminLoginOpen(true)} />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroSection />
            <CategoryGrid />
            <FeaturedSection />
            <WhyChooseUs />
            <CustomerReviews />
            <DeliveryInfoSection />
            <FaqSection />
          </>
        )}

        {currentView === 'shop' && <ProductGrid />}

        {currentView === 'product-detail' && selectedProduct && (
          <ProductDetailPage product={selectedProduct} />
        )}

        {currentView === 'about' && <AboutUsPage />}

        {currentView === 'contact' && <ContactUsPage />}

        {currentView === 'delivery-faq' && (
          <div className="bg-stone-50 min-h-screen py-10 space-y-12">
            <DeliveryInfoSection />
            <FaqSection />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <BasketDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => navigateTo('admin')}
      />
      <ToastContainer />

      {/* Persistent Floating WhatsApp Quick Action Button */}
      <div className="fixed bottom-5 left-5 z-40 flex flex-col gap-2.5">
        <a
          href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
            'Hello UK Furniture Hub, I have an enquiry about your furniture catalogue.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105"
          title="Direct WhatsApp Support"
        >
          <Phone className="w-5 h-5" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-bold">
            Chat on WhatsApp
          </span>
        </a>
      </div>
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <AdminProvider>
        <MainAppContent />
      </AdminProvider>
    </StoreProvider>
  );
}

export default App;
