"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { X, Plus, Trash2 } from "lucide-react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface VoteOption {
  id: string;
  text: string;
}

export default function CreateVotePage() {
  const router = useRouter();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!title.trim()) {
      setError("Liste başlığı gerekli");
      return;
    }

    const filledOptions = options.filter(o => o.text.trim());
    if (filledOptions.length < 2) {
      setError("En az 2 seçenek girmelisiniz");
      return;
    }

    if (!auth.currentUser) {
      setError("Oturum açmanız gerekiyor");
      return;
    }

    setLoading(true);

    try {
      // Create the voting list
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

      const docRef = await addDoc(collection(db, "games"), listData);
      
      // Redirect to home page or the new list
      router.push("/home");
    } catch (err) {
      console.error("Error creating list:", err);
      setError("Liste oluşturulurken bir hata oluştu");
      setLoading(false);
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
            <h1 className="text-xl font-bold text-white">Yeni Liste Oluştur</h1>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-100 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

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

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-purple-600 hover:bg-white/90 font-semibold text-base h-12"
            >
              {loading ? "Oluşturuluyor..." : "Liste Oluştur"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
