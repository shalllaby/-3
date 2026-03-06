/**
 * Cart Store — Zustand with localStorage persistence.
 * Handles add, remove, update quantity, and clear cart.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    nameAr: string;
    nameEn: string;
    price: number;
    discountPrice?: number;
    image: string;
    sku: string;
    quantity: number;
    maxQuantity: number; // stockQuantity
}

interface CartState {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    // Computed values (selectors)
    itemCount: () => number;
    subtotal: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (newItem) => {
                set((state) => {
                    const existing = state.items.find((i) => i.id === newItem.id);
                    if (existing) {
                        // Increment quantity, respect max stock
                        return {
                            items: state.items.map((i) =>
                                i.id === newItem.id
                                    ? { ...i, quantity: Math.min(i.quantity + 1, i.maxQuantity) }
                                    : i,
                            ),
                        };
                    }
                    return { items: [...state.items, { ...newItem, quantity: 1 }] };
                });
            },

            removeItem: (id) =>
                set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

            updateQuantity: (id, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(id);
                    return;
                }
                set((state) => ({
                    items: state.items.map((i) =>
                        i.id === id ? { ...i, quantity: Math.min(quantity, i.maxQuantity) } : i,
                    ),
                }));
            },

            clearCart: () => set({ items: [] }),

            itemCount: () => get().items.reduce((acc, i) => acc + i.quantity, 0),

            subtotal: () =>
                get().items.reduce(
                    (acc, i) => acc + (i.discountPrice ?? i.price) * i.quantity,
                    0,
                ),
        }),
        {
            name: 'kuwait-store-cart', // localStorage key
            version: 1,
        },
    ),
);
