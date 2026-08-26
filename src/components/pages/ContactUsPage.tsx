import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { isValidUKPostcode, formatUKPostcode } from '../../utils/formatters';

export const ContactUsPage: React.FC = () => {
  const { settings, showToast, setIsAiModalOpen } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [postcodeCheck, setPostcodeCheck] = useState('');
  const [postcodeResult, setPostcodeResult] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      showToast('Please fill in your name, contact phone, and message', 'error');
      return;
    }

    showToast('Thank you! Your enquiry has been received. Our team will contact you shortly.', 'success');
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
  };

  const handleCheckPostcode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postcodeCheck.trim()) return;

    if (isValidUKPostcode(postcodeCheck)) {
      setPostcodeResult(
        `Good news! Free 2-Man Room-of-Choice Delivery is fully available for ${formatUKPostcode(
          postcodeCheck
        )}.`
      );
    } else {
      setPostcodeResult('Please enter a valid UK postcode (e.g. B1 1AA, M4 4BF, SW1A 1AA).');
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Phone className="w-3.5 h-3.5 text-amber-700" />
            <span>UK Customer Service</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Contact UK Furniture Hub
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-2">
            Our British showroom & logistics team is here to assist with fabric samples, room dimensions,
            custom sizes, and delivery schedules.
          </p>
        </div>

        {/* Contact Info + Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Contact Info & Postcode Checker */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
              <h3 className="font-serif font-bold text-xl text-white">Get in Touch</h3>

              <div className="space-y-4 text-xs sm:text-sm text-stone-300">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">WhatsApp & Helpline</strong>
                    <a
                      href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-300 hover:text-amber-200 font-mono text-sm"
                    >
                      {settings.whatsappNumber}
                    </a>
                    <div className="text-[11px] text-stone-400 mt-0.5">Available 7 Days a week</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Email Enquiries</strong>
                    <a href={`mailto:${settings.email}`} className="text-stone-300 hover:text-white">
                      {settings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Showroom & Workshop</strong>
                    <span>{settings.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Opening Hours (GMT)</strong>
                    <div>Monday – Saturday: 8:00am – 8:00pm</div>
                    <div>Sunday: 10:00am – 4:00pm</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-800">
                <button
                  onClick={() => setIsAiModalOpen(true)}
                  className="w-full bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 border border-stone-700 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Ask Delta (AI Design Specialist)</span>
                </button>
              </div>
            </div>

            {/* Postcode Coverage Widget */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-base">
                <Truck className="w-5 h-5 text-emerald-600" />
                <span>Check Free Delivery in Your Postcode</span>
              </div>
              <form onSubmit={handleCheckPostcode} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. B91 3QD, M4 4BF"
                  value={postcodeCheck}
                  onChange={(e) => setPostcodeCheck(e.target.value.toUpperCase())}
                  className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs uppercase font-bold"
                />
                <button
                  type="submit"
                  className="bg-stone-900 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-stone-800"
                >
                  Check
                </button>
              </form>
              {postcodeResult && (
                <div className="text-xs font-medium p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200">
                  {postcodeResult}
                </div>
              )}
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-2xs">
            <h3 className="font-serif font-bold text-xl text-stone-900 mb-4">
              Send a Showroom Enquiry
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. James Wilson"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-stone-900 text-sm focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    UK Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 07862 600142"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-stone-900 text-sm focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. james.wilson@example.co.uk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-stone-900 text-sm focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  How can we help? (Product enquiry, custom dimensions, delivery check){' '}
                  <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Please let us know what furniture items or fabrics you are interested in..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-stone-900 text-sm focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-3.5 rounded-xl text-sm transition-transform active:scale-95 shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>Send Showroom Enquiry</span>
                </button>
              </div>

              <div className="text-center text-[11px] text-stone-500 pt-1">
                We respect your privacy. You can also chat directly on WhatsApp at {settings.whatsappNumber}.
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
