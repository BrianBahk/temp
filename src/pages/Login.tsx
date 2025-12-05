import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Login = () => {
  const [username, setUsername] = useState('demo');
  const [password, setPassword] = useState('demo');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(username, password);
    
    if (success) {
      toast.success('Welcome back!');
      navigate('/account');
    } else {
      toast.error('Invalid credentials');
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
            Welcome Back to ReadSphere
          </h1>
          <p className="text-primary-foreground/70">
            Sign in to manage your subscriptions, track your rewards, and discover new publications.
          </p>
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
            Sign In
          </h2>
          <p className="text-muted-foreground mb-8">
            Enter your credentials to access your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
            <p className="text-xs font-medium text-muted-foreground mb-2">Demo credentials:</p>
            <p className="text-xs text-muted-foreground">User: <strong>demo</strong> / Password: <strong>demo</strong></p>
            <p className="text-xs text-muted-foreground">Admin: <strong>admin</strong> / Password: <strong>admin</strong></p>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
