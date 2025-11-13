"use client";

import React, { useState, useEffect } from 'react';

interface VoteCardProps {
  text: string;
  onClick: () => void;
  selected?: boolean;
  delay?: number;
}

const VoteCard: React.FC<VoteCardProps> = ({ text, onClick, selected, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay + 450);
    return () => clearTimeout(timer);
  }, [delay]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5; // max 5deg
    const rotateY = ((x - centerX) / centerX) * 5;
    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2);
    const scale = 1.02 + (1 - distance / maxDistance) * 0.08; // 1.02 to 1.1
    e.currentTarget.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = selected ? 'scale(1.05)' : 'scale(1)';
  };

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-lg shadow-lg transition-all duration-200 hover:shadow-2xl w-[300px] h-[468px] ${selected ? 'ring-4 ring-purple-500 scale-105' : ''}`}
      style={{
        transformStyle: 'preserve-3d',
        transform: isVisible ? (selected ? 'scale(1.05)' : 'scale(1)') : 'rotateY(180deg) scale(0.95) translateY(10px)',
        transition: 'transform 0.5s ease-out',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Back of card */}
      <div
        className="absolute inset-0 bg-red-500 rounded-lg flex items-center justify-center"
        style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', zIndex: 1 }}
      >
        <span className="text-white font-['Galindo'] text-xl">Togethr</span>
      </div>
      {/* Front of card */}
      <div
        className="absolute inset-0 bg-white rounded-lg flex flex-col justify-center items-center"
      >
        <p className="text-center font-['Galindo'] text-2xl text-gray-800">{text}</p>
      </div>
    </div>
  );
};

export default VoteCard;
