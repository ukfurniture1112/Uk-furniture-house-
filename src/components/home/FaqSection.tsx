import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Phone, MessageCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface FaqItem {
  q: string;
  a: string;
  category: 'delivery' | 'payment' | 'products' | 'ordering';
}

export const FaqSection: React.FC = () => {
  const { settings, setIsAiModalOpen } = useStore();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      q: 'How does Cash on Delivery work? Is a deposit required?',
      a: 'We operate on a 100% risk-free Cash on Delivery policy with NO DEPOSIT required upfront. You place your order online or via WhatsApp. Our 2-man delivery team delivers the furniture to your room of choice. You inspect the item thoroughly to confirm quality, colour, and condition, and only then hand the cash payment to our driver.',
      category: 'payment',
    },
    {
      q: 'Is UK delivery really free with no hidden charges?',
      a: 'Yes, 100% Free UK Home Delivery applies to all orders across England, Wales, and mainland Scotland. The price you see on our website is the exact amount in GBP (£) you pay upon delivery. There are no hidden fuel surcharges or room handling fees.',
      category: 'delivery',
    },
    {
      q: 'How long does delivery take, and will I receive an arrival time?',
      a: 'Standard delivery across mainland UK takes between 3 to 7 working days. Once your route is scheduled, our transport office will notify you of your delivery date, and on the morning of delivery, our driver will give you a courtesy phone call with an approximate 2-hour arrival window.',
      category: 'delivery',
    },
    {
      q: 'Are your beds, sofas, and mattresses British Fire Safety compliant?',
      a: 'Yes, absolutely. All our upholstered bed frames, headboards, sofas, and foam/pocket mattresses are strictly manufactured in accordance with British Fire Safety Regulations (BS 5852 & BS 7177). All items carry official certification labels.',
      category: 'products',
    },
    {
      q: 'What mattress options are available for your beds?',
      a: 'Most of our beds can be ordered as Frame Only or paired with our discounted mattress packages, including 10" Orthopaedic Deep Quilted Spring Mattresses (+£120), 12" 2000 Pocket Sprung & Memory Foam Mattresses (+£190), or 14" Luxury Cloud Pillowtop Natural Cashmere Mattresses (+£260).',
      category: 'products',
    },
    {
      q: 'Can I add Gas-Lift Ottoman Storage to bed frames?',
      a: 'Yes! Our Ambassador, Kensington, and Monaco beds can be ordered with heavy-duty hydraulic gas-lift ottoman mechanisms (end-lift or side-lift), providing a massive dust-free underbed storage compartment ideal for spare duvets and pillows.',
      category: 'products',
    },
    {
      q: 'How do I check if a large corner sofa or wardrobe will fit my room?',
      a: 'Every product page lists exact measurements in both centimetres and feet/inches (Width, Height, and Depth). Our modular corner sofas and flat-packed sliding wardrobes are specially engineered to pass through standard UK doorways and staircases. You can also ask our AI Assistant Delta or WhatsApp team for access advice.',
      category: 'ordering',
    },
    {
      q: 'Can I place my order or send custom requirements via WhatsApp?',
      a: `Yes! You can contact our friendly UK showroom team anytime on WhatsApp at ${settings.whatsappNumber}. We can send fabric video clips, confirm bespoke dimensions, or take your order directly via chat.`,
      category: 'ordering',
    },
  ];

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 sm:py-20 bg-stone-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Frequently Asked Questions
          </h2>
          <p className="text-stone-500 text-sm mt-2">
            Everything you need to know about our handcrafted furniture, delivery routes, and Cash on Delivery.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-stone-900 hover:text-amber-800 transition-colors focus:outline-hidden"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-stone-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-amber-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-10 bg-amber-50/80 border border-amber-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-bold text-stone-900 text-sm sm:text-base">
              Still have a specific question about our furniture?
            </h4>
            <p className="text-xs text-stone-600 mt-0.5">
              Ask our AI sales assistant Delta or message our UK WhatsApp team for instant help.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-colors"
            >
              Ask Delta AI
            </button>
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-full transition-colors flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Support</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
