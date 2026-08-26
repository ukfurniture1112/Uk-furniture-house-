import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Product,
  Category,
  StoreSettings,
  BasketItem,
  Order,
  FilterState,
  CategoryId,
  CustomerDetails,
} from '../types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_SETTINGS } from '../data/initialData';

export type AppView =
  | 'home'
  | 'shop'
  | 'product-detail'
  | 'checkout'
  | 'order-success'
  | 'about'
  | 'contact'
  | 'delivery-faq'
  | 'admin';

interface ToastState {
  message: string;
  type: 'success' | 'info' | 'error';
  id: number;
}

interface StoreContextType {
  products: Product[];
  categories: Category[];
  settings: StoreSettings;
  isLoading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;

  // Navigation
  currentView: AppView;
  selectedProduct: Product | null;
  lastOrder: Order | null;
  navigateTo: (view: AppView, product?: Product | null) => void;

  // Basket
  basket: BasketItem[];
  basketCount: number;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  isBasketOpen: boolean;
  openBasket: () => void;
  closeBasket: () => void;
  addToBasket: (
    product: Product,
    options: {
      colour: string;
      size: string;
      mattress?: { id: string; name: string; price: number };
      storage?: string;
      quantity?: number;
    }
  ) => void;
  removeFromBasket: (itemId: string) => void;
  updateBasketQuantity: (itemId: string, delta: number) => void;
  clearBasket: () => void;

  // Order Submission
  submitOrder: (customer: CustomerDetails, notes?: string) => Promise<{ success: boolean; order?: Order; error?: string }>;

  // Filtering & Search
  filters: FilterState;
  setCategoryFilter: (category: CategoryId | 'all') => void;
  setSearchQuery: (query: string) => void;
  setPriceRange: (min: number, max: number) => void;
  toggleSizeFilter: (size: string) => void;
  toggleColourFilter: (colour: string) => void;
  setInStockOnly: (val: boolean) => void;
  setOnSaleOnly: (val: boolean) => void;
  setSortBy: (sort: FilterState['sortBy']) => void;
  resetFilters: () => void;
  filteredProducts: Product[];

  // Toast
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: number) => void;

  // AI Assistant Modal Toggle
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
}

