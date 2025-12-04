"use client";

import { Publication } from '@/types';
import { PublicationCard } from './PublicationCard';

interface PublicationGridProps {
  publications: Publication[];
}

export function PublicationGrid({ publications }: PublicationGridProps) {
  if (publications.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No publications found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {publications.map((publication, index) => (
        <div
          key={publication.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <PublicationCard publication={publication} />
        </div>
      ))}
    </div>
  );
}
