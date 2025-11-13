"use client";

import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { User } from '@/lib/types';

interface VoteSidebarProps {
  users: User[];
  currentUserId: string;
}

const VoteSidebar: React.FC<VoteSidebarProps> = ({ users, currentUserId }) => {
  return (
    <div className="bg-white rounded-[20px] p-[40px_30px] shadow-[0_8px_16px_rgba(0,0,0,0.2)] w-[300px] min-h-[400px]">
      <h3 className="font-['Galindo'] text-[1.5rem] mb-6 text-[#333] text-center">
        Group Members
      </h3>
      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user.id} className="flex items-center justify-between">
            <span className="font-['Galindo'] text-lg text-[#555]">
              {user.name}{user.id === currentUserId ? ' (You)' : ''}
            </span>
            {user.voted ? (
              <CheckCircle className="text-green-500" size={24} />
            ) : (
              <Clock className="text-gray-400" size={24} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VoteSidebar;