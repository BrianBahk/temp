import React, { createContext, useContext, useState, useCallback } from 'react';
import { Publication, CartItem } from '@/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (publication: Publication) => void;
  removeFromCart: (publicationId: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
  pointsEarned: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((publication: Publication) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.publication.id === publication.id);
      if (existing) {
        return prev;
      }
      return [...prev, { publication, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((publicationId: string) => {
    setItems((prev) => prev.filter((item) => item.publication.id !== publicationId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.length;

  const subtotal = items.reduce((acc, item) => acc + item.publication.price, 0);

  // Magazines have 8.25% tax, newspapers have no tax
  const tax = items.reduce((acc, item) => {
    if (item.publication.type === 'magazine') {
      return acc + item.publication.price * 0.0825;
    }
    return acc;
  }, 0);

  const total = subtotal + tax;

  // Magazines give 10% points, newspapers give 20% points
  const pointsEarned = items.reduce((acc, item) => {
    const rate = item.publication.type === 'magazine' ? 0.1 : 0.2;
    return acc + Math.floor(item.publication.price * rate * 100);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        itemCount,
        subtotal,
        tax,
        total,
        pointsEarned,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
