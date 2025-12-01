'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Home, Search, User } from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('tumu');
  const [user] = useState({
    name: 'Selim Ercan',
    email: 'selim@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Selim',
    followers: 12,
    following: 45,
    likes: 90,
  });

  const favorites = [
    {
      id: 1,
      title: '101 oynanacak mekanlar',
      count: 20,
      type: 'mekan',
      likes: 124,
    },
    {
      id: 2,
      title: 'Evde oynanacak oyunlar',
      count: 12,
      type: 'oyun',
      likes: 32,
    },
    {
      id: 3,
      title: 'Hafta Sonu Aktivite Fikirleri',
      count: 16,
      type: 'aktivite',
      likes: 168,
    },
    {
      id: 4,
      title: 'Korku Filmi Önerileri',
      count: 15,
      type: 'film',
      likes: 47,
    },
  ];

  const tabs = ['Tumu', 'Aktivite', 'Yemek', 'Oyun'];

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Galindo&display=swap" rel="stylesheet" />

      <div className="min-h-screen bg-gradient-to-b from-[#5e00c9] to-[#5e00c9] pb-20 font-['Galindo']">
        
        <div className="bg-white/10 backdrop-blur-sm px-4 py-4 flex justify-between items-center border-b border-white/20">
          <div className="flex-1"></div>
          <input
            type="text"
            placeholder="liste arayın"
            className="flex-1 px-4 py-2 bg-white/20 rounded-lg text-sm placeholder-white/60 outline-none text-white font-['Galindo']"
          />
          <button className="ml-4 text-white text-2xl">☰</button>
        </div>

        
        <div className="bg-white/10 backdrop-blur-sm px-4 py-8 text-center border-b border-white/20">
          <div className="flex justify-center mb-6">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl font-['Galindo'] bg-gradient-to-br from-purple-400 to-purple-600 text-white">
                {user.name.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
          <h1 className="font-['Galindo'] text-4xl font-normal text-white mb-6">
            {user.name}
          </h1>

          
          <div className="flex justify-around gap-8">
            <div className="text-center">
              <div className="font-['Galindo'] text-4xl font-normal text-white">
                {user.followers}
              </div>
              <div className="text-sm text-white/80 mt-2 font-['Galindo']">Arkadaş</div>
            </div>
            <div className="text-center">
              <div className="font-['Galindo'] text-4xl font-normal text-white">
                {user.following}
              </div>
              <div className="text-sm text-white/80 mt-2 font-['Galindo']">Liste</div>
            </div>
            <div className="text-center">
              <div className="font-['Galindo'] text-4xl font-normal text-white">
                {user.likes}
              </div>
              <div className="text-sm text-white/80 mt-2 font-['Galindo']">Oylama</div>
            </div>
          </div>
        </div>

        
        <div className="bg-white/10 backdrop-blur-sm px-4 py-4 flex gap-3 border-b border-white/20 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-4 py-2 rounded-full text-sm font-['Galindo'] font-normal whitespace-nowrap transition ${
                activeTab === tab.toLowerCase()
                  ? 'bg-white text-[#4a00e0] shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        
        <div className="px-4 py-8">
          <div className="grid grid-cols-2 gap-4">
            {favorites.map((item) => (
              <Link href={`/favorites/${item.id}`} key={item.id}>
                <div className="bg-white rounded-2xl p-5 hover:shadow-xl transition cursor-pointer border-2 border-white/30 hover:border-white/50">
                  <h3 className="font-['Galindo'] font-normal text-gray-800 text-sm mb-4 line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600 text-xs font-['Galindo']">
                      <span className="mr-2">≡</span>
                      <span>{item.count} {item.type}</span>
                    </div>
                    <div className="flex items-center text-orange-500 text-xs font-['Galindo'] font-normal">
                      <span className="mr-1">🔥</span>
                      <span>{item.likes} kere oylandı.</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-white/30">
          <div className="flex justify-around items-center py-4">
            <Link href="/" className="flex flex-col items-center gap-2 group">
              <Home size={24} className="text-[#4a00e0] group-hover:scale-110 transition" />
              <span className="text-xs text-[#4a00e0] font-['Galindo'] font-normal">home</span>
            </Link>
            <Link href="/explore" className="flex flex-col items-center gap-2 group">
              <Search size={24} className="text-[#4a00e0] group-hover:scale-110 transition" />
              <span className="text-xs text-[#4a00e0] font-['Galindo'] font-normal">explore</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center gap-2 group">
              <User size={24} className="text-[#4a00e0] group-hover:scale-110 transition" />
              <span className="text-xs text-[#4a00e0] font-['Galindo'] font-normal">profile</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}