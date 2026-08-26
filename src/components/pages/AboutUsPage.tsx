import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Truck,
  ShieldCheck,
  Award,
  HeartHandshake,
  Phone,
  Sparkles,
  CheckCircle2,
  MapPin,
  Clock,
} from 'lucide-react';

export const AboutUsPage: React.FC = () => {
  const { settings, navigateTo, setIsAiModalOpen } = useStore();

  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>British Handcrafted Heritage</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900">
            About UK Furniture Hub
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            We are a dedicated British furniture manufacturer and direct-to-consumer retailer.
            By eliminating expensive high-street showroom middlemen, we deliver bespoke, handcrafted
            beds, luxury corner suites, and sliding wardrobes straight from our UK workshop to your home.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-2xs space-y-6 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <h2 className="font-serif font-bold text-2xl text-stone-900">
            Our Mission: 100% Risk-Free British Furniture Shopping
          </h2>
          <p>
            For decades, buying luxury furniture across the UK meant paying large upfront deposits, waiting
            months for uncertain overseas shipping, and hoping that what arrived matched showroom expectations.
          </p>
          <p>
            At <strong>UK Furniture Hub</strong>, we turned that model upside down. We believe British homeowners
            deserve complete control and peace of mind. That is why we introduced our hallmark <strong>Cash on Delivery</strong> policy:
            you order with <strong>Zero Deposit</strong>, our 2-man team delivers into your room of choice, you inspect every stitch
            and timber join, and only then do you hand payment in cash to our driver.
          </p>

          {/* 4 Guarantees Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
              <Truck className="w-6 h-6 text-amber-600 mb-2" />
              <h3 className="font-bold text-stone-900 text-sm mb-1">Free UK Home Delivery</h3>
              <p className="text-stone-600 text-xs">
                Nationwide 2-man room-of-choice delivery across England, Wales, and mainland Scotland.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
              <ShieldCheck className="w-6 h-6 text-emerald-600 mb-2" />
              <h3 className="font-bold text-stone-900 text-sm mb-1">Inspect Before You Pay</h3>
              <p className="text-stone-600 text-xs">
                Zero upfront card deposits. If the furniture is not 100% to your liking, return it immediately with no penalty.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
              <Award className="w-6 h-6 text-sky-600 mb-2" />
              <h3 className="font-bold text-stone-900 text-sm mb-1">BS 5852 British Fire Safety</h3>
              <p className="text-stone-600 text-xs">
                Every fabric, foam layer, and pocket sprung unit strictly conforms to UK flammability standards.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
              <HeartHandshake className="w-6 h-6 text-purple-600 mb-2" />
              <h3 className="font-bold text-stone-900 text-sm mb-1">Reinforced Hardwood Timber</h3>
              <p className="text-stone-600 text-xs">
                Built to last with kiln-dried Scandinavian timber, solid steel brackets, and heavy-duty gas struts.
              </p>
            </div>
          </div>
        </div>

        {/* Workshop & Standards */}
        <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-10 space-y-6">
          <h2 className="font-serif font-bold text-2xl text-white">
            British Craftsmanship & Material Standards
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs sm:text-sm">
            <div>
              <div className="font-bold text-amber-400 text-base mb-1">Kiln-Dried Timber</div>
              <p className="text-stone-400 leading-relaxed">
                Selected for optimal moisture resistance, preventing frame squeaking or warping over decades of use.
              </p>
            </div>
            <div>
              <div className="font-bold text-amber-400 text-base mb-1">Commercial Gas Struts</div>
              <p className="text-stone-400 leading-relaxed">
                Ottoman storage beds feature 600N to 800N commercial gas-lift pistons that effortlessly lift heavy luxury mattresses.
              </p>
            </div>
            <div>
              <div className="font-bold text-amber-400 text-base mb-1">Easy Clean Fabrics</div>
              <p className="text-stone-400 leading-relaxed">
                Plush velvet, textured chenille, and boucle fabrics treated with stain-resistant coatings and certified to BS 5852.
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center space-y-4 pt-4">
          <h3 className="font-serif font-bold text-2xl text-stone-900">
            Have Questions for Our Showroom Team?
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigateTo('shop')}
              className="bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-full transition-transform active:scale-95 shadow-md"
            >
              Explore Furniture Catalogue
            </button>
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-full transition-transform active:scale-95 shadow-md flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp: {settings.whatsappNumber}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
