import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Gift, DollarSign } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const generateOrderNumber = () => {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
};

const generateSubscriptionNumber = () => {
  return `SUB-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
};

const Cart = () => {
  const { items, removeFromCart, clearCart, subtotal, tax, total, pointsEarned, updatePaymentMethod } = useCart();
  const { isAuthenticated, user, addPoints, addSubscription, subtractPoints } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'points' | 'mixed'>('card');
  const [pointsToUse, setPointsToUse] = useState(0);

  const calculateItemPrice = (price: number, type: 'magazine' | 'newspaper') => {
    if (type === 'magazine') {
      return price * 1.0825;
    }
    return price;
  };

  const calculatePointsAward = (price: number, type: 'magazine' | 'newspaper') => {
    const rate = type === 'magazine' ? 0.1 : 0.2;
    return Math.floor(price * rate * 100);
  };

  const cardAmount = paymentMethod === 'card' ? total : Math.max(0, total - (pointsToUse / 100));
  const pointsNeeded = total * 100;

  const handleCheckout = () => {
    if (!isAuthenticated || !user) {
      toast.error('Please sign in to complete your purchase');
      return;
    }

    if (paymentMethod === 'points' && (user.points < pointsNeeded)) {
      toast.error(`You need ${pointsNeeded} points but only have ${user.points}`);
      return;
    }

    if (paymentMethod === 'mixed' && (user.points < pointsToUse)) {
      toast.error(`You need ${pointsToUse} points but only have ${user.points}`);
      return;
    }

    const orderNumber = generateOrderNumber();
    let totalPointsSubtracted = 0;

    // Process each item
    items.forEach((item) => {
      const subscriptionNumber = generateSubscriptionNumber();
      const itemPrice = calculateItemPrice(item.publication.price, item.publication.type);
      const pointsAwarded = calculatePointsAward(item.publication.price, item.publication.type);
      
      // Determine if paid with points
      let paidWithPoints = false;
      if (paymentMethod === 'points') {
        paidWithPoints = true;
        totalPointsSubtracted += Math.ceil(itemPrice * 100);
      } else if (paymentMethod === 'mixed') {
        const itemPointsToUse = Math.min(pointsToUse, Math.ceil(itemPrice * 100));
        if (itemPointsToUse > 0) {
          paidWithPoints = itemPointsToUse >= Math.ceil(itemPrice * 100);
          totalPointsSubtracted += itemPointsToUse;
        }
      }

      const subscription = {
        id: `sub-${Date.now()}-${item.publication.id}`,
        subscriptionNumber,
        publicationId: item.publication.id,
        publicationTitle: item.publication.title,
        type: item.publication.type,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'active' as const,
        orderNumber,
        price: item.publication.price,
        issuesPerYear: item.publication.type === 'magazine' ? item.publication.issuesPerYear || 12 : 365,
        pointsAwarded,
        paidWithPoints,
      };

      addSubscription(subscription);
    });

    // Handle points
    if (paymentMethod === 'points' || paymentMethod === 'mixed') {
      subtractPoints(totalPointsSubtracted);
    }

    addPoints(pointsEarned);
    clearCart();

    toast.success(`Order ${orderNumber} placed! You earned ${pointsEarned} points!`);
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
            <Link to="/catalog">
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
              const itemTotal = calculateItemPrice(item.publication.price, item.publication.type);
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
                        {item.publication.type === 'magazine' && (
                          <p className="text-xs text-muted-foreground">
                            incl. ${(item.publication.price * 0.0825).toFixed(2)} tax
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

              {/* Payment Method Selection */}
              {isAuthenticated && user && (
                <div className="mb-6 p-4 bg-secondary/30 rounded-lg">
                  <h4 className="font-medium text-sm mb-3">Payment Method</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'points' | 'mixed')}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Credit Card</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="points"
                        checked={paymentMethod === 'points'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'points' | 'mixed')}
                        disabled={user.points < pointsNeeded}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">
                        Points ({user.points} available / {pointsNeeded} needed)
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="mixed"
                        checked={paymentMethod === 'mixed'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'points' | 'mixed')}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Points + Card</span>
                    </label>
                  </div>

                  {paymentMethod === 'mixed' && (
                    <div className="mt-3">
                      <label className="text-xs text-muted-foreground">Points to use:</label>
                      <Input
                        type="number"
                        min="0"
                        max={Math.min(user.points, pointsNeeded)}
                        value={pointsToUse}
                        onChange={(e) => setPointsToUse(Math.min(parseInt(e.target.value) || 0, user.points))}
                        className="mt-1 text-sm"
                        placeholder="Enter points"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Card amount: ${(total - pointsToUse / 100).toFixed(2)}
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'points' && (
                    <p className="text-xs text-muted-foreground mt-3">
                      Paying with {pointsNeeded} points (100 points = $1)
                    </p>
                  )}
                </div>
              )}

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
                  {paymentMethod === 'card' && (
                    <>
                      <DollarSign className="w-4 h-4 mr-2" />
                      Pay ${cardAmount.toFixed(2)}
                    </>
                  )}
                  {paymentMethod === 'points' && (
                    <>
                      <Gift className="w-4 h-4 mr-2" />
                      Pay with Points
                    </>
                  )}
                  {paymentMethod === 'mixed' && (
                    <>
                      <Gift className="w-4 h-4 mr-2" />
                      Pay Mixed
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-3">
                  <Link to="/login">
                    <Button className="w-full" size="lg">
                      Sign In to Checkout
                    </Button>
                  </Link>
                  <p className="text-xs text-center text-muted-foreground">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-primary hover:underline">
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
