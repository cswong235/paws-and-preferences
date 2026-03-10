interface SwipeButtonsProps {
  onLike: () => void;
  onDislike: () => void;
  disabled: boolean;
}

export function SwipeButtons({ onLike, onDislike, disabled }: SwipeButtonsProps) {
  return (
    <div className="hidden md:flex w-full max-w-md mx-auto justify-center gap-8 mt-6">
      <button
        onClick={onDislike}
        disabled={disabled}
        className={`w-16 h-16 rounded-full bg-white text-red-500 text-3xl flex items-center justify-center shadow-lg transition-all outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50 hover:scale-105'}`}
        aria-label="Dislike"
      >
        ✕
      </button>
      <button
        onClick={onLike}
        disabled={disabled}
        className={`w-16 h-16 rounded-full bg-white text-green-500 text-3xl flex items-center justify-center shadow-lg transition-all outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-50 hover:scale-105'}`}
        aria-label="Like"
      >
        ❤️
      </button>
    </div>
  );
}
