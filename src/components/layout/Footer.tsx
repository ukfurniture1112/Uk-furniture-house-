import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Phone,
  Mail,
  MapPin,
  Truck,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowUpRight,
  HeartHandshake,
} from 'lucide-react';
import { CategoryId } from '../../types';

export const Footer: React.FC = () => {
  const { settings, navigateTo, setCategoryFilter, setIsAiModalOpen } = useStore();

  const handleCategoryNav = (cat: CategoryId) => {
    setCategoryFilter(cat);
    navigateTo('shop');
  };

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800">
      {/* Top Value Proposition Grid */}
      <div className="border-b border-stone-800/80 bg-stone-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0 text-amber-400">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-base">Free UK Home Delivery</h4>
                <p className="text-stone-400 text-xs mt-1 leading-relaxed">
                  Complimentary 2-man room-of-choice delivery across England, Wales & mainland Scotland.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center shrink-0 text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-base">Cash on Delivery</h4>
                <p className="text-stone-400 text-xs mt-1 leading-relaxed">
                  Pay with cash when your furniture arrives and has been fully inspected by you.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-center shrink-0 text-sky-400">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-base">Zero Deposit Required</h4>
                <p className="text-stone-400 text-xs mt-1 leading-relaxed">
                  Order with total peace of mind. No advance payments or hidden processing fees.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-400/10 border border-rose-400/20 flex items-center justify-center shrink-0 text-rose-400">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-base">7-Day WhatsApp Support</h4>
                <p className="text-stone-400 text-xs mt-1 leading-relaxed">
                  Direct contact with our British showroom team on {settings.whatsappNumber}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-serif font-bold text-xl">
                UK
              </div>
              <div>
                <div className="font-serif font-bold text-xl text-white tracking-tight">
                  UK FURNITURE HUB
                </div>
                <div className="text-[10px] tracking-widest uppercase font-semibold text-amber-400">
                  British Showroom Excellence
                </div>
              </div>
            </div>

            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              UK Furniture Hub specializes in handcrafted Chesterfield beds, motorized TV lift beds,
              luxury U-shaped velvet suites, mirrored sliding wardrobes, and dining sets. Built in Great
              Britain to the highest BS 5852 fire-safety regulations.
            </p>

            <div className="pt-2">
              <button
                onClick={() => setIsAiModalOpen(true)}
                className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 border border-amber-400/30 text-amber-300 px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Speak with Delta (AI Furniture Advisor)</span>
              </button>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-b border-stone-800 pb-2">
              Popular Furniture
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => handleCategoryNav('beds')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Chesterfield & Winged Beds
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav('tv-beds')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Motorized TV Beds
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav('corner-sofas')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Corner & L-Shape Sofas
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav('u-shaped-sofas')}
                  className="hover:text-amber-300 transition-colors"
                >
                  U-Shaped Velvet Suites
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav('sliding-wardrobes')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Mirrored Sliding Wardrobes
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav('mattresses')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Pocket & Ortho Mattresses
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav('dining-tables')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Marble & Sintered Dining Sets
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service & FAQ */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-b border-stone-800 pb-2">
              Customer Information
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-amber-300 transition-colors">
                  About UK Furniture Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('delivery-faq')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Free UK Delivery Terms
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('delivery-faq')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Cash on Delivery Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('delivery-faq')}
                  className="hover:text-amber-300 transition-colors"
                >
                  British Fire Safety (BS 5852)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('delivery-faq')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Room Dimension Advice
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-amber-300 transition-colors">
                  Contact Our Showroom
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-b border-stone-800 pb-2">
              Get In Touch
            </h4>
            <ul className="space-y-3 text-xs text-stone-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors"
                >
                  {settings.whatsappNumber} (WhatsApp)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-sky-300 transition-colors">
                  {settings.email}
                </a>
              </li>
            </ul>

            {/* Social Links */}
            <div className="mt-6 pt-4 border-t border-stone-800">
              <div className="text-[11px] font-semibold text-stone-400 mb-2">Connect With Us</div>
              <div className="flex items-center gap-2">
                {settings.socialLinks.whatsapp && (
                  <a
                    href={settings.socialLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-stone-900 hover:bg-emerald-600 text-stone-300 hover:text-white transition-colors"
                    title="WhatsApp"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                )}
                {settings.socialLinks.facebook && (
                  <a
                    href={settings.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-blue-600 text-stone-300 hover:text-white text-xs font-semibold transition-colors"
                  >
                    Facebook
                  </a>
                )}
                {settings.socialLinks.instagram && (
                  <a
                    href={settings.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-pink-600 text-stone-300 hover:text-white text-xs font-semibold transition-colors"
                  >
                    Instagram
                  </a>
                )}
                {settings.socialLinks.tiktok && (
                  <a
                    href={settings.socialLinks.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold transition-colors"
                  >
                    TikTok
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="border-t border-stone-900 bg-stone-950 py-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} {settings.businessName}. All rights reserved. Registered UK Furniture Retailer.
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <span>Prices displayed in GBP (£)</span>
            <span>•</span>
            <span>Cash on Delivery</span>
            <span>•</span>
            <span>British Fire Safety BS 5852</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
