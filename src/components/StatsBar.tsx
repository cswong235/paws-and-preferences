interface StatsBarProps {
  likedCount: number;
  dislikedCount: number;
  remainingCount: number;
}

export function StatsBar({ likedCount, dislikedCount, remainingCount }: StatsBarProps) {
  return (
    <div className="absolute -top-8 left-0 right-0 z-20 flex justify-between items-center px-2 pointer-events-none">
      <div className="flex items-center gap-1 text-green-900 bg-green-300 px-3 py-1 -rotate-6 font-bold w-1/3 justify-center">
        <span className="text-xl">❤️</span> <span className="text-3xl text-white font-black">{likedCount}</span><span className="text-sm">/10</span>
      </div>

      <div className="flex items-center gap-1 text-amber-900 bg-amber-300 px-4 py-1 font-black scale-110 w-1/3 justify-center z-10">
        <span className="text-xl">🐾</span> <span className="text-3xl text-white font-black">{remainingCount}</span><span className="text-sm">left</span>
      </div>
      <div className="flex items-center gap-1 text-red-900 bg-red-300 px-3 py-1 rotate-6 font-bold w-1/3 justify-center">
        <span className="text-3xl text-white font-black">{dislikedCount}</span><span className="text-sm">/10</span> <span className="text-xl">✕</span>
      </div>
    </div>
  );
}
