import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  Search,
  Check,
  ChevronDown,
} from 'lucide-react';
import { CategoryId } from '../../types';
import { formatPrice } from '../../utils/formatters';

export const ProductGrid: React.FC = () => {
  const {
    filteredProducts,
    categories,
    filters,
    setCategoryFilter,
    setSearchQuery,
    setPriceRange,
    toggleSizeFilter,
    toggleColourFilter,
    setInStockOnly,
    setOnSaleOnly,
    setSortBy,
    resetFilters,
  } = useStore();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const commonSizes = [
    'Single (3ft)',
    'Small Double (4ft)',
    'Double (4ft6)',
    'King Size (5ft)',
    'Super King (6ft)',
    'Corner / L-Shape',
    'U-Shape Large',
    '6-Seater',
  ];

  const commonColours = [
    'Plush Grey',
    'Charcoal',
    'Midnight Navy',
    'Champagne',
    'Emerald Green',
    'Black',
    'White',
    'Oak',
  ];

  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.searchQuery.trim() !== '' ||
    filters.minPrice > 0 ||
    filters.maxPrice < 2000 ||
    filters.selectedSizes.length > 0 ||
    filters.selectedColours.length > 0 ||
    filters.inStockOnly ||
    filters.onSaleOnly ||
    filters.sortBy !== 'featured';

  return (
    <div className="bg-stone-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header & Search Status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              {filters.category === 'all'
                ? 'All Furniture Collections'
                : categories.find((c) => c.id === filters.category)?.name || 'Furniture'}
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
              Showing {filteredProducts.length} handcrafted items • 100% Free UK Delivery • Cash on Delivery
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-white border border-stone-300 text-stone-800 px-4 py-2.5 rounded-xl text-xs font-bold shadow-2xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-stone-600" />
              <span>Filters ({filters.selectedSizes.length + filters.selectedColours.length + (filters.category !== 'all' ? 1 : 0)})</span>
            </button>

            {/* Sort Dropdown */}
            <div className="relative flex-1 sm:flex-none">
              <select
                value={filters.sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full sm:w-auto appearance-none bg-white border border-stone-300 text-stone-800 text-xs font-semibold rounded-xl pl-4 pr-9 py-2.5 focus:border-stone-800 focus:outline-hidden shadow-2xs"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="newest">Newest Arrivals</option>
              </select>
              <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Active Filter Badges */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap mb-6 bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs text-xs">
            <span className="font-semibold text-stone-500">Active Filters:</span>

            {filters.category !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-800 px-2.5 py-1 rounded-md font-medium">
                Category: {categories.find((c) => c.id === filters.category)?.name}
                <button onClick={() => setCategoryFilter('all')} className="hover:text-rose-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.searchQuery && (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-md font-medium">
                Search: "{filters.searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-rose-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.selectedSizes.map((size) => (
              <span
                key={size}
                className="inline-flex items-center gap-1 bg-stone-100 text-stone-800 px-2.5 py-1 rounded-md font-medium"
              >
                Size: {size}
                <button onClick={() => toggleSizeFilter(size)} className="hover:text-rose-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {filters.selectedColours.map((colour) => (
              <span
                key={colour}
                className="inline-flex items-center gap-1 bg-stone-100 text-stone-800 px-2.5 py-1 rounded-md font-medium"
              >
                Colour: {colour}
                <button onClick={() => toggleColourFilter(colour)} className="hover:text-rose-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {filters.inStockOnly && (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-md font-medium border border-emerald-200">
                In Stock Only
                <button onClick={() => setInStockOnly(false)} className="hover:text-rose-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.onSaleOnly && (
              <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 px-2.5 py-1 rounded-md font-medium border border-rose-200">
                On Sale
                <button onClick={() => setOnSaleOnly(false)} className="hover:text-rose-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 font-bold ml-auto"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
          </div>
        )}

        {/* Layout: Sidebar + Products */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            {/* Category Filter */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <h3 className="font-bold text-sm text-stone-900 mb-3 uppercase tracking-wider">
                Categories
              </h3>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg font-semibold transition-colors flex items-center justify-between ${
                    filters.category === 'all'
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <span>All Categories</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-between ${
                      filters.category === cat.id
                        ? 'bg-stone-900 text-white font-bold'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wider">
                  Price Range
                </h3>
                <span className="text-xs font-semibold text-amber-700">
                  {formatPrice(filters.minPrice)} - {formatPrice(filters.maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={filters.maxPrice}
                onChange={(e) => setPriceRange(filters.minPrice, Number(e.target.value))}
                className="w-full accent-stone-900 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] text-stone-400 mt-1">
                <span>£0</span>
                <span>£1,000</span>
                <span>£2,000+</span>
              </div>
            </div>

            {/* Sizes Filter */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <h3 className="font-bold text-sm text-stone-900 mb-3 uppercase tracking-wider">
                Sizes & Dimensions
              </h3>
              <div className="space-y-2">
                {commonSizes.map((size) => {
                  const isChecked = filters.selectedSizes.includes(size);
                  return (
                    <label
                      key={size}
                      className="flex items-center gap-2.5 text-xs text-stone-700 font-medium cursor-pointer hover:text-stone-950"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSizeFilter(size)}
                        className="rounded border-stone-300 text-stone-900 focus:ring-stone-800"
                      />
                      <span>{size}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Colours Filter */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <h3 className="font-bold text-sm text-stone-900 mb-3 uppercase tracking-wider">
                Popular Fabrics & Colours
              </h3>
              <div className="space-y-2">
                {commonColours.map((colour) => {
                  const isChecked = filters.selectedColours.includes(colour);
                  return (
                    <label
                      key={colour}
                      className="flex items-center gap-2.5 text-xs text-stone-700 font-medium cursor-pointer hover:text-stone-950"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleColourFilter(colour)}
                        className="rounded border-stone-300 text-stone-900 focus:ring-stone-800"
                      />
                      <span>{colour}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wider">
                Availability & Offers
              </h3>
              <label className="flex items-center gap-2.5 text-xs text-stone-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-stone-300 text-stone-900"
                />
                <span>In Stock Only</span>
              </label>
              <label className="flex items-center gap-2.5 text-xs text-stone-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.onSaleOnly}
                  onChange={(e) => setOnSaleOnly(e.target.checked)}
                  className="rounded border-stone-300 text-stone-900"
                />
                <span>Special Sale Offers</span>
              </label>
            </div>
          </aside>

          {/* Product Cards List */}
          <main className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 shadow-2xs">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4 text-stone-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-xl text-stone-900 mb-1">
                  No furniture matched your criteria
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mb-6">
                  Try clearing some filters or searching with different terms like "bed", "sofa", or "wardrobe".
                </p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-6 py-3 rounded-full transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Slide-over Modal */}
      {isMobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-stone-900" />
                <span className="font-bold text-stone-900 text-base">Filter Furniture</span>
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-md text-stone-500 hover:text-stone-900"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-5 space-y-6 overflow-y-auto flex-1 text-sm">
              {/* Category */}
              <div>
                <h4 className="font-bold text-stone-900 mb-2">Category</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setCategoryFilter('all')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                      filters.category === 'all' ? 'bg-stone-900 text-white font-bold' : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCategoryFilter(c.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                        filters.category === c.id ? 'bg-stone-900 text-white font-bold' : 'bg-stone-50 text-stone-700'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h4 className="font-bold text-stone-900 mb-2">Sizes</h4>
                <div className="space-y-2">
                  {commonSizes.map((size) => (
                    <label key={size} className="flex items-center gap-2 text-xs text-stone-700">
                      <input
                        type="checkbox"
                        checked={filters.selectedSizes.includes(size)}
                        onChange={() => toggleSizeFilter(size)}
                        className="rounded"
                      />
                      <span>{size}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center gap-3">
              <button
                onClick={resetFilters}
                className="flex-1 bg-white border border-stone-300 text-stone-800 text-xs font-bold py-3 rounded-xl"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 bg-stone-900 text-white text-xs font-bold py-3 rounded-xl"
              >
                View ({filteredProducts.length}) Items
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
