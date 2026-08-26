import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../products/ProductCard';
import { Sparkles, Flame, Clock, Bed, Sofa, ArrowRight } from 'lucide-react';

export const FeaturedSection: React.FC = () => {
  const { products, navigateTo, setCategoryFilter } = useStore();
  const [activeTab, setActiveTab] = useState<'featured' | 'bestsellers' | 'new' | 'beds' | 'sofas'>('featured');

  const getFilteredProducts = () => {
    switch (activeTab) {
      case 'bestsellers':
        return products.filter((p) => p.isBestSeller).slice(0, 8);
      case 'new':
        return products.filter((p) => p.isNewArrival).slice(0, 8);
      case 'beds':
        return products.filter((p) => p.category.includes('bed') || p.category === 'mattresses').slice(0, 8);
      case 'sofas':
        return products.filter((p) => p.category.includes('sofa')).slice(0, 8);
      case 'featured':
      default:
        return products.filter((p) => p.isFeatured).slice(0, 8);
    }
  };

  const displayedProducts = getFilteredProducts();

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handpicked Showroom Highlights</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">
              Featured British Furniture
            </h2>
            <p className="text-stone-500 text-sm mt-1 max-w-xl">
              Engineered with reinforced timber frames, high-density fillings, and luxurious upholstery
              certified to British Fire Safety BS 5852.
            </p>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('featured')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === 'featured'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Featured</span>
            </button>

            <button
              onClick={() => setActiveTab('bestsellers')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === 'bestsellers'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Best Sellers</span>
            </button>

            <button
              onClick={() => setActiveTab('new')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === 'new'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>New Arrivals</span>
            </button>

            <button
              onClick={() => setActiveTab('beds')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === 'beds'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Bed className="w-3.5 h-3.5 text-indigo-400" />
              <span>Beds & Mattresses</span>
            </button>

            <button
              onClick={() => setActiveTab('sofas')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === 'sofas'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Sofa className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sofas & Suites</span>
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        {displayedProducts.length === 0 ? (
          <div className="text-center py-16 bg-stone-50 rounded-2xl border border-stone-200">
            <p className="text-stone-500 text-sm">No items found in this section.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              setCategoryFilter('all');
              navigateTo('shop');
            }}
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold px-8 py-3.5 rounded-full text-sm transition-all hover:scale-102 shadow-md"
          >
            <span>Explore All {products.length} Products</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </section>
  );
};
