"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/publications";
import { PublicationType } from "@/types";

interface CatalogFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType: PublicationType | "all";
  onTypeChange: (type: PublicationType | "all") => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  cities: string[];
}

export function CatalogFilters({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedCategory,
  onCategoryChange,
  selectedCity,
  onCityChange,
  cities,
}: CatalogFiltersProps) {
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

      {/* Type Filter */}
      <div>
        <h4 className="text-sm font-medium mb-3">Type</h4>
        <div className="flex flex-wrap gap-2">
          {(["all", "magazine", "newspaper"] as const).map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              size="sm"
              onClick={() => onTypeChange(type)}
              className="capitalize"
            >
              {type === "all" ? "All" : `${type}s`}
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
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* City Filter - Only show for newspapers */}
      {selectedType === "newspaper" && cities.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3">City</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCity === "All" ? "default" : "outline"}
              size="sm"
              onClick={() => onCityChange("All")}
            >
              All Cities
            </Button>
            {cities.map((city) => (
              <Button
                key={city}
                variant={selectedCity === city ? "default" : "outline"}
                size="sm"
                onClick={() => onCityChange(city)}
              >
                {city}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
