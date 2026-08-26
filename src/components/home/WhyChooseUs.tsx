import React from 'react';
import { Truck, ShieldCheck, Banknote, Award, CheckCircle2, PhoneCall, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const WhyChooseUs: React.FC = () => {
  const { settings, setIsAiModalOpen } = useStore();

  const reasons = [
    {
      icon: Banknote,
      color: 'text-emerald-500 bg-emerald-50 border-emerald-200',
      title: 'Cash on Delivery — 100% Risk Free',
      description:
        'Never pay for furniture sight unseen. Inspect the fabrics, stitching, and mechanisms in your home before handing payment directly in cash to our delivery driver.',
    },
    {
      icon: Truck,
      color: 'text-amber-500 bg-amber-50 border-amber-200',
      title: 'Free UK Home Delivery',
      description:
        'We provide free 2-man room-of-choice home delivery across England, Wales, and mainland Scotland. Our team calls you with a 2-hour arrival window on the day.',
    },
    {
      icon: ShieldCheck,
      color: 'text-sky-500 bg-sky-50 border-sky-200',
      title: 'Zero Deposit Required',
      description:
        'Order with total confidence. We do not require any upfront card payments, credit checks, or booking deposits. Place your order and pay only when satisfied.',
    },
    {
      icon: Award,
      color: 'text-purple-500 bg-purple-50 border-purple-200',
      title: 'British Fire Safety BS 5852',
      description:
        'Every bed frame, headboard, sofa, and mattress meets or exceeds UK Fire Safety Regulations (BS 5852 & BS 7177) with certified flame-retardant luxury fabrics.',
    },
    {
      icon: CheckCircle2,
      color: 'text-rose-500 bg-rose-50 border-rose-200',
      title: 'Handcrafted Timber Frames',
      description:
        'Our furniture is built using kiln-dried Scandinavian timber, reinforced steel bracket fittings, and heavy-duty gas struts designed for decades of durability.',
    },
    {
      icon: PhoneCall,
      color: 'text-teal-500 bg-teal-50 border-teal-200',
      title: 'Dedicated WhatsApp Service',
      description:
        `Direct 7-day communication with our British showroom team at ${settings.whatsappNumber}. Get fabric swatch photos, custom dimension guidance, and delivery updates instantly.`,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-stone-900 text-white relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 bg-amber-400/15 border border-amber-400/30 text-amber-300 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The UK Furniture Hub Guarantee</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Why British Homeowners Trust Us
          </h2>
          <p className="text-stone-400 text-sm sm:text-base mt-2 leading-relaxed">
            We are redefining furniture shopping across the United Kingdom by eliminating upfront risk,
            charging zero delivery fees, and prioritizing handcrafted British build quality.
          </p>
        </div>

        {/* 6 Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-stone-950/80 border border-stone-800 rounded-2xl p-6 sm:p-7 hover:border-amber-400/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.color} mb-5 group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-white mb-2 group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Assistant Callout Box */}
        <div className="mt-12 bg-linear-to-r from-stone-950 via-stone-900 to-stone-950 border border-amber-400/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold font-serif text-2xl shrink-0 shadow-md">
              Δ
            </div>
            <div>
              <h4 className="font-serif font-bold text-lg text-white">
                Unsure about room measurements or fabric choices?
              </h4>
              <p className="text-xs sm:text-sm text-stone-400 mt-0.5">
                Delta, our AI Furniture Advisor, can help you check dimensions, compare pocket spring mattresses, and recommend matching sets.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAiModalOpen(true)}
            className="shrink-0 bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold px-6 py-3 rounded-full text-xs sm:text-sm transition-all hover:scale-102 shadow-md flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Consult Delta Now</span>
          </button>
        </div>
      </div>
    </section>
  );
};
