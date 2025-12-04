"use client";

import React, { useState } from "react";
import { motion, useMotionValue, useTransform, animate, PanInfo } from "framer-motion";
import { ThumbsUp, ThumbsDown, X, RotateCcw } from "lucide-react";

interface SwipeItem {
  id: string;
  title: string;
  playerCount?: string;
  gameType?: string;
}

interface SwipeResult {
  itemId: string;
  vote: "like" | "dislike";
}

interface SwipeModProps {
  items: SwipeItem[];
  onComplete: (results: SwipeResult[]) => void;
  onBack: () => void;
}

export default function SwipeMode({ items, onComplete, onBack }: SwipeModProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<SwipeResult[]>([]);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  const currentItem = items[currentIndex];
  const isFinished = currentIndex >= items.length;

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const opacity = useTransform(x, [-250, 0, 250], [0.6, 1, 0.6]);

  const handleVote = (vote: "like" | "dislike") => {
    if (isFinished) return;

    const newResult: SwipeResult = {
      itemId: currentItem.id,
      vote,
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
        onComplete(newResults);
      } else {
        setCurrentIndex(currentIndex + 1);
        setDirection(null);
        x.set(0);
      }
    }, 300);
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setResults(results.slice(0, -1));
      setDirection(null);
      x.set(0);
    }
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#5e00c9] to-[#7a1aff] flex items-center justify-center p-4 font-['Galindo']">
        <div className="text-center text-white">
          <div className="size-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ThumbsUp className="size-10 text-white" />
          </div>
          <h2 className="text-3xl font-normal mb-4">Oylama Tamamlandı!</h2>
          <p className="text-white/80 mb-6">
            {results.filter(r => r.vote === "like").length} beğeni, {results.filter(r => r.vote === "dislike").length} beğenmeme
          </p>
        </div>
      </div>
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
            disabled={currentIndex === 0}
            className={`p-2 bg-white/20 rounded-full transition ${
              currentIndex === 0 ? "opacity-50" : "hover:bg-white/30"
            }`}
          >
            <RotateCcw className="size-6 text-white" />
          </button>
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
