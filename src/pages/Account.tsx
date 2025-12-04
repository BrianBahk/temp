"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Gift,
  BookOpen,
  Newspaper,
  LogOut,
  Calendar,
  XCircle,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Account = () => {
  const { user, isAuthenticated, logout, cancelSubscription } = useAuth();
  const router = useRouter();

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
  const cancelledSubscriptions = user.subscriptions.filter(
    (s) => s.status === "cancelled"
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
            <div className="bg-card rounded-xl border border-border p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg">Active Subscriptions</h2>
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
                      className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          {subscription.type === "magazine" ? (
                            <BookOpen className="w-5 h-5 text-primary" />
                          ) : (
                            <Newspaper className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {subscription.publicationTitle}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>
                              Renews{" "}
                              {new Date(
                                subscription.endDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-success/10 text-success border-success/20"
                        >
                          Active
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleCancelSubscription(
                              subscription.id,
                              subscription.publicationTitle
                            )
                          }
                        >
                          <XCircle className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cancelledSubscriptions.length > 0 && (
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-semibold text-lg mb-4">
                  Cancelled Subscriptions
                </h2>
                <div className="space-y-4">
                  {cancelledSubscriptions.map((subscription) => (
                    <div
                      key={subscription.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg opacity-60"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          {subscription.type === "magazine" ? (
                            <BookOpen className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <Newspaper className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {subscription.publicationTitle}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Ended{" "}
                            {new Date(
                              subscription.endDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">Cancelled</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
