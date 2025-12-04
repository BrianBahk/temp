"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowRight, Gift, Coins } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Cart = () => {
  const {
    items,
    removeFromCart,
    clearCart,
    subtotal,
    tax,
    total,
    pointsEarned,
  } = useCart();
  const { isAuthenticated, user, addPoints, addSubscription } = useAuth();
  const [pointsToUse, setPointsToUse] = useState(0);

  const availablePoints = user?.points || 0;
  const maxPointsUsable = Math.min(availablePoints, Math.floor(total));
  const finalTotal = Math.max(0, total - pointsToUse);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to complete your purchase");
      return;
    }

    if (pointsToUse > availablePoints) {
      toast.error("Insufficient points");
      return;
    }

    if (pointsToUse > total) {
      toast.error("Points cannot exceed order total");
      return;
    }

    // In a real app, this would call the /api/orders endpoint
    // const response = await fetch('/api/orders', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'x-user-id': user.id
    //   },
    //   body: JSON.stringify({ pointsToUse })
    // });

    // Mock checkout process
    items.forEach((item) => {
      const subscription = {
        id: `sub-${Date.now()}-${item.publication.id}`,
        publicationId: item.publication.id,
        publicationTitle: item.publication.title,
        type: item.publication.type,
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        status: "active" as const,
        orderNumber: `ORD-${Date.now()}`,
      };
      addSubscription(subscription);
    });

    const pointsGained = Math.floor(finalTotal);
    addPoints(pointsGained - pointsToUse);
    clearCart();

    let message = `Order placed!`;
    if (pointsToUse > 0) {
      message += ` ${pointsToUse} points redeemed.`;
    }
    if (pointsGained > 0) {
      message += ` You earned ${pointsGained} points!`;
    }
    toast.success(message);
  };

  const handleApplyPoints = (value: string) => {
    const points = parseInt(value) || 0;
    if (points > maxPointsUsable) {
      setPointsToUse(maxPointsUsable);
    } else if (points < 0) {
      setPointsToUse(0);
    } else {
      setPointsToUse(points);
    }
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
                item.publication.type === "magazine"
                  ? item.publication.price * 0.0825
                  : 0;
              const itemTotal = item.publication.price + itemTax;
              const pointsRate = item.publication.type === "magazine" ? 10 : 20;

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
                          toast.success("Item removed from cart");
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
              <h3 className="font-semibold text-foreground mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Tax (8.25% on magazines)
                  </span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-success">Free</span>
                </div>
                {pointsToUse > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Points Redeemed</span>
                    <span>-${pointsToUse.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-base pt-3 border-t border-border">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {isAuthenticated && availablePoints > 0 && (
                <div className="mb-6 p-4 bg-secondary/30 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium">
                        Available Points: {availablePoints}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="points" className="text-xs">
                      Use Points (1 point = $1)
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="points"
                        type="number"
                        min="0"
                        max={maxPointsUsable}
                        value={pointsToUse}
                        onChange={(e) => handleApplyPoints(e.target.value)}
                        placeholder="0"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPointsToUse(maxPointsUsable)}
                        disabled={maxPointsUsable === 0}
                      >
                        Max
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Max: {maxPointsUsable} points
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-reward/10 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-reward">
                  <Gift className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    You'll earn {Math.floor(finalTotal)} points from this
                    purchase
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
                    Don't have an account?{" "}
                    <Link
                      href="/signup"
                      className="text-primary hover:underline"
                    >
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
