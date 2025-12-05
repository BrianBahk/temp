import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Newspaper, Gift, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleInitial, setMiddleInitial] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await signup({
      firstName,
      lastName,
      middleInitial,
      email,
      address,
      creditCard: {
        cardNumber: `****${cardNumber.slice(-4)}`,
        expiryDate,
        cvv: '***',
        nameOnCard: `${firstName} ${lastName}`,
      },
      username,
      password,
      role: isAdmin ? 'admin' : 'user',
    });

    if (success) {
      toast.success('Account created! Welcome to ReadSphere!');
      navigate('/account');
    } else {
      toast.error('Something went wrong');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-8">
            <Newspaper className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold text-primary-foreground mb-4">
            Join ReadSphere Today
          </h1>
          <p className="text-primary-foreground/70 mb-8">
            Create an account to start subscribing to your favorite publications and earning rewards.
          </p>

          <div className="bg-primary-foreground/10 rounded-xl p-6 text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Gift className="w-5 h-5 text-accent" />
              </div>
              <span className="font-semibold text-primary-foreground">Rewards Program</span>
            </div>
            <p className="text-sm text-primary-foreground/70">
              Earn up to 20% back in points on every subscription. Redeem points for free subscriptions!
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Newspaper className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-semibold">ReadSphere</span>
          </Link>

          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Create Account - Step {step} of 3
          </h2>
          <p className="text-muted-foreground mb-8">
            {step === 1 && 'Enter your personal information'}
            {step === 2 && 'Enter your address and payment method'}
            {step === 3 && 'Create your login credentials'}
          </p>

          <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); setStep(step + 1); }} className="space-y-4">
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="middleInitial">Middle Initial (Optional)</Label>
                  <Input
                    id="middleInitial"
                    type="text"
                    placeholder="M"
                    value={middleInitial}
                    onChange={(e) => setMiddleInitial(e.target.value.slice(0, 1))}
                    maxLength={1}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            {/* Step 2: Address and Payment */}
            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="address">Mailing Address</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="123 Main St, City, State 12345"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Credit Card Number</Label>
                  <Input
                    id="cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ''))}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAdmin}
                      onChange={(e) => setIsAdmin(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Create as admin account</span>
                  </label>
                </div>
              </>
            )}

            {/* Step 3: Login Credentials */}
            {step === 3 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="your_username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="text-xs text-muted-foreground">
                  <p className="font-medium mb-2">Demo credentials:</p>
                  <p>User: demo / password: demo</p>
                  <p>Admin: admin / password: admin</p>
                </div>
              </>
            )}

            <div className="flex gap-3 pt-6">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep(step - 1)}
                >
                  Back
                </Button>
              )}
              <Button
                type="submit"
                className="flex-1"
                size="lg"
                disabled={isLoading}
              >
                {step === 3 ? (isLoading ? 'Creating account...' : 'Create Account') : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
