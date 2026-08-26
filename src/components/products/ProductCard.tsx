import React from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Star, Truck, ShieldCheck, ShoppingBag, Eye, Phone } from 'lucide-react';
import { formatPrice, generateWhatsAppProductEnquiryUrl } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigateTo, addToBasket, settings } = useStore();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultColour = product.availableColours[0] || 'Standard';
    const defaultSize = product.availableSizes[0] || 'Standard';
    const defaultMattress = product.hasMattressOption && product.mattressOptions ? product.mattressOptions[0] : undefined;

    addToBasket(product, {
      colour: defaultColour,
      size: defaultSize,
      mattress: defaultMattress ? { id: defaultMattress.id, name: defaultMattress.name, price: defaultMattress.additionalPrice } : undefined,
      quantity: 1,
    });
  };

  const handleWhatsAppEnquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = generateWhatsAppProductEnquiryUrl(
      product,
      settings.whatsappNumber,
      product.availableColours[0],
      product.availableSizes[0]
    );
    window.open(url, '_blank');
  };

  const discountPercent = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <div
      onClick={() => navigateTo('product-detail', product)}
      className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
    >
      {/* Badges Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {discountPercent > 0 && (
          <span className="bg-rose-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
            Save {discountPercent}%
          </span>
        )}
        {product.isBestSeller && (
          <span className="bg-amber-400 text-stone-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
            Best Seller
          </span>
        )}
        {product.isNewArrival && (
          <span className="bg-stone-900 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
            New Arrival
          </span>
        )}
      </div>

      {/* Cash on Delivery Mini-Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className="bg-white/95 backdrop-blur-xs text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs border border-emerald-200 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Cash on Delivery
        </span>
      </div>

      {/* Product Image Gallery */}
      <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Hover Quick Action Layer */}
        <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateTo('product-detail', product);
            }}
            className="bg-white hover:bg-stone-100 text-stone-900 p-2.5 rounded-full shadow-lg transition-transform hover:scale-110"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={handleWhatsAppEnquiry}
            className="bg-emerald-500 hover:bg-emerald-600 text-white p-2.5 rounded-full shadow-lg transition-transform hover:scale-110"
            title="Enquire on WhatsApp"
          >
            <Phone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="uppercase tracking-wider font-semibold text-[11px] text-stone-400">
              {product.category.replace('-', ' ')}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{product.rating}</span>
              <span className="text-stone-400 text-[11px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg group-hover:text-amber-800 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Key Specs snippet */}
          <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>

          {/* Colour swatch preview */}
          {product.availableColours && product.availableColours.length > 0 && (
            <div className="mt-3 flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-medium text-stone-400">Colours:</span>
              <span className="text-xs text-stone-700 font-medium truncate">
                {product.availableColours.slice(0, 3).join(', ')}
                {product.availableColours.length > 3 && ` +${product.availableColours.length - 3}`}
              </span>
            </div>
          )}
        </div>

        {/* Pricing & CTA */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-lg sm:text-xl text-stone-950">
                {formatPrice(product.salePrice || product.price)}
              </span>
              {product.salePrice && (
                <span className="text-xs text-stone-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
              <Truck className="w-3 h-3" /> Free UK Delivery
            </div>
          </div>

          <button
            onClick={handleQuickAdd}
            className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition-transform active:scale-95 shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
