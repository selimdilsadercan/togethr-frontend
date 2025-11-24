"use client";

import React, { useRef } from 'react';
import { CheckCircle, Clock, ChevronLeft, ChevronRight, Users, User as UserIcon } from 'lucide-react';
import { User } from '@/lib/types';

interface VoteSidebarProps {
  users: User[];
  currentUserId: string;
}

const VoteSidebar: React.FC<VoteSidebarProps> = ({ users, currentUserId }) => {

  return (
    <div className="bg-white rounded-[20px] p-[20px_20px] md:p-[40px_30px] shadow-[0_8px_16px_rgba(0,0,0,0.2)] w-full md:w-[300px] md:min-h-[400px] max-h-[300px] md:max-h-none overflow-hidden">
      <h3 className="font-['Galindo'] text-lg md:text-[1.5rem] mb-4 md:mb-6 text-[#333] text-center flex items-center justify-center gap-2">
        <Users size={20} className="text-[#333]" />
        Group Members
      </h3>
      <div className="overflow-x-auto scrollbar-hide max-w-[320px] md:max-w-none">
        <div className="flex flex-row gap-4 md:flex-col md:gap-0 min-w-max md:min-w-0">
          {users.map((user) => (
            <div key={user.id} className="flex flex-col items-center min-w-0 flex-shrink-0 md:flex-row md:justify-between md:items-center md:mb-4 last:md:mb-0">
              <div className="flex flex-col items-center md:flex-row md:items-center">
                <UserIcon className="mb-1 md:mb-0 md:mr-2" size={24} />
                <span className="font-['Galindo'] text-sm md:text-lg text-[#555] truncate text-center md:text-left">
                  {user.name}{user.id === currentUserId ? ' (You)' : ''}
                </span>
              </div>
              {user.voted ? (
                <CheckCircle className="text-green-500 mt-1 md:mt-0 md:ml-2" size={20} />
              ) : (
                <Clock className="text-gray-400 mt-1 md:mt-0 md:ml-2" size={20} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoteSidebar;