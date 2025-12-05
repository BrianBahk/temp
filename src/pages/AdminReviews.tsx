import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ArrowLeft, Check, X } from 'lucide-react';

const AdminReviews = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [rejectionReason, setRejectionReason] = useState<{ [key: string]: string }>({});

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return (
      <Layout>
        <div className="container-narrow py-16 text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            Only admin users can access this page.
          </p>
          <Link to="/account">
            <Button>Back to Account</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  // Collect all reviews from all users
  // In a real app, this would come from a backend API
  const allReviews = useMemo(() => {
    // Mock data - in a real app, fetch from backend
    return [
      {
        id: 'rev-001',
        userId: 'user-1',
        userName: 'John Doe',
        subscriptionId: 'sub-1',
        publicationId: '1',
        issueNumber: 42,
        publicationDate: '2024-11-01',
        articleName: 'The Future of AI',
        authorLastName: 'Smith',
        content: `This is an insightful article about artificial intelligence. The author explores how AI is transforming various industries. I particularly appreciated the detailed examples provided. The writing is clear and engaging. This article definitely changed my perspective on AI development.`,
        wordCount: 55,
        sentenceCount: 5,
        date: '2024-11-15',
        submittedDate: '2024-11-15',
        status: 'pending',
        pointsAwarded: 0,
      } as any,
      {
        id: 'rev-002',
        userId: 'user-2',
        userName: 'Jane Smith',
        subscriptionId: 'sub-2',
        publicationId: '2',
        issueNumber: 5,
        publicationDate: '2024-10-15',
        articleName: 'Ocean Conservation',
        authorLastName: 'Johnson',
        content: `An excellent article about protecting our oceans. The author provides compelling statistics and real-world examples. I learned a lot about marine ecosystems and conservation efforts. The call to action is inspiring and motivating. Definitely worth reading for anyone interested in environmental issues.`,
        wordCount: 58,
        sentenceCount: 5,
        date: '2024-10-20',
        submittedDate: '2024-10-20',
        status: 'approved',
        pointsAwarded: 200,
      } as any,
    ];
  }, []);

  const filteredReviews = allReviews.filter(r => r.status === selectedTab);

  const handleApproveReview = (reviewId: string) => {
    toast.success('Review approved! User earned 200 points.');
    // In real app, update review status via API
  };

  const handleRejectReview = (reviewId: string, reason: string) => {
    if (!reason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    toast.success('Review rejected and user notified.');
    // In real app, update review status via API
  };

  return (
    <Layout>
      <div className="container-narrow py-8">
        <Link to="/account" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Account
        </Link>

        <div className="bg-card rounded-xl border border-border p-8 mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Review Management
          </h1>
          <p className="text-muted-foreground">
            Review and approve/reject user submissions. A review must be at least 50 words and 5 sentences to be considered for approval.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-border">
          {['pending', 'approved', 'rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab as 'pending' | 'approved' | 'rejected')}
              className={`px-4 py-3 font-medium text-sm capitalize border-b-2 transition-colors ${
                selectedTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab} ({filteredReviews.length})
            </button>
          ))}
        </div>

        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <p className="text-muted-foreground">No {selectedTab} reviews to display.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-card rounded-xl border border-border p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{review.articleName}</h3>
                      <Badge variant={review.status === 'approved' ? 'outline' : 'default'}>
                        {review.status === 'approved' && '✓ Approved'}
                        {review.status === 'rejected' && '✗ Rejected'}
                        {review.status === 'pending' && 'Pending Review'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      by {review.authorLastName} • Issue #{review.issueNumber} ({new Date(review.publicationDate).toLocaleDateString()})
                    </p>
                  </div>
                  {review.status === 'approved' && (
                    <Badge className="ml-2">+200 pts</Badge>
                  )}
                </div>

                {/* Reviewer Info */}
                <div className="flex gap-4 mb-4 p-3 bg-secondary/30 rounded-lg text-sm">
                  <div>
                    <span className="text-muted-foreground">Reviewer: </span>
                    <span className="font-medium">{review.userName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Submitted: </span>
                    <span className="font-medium">{new Date(review.submittedDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Review Content */}
                <div className="mb-4 p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm leading-relaxed">{review.content}</p>
                  <div className="flex gap-6 text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
                    <span>Words: {review.wordCount}</span>
                    <span>Sentences: {review.sentenceCount}</span>
                  </div>
                </div>

                {/* Quality Checklist */}
                <div className="mb-4 p-4 bg-secondary/20 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Quality Requirements</h4>
                  <ul className="text-xs space-y-1">
                    <li className={review.wordCount >= 50 ? 'text-success' : 'text-destructive'}>
                      {review.wordCount >= 50 ? '✓' : '✗'} At least 50 words ({review.wordCount} words)
                    </li>
                    <li className={review.sentenceCount >= 5 ? 'text-success' : 'text-destructive'}>
                      {review.sentenceCount >= 5 ? '✓' : '✗'} At least 5 sentences ({review.sentenceCount} sentences)
                    </li>
                    <li className="text-muted-foreground">
                      Corresponds to actual article content (manual verification)
                    </li>
                  </ul>
                </div>

                {/* Actions */}
                {selectedTab === 'pending' && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => handleApproveReview(review.id)}
                        disabled={review.wordCount < 50 || review.sentenceCount < 5}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Approve Review
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => {
                          const reason = prompt('Enter rejection reason:');
                          if (reason) {
                            handleRejectReview(review.id, reason);
                          }
                        }}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                    {(review.wordCount < 50 || review.sentenceCount < 5) && (
                      <p className="text-xs text-destructive bg-destructive/10 p-2 rounded">
                        Cannot approve: Does not meet minimum requirements
                      </p>
                    )}
                  </div>
                )}

                {selectedTab === 'rejected' && (
                  <div className="text-xs text-muted-foreground p-3 bg-muted/20 rounded">
                    Rejection Reason: Did not meet quality standards
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminReviews;
