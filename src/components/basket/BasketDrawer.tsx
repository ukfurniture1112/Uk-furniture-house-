import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  ArrowRight,
  ShoppingBag,
  Phone,
} from 'lucide-react';
import { formatPrice, generateWhatsAppOrderUrl } from '../../utils/formatters';

export const BasketDrawer: React.FC = () => {
  const {
    isBasketOpen,
    closeBasket,
    basket,
    removeFromBasket,
    updateBasketQuantity,
    clearBasket,
    subtotal,
    openCheckout,
    settings,
  } = useStore();

  if (!isBasketOpen) return null;

  const handleWhatsAppCheckout = () => {
    const url = generateWhatsAppOrderUrl(
      {
        fullName: 'Customer Enquiry',
        phone: '',
        address: '',
        city: '',
        postcode: '',
      },
      basket,
      subtotal,
      settings.whatsappNumber
    );
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center font-serif font-bold text-base">
              UK
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-stone-900">Your Basket</h2>
              <div className="text-[11px] text-stone-500 font-medium">
                {basket.length} {basket.length === 1 ? 'item' : 'items'} selected
              </div>
            </div>
          </div>

          <button
            onClick={closeBasket}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
            aria-label="Close basket"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Banner */}
        <div className="bg-emerald-50 px-4 py-2.5 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-1.5 font-bold">
            <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% Free UK Home Delivery Applied</span>
          </div>
          <span className="text-[10px] font-semibold bg-emerald-200/70 text-emerald-950 px-2 py-0.5 rounded-full">
            £0.00 Delivery
          </span>
        </div>

        {/* Basket Items List */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 divide-y divide-stone-100">
          {basket.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-900 mb-1">
                Your basket is empty
              </h3>
              <p className="text-xs text-stone-500 max-w-xs mb-6 leading-relaxed">
                Explore our handcrafted Chesterfield beds, TV lift beds, corner sofas, and sliding wardrobes.
              </p>
              <button
                onClick={closeBasket}
                className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-6 py-3 rounded-full transition-transform active:scale-95"
              >
                Browse Showroom Collection
              </button>
            </div>
          ) : (
            basket.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0 flex gap-3.5">
                {/* Product Thumbnail */}
                <div className="w-20 h-20 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-serif font-bold text-sm text-stone-900 leading-snug">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromBasket(item.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Selected Options Chips */}
                    <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-stone-600">
                      {item.selectedOptions.size && (
                        <span className="bg-stone-100 px-1.5 py-0.5 rounded-md font-medium">
                          Size: {item.selectedOptions.size}
                        </span>
                      )}
                      {item.selectedOptions.colour && (
                        <span className="bg-stone-100 px-1.5 py-0.5 rounded-md font-medium">
                          Colour: {item.selectedOptions.colour}
                        </span>
                      )}
                      {item.selectedOptions.mattress && (
                        <span className="bg-amber-100/80 text-amber-900 px-1.5 py-0.5 rounded-md font-semibold">
                          +{item.selectedOptions.mattress.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                      <button
                        onClick={() => updateBasketQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-stone-600 hover:bg-stone-200 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateBasketQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 text-stone-600 hover:bg-stone-200 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-sm font-bold text-stone-900">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Checkout CTA */}
        {basket.length > 0 && (
          <div className="p-5 bg-stone-50 border-t border-stone-200 space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-stone-600">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" /> Free UK Delivery
                </span>
                <span className="font-bold text-emerald-600">FREE (£0.00)</span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-sm font-bold text-stone-950">
                <span>Total (Pay on Delivery)</span>
                <span className="font-serif text-lg sm:text-xl text-amber-900">
                  {formatPrice(subtotal)}
                </span>
              </div>
            </div>

            {/* Cash on Delivery Notice */}
            <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-stone-200 text-[11px] text-stone-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Cash on Delivery:</strong> No card or deposit required. Pay upon delivery in cash.
              </span>
            </div>

            {/* Buttons */}
            <div className="space-y-2">
              <button
                onClick={openCheckout}
                className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold py-3.5 rounded-xl text-sm transition-transform active:scale-95 shadow-md"
              >
                <span>Proceed to Cash on Delivery Checkout</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={handleWhatsAppCheckout}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Order via WhatsApp ({settings.whatsappNumber})</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
              <button onClick={clearBasket} className="hover:text-rose-600 transition-colors">
                Clear Basket
              </button>
              <button onClick={closeBasket} className="hover:text-stone-900 font-semibold">
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
