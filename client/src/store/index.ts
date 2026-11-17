import { create } from 'zustand';
import api from '../lib/api';
import toast from 'react-hot-toast';

// ── Types ─────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  avatar?: string;
}

export interface CartItem {
  _id?: string;
  productId?: string;
  product?: {
    _id: string;
    title?: string;
    name?: string;
    slug: string;
    images: { url: string; altText?: string; alt?: string }[];
    price?: number;
    basePrice?: number;
    variants?: any[];
  };
  title?: string;
  variantIndex?: number;
  size: string;
  color?: string;
  quantity: number;
  price: number;
  image?: string;
  sku?: string;
}

export interface Cart {
  _id: string;
  items: CartItem[];
  coupon?: any;
  couponCode?: string;
  discount?: number;
  couponDiscount?: number;
  subtotal?: number;
  total?: number;
}

// ── Auth Store ────────────────────────────────────────────────
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  setAuth: (user, token) => {
    localStorage.setItem('db_token', token);
    localStorage.setItem('db_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('db_token');
    localStorage.removeItem('db_user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadFromStorage: () => {
    const token = localStorage.getItem('db_token');
    const userStr = localStorage.getItem('db_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true });
      } catch {
        localStorage.removeItem('db_token');
        localStorage.removeItem('db_user');
      }
    }
  },
}));

