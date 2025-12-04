import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Newspaper } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container-narrow">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
              <Newspaper className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-semibold text-foreground">
              ReadSphere
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/catalog"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Catalog
            </Link>
            <Link
              to="/catalog?type=magazine"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Magazines
            </Link>
            <Link
              to="/catalog?type=newspaper"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Newspapers
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-reward/10 rounded-full">
                <span className="text-xs font-medium text-reward">
                  {user.points.toLocaleString()} pts
                </span>
              </div>
            )}

            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent text-accent-foreground">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {isAuthenticated ? (
              <Link to="/account">
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <Link to="/login" className="hidden sm:block">
                <Button variant="default" size="sm">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-3">
              <Link
                to="/catalog"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Catalog
              </Link>
              <Link
                to="/catalog?type=magazine"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Magazines
              </Link>
              <Link
                to="/catalog?type=newspaper"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Newspapers
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-primary hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
