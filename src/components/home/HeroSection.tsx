import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Truck, ShieldCheck, Banknote, Sparkles, ArrowRight, Phone, CheckCircle } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { navigateTo, settings, setIsAiModalOpen } = useStore();

  return (
    <div className="relative bg-stone-900 text-white overflow-hidden">
      {/* Background with Ambient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=80"
          alt="UK Furniture Hub Luxury Living Room"
          className="w-full h-full object-cover object-center opacity-35 filter brightness-90"
        />
        <div className="absolute inset-0 bg-linear-to-r from-stone-950 via-stone-950/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="max-w-2xl space-y-6">
          {/* Trust Banner Pill */}
          <div className="inline-flex items-center gap-2 bg-amber-400/15 border border-amber-400/30 text-amber-300 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>BRITISH HANDCRAFTED FURNITURE • 2026 COLLECTION</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Handcrafted Luxury Furniture, Delivered <span className="text-amber-400 italic">Free</span> Across the UK.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-stone-300 leading-relaxed">
            Upgrade your home with handcrafted Chesterfield beds, motorized TV beds, luxury U-shaped
            corner suites, and sliding wardrobes. Inspect in your room of choice and pay{' '}
            <strong className="text-white font-semibold underline decoration-emerald-400 decoration-2">
              Cash on Delivery
            </strong>{' '}
            with <strong className="text-white font-semibold">Zero Deposit Required</strong>.
          </p>

          {/* 4 Core UK Trust Bullet Points */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-stone-200 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Free UK Home Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Cash on Delivery (No Deposit)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>British BS 5852 Safety Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>2-Man Room of Choice Delivery</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <button
              onClick={() => navigateTo('shop')}
              className="flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold px-7 py-3.5 rounded-full text-sm sm:text-base transition-all shadow-lg hover:scale-102"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                'Hello UK Furniture Hub, I would like to enquire about your beds and sofas catalogue.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3.5 rounded-full text-sm sm:text-base transition-all shadow-lg hover:scale-102"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp: {settings.whatsappNumber}</span>
            </a>

            <button
              onClick={() => setIsAiModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-stone-800/90 hover:bg-stone-800 border border-stone-700 text-amber-300 font-semibold px-5 py-3.5 rounded-full text-sm transition-all hover:scale-102 backdrop-blur-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Ask Delta AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Trust Banner Strip at Base */}
      <div className="bg-stone-950/90 border-t border-stone-800/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-stone-800">
            <div className="flex items-center justify-center gap-2.5 px-2">
              <Truck className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="text-left">
                <div className="font-bold text-xs sm:text-sm text-white">Free UK Delivery</div>
                <div className="text-[11px] text-stone-400">Nationwide 2-man team</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2.5 px-2">
              <Banknote className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-left">
                <div className="font-bold text-xs sm:text-sm text-white">Cash on Delivery</div>
                <div className="text-[11px] text-stone-400">Pay upon inspection</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2.5 px-2">
              <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0" />
              <div className="text-left">
                <div className="font-bold text-xs sm:text-sm text-white">Zero Deposit</div>
                <div className="text-[11px] text-stone-400">No card required upfront</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2.5 px-2">
              <Sparkles className="w-5 h-5 text-purple-400 shrink-0" />
              <div className="text-left">
                <div className="font-bold text-xs sm:text-sm text-white">BS 5852 Safety</div>
                <div className="text-[11px] text-stone-400">UK fire compliant materials</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
