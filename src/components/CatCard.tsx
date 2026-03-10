import { useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import type { Cat } from '../types';

interface CatCardProps {
  cat: Cat;
  onLike: () => void;
  onDislike: () => void;
  imageLoaded: boolean;
  setImageLoaded: (loaded: boolean) => void;
}

export function CatCard({ cat, onLike, onDislike, imageLoaded, setImageLoaded }: CatCardProps) {
  // Reset loading state when the cat changes
  useEffect(() => {
    setImageLoaded(false);
  }, [cat.id, setImageLoaded]);

  const handlers = useSwipeable({
    onSwipedLeft: () => { if (imageLoaded) onDislike(); },
    onSwipedRight: () => { if (imageLoaded) onLike(); },
    preventScrollOnSwipe: true,
    trackMouse: false,
  });

  return (
    <div
      {...handlers}
      className="w-full max-w-md mx-auto h-[500px] md:h-auto md:aspect-[3/4] relative bg-white rounded-2xl shadow-xl overflow-hidden touch-none"
    >
      {/* Loading Overlay */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-amber-100 z-10 transition-opacity duration-300">
          <div className="text-5xl animate-bounce mb-2">🐾</div>
          <div className="text-amber-900 font-medium animate-pulse text-lg bg-amber-200 rotate-1 p-2">Loading next cat...</div>
        </div>
      )}

      {/* Cat Image */}
      <a
        href={cat.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`block w-full h-full cursor-zoom-in transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
      >
        <img
          src={cat.url}
          alt="Cat"
          onLoad={() => setImageLoaded(true)}
          className="w-full h-full object-cover pointer-events-none rounded-xl"
          draggable={false}
        />
      </a>

      {/* Swipe indicators for mobile view */}
      <div className="md:hidden absolute bottom-5 left-4 w-max px-4 py-1 pointer-events-none text-amber-800 font-bold drop-shadow-md text-lg z-20 bg-amber-300 -rotate-5 rounded shadow">
        <span>← Swipe ✕</span>
      </div>
      <div className="md:hidden absolute bottom-5 right-4 w-max px-4 py-1 pointer-events-none text-amber-800 font-bold drop-shadow-md text-lg z-20 bg-amber-300 rotate-5 rounded shadow">
        <span>Swipe ❤️ →</span>
      </div>
    </div>
  );
}
