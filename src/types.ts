export type CategoryId =
  | 'beds'
  | 'tv-beds'
  | 'divan-beds'
  | 'mattresses'
  | 'wardrobes'
  | 'sliding-wardrobes'
  | 'sofas'
  | 'corner-sofas'
  | 'u-shaped-sofas'
  | 'sofa-beds'
  | 'dining-tables'
  | 'dining-chairs'
  | 'dressing-tables'
  | 'chest-of-drawers'
  | 'bunk-beds'
  | 'garden-furniture'
  | 'other-furniture';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  image: string;
  itemCount?: number;
  popular?: boolean;
}

export interface ProductDimensions {
  width?: string;
  length?: string;
  height?: string;
  widthCm?: number;
  heightCm?: number;
  depthCm?: number;
  widthInches?: string;
  heightInches?: string;
  depthInches?: string;
  additionalInfo?: string;
}

export interface MattressOption {
  id: string;
  name: string;
  description: string;
  additionalPrice: number;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  category: CategoryId;
  price: number;
  salePrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  images: string[];
  description: string;
  features: string[];
  dimensions: ProductDimensions;
  availableColours: string[];
  availableSizes: string[];
  mattressOptions?: MattressOption[];
  hasMattressOption?: boolean;
  storageOptions?: string[];
  hasStorageOption?: boolean;
  headboardHeightCm?: number;
  ukFireSafetyCompliant?: boolean;
  deliveryTimeDays?: string;
  assemblyAvailable?: boolean;
  createdAt?: string;
}

export interface BasketItem {
  id: string;
  quantity: number;
  unitPrice?: number;
  price?: number;
  product?: Product;
  selectedOptions?: {
    colour?: string;
    size?: string;
    mattress?: {
      id: string;
      name: string;
      price: number;
    };
    storage?: string;
  };
  productId?: string;
  productName?: string;
  productImage?: string;
  selectedColour?: string;
  selectedSize?: string;
  selectedMattress?: {
    id: string;
    name: string;
    price: number;
  };
  selectedStorage?: string;
}

export type OrderStatus =
  | 'New'
  | 'Pending'
  | 'Confirmed'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod =
  | 'Cash on Delivery'
  | 'Bank Transfer'
  | 'WhatsApp Assisted';

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  townCity?: string;
  postcode: string;
  deliveryNotes?: string;
  preferredDeliveryDate?: string;
  roomOfChoice?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: CustomerDetails;
  items: BasketItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: PaymentMethod | string;
  status: OrderStatus;
  notes?: string;
  updatedAt?: string;
}

export interface StoreSettings {
  businessName: string;
  tagline: string;
  whatsappNumber: string;
  phone: string;
  email: string;
  address: string;
  announcementText: string;
  deliveryBannerText: string;
  currencySymbol: string;
  freeDeliveryThreshold: number;
  defaultDeliveryCharge: number;
  socialLinks: {
    tiktok?: string;
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
}

export interface AdminUser {
  id: string;
  username: string;
  email?: string;
  name: string;
  role: 'admin' | 'superadmin';
  securityEmail?: string;
  token?: string;
  permissions?: string[];
}

export interface FilterState {
  category: CategoryId | 'all';
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  selectedSizes: string[];
  selectedColours: string[];
  inStockOnly: boolean;
  onSaleOnly: boolean;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
}
