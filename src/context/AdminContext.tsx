import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { AdminUser, Order, OrderStatus, Product, StoreSettings } from '../types';
import { useStore } from './StoreContext';

interface AdminStats {
  totalOrders: number;
  newOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  outForDeliveryOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalSales: number;
  averageOrderValue: number;
}

export interface AdminCustomer {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  postcode: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  orders: string[];
}

interface AdminContextType {
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  orders: Order[];
  customers: AdminCustomer[];
  isLoadingOrders: boolean;
  isLoadingCustomers: boolean;
  sendVerificationCode: (
    email: string,
    password?: string
  ) => Promise<{ success: boolean; recipientEmail?: string; previewCode?: string; error?: string }>;
  verifySecurityCode: (code: string) => Promise<{ success: boolean; error?: string }>;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  fetchOrders: () => Promise<void>;
  fetchCustomers: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus, notes?: string) => Promise<boolean>;
  deleteOrder: (orderId: string) => Promise<boolean>;
  deleteProduct: (productId: string) => Promise<boolean>;
  saveProduct: (product: Partial<Product>) => Promise<boolean>;
  updateStoreSettings: (newSettings: Partial<StoreSettings>) => Promise<boolean>;
  updateSecurityCredentials: (
    email: string,
    securityEmail: string,
    password?: string
  ) => Promise<boolean>;
  resetDatabaseToDefaults: () => Promise<boolean>;
  stats: AdminStats;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showToast, refreshProducts } = useStore();

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('ukf_admin_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);

  const isAuthenticated = !!adminUser;

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true);
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error('Failed to fetch orders:', e);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      setIsLoadingCustomers(true);
      const res = await fetch('/api/admin/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (e) {
      console.error('Failed to fetch customers:', e);
    } finally {
      setIsLoadingCustomers(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      fetchCustomers();
    }
  }, [isAuthenticated]);

  // Send 2FA confirmation code to piyarafawad36@gmail.com
  const sendVerificationCode = async (email: string, password?: string) => {
    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch verification code');
      }

      showToast(
        `Confirmation code sent to ${data.securityEmail || 'piyarafawad36@gmail.com'}`,
        'info'
      );

      return {
        success: true,
        recipientEmail: data.securityEmail,
        previewCode: data.previewCode,
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to send security code' };
    }
  };

  // Verify 2FA confirmation code
  const verifySecurityCode = async (code: string) => {
    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid confirmation code');
      }

      setAdminUser(data.user);
      localStorage.setItem('ukf_admin_session', JSON.stringify(data.user));
      showToast('Master Admin Authenticated via 2FA Security!', 'success');
      fetchOrders();
      fetchCustomers();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Verification failed' };
    }
  };

  // Direct login
  const login = async (username: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      setAdminUser(data.user);
      localStorage.setItem('ukf_admin_session', JSON.stringify(data.user));
      showToast(`Welcome back, ${data.user.name}!`, 'success');
      fetchOrders();
      fetchCustomers();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  // Logout
  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem('ukf_admin_session');
    showToast('Logged out of Admin Panel', 'info');
  };

  // Update order status
  const updateOrderStatus = async (orderId: string, status: OrderStatus, notes?: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      const data = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === orderId || o.orderNumber === orderId ? data.order : o)));
      showToast(`Order status updated to "${status}"`, 'success');
      return true;
    } catch (e: any) {
      showToast(e.message || 'Error updating order', 'error');
      return false;
    }
  };

  // Delete order
  const deleteOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete order');

      setOrders((prev) => prev.filter((o) => o.id !== orderId && o.orderNumber !== orderId));
      showToast('Order deleted successfully', 'info');
      fetchCustomers();
      return true;
    } catch (e: any) {
      showToast(e.message || 'Error deleting order', 'error');
      return false;
    }
  };

  // Delete product
  const deleteProduct = async (productId: string) => {
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete product');

      await refreshProducts();
      showToast('Product removed from inventory', 'info');
      return true;
    } catch (e: any) {
      showToast(e.message || 'Error deleting product', 'error');
      return false;
    }
  };

  // Save/Edit product
  const saveProduct = async (productData: Partial<Product>) => {
    try {
      const isEdit = !!productData.id;
      const url = isEdit ? `/api/products/${productData.id}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!res.ok) throw new Error('Failed to save product');

      await refreshProducts();
      showToast(isEdit ? 'Product updated successfully' : 'New product created', 'success');
      return true;
    } catch (e: any) {
      showToast(e.message || 'Error saving product', 'error');
      return false;
    }
  };

  // Update store settings
  const updateStoreSettings = async (newSettings: Partial<StoreSettings>) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });

      if (!res.ok) throw new Error('Failed to update settings');

      await refreshProducts();
      showToast('Store settings saved successfully', 'success');
      return true;
    } catch (e: any) {
      showToast(e.message || 'Error updating settings', 'error');
      return false;
    }
  };

  // Update security credentials
  const updateSecurityCredentials = async (
    email: string,
    securityEmail: string,
    password?: string
  ) => {
    try {
      const res = await fetch('/api/auth/update-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, securityEmail, password }),
      });

      if (!res.ok) throw new Error('Failed to update credentials');

      showToast('Security and 2FA configuration updated', 'success');
      return true;
    } catch (e: any) {
      showToast(e.message || 'Error updating credentials', 'error');
      return false;
    }
  };

  // Reset database
  const resetDatabaseToDefaults = async () => {
    try {
      const res = await fetch('/api/settings/reset', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to reset database');

      await Promise.all([refreshProducts(), fetchOrders(), fetchCustomers()]);
      showToast('Database reset to UK Furniture catalogue defaults', 'success');
      return true;
    } catch (e: any) {
      showToast(e.message || 'Error resetting database', 'error');
      return false;
    }
  };

  // Stats
  const stats: AdminStats = useMemo(() => {
    const totalOrders = orders.length;
    const newOrders = orders.filter((o) => o.status === 'New').length;
    const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
    const confirmedOrders = orders.filter((o) => o.status === 'Confirmed').length;
    const outForDeliveryOrders = orders.filter((o) => o.status === 'Out for Delivery').length;
    const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;
    const cancelledOrders = orders.filter((o) => o.status === 'Cancelled').length;

    const nonCancelled = orders.filter((o) => o.status !== 'Cancelled');
    const totalSales = nonCancelled.reduce((sum, o) => sum + (o.total || 0), 0);
    const averageOrderValue = nonCancelled.length > 0 ? totalSales / nonCancelled.length : 0;

    return {
      totalOrders,
      newOrders,
      pendingOrders,
      confirmedOrders,
      outForDeliveryOrders,
      deliveredOrders,
      cancelledOrders,
      totalSales,
      averageOrderValue,
    };
  }, [orders]);

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        adminUser,
        orders,
        customers,
        isLoadingOrders,
        isLoadingCustomers,
        sendVerificationCode,
        verifySecurityCode,
        login,
        logout,
        fetchOrders,
        fetchCustomers,
        updateOrderStatus,
        deleteOrder,
        deleteProduct,
        saveProduct,
        updateStoreSettings,
        updateSecurityCredentials,
        resetDatabaseToDefaults,
        stats,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
