import React, { useState, useRef } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Settings,
  LogOut,
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Phone,
  CheckCircle,
  Truck,
  Clock,
  RotateCcw,
  Search,
  Filter,
  Eye,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Save,
  Users,
  KeyRound,
  Mail,
  ShieldAlert,
  Send,
  Printer,
  Sparkles,
  MapPin,
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  Wand2,
  Zap,
  Bot,
  Layers,
} from 'lucide-react';
import { Order, OrderStatus, Product, CategoryId } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { AdminStrategyAi } from './AdminStrategyAi';
import { AdminIntelligence } from './AdminIntelligence';
import { UK_SHOWROOM_PHOTO_PRESETS, ShowroomPhotoPreset } from '../../data/furniturePresets';

export const AdminDashboard: React.FC = () => {
  const {
    adminUser,
    logout,
    orders,
    customers,
    stats,
    updateOrderStatus,
    deleteOrder,
    deleteProduct,
    saveProduct,
    updateStoreSettings,
    updateSecurityCredentials,
    sendVerificationCode,
    resetDatabaseToDefaults,
  } = useAdmin();

  const { products, categories, settings, navigateTo, showToast } = useStore();

  const [activeTab, setActiveTab] = useState<
    'orders' | 'products' | 'intelligence' | 'strategy' | 'customers' | 'analytics' | 'security' | 'settings'
  >('intelligence');

  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Customer search
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');

  // Product Edit/Add State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingColoursStr, setEditingColoursStr] = useState('');
  const [editingSizesStr, setEditingSizesStr] = useState('');
  const [editingFeaturesStr, setEditingFeaturesStr] = useState('');

  // AI Auto-Listing & Image Upload State
  const [isAiListingLoading, setIsAiListingLoading] = useState(false);
  const [aiListingHint, setAiListingHint] = useState('');
  const [photoMode, setPhotoMode] = useState<'upload' | 'preset' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Store Settings Edit State
  const [settingsForm, setSettingsForm] = useState(settings);

  // Security Credentials Form
  const [adminEmailForm, setAdminEmailForm] = useState(adminUser?.email || 'ukfurniture1111@gmail.com');
  const [securityEmailForm, setSecurityEmailForm] = useState(
    adminUser?.securityEmail || 'piyarafawad36@gmail.com'
  );
  const [newPasswordForm, setNewPasswordForm] = useState('');
  const [isSendingTestOtp, setIsSendingTestOtp] = useState(false);
  const [lastTestOtp, setLastTestOtp] = useState<string | null>(null);

  // Filtered orders list
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = orderFilterStatus === 'all' || order.status === orderFilterStatus;
    const matchesSearch =
      orderSearchQuery.trim() === '' ||
      order.orderNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.customer.fullName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.customer.phone.includes(orderSearchQuery) ||
      order.customer.postcode.toLowerCase().includes(orderSearchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Filtered customers list
  const filteredCustomers = customers.filter((cust) => {
    const q = customerSearchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      cust.fullName.toLowerCase().includes(q) ||
      cust.phone.includes(q) ||
      cust.postcode.toLowerCase().includes(q) ||
      cust.address.toLowerCase().includes(q)
    );
  });

  const handleOpenAddProduct = () => {
    const newProd: Partial<Product> = {
      name: '',
      category: 'beds',
      price: 499,
      salePrice: 399,
      description: 'Handcrafted British furniture engineered for long-lasting luxury and comfort.',
      images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80'],
      availableColours: ['Plush Grey', 'Charcoal Velvet', 'Midnight Navy', 'Champagne Mink'],
      availableSizes: ['Double (4ft6)', 'King Size (5ft)', 'Super King (6ft)'],
      dimensions: { width: '160cm', length: '215cm', height: '137cm' },
      features: [
        'BS 5852 British Fire Safety Certified',
        'Solid hardwood reinforced frame',
        'Handcrafted in Yorkshire, UK',
        'Free 2-Man UK Home Delivery & Room Placement',
      ],
      inStock: true,
      rating: 5.0,
      reviewCount: 1,
      isFeatured: true,
      ukFireSafetyCompliant: true,
    };
    setEditingProduct(newProd);
    setEditingColoursStr(newProd.availableColours?.join(', ') || '');
    setEditingSizesStr(newProd.availableSizes?.join(', ') || '');
    setEditingFeaturesStr(newProd.features?.join('\n') || '');
    setAiListingHint('');
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct({ ...prod });
    setEditingColoursStr(prod.availableColours?.join(', ') || '');
    setEditingSizesStr(prod.availableSizes?.join(', ') || '');
    setEditingFeaturesStr(prod.features?.join('\n') || '');
    setAiListingHint('');
    setIsProductModalOpen(true);
  };

  // Image Upload File Handler (converts to base64 Data URLs so no manual URL input needed)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      if (!file.type.startsWith('image/')) {
        showToast('Please select valid image files (JPG, PNG, WebP).', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        const result = loadEvt.target?.result as string;
        if (result && editingProduct) {
          const currentImages = editingProduct.images || [];
          setEditingProduct((prev) => ({
            ...prev,
            images: [...currentImages, result],
          }));
          showToast('Image uploaded and added to listing.', 'success');
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePresetSelect = (preset: ShowroomPhotoPreset) => {
    if (!editingProduct) return;
    const currentImages = editingProduct.images || [];
    // If empty or only placeholder, replace; else append
    const isFirst = currentImages.length === 0 || currentImages[0].includes('placeholder');
    const newImages = isFirst ? [preset.imageUrl] : [...currentImages, preset.imageUrl];

    setEditingProduct((prev) => ({
      ...prev,
      images: newImages,
      category: (preset.category as CategoryId) || prev?.category,
    }));

    if (!editingProduct.name || editingProduct.name.trim() === '') {
      setEditingProduct((prev) => ({
        ...prev,
        name: preset.suggestedTitle,
        description: preset.description,
      }));
    }

    showToast(`Added ${preset.name} photo to listing.`, 'success');
  };

  const handleRemoveImage = (index: number) => {
    if (!editingProduct || !editingProduct.images) return;
    const updated = editingProduct.images.filter((_, i) => i !== index);
    setEditingProduct({ ...editingProduct, images: updated });
  };

  const handleSetPrimaryImage = (index: number) => {
    if (!editingProduct || !editingProduct.images || index === 0) return;
    const item = editingProduct.images[index];
    const rest = editingProduct.images.filter((_, i) => i !== index);
    setEditingProduct({ ...editingProduct, images: [item, ...rest] });
    showToast('Updated main listing photo.', 'success');
  };

  // AI Auto-Listing Generator (Generates full British furniture listing from image / hint)
  const handleAiAutoListingGenerate = async () => {
    if (!editingProduct) return;
    const currentImg = editingProduct.images?.[0] || '';
    const hint = aiListingHint.trim() || editingProduct.name || '';

    if (!currentImg && !hint) {
      showToast('Please upload an image or type a short title hint first.', 'error');
      return;
    }

    setIsAiListingLoading(true);
    showToast('Gemini AI is analyzing item & drafting complete British listing...', 'info');

    try {
      const res = await fetch('/api/admin/ai-auto-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: currentImg,
          titleHint: hint,
          categoryHint: editingProduct.category,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate listing');
      }

      const aiData = await res.json();

      setEditingProduct((prev) => ({
        ...prev,
        name: aiData.name || prev?.name,
        category: aiData.category || prev?.category || 'beds',
        price: aiData.price || prev?.price || 499,
        salePrice: aiData.salePrice || prev?.salePrice || 399,
        description: aiData.description || prev?.description,
        dimensions: aiData.dimensions || prev?.dimensions,
        inStock: true,
        ukFireSafetyCompliant: true,
      }));

      if (aiData.availableColours && Array.isArray(aiData.availableColours)) {
        setEditingColoursStr(aiData.availableColours.join(', '));
      }
      if (aiData.availableSizes && Array.isArray(aiData.availableSizes)) {
        setEditingSizesStr(aiData.availableSizes.join(', '));
      }
      if (aiData.features && Array.isArray(aiData.features)) {
        setEditingFeaturesStr(aiData.features.join('\n'));
      }

      showToast('✨ AI successfully auto-filled listing details!', 'success');
    } catch (err) {
      console.error('Error generating AI listing:', err);
      showToast('Could not complete AI auto-listing. Check internet connection.', 'error');
    } finally {
      setIsAiListingLoading(false);
    }
  };

  const handleSaveProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name) return;

    const payload: Partial<Product> = {
      ...editingProduct,
      availableColours: editingColoursStr
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean),
      availableSizes: editingSizesStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      features: editingFeaturesStr
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean),
    };

    const ok = await saveProduct(payload);
    if (ok) {
      setIsProductModalOpen(false);
      setEditingProduct(null);
    }
  };

  const handleSaveSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateStoreSettings(settingsForm);
  };

  const handleSaveSecurityCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSecurityCredentials(
      adminEmailForm,
      securityEmailForm,
      newPasswordForm ? newPasswordForm : undefined
    );
    setNewPasswordForm('');
  };

  const handleSendTestSecurityOtp = async () => {
    setIsSendingTestOtp(true);
    try {
      const res = await sendVerificationCode(adminEmailForm);
      if (res.success && res.previewCode) {
        setLastTestOtp(res.previewCode);
        showToast(`Test 2FA OTP [ ${res.previewCode} ] dispatched to ${securityEmailForm}`, 'success');
      }
    } catch {
      showToast('Failed to send test OTP', 'error');
    } finally {
      setIsSendingTestOtp(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 pb-16">
      {/* Top Admin Navbar */}
      <header className="bg-stone-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-serif font-bold text-xl shadow-sm">
                UK
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif font-bold text-base text-white">UK Furniture Hub</h1>
                  <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-amber-400" />
                    Master 2FA Active
                  </span>
                </div>
                <div className="text-[11px] text-stone-300">
                  Logged in as <strong className="text-amber-300">{adminUser?.email || 'ukfurniture1111@gmail.com'}</strong> • 2FA: {adminUser?.securityEmail || 'piyarafawad36@gmail.com'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateTo('home')}
                className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold px-3.5 py-2 rounded-xl border border-stone-700 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Storefront</span>
              </button>

              <button
                onClick={logout}
                className="flex items-center gap-1.5 bg-rose-900/80 hover:bg-rose-800 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors"
                title="Log out of Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Sub-bar with 6 Full-Access Sections */}
      <div className="bg-white border-b border-stone-200 shadow-2xs sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 text-xs font-bold scrollbar-none">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors ${
                activeTab === 'orders'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Package className="w-4 h-4 text-amber-400" />
              <span>Orders & Dispatches ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors ${
                activeTab === 'products'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-sky-400" />
              <span>Inventory Catalogue ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('intelligence')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors ${
                activeTab === 'intelligence'
                  ? 'bg-amber-500 text-stone-950 font-black shadow-md'
                  : 'text-amber-800 bg-amber-50/80 hover:bg-amber-100 border border-amber-200/70'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-900" />
              <span>🧠 Gemini AI Intelligence</span>
            </button>

            <button
              onClick={() => setActiveTab('strategy')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors ${
                activeTab === 'strategy'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Bot className="w-4 h-4 text-amber-400" />
              <span>💬 Strategy Copilot Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors ${
                activeTab === 'customers'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Customer Database ({customers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Financial Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors ${
                activeTab === 'security'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <KeyRound className="w-4 h-4 text-amber-500" />
              <span>Security & 2FA</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors ${
                activeTab === 'settings'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Settings className="w-4 h-4 text-purple-400" />
              <span>Store Configuration</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* KPI Metric Summary Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs">
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Total Sales Volume
            </div>
            <div className="font-serif font-bold text-2xl text-stone-900 mt-1">
              {formatPrice(stats.totalSales)}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Cash on Delivery Due
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs">
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Total Orders
            </div>
            <div className="font-serif font-bold text-2xl text-stone-900 mt-1">
              {stats.totalOrders}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              {stats.newOrders} New • {stats.outForDeliveryOrders} On Road
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs">
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Average Basket
            </div>
            <div className="font-serif font-bold text-2xl text-stone-900 mt-1">
              {formatPrice(stats.averageOrderValue)}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              Across British Homeowners
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs">
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Active Catalogue
            </div>
            <div className="font-serif font-bold text-2xl text-stone-900 mt-1">
              {products.length} Products
            </div>
            <div className="text-[11px] text-amber-700 font-semibold mt-1">
              {products.filter((p) => p.inStock).length} In Stock
            </div>
          </div>
        </div>

        {/* TAB 1: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Search & Filters */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search order #, customer name, postcode..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:bg-white focus:outline-hidden"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
                {['all', 'New', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilterStatus(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      orderFilterStatus === st
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {st === 'all' ? `All (${orders.length})` : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider font-bold border-b border-stone-200">
                    <tr>
                      <th className="p-4">Order Ref</th>
                      <th className="p-4">Customer & Delivery Postcode</th>
                      <th className="p-4">Ordered Items & Options</th>
                      <th className="p-4">Total (GBP)</th>
                      <th className="p-4">Status & Dispatch</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-stone-500">
                          No orders matched the current filter.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-stone-50/80 transition-colors">
                          <td className="p-4 font-mono font-bold text-stone-900">
                            {order.orderNumber}
                            <div className="text-[10px] text-stone-400 font-sans font-normal mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="font-bold text-stone-900">{order.customer.fullName}</div>
                            <div className="text-stone-500 text-[11px]">
                              {order.customer.city || order.customer.townCity},{' '}
                              <strong className="text-stone-800 uppercase">{order.customer.postcode}</strong>
                            </div>
                            <a
                              href={`tel:${order.customer.phone}`}
                              className="text-stone-600 text-[11px] hover:text-emerald-700 block mt-0.5 font-medium"
                            >
                              📞 {order.customer.phone}
                            </a>
                          </td>

                          <td className="p-4 max-w-xs">
                            <div className="space-y-1">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="text-stone-800 text-[11px]">
                                  <strong>{item.quantity}x</strong> {item.product?.name || item.productName || 'Furniture Item'}
                                  <span className="text-stone-500 block">
                                    Size: {item.selectedOptions?.size || item.selectedSize || 'Standard'} • Colour:{' '}
                                    {item.selectedOptions?.colour || item.selectedColour || 'Default'}
                                    {item.selectedOptions?.mattress && ` • Mattress: +${item.selectedOptions.mattress.name}`}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="font-serif font-bold text-sm text-stone-950">
                              {formatPrice(order.total)}
                            </div>
                            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                              💵 {order.paymentMethod}
                            </div>
                          </td>

                          <td className="p-4">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                              className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border focus:outline-hidden ${
                                order.status === 'New'
                                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                                  : order.status === 'Confirmed'
                                  ? 'bg-sky-50 text-sky-900 border-sky-300'
                                  : order.status === 'Out for Delivery'
                                  ? 'bg-purple-50 text-purple-900 border-purple-300'
                                  : order.status === 'Delivered'
                                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                  : 'bg-rose-50 text-rose-900 border-rose-300'
                              }`}
                            >
                              <option value="New">New Order</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>

                          <td className="p-4 text-right space-x-1.5">
                            {/* WhatsApp Customer Contact */}
                            <a
                              href={`https://wa.me/${order.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                `Hello ${order.customer.fullName}, UK Furniture Hub here regarding your order ${order.orderNumber}. We are preparing your delivery to ${order.customer.postcode}.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 hover:bg-emerald-200 p-2 rounded-lg transition-colors"
                              title="Chat with customer on WhatsApp"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>

                            {/* View Order Detail */}
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="inline-flex items-center gap-1 bg-stone-100 text-stone-800 hover:bg-stone-200 p-2 rounded-lg transition-colors"
                              title="View Order Details & Print Slip"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Order */}
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete order ${order.orderNumber}?`)) {
                                  deleteOrder(order.id);
                                }
                              }}
                              className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 hover:bg-rose-100 p-2 rounded-lg transition-colors"
                              title="Delete Order"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INVENTORY PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-xl text-stone-900">
                  Catalogue & Inventory ({products.length} Products)
                </h3>
                <p className="text-xs text-stone-500">
                  Add, edit prices, dimensions, colours, sizes, and BS 5852 certifications across all 17 UK categories.
                </p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-transform active:scale-95 shadow-sm"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Add New Product</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs flex flex-col justify-between"
                >
                  <div className="flex gap-3">
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-20 h-20 rounded-xl object-cover bg-stone-100 border border-stone-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                        {prod.category}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-stone-900 leading-snug mt-1 truncate">
                        {prod.name}
                      </h4>
                      <div className="font-bold text-stone-950 mt-1">
                        {formatPrice(prod.salePrice || prod.price)}
                        {prod.salePrice && (
                          <span className="text-xs text-stone-400 line-through ml-1.5 font-normal">
                            {formatPrice(prod.price)}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-1">
                        Sizes: {prod.availableSizes?.length || 0} • Colours: {prod.availableColours?.length || 0}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        prod.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {prod.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditProduct(prod)}
                        className="p-1.5 text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove "${prod.name}" from inventory?`)) {
                            deleteProduct(prod.id);
                          }
                        }}
                        className="p-1.5 text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: GEMINI ADMIN INTELLIGENCE */}
        {activeTab === 'intelligence' && (
          <div className="space-y-4">
            <AdminIntelligence />
          </div>
        )}

        {/* TAB 4: EXECUTIVE STRATEGY AI CHAT */}
        {activeTab === 'strategy' && (
          <div className="space-y-4">
            <AdminStrategyAi />
          </div>
        )}

        {/* TAB 4: CUSTOMER DATABASE */}
        {activeTab === 'customers' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-xl text-stone-900">
                  Customer Database ({customers.length} UK Clients)
                </h3>
                <p className="text-xs text-stone-500">
                  Aggregated homeowner contact details, delivery addresses, order counts, and lifetime values.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search customer, phone, postcode..."
                  value={customerSearchQuery}
                  onChange={(e) => setCustomerSearchQuery(e.target.value)}
                  className="w-full bg-white border border-stone-300 text-stone-900 text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-hidden"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider font-bold border-b border-stone-200">
                  <tr>
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Phone / WhatsApp</th>
                    <th className="p-4">Delivery Address & Postcode</th>
                    <th className="p-4">Total Orders</th>
                    <th className="p-4">Lifetime Spent</th>
                    <th className="p-4 text-right">Quick Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-stone-500">
                        No customer records found.
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((cust) => (
                      <tr key={cust.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="p-4 font-bold text-stone-900">
                          {cust.fullName}
                          <div className="text-[10px] text-stone-400 font-normal">
                            Last active: {new Date(cust.lastOrderDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="p-4 font-mono font-medium text-stone-800">
                          {cust.phone}
                        </td>
                        <td className="p-4 max-w-xs text-stone-700">
                          <div>{cust.address}</div>
                          <span className="font-bold text-stone-900 uppercase">{cust.postcode}</span>
                        </td>
                        <td className="p-4 font-bold text-stone-900">
                          {cust.totalOrders} order(s)
                        </td>
                        <td className="p-4 font-serif font-bold text-sm text-stone-950">
                          {formatPrice(cust.totalSpent)}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <a
                            href={`https://wa.me/${cust.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `Hello ${cust.fullName}, UK Furniture Hub here to assist with your furniture requirements.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold"
                          >
                            <Phone className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>

                          <a
                            href={`tel:${cust.phone}`}
                            className="inline-flex items-center gap-1 bg-stone-100 hover:bg-stone-200 text-stone-800 px-2.5 py-1.5 rounded-lg text-xs font-semibold"
                          >
                            <span>Call</span>
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: FINANCIAL & SALES ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Order Status Pipeline
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                    <span className="font-bold text-amber-900">New Orders (Pending Confirmation)</span>
                    <span className="font-bold text-stone-900 text-sm">{stats.newOrders}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-sky-50 rounded-xl">
                    <span className="font-bold text-sky-900">Confirmed Orders (Production/Loading)</span>
                    <span className="font-bold text-stone-900 text-sm">{stats.confirmedOrders}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                    <span className="font-bold text-purple-900">Out for Delivery (On Transport Vans)</span>
                    <span className="font-bold text-stone-900 text-sm">{stats.outForDeliveryOrders}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                    <span className="font-bold text-emerald-900">Delivered & Cash Collected</span>
                    <span className="font-bold text-stone-900 text-sm">{stats.deliveredOrders}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-rose-50 rounded-xl">
                    <span className="font-bold text-rose-900">Cancelled Orders</span>
                    <span className="font-bold text-stone-900 text-sm">{stats.cancelledOrders}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Cash Flow & Collection Summary
                </h3>
                <div className="p-5 rounded-2xl bg-stone-900 text-white space-y-2">
                  <div className="text-xs text-amber-300 uppercase tracking-wider font-bold">
                    Gross Cash on Delivery Value
                  </div>
                  <div className="font-serif font-bold text-3xl text-white">
                    {formatPrice(stats.totalSales)}
                  </div>
                  <p className="text-[11px] text-stone-400">
                    Collected directly upon delivery by 2-man transport delivery drivers.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1">
                  <div><strong>British Safety Compliance:</strong> 100% of beds, sofas and mattresses meet BS 5852 standards.</div>
                  <div><strong>Payment Terms:</strong> Zero upfront payment required from customers — 100% Cash on Delivery.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SECURITY & 2-FACTOR AUTHENTICATION (2FA) */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-500" />
                    <span>Admin Security & 2-Step Confirmation Settings</span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Configure master admin credentials and the destination email for 2FA confirmation security codes.
                  </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>2FA Active & Enforced</span>
                </div>
              </div>

              {/* Security info card */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-2">
                <div className="font-bold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-700" />
                  <span>Master Login Policy</span>
                </div>
                <p className="leading-relaxed">
                  When logging into the admin portal, entering your admin email and password triggers a 6-digit confirmation security code dispatched directly to{' '}
                  <strong className="underline font-semibold">{securityEmailForm}</strong>. Full access is granted only upon providing the matching code.
                </p>
              </div>

              {/* Form to update credentials */}
              <form onSubmit={handleSaveSecurityCredentials} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-stone-500" />
                      Admin Login Account Email
                    </label>
                    <input
                      type="email"
                      required
                      value={adminEmailForm}
                      onChange={(e) => setAdminEmailForm(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900 font-medium"
                    />
                    <span className="text-[11px] text-stone-500 mt-1 block">Default: ukfurniture1111@gmail.com</span>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1 flex items-center gap-1">
                      <Send className="w-3.5 h-3.5 text-amber-600" />
                      2FA Confirmation Code Recipient Email
                    </label>
                    <input
                      type="email"
                      required
                      value={securityEmailForm}
                      onChange={(e) => setSecurityEmailForm(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900 font-medium"
                    />
                    <span className="text-[11px] text-stone-500 mt-1 block">Verification code will be sent to: piyarafawad36@gmail.com</span>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1 flex items-center gap-1">
                      <KeyRound className="w-3.5 h-3.5 text-stone-500" />
                      Update Admin Password (Optional)
                    </label>
                    <input
                      type="password"
                      placeholder="Leave blank to keep ukfurniture2026"
                      value={newPasswordForm}
                      onChange={(e) => setNewPasswordForm(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900"
                    />
                  </div>
                </div>

                <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold px-6 py-2.5 rounded-xl transition-transform active:scale-95 shadow-sm"
                  >
                    <Save className="w-4 h-4 text-amber-400" />
                    <span>Save Security Configuration</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSendingTestOtp}
                    onClick={handleSendTestSecurityOtp}
                    className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-4 py-2.5 rounded-xl transition-colors text-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSendingTestOtp ? 'Dispatching...' : 'Test Send 2FA Code to Email'}</span>
                  </button>
                </div>
              </form>

              {lastTestOtp && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-center justify-between">
                  <div>
                    <strong>Last Generated 2FA Code:</strong>{' '}
                    <span className="font-mono text-sm font-bold bg-white px-2 py-1 rounded border border-emerald-300 ml-2">
                      {lastTestOtp}
                    </span>
                  </div>
                  <span className="text-emerald-700">Valid for 10 minutes</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: STORE CONFIGURATION & FACTORY SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs">
              <h3 className="font-serif font-bold text-lg text-stone-900 mb-4">
                Showroom & Delivery Configuration
              </h3>

              <form onSubmit={handleSaveSettingsSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Business Name</label>
                    <input
                      type="text"
                      value={settingsForm.businessName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, businessName: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      WhatsApp Dispatch Number
                    </label>
                    <input
                      type="text"
                      value={settingsForm.whatsappNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Showroom / Factory Telephone</label>
                    <input
                      type="text"
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Customer Support Email</label>
                    <input
                      type="email"
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-stone-700 mb-1">
                      Showroom / Distribution Hub Address
                    </label>
                    <input
                      type="text"
                      value={settingsForm.address}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-stone-700 mb-1">
                      Top Announcement Bar Text
                    </label>
                    <input
                      type="text"
                      value={settingsForm.announcementText}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, announcementText: e.target.value })
                      }
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900"
                    />
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold px-6 py-2.5 rounded-xl transition-transform active:scale-95 shadow-sm"
                  >
                    <Save className="w-4 h-4 text-amber-400" />
                    <span>Save Store Settings</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Reset entire catalogue, categories, and orders to UK Furniture Hub defaults?')) {
                        resetDatabaseToDefaults();
                      }
                    }}
                    className="flex items-center gap-1.5 text-rose-600 hover:text-rose-800 font-bold bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-xl transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset to UK Catalogue Defaults</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Product Add/Edit Modal */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 my-6 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-stone-900 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">
                    {editingProduct.id ? 'Edit Furniture Item' : 'Add New Furniture Product'}
                  </h3>
                  <div className="text-[11px] text-stone-400">
                    Add photos directly or use Gemini AI to auto-fill complete catalogue specs
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProductSubmit} className="p-6 space-y-6 text-xs overflow-y-auto flex-1">
              {/* ✨ GEMINI AI AUTO-LISTING GENERATOR BANNER */}
              <div className="bg-linear-to-r from-amber-500/15 via-amber-400/10 to-amber-500/5 p-4 rounded-2xl border border-amber-300/60 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                    <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
                    <span>Gemini AI Auto-Listing Generator</span>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                    UK Market Tuned
                  </span>
                </div>
                <p className="text-[11px] text-amber-900 leading-tight">
                  Upload an image below or enter a short hint. AI will automatically draft the British showroom title, optimal GBP pricing, fabric colours, standard UK sizes, and fire safety certification points.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={aiListingHint}
                    onChange={(e) => setAiListingHint(e.target.value)}
                    placeholder="Short hint (e.g. 'Ambassador Bed Plush Grey' or 'U-Shape Corner Sofa')..."
                    className="flex-1 bg-white border border-amber-300 rounded-xl px-3.5 py-2 text-stone-900 text-xs focus:outline-hidden focus:border-stone-800"
                  />
                  <button
                    type="button"
                    disabled={isAiListingLoading}
                    onClick={handleAiAutoListingGenerate}
                    className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-200 text-stone-950 font-black px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs shrink-0 text-xs"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>{isAiListingLoading ? 'AI Generating Listing...' : '✨ Auto-Fill with AI'}</span>
                  </button>
                </div>
              </div>

              {/* 📸 SMART PHOTO ATTACHMENT SECTION (NO URL ENTRY REQUIRED) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-stone-800 text-xs flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-stone-600" />
                    <span>Product Photography & Showroom Visuals</span>
                  </label>
                  <span className="text-[11px] text-stone-500">
                    {(editingProduct.images?.length || 0)} photo(s) attached
                  </span>
                </div>

                {/* Photo Mode Switcher */}
                <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl w-fit text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setPhotoMode('upload')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                      photoMode === 'upload'
                        ? 'bg-white text-stone-950 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload from Device</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPhotoMode('preset')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                      photoMode === 'preset'
                        ? 'bg-white text-stone-950 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Showroom Presets</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPhotoMode('url')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                      photoMode === 'url'
                        ? 'bg-white text-stone-950 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <span>Custom URL</span>
                  </button>
                </div>

                {/* Option 1: File Upload (Dropzone) */}
                {photoMode === 'upload' && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-stone-300 hover:border-amber-500 bg-stone-50 hover:bg-amber-50/30 rounded-2xl p-6 text-center cursor-pointer transition-colors space-y-2 group"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                    <div className="w-10 h-10 rounded-full bg-stone-200 group-hover:bg-amber-400 group-hover:text-stone-950 mx-auto flex items-center justify-center text-stone-600 transition-colors">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-stone-800 text-xs block">
                        Click or drag & drop furniture photos here
                      </span>
                      <span className="text-[11px] text-stone-500 block mt-0.5">
                        Supports high-res JPG, PNG, and WebP directly from your phone or computer
                      </span>
                    </div>
                  </div>
                )}

                {/* Option 2: Curated UK Showroom Preset Photos */}
                {photoMode === 'preset' && (
                  <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 space-y-2">
                    <div className="text-[11px] font-bold text-stone-600 mb-1">
                      Click any photo to attach high-definition British showroom photography:
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1">
                      {UK_SHOWROOM_PHOTO_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handlePresetSelect(preset)}
                          className="group relative rounded-xl overflow-hidden border border-stone-200 hover:border-amber-500 text-left bg-white transition-all hover:scale-102 shadow-2xs"
                        >
                          <img
                            src={preset.imageUrl}
                            alt={preset.name}
                            className="w-full h-16 object-cover"
                          />
                          <div className="p-1.5">
                            <div className="font-bold text-[10px] text-stone-900 truncate">
                              {preset.name}
                            </div>
                            <div className="text-[9px] text-stone-500 capitalize">{preset.category}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Option 3: Direct URL (Fallback) */}
                {photoMode === 'url' && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Paste image web address (e.g. https://...)"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = (e.target as HTMLInputElement).value.trim();
                          if (val && editingProduct) {
                            const cur = editingProduct.images || [];
                            setEditingProduct({ ...editingProduct, images: [...cur, val] });
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                      className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 text-xs"
                    />
                  </div>
                )}

                {/* Active Thumbnails List */}
                {editingProduct.images && editingProduct.images.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {editingProduct.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative group rounded-xl overflow-hidden border-2 border-stone-300 bg-stone-100 w-20 h-20 shadow-xs"
                      >
                        <img
                          src={imgUrl}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                        />
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 bg-stone-900/90 text-amber-300 text-[9px] font-black px-1.5 py-0.5 rounded-sm">
                            MAIN
                          </span>
                        )}

                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className="text-[9px] bg-white text-stone-900 px-1.5 py-0.5 rounded font-bold hover:bg-amber-400"
                            >
                              Make Main
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="text-[9px] bg-rose-600 text-white px-1.5 py-0.5 rounded font-bold hover:bg-rose-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* PRODUCT DETAILS FORM */}
              <div className="space-y-4 pt-2 border-t border-stone-200">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="e.g. Ambassador Wingback Ottoman Gas-Lift Storage Bed"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900 text-sm font-semibold focus:outline-hidden focus:border-stone-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Category</label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as CategoryId })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900 font-medium"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Regular Price (£ GBP)</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Sale Price (£ - Optional)</label>
                    <input
                      type="number"
                      value={editingProduct.salePrice || ''}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          salePrice: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                      placeholder="e.g. 399"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Showroom Description</label>
                  <textarea
                    rows={3}
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Available Fabrics & Colours (comma separated)
                    </label>
                    <input
                      type="text"
                      value={editingColoursStr}
                      onChange={(e) => setEditingColoursStr(e.target.value)}
                      placeholder="Plush Grey, Charcoal Velvet, Midnight Navy, Champagne Mink"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Available Sizes (comma separated)
                    </label>
                    <input
                      type="text"
                      value={editingSizesStr}
                      onChange={(e) => setEditingSizesStr(e.target.value)}
                      placeholder="Double (4ft6), King Size (5ft), Super King (6ft)"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Key Features & Guarantees (one per line)</label>
                  <textarea
                    rows={3}
                    value={editingFeaturesStr}
                    onChange={(e) => setEditingFeaturesStr(e.target.value)}
                    placeholder="BS 5852 British Fire Safety Certified&#10;Solid hardwood reinforced frame&#10;Free UK 2-man home delivery with room placement"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <label className="flex items-center gap-2 font-semibold text-stone-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.inStock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                      className="rounded"
                    />
                    <span>In Stock</span>
                  </label>

                  <label className="flex items-center gap-2 font-semibold text-stone-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isFeatured}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                      className="rounded"
                    />
                    <span>Featured Item</span>
                  </label>

                  <label className="flex items-center gap-2 font-semibold text-stone-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.ukFireSafetyCompliant ?? true}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, ukFireSafetyCompliant: e.target.checked })
                      }
                      className="rounded"
                    />
                    <span>BS 5852 Certified</span>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 text-stone-600 font-semibold hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-stone-900 hover:bg-stone-800 text-white font-bold px-6 py-2.5 rounded-xl shadow-xs transition-transform active:scale-95"
                >
                  Save Product to Catalogue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Detail & Packing Slip Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-stone-200 my-8 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Order Ref: {selectedOrder.orderNumber}
                </h3>
                <div className="text-[11px] text-stone-500">
                  Placed: {new Date(selectedOrder.createdAt).toLocaleString()}
                </div>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-stone-400 hover:text-stone-900">
                ✕
              </button>
            </div>

            <div className="text-xs space-y-3">
              <div className="p-3 bg-stone-50 rounded-xl space-y-1">
                <div className="font-bold text-stone-900">Delivery Recipient:</div>
                <div>{selectedOrder.customer.fullName}</div>
                <div>📞 {selectedOrder.customer.phone}</div>
                <div>
                  📍 {selectedOrder.customer.addressLine1 || selectedOrder.customer.address}, {selectedOrder.customer.city || selectedOrder.customer.townCity}
                </div>
                <div className="font-bold uppercase text-stone-900">Postcode: {selectedOrder.customer.postcode}</div>
                {selectedOrder.customer.roomOfChoice && (
                  <div>Room: <strong>{selectedOrder.customer.roomOfChoice}</strong></div>
                )}
                {selectedOrder.customer.deliveryNotes && (
                  <div className="text-amber-800">Notes: <em>{selectedOrder.customer.deliveryNotes}</em></div>
                )}
              </div>

              <div className="pt-2 border-t border-stone-100">
                <div className="font-bold text-stone-900 mb-1">Items to Dispatch:</div>
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="mt-1 p-2 bg-stone-50 rounded-lg flex justify-between">
                    <div>
                      <strong>{it.quantity}x</strong> {it.product?.name || it.productName}
                      <div className="text-[11px] text-stone-500">
                        {it.selectedOptions?.size || it.selectedSize} • {it.selectedOptions?.colour || it.selectedColour}
                        {it.selectedOptions?.mattress && ` (+${it.selectedOptions.mattress.name})`}
                      </div>
                    </div>
                    <div className="font-bold">{formatPrice((it.unitPrice || it.price || 0) * it.quantity)}</div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-stone-100 space-y-1">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Charge:</span>
                  <span>{selectedOrder.deliveryCharge === 0 ? 'FREE' : formatPrice(selectedOrder.deliveryCharge)}</span>
                </div>
                <div className="flex justify-between font-serif font-bold text-base text-stone-900 pt-1 border-t border-stone-200">
                  <span>Total Due on Delivery:</span>
                  <span className="text-emerald-800">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 flex gap-2">
              <a
                href={`https://wa.me/${selectedOrder.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hello ${selectedOrder.customer.fullName}, UK Furniture Hub here regarding your order ${selectedOrder.orderNumber}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs text-center flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp Customer</span>
              </a>

              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-stone-900 hover:bg-stone-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
