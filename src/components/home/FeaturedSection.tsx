"use client";

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { publications } from '@/data/publications';
import { PublicationCard } from '@/components/publications/PublicationCard';
import { Button } from '@/components/ui/button';

export function FeaturedSection() {
  const featured = publications.filter((p) => p.featured).slice(0, 4);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container-narrow">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Featured Publications
            </h2>
            <p className="text-muted-foreground">
              Handpicked selections from our editors
            </p>
          </div>
          <Link href="/catalog" className="hidden sm:block">
            <Button variant="ghost" className="group">
              View All
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((publication, index) => (
            <div
              key={publication.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <PublicationCard publication={publication} />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/catalog">
            <Button variant="outline" className="group">
              View All Publications
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
