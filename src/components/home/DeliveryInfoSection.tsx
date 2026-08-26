import React from 'react';
import { Truck, Calendar, PhoneCall, CheckCircle, MapPin, PackageCheck, Banknote } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const DeliveryInfoSection: React.FC = () => {
  const { settings, navigateTo } = useStore();

  const steps = [
    {
      step: '01',
      title: 'Place Order with No Deposit',
      desc: 'Select your preferred size, fabric colour, and mattress options. Checkout in 60 seconds with zero upfront deposit.',
      icon: CheckCircle,
    },
    {
      step: '02',
      title: 'Handcrafted & Route Scheduled',
      desc: 'Our master craftsmen prepare your furniture. Our logistics dispatch team assigns your regional 2-man delivery van.',
      icon: Calendar,
    },
    {
      step: '03',
      title: '30-Min Driver Courtesy Call',
      desc: 'On the morning of delivery, our driver phones you with an exact arrival window so you never wait around all day.',
      icon: PhoneCall,
    },
    {
      step: '04',
      title: 'Room of Choice & Cash Payment',
      desc: 'Our 2-man crew brings items into your room of choice. Inspect every detail thoroughly and pay cash upon satisfaction.',
      icon: Banknote,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Truck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Complimentary White-Glove Service</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            How Our Free UK Home Delivery Works
          </h2>
          <p className="text-stone-500 text-sm sm:text-base mt-2">
            From our British workshop directly to your bedroom or living room with zero stress and zero upfront cost.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-stone-50 rounded-2xl p-6 border border-stone-200/80 shadow-2xs hover:border-amber-400/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif font-bold text-2xl text-stone-300 group-hover:text-amber-500">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-amber-700 shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-stone-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Delivery Coverage Highlight Bar */}
        <div className="mt-12 bg-stone-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base sm:text-lg text-white">
                Nationwide UK Postcode Delivery Coverage
              </h4>
              <p className="text-xs sm:text-sm text-stone-300 mt-0.5">
                We deliver weekly across Greater London, West Midlands, Greater Manchester, Yorkshire, Scotland & Wales.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('delivery-faq')}
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold px-5 py-2.5 rounded-full border border-stone-700 transition-colors"
            >
              Delivery FAQs
            </button>
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                'Hello UK Furniture Hub, could you please check delivery availability for my postcode?'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-5 py-2.5 rounded-full transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Check Postcode</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
