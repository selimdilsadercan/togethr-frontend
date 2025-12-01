"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Menu } from "lucide-react";
import BottomNav from "@/components/bottom-nav";

interface ExploreCard {
  id: string;
  title: string;
  description: string;
  count: number;
  votes: number;
  type: "venue" | "activity" | "food" | "movie";
}

const mockData: ExploreCard[] = [
  {
    id: "1",
    title: "101 oynanacak mekanlar",
    description: "20 mekan",
    count: 20,
    votes: 124,
    type: "venue"
  },
  {
    id: "2",
    title: "Evde Oynanacak Oyunlar",
    description: "12 oyun",
    count: 12,
    votes: 32,
    type: "activity"
  },
  {
    id: "3",
    title: "Hafta Sonu Aktivite Fikirleri",
    description: "16 aktivite",
    count: 16,
    votes: 168,
    type: "activity"
  },
  {
    id: "4",
    title: "Korku Filmi Önerileri",
    description: "15 film",
    count: 15,
    votes: 47,
    type: "movie"
  }
];

const categories = [
  { id: "all", label: "Tümü" },
  { id: "activity", label: "Aktivite" },
  { id: "food", label: "Yemek" },
  { id: "game", label: "Oyun" }
];

export default function ExplorePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredCards = mockData.filter(card => {
    const matchesSearch = card.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || card.type === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="liste arayın"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
            <Button variant="outline" size="icon">
              <Menu className="size-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="container max-w-2xl mx-auto px-4 py-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              className="shrink-0"
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="container max-w-2xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredCards.map((card) => (
            <Card 
              key={card.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                // Navigate to vote page or detail page
                router.push(`/vote?list=${card.id}`);
              }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg leading-tight">
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-4">≡</span>
                    <span>{card.description}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-4">🔥</span>
                    <span>{card.votes} kere oylandi.</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCards.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Sonuç bulunamadı</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
