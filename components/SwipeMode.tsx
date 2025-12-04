"use client";

import React, { useState } from "react";
import { motion, useMotionValue, useTransform, animate, PanInfo } from "framer-motion";
import { ThumbsUp, ThumbsDown, X, RotateCcw, User, Trophy } from "lucide-react";

interface SwipeItem {
  id: string;
  title: string;
  playerCount?: string;
  gameType?: string;
}

interface SwipeResult {
  itemId: string;
  vote: "like" | "dislike";
  playerId: string;
}

interface SwipeModProps {
  items: SwipeItem[];
  onComplete: (results: SwipeResult[]) => void;
  onBack: () => void;
}

// Static players for now
const PLAYERS = [
  { id: "player1", name: "Ahmet", avatar: "👨", color: "#FF6B6B" },
  { id: "player2", name: "Ayşe", avatar: "👩", color: "#4ECDC4" },
  { id: "player3", name: "Mehmet", avatar: "👨‍💼", color: "#FFE66D" },
];

export default function SwipeMode({ items, onComplete, onBack }: SwipeModProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [results, setResults] = useState<SwipeResult[]>([]);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  const currentPlayer = PLAYERS[currentPlayerIndex];

  const currentItem = items[currentIndex];
  const isFinished = currentPlayerIndex >= PLAYERS.length && currentIndex >= items.length;

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const opacity = useTransform(x, [-250, 0, 250], [0.6, 1, 0.6]);

  const handleVote = (vote: "like" | "dislike") => {
    if (isFinished) return;

    const newResult: SwipeResult = {
      itemId: currentItem.id,
      vote,
      playerId: currentPlayer.id,
    };

    const newResults = [...results, newResult];
    setResults(newResults);
    const dir = vote === "like" ? "right" : "left";
    setDirection(dir);

    // animate card off-screen
    const target = dir === "right" ? 600 : -600;
    animate(x, target, { duration: 0.25 });

    setTimeout(() => {
      if (currentIndex + 1 >= items.length) {
        // Current player finished all items
        if (currentPlayerIndex + 1 >= PLAYERS.length) {
          // All players finished - show results screen
          // Don't call onComplete here, let the results screen render
          setCurrentPlayerIndex(currentPlayerIndex + 1); // This will trigger isFinished
          setCurrentIndex(currentIndex + 1);
        } else {
          // Move to next player, reset items
          setCurrentPlayerIndex(currentPlayerIndex + 1);
          setCurrentIndex(0);
          setDirection(null);
          x.set(0);
        }
      } else {
        // Move to next item for current player
        setCurrentIndex(currentIndex + 1);
        setDirection(null);
        x.set(0);
      }
    }, 300);
  };

  const handleUndo = () => {
    if (results.length === 0) return;

    if (currentIndex > 0) {
      // Undo within current player's votes
      setCurrentIndex(currentIndex - 1);
      setResults(results.slice(0, -1));
      setDirection(null);
      x.set(0);
    } else if (currentPlayerIndex > 0) {
      // Go back to previous player's last item
      setCurrentPlayerIndex(currentPlayerIndex - 1);
      setCurrentIndex(items.length - 1);
      setResults(results.slice(0, -1));
      setDirection(null);
      x.set(0);
    }
  };

  if (isFinished) {
    // Calculate vote counts for each item
    const itemVotes = items.map(item => {
      const itemResults = results.filter(r => r.itemId === item.id);
      const likes = itemResults.filter(r => r.vote === "like").length;
      const dislikes = itemResults.filter(r => r.vote === "dislike").length;
      const total = likes + dislikes;
      const likePercentage = total > 0 ? Math.round((likes / total) * 100) : 0;
      
      return {
        item,
        likes,
        dislikes,
        total,
        likePercentage,
      };
    });

    // Sort by most likes
    const sortedItems = [...itemVotes].sort((a, b) => b.likes - a.likes);

    return (
      <>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Galindo&display=swap" rel="stylesheet" />
        
        <div className="min-h-screen bg-gradient-to-b from-[#5e00c9] to-[#7a1aff] py-6 px-4 font-['Galindo']">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center text-white mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="size-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Trophy className="size-12 text-white" />
              </motion.div>
              <h2 className="text-4xl font-normal mb-2">Oylama Tamamlandı!</h2>
              <p className="text-white/80 text-lg">
                {PLAYERS.length} oyuncu, {items.length} seçenek için oy verdi
              </p>
            </div>

            {/* Results by Item */}
            <div className="space-y-4 mb-8">
              <h3 className="text-white text-xl font-normal mb-4 text-center">📊 Oylama Sonuçları</h3>
              {sortedItems.map((itemData, index) => (
                <motion.div
                  key={itemData.item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-white text-lg font-normal mb-1">
                        {index === 0 && "🏆 "}
                        {itemData.item.title}
                      </h4>
                      {itemData.item.gameType && (
                        <p className="text-white/60 text-sm">{itemData.item.gameType}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-white text-2xl font-normal">
                        {itemData.likePercentage}%
                      </div>
                      <div className="text-white/60 text-xs">beğeni</div>
                    </div>
                  </div>

                  {/* Vote bars */}
                  <div className="space-y-2">
                    {/* Likes bar */}
                    <div className="flex items-center gap-3">
                      <ThumbsUp className="size-4 text-green-400 flex-shrink-0" />
                      <div className="flex-1 bg-white/10 rounded-full h-6 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${itemData.likePercentage}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                          className="bg-gradient-to-r from-green-400 to-green-500 h-full flex items-center justify-end pr-2"
                        >
                          {itemData.likes > 0 && (
                            <span className="text-white text-xs font-normal">{itemData.likes}</span>
                          )}
                        </motion.div>
                      </div>
                    </div>

                    {/* Dislikes bar */}
                    <div className="flex items-center gap-3">
                      <ThumbsDown className="size-4 text-red-400 flex-shrink-0" />
                      <div className="flex-1 bg-white/10 rounded-full h-6 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${100 - itemData.likePercentage}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                          className="bg-gradient-to-r from-red-400 to-red-500 h-full flex items-center justify-end pr-2"
                        >
                          {itemData.dislikes > 0 && (
                            <span className="text-white text-xs font-normal">{itemData.dislikes}</span>
                          )}
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Total votes */}
                  <div className="text-white/60 text-xs text-right mt-2">
                    Toplam {itemData.total} oy
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Player Summary */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 mb-6">
              <h3 className="text-white text-lg font-normal mb-4 text-center">👥 Oyuncu Özeti</h3>
              <div className="grid grid-cols-3 gap-3">
                {PLAYERS.map((player) => {
                  const playerResults = results.filter(r => r.playerId === player.id);
                  const likes = playerResults.filter(r => r.vote === "like").length;
                  
                  return (
                    <div 
                      key={player.id}
                      className="bg-white/5 rounded-xl p-3 text-center"
                    >
                      <div 
                        className="size-12 rounded-full flex items-center justify-center text-xl mx-auto mb-2"
                        style={{ backgroundColor: player.color }}
                      >
                        {player.avatar}
                      </div>
                      <div className="text-white text-sm font-normal mb-1">{player.name}</div>
                      <div className="text-green-400 text-xs">{likes} ❤️</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Back Button */}
            <div className="text-center">
              <button
                onClick={() => onComplete(results)}
                className="bg-white text-[#5e00c9] px-8 py-3 rounded-2xl font-normal hover:bg-gray-100 transition shadow-lg"
              >
                Geri Dön
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

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
          <div className="text-white text-sm">
            {currentIndex + 1} / {items.length}
          </div>
          <button
            onClick={handleUndo}
            disabled={results.length === 0}
            className={`p-2 bg-white/20 rounded-full transition ${
              results.length === 0 ? "opacity-50" : "hover:bg-white/30"
            }`}
          >
            <RotateCcw className="size-6 text-white" />
          </button>
        </div>

        {/* Player Panel */}
        <div className="max-w-md mx-auto mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="text-white/80 text-sm mb-3 text-center">Sıra Kimde?</div>
            <div className="flex justify-center gap-4">
              {PLAYERS.map((player, index) => (
                <motion.div
                  key={player.id}
                  className={`relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                    index === currentPlayerIndex
                      ? "bg-white/20 scale-110"
                      : "bg-white/5 opacity-60"
                  }`}
                  animate={{
                    scale: index === currentPlayerIndex ? 1.1 : 1,
                    opacity: index === currentPlayerIndex ? 1 : 0.6,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Glow effect for current player */}
                  {index === currentPlayerIndex && (
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: `linear-gradient(135deg, ${player.color}40, ${player.color}20)`,
                        boxShadow: `0 0 20px ${player.color}60`,
                      }}
                      animate={{
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                  
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <div
                      className="size-12 rounded-full flex items-center justify-center text-2xl"
                      style={{
                        backgroundColor: index === currentPlayerIndex ? player.color : `${player.color}40`,
                      }}
                    >
                      {player.avatar}
                    </div>
                    <div className="text-white text-xs font-normal">{player.name}</div>
                    {index < currentPlayerIndex && (
                      <div className="absolute -top-1 -right-1 bg-green-500 rounded-full size-5 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Card Stack */}
        <div className="relative h-[500px] max-w-md mx-auto mb-8">
          {/* Next card (preview) */}
          {currentIndex + 1 < items.length && (
            <div className="absolute inset-0 top-4">
              <div className="bg-white/50 rounded-3xl h-full transform scale-95 backdrop-blur-sm" />
            </div>
          )}

          {/* Current card */}
          <motion.div
            key={currentItem.id}
            className="absolute inset-0 bg-white rounded-3xl shadow-2xl p-8 flex flex-col justify-center items-center"
            initial={{ scale: 1, rotate: 0 }}
            style={{ x, rotate, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info: PanInfo) => {
              const offsetX = info.offset.x;
              const velocityX = info.velocity.x;
              const thresh = 120;

              if (offsetX > thresh || velocityX > 500) {
                handleVote("like");
              } else if (offsetX < -thresh || velocityX < -500) {
                handleVote("dislike");
              } else {
                // snap back
                animate(x, 0, { duration: 0.2 });
              }
            }}
          >
            {/* Vote indicator overlay */}
            {direction && (
              <div className={`absolute inset-0 rounded-3xl flex items-center justify-center ${
                direction === "right" ? "bg-green-500/20" : "bg-red-500/20"
              }`}>
                <div className={`text-6xl font-bold ${
                  direction === "right" ? "text-green-500" : "text-red-500"
                }`}>
                  {direction === "right" ? "👍" : "👎"}
                </div>
              </div>
            )}

            <div className="text-center">
              <div className="size-24 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">🎮</span>
              </div>
              <h2 className="text-2xl font-normal text-gray-800 mb-4">
                {currentItem.title}
              </h2>
              {currentItem.playerCount && (
                <p className="text-sm text-gray-600 mb-2">
                  👥 {currentItem.playerCount}
                </p>
              )}
              {currentItem.gameType && (
                <p className="text-sm text-gray-600">
                  🎯 {currentItem.gameType}
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 max-w-md mx-auto">
          <button
            onClick={() => handleVote("dislike")}
            className="size-16 bg-white rounded-full shadow-lg hover:scale-110 transition flex items-center justify-center"
          >
            <ThumbsDown className="size-8 text-red-500" />
          </button>
          <button
            onClick={() => handleVote("like")}
            className="size-16 bg-white rounded-full shadow-lg hover:scale-110 transition flex items-center justify-center"
          >
            <ThumbsUp className="size-8 text-green-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto mt-8">
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