// ── Cart Store ────────────────────────────────────────────────
interface AddToCartParams {
  productId: string;
  variantIndex?: number;
  size?: string;
  quantity?: number;
  title?: string;
  price?: number;
  image?: string;
  sku?: string;
}

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  fetchCart: () => Promise<void>;
  addToCart: (paramOrId: string | AddToCartParams, variantIndex?: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemIdOrProductId: string, sizeOrQty: string | number, qty?: number) => Promise<void>;
  removeFromCart: (productId: string, size?: string) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  clearCart: () => Promise<void>;
  getSubtotal: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isLoading: false,
  isDrawerOpen: false,

  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),

  fetchCart: async () => {
    try {
      set({ isLoading: true });
      const res: any = await api.get('/cart');
      const data = res.data?.data || res.data;
      if (data) {
        set({ cart: data });
      }
    } catch {
      // Cart fetch failure is silent for guests
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (paramOrId, variantIndex, quantity = 1) => {
    try {
      let payload: any = {};
      if (typeof paramOrId === 'string') {
        payload = { productId: paramOrId, variantIndex, quantity };
      } else {
        payload = {
          productId: paramOrId.productId,
          variantIndex: paramOrId.variantIndex,
          size: paramOrId.size,
          quantity: paramOrId.quantity || 1,
        };
      }

      const res: any = await api.post('/cart/add', payload);
      const updatedCart = res.data?.data || res.data;
      if (updatedCart) {
        set({ cart: updatedCart });
      }
      set({ isDrawerOpen: true });
    } catch (err: any) {
      // Optimistic local fallback if server offline or guest session
      if (typeof paramOrId !== 'string') {
        const currentCart = get().cart || { _id: 'local', items: [], couponDiscount: 0 };
        const existingIdx = currentCart.items.findIndex(
          (i) => (i.productId === paramOrId.productId || i.product?._id === paramOrId.productId) && i.size === paramOrId.size
        );
        let newItems = [...currentCart.items];
        if (existingIdx > -1) {
          newItems[existingIdx].quantity += (paramOrId.quantity || 1);
        } else {
          newItems.push({
            _id: `local-${Date.now()}`,
            productId: paramOrId.productId,
            title: paramOrId.title,
            size: paramOrId.size || 'M',
            price: paramOrId.price || 0,
            image: paramOrId.image || '',
            quantity: paramOrId.quantity || 1,
            sku: paramOrId.sku || '',
          });
        }
        set({ cart: { ...currentCart, items: newItems }, isDrawerOpen: true });
      } else {
        toast.error(err.response?.data?.message || err.message || 'Failed to add to cart');
        throw err;
      }
    }
  },

  updateQuantity: async (itemIdOrProductId, sizeOrQty, qty) => {
    const { cart } = get();
    if (!cart) return;

    if (typeof sizeOrQty === 'number') {
      // Called with (itemId, quantity)
      const itemId = itemIdOrProductId;
      const quantity = sizeOrQty;
      try {
        const res: any = await api.patch(`/cart/item/${itemId}`, { quantity });
        const updated = res.data?.data || res.data;
        if (updated) set({ cart: updated });
      } catch {
        // Local fallback
        const newItems = cart.items
          .map((i) => (i._id === itemId ? { ...i, quantity } : i))
          .filter((i) => i.quantity > 0);
        set({ cart: { ...cart, items: newItems } });
      }
    } else {
      // Called with (productId, size, quantity)
      const productId = itemIdOrProductId;
      const size = sizeOrQty;
      const quantity = qty || 1;
      const item = cart.items.find(
        (i) => (i.productId === productId || i.product?._id === productId) && i.size === size
      );
      if (item && item._id && !item._id.startsWith('local-')) {
        try {
          const res: any = await api.patch(`/cart/item/${item._id}`, { quantity });
          const updated = res.data?.data || res.data;
          if (updated) set({ cart: updated });
          return;
        } catch {
          // fallback to local
        }
      }
      const newItems = cart.items
        .map((i) =>
          (i.productId === productId || i.product?._id === productId) && i.size === size
            ? { ...i, quantity }
            : i
        )
        .filter((i) => i.quantity > 0);
      set({ cart: { ...cart, items: newItems } });
    }
  },

  removeFromCart: async (productId, size) => {
    const { cart } = get();
    if (!cart) return;
    const item = cart.items.find(
      (i) => (i.productId === productId || i.product?._id === productId) && (!size || i.size === size)
    );
    if (item && item._id && !item._id.startsWith('local-')) {
      try {
        await api.delete(`/cart/item/${item._id}`);
        const res: any = await api.get('/cart');
        const updated = res.data?.data || res.data;
        if (updated) set({ cart: updated });
        return;
      } catch {}
    }
    const newItems = cart.items.filter(
      (i) => !((i.productId === productId || i.product?._id === productId) && (!size || i.size === size))
    );
    set({ cart: { ...cart, items: newItems } });
  },

  removeItem: async (itemId) => {
    try {
      await api.delete(`/cart/item/${itemId}`);
      const res: any = await api.get('/cart');
      const updated = res.data?.data || res.data;
      if (updated) set({ cart: updated });
      toast.success('Item removed');
    } catch {
      const { cart } = get();
      if (cart) {
        set({ cart: { ...cart, items: cart.items.filter((i) => i._id !== itemId) } });
      }
    }
  },

  applyCoupon: async (code) => {
    const res: any = await api.post('/cart/coupon', { code });
    toast.success(res.data?.message || 'Coupon applied successfully');
    await get().fetchCart();
  },

  removeCoupon: async () => {
    await api.delete('/cart/coupon');
    await get().fetchCart();
    toast.success('Coupon removed');
  },

  clearCart: async () => {
    try {
      await api.delete('/cart');
    } catch {}
    set({ cart: null });
  },

  getSubtotal: () => {
    const { cart } = get();
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  },

  getTotal: () => {
    const { cart } = get();
    if (!cart) return 0;
    const subtotal = get().getSubtotal();
    const discount = cart.discount || cart.couponDiscount || 0;
    const shipping = subtotal >= 2500 || subtotal === 0 ? 0 : 150;
    return Math.max(0, subtotal - discount + shipping);
  },

  getItemCount: () => {
    const { cart } = get();
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));

// ── Wishlist Store ────────────────────────────────────────────
interface WishlistState {
  productIds: Set<string>;
  toggleWishlist: (productId: string) => Promise<void>;
  toggle: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  isWishlisted: (productId: string) => boolean;
  init: (ids: string[]) => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  productIds: new Set(),

  toggleWishlist: async (productId: string) => {
    const current = get().productIds;
    const next = new Set(current);
    if (next.has(productId)) {
      next.delete(productId);
    } else {
      next.add(productId);
    }
    set({ productIds: next });

    try {
      const { user } = useAuthStore.getState();
      if (user) {
        await api.post('/wishlist/toggle', { productId });
      }
    } catch {
      // optimistic state retained
    }
  },

  toggle: async (productId: string) => {
    await get().toggleWishlist(productId);
  },

  isInWishlist: (productId: string) => get().productIds.has(productId),
  isWishlisted: (productId: string) => get().productIds.has(productId),

  init: (ids) => set({ productIds: new Set(ids) }),
}));
