import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItemType {
  id: string; // product id
  productId?: string;
  variantId?: string;
  variantLabel?: string;
  slug: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItemType[];
  savedItems: CartItemType[];
  addItem: (item: CartItemType) => void;
  removeItem: (id: string) => void;
  saveForLater: (id: string) => void;
  moveToCart: (id: string) => void;
  removeSavedItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      savedItems: [],
      addItem: (newItem) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === newItem.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === newItem.id
                  ? { ...i, quantity: Math.min(i.stock, i.quantity + newItem.quantity) }
                  : i
              ),
            };
          }
          return { items: [...state.items, newItem] };
        });
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },
      saveForLater: (id) => {
        set((state) => {
          const item = state.items.find((i) => i.id === id);
          if (!item) return state;

          const alreadySaved = state.savedItems.some((i) => i.id === id);
          return {
            items: state.items.filter((i) => i.id !== id),
            savedItems: alreadySaved ? state.savedItems : [...state.savedItems, item],
          };
        });
      },
      moveToCart: (id) => {
        set((state) => {
          const savedItem = state.savedItems.find((i) => i.id === id);
          if (!savedItem) return state;

          const existing = state.items.find((i) => i.id === id);
          return {
            items: existing
              ? state.items.map((item) => item.id === id
                ? { ...item, quantity: Math.min(item.stock, item.quantity + savedItem.quantity) }
                : item)
              : [...state.items, savedItem],
            savedItems: state.savedItems.filter((item) => item.id !== id),
          };
        });
      },
      removeSavedItem: (id) => {
        set((state) => ({
          savedItems: state.savedItems.filter((item) => item.id !== id),
        }));
      },
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.min(i.stock, Math.max(1, quantity)) } : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'amazon-cart-storage',
    }
  )
);
