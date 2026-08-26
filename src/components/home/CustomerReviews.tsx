import React from 'react';
import { Star, CheckCircle, Quote, MapPin } from 'lucide-react';

export const CustomerReviews: React.FC = () => {
  const reviews = [
    {
      name: 'Charlotte & Mark Davies',
      location: 'Solihull, West Midlands',
      product: 'Ambassador Chesterfield Bed (King 5ft in Plush Grey)',
      rating: 5,
      date: '18 August 2026',
      review:
        'Outstanding quality and service from start to finish! Being able to pay cash on delivery gave us complete peace of mind. The bed is grand, solid timber, and the 54-inch headboard looks like it cost £2,000 in a high-street showroom. The 2-man delivery drivers carried it straight up to our master bedroom and took away all the packaging.',
    },
    {
      name: 'Dr. Tariq Mahmood',
      location: 'Didsbury, Manchester',
      product: 'Balmoral U-Shaped Velvet Suite (Steel Grey)',
      rating: 5,
      date: '14 August 2026',
      review:
        'The Balmoral U-shape fits our living room like a glove. Super comfortable foam seating and the fabric is extremely plush yet durable. The drivers called me 40 minutes before arrival as promised. Handed cash upon inspection with zero fuss. Would highly recommend UK Furniture Hub to anyone looking for genuine British craftsmanship.',
    },
    {
      name: 'Rebecca Thorne',
      location: 'Richmond, London',
      product: 'Kensington Motorized TV Lift Ottoman Bed (King Size)',
      rating: 5,
      date: '9 August 2026',
      review:
        'The electric TV lift mechanism is whisper-quiet and fits our 43-inch TV perfectly. The gas-lift ottoman storage underneath is immense — stored all our spare winter bedding with room to spare. Incredible value and free London delivery!',
    },
    {
      name: 'Gareth & Hannah Evans',
      location: 'Cardiff, Wales',
      product: 'Mayfair Mirrored 2-Door Sliding Wardrobe (203cm)',
      rating: 5,
      date: '3 August 2026',
      review:
        'We were looking for heavy mirrored sliding wardrobes for our new build. The German glide tracks are silky smooth and silent. Delivered on time with polite drivers. Absolutely five stars!',
    },
    {
      name: 'Fiona MacLeod',
      location: 'Edinburgh, Scotland',
      product: 'Cloud 3000 Natural Wool & Cashmere Pocket Mattress',
      rating: 5,
      date: '28 July 2026',
      review:
        'Best night’s sleep in years! The mattress is supportive yet deeply cushioned with natural wool. Free delivery all the way up to Edinburgh with zero extra surcharge. Top class British company.',
    },
    {
      name: 'Liam Henderson',
      location: 'Headingley, Leeds',
      product: 'Sorento Sintered Marble 6-Seater Dining Set',
      rating: 5,
      date: '22 July 2026',
      review:
        'The sintered stone table is gorgeous and completely scratch resistant when serving hot dishes. The lion knocker chairs are super comfortable. Thank you for wonderful customer care on WhatsApp!',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-stone-50 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-1 text-amber-500 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Loved by Over 12,000+ UK Homes
          </h2>
          <p className="text-stone-500 text-sm sm:text-base mt-2">
            Read real feedback from verified British customers who enjoy free delivery and cash on delivery peace of mind.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200/90 shadow-2xs hover:shadow-lg transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-stone-400">{item.date}</span>
                </div>

                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed mb-4 italic">
                  "{item.review}"
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                      <span>{item.name}</span>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" title="Verified UK Buyer" />
                    </div>
                    <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                  <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    Verified Buyer
                  </span>
                </div>

                <div className="mt-2 text-[11px] font-medium text-amber-800 truncate">
                  Purchased: {item.product}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
