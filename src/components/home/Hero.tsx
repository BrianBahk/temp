import { Link } from 'react-router-dom';
import { ArrowRight, Gift, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-narrow relative py-20 md:py-32">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 animate-fade-in">
            Discover Your Next Great Read
          </h1>
          
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
            Subscribe to the world's best magazines and newspapers. Earn rewards with every purchase and enjoy free delivery to your door.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <Link to="/catalog">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto group">
                Browse Catalog
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto bg-primary-foreground/10 border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
                Create Account
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="flex flex-col sm:flex-row gap-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                <Gift className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-foreground">Earn Rewards</p>
                <p className="text-xs text-primary-foreground/60">Up to 20% back in points</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                <Truck className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-foreground">Free Shipping</p>
                <p className="text-xs text-primary-foreground/60">On all subscriptions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
