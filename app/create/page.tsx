"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Plus, Trash2, Image as ImageIcon, Users, Tag } from "lucide-react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface VoteOption {
  id: string;
  text: string;
  image?: string;
  playerCount?: string;
  gameType?: string;
}

interface PreCreatedList {
  id: string;
  title: string;
  category: string;
  playerCount: string;
  gameType: string;
  options: string[];
}

const preCreatedLists: PreCreatedList[] = [
  {
    id: "bopl-battle",
    title: "Bopl Battle",
    category: "game",
    playerCount: "2-4 kişi",
    gameType: "Arena / Party Game",
    options: ["Bopl Battle"]
  },
  {
    id: "stick-fight",
    title: "Stick Fight: The Game",
    category: "game",
    playerCount: "2-4 kişi",
    gameType: "Arena / Party Game",
    options: ["Stick Fight: The Game"]
  },
  {
    id: "ultimate-chicken",
    title: "Ultimate Chicken Horse",
    category: "game",
    playerCount: "2-4 kişi",
    gameType: "Arena / Party Game",
    options: ["Ultimate Chicken Horse"]
  },
  {
    id: "tricky-towers",
    title: "Tricky Towers",
    category: "game",
    playerCount: "2-4 kişi",
    gameType: "Arena / Party Game",
    options: ["Tricky Towers"]
  },
];

