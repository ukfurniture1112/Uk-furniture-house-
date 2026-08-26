import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Phone,
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { CategoryId } from '../../types';
import { formatPrice } from '../../utils/formatters';

interface HeaderProps {
  onOpenAdminLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAdminLogin }) => {
  const {
    settings,
    basketCount,
    subtotal,
    openBasket,
    navigateTo,
    currentView,
    setCategoryFilter,
    setSearchQuery,
    filters,
    setIsAiModalOpen,
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.searchQuery || '');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
      navigateTo('shop');
      setIsSearchExpanded(false);
      setIsMobileMenuOpen(false);
    }
  };

  const handleCategoryClick = (catId: CategoryId | 'all') => {
    setCategoryFilter(catId);
    navigateTo('shop');
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Home', view: 'home' as const, cat: null },
    { label: 'Shop All', view: 'shop' as const, cat: 'all' as const },
    { label: 'Beds & Frames', view: 'shop' as const, cat: 'beds' as const },
    { label: 'TV Beds', view: 'shop' as const, cat: 'tv-beds' as const },
    { label: 'Wardrobes', view: 'shop' as const, cat: 'sliding-wardrobes' as const },
    { label: 'Corner Sofas', view: 'shop' as const, cat: 'corner-sofas' as const },
    { label: 'U-Shaped Sofas', view: 'shop' as const, cat: 'u-shaped-sofas' as const },
    { label: 'Dining Sets', view: 'shop' as const, cat: 'dining-tables' as const },
    { label: 'Mattresses', view: 'shop' as const, cat: 'mattresses' as const },
    { label: 'Garden', view: 'shop' as const, cat: 'garden-furniture' as const },
    { label: 'About Us', view: 'about' as const, cat: null },
    { label: 'Contact', view: 'contact' as const, cat: null },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200/80 shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-stone-900 text-stone-200 text-xs font-medium py-2 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center justify-center gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 text-amber-300 font-semibold tracking-wide">
              <Truck className="w-3.5 h-3.5" /> FREE UK HOME DELIVERY
            </span>
            <span className="hidden md:inline-block text-stone-600">•</span>
            <span className="hidden md:flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> CASH ON DELIVERY (NO DEPOSIT)
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 text-[11px] sm:text-xs text-stone-300">
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-emerald-400 font-medium transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-400" /> WhatsApp Orders: {settings.whatsappNumber}
            </a>
            <span className="text-stone-600">|</span>
            <span className="text-amber-300 font-medium">
              🇬🇧 British Handcrafted Quality
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors focus:outline-hidden"
              aria-label="Open mobile navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-3 text-left group focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center font-serif font-bold text-xl tracking-tight shadow-md border border-amber-400/30 group-hover:scale-105 transition-transform">
              UK
            </div>
            <div>
              <div className="font-serif font-bold text-xl sm:text-2xl text-stone-900 tracking-tight leading-none group-hover:text-amber-700 transition-colors">
                UK FURNITURE HUB
              </div>
              <div className="text-[10px] tracking-widest uppercase font-semibold text-stone-500 mt-0.5">
                British Handcrafted Showroom
              </div>
            </div>
          </button>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search beds, corner sofas, sliding wardrobes, dining..."
                className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-sm rounded-full pl-10 pr-24 py-2.5 focus:bg-white focus:border-stone-800 focus:outline-hidden transition-all shadow-2xs"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              className="lg:hidden p-2 text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
              aria-label="Toggle search input"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* WhatsApp Quick Chat */}
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                'Hello UK Furniture Hub, I have an enquiry about your furniture catalogue.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-full text-xs font-semibold transition-colors shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp Showroom</span>
            </a>

            {/* Shopping Basket Button */}
            <button
              onClick={openBasket}
              className="relative flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-transform active:scale-95 shadow-md"
              aria-label={`Shopping Basket with ${basketCount} items`}
            >
              <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              <span className="hidden md:inline-block">Basket</span>
              {basketCount > 0 && (
                <span className="bg-amber-400 text-stone-950 text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center leading-none">
                  {basketCount}
                </span>
              )}
              {subtotal > 0 && (
                <span className="hidden xl:inline-block font-medium text-stone-300 pl-1 border-l border-stone-700">
                  {formatPrice(subtotal)}
                </span>
              )}
            </button>

            {/* Admin Portal Shortcut */}
            <button
              onClick={onOpenAdminLogin}
              className="p-2 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
              title="Admin Showroom Management"
              aria-label="Open Admin Showroom Management"
            >
              <UserCheck className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Search Expandable Bar */}
        {isSearchExpanded && (
          <div className="lg:hidden pb-4 pt-1">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search beds, sofas, wardrobes..."
                className="w-full bg-stone-100 border border-stone-300 text-stone-900 text-sm rounded-full pl-10 pr-20 py-2.5 focus:bg-white focus:border-stone-800 focus:outline-hidden"
                autoFocus
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-stone-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Desktop Horizontal Category Navigation */}
      <nav className="hidden lg:block bg-stone-100/80 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto py-2.5 text-xs font-semibold text-stone-700">
            {navLinks.map((item, idx) => {
              const isActive =
                (item.view === 'home' && currentView === 'home') ||
                (item.view === 'about' && currentView === 'about') ||
                (item.view === 'contact' && currentView === 'contact') ||
                (item.view === 'shop' && currentView === 'shop' && filters.category === (item.cat || 'all'));

              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (item.cat) {
                      handleCategoryClick(item.cat);
                    } else {
                      navigateTo(item.view);
                    }
                  }}
                  className={`px-3 py-1 rounded-md whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-stone-900 text-white font-bold'
                      : 'hover:text-stone-950 hover:bg-stone-200/70'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center font-serif font-bold text-sm">
                  UK
                </div>
                <span className="font-serif font-bold text-stone-900 text-lg">UK Furniture Hub</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-md text-stone-500 hover:text-stone-900"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 space-y-1 overflow-y-auto flex-1">
              <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-3 mb-2">
                Browse Collections
              </div>
              {navLinks.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (item.cat) {
                      handleCategoryClick(item.cat);
                    } else {
                      navigateTo(item.view);
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-stone-800 hover:bg-stone-100 transition-colors text-left"
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>
              ))}

              <div className="pt-4 mt-4 border-t border-stone-200">
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    'Hello UK Furniture Hub, I have an enquiry about your furniture catalogue.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm mb-2 shadow-xs"
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp Showroom</span>
                </a>

                <button
                  onClick={() => {
                    onOpenAdminLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-stone-100 text-stone-800 font-semibold text-sm"
                >
                  <UserCheck className="w-4 h-4 text-stone-600" />
                  <span>Admin Portal</span>
                </button>
              </div>
            </div>

            {/* Mobile Footer Drawer Support Info */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 text-xs text-stone-600 space-y-2">
              <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-stone-700" /> Free UK Delivery & Cash on Delivery
              </div>
              <div>Customer Support: {settings.whatsappNumber}</div>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};