const defaultFilters: FilterState = {
  category: 'all',
  searchQuery: '',
  minPrice: 0,
  maxPrice: 2000,
  selectedSizes: [],
  selectedColours: [],
  inStockOnly: false,
  onSaleOnly: false,
  sortBy: 'featured',
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // View state
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  // Basket state
  const [basket, setBasket] = useState<BasketItem[]>(() => {
    try {
      const saved = localStorage.getItem('ukf_basket');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isBasketOpen, setIsBasketOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Toast state
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // AI Assistant
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Save basket to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ukf_basket', JSON.stringify(basket));
    } catch (e) {
      console.error('Failed to save basket to local storage', e);
    }
  }, [basket]);

  // Fetch live products, categories, and settings from Express backend
  const fetchStoreData = async () => {
    try {
      setIsLoading(true);
      const [prodRes, catRes, setRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/settings'),
      ]);

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (Array.isArray(prodData) && prodData.length > 0) {
          setProducts(prodData);
        }
      }

      if (catRes.ok) {
        const catData = await catRes.json();
        if (Array.isArray(catData) && catData.length > 0) {
          setCategories(catData);
        }
      }

      if (setRes.ok) {
        const setData = await setRes.json();
        if (setData && setData.businessName) {
          setSettings(setData);
        }
      }
    } catch (err: any) {
      console.warn('API fetch warning, using fallback state:', err?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreData();
  }, []);

  // Toast helper
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { message, type, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Navigation
  const navigateTo = (view: AppView, product?: Product | null) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (product !== undefined) {
      setSelectedProduct(product);
    }
    setCurrentView(view);
  };

  // Basket calculations
  const basketCount = useMemo(() => {
    return basket.reduce((sum, item) => sum + item.quantity, 0);
  }, [basket]);

  const subtotal = useMemo(() => {
    return basket.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [basket]);

  const deliveryCharge = useMemo(() => {
    return settings.defaultDeliveryCharge || 0; // FREE UK Home Delivery
  }, [settings.defaultDeliveryCharge]);

  const total = useMemo(() => {
    return subtotal + deliveryCharge;
  }, [subtotal, deliveryCharge]);

  // Basket actions
  const addToBasket = (
    product: Product,
    options: {
      colour: string;
      size: string;
      mattress?: { id: string; name: string; price: number };
      storage?: string;
      quantity?: number;
    }
  ) => {
    const quantity = options.quantity || 1;
    const basePrice = product.salePrice || product.price;
    const mattressExtra = options.mattress?.price || 0;
    const itemPrice = basePrice + mattressExtra;

    const uniqueItemId = `${product.id}-${options.size}-${options.colour}-${options.mattress?.id || 'none'}-${options.storage || 'none'}`;

    setBasket((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === uniqueItemId);
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += quantity;
        return copy;
      } else {
        const newItem: BasketItem = {
          id: uniqueItemId,
          productId: product.id,
          productName: product.name,
          productImage: product.images[0] || '',
          price: itemPrice,
          quantity,
          selectedColour: options.colour,
          selectedSize: options.size,
          selectedMattress: options.mattress,
          selectedStorage: options.storage,
        };
        return [...prev, newItem];
      }
    });

    showToast(`Added "${product.name}" to your basket!`, 'success');
  };

  const removeFromBasket = (itemId: string) => {
    setBasket((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Item removed from basket', 'info');
  };

  const updateBasketQuantity = (itemId: string, delta: number) => {
    setBasket((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as BasketItem[]
    );
  };

  const clearBasket = () => {
    setBasket([]);
  };

  const openBasket = () => setIsBasketOpen(true);
  const closeBasket = () => setIsBasketOpen(false);

  // Submit Order
  const submitOrder = async (customer: CustomerDetails, notes?: string) => {
    if (basket.length === 0) {
      return { success: false, error: 'Your basket is empty.' };
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          items: basket,
          subtotal,
          deliveryCharge,
          total,
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order.');
      }

      setLastOrder(data.order);
      clearBasket();
      closeBasket();
      navigateTo('order-success');
      showToast('Order successfully confirmed! Pay cash upon delivery.', 'success');
      return { success: true, order: data.order };
    } catch (err: any) {
      console.error('Order submission error:', err);
      showToast(err.message || 'Something went wrong while placing your order.', 'error');
      return { success: false, error: err.message };
    }
  };

  // Filter setters
  const setCategoryFilter = (category: CategoryId | 'all') => {
    setFilters((prev) => ({ ...prev, category }));
  };

  const setSearchQuery = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  };

  const setPriceRange = (min: number, max: number) => {
    setFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max }));
  };

  const toggleSizeFilter = (size: string) => {
    setFilters((prev) => {
      const exists = prev.selectedSizes.includes(size);
      const selectedSizes = exists
        ? prev.selectedSizes.filter((s) => s !== size)
        : [...prev.selectedSizes, size];
      return { ...prev, selectedSizes };
    });
  };

  const toggleColourFilter = (colour: string) => {
    setFilters((prev) => {
      const exists = prev.selectedColours.includes(colour);
      const selectedColours = exists
        ? prev.selectedColours.filter((c) => c !== colour)
        : [...prev.selectedColours, colour];
      return { ...prev, selectedColours };
    });
  };

  const setInStockOnly = (inStockOnly: boolean) => {
    setFilters((prev) => ({ ...prev, inStockOnly }));
  };

  const setOnSaleOnly = (onSaleOnly: boolean) => {
    setFilters((prev) => ({ ...prev, onSaleOnly }));
  };

  const setSortBy = (sortBy: FilterState['sortBy']) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // Filtered and sorted products computation
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category
        if (filters.category !== 'all' && product.category !== filters.category) {
          return false;
        }

        // Search Query
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase().trim();
          const matchesName = product.name.toLowerCase().includes(q);
          const matchesCategory = product.category.toLowerCase().includes(q);
          const matchesDescription = product.description.toLowerCase().includes(q);
          const matchesColour = product.availableColours.some((c) => c.toLowerCase().includes(q));
          const matchesSize = product.availableSizes.some((s) => s.toLowerCase().includes(q));
          const matchesFeatures = product.features.some((f) => f.toLowerCase().includes(q));

          if (!matchesName && !matchesCategory && !matchesDescription && !matchesColour && !matchesSize && !matchesFeatures) {
            return false;
          }
        }

        // Price range
        const effectivePrice = product.salePrice || product.price;
        if (effectivePrice < filters.minPrice || effectivePrice > filters.maxPrice) {
          return false;
        }

        // In Stock only
        if (filters.inStockOnly && !product.inStock) {
          return false;
        }

        // On Sale only
        if (filters.onSaleOnly && !product.salePrice) {
          return false;
        }

        // Sizes filter
        if (filters.selectedSizes.length > 0) {
          const hasSize = product.availableSizes.some((s) =>
            filters.selectedSizes.some((sel) => s.toLowerCase().includes(sel.toLowerCase()))
          );
          if (!hasSize) return false;
        }

        // Colours filter
        if (filters.selectedColours.length > 0) {
          const hasColour = product.availableColours.some((c) =>
            filters.selectedColours.some((sel) => c.toLowerCase().includes(sel.toLowerCase()))
          );
          if (!hasColour) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.salePrice || a.price;
        const priceB = b.salePrice || b.price;

        if (filters.sortBy === 'price-low') {
          return priceA - priceB;
        }
        if (filters.sortBy === 'price-high') {
          return priceB - priceA;
        }
        if (filters.sortBy === 'rating') {
          return b.rating - a.rating;
        }
        if (filters.sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        // 'featured'
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, filters]);

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        settings,
        isLoading,
        error,
        refreshProducts: fetchStoreData,
        currentView,
        selectedProduct,
        lastOrder,
        navigateTo,
        basket,
        basketCount,
        subtotal,
        deliveryCharge,
        total,
        isBasketOpen,
        openBasket,
        closeBasket,
        addToBasket,
        removeFromBasket,
        updateBasketQuantity,
        clearBasket,
        submitOrder,
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
        filteredProducts,
        toasts,
        showToast,
        removeToast,
        isAiModalOpen,
        setIsAiModalOpen,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
