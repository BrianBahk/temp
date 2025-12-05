import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gift, BookOpen, Newspaper, LogOut, Calendar, XCircle, Edit2, Save, X } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Account = () => {
  const { user, isAuthenticated, logout, cancelSubscription, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    middleInitial: user?.middleInitial || '',
    email: user?.email || '',
    address: user?.address || '',
  });

  if (!isAuthenticated || !user) {
    return (
      <Layout>
        <div className="container-narrow py-16 text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Please sign in</h1>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to view your account.
          </p>
          <Link to="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleLogout = () => {
    logout();
    toast.success('You have been signed out');
    navigate('/');
  };

  const calculateProRatedRefund = (subscription: typeof user.subscriptions[0]) => {
    const startDate = new Date(subscription.startDate);
    const endDate = new Date(subscription.endDate);
    const currentDate = new Date();

    const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const usedDays = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.max(0, totalDays - usedDays);

    const dailyRate = subscription.price / subscription.issuesPerYear;
    const refundAmount = (remainingDays / subscription.issuesPerYear) * subscription.price;

    return Math.round(refundAmount * 100) / 100;
  };

  const handleCancelSubscription = (subscriptionId: string, title: string) => {
    const subscription = user.subscriptions.find((s) => s.id === subscriptionId);
    if (subscription) {
      if (subscription.paidWithPoints) {
        toast.error('Subscriptions paid with points cannot be cancelled');
        return;
      }

      const refundAmount = calculateProRatedRefund(subscription);
      cancelSubscription(subscriptionId, refundAmount, subscription.pointsAwarded);
      toast.success(`${title} subscription cancelled. Refund: $${refundAmount.toFixed(2)}`);
    }
  };

  const handleSaveProfile = () => {
    updateProfile({
      firstName: editFormData.firstName,
      lastName: editFormData.lastName,
      middleInitial: editFormData.middleInitial,
      name: `${editFormData.firstName} ${editFormData.lastName}`,
      email: editFormData.email,
      address: editFormData.address,
    });
    setIsEditingProfile(false);
    toast.success('Profile updated successfully');
  };

  const activeSubscriptions = user.subscriptions.filter((s) => s.status === 'active');
  const cancelledSubscriptions = user.subscriptions.filter((s) => s.status === 'cancelled');

  return (
    <Layout>
      <div className="container-narrow py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-1">
              Welcome, {user.firstName} {user.lastName}
            </h1>
            <p className="text-muted-foreground">{user.email} • {user.role === 'admin' ? 'Admin Account' : 'User Account'}</p>
          </div>
          <div className="flex gap-2">
            {!isEditingProfile && (
              <Button variant="outline" onClick={() => setIsEditingProfile(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Profile and Rewards */}
          <div className="lg:col-span-1">
            {/* Profile Edit Card */}
            {isEditingProfile && (
              <div className="bg-card rounded-xl border border-border p-6 mb-6">
                <h3 className="font-semibold text-lg mb-4">Edit Profile</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={editFormData.firstName}
                      onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={editFormData.lastName}
                      onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="middleInitial">Middle Initial</Label>
                    <Input
                      id="middleInitial"
                      value={editFormData.middleInitial}
                      onChange={(e) => setEditFormData({ ...editFormData, middleInitial: e.target.value.slice(0, 1) })}
                      maxLength={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={editFormData.address}
                      onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1" onClick={handleSaveProfile}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => setIsEditingProfile(false)}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Rewards Card */}
            <div className="bg-gradient-to-br from-accent to-reward rounded-xl p-6 text-accent-foreground mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-accent-foreground/10 flex items-center justify-center">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm opacity-80">Available Points</p>
                  <p className="text-2xl font-bold">{user.points.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-sm opacity-80">
                100 points = $1 towards any subscription
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold mb-4">Account Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Subscriptions</span>
                  <span className="font-semibold">{activeSubscriptions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Reviews</span>
                  <span className="font-semibold">{user.reviews?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Type</span>
                  <span className="font-semibold capitalize">{user.role}</span>
                </div>
              </div>
            </div>

            {user.role === 'admin' && (
              <div className="bg-card rounded-xl border border-border p-6 mt-6">
                <h3 className="font-semibold mb-4">Admin Panel</h3>
                <Link to="/admin-reviews">
                  <Button className="w-full">Manage Reviews</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Main Content - Subscriptions and Reviews */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl border border-border p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg">Active Subscriptions</h2>
                <Link to="/catalog">
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
                  <Link to="/catalog">
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
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          {subscription.type === 'magazine' ? (
                            <BookOpen className="w-5 h-5 text-primary" />
                          ) : (
                            <Newspaper className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{subscription.publicationTitle}</h4>
                            {subscription.paidWithPoints && (
                              <Badge variant="outline" className="text-xs bg-reward/10">Paid with Points</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>
                              Renews {new Date(subscription.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Sub: {subscription.subscriptionNumber} | Order: {subscription.orderNumber}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
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
                          title={subscription.paidWithPoints ? 'Cannot cancel - paid with points' : 'Cancel subscription'}
                          disabled={subscription.paidWithPoints}
                        >
                          <XCircle className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-card rounded-xl border border-border p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg">My Reviews</h2>
                <Link to="/submit-review">
                  <Button variant="outline" size="sm">
                    Submit Review
                  </Button>
                </Link>
              </div>

              {(!user.reviews || user.reviews.length === 0) ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    You haven't submitted any reviews yet.
                  </p>
                  <Link to="/submit-review">
                    <Button size="sm">Submit a Review</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {user.reviews.map((review) => (
                    <div key={review.id} className="p-4 bg-secondary/30 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{review.articleName}</h4>
                          <p className="text-sm text-muted-foreground">by {review.authorLastName}</p>
                        </div>
                        <Badge variant={review.status === 'approved' ? 'outline' : review.status === 'rejected' ? 'secondary' : 'default'}>
                          {review.status === 'approved' && '+200 pts'}
                          {review.status === 'rejected' && 'Rejected'}
                          {review.status === 'pending' && 'Pending'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Submitted: {new Date(review.submittedDate).toLocaleDateString()}
                      </p>
                      {review.rejectionReason && (
                        <p className="text-xs text-destructive mt-2">Reason: {review.rejectionReason}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cancelledSubscriptions.length > 0 && (
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-semibold text-lg mb-4">Cancelled Subscriptions</h2>
                <div className="space-y-4">
                  {cancelledSubscriptions.map((subscription) => (
                    <div
                      key={subscription.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg opacity-60"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          {subscription.type === 'magazine' ? (
                            <BookOpen className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <Newspaper className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{subscription.publicationTitle}</h4>
                          <p className="text-sm text-muted-foreground">
                            Ended {new Date(subscription.endDate).toLocaleDateString()}
                          </p>
                          {subscription.refundAmount && (
                            <p className="text-xs text-muted-foreground">
                              Refund: ${subscription.refundAmount.toFixed(2)}
                            </p>
                          )}
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
