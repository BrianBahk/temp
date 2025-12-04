"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  BookOpen,
  Newspaper,
  Gift,
  Truck,
  Check,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { publications } from "@/data/publications";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const PublicationDetail = () => {
  const params = useParams();
  const id = params.id as string;
  const { addToCart, items } = useCart();

  const publication = publications.find((p) => p.id === id);
  const isInCart = items.some((item) => item.publication.id === id);

  if (!publication) {
    return (
      <Layout>
        <div className="container-narrow py-16 text-center">
          <h1 className="font-display text-2xl font-bold mb-4">
            Publication not found
          </h1>
          <Link href="/catalog">
            <Button variant="outline">Back to Catalog</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    if (!isInCart) {
      addToCart(publication);
      toast.success(`${publication.title} added to cart`);
    }
  };

  const pointsRate = publication.type === "magazine" ? 10 : 20;
  const pointsEarned = Math.floor(publication.price * (pointsRate / 100) * 100);
  const tax = publication.type === "magazine" ? publication.price * 0.0825 : 0;
  const total = publication.price + tax;

  return (
    <Layout>
      <div className="container-narrow py-8">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-muted">
              <img
                src={publication.image}
                alt={publication.title}
                className="w-full h-full object-cover"
              />
            </div>
            {publication.featured && (
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                Featured
              </Badge>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="gap-1">
                {publication.type === "magazine" ? (
                  <BookOpen className="w-3 h-3" />
                ) : (
                  <Newspaper className="w-3 h-3" />
                )}
                {publication.type}
              </Badge>
              <Badge variant="outline">{publication.category}</Badge>
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              {publication.title}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-accent text-accent" />
                <span className="font-semibold">{publication.rating}</span>
                <span className="text-muted-foreground">
                  ({publication.reviewCount.toLocaleString()} reviews)
                </span>
              </div>
              {publication.type === "magazine" && (
                <span className="text-muted-foreground">
                  {publication.issuesPerYear} issues/year
                </span>
              )}
              {publication.type === "newspaper" && (
                <span className="text-muted-foreground">
                  {publication.city}
                </span>
              )}
            </div>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              {publication.description}
            </p>

            {/* Pricing */}
            <div className="bg-secondary/50 rounded-xl p-6 mb-6">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-foreground">
                  ${publication.price.toFixed(2)}
                </span>
                <span className="text-muted-foreground">/year</span>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${publication.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Tax {publication.type === "magazine" ? "(8.25%)" : "(None)"}
                  </span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t border-border">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-reward mb-4">
                <Gift className="w-4 h-4" />
                <span>Earn {pointsEarned} points with this purchase</span>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={isInCart}
              >
                {isInCart ? "Added to Cart" : "Add to Cart"}
              </Button>
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                  <Truck className="w-4 h-4 text-success" />
                </div>
                <span>Free shipping on all subscriptions</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                  <Check className="w-4 h-4 text-success" />
                </div>
                <span>Cancel anytime, no questions asked</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                  <Gift className="w-4 h-4 text-success" />
                </div>
                <span>
                  {pointsRate}% rewards on{" "}
                  {publication.type === "magazine" ? "magazines" : "newspapers"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PublicationDetail;
