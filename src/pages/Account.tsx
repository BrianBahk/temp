"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Gift,
  BookOpen,
  Newspaper,
  LogOut,
  Calendar,
  XCircle,
  ShoppingBag,
  Package,
  Clock,
  MessageSquare,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Order {
  id: string;
  orderNumber: string;
  subtotal: number;
  tax: number;
  pointsUsed: number;
  total: number;
  status: string;
  createdAt: string;
  orderItems: Array<{
    id: string;
    quantity: number;
    price: number;
    publication: {
      id: string;
      title: string;
      type: string;
    };
  }>;
}

const Account = () => {
  const { user, isAuthenticated, logout, cancelSubscription } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Calculate time remaining for subscriptions
  const getTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Expires today";
    if (diffDays === 1) return "1 day left";
    if (diffDays < 30) return `${diffDays} days left`;
    
    const months = Math.floor(diffDays / 30);
    if (months === 1) return "1 month left";
    if (months < 12) return `${months} months left`;
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years === 1 && remainingMonths === 0) return "1 year left";
    if (remainingMonths === 0) return `${years} years left`;
    return `${years}y ${remainingMonths}m left`;
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchOrders();
    }
  }, [isAuthenticated, user]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      // In a real app:
      // const response = await fetch('/api/orders', {
      //   headers: { 'x-user-id': user.id }
      // });
      // const data = await response.json();
      // setOrders(data);
      
      // Simulated data for now
      setOrders([]);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <Layout>
        <div className="container-narrow py-16 text-center">
          <h1 className="font-display text-2xl font-bold mb-4">
            Please sign in
          </h1>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to view your account.
          </p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleLogout = () => {
    logout();
    toast.success("You have been signed out");
    router.push("/");
  };

  const handleCancelSubscription = (subscriptionId: string, title: string) => {
    cancelSubscription(subscriptionId);
    toast.success(`${title} subscription cancelled`);
  };

  const activeSubscriptions = user.subscriptions.filter(
    (s) => s.status === "active"
  );

  return (
    <Layout>
      <div className="container-narrow py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-1">
              Welcome, {user.name}
            </h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Rewards */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-accent to-reward rounded-xl p-6 text-accent-foreground mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-accent-foreground/10 flex items-center justify-center">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm opacity-80">Available Points</p>
                  <p className="text-2xl font-bold">
                    {user.points.toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-sm opacity-80">
                Points can be redeemed for subscription discounts
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Active Subscriptions
                  </span>
                  <span className="font-semibold">
                    {activeSubscriptions.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Points Earned</span>
                  <span className="font-semibold">
                    {user.points.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Subscriptions */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="subscriptions" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
                <TabsTrigger value="orders">Purchase History</TabsTrigger>
              </TabsList>

              <TabsContent value="subscriptions">
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-semibold text-lg">
                      Your Subscriptions
                    </h2>
                    <Link href="/catalog">
                      <Button variant="outline" size="sm">
                        Add New
                      </Button>
                    </Link>
                  </div>

                  {activeSubscriptions.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        You don't have any active subscriptions yet.
                      </p>
                      <Link href="/catalog">
                        <Button>Browse Catalog</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeSubscriptions.map((subscription) => (
                        <div
                          key={subscription.id}
                          className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                          onClick={() => router.push(`/publication/${subscription.publicationId}`)}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              {subscription.type === "magazine" ? (
                                <BookOpen className="w-5 h-5 text-primary" />
                              ) : (
                                <Newspaper className="w-5 h-5 text-primary" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">
                                {subscription.publicationTitle}
                              </h4>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>
                                    Renews{" "}
                                    {new Date(
                                      subscription.endDate
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-primary font-medium">
                                  <Clock className="w-3 h-3" />
                                  <span>{getTimeRemaining(subscription.endDate)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/publication/${subscription.publicationId}`);
                              }}
                            >
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Review
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelSubscription(
                                  subscription.id,
                                  subscription.publicationTitle
                                );
                              }}
                            >
                              <XCircle className="w-4 h-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="orders">
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <ShoppingBag className="w-5 h-5" />
                    <h2 className="font-semibold text-lg">Purchase History</h2>
                  </div>

                  {loadingOrders ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-4 text-muted-foreground">
                        Loading orders...
                      </p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        You haven't made any purchases yet.
                      </p>
                      <Link href="/catalog">
                        <Button>Browse Catalog</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="border rounded-lg p-4 hover:bg-secondary/30 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-sm">
                                {order.orderNumber}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">${order.total.toFixed(2)}</p>
                              {order.pointsUsed > 0 && (
                                <Badge variant="outline" className="text-xs mt-1">
                                  {order.pointsUsed} pts used
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {order.orderItems.map((item) => (
                              <div
                                key={item.id}
                                className="flex justify-between items-center text-sm"
                              >
                                <div className="flex items-center gap-2">
                                  {item.publication.type === "magazine" ? (
                                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                                  ) : (
                                    <Newspaper className="w-4 h-4 text-muted-foreground" />
                                  )}
                                  <span>{item.publication.title}</span>
                                </div>
                                <span className="text-muted-foreground">
                                  ${item.price.toFixed(2)} × {item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
