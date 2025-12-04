"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Flame, Search, Sparkles } from "lucide-react";
import BottomNav from "@/components/AppBar";
import { useLists } from "@/lib/storage";

const categories = [
  { id: "all", label: "Tümü" },
  { id: "venue", label: "Mekan" },
  { id: "activity", label: "Aktivite" },
  { id: "food", label: "Yemek" },
  { id: "game", label: "Oyun" },
  { id: "movie", label: "Film" },
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Use localStorage hook
  const { lists, loading } = useLists();

  // Filter lists based on search and category
  const filteredLists = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return lists.filter((list) => {
      const matchesSearch = 
        list.title.toLowerCase().includes(query) ||
        list.description?.toLowerCase().includes(query);
      const matchesCategory = activeCategory === "all" || list.category === activeCategory;
      const isPublic = list.isPublic; // Only show public lists
      return matchesSearch && matchesCategory && isPublic;
    });
  }, [searchQuery, activeCategory, lists]);

  if (loading) {
    return (
      <>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Galindo&display=swap" rel="stylesheet" />

        <div className="min-h-screen bg-white pb-24 font-['Galindo'] flex items-center justify-center">
          <p className="text-gray-500">Yükleniyor...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Galindo&display=swap" rel="stylesheet" />

      <div className="min-h-screen bg-white pb-24 font-['Galindo']">
        <div className="bg-[#5e00c9] px-4 py-4 flex items-center gap-3 border-b border-white/20">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/70" />
            <input
              type="text"
              placeholder="liste arayın"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 pl-10 pr-4 py-3 outline-none"
            />
          </div>
        </div>

        <div className="bg-gradient-to-b from-[#5e00c9] to-[#7a1aff] px-4 py-8 text-white">
          <h1 className="text-3xl font-normal">Keşfet</h1>
          <p className="text-sm text-white/80">Trend listeler, oyunlar ve mekanlar.</p>

          <div className="flex gap-2 overflow-x-auto mt-6 pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
                  activeCategory === category.id
                    ? "bg-white text-[#4a00c9] shadow-lg"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 -mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredLists.map((list) => (
              <Link href={`/list?listId=${list.id}`} key={list.id}>
                <div className="bg-gray-100 rounded-2xl p-5 border-2 border-white/40 hover:border-white/70 hover:shadow-md transition cursor-pointer">
                  <h3 className="text-sm text-gray-800 mb-4 line-clamp-2">
                    {list.title}
                  </h3>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-[#4a00c9]" />
                      <span>{list.totalCount} öğe</span>
                    </div>
                    {list.description && (
                      <div className="flex items-center gap-2 text-orange-500">
                        <Flame size={16} />
                        <span className="line-clamp-1">{list.description}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-[#4a00c9]">👤</span>
                      <span>{list.createdBy}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredLists.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              <p className="mb-2">😔</p>
              <p>
                {searchQuery 
                  ? "Aradığınız kriterlere uygun liste bulunamadı"
                  : "Henüz liste yok"
                }
              </p>
              {!searchQuery && (
                <Link 
                  href="/create"
                  className="inline-block mt-4 bg-[#4a00c9] text-white px-6 py-3 rounded-2xl hover:bg-[#5e00c9] transition"
                >
                  İlk Listeyi Oluştur
                </Link>
              )}
            </div>
          )}
        </div>

        <BottomNav />
      </div>
    </>
  );
}
