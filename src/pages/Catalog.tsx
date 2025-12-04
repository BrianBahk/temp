"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Layout } from "@/components/layout/Layout";
import { PublicationGrid } from "@/components/publications/PublicationGrid";
import { CatalogFilters } from "@/components/publications/CatalogFilters";
import { publications } from "@/data/publications";
import { PublicationType } from "@/types";

const Catalog = () => {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") as PublicationType | null;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<PublicationType | "all">(
    initialType || "all"
  );
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");

  // Get unique cities from newspapers
  const cities = useMemo(() => {
    const citySet = new Set<string>();
    publications
      .filter((pub) => pub.type === "newspaper" && pub.city)
      .forEach((pub) => {
        if (pub.city) citySet.add(pub.city);
      });
    return Array.from(citySet).sort();
  }, []);

  const filteredPublications = useMemo(() => {
    return publications.filter((pub) => {
      const matchesSearch =
        pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pub.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === "all" || pub.type === selectedType;
      const matchesCategory =
        selectedCategory === "All" || pub.category === selectedCategory;
      const matchesCity =
        selectedCity === "All" ||
        pub.type !== "newspaper" ||
        pub.city === selectedCity;
      return matchesSearch && matchesType && matchesCategory && matchesCity;
    });
  }, [searchQuery, selectedType, selectedCategory, selectedCity]);

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
                selectedCity={selectedCity}
                onCityChange={setSelectedCity}
                cities={cities}
              />
            </div>
          </aside>

          {/* Publications Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredPublications.length} publications
              </p>
            </div>
            <PublicationGrid publications={filteredPublications} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Catalog;
