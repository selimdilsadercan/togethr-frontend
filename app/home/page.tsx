"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { Flame, LogOut, Plus, Sparkles } from "lucide-react";
import BottomNav from "@/components/AppBar";

interface Game {
  id: string;
  name: string;
  activeCount: number;
  totalCount: number;
  playedCount: number;
  playedRecently: number;
}

const fallbackGames: Game[] = [
  {
    id: "sample-1",
    name: "Evde oynanacak oyunlar",
    activeCount: 12,
    totalCount: 12,
    playedCount: 32,
    playedRecently: 5,
  },
  {
    id: "sample-2",
    name: "101 oynanacak mekanlar",
    activeCount: 20,
    totalCount: 20,
    playedCount: 124,
    playedRecently: 14,
  },
];

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<any>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);

        try {
          const ref = doc(db, "users", u.uid);
          const snap = await getDoc(ref);
          setUserDoc(snap.exists() ? snap.data() : null);

          const gamesRef = collection(db, "games");
          const gamesSnap = await getDocs(gamesRef);
          const gamesList: Game[] = gamesSnap.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name || "Adsız liste",
            activeCount: doc.data().activeCount || 0,
            totalCount: doc.data().totalCount || 0,
            playedCount: doc.data().playedCount || 0,
            playedRecently: doc.data().playedRecently || 0,
          }));
          setGames(gamesList);
        } catch (e) {
          console.error("failed to load data", e);
          setUserDoc(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const displayName = userDoc?.name || user?.displayName || "Misafir";
  const email = userDoc?.email || user?.email;
  const hasGames = games.length > 0;
  const gameCards = hasGames ? games : fallbackGames;

  const totals = useMemo(
    () => ({
      lists: games.length,
      active: games.reduce((sum, game) => sum + (game.activeCount || 0), 0),
      votes: games.reduce((sum, game) => sum + (game.playedCount || 0), 0),
    }),
    [games]
  );

  if (loading) {
    return (
      <>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Galindo&display=swap" rel="stylesheet" />

        <div className="min-h-screen flex items-center justify-center bg-white font-['Galindo']">
          <div className="text-[#4a00c9]">Yükleniyor...</div>
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
          <div className="flex-1">
            <p className="text-xs text-white/70">Hoş geldin</p>
            <h1 className="text-3xl text-white font-normal">{displayName}</h1>
            {email && <p className="text-xs text-white/70 mt-1">{email}</p>}
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-full border border-white/30 p-2 text-white hover:bg-white/10 transition"
          >
            <LogOut size={18} />
          </button>
          <button className="rounded-full border border-white/30 p-2 text-white hover:bg-white/10 transition">
            <Sparkles size={18} />
          </button>
        </div>

        <div className="bg-gradient-to-b from-[#5e00c9] to-[#7a1aff] px-4 py-8 text-white">
          <p className="text-sm text-white/80">Bugün ne oyluyoruz?</p>
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="bg-white/15 border border-white/20 rounded-2xl p-3 text-center">
              <div className="text-2xl">{totals.lists}</div>
              <div className="text-xs text-white/80 mt-1">liste</div>
            </div>
            <div className="bg-white/15 border border-white/20 rounded-2xl p-3 text-center">
              <div className="text-2xl">{totals.active}</div>
              <div className="text-xs text-white/80 mt-1">aktif</div>
            </div>
            <div className="bg-white/15 border border-white/20 rounded-2xl p-3 text-center">
              <div className="text-2xl">{totals.votes}</div>
              <div className="text-xs text-white/80 mt-1">oy</div>
            </div>
          </div>
        </div>

        <div className="px-4 -mt-8 space-y-6">
          <section className="bg-white rounded-3xl shadow-lg border border-purple-50 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl text-[#4a00c9]">Oylamaları tamamla</h2>
              <span className="text-xs text-gray-500">
                {hasGames ? `${gameCards.length} liste` : "örnek listeler"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {gameCards.map((game) => (
                <div
                  key={game.id}
                  className="bg-gray-50 border-2 border-white/40 rounded-2xl p-4 hover:border-white/60 hover:shadow-md transition"
                >
                  <div className="text-lg text-gray-800 line-clamp-2 mb-3">
                    {game.name}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Sparkles size={16} className="text-[#4a00c9]" />
                    <span>{game.totalCount || game.activeCount} içerik</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-orange-500 mt-2">
                    <Flame size={16} />
                    <span>{game.playedCount} kere oylandı</span>
                  </div>
                </div>
              ))}
            </div>

            {!hasGames && (
              <p className="text-sm text-gray-500 mt-4">
                Henüz listen yok. Hemen yeni bir liste oluştur ve oylamaya başla.
              </p>
            )}
          </section>

          <section className="bg-gray-100 rounded-3xl border border-purple-50 p-5">
            <h3 className="text-lg text-[#4a00c9] mb-4">Son oylamalarım</h3>
            <div className="space-y-3">
              {gameCards.slice(0, 3).map((game) => (
                <div
                  key={`${game.id}-summary`}
                  className="flex items-center justify-between bg-white rounded-2xl px-4 py-3 border border-white/50"
                >
                  <div>
                    <p className="text-sm text-gray-800">{game.name}</p>
                    <p className="text-xs text-gray-500">
                      {(game.playedRecently || 0)} yeni oy
                    </p>
                  </div>
                  <span className="text-xs text-[#4a00c9] font-semibold">
                    {game.playedCount} oy
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <button className="fixed bottom-24 right-5 bg-[#4a00c9] text-white rounded-2xl w-16 h-16 flex items-center justify-center shadow-xl border-4 border-white hover:scale-105 transition">
          <Plus size={28} />
        </button>

        <BottomNav />
      </div>
    </>
  );
}
