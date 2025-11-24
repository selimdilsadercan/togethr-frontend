"use client";

import { useState, useEffect } from 'react';
import VoteCard from '@/components/VoteCard';
import VoteSidebar from '@/components/VoteSidebar';
import { VoteItem, User } from '@/lib/types';

const mockData: VoteItem[] = [
  { left: "Pizza", right: "Burger" },
  { left: "Cats", right: "Dogs" },
  { left: "Summer", right: "Winter" },
];

const mockUsers: User[] = [
  { id: 'current', name: 'lele', voted: false },
  { id: '1', name: 'Alice', voted: false },
  { id: '2', name: 'Bob', voted: false },
  { id: '3', name: 'Charlie', voted: false },
  { id: '4', name: 'Diana', voted: false },
  { id: '5', name: 'Eve', voted: false },
  { id: '6', name: 'Frank', voted: false },
  { id: '7', name: 'Grace', voted: false },
];

export default function VotePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<'left' | 'right' | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [waiting, setWaiting] = useState(false);

  const currentItem = mockData[currentIndex];

  useEffect(() => {
    users.forEach((user) => {
      if (!user.voted) {
        const delay = Math.random() * 3000 + 2000; // 2-5 seconds
        setTimeout(() => {
          setUsers((prev) =>
            prev.map((u) => (u.id === user.id ? { ...u, voted: true } : u))
          );
        }, delay);
      }
    });
  }, [currentIndex]);

  useEffect(() => {
    if (waiting && users.every(user => user.voted)) {
      setTimeout(() => {
        if (currentIndex < mockData.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setSelected(null);
          setWaiting(false);
          // Reset users voted for next round
          setUsers(prev => prev.map(u => ({ ...u, voted: false })));
        } else {
          alert('Voting complete!');
        }
      }, 1000);
    }
  }, [users, waiting, currentIndex]);

  const handleVote = (choice: 'left' | 'right') => {
    setSelected(choice);
    console.log(`Voted for: ${currentItem[choice]}`);
    // Mark current user as voted
    setUsers(prev => prev.map(u => u.id === 'current' ? { ...u, voted: true } : u));
    // In a real app, send to backend
    setWaiting(true);
  };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Galindo&display=swap" rel="stylesheet" />

      <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-[#5e00c9] to-[#5e00c9] pt-[60px]">
        <div className="font-['Galindo'] text-3xl md:text-[4rem] text-white mb-6 md:mb-10 text-center drop-shadow-[2px_2px_5px_rgba(0,0,0,0.3)]">
          Vote Now
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center justify-center bg-white rounded-[20px] p-[20px_30px] md:p-[40px_50px] shadow-[0_8px_16px_rgba(0,0,0,0.2)] w-full md:w-[750px] min-h-[500px] md:min-h-[500px] text-center">
            <h2 className="font-['Galindo'] text-xl md:text-[2rem] mt-0 mb-6 md:mb-8 text-[#333]">
              {waiting ? 'Waiting for others to vote...' : 'Which one do you prefer?'}
            </h2>

            <div
              className="flex flex-col md:flex-row md:justify-between w-full gap-4 md:gap-8 items-center"
              style={{ perspective: '1000px' }}
            >
            <VoteCard
              key={`left-${currentIndex}`}
              text={currentItem.left}
              onClick={() => handleVote('left')}
              selected={selected === 'left'}
              delay={0}
            />
            <div className="flex items-center my-4 md:my-0">
              <span className="text-xl md:text-2xl font-['Galindo'] text-gray-500">VS</span>
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

          <VoteSidebar users={users} currentUserId="current" />
        </div>
      </div>
    </>
  );
}
