"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, MoreVertical, Users, Tag, Gamepad2, Star, Sparkles, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useLists, useFriends, type List } from "@/lib/storage";

function ListDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listId = searchParams.get("listId");
  
  // Use localStorage hooks
  const { getListById } = useLists();
  const { friends } = useFriends();
  
  const [listData, setListData] = useState<List | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [voteType, setVoteType] = useState<"swipe" | "bracket">("swipe");

  useEffect(() => {
    // Get list from localStorage
    if (listId) {
      const list = getListById(listId);
      setListData(list);
    }
    setLoading(false);
  }, [listId, getListById]);

  const toggleFriend = (friendId: string) => {
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleStartVoting = () => {
    // Close drawer and navigate to vote page with parameters
    setDrawerOpen(false);
    const params = new URLSearchParams({
      list: listId || "",
      type: voteType,
      participants: selectedFriends.join(",")
    });
    router.push(`/vote?${params.toString()}`);
  };

  if (loading) {
    return (
      <>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Galindo&display=swap" rel="stylesheet" />
        
        <div className="min-h-screen bg-white flex items-center justify-center font-['Galindo']">
          <p className="text-gray-500">Yükleniyor...</p>
        </div>
      </>
    );
  }

  if (!listData) {
    return (
      <>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Galindo&display=swap" rel="stylesheet" />
        
        <div className="min-h-screen bg-white flex items-center justify-center font-['Galindo']">
          <p className="text-gray-500">Liste bulunamadı</p>
        </div>
      </>
    );
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Galindo&display=swap" rel="stylesheet" />

      <div className="min-h-screen bg-white font-['Galindo'] pb-24">
        {/* Header */}
        <div className="bg-[#5e00c9] px-4 py-4 flex items-center justify-between border-b border-white/20">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="size-6 text-white" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <MoreVertical className="size-6 text-white" />
          </button>
        </div>

        {/* List Info Section with Purple Gradient */}
        <div className="bg-gradient-to-b from-[#5e00c9] to-[#7a1aff] px-4 py-6 text-white">
          <h1 className="text-2xl font-normal mb-4">
            {listData.title}
          </h1>
          
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4" />
              <span>Toplam {listData.totalCount} {getCategoryLabel(listData.category).toLowerCase()}</span>
            </div>
            {listData.category && (
              <div className="flex items-center gap-2">
                <Tag className="size-4" />
                <span>Kategori: {getCategoryLabel(listData.category)}</span>
              </div>
            )}
            {listData.createdBy && (
              <div className="flex items-center gap-2">
                <Users className="size-4" />
                <span>Oluşturan: {listData.createdBy}</span>
              </div>
            )}
          </div>
        </div>

        {/* Games List */}
        <div className="px-4 -mt-4 space-y-3 pb-4">
          {listData.options.map((option, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-2xl p-4 border-2 border-white/40 hover:border-white/70 hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <div className="size-16 bg-white rounded-xl flex items-center justify-center shrink-0 border border-gray-200">
                  <Gamepad2 className="size-8 text-[#4a00c9]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-normal text-gray-800 text-sm mb-2">
                    {option.title}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                    {option.playerCount && option.playerCount !== "N/A" && (
                      <div className="flex items-center gap-1">
                        <Users className="size-3 text-[#4a00c9]" />
                        <span>Oyuncu sayısı: {option.playerCount}</span>
                      </div>
                    )}
                    {option.gameType && (
                      <div className="flex items-center gap-1">
                        <Tag className="size-3 text-[#4a00c9]" />
                        <span>Tür: {option.gameType}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-white/30 px-4 py-4">
          <div className="flex gap-3">
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
              <DrawerTrigger asChild>
                <button className="flex-1 bg-[#4a00c9] text-white py-3 rounded-2xl font-normal hover:bg-[#5e00c9] transition shadow-lg">
                  Oylama Başlat
                </button>
              </DrawerTrigger>
              <DrawerContent className="font-['Galindo']">
                <DrawerHeader>
                  <DrawerTitle className="text-2xl font-normal text-[#4a00c9]">Oylama Ayarları</DrawerTitle>
                  <DrawerDescription className="text-gray-600">
                    Oylama tipini seçin ve katılımcıları ekleyin
                  </DrawerDescription>
                </DrawerHeader>
                
                <div className="px-4 pb-4 space-y-6">
                  {/* Vote Type Selection */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-normal text-gray-700">Oylama Tipi</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setVoteType("swipe")}
                        className={`p-4 rounded-2xl border-2 transition ${
                          voteType === "swipe"
                            ? "border-[#4a00c9] bg-purple-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="text-center">
                          <div className="flex items-center justify-center mx-auto mb-2 gap-2">
                            <ChevronLeft className={`size-6 ${voteType === "swipe" ? "text-[#4a00c9]" : "text-gray-400"}`} />
                            <ChevronRight className={`size-6 ${voteType === "swipe" ? "text-[#4a00c9]" : "text-gray-400"}`} />
                          </div>
                          <p className="font-normal text-sm text-gray-800">Swipe</p>
                          <p className="text-xs text-gray-500 mt-1">Sağa/sola kaydırma</p>
                        </div>
                      </button>
                      <button
                        onClick={() => setVoteType("bracket")}
                        className={`p-4 rounded-2xl border-2 transition ${
                          voteType === "bracket"
                            ? "border-[#4a00c9] bg-purple-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="text-center">
                          <Gamepad2 className={`size-8 mx-auto mb-2 ${
                            voteType === "bracket" ? "text-[#4a00c9]" : "text-gray-400"
                          }`} />
                          <p className="font-normal text-sm text-gray-800">Bracket</p>
                          <p className="text-xs text-gray-500 mt-1">Turnuva sistemi</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                <DrawerFooter>
                  <Button
                    onClick={handleStartVoting}
                    className="w-full bg-[#4a00c9] hover:bg-[#5e00c9] text-white py-6 rounded-2xl font-['Galindo'] font-normal text-base"
                  >
                    Oylamayı Başlat
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="outline" className="w-full rounded-2xl font-['Galindo']">
                      İptal
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
            
            <button className="p-3 bg-white border-2 border-[#4a00c9] rounded-2xl hover:bg-gray-50 transition">
              <Star className="size-6 text-[#4a00c9]" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function getCategoryLabel(category: string): string {
  const categories: Record<string, string> = {
    venue: "Mekan",
    activity: "Aktivite",
    food: "Yemek",
    game: "Oyun",
    movie: "Film",
  };
  return categories[category] || category;
}

export default function ListDetailPage() {
  return (
    <Suspense fallback={
      <>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Galindo&display=swap" rel="stylesheet" />
        
        <div className="min-h-screen bg-white flex items-center justify-center font-['Galindo']">
          <p className="text-gray-500">Yükleniyor...</p>
        </div>
      </>
    }>
      <ListDetailContent />
    </Suspense>
  );
}
