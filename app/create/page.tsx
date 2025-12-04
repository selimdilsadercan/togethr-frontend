"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
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
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-purple-700 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-purple-600/95 backdrop-blur">
        <div className="container max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="size-6 text-white" />
            </button>
            <h1 className="text-xl font-bold text-white">Yeni Özel Liste</h1>
            <Button
              onClick={() => handleSubmit()}
              disabled={loading}
              className="bg-white text-purple-600 hover:bg-white/90 font-semibold px-4 h-9"
            >
              {loading ? "..." : "Kaydet"}
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container max-w-2xl mx-auto px-4 pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/20 border border-white/30">
            <TabsTrigger 
              value="general"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-600 text-white"
            >
              Genel
            </TabsTrigger>
            <TabsTrigger 
              value="content"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-600 text-white"
            >
              İçerik
            </TabsTrigger>
          </TabsList>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-100 px-4 py-3 rounded-lg mt-4">
              {error}
            </div>
          )}

          {/* General Tab - Create from scratch */}
          <TabsContent value="general" className="space-y-6 mt-6">
            {/* Title Input */}
            <Card className="bg-white/95 p-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-semibold">
                  Liste Başlığı *
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Örn: Hafta sonu aktivite fikirleri"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-base"
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground">
                  {title.length}/100 karakter
                </p>
              </div>
            </Card>

            {/* Description */}
            <Card className="bg-white/95 p-6">
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-semibold">
                  Açıklama (İsteğe bağlı)
                </Label>
                <Textarea
                  id="description"
                  placeholder="Liste hakkında kısa bir açıklama..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="text-base min-h-24 resize-none"
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground">
                  {description.length}/200 karakter
                </p>
              </div>
            </Card>

            {/* Category Selection */}
            <Card className="bg-white/95 p-6">
              <div className="space-y-3">
                <Label className="text-base font-semibold">Kategori *</Label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat.id}
                      type="button"
                      variant={category === cat.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCategory(cat.id)}
                      className={
                        category === cat.id
                          ? "bg-purple-600 hover:bg-purple-700"
                          : ""
                      }
                    >
                      {cat.label}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Options */}
            <Card className="bg-white/95 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">
                    Seçenekler * (En az 2)
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addOption}
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  >
                    <Plus className="size-4 mr-1" />
                    Ekle
                  </Button>
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
                          className="text-base"
                          maxLength={100}
                        />
                      </div>
                      {options.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeOption(option.id)}
                          className="shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground">
                  Her seçenek için bir mekan, oyun, aktivite veya film adı girin
                </p>
              </div>
            </Card>

            {/* Privacy Setting */}
            <Card className="bg-white/95 p-6">
              <div className="space-y-3">
                <Label className="text-base font-semibold">Gizlilik</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={isPublic ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsPublic(true)}
                    className={
                      isPublic ? "bg-purple-600 hover:bg-purple-700" : ""
                    }
                  >
                    Herkese Açık
                  </Button>
                  <Button
                    type="button"
                    variant={!isPublic ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsPublic(false)}
                    className={
                      !isPublic ? "bg-purple-600 hover:bg-purple-700" : ""
                    }
                  >
                    Özel
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {isPublic
                    ? "Liste keşfet sayfasında görünür olacak"
                    : "Sadece sen ve arkadaşların görebilir"}
                </p>
              </div>
            </Card>
          </TabsContent>

          {/* Content Tab - Pre-created lists */}
          <TabsContent value="content" className="space-y-4 mt-6">
            <div className="space-y-3">
              {preCreatedLists.map((list) => (
                <Card
                  key={list.id}
                  onClick={() => togglePreList(list.id)}
                  className={`bg-white/95 p-4 cursor-pointer transition-all ${
                    selectedPreLists.includes(list.id)
                      ? "ring-2 ring-purple-600 bg-purple-50/95"
                      : "hover:bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="size-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                      <ImageIcon className="size-6 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">
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
                            ? "border-purple-600 bg-purple-600"
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
                </Card>
              ))}
            </div>

            {preCreatedLists.length === 0 && (
              <div className="text-center py-12 text-white/70">
                <p>Henüz hazır liste yok.</p>
              </div>
            )}

            {/* Add more button */}
            <Button
              type="button"
              variant="outline"
              className="w-full border-white/30 text-white hover:bg-white/10 border-dashed h-12"
              onClick={() => {
                // Could open a modal or navigate to add more templates
              }}
            >
              <Plus className="size-5 mr-2" />
              Ekle
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
