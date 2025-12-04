"use client";

import Link from 'next/link';
import { Trash2, ShoppingBag, ArrowRight, Gift } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Cart = () => {
  const { items, removeFromCart, clearCart, subtotal, tax, total, pointsEarned } = useCart();
  const { isAuthenticated, addPoints, addSubscription } = useAuth();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to complete your purchase');
      return;
    }

    // Mock checkout process
    items.forEach((item) => {
      const subscription = {
        id: `sub-${Date.now()}-${item.publication.id}`,
        publicationId: item.publication.id,
        publicationTitle: item.publication.title,
        type: item.publication.type,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'active' as const,
        orderNumber: `ORD-${Date.now()}`,
      };
      addSubscription(subscription);
    });

    addPoints(pointsEarned);
    clearCart();
    toast.success(`Order placed! You earned ${pointsEarned} points!`);
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container-narrow py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Your cart is empty
            </h1>
            <p className="text-muted-foreground mb-6">
              Start browsing our catalog to find your next great read.
            </p>
            <Link href="/catalog">
              <Button>
                Browse Catalog
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-narrow py-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const itemTax =
                item.publication.type === 'magazine'
                  ? item.publication.price * 0.0825
                  : 0;
              const itemTotal = item.publication.price + itemTax;
              const pointsRate = item.publication.type === 'magazine' ? 10 : 20;

              return (
                <div
                  key={item.publication.id}
                  className="bg-card rounded-xl border border-border p-4 flex gap-4"
                >
                  <img
                    src={item.publication.image}
                    alt={item.publication.title}
                    className="w-24 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {item.publication.title}
                        </h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {item.publication.type} • {item.publication.category}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          removeFromCart(item.publication.id);
                          toast.success('Item removed from cart');
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-reward">
                        <Gift className="w-3 h-3" />
                        <span>+{pointsRate}% points</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${itemTotal.toFixed(2)}</p>
                        {itemTax > 0 && (
                          <p className="text-xs text-muted-foreground">
                            incl. ${itemTax.toFixed(2)} tax
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
              <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-success">Free</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-3 border-t border-border">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-reward/10 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-reward">
                  <Gift className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    You'll earn {pointsEarned} points
                  </span>
                </div>
              </div>

              {isAuthenticated ? (
                <Button className="w-full" size="lg" onClick={handleCheckout}>
                  Complete Purchase
                </Button>
              ) : (
                <div className="space-y-3">
                  <Link href="/login">
                    <Button className="w-full" size="lg">
                      Sign In to Checkout
                    </Button>
                  </Link>
                  <p className="text-xs text-center text-muted-foreground">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-primary hover:underline">
                      Sign up
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
