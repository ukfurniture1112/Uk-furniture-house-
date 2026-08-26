import React, { useState } from 'react';
import { Product, MattressOption } from '../../types';
import { useStore } from '../../context/StoreContext';
import {
  Truck,
  ShieldCheck,
  Banknote,
  Star,
  CheckCircle2,
  Phone,
  ShoppingBag,
  Sparkles,
  Award,
  ChevronRight,
  Plus,
  Minus,
  Ruler,
  Share2,
} from 'lucide-react';
import { formatPrice, generateWhatsAppProductEnquiryUrl } from '../../utils/formatters';
import { ProductCard } from './ProductCard';

interface ProductDetailPageProps {
  product: Product;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product }) => {
  const { addToBasket, navigateTo, openCheckout, products, settings, showToast, setIsAiModalOpen } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColour, setSelectedColour] = useState<string>(
    product.availableColours[0] || 'Standard'
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.availableSizes[0] || 'Standard'
  );
  const [selectedMattress, setSelectedMattress] = useState<MattressOption | undefined>(
    product.mattressOptions && product.mattressOptions.length > 0 ? product.mattressOptions[0] : undefined
  );
  const [selectedStorage, setSelectedStorage] = useState<string>(
    product.hasStorageOption && product.storageOptions ? product.storageOptions[0] : 'Standard Slat Base'
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'delivery' | 'safety' | 'reviews'>('specs');

  // Calculate customized unit price
  const basePrice = product.salePrice || product.price;
  const mattressExtra = selectedMattress?.additionalPrice || 0;
  const unitPrice = basePrice + mattressExtra;
  const totalPrice = unitPrice * quantity;

  const handleAddToBasket = () => {
    addToBasket(product, {
      colour: selectedColour,
      size: selectedSize,
      mattress: selectedMattress
        ? { id: selectedMattress.id, name: selectedMattress.name, price: selectedMattress.additionalPrice }
        : undefined,
      storage: selectedStorage,
      quantity,
    });
  };

  const handleOrderNow = () => {
    handleAddToBasket();
    openCheckout();
  };

  const handleWhatsAppEnquiry = () => {
    const url = generateWhatsAppProductEnquiryUrl(
      product,
      settings.whatsappNumber,
      selectedColour,
      selectedSize,
      selectedMattress?.name
    );
    window.open(url, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: `Check out ${product.name} on UK Furniture Hub with Free Delivery and Cash on Delivery!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'info');
    }
  };

  // Related products from same or related category
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.isFeatured))
    .slice(0, 4);

  return (
    <div className="bg-stone-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-6 overflow-x-auto whitespace-nowrap">
          <button onClick={() => navigateTo('home')} className="hover:text-stone-900 transition-colors">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => navigateTo('shop')} className="hover:text-stone-900 transition-colors">
            Collections
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-900 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Big Active Image */}
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-xs">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={`${product.name} - View ${activeImageIndex + 1}`}
                className="w-full h-full object-cover object-center"
              />

              {/* Tag Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.salePrice && (
                  <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Save {Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="bg-amber-400 text-stone-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Showroom Best Seller
                  </span>
                )}
              </div>

              {/* Top Right Share & Cash on Delivery Tag */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="bg-white/95 backdrop-blur-xs text-emerald-800 text-xs font-bold px-3 py-1 rounded-full shadow-xs border border-emerald-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Cash on Delivery
                </span>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-xs transition-colors"
                  title="Share product"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Thumbnails Row */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-16 sm:w-24 sm:h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIndex === idx
                        ? 'border-amber-500 ring-2 ring-amber-400/30'
                        : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* British Craftsmanship & BS 5852 Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-100 text-center">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                <Truck className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <div className="text-xs font-bold text-stone-900">Free UK Delivery</div>
                <div className="text-[10px] text-stone-500">2-man room placement</div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                <Banknote className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <div className="text-xs font-bold text-stone-900">Pay on Delivery</div>
                <div className="text-[10px] text-stone-500">Inspect before paying</div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                <Award className="w-5 h-5 text-sky-600 mx-auto mb-1" />
                <div className="text-xs font-bold text-stone-900">BS 5852 Certified</div>
                <div className="text-[10px] text-stone-500">UK fire safety compliant</div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                <ShieldCheck className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <div className="text-xs font-bold text-stone-900">0% Deposit</div>
                <div className="text-[10px] text-stone-500">No upfront charges</div>
              </div>
            </div>
          </div>

          {/* Right Column: Customization & Purchase Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-2 text-xs mb-2">
                <span className="uppercase font-bold tracking-wider text-amber-800">
                  {product.category.replace('-', ' ')}
                </span>
                <div className="flex items-center gap-1.5 text-amber-500">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-stone-900">{product.rating}</span>
                  <span className="text-stone-400">({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
                {product.name}
              </h1>

              {/* Description */}
              <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                {product.description}
              </p>

              {/* Pricing Display */}
              <div className="mt-4 p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                    Total In GBP (£)
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif font-bold text-2xl sm:text-3xl text-stone-950">
                      {formatPrice(totalPrice)}
                    </span>
                    {product.salePrice && (
                      <span className="text-sm text-stone-400 line-through">
                        {formatPrice((product.price + mattressExtra) * quantity)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                    <Truck className="w-3.5 h-3.5" /> Free UK Delivery
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1 font-medium">
                    Cash Payment upon Inspection
                  </div>
                </div>
              </div>

              {/* Size Selector */}
              {product.availableSizes && product.availableSizes.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-900 mb-2">
                    <span>1. Select Size / Configuration:</span>
                    <span className="text-amber-800">{selectedSize}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {product.availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`p-2.5 rounded-xl text-xs font-semibold border text-center transition-all ${
                          selectedSize === size
                            ? 'border-stone-950 bg-stone-900 text-white shadow-xs'
                            : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Fabric Colour Selector */}
              {product.availableColours && product.availableColours.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-900 mb-2">
                    <span>2. Select Fabric & Colour:</span>
                    <span className="text-amber-800">{selectedColour}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.availableColours.map((colour) => (
                      <button
                        key={colour}
                        onClick={() => setSelectedColour(colour)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                          selectedColour === colour
                            ? 'border-stone-950 bg-stone-900 text-white font-bold'
                            : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-400'
                        }`}
                      >
                        {colour}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mattress Package Options */}
              {product.hasMattressOption && product.mattressOptions && (
                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-900 mb-2">
                    <span>3. Choose Mattress Package:</span>
                    <span className="text-amber-800">{selectedMattress?.name || 'Frame Only'}</span>
                  </div>
                  <div className="space-y-2">
                    {product.mattressOptions.map((opt) => {
                      const isSelected = selectedMattress?.id === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => setSelectedMattress(opt)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'border-amber-600 bg-amber-50/70 ring-1 ring-amber-600'
                              : 'border-stone-200 hover:border-stone-300 bg-stone-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected ? 'border-amber-600 bg-amber-600' : 'border-stone-400'
                              }`}
                            >
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-stone-900">{opt.name}</div>
                              <div className="text-[11px] text-stone-500">{opt.description}</div>
                            </div>
                          </div>

                          <div className="text-xs font-bold text-stone-900 shrink-0">
                            {opt.additionalPrice === 0 ? 'Included' : `+${formatPrice(opt.additionalPrice)}`}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Storage Lift Options */}
              {product.hasStorageOption && product.storageOptions && (
                <div className="mt-6">
                  <div className="text-xs font-bold text-stone-900 mb-2">
                    <span>4. Base & Storage Configuration:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.storageOptions.map((storage) => (
                      <button
                        key={storage}
                        onClick={() => setSelectedStorage(storage)}
                        className={`p-2.5 rounded-xl text-xs font-medium border text-left transition-all ${
                          selectedStorage === storage
                            ? 'border-stone-950 bg-stone-900 text-white font-bold'
                            : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-400'
                        }`}
                      >
                        {storage}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mt-6 flex items-center gap-4">
                <span className="text-xs font-bold text-stone-900">Quantity:</span>
                <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-stone-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 text-stone-600 hover:bg-stone-200 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 font-bold text-xs text-stone-900 min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 text-stone-600 hover:bg-stone-200 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-stone-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToBasket}
                  className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold py-3.5 rounded-xl text-sm transition-transform active:scale-95 shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>Add to Basket</span>
                </button>

                <button
                  onClick={handleOrderNow}
                  className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold py-3.5 rounded-xl text-sm transition-transform active:scale-95 shadow-md"
                >
                  <Banknote className="w-4 h-4 text-stone-900" />
                  <span>Order with Cash on Delivery</span>
                </button>
              </div>

              {/* Direct WhatsApp Enquiry Button */}
              <button
                onClick={handleWhatsAppEnquiry}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl text-xs sm:text-sm transition-colors shadow-xs"
              >
                <Phone className="w-4 h-4" />
                <span>Enquire or Order on WhatsApp (+44 7862 600142)</span>
              </button>

              <div className="text-center">
                <button
                  onClick={() => setIsAiModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-amber-800 font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Have questions about fitting this in your room? Ask Delta AI</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Specs, Delivery, BS 5852 Safety & Customer Reviews */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs">
          {/* Tab Headers */}
          <div className="flex items-center gap-2 border-b border-stone-200 pb-4 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === 'specs'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Ruler className="w-3.5 h-3.5 inline mr-1.5" />
              Dimensions & Specifications
            </button>

            <button
              onClick={() => setActiveTab('delivery')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === 'delivery'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Truck className="w-3.5 h-3.5 inline mr-1.5" />
              Free UK Delivery & Placement
            </button>

            <button
              onClick={() => setActiveTab('safety')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === 'safety'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Award className="w-3.5 h-3.5 inline mr-1.5" />
              British Fire Safety (BS 5852)
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Star className="w-3.5 h-3.5 inline mr-1.5 text-amber-400 fill-amber-400" />
              Customer Reviews ({product.reviewCount})
            </button>
          </div>

          {/* Tab Content */}
          <div className="pt-6">
            {activeTab === 'specs' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900 mb-3">
                    Dimensions & Measurements
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                      <div className="text-xs text-stone-500 font-medium">Width</div>
                      <div className="text-base font-bold text-stone-900">{product.dimensions.width}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                      <div className="text-xs text-stone-500 font-medium">Length / Depth</div>
                      <div className="text-base font-bold text-stone-900">{product.dimensions.length}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                      <div className="text-xs text-stone-500 font-medium">Headboard / Unit Height</div>
                      <div className="text-base font-bold text-stone-900">{product.dimensions.height}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900 mb-3">
                    Key Features & Materials
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Free UK White-Glove 2-Man Delivery
                </h3>
                <p>
                  We provide 100% Free Home Delivery across England, Wales, and mainland Scotland.
                  Every item is delivered by our experienced 2-man transport team directly into your
                  room of choice.
                </p>
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                  <div className="font-bold text-stone-900">Delivery Checklist:</div>
                  <ul className="list-disc pl-5 space-y-1 text-stone-600">
                    <li>3 to 7 working day estimated delivery schedule</li>
                    <li>Courtesy driver phone call 30-45 minutes before arriving at your property</li>
                    <li>Placed into your room of choice (ground or upstairs)</li>
                    <li>Full inspection permitted before handing cash payment to driver</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'safety' && (
              <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  British Fire Safety Compliance (BS 5852 & BS 7177)
                </h3>
                <p>
                  All our upholstered furniture and mattress fillings strictly comply with the UK
                  Furniture and Furnishings (Fire Safety) Regulations 1988 (as amended in 1989, 1993, and 2010).
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                    <h4 className="font-bold text-stone-900 mb-1">BS 5852 (Upholstery)</h4>
                    <p className="text-stone-600 text-xs">
                      Cigarette and match resistant luxury velvet, chenille, and linen fabrics tested
                      against ignition sources.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                    <h4 className="font-bold text-stone-900 mb-1">BS 7177 (Mattresses)</h4>
                    <p className="text-stone-600 text-xs">
                      Low and medium hazard flammability standards for domestic British bedroom environments.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-900">
                      Verified Customer Feedback
                    </h3>
                    <div className="flex items-center gap-2 text-amber-500 text-xs font-bold mt-1">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>{product.rating} out of 5 stars based on {product.reviewCount} reviews</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-stone-900">Sarah Jenkins (Solihull)</span>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-stone-600">
                      "Absolutely stunning quality. Looks far more expensive than what we paid. The cash on delivery option made us feel completely secure."
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-stone-900">David M. (Manchester)</span>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-stone-600">
                      "Delivered within 4 days. The 2-man crew carried it straight into our bedroom. Great communication on WhatsApp!"
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
