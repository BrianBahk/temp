import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Publication, CartItem } from '@/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (publication: Publication) => void;
  removeFromCart: (publicationId: string) => void;
  clearCart: () => void;
  updatePaymentMethod: (publicationId: string, method: 'card' | 'points' | 'mixed', pointsUsed?: number) => void;
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
  pointsEarned: number;
  pointsNeeded: number;
  cardTotal: number;
  getTotalPointsUsed: () => number;
  getTotalCardAmount: () => number;
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
      return [...prev, { 
        publication, 
        quantity: 1,
        paymentMethod: 'card',
        pointsUsed: 0,
      }];
    });
  }, []);

  const removeFromCart = useCallback((publicationId: string) => {
    setItems((prev) => prev.filter((item) => item.publication.id !== publicationId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const updatePaymentMethod = useCallback((publicationId: string, method: 'card' | 'points' | 'mixed', pointsUsed?: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.publication.id === publicationId
          ? { ...item, paymentMethod: method, pointsUsed: pointsUsed || 0 }
          : item
      )
    );
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

  // Calculate total points needed to pay with points only (100 points = $1)
  const pointsNeeded = items.reduce((acc, item) => {
    const itemTotal = item.publication.type === 'magazine'
      ? item.publication.price * 1.0825
      : item.publication.price;
    return acc + Math.ceil(itemTotal * 100);
  }, 0);

  const getTotalPointsUsed = useCallback(() => {
    return items.reduce((acc, item) => acc + (item.pointsUsed || 0), 0);
  }, [items]);

  const getTotalCardAmount = useCallback(() => {
    return items.reduce((acc, item) => {
      const itemWithTax = item.publication.type === 'magazine'
        ? item.publication.price * 1.0825
        : item.publication.price;
      const pointsUsed = item.pointsUsed || 0;
      const cardAmount = itemWithTax - (pointsUsed / 100);
      return acc + Math.max(0, cardAmount);
    }, 0);
  }, [items]);

  const cardTotal = useMemo(() => getTotalCardAmount(), [getTotalCardAmount]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        updatePaymentMethod,
        itemCount,
        subtotal,
        tax,
        total,
        pointsEarned,
        pointsNeeded,
        cardTotal,
        getTotalPointsUsed,
        getTotalCardAmount,
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
