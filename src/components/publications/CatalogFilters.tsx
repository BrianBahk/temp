import { Search, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { categories } from '@/data/publications';
import { PublicationType } from '@/types';

interface CatalogFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType: PublicationType | 'all';
  onTypeChange: (type: PublicationType | 'all') => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy?: 'title' | 'price' | 'rating' | 'issues' | 'city' | 'points';
  onSortChange?: (sort: 'title' | 'price' | 'rating' | 'issues' | 'city' | 'points') => void;
}

export function CatalogFilters({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedCategory,
  onCategoryChange,
  sortBy = 'title',
  onSortChange,
}: CatalogFiltersProps) {
  const getSortOptions = () => {
    if (selectedType === 'newspaper' || (selectedType === 'all')) {
      return [
        { value: 'title', label: 'Title (A-Z)' },
        { value: 'price', label: 'Price (Low to High)' },
        { value: 'rating', label: 'Rating (High to Low)' },
        { value: 'points', label: 'Points Awarded (High)' },
      ];
    }
    // Magazine specific sorts
    return [
      { value: 'title', label: 'Title (A-Z)' },
      { value: 'price', label: 'Price (Low to High)' },
      { value: 'issues', label: 'Issues Per Year (High)' },
      { value: 'points', label: 'Points Awarded (High)' },
      { value: 'rating', label: 'Rating (High to Low)' },
    ];
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search publications..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Sort */}
      {onSortChange && (
        <div>
          <h4 className="text-sm font-medium mb-3">Sort By</h4>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
          >
            {getSortOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Type Filter */}
      <div>
        <h4 className="text-sm font-medium mb-3">Type</h4>
        <div className="flex flex-wrap gap-2">
          {(['all', 'magazine', 'newspaper'] as const).map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTypeChange(type)}
              className="capitalize"
            >
              {type === 'all' ? 'All' : `${type}s`}
            </Button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-sm font-medium mb-3">Category</h4>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
