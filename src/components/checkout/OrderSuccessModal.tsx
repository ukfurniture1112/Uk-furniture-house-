import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  CheckCircle2,
  Truck,
  Phone,
  Printer,
  Home,
  ShieldCheck,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { formatPrice, generateWhatsAppOrderUrl } from '../../utils/formatters';

export const OrderSuccessModal: React.FC = () => {
  const { lastPlacedOrder, clearLastPlacedOrder, navigateTo, settings } = useStore();

  if (!lastPlacedOrder) return null;

  const handleWhatsAppShare = () => {
    const url = generateWhatsAppOrderUrl(
      lastPlacedOrder.customer,
      lastPlacedOrder.items,
      lastPlacedOrder.total,
      settings.whatsappNumber
    );
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    clearLastPlacedOrder();
    navigateTo('home');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-stone-900 text-white p-6 sm:p-8 text-center relative">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-400/30 text-amber-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Order Confirmed • No Deposit Required</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Thank You for Your Order!
          </h2>

          <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-md mx-auto">
            Your furniture order has been sent to our British manufacturing & dispatch team.
          </p>

          <div className="mt-4 bg-stone-950/80 border border-stone-800 rounded-xl py-2 px-4 inline-block text-xs text-stone-300">
            Order Reference: <strong className="text-amber-400 font-mono text-sm">{lastPlacedOrder.orderNumber}</strong>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* 3 Next Steps Callout */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 space-y-3">
            <h4 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-700" />
              <span>What Happens Next:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-700">
              <div className="p-3 bg-white rounded-xl border border-amber-100">
                <strong className="block text-stone-900 mb-0.5">1. Route Scheduling</strong>
                Our team allocates your local 2-man delivery van and will confirm your delivery date.
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-100">
                <strong className="block text-stone-900 mb-0.5">2. Courtesy Call</strong>
                Driver calls you 30-45 minutes before arrival on delivery day.
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-100">
                <strong className="block text-stone-900 mb-0.5">3. Inspect & Pay Cash</strong>
                Pay {formatPrice(lastPlacedOrder.total)} in cash only after full room inspection.
              </div>
            </div>
          </div>

          {/* Customer & Delivery Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
              <span className="font-bold text-stone-500 uppercase tracking-wider block text-[10px]">
                Delivery Address
              </span>
              <div className="font-bold text-stone-900">{lastPlacedOrder.customer.fullName}</div>
              <div className="text-stone-600">{lastPlacedOrder.customer.address}</div>
              <div className="text-stone-600">
                {lastPlacedOrder.customer.city}, {lastPlacedOrder.customer.postcode}
              </div>
              <div className="text-stone-600">Phone: {lastPlacedOrder.customer.phone}</div>
              <div className="text-amber-800 font-semibold pt-1">
                Room: {lastPlacedOrder.customer.roomOfChoice}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
              <span className="font-bold text-stone-500 uppercase tracking-wider block text-[10px]">
                Payment & Total
              </span>
              <div className="flex items-center justify-between text-stone-600">
                <span>Method:</span>
                <span className="font-bold text-emerald-700">{lastPlacedOrder.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between text-stone-600">
                <span>Delivery:</span>
                <span className="font-bold text-emerald-700">FREE (£0.00)</span>
              </div>
              <div className="flex items-center justify-between text-stone-600 pt-1 border-t border-stone-200 text-sm font-bold text-stone-950">
                <span>Total Due on Arrival:</span>
                <span className="text-amber-900 font-serif text-lg">
                  {formatPrice(lastPlacedOrder.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Ordered Items List */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs text-stone-500 uppercase tracking-wider">
              Ordered Items
            </h4>
            <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl p-4 text-xs bg-stone-50/50">
              {lastPlacedOrder.items.map((item, idx) => (
                <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-stone-900">{item.product.name}</div>
                    <div className="text-stone-500 text-[11px]">
                      {item.selectedOptions.size} • {item.selectedOptions.colour}
                      {item.selectedOptions.mattress && ` • ${item.selectedOptions.mattress.name}`} x{item.quantity}
                    </div>
                  </div>
                  <div className="font-bold text-stone-900">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp Pre-loaded CTA */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h5 className="font-bold text-emerald-950 text-xs sm:text-sm flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Need fast priority WhatsApp confirmation?</span>
              </h5>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                Send your order reference directly to our WhatsApp team for immediate dispatch scheduling.
              </p>
            </div>

            <button
              onClick={handleWhatsAppShare}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-full shrink-0 shadow-xs flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Send to WhatsApp</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={handleClose}
              className="w-full sm:flex-1 bg-stone-900 hover:bg-stone-800 text-white font-bold py-3.5 rounded-xl text-xs sm:text-sm transition-transform active:scale-95 shadow-md flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Continue Shopping</span>
            </button>

            <button
              onClick={handlePrint}
              className="w-full sm:w-auto bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold py-3.5 px-5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 border border-stone-300"
            >
              <Printer className="w-4 h-4" />
              <span>Print Order Receipt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
