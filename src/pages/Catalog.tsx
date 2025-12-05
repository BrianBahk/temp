import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PublicationGrid } from '@/components/publications/PublicationGrid';
import { CatalogFilters } from '@/components/publications/CatalogFilters';
import { publications as publicationsFallback } from '@/data/publications';
import { fetchPublications, APIPublication } from '@/lib/api';
import { PublicationType } from '@/types';

const Catalog = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') as PublicationType | null;

  const [searchQuery, setSearchQuery] = useState('');
  const [publications, setPublications] = useState(() => publicationsFallback);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<PublicationType | 'all'>(
    initialType || 'all'
  );
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'title' | 'price' | 'rating' | 'issues' | 'city' | 'points'>('title');

  const filteredAndSortedPublications = useMemo(() => {
    let filtered = publications.filter((pub) => {
      const matchesSearch =
        pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pub.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || pub.type === selectedType;
      const matchesCategory =
        selectedCategory === 'All' || pub.category === selectedCategory;
      return matchesSearch && matchesType && matchesCategory;
    });

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'issues':
          return (b.issuesPerYear || 0) - (a.issuesPerYear || 0);
        case 'city':
          return (a.city || '').localeCompare(b.city || '');
        case 'points': {
          const pointsA = a.type === 'magazine' ? a.price * 0.1 : a.price * 0.2;
          const pointsB = b.type === 'magazine' ? b.price * 0.1 : b.price * 0.2;
          return pointsB - pointsA;
        }
        default:
          return 0;
      }
    });

    return sorted;
  }, [searchQuery, selectedType, selectedCategory, sortBy]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchPublications()
      .then((data: APIPublication[]) => {
        if (!mounted) return;
        // Map API shape to frontend Publication shape where possible
        const mapped = data.map((p) => ({
          id: String(p.id),
          title: p.title || 'Untitled',
          description: p.author ? `Author: ${p.author}` : '',
          image: '',
          price: 0,
          rating: 0,
          reviewCount: 0,
          featured: false,
          type: 'magazine',
          category: 'Imported',
        }));
        setPublications((prev) => (mapped.length > 0 ? mapped : prev));
      })
      .catch(() => {
        // ignore and keep fallback
      })
      .finally(() => setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Layout>
      <div className="bg-secondary/30 py-12">
        <div className="container-narrow">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Browse Catalog
          </h1>
          <p className="text-muted-foreground">
            Discover magazines and newspapers from around the world
          </p>
        </div>
      </div>

      <div className="container-narrow py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold mb-4">Filters</h3>
              <CatalogFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>
          </aside>

          {/* Publications Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredAndSortedPublications.length} publications
              </p>
              <span className="text-xs text-muted-foreground">
                Sort: {sortBy === 'title' && 'Title (A-Z)'}
                {sortBy === 'price' && 'Price (Low to High)'}
                {sortBy === 'rating' && 'Rating (High to Low)'}
                {sortBy === 'issues' && 'Issues Per Year (High)'}
                {sortBy === 'city' && 'City (A-Z)'}
                {sortBy === 'points' && 'Points Awarded (High)'}
              </span>
            </div>
            <PublicationGrid publications={filteredAndSortedPublications} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Catalog;
