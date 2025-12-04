"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, X, ChevronRight } from "lucide-react";

interface BracketItem {
  id: string;
  title: string;
  playerCount?: string;
  gameType?: string;
}

interface BracketMatch {
  id: string;
  item1: BracketItem;
  item2: BracketItem;
  winner?: string;
}

interface BracketModeProps {
  items: BracketItem[];
  onComplete: (winnerId: string) => void;
  onBack: () => void;
}

export default function BracketMode({ items, onComplete, onBack }: BracketModeProps) {
  const [rounds, setRounds] = useState<BracketMatch[][]>(() => {
    // Initialize first round with all items
    const firstRound: BracketMatch[] = [];
    for (let i = 0; i < items.length; i += 2) {
      if (items[i + 1]) {
        firstRound.push({
          id: `match-${i / 2}`,
          item1: items[i],
          item2: items[i + 1],
        });
      } else {
        // Odd number, this item gets a bye
        firstRound.push({
          id: `match-${i / 2}`,
          item1: items[i],
          item2: items[i],
          winner: items[i].id,
        });
      }
    }
    return [firstRound];
  });

  const [currentRound, setCurrentRound] = useState(0);
  const [currentMatch, setCurrentMatch] = useState(0);

  const totalRounds = Math.ceil(Math.log2(items.length));
  const isFinished = currentRound >= rounds.length && rounds[rounds.length - 1]?.[0]?.winner;

  const handleVote = (winnerId: string) => {
    const updatedRounds = [...rounds];
    const match = updatedRounds[currentRound][currentMatch];
    match.winner = winnerId;

    // Check if round is complete
    const roundComplete = updatedRounds[currentRound].every(m => m.winner);

    if (currentMatch + 1 < updatedRounds[currentRound].length) {
      setCurrentMatch(currentMatch + 1);
    } else if (roundComplete) {
      // Create next round
      const winners = updatedRounds[currentRound]
        .map(m => items.find(item => item.id === m.winner))
        .filter(Boolean) as BracketItem[];

      if (winners.length === 1) {
        // Tournament complete
        onComplete(winners[0].id);
      } else {
        // Create next round matches
        const nextRound: BracketMatch[] = [];
        for (let i = 0; i < winners.length; i += 2) {
          if (winners[i + 1]) {
            nextRound.push({
              id: `round${currentRound + 1}-match-${i / 2}`,
              item1: winners[i],
              item2: winners[i + 1],
            });
          }
        }
        updatedRounds.push(nextRound);
        setCurrentRound(currentRound + 1);
        setCurrentMatch(0);
      }
    }

    setRounds(updatedRounds);
  };

  if (isFinished) {
    const winner = items.find(item => item.id === rounds[rounds.length - 1][0].winner);
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#5e00c9] to-[#7a1aff] flex items-center justify-center p-4 font-['Galindo']">
        <div className="text-center text-white max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="size-32 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
          >
            <Trophy className="size-16 text-yellow-900" />
          </motion.div>
          <h2 className="text-4xl font-normal mb-4">🏆 Kazanan!</h2>
          <div className="bg-white rounded-2xl p-6 mb-6">
            <p className="text-2xl font-normal text-gray-800">{winner?.title}</p>
            {winner?.gameType && (
              <p className="text-sm text-gray-600 mt-2">{winner.gameType}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const match = rounds[currentRound]?.[currentMatch];
  if (!match) return null;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Galindo&display=swap" rel="stylesheet" />

      <div className="min-h-screen bg-gradient-to-b from-[#5e00c9] to-[#7a1aff] py-6 px-4 font-['Galindo']">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition"
          >
            <X className="size-6 text-white" />
          </button>
          <div className="text-white text-center">
            <p className="text-sm opacity-80">Round {currentRound + 1} of {totalRounds}</p>
            <p className="text-xs opacity-60">Match {currentMatch + 1} / {rounds[currentRound].length}</p>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* VS Section */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-normal text-white mb-2">Hangisini tercih edersin?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Option 1 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleVote(match.item1.id)}
              className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition group"
            >
              <div className="text-center">
                <div className="size-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition">
                  <span className="text-4xl">🎮</span>
                </div>
                <h3 className="text-xl font-normal text-gray-800 mb-3">
                  {match.item1.title}
                </h3>
                {match.item1.playerCount && (
                  <p className="text-sm text-gray-600 mb-1">
                    👥 {match.item1.playerCount}
                  </p>
                )}
                {match.item1.gameType && (
                  <p className="text-sm text-gray-600">
                    🎯 {match.item1.gameType}
                  </p>
                )}
              </div>
            </motion.button>

            {/* Option 2 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleVote(match.item2.id)}
              className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition group"
            >
              <div className="text-center">
                <div className="size-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition">
                  <span className="text-4xl">🎮</span>
                </div>
                <h3 className="text-xl font-normal text-gray-800 mb-3">
                  {match.item2.title}
                </h3>
                {match.item2.playerCount && (
                  <p className="text-sm text-gray-600 mb-1">
                    👥 {match.item2.playerCount}
                  </p>
                )}
                {match.item2.gameType && (
                  <p className="text-sm text-gray-600">
                    🎯 {match.item2.gameType}
                  </p>
                )}
              </div>
            </motion.button>
          </div>

          {/* VS Badge */}
          <div className="flex justify-center -mt-[300px] mb-[250px] pointer-events-none">
            <div className="size-16 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-[#5e00c9]">
              <span className="text-2xl font-bold text-[#5e00c9]">VS</span>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-300"
              style={{
                width: `${((currentRound * rounds[0].length + currentMatch + 1) / 
                  (totalRounds * rounds[0].length)) * 100}%`
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
