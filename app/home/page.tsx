"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Bell, Home, Compass, User as UserIcon, Plus } from "lucide-react";
import Link from "next/link";

interface Game {
  id: string;
  name: string;
  activeCount: number;
  totalCount: number;
  playedCount: number;
  playedRecently: number;
}

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
          const ref = doc(db, 'users', u.uid);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            setUserDoc(snap.data());
          } else {
            // No user doc — still show basic auth info
            setUserDoc(null);
          }

          // Fetch games
          const gamesRef = collection(db, 'games');
          const gamesSnap = await getDocs(gamesRef);
          const gamesList: Game[] = gamesSnap.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name || 'Untitled Game',
            activeCount: doc.data().activeCount || 0,
            totalCount: doc.data().totalCount || 0,
            playedCount: doc.data().playedCount || 0,
            playedRecently: doc.data().playedRecently || 0,
          }));
          setGames(gamesList);
        } catch (e) {
          console.error('failed to load data', e);
          setUserDoc(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-50 flex flex-col pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">home</h1>
        <Bell size={24} className="text-gray-600" />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-blue-600 mb-2">👋 Merhaba Selim</h2>
          <p className="text-xl text-blue-600 font-semibold">Bugün ne yapıyoruz?</p>
        </div>

        {/* Active Games */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-blue-600 mb-4">Oylamayı Tamamla</h3>
          <div className="bg-white rounded-3xl border-4 border-blue-500 p-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">👥</span>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-800">12 / 16</span>
                <span className="text-sm text-gray-600">Evde Oynanacak Oyunlar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Games */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-blue-600 mb-4">Son Oylamalarım</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Game 1 */}
            <div className="bg-white rounded-3xl border-4 border-blue-500 p-6">
              <div className="text-3xl font-bold text-gray-800 mb-3">101</div>
              <p className="text-sm font-semibold text-gray-700 mb-3">oynana cak mekanlar</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">≡</span>
                  <span className="text-sm text-gray-700">20 mekan</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-500 text-lg">🔥</span>
                  <span className="text-sm text-gray-700">124 kere oylandı</span>
                </div>
              </div>
            </div>

            {/* Game 2 */}
            <div className="bg-white rounded-3xl border-4 border-blue-500 p-6">
              <p className="text-lg font-semibold text-gray-700 mb-3">Evde</p>
              <p className="text-lg font-semibold text-gray-700 mb-3">Oynanacak</p>
              <p className="text-lg font-semibold text-gray-700 mb-3">Oyunlar</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">≡</span>
                  <span className="text-sm text-gray-700">12 oyun</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-500 text-lg">🔥</span>
                  <span className="text-sm text-gray-700">32 kere oylandı</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Button */}
        <div className="fixed bottom-24 right-4 md:right-8">
          <button className="bg-white border-4 border-blue-500 rounded-2xl w-16 h-16 flex items-center justify-center hover:bg-blue-50 transition">
            <Plus size={32} className="text-blue-600" />
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 rounded-t-3xl">
        <div className="flex justify-around items-center py-4 max-w-2xl mx-auto w-full px-4">
          <Link href="/home" className="flex flex-col items-center gap-1 cursor-pointer">
            <Home size={28} className="text-blue-600" />
            <span className="text-sm text-blue-600 font-semibold">home</span>
          </Link>
          <Link href="/explore" className="flex flex-col items-center gap-1 cursor-pointer">
            <Compass size={28} className="text-gray-400" />
            <span className="text-sm text-gray-400">explore</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 cursor-pointer">
            <UserIcon size={28} className="text-gray-400" />
            <span className="text-sm text-gray-400">profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
