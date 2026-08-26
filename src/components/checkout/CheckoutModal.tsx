import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  ShieldCheck,
  Truck,
  Banknote,
  Building,
  CheckCircle2,
  Phone,
  AlertCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { CustomerDetails, PaymentMethod } from '../../types';
import { formatPrice, isValidUKPostcode, formatUKPostcode } from '../../utils/formatters';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    closeCheckout,
    basket,
    subtotal,
    createOrder,
    settings,
  } = useStore();

  const [formData, setFormData] = useState<CustomerDetails>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postcode: '',
    deliveryNotes: '',
    preferredDeliveryDate: 'Standard (3-7 Working Days)',
    roomOfChoice: 'Ground Floor / Living Room',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isCheckoutOpen) return null;

  const validateForm = () => {
    const errs: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      errs.fullName = 'Please enter your full name';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'UK contact number is required for delivery driver call';
    } else if (formData.phone.replace(/[^0-9]/g, '').length < 10) {
      errs.phone = 'Please enter a valid UK telephone number (e.g. 07123 456789)';
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      errs.email = 'Please provide a valid email address for your order confirmation';
    }

    if (!formData.address.trim()) {
      errs.address = 'Please enter your street delivery address';
    }

    if (!formData.city.trim()) {
      errs.city = 'Please enter your town or city';
    }

    if (!formData.postcode.trim()) {
      errs.postcode = 'UK Postcode is required';
    } else if (!isValidUKPostcode(formData.postcode)) {
      errs.postcode = 'Please enter a valid UK postcode (e.g. B1 1AA, M4 4BF, SW1A 1AA)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePostcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setFormData({ ...formData, postcode: val });
    if (errors.postcode) {
      setErrors({ ...errors, postcode: '' });
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const cleanedPostcode = formatUKPostcode(formData.postcode);
      const cleanData = { ...formData, postcode: cleanedPostcode };

      await createOrder(cleanData, paymentMethod);
    } catch (err) {
      console.error('Order checkout failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 my-8">
        {/* Header */}
        <div className="bg-stone-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-serif font-bold text-lg">
              UK
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl text-white">UK Delivery & Checkout</h2>
              <div className="text-xs text-amber-300 flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Cash on Delivery • No Deposit Required
              </div>
            </div>
          </div>

          <button
            onClick={closeCheckout}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Free Delivery Promise Strip */}
        <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-3 flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2 font-bold">
            <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Complimentary 2-Man Delivery to Room of Choice Included</span>
          </div>
          <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            £0.00 Delivery Fee
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Customer Contact Info */}
          <div>
            <h3 className="font-serif font-bold text-base text-stone-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-amber-300 text-xs flex items-center justify-center font-sans font-bold">
                1
              </span>
              <span>Contact Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Charlotte Davies"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full bg-stone-50 border text-stone-900 text-sm rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-hidden ${
                    errors.fullName ? 'border-rose-500' : 'border-stone-300 focus:border-stone-800'
                  }`}
                />
                {errors.fullName && <p className="text-rose-600 text-[11px] mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  UK Mobile Telephone <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 07862 600142"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full bg-stone-50 border text-stone-900 text-sm rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-hidden ${
                    errors.phone ? 'border-rose-500' : 'border-stone-300 focus:border-stone-800'
                  }`}
                />
                <span className="text-[10px] text-stone-400">Driver will call 30 mins before arrival</span>
                {errors.phone && <p className="text-rose-600 text-[11px] mt-0.5">{errors.phone}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Email Address for Receipt & Updates <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. charlotte.davies@example.co.uk"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full bg-stone-50 border text-stone-900 text-sm rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-hidden ${
                    errors.email ? 'border-rose-500' : 'border-stone-300 focus:border-stone-800'
                  }`}
                />
                {errors.email && <p className="text-rose-600 text-[11px] mt-1">{errors.email}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: UK Delivery Address */}
          <div className="pt-4 border-t border-stone-200">
            <h3 className="font-serif font-bold text-base text-stone-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-amber-300 text-xs flex items-center justify-center font-sans font-bold">
                2
              </span>
              <span>UK Home Delivery Address</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Street Address (House Number & Street Name) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 42 Highfield Road, Flat 3B"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`w-full bg-stone-50 border text-stone-900 text-sm rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-hidden ${
                    errors.address ? 'border-rose-500' : 'border-stone-300 focus:border-stone-800'
                  }`}
                />
                {errors.address && <p className="text-rose-600 text-[11px] mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Town / City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Solihull, Birmingham"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={`w-full bg-stone-50 border text-stone-900 text-sm rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-hidden ${
                      errors.city ? 'border-rose-500' : 'border-stone-300 focus:border-stone-800'
                    }`}
                  />
                  {errors.city && <p className="text-rose-600 text-[11px] mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    UK Postcode <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B91 3QD"
                    value={formData.postcode}
                    onChange={handlePostcodeChange}
                    className={`w-full bg-stone-50 border text-stone-900 text-sm rounded-xl px-3.5 py-2.5 uppercase font-semibold tracking-wider focus:bg-white focus:outline-hidden ${
                      errors.postcode ? 'border-rose-500' : 'border-stone-300 focus:border-stone-800'
                    }`}
                  />
                  {errors.postcode && (
                    <p className="text-rose-600 text-[11px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.postcode}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Room of Choice Placement
                  </label>
                  <select
                    value={formData.roomOfChoice}
                    onChange={(e) => setFormData({ ...formData, roomOfChoice: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-medium rounded-xl px-3.5 py-2.5"
                  >
                    <option value="Ground Floor / Living Room">Ground Floor / Living Room</option>
                    <option value="1st Floor Master Bedroom">1st Floor Master Bedroom</option>
                    <option value="2nd Floor / Attic Bedroom">2nd Floor / Attic Bedroom</option>
                    <option value="Apartment with Lift">Apartment with Lift</option>
                    <option value="Apartment via Stairs">Apartment via Stairs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Preferred Delivery Timeline
                  </label>
                  <select
                    value={formData.preferredDeliveryDate}
                    onChange={(e) => setFormData({ ...formData, preferredDeliveryDate: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs font-medium rounded-xl px-3.5 py-2.5"
                  >
                    <option value="Standard (3-7 Working Days)">Standard (3-7 Working Days)</option>
                    <option value="Weekend Delivery Preferred (Saturday/Sunday)">
                      Weekend Delivery Preferred (Saturday/Sunday)
                    </option>
                    <option value="Urgent Dispatch Request (2-4 Days)">
                      Urgent Dispatch Request (2-4 Days)
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Delivery Notes / Access Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Narrow hallway, please call 40 minutes ahead, parking available on private driveway..."
                  value={formData.deliveryNotes}
                  onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs rounded-xl p-3 focus:bg-white focus:border-stone-800 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="pt-4 border-t border-stone-200">
            <h3 className="font-serif font-bold text-base text-stone-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-stone-900 text-amber-300 text-xs flex items-center justify-center font-sans font-bold">
                3
              </span>
              <span>Select Payment Method</span>
            </h3>

            <div className="space-y-3">
              {/* Cash on Delivery (Recommended) */}
              <div
                onClick={() => setPaymentMethod('Cash on Delivery')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/30'
                    : 'border-stone-200 bg-stone-50 hover:border-stone-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full border border-emerald-600 flex items-center justify-center mt-0.5 shrink-0 bg-white">
                      {paymentMethod === 'Cash on Delivery' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-stone-900">
                          Cash on Delivery (No Deposit Required)
                        </h4>
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Recommended
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        Pay £{subtotal.toFixed(2)} in cash directly to our 2-man delivery driver once your
                        furniture has arrived and has been inspected by you.
                      </p>
                    </div>
                  </div>
                  <Banknote className="w-6 h-6 text-emerald-600 shrink-0" />
                </div>
              </div>

              {/* Direct Bank Transfer (BACS) */}
              <div
                onClick={() => setPaymentMethod('Bank Transfer')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'Bank Transfer'
                    ? 'border-stone-900 bg-stone-100 ring-2 ring-stone-900/20'
                    : 'border-stone-200 bg-stone-50 hover:border-stone-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full border border-stone-600 flex items-center justify-center mt-0.5 shrink-0 bg-white">
                      {paymentMethod === 'Bank Transfer' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-stone-900" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-stone-900">
                        Direct Bank Transfer (BACS Faster Payment)
                      </h4>
                      <p className="text-xs text-stone-600 mt-1">
                        Receive bank transfer instructions via email and WhatsApp upon order placement.
                      </p>
                    </div>
                  </div>
                  <Building className="w-6 h-6 text-stone-600 shrink-0" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Order Summary Table */}
          <div className="pt-4 border-t border-stone-200 bg-stone-50 p-4 rounded-2xl">
            <h4 className="font-bold text-xs text-stone-500 uppercase tracking-wider mb-2">
              Order Summary ({basket.length} items)
            </h4>

            <div className="space-y-2 divide-y divide-stone-200 text-xs">
              {basket.map((item) => (
                <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-stone-900">{item.product.name}</span>
                    <span className="text-stone-500 ml-1.5">
                      ({item.selectedOptions.size}, {item.selectedOptions.colour}
                      {item.selectedOptions.mattress ? `, ${item.selectedOptions.mattress.name}` : ''}) x{item.quantity}
                    </span>
                  </div>
                  <span className="font-bold text-stone-900">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}

              <div className="pt-2 flex items-center justify-between text-stone-600">
                <span>Free UK Home Delivery</span>
                <span className="font-bold text-emerald-600">FREE (£0.00)</span>
              </div>

              <div className="pt-2 flex items-center justify-between text-base font-bold text-stone-950">
                <span>Total Due on Delivery</span>
                <span className="font-serif text-xl text-amber-900">{formatPrice(subtotal)}</span>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-500 text-white font-bold py-4 rounded-2xl text-base transition-transform active:scale-98 shadow-xl"
            >
              {isSubmitting ? (
                <span>Securing Your Delivery Route...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Confirm Order ({formatPrice(subtotal)} - Pay on Delivery)</span>
                </>
              )}
            </button>

            <div className="text-center text-[11px] text-stone-500 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero Risk Guarantee • 100% British Quality • Free Returns on Inspection</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
