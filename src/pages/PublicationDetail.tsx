"use client";

import { useState, useEffect } from "react";
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
  MessageSquare,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { publications } from "@/data/publications";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Review {
  id: string;
  rating: number;
  comment: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const PublicationDetail = () => {
  const params = useParams();
  const id = params.id as string;
  const { addToCart, items } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hasPurchased, setHasPurchased] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  const publication = publications.find((p) => p.id === id);
  const isInCart = items.some((item) => item.publication.id === id);

  useEffect(() => {
    if (publication) {
      fetchReviews();
      if (isAuthenticated && user) {
        checkPurchaseStatus();
      }
    }
  }, [publication, isAuthenticated, user]);

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      // In a real app:
      // const response = await fetch(`/api/reviews?publicationId=${id}&status=approved`);
      // const data = await response.json();
      // setReviews(data);
      
      // Simulated data for now
      setReviews([]);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const checkPurchaseStatus = async () => {
    try {
      // In a real app, check if user has purchased this publication
      // const response = await fetch(`/api/orders`, {
      //   headers: { 'x-user-id': user.id }
      // });
      // const orders = await response.json();
      // const purchased = orders.some(order =>
      //   order.orderItems.some(item => item.publicationId === id)
      // );
      // setHasPurchased(purchased);
      
      // Check if user already reviewed
      // const reviewsResponse = await fetch(`/api/reviews?publicationId=${id}`);
      // const allReviews = await reviewsResponse.json();
      // const userReview = allReviews.find(r => r.userId === user.id);
      // setHasReviewed(!!userReview);
      
      // Simulated for now
      setHasPurchased(false);
      setHasReviewed(false);
    } catch (error) {
      console.error("Error checking purchase status:", error);
    }
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Please sign in to leave a review");
      return;
    }

    if (!hasPurchased) {
      toast.error("You can only review items you have purchased");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    try {
      setSubmittingReview(true);
      // In a real app:
      // await fetch('/api/reviews', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'x-user-id': user.id
      //   },
      //   body: JSON.stringify({
      //     publicationId: id,
      //     rating,
      //     comment
      //   })
      // });
      
      toast.success("Review submitted! It will be visible after admin approval.");
      setRating(0);
      setComment("");
      setHasReviewed(true);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

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

        {/* Reviews Section */}
        <div className="mt-16">
          <Separator className="mb-8" />
          
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            Customer Reviews
          </h2>

          {/* Write Review Form */}
          {isAuthenticated ? (
            hasPurchased && !hasReviewed ? (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Write a Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Star Rating */}
                    <div>
                      <Label>Rating</Label>
                      <div className="flex gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-8 h-8 ${
                                star <= rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comment */}
                    <div>
                      <Label htmlFor="comment">Your Review</Label>
                      <Textarea
                        id="comment"
                        placeholder="Share your thoughts about this publication..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                        className="mt-2"
                      />
                    </div>

                    <Button
                      onClick={handleSubmitReview}
                      disabled={submittingReview || rating === 0 || !comment.trim()}
                    >
                      {submittingReview ? "Submitting..." : "Submit Review"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : hasReviewed ? (
              <Card className="mb-8 bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <p className="text-sm text-blue-800">
                    You have already submitted a review for this publication.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="mb-8 bg-amber-50 border-amber-200">
                <CardContent className="pt-6">
                  <p className="text-sm text-amber-800">
                    Purchase this publication to leave a review.
                  </p>
                </CardContent>
              </Card>
            )
          ) : (
            <Card className="mb-8">
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-4">
                  Sign in to leave a review
                </p>
                <Link href="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Reviews List */}
          {loadingReviews ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-semibold mb-2">No reviews yet</p>
                <p className="text-muted-foreground">
                  Be the first to review this publication!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold">{review.user.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PublicationDetail;