export default function CreateVotePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("general");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState<VoteOption[]>([
    { id: "1", text: "" },
    { id: "2", text: "" },
  ]);
  const [category, setCategory] = useState<string>("activity");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPreLists, setSelectedPreLists] = useState<string[]>([]);

  const categories = [
    { id: "venue", label: "Mekan" },
    { id: "activity", label: "Aktivite" },
    { id: "food", label: "Yemek" },
    { id: "game", label: "Oyun" },
    { id: "movie", label: "Film" },
  ];

  const addOption = () => {
    const newId = (Math.max(...options.map(o => parseInt(o.id))) + 1).toString();
    setOptions([...options, { id: newId, text: "" }]);
  };

  const removeOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter(o => o.id !== id));
    }
  };

  const updateOption = (id: string, text: string) => {
    setOptions(options.map(o => o.id === id ? { ...o, text } : o));
  };

  const togglePreList = (listId: string) => {
    setSelectedPreLists(prev => 
      prev.includes(listId) 
        ? prev.filter(id => id !== listId)
        : [...prev, listId]
    );
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");

    if (!auth.currentUser) {
      setError("Oturum açmanız gerekiyor");
      return;
    }

    if (activeTab === "general") {
      // Validation for custom list
      if (!title.trim()) {
        setError("Liste başlığı gerekli");
        return;
      }

      const filledOptions = options.filter(o => o.text.trim());
      if (filledOptions.length < 2) {
        setError("En az 2 seçenek girmelisiniz");
        return;
      }

      setLoading(true);

      try {
        const listData = {
          title,
          description: description.trim() || "",
          category,
          isPublic,
          options: filledOptions.map(o => o.text),
          createdBy: auth.currentUser.uid,
          createdAt: serverTimestamp(),
          activeCount: filledOptions.length,
          totalCount: filledOptions.length,
          playedCount: 0,
          playedRecently: 0,
        };

        await addDoc(collection(db, "games"), listData);
        router.push("/home");
      } catch (err) {
        console.error("Error creating list:", err);
        setError("Liste oluşturulurken bir hata oluştu");
        setLoading(false);
      }
    } else {
      // Handle pre-created lists
      if (selectedPreLists.length === 0) {
        setError("En az bir liste seçmelisiniz");
        return;
      }

      setLoading(true);

      try {
        const selectedListsData = preCreatedLists.filter(list => 
          selectedPreLists.includes(list.id)
        );

        // Combine all selected lists into one
        const allOptions = selectedListsData.flatMap(list => list.options);
        const combinedTitle = selectedListsData.length === 1 
          ? selectedListsData[0].title
          : `${selectedListsData.length} Seçili Liste`;

        const listData = {
          title: combinedTitle,
          description: selectedListsData.map(l => l.title).join(", "),
          category: selectedListsData[0].category,
          isPublic,
          options: allOptions,
          createdBy: auth.currentUser.uid,
          createdAt: serverTimestamp(),
          activeCount: allOptions.length,
          totalCount: allOptions.length,
          playedCount: 0,
          playedRecently: 0,
        };

        await addDoc(collection(db, "games"), listData);
        router.push("/home");
      } catch (err) {
        console.error("Error creating list:", err);
        setError("Liste oluşturulurken bir hata oluştu");
        setLoading(false);
      }
    }
  };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Galindo&display=swap" rel="stylesheet" />

      <div className="min-h-screen bg-white font-['Galindo'] pb-6">
        {/* Header */}
        <div className="bg-[#5e00c9] px-4 py-4 flex items-center justify-between border-b border-white/20">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="size-6 text-white" />
          </button>
          <h1 className="text-xl font-normal text-white">Yeni Özel Liste</h1>
          <Button
            onClick={() => handleSubmit()}
            disabled={loading}
            className="bg-white text-[#4a00c9] hover:bg-white/90 font-normal px-4 h-9 rounded-lg"
          >
            {loading ? "..." : "Kaydet"}
          </Button>
        </div>

        {/* Purple gradient section with tabs */}
        <div className="bg-gradient-to-b from-[#5e00c9] to-[#7a1aff] px-4 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/20 border border-white/30">
              <TabsTrigger 
                value="general"
                className="data-[state=active]:bg-white data-[state=active]:text-[#4a00c9] text-white font-['Galindo']"
              >
                Genel
              </TabsTrigger>
              <TabsTrigger 
                value="content"
                className="data-[state=active]:bg-white data-[state=active]:text-[#4a00c9] text-white font-['Galindo']"
              >
                İçerik
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content section */}
        <div className="px-4 -mt-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-600 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          {/* General Tab - Create from scratch */}
          {activeTab === "general" && (
            <div className="space-y-4">
              {/* Title Input */}
              <div className="bg-gray-100 rounded-2xl p-5 border-2 border-white/40">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-normal">
                    Liste Başlığı *
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Örn: Hafta sonu aktivite fikirleri"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-sm border-gray-300 font-['Galindo']"
                    maxLength={100}
                  />
                  <p className="text-xs text-gray-500">
                    {title.length}/100 karakter
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-100 rounded-2xl p-5 border-2 border-white/40">
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-normal">
                    Açıklama (İsteğe bağlı)
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Liste hakkında kısa bir açıklama..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="text-sm min-h-24 resize-none border-gray-300 font-['Galindo']"
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-500">
                    {description.length}/200 karakter
                  </p>
                </div>
              </div>

              {/* Category Selection */}
              <div className="bg-gray-100 rounded-2xl p-5 border-2 border-white/40">
                <div className="space-y-3">
                  <Label className="text-sm font-normal">Kategori *</Label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`px-4 py-2 rounded-full text-sm transition ${
                          category === cat.id
                            ? "bg-[#4a00c9] text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="bg-gray-100 rounded-2xl p-5 border-2 border-white/40">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-normal">
                      Seçenekler * (En az 2)
                    </Label>
                    <button
                      type="button"
                      onClick={addOption}
                      className="flex items-center gap-1 text-[#4a00c9] hover:text-[#5e00c9] text-sm font-normal"
                    >
                      <Plus className="size-4" />
                      Ekle
                    </button>
                  </div>

                  <div className="space-y-3">
                    {options.map((option, index) => (
                      <div key={option.id} className="flex items-start gap-2">
                        <div className="flex-1">
                          <Input
                            type="text"
                            placeholder={`Seçenek ${index + 1}`}
                            value={option.text}
                            onChange={(e) => updateOption(option.id, e.target.value)}
                            className="text-sm border-gray-300 font-['Galindo']"
                            maxLength={100}
                          />
                        </div>
                        {options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(option.id)}
                            className="shrink-0 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-gray-500">
                    Her seçenek için bir mekan, oyun, aktivite veya film adı girin
                  </p>
                </div>
              </div>

              {/* Privacy Setting */}
              <div className="bg-gray-100 rounded-2xl p-5 border-2 border-white/40">
                <div className="space-y-3">
                  <Label className="text-sm font-normal">Gizlilik</Label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPublic(true)}
                      className={`px-4 py-2 rounded-full text-sm transition ${
                        isPublic
                          ? "bg-[#4a00c9] text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Herkese Açık
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPublic(false)}
                      className={`px-4 py-2 rounded-full text-sm transition ${
                        !isPublic
                          ? "bg-[#4a00c9] text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Özel
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    {isPublic
                      ? "Liste keşfet sayfasında görünür olacak"
                      : "Sadece sen ve arkadaşların görebilir"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Content Tab - Pre-created lists */}
          {activeTab === "content" && (
            <div className="space-y-3">
              {preCreatedLists.map((list) => (
                <div
                  key={list.id}
                  onClick={() => togglePreList(list.id)}
                  className={`bg-gray-100 rounded-2xl p-5 cursor-pointer transition-all border-2 ${
                    selectedPreLists.includes(list.id)
                      ? "border-[#4a00c9] bg-purple-50"
                      : "border-white/40 hover:border-white/70"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="size-12 bg-white rounded-lg flex items-center justify-center shrink-0">
                      <ImageIcon className="size-6 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-normal text-gray-900 mb-1 text-sm">
                        {list.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="size-3" />
                          <span>{list.playerCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Tag className="size-3" />
                          <span>{list.gameType}</span>
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <div
                        className={`size-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          selectedPreLists.includes(list.id)
                            ? "border-[#4a00c9] bg-[#4a00c9]"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedPreLists.includes(list.id) && (
                          <svg
                            className="size-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {preCreatedLists.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p>Henüz hazır liste yok.</p>
                </div>
              )}

              {/* Add more button */}
              <button
                type="button"
                className="w-full border-2 border-dashed border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 rounded-2xl py-4 transition flex items-center justify-center gap-2"
                onClick={() => {
                  // Could open a modal or navigate to add more templates
                }}
              >
                <Plus className="size-5" />
                Ekle
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
