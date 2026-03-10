import { useState } from 'react';
import type { Cat } from './types';
import { CatCard } from './components/CatCard';
import { SwipeButtons } from './components/SwipeButtons';
import { StatsBar } from './components/StatsBar';
import catData from './data/catData.json';

type Screen = 'intro' | 'swipe' | 'summary';

function App() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [cats, setCats] = useState<Cat[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<Cat[]>([]);
  const [disliked, setDisliked] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Fetch 10 random cats from Cataas API
  const fetchCats = async () => {
    // Start loading
    console.log('Fetching cats...');
    setLoading(true);
    // Reset error state
    setError(false);
    try {
      // Random skip to get different cats each time (Cataas has ~2000 cats, limit skip to avoid overshooting)
      const skip = Math.floor(Math.random() * 90);
      console.log(`Calling Cataas API with skip=${skip}`);
      // Fetch the cats from the Cataas API with the skip seed
      const res = await fetch(`https://cataas.com/api/cats?limit=10&skip=${skip}`);
      console.log('Response status:', res.status, res.statusText);
      if (!res.ok) throw new Error(`Failed to fetch from Cataas: ${res.status} ${res.statusText}`);

      const data = await res.json();
      console.log('Data received from Cataas:', data);

      // Map array with cats
      const loadedCats: Cat[] = data.map((c: any) => {
        const randomName = catData.names[Math.floor(Math.random() * catData.names.length)];
        const randomAge = Math.floor(Math.random() * 5) + 1;
        // Pick 3 unique descriptions
        const shuffledDescs = [...catData.descriptions].sort(() => 0.5 - Math.random());
        const selectedDescs = shuffledDescs.slice(0, 3);

        return {
          id: c.id,
          url: `https://cataas.com/cat/${c.id}`,
          name: randomName,
          age: randomAge,
          descriptions: selectedDescs
        };
      });
      console.log('Loaded cats:', loadedCats);
      setCats(loadedCats);

      // Reset state for new run
      setCurrentIndex(0);
      setLiked([]);
      setDisliked([]);
    } catch (err) {
      console.error('Error fetching cats:', err);
      setError(true);
    } finally {
      setLoading(false);
      console.log('Fetching complete');
    }
  };

  // Start function for intro screen, initialize swipe screen
  const handleStart = () => {
    fetchCats();
    setScreen('swipe');
  };

  // Check if the user has reached the end of the cat array, if they did, change screen to the summary page
  const checkCompletion = (newIndex: number) => {
    if (newIndex >= 10) {
      setScreen('summary');
    }
  };

  // Handles like and dislike counts
  const handleLike = () => {
    if (currentIndex >= cats.length || !imageLoaded) return;
    setLiked(prev => [...prev, cats[currentIndex]]);
    const newIndex = currentIndex + 1;
    setImageLoaded(false);
    setCurrentIndex(newIndex);
    checkCompletion(newIndex);
  };

  const handleDislike = () => {
    if (currentIndex >= cats.length || !imageLoaded) return;
    setDisliked(prev => [...prev, cats[currentIndex]]);
    const newIndex = currentIndex + 1;
    setImageLoaded(false);
    setCurrentIndex(newIndex);
    checkCompletion(newIndex);
  };

  const handlePlayAgain = () => {
    setScreen('intro');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-4xl animate-bounce mb-4">🐾</div>
        <h2 className="text-xl font-bold text-gray-700">Loading cats...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Couldn't load cats! Come back later!</h2>
        <button
          onClick={handleStart}
          className="bg-amber-300 hover:bg-amber-400 text-amber-800 font-bold py-4 px-10 rounded-full shadow-lg transition-transform hover:scale-105 hover:-rotate-1 text-lg rotate-2"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (screen === 'intro') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center relative mt-16">
          <h1 className="text-4xl md:text-6xl font-black text-amber-900 bg-amber-300 p-4 rounded-xl absolute left-1/2 -translate-x-1/2 -rotate-3 -top-12 w-max z-10 whitespace-nowrap shadow-lg">
            Paws & Preferences
          </h1>
          <div className="pt-8">
            <p className="text-amber-600 mb-8 text-lg">
              Hey, welcome to <span className="font-bold text-amber-800">Paws & Preferences</span>! Looking for some furry friends to grace your screen today?
            </p>
            <p className="text-amber-600 mb-8 text-lg">
              Swipe right or click ❤️ if you like them, swipe left or click ✕ if you don't. You'll be able to see your favourites at the very end.
            </p>
            <button
              onClick={handleStart}
              className="bg-amber-300 hover:bg-amber-400 text-amber-800 font-bold py-4 px-10 rounded-full shadow-lg transition-transform hover:scale-105 hover:-rotate-1 text-lg rotate-2"
            >
              I want to see some cats!
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'swipe') {
    const currentCat = cats[currentIndex];

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        {currentCat ? (
          <div className="w-full max-w-6xl flex flex-col items-center">

            <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
              {/* Name and Age */}
              <div className="hidden md:flex flex-col items-end text-right w-64">
                <h2 className="text-6xl font-black text-amber-900 bg-amber-300 p-4 rounded-xl -rotate-3 mb-2 shadow-lg">
                  {currentCat.name}
                </h2>
                <p className="text-3xl font-bold text-amber-800 bg-amber-200 px-4 py-2 rotate-2 rounded-lg shadow-md">
                  Age: {currentCat.age}
                </p>
              </div>

              {/* Cat Card */}
              <div className="w-full max-w-md relative md:mt-0">
                <StatsBar
                  likedCount={liked.length}
                  dislikedCount={disliked.length}
                  remainingCount={10 - currentIndex}
                />
                <CatCard
                  cat={currentCat}
                  onLike={handleLike}
                  onDislike={handleDislike}
                  imageLoaded={imageLoaded}
                  setImageLoaded={setImageLoaded}
                />

                {/* Mobile-only Name Display and Descriptions */}
                <div className="md:hidden mt-4 text-center flex flex-col items-center gap-3 w-full px-2">
                  <h2 className="text-4xl font-black text-amber-900">{currentCat.name}, {currentCat.age}</h2>
                  <div className="flex flex-wrap justify-center gap-2">
                    {currentCat.descriptions.map((desc, i) => {
                      const rotations = ['rotate-1', '-rotate-1', 'rotate-1'];
                      const bgs = ['bg-amber-100', 'bg-white', 'bg-amber-50'];
                      return (
                        <span
                          key={i}
                          className={`${bgs[i]} ${rotations[i]} px-3 py-1.5 text-amber-900 text-md rounded-xl shadow font-medium w-90`}
                        >
                          {desc}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Descriptions */}
              <div className="hidden md:flex flex-col gap-6 w-64 items-start">
                {currentCat.descriptions.map((desc, i) => {
                  const rotations = ['rotate-3', '-rotate-2', 'rotate-1'];
                  const bgs = ['bg-amber-100', 'bg-white', 'bg-amber-50'];
                  return (
                    <div
                      key={i}
                      className={`${bgs[i]} ${rotations[i]} p-4 rounded-xl shadow-md transform hover:scale-105 transition-transform`}
                    >
                      <p className="text-amber-900 text-lg"> {desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <SwipeButtons
              onLike={handleLike}
              onDislike={handleDislike}
              disabled={!imageLoaded}
            />
          </div>
        ) : (
          <div className="text-gray-500">Wait a moment...</div>
        )}
      </div>
    );
  }

  if (screen === 'summary') {
    if (liked.length === 0) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
          <div className="text-6xl mb-4 text-amber-900 bg-amber-300 p-4 rounded-xl rotate-2 shadow-lg">:(</div>
          <h2 className="text-2xl font-bold text-gr\ay-800 mb-2">Hmmm, not fond of any cats I assume?</h2>
          <p className="text-gray-600 mb-6">That's okay, maybe the next batch will have better luck.</p>
          <button
            onClick={handlePlayAgain}
            className="bg-amber-300 hover:bg-amber-400 text-amber-800 font-bold py-4 px-10 rounded-full shadow-lg transition-transform hover:scale-105 hover:-rotate-1 text-lg rotate-2"
          >
            Wanna go again?
          </button>
        </div>
      );
    }

    const [attentionCatcher, ...remainingLiked] = liked;

    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-4 bg-amber-200 rotate-1 p-2">
              Out of 10 cats, you liked {liked.length} of 'em!
            </h2>
            <p className="text-gray-600 text-lg bg-amber-300 -rotate-2 p-2 w-100 mx-auto">Now let's see the little rascals that managed to catch your attention.</p>
          </div>

          <div className="flex flex-wrap">
            {/* Attention Catcher */}
            <div className="w-full mb-4">
              <div className="relative bg-amber-300 p-2 rounded-xl shadow-md transform hover:-translate-y-1 transition-transform rotate-1 overflow-hidden">
                {/* Background shine bars */}
                <div className="absolute top-[-50%] left-[5%] md:left-[15%] w-24 md:w-32 h-[200%] bg-amber-100 opacity-90 rotate-24 z-0 pointer-events-none"></div>
                <div className="absolute top-[-50%] left-[40%] md:left-[40%] w-6 md:w-8 h-[200%] bg-amber-100 opacity-90 rotate-24 z-0 pointer-events-none"></div>
                <div className="absolute top-[-50%] left-[90%] md:left-[90%] w-6 md:w-8 h-[200%] bg-amber-100 opacity-90 rotate-24 z-0 pointer-events-none"></div>
                <a href={attentionCatcher.url} target="_blank" rel="noopener noreferrer" className="block cursor-zoom-in">
                  <img
                    src={attentionCatcher.url}
                    alt="Your top favorite cat"
                    className="relative w-full h-80 md:h-96 object-cover rounded-lg z-10"
                  />
                </a>
                <div className="relative z-10 p-4">
                  <h3 className="text-3xl font-black text-amber-900 mb-2">{attentionCatcher.name}, {attentionCatcher.age}</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {attentionCatcher.descriptions.map((desc, i) => (
                      <span key={i} className="bg-white text-amber-900 px-3 py-1 rounded-full text-sm font-medium rotate-2">
                        {desc}
                      </span>
                    ))}
                  </div>
                  <div className="text-center mt-4 text-amber-800 italic opacity-75">
                    "The first cat that managed to catch your attention!"
                  </div>
                </div>
              </div>
            </div>

            {/* Remaining liked cats - 2 columns mobile, 3 columns desktop */}
            {remainingLiked.map((cat, idx) => {
              // Alternate slight rotations for polaroid effect
              const rotations = ['rotate-[-2deg]', 'rotate-[2deg]', 'rotate-0'];
              const rotation = rotations[idx % 3];

              return (
                <div key={idx} className={`w-1/2 md:w-1/3 px-2 mb-4`}>
                  <div className={`bg-white p-2 rounded-xl shadow-md transform hover:-translate-y-1 transition-transform ${rotation}`}>
                    <a href={cat.url} target="_blank" rel="noopener noreferrer" className="block cursor-zoom-in">
                      <img
                        src={cat.url}
                        alt="A liked cat"
                        className="w-full h-48 md:h-64 object-cover rounded-lg"
                      />
                    </a>
                    <div className="p-3 text-center">
                      <h4 className="font-bold text-amber-900">{cat.name}, {cat.age}</h4>
                      <p className="text-sm text-amber-700 mt-1">{cat.descriptions[0]}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12 mb-8">
            <button
              onClick={handlePlayAgain}
              className="bg-amber-300 hover:bg-amber-400 text-amber-800 font-bold py-4 px-10 rounded-full shadow-lg transition-transform hover:scale-105 hover:rotate-1 text-lg rotate-3"
            >
              Another round?
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default App;
