"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SwipeMode from "@/components/SwipeMode";
import BracketMode from "@/components/BracketMode";
import { useLists } from "@/lib/storage";

function VotePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const listId = searchParams.get("list");
  const voteType = searchParams.get("type") || "swipe";
  const participants = searchParams.get("participants")?.split(",") || [];

  // Use localStorage hook
  const { getListById } = useLists();
  
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get list from localStorage
    if (listId) {
      const list = getListById(listId);
      if (list) {
        setItems(list.options);
      }
    }
    setLoading(false);
  }, [listId, getListById]);

  const handleSwipeComplete = (results: { itemId: string; vote: "like" | "dislike"; playerId: string }[]) => {
    console.log("Swipe results:", results);
    console.log("Participants:", participants);
    
    // Navigate back to explore page
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

export default function VotePage() {
  return (
    <Suspense fallback={
      <>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Galindo&display=swap" rel="stylesheet" />
        
        <div className="min-h-screen bg-gradient-to-b from-[#5e00c9] to-[#7a1aff] flex items-center justify-center font-['Galindo']">
          <p className="text-white text-lg">Yükleniyor...</p>
        </div>
      </>
    }>
      <VotePageContent />
    </Suspense>
  );
}
