"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Clock,
  Star,
  ArrowLeft
} from "lucide-react";
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
  publication: {
    id: string;
    title: string;
    type: string;
    image: string;
  };
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    fetchReviews(activeTab);
  }, [activeTab]);

  const fetchReviews = async (status: string) => {
    try {
      setLoading(true);
      // In a real app, this would make an API call with admin authentication
      // const response = await fetch(`/api/admin/reviews?status=${status}`, {
      //   headers: { 'x-user-id': 'admin-id' }
      // });
      // const data = await response.json();
      // setReviews(data);
      
      // Simulated data for now
      setReviews([]);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId: string) => {
    try {
      // In a real app:
      // await fetch(`/api/admin/reviews/${reviewId}`, {
      //   method: 'PATCH',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     'x-user-id': 'admin-id'
      //   },
      //   body: JSON.stringify({ status: 'approved' })
      // });
      
      toast.success("Review approved successfully");
      fetchReviews(activeTab);
    } catch (error) {
      console.error("Error approving review:", error);
      toast.error("Failed to approve review");
    }
  };

  const handleReject = async (reviewId: string) => {
    try {
      // In a real app:
      // await fetch(`/api/admin/reviews/${reviewId}`, {
      //   method: 'PATCH',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     'x-user-id': 'admin-id'
      //   },
      //   body: JSON.stringify({ status: 'rejected' })
      // });
      
      toast.success("Review rejected");
      fetchReviews(activeTab);
    } catch (error) {
      console.error("Error rejecting review:", error);
      toast.error("Failed to reject review");
    }
  };

  const renderReviewCard = (review: Review) => (
    <Card key={review.id} className="mb-4">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <img
            src={review.publication.image}
            alt={review.publication.title}
            className="w-20 h-28 object-cover rounded"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold">{review.publication.title}</h3>
                <p className="text-sm text-muted-foreground">
                  by {review.user.name} ({review.user.email})
                </p>
              </div>
              <Badge
                variant={
                  review.status === "pending"
                    ? "outline"
                    : review.status === "approved"
                    ? "default"
                    : "destructive"
                }
              >
                {review.status}
              </Badge>
            </div>

            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < review.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-2">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>

            <p className="text-sm mb-4">{review.comment}</p>

            {review.status === "pending" && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleApprove(review.id)}
                  className="flex items-center gap-1"
                >
                  <ThumbsUp className="h-4 w-4" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReject(review.id)}
                  className="flex items-center gap-1"
                >
                  <ThumbsDown className="h-4 w-4" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/admin">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Review Management</h1>
              <p className="text-muted-foreground">
                Approve or reject user reviews
              </p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4" />
              Approved
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-2">
              <ThumbsDown className="h-4 w-4" />
              Rejected
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading reviews...</p>
              </div>
            ) : reviews.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-semibold mb-2">No reviews found</p>
                  <p className="text-muted-foreground">
                    There are no {activeTab} reviews at this time.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div>{reviews.map(renderReviewCard)}</div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
