"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        // Not logged in -> send to login
        router.push('/login');
        return;
      }

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
      } catch (e) {
        console.error('failed to load user doc', e);
        setUserDoc(null);
      } finally {
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
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-20">
      <div className="bg-white rounded-lg shadow-md p-8 w-[480px]">
        <h1 className="text-2xl font-bold mb-4">Welcome{userDoc?.name ? `, ${userDoc.name}` : user?.displayName ? `, ${user.displayName}` : ''}!</h1>

        <div className="mb-4">
          <div className="text-sm text-gray-500">Email</div>
          <div className="text-base">{user?.email}</div>
        </div>

        <div className="mb-4">
          <div className="text-sm text-gray-500">Username</div>
          <div className="text-base">{userDoc?.username || '—'}</div>
        </div>

        <div className="mb-4">
          <div className="text-sm text-gray-500">Joined</div>
          <div className="text-base">{userDoc?.createdAt ? new Date(userDoc.createdAt.seconds * 1000).toLocaleString() : '—'}</div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSignOut}
            className="px-4 py-2 rounded bg-red-600 text-white"
          >
            Sign out
          </button>

          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 rounded border border-gray-200"
          >
            Home (public)
          </button>
        </div>
      </div>
    </div>
  );
}
