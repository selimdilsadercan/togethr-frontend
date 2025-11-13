"use client";

import { useState, useEffect } from 'react';
import VoteCard from '@/components/VoteCard';
import { VoteItem, User } from '@/lib/types';
import { CheckCircle, Clock } from 'lucide-react';

const mockData: VoteItem[] = [
  { left: "Pizza", right: "Burger" },
  { left: "Cats", right: "Dogs" },
  { left: "Summer", right: "Winter" },
];

const mockUsers: User[] = [
  { id: '1', name: 'Alice', voted: false },
  { id: '2', name: 'Bob', voted: false },
  { id: '3', name: 'Charlie', voted: false },
  { id: '4', name: 'Diana', voted: false },
];

export default function VotePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<'left' | 'right' | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);

  const currentItem = mockData[currentIndex];

  useEffect(() => {
    const timeouts = mockUsers.map((user) => {
      const delay = Math.random() * 10000 + 5000; // 5-15 seconds
      return setTimeout(() => {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, voted: true } : u))
        );
      }, delay);
    });
    return () => timeouts.forEach(clearTimeout);
  }, []);

  const handleVote = (choice: 'left' | 'right') => {
    setSelected(choice);
    console.log(`Voted for: ${currentItem[choice]}`);
    // In a real app, send to backend
    setTimeout(() => {
      if (currentIndex < mockData.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelected(null);
      } else {
        alert('Voting complete!');
      }
    }, 1000);
  };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Galindo&display=swap" rel="stylesheet" />

      <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-[#5e00c9] to-[#5e00c9] pt-[60px]">
        <div className="font-['Galindo'] text-[4rem] text-white mb-10 text-center drop-shadow-[2px_2px_5px_rgba(0,0,0,0.3)]">
          Vote Now
        </div>

        <div className="flex gap-8">
          <div className="flex flex-col items-center justify-center bg-white rounded-[20px] p-[40px_50px] shadow-[0_8px_16px_rgba(0,0,0,0.2)] w-[750px] min-h-[500px] text-center">
            <h2 className="font-['Galindo'] text-[2rem] mt-0 mb-8 text-[#333]">
              Which one do you prefer?
            </h2>

            <div
              className="flex justify-between w-full gap-8"
              style={{ perspective: '1000px' }}
            >
            <VoteCard
              key={`left-${currentIndex}`}
              text={currentItem.left}
              onClick={() => handleVote('left')}
              selected={selected === 'left'}
              delay={0}
            />
            <div className="flex items-center">
              <span className="text-2xl font-['Galindo'] text-gray-500">VS</span>
            </div>
            <VoteCard
              key={`right-${currentIndex}`}
              text={currentItem.right}
              onClick={() => handleVote('right')}
              selected={selected === 'right'}
              delay={300}
            />
            </div>
          </div>

          <div className="bg-white rounded-[20px] p-[40px_30px] shadow-[0_8px_16px_rgba(0,0,0,0.2)] w-[300px] min-h-[400px]">
            <h3 className="font-['Galindo'] text-[1.5rem] mb-6 text-[#333] text-center">
              Group Members
            </h3>
            <ul className="space-y-4">
              {users.map((user) => (
                <li key={user.id} className="flex items-center justify-between">
                  <span className="font-['Galindo'] text-lg text-[#555]">{user.name}</span>
                  {user.voted ? (
                    <CheckCircle className="text-green-500" size={24} />
                  ) : (
                    <Clock className="text-gray-400" size={24} />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}