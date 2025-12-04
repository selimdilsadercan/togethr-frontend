'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Sparkles, Flame } from 'lucide-react';
import BottomNav from '@/components/AppBar';
import { useLists, useFriends, useVoteSessions } from '@/lib/storage';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('tumu');
  
  // Use localStorage hooks
  const { lists } = useLists();
  const { friends } = useFriends();
  const { sessions } = useVoteSessions();
  
  const [user] = useState({
    name: 'Selim Ercan',
    email: 'selim@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Selim',
  });

  // Calculate stats from localStorage
  const stats = useMemo(() => {
    return {
      friends: friends.length,
      lists: lists.length,
      votes: sessions.length,
    };
  }, [friends, lists, sessions]);

  // Filter lists by category
  const filteredLists = useMemo(() => {
    if (activeTab === 'tumu') {
      return lists;
    }
    
    const categoryMap: Record<string, string> = {
      'aktivite': 'activity',
      'yemek': 'food',
      'oyun': 'game',
    };
    
    const category = categoryMap[activeTab];
    return lists.filter(list => list.category === category);
  }, [activeTab, lists]);

  const tabs = [
    { id: 'tumu', label: 'Tümü' }, 
    { id: 'aktivite', label: 'Aktivite' }, 
    { id: 'yemek', label: 'Yemek' }, 
    { id: 'oyun', label: 'Oyun' }
  ];

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Galindo&display=swap" rel="stylesheet" />

      <div className="min-h-screen bg-white pb-20 font-['Galindo']">
        {/* User Profile Header */}
        <div className="bg-gradient-to-b from-[#5e00c9] to-[#5e00c9] backdrop-blur-sm px-4 py-8 text-center border-b border-white/20">
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

          {/* Stats */}
          <div className="flex justify-around gap-8">
            <div className="text-center">
              <div className="font-['Galindo'] text-4xl font-normal text-white">
                {stats.friends}
              </div>
              <div className="text-sm text-white/80 mt-2 font-['Galindo']">Arkadaş</div>
            </div>
            <div className="text-center">
              <div className="font-['Galindo'] text-4xl font-normal text-white">
                {stats.lists}
              </div>
              <div className="text-sm text-white/80 mt-2 font-['Galindo']">Liste</div>
            </div>
            <div className="text-center">
              <div className="font-['Galindo'] text-4xl font-normal text-white">
                {stats.votes}
              </div>
              <div className="text-sm text-white/80 mt-2 font-['Galindo']">Oylama</div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-[#5e00c9] backdrop-blur-sm px-4 py-4 flex gap-3 border-b border-white/20 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-['Galindo'] font-normal whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-white text-[#4a00e0] shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Lists Grid */}
        <div className="px-4 py-8">
          {filteredLists.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredLists.map((list) => (
                <Link href={`/list?listId=${list.id}`} key={list.id}>
                  <div className="bg-gray-100 rounded-2xl p-5 hover:shadow-xl transition cursor-pointer border-2 border-white/30 hover:border-white/50">
                    <h3 className="font-['Galindo'] font-normal text-gray-800 text-sm mb-4 line-clamp-2">
                      {list.title}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600 text-xs font-['Galindo']">
                        <Sparkles className="size-3 mr-2 text-[#4a00c9]" />
                        <span>{list.totalCount} öğe</span>
                      </div>
                      {list.description && (
                        <div className="flex items-center text-orange-500 text-xs font-['Galindo'] font-normal">
                          <Flame className="size-3 mr-1" />
                          <span className="line-clamp-1">{list.description}</span>
                        </div>
                      )}
                      <div className="flex items-center text-gray-600 text-xs font-['Galindo']">
                        <span className="mr-2">👤</span>
                        <span>{list.createdBy}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-2">😔</p>
              <p className="text-gray-500 mb-4">
                {activeTab === 'tumu' 
                  ? 'Henüz liste yok' 
                  : `${tabs.find(t => t.id === activeTab)?.label} kategorisinde liste yok`
                }
              </p>
              <Link 
                href="/create"
                className="inline-block bg-[#4a00c9] text-white px-6 py-3 rounded-2xl hover:bg-[#5e00c9] transition font-['Galindo']"
              >
                Yeni Liste Oluştur
              </Link>
            </div>
          )}
        </div>

        <BottomNav />
      </div>
    </>
  );
}