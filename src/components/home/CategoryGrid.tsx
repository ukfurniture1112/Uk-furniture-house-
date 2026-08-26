import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CategoryId } from '../../types';
import { ArrowRight, Layers } from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  const { categories, setCategoryFilter, navigateTo } = useStore();

  const handleSelectCategory = (catId: CategoryId) => {
    setCategoryFilter(catId);
    navigateTo('shop');
  };

  return (
    <section className="py-16 bg-stone-50 border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 tracking-wider uppercase">
              <Layers className="w-3.5 h-3.5" />
              <span>Explore Showroom Categories</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 mt-1">
              Curated British Furniture Collections
            </h2>
          </div>

          <button
            onClick={() => {
              setCategoryFilter('all');
              navigateTo('shop');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-900 hover:text-amber-800 transition-colors self-start sm:self-auto group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleSelectCategory(category.id)}
              className="group relative rounded-2xl overflow-hidden bg-stone-900 aspect-4/3 cursor-pointer shadow-2xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Category Image */}
              <img
                src={category.image}
                alt={category.name}
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 opacity-80 group-hover:opacity-90"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-stone-950 via-stone-950/40 to-transparent" />

              {/* Category Label Content */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-col justify-end text-white">
                {category.popular && (
                  <span className="self-start bg-amber-400 text-stone-950 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1.5 shadow-xs">
                    Popular
                  </span>
                )}
                <h3 className="font-serif font-bold text-base sm:text-lg text-white group-hover:text-amber-300 transition-colors leading-snug">
                  {category.name}
                </h3>
                <p className="text-[11px] sm:text-xs text-stone-300 line-clamp-1 mt-0.5 opacity-90">
                  {category.description}
                </p>
                <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Browse Category</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
