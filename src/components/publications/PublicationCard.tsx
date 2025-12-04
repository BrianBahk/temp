import { Link } from 'react-router-dom';
import { Star, Newspaper, BookOpen } from 'lucide-react';
import { Publication } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface PublicationCardProps {
  publication: Publication;
}

export function PublicationCard({ publication }: PublicationCardProps) {
  const { addToCart, items } = useCart();
  const isInCart = items.some((item) => item.publication.id === publication.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isInCart) {
      addToCart(publication);
      toast.success(`${publication.title} added to cart`);
    }
  };

  const pointsRate = publication.type === 'magazine' ? 10 : 20;

  return (
    <Link to={`/publication/${publication.id}`} className="group">
      <article className="bg-card rounded-xl border border-border overflow-hidden hover-lift">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={publication.image}
            alt={publication.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Type Badge */}
          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className="bg-card/90 backdrop-blur-sm text-foreground gap-1"
            >
              {publication.type === 'magazine' ? (
                <BookOpen className="w-3 h-3" />
              ) : (
                <Newspaper className="w-3 h-3" />
              )}
              {publication.type}
            </Badge>
          </div>

          {/* Points Badge */}
          <div className="absolute top-3 right-3">
            <Badge className="bg-reward text-reward-foreground">
              +{pointsRate}% pts
            </Badge>
          </div>

          {publication.featured && (
            <div className="absolute bottom-3 left-3">
              <Badge className="bg-primary text-primary-foreground">Featured</Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="text-sm font-medium">{publication.rating}</span>
            <span className="text-xs text-muted-foreground">
              ({publication.reviewCount.toLocaleString()})
            </span>
          </div>

          <h3 className="font-display text-lg font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {publication.title}
          </h3>

          <p className="text-xs text-muted-foreground mb-3">
            {publication.type === 'magazine'
              ? `${publication.issuesPerYear} issues/year`
              : publication.city}
          </p>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-foreground">
                ${publication.price.toFixed(2)}
              </span>
              <span className="text-xs text-muted-foreground">/year</span>
            </div>

            <Button
              size="sm"
              variant={isInCart ? 'secondary' : 'default'}
              onClick={handleAddToCart}
              disabled={isInCart}
            >
              {isInCart ? 'In Cart' : 'Add'}
            </Button>
          </div>
        </div>
      </article>
    </Link>
  );
}
