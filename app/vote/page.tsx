"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SwipeMode from "@/components/SwipeMode";
import BracketMode from "@/components/BracketMode";

interface VoteItem {
  id: string;
  title: string;
  playerCount?: string;
  gameType?: string;
}

// Mock data - same as list page
const mockLists: Record<string, VoteItem[]> = {
  "1": [
    { id: "1", title: "Bopl Battle", playerCount: "2-4 kişi", gameType: "Arena / Party Game" },
    { id: "2", title: "Stick Fight: The Game", playerCount: "2-4 kişi", gameType: "Arena / Party Game" },
    { id: "3", title: "Ultimate Chicken Horse", playerCount: "2-4 kişi", gameType: "Arena / Party Game" },
    { id: "4", title: "Tricky Towers", playerCount: "2-4 kişi", gameType: "Arena / Party Game" },
  ],
  "2": [
    { id: "1", title: "Among Us", playerCount: "4-10 kişi", gameType: "Social Deduction" },
    { id: "2", title: "Gang Beasts", playerCount: "2-4 kişi", gameType: "Party Game" },
    { id: "3", title: "Overcooked 2", playerCount: "1-4 kişi", gameType: "Co-op" },
    { id: "4", title: "Mario Kart 8", playerCount: "1-4 kişi", gameType: "Racing" },
  ],
  "3": [
    { id: "1", title: "Piknik yapmak", playerCount: "2+ kişi", gameType: "Outdoor" },
    { id: "2", title: "Sinema", playerCount: "1+ kişi", gameType: "Entertainment" },
    { id: "3", title: "Kafe gezme", playerCount: "2+ kişi", gameType: "Social" },
    { id: "4", title: "Müze ziyareti", playerCount: "1+ kişi", gameType: "Culture" },
  ],
  "4": [
    { id: "1", title: "The Conjuring", playerCount: "N/A", gameType: "Horror / Supernatural" },
    { id: "2", title: "Hereditary", playerCount: "N/A", gameType: "Horror / Drama" },
    { id: "3", title: "A Quiet Place", playerCount: "N/A", gameType: "Horror / Thriller" },
    { id: "4", title: "Get Out", playerCount: "N/A", gameType: "Horror / Thriller" },
  ],
};

export default function VotePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const listId = searchParams.get("list");
  const voteType = searchParams.get("type") || "swipe";
  const participants = searchParams.get("participants")?.split(",") || [];

  const [items, setItems] = useState<VoteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      if (listId && mockLists[listId]) {
        setItems(mockLists[listId]);
      }
      setLoading(false);
    }, 300);
  }, [listId]);

  const handleSwipeComplete = (results: { itemId: string; vote: "like" | "dislike" }[]) => {
    console.log("Swipe results:", results);
    console.log("Participants:", participants);
    
    // Show results summary
    const likes = results.filter(r => r.vote === "like").map(r => 
      items.find(item => item.id === r.itemId)?.title
    );
    
    alert(`Beğendikleriniz:\n${likes.join("\n")}`);
    
    // Navigate back or to results page
    router.push("/explore");
  };

  const handleBracketComplete = (winnerId: string) => {
    const winner = items.find(item => item.id === winnerId);
    console.log("Bracket winner:", winner);
    console.log("Participants:", participants);
    
    setTimeout(() => {
      alert(`Kazanan: ${winner?.title}`);
      router.push("/explore");
    }, 2000);
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Galindo&display=swap" rel="stylesheet" />
        
        <div className="min-h-screen bg-gradient-to-b from-[#5e00c9] to-[#7a1aff] flex items-center justify-center font-['Galindo']">
          <p className="text-white text-lg">Yükleniyor...</p>
        </div>
      </>
    );
  }

  if (!items.length) {
    return (
      <>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Galindo&display=swap" rel="stylesheet" />
        
        <div className="min-h-screen bg-gradient-to-b from-[#5e00c9] to-[#7a1aff] flex items-center justify-center font-['Galindo']">
          <div className="text-center text-white">
            <p className="text-lg mb-4">Liste bulunamadı</p>
            <button
              onClick={handleBack}
              className="bg-white text-[#4a00c9] px-6 py-3 rounded-2xl font-normal hover:bg-gray-100 transition"
            >
              Geri Dön
            </button>
          </div>
        </div>
      </>
    );
  }

  // Render appropriate mode
  if (voteType === "bracket") {
    return (
      <BracketMode
        items={items}
        onComplete={handleBracketComplete}
        onBack={handleBack}
      />
    );
  }

  // Default to swipe mode
  return (
    <SwipeMode
      items={items}
      onComplete={handleSwipeComplete}
      onBack={handleBack}
    />
  );
}
