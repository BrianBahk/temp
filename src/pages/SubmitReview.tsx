import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const SubmitReview = () => {
  const { user, isAuthenticated, submitReview } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    subscriptionId: '',
    issueNumber: '',
    publicationDate: '',
    articleName: '',
    authorLastName: '',
    content: '',
  });

  if (!isAuthenticated || !user) {
    return (
      <Layout>
        <div className="container-narrow py-16 text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Please sign in</h1>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to submit a review.
          </p>
          <Link to="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const validateReview = () => {
    const wordCount = formData.content.trim().split(/\s+/).length;
    const sentenceCount = formData.content.trim().split(/[.!?]+/).filter(s => s.trim().length > 0).length;

    if (!formData.subscriptionId) {
      toast.error('Please select a subscription');
      return false;
    }

    if (!formData.issueNumber) {
      toast.error('Please enter issue number');
      return false;
    }

    if (!formData.publicationDate) {
      toast.error('Please enter publication date');
      return false;
    }

    // Check if publication date is within 30 days
    const pubDate = new Date(formData.publicationDate);
    const currentDate = new Date();
    const daysDiff = Math.floor((currentDate.getTime() - pubDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff > 30) {
      toast.error('Review must be submitted within 30 days of publication');
      return false;
    }

    if (wordCount < 50) {
      toast.error(`Review must be at least 50 words (currently ${wordCount} words)`);
      return false;
    }

    if (sentenceCount < 5) {
      toast.error(`Review must have at least 5 sentences (currently ${sentenceCount} sentences)`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateReview()) {
      return;
    }

    setIsLoading(true);

    const wordCount = formData.content.trim().split(/\s+/).length;
    const sentenceCount = formData.content.trim().split(/[.!?]+/).filter(s => s.trim().length > 0).length;

    const review = {
      id: `rev-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      subscriptionId: formData.subscriptionId,
      publicationId: user.subscriptions.find(s => s.id === formData.subscriptionId)?.publicationId || '',
      issueNumber: parseInt(formData.issueNumber),
      publicationDate: formData.publicationDate,
      articleName: formData.articleName,
      authorLastName: formData.authorLastName,
      content: formData.content,
      wordCount,
      sentenceCount,
      date: new Date().toISOString().split('T')[0],
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'pending' as const,
      pointsAwarded: 0,
    };

    submitReview(review);
    toast.success('Review submitted for approval! Pending admin review.');
    setIsLoading(false);
    navigate('/account');
  };

  const activeSubscriptions = user.subscriptions.filter(s => s.status === 'active');

  return (
    <Layout>
      <div className="container-narrow py-8">
        <div className="max-w-2xl">
          <Link to="/account" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Account
          </Link>

          <div className="bg-card rounded-xl border border-border p-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Submit a Review
            </h1>
            <p className="text-muted-foreground mb-8">
              Share your thoughts on articles and columns. Reviews must meet quality standards and be submitted within 30 days of publication. Approved reviews earn 200 points!
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="subscription">Select Subscription *</Label>
                <select
                  id="subscription"
                  value={formData.subscriptionId}
                  onChange={(e) => setFormData({ ...formData, subscriptionId: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  required
                >
                  <option value="">Choose a subscription...</option>
                  {activeSubscriptions.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.publicationTitle} ({sub.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="issueNumber">Issue Number *</Label>
                  <Input
                    id="issueNumber"
                    type="number"
                    placeholder="e.g., 42"
                    value={formData.issueNumber}
                    onChange={(e) => setFormData({ ...formData, issueNumber: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publicationDate">Publication Date *</Label>
                  <Input
                    id="publicationDate"
                    type="date"
                    value={formData.publicationDate}
                    onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="articleName">Article/Column Name *</Label>
                <Input
                  id="articleName"
                  type="text"
                  placeholder="e.g., The Future of Technology"
                  value={formData.articleName}
                  onChange={(e) => setFormData({ ...formData, articleName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authorLastName">Author's Last Name *</Label>
                <Input
                  id="authorLastName"
                  type="text"
                  placeholder="e.g., Smith"
                  value={formData.authorLastName}
                  onChange={(e) => setFormData({ ...formData, authorLastName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Your Review *</Label>
                <p className="text-xs text-muted-foreground">
                  Minimum: 50 words and 5 sentences
                </p>
                <textarea
                  id="content"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-40"
                  placeholder="Write your detailed review here..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                />
                <div className="flex gap-6 text-xs text-muted-foreground">
                  <span>Words: {formData.content.trim().split(/\s+/).filter(w => w.length > 0).length}</span>
                  <span>Sentences: {formData.content.trim().split(/[.!?]+/).filter(s => s.trim().length > 0).length}</span>
                </div>
              </div>

              <div className="bg-secondary/30 rounded-lg p-4">
                <h4 className="font-medium text-sm mb-2">Review Guidelines</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>✓ Minimum 50 words and 5 sentences</li>
                  <li>✓ Must be submitted within 30 days of publication</li>
                  <li>✓ Should reference the actual content</li>
                  <li>✓ Must be original work</li>
                  <li>✓ Approved reviews earn 200 points</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/account')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubmitReview;
