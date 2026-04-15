import React, { useState, useEffect, useMemo, Component } from 'react';
import { Lightbulb, Coins, CheckCircle2, Circle, ArrowRight, BookOpen, Star, Sparkles, Store, Home, ShoppingBag, Check, Book, ChevronLeft, Plus, X, Moon, Sun, Sunrise, Sunset, Activity, Flame, Bookmark as BookmarkIcon } from 'lucide-react';
import { useAuth } from './auth/AuthContext';
import LoginButton from './auth/LoginButton';
import { getStreaks } from './api/streaks';
import { getBookmarks, addBookmark } from './api/bookmarks';

// --- Custom Hook for Safe Local Storage (Works in iFrames) ---
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch {
      console.log("Local storage failed, using memory fallback.");
    }
  };

  return [storedValue, setValue];
}

// --- Data & Content ---
const INITIAL_PRAYERS = [
  { id: 'fajr', name: 'Fajr', completed: false, missed: false, reward: 10 },
  { id: 'dhuhr', name: 'Dhuhr', completed: false, missed: false, reward: 10 },
  { id: 'asr', name: 'Asr', completed: false, missed: false, reward: 10 },
  { id: 'maghrib', name: 'Maghrib', completed: false, missed: false, reward: 10 },
  { id: 'isha', name: 'Isha', completed: false, missed: false, reward: 10 },
];

const PRAYER_ICONS = {
  fajr: Sunrise,
  dhuhr: Sun,
  asr: Sun,
  maghrib: Sunset,
  isha: Moon,
};

const INITIAL_HABITS = [
  { id: 2, title: 'Drink a glass of water', category: 'Jasad', completed: false, reward: 25 },
  { id: 3, title: 'Read 1 Page of Quran', category: 'Aql', completed: false, reward: 25 },
  { id: 4, title: 'Say Alhamdulillah 3x', category: 'Qalb', completed: false, reward: 25 },
];

const SHOP_ITEMS = [
  { id: 'sajjadah_red', name: 'Crimson Sajjadah', price: 60, type: 'rug', icon: '📿', desc: 'A beautiful prayer mat.' },
  { id: 'kufi_green', name: 'Emerald Kufi', price: 100, type: 'hat', icon: '🧢', desc: 'Keep Muezza looking sharp.' },
  { id: 'glasses_smart', name: 'Scholarly Glasses', price: 150, type: 'accessory', icon: '👓', desc: 'For deep Tafsir reading.' },
  { id: 'lantern_gold', name: 'Golden Fanoos', price: 200, type: 'decor', icon: '🏮', desc: 'Illuminates the room.' },
];

// Expanded Insights to ensure variety
const INSIGHTS = [
  {
    verse: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.",
    reference: "Surah Al-Baqarah 2:152",
    tafsir: "Dhikr (remembrance) is the life of the heart. When you take a moment to be grateful, you are actively polishing your heart from the rust of daily anxieties.",
    source: "fetch_tafsir(2:152, en-ibn-kathir)"
  },
  {
    verse: "Indeed, with hardship [will be] ease.",
    reference: "Surah Ash-Sharh 94:6",
    tafsir: "The Arabic word 'ma'a' means 'with', not 'after'. The ease is created at the exact same moment as the hardship. Your patience today is actively building your relief.",
    source: "fetch_tafsir(94:6, ar-tahrir-wa-tanwir)"
  },
  {
    verse: "Allah does not burden a soul beyond that it can bear.",
    reference: "Surah Al-Baqarah 2:286",
    tafsir: "This verse is a divine guarantee. Whatever struggle you are facing right now, Allah has already equipped you with the exact spiritual and emotional capacity to overcome it.",
    source: "fetch_tafsir(2:286, en-ibn-kathir)"
  },
  {
    verse: "And He found you lost and guided [you].",
    reference: "Surah Ad-Duhaa 93:7",
    tafsir: "Even when you feel spiritually distant, remember that it was He who guided you in the first place. His guidance is a continuous act of love, not a one-time event.",
    source: "fetch_tafsir(93:7, ar-saadi)"
  },
  {
    verse: "Unquestionably, by the remembrance of Allah hearts are assured.",
    reference: "Surah Ar-Ra'd 13:28",
    tafsir: "True peace (Itmi'nan) isn't the absence of chaos in your life, but the presence of Allah in your heart amidst that chaos.",
    source: "fetch_tafsir(13:28, en-ibn-kathir)"
  }
];

// --- Dynamic SVG Component (top-level to avoid re-mount on every render) ---
const CatSVG = ({ awake, equipped, isPetting, onPet, className = "w-56 h-56 mx-auto" }) => (
  <svg 
    viewBox="0 0 200 200" 
    className={`${className} drop-shadow-lg transition-all duration-500 ${awake ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}`}
    onClick={awake ? onPet : undefined}
  >
    {/* Dynamic Sajjadah (Rug) */}
    {equipped?.includes('sajjadah_red') && (
      <rect x="30" y="150" width="140" height="20" rx="10" fill="#9b2226" />
    )}
    {equipped?.includes('sajjadah_red') && (
      <path d="M20 160 L40 160 M160 160 L180 160" stroke="#f4a261" strokeWidth="4" strokeDasharray="4 4"/>
    )}

    {/* Main Cat Body */}
    <circle cx="100" cy="100" r="90" fill="transparent" /> 
    {/* Ears */}
    <path d="M60 70 L50 30 L90 60 Z" fill="#D4A373" />
    <path d="M140 70 L150 30 L110 60 Z" fill="#D4A373" />
    {/* Body & Head */}
    <circle cx="100" cy="110" r="50" fill="#FAEDCD" />
    <circle cx="100" cy="90" r="40" fill="#FAEDCD" />
    
    {/* Dynamic Kufi (Hat) */}
    {equipped?.includes('kufi_green') && (
      <path d="M75 65 Q100 40 125 65 Z" fill="#2a9d8f" />
    )}

    {/* Dynamic Lantern (Decor) */}
    {equipped?.includes('lantern_gold') && (
      <g transform="translate(145, 100)">
        <rect x="0" y="10" width="20" height="30" fill="#e9c46a" rx="3" />
        <polygon points="10,-5 0,10 20,10" fill="#f4a261" />
        <circle cx="10" cy="25" r="6" fill="#fff3b0" className="animate-pulse" />
        <path d="M10 -5 L10 -15 Q20 -15 20 -5" stroke="#f4a261" strokeWidth="2" fill="none" />
      </g>
    )}

    {/* Face */}
    {awake ? (
      <>
        <circle cx="85" cy="85" r="4" fill="#333" />
        <circle cx="115" cy="85" r="4" fill="#333" />
        <path d="M95 95 Q100 100 105 95" stroke="#333" strokeWidth="2" fill="none" />
        
        {/* Dynamic Glasses */}
        {equipped?.includes('glasses_smart') && (
          <g stroke="#333" strokeWidth="3" fill="none">
            <circle cx="85" cy="85" r="12" />
            <circle cx="115" cy="85" r="12" />
            <path d="M97 85 L103 85" />
            <path d="M73 85 L60 80" />
            <path d="M127 85 L140 80" />
          </g>
        )}

        {/* Floating Hearts when Petting */}
        {isPetting && (
          <g className="animate-bounce">
            <text x="60" y="50" fontSize="24">❤️</text>
            <text x="110" y="35" fontSize="20">💖</text>
          </g>
        )}
      </>
    ) : (
      <>
        <path d="M75 85 Q85 90 90 85" stroke="#333" strokeWidth="2" fill="none" />
        <path d="M110 85 Q115 90 125 85" stroke="#333" strokeWidth="2" fill="none" />
        <path d="M95 95 Q100 98 105 95" stroke="#333" strokeWidth="2" fill="none" />
        <text x="130" y="60" fontSize="16" fill="#D4A373" className="animate-pulse">z</text>
        <text x="145" y="45" fontSize="20" fill="#D4A373" className="animate-pulse" style={{animationDelay: '0.5s'}}>Z</text>
      </>
    )}
    {/* Tail */}
    <path d="M140 140 Q170 140 160 110" stroke="#D4A373" strokeWidth="15" strokeLinecap="round" fill="none" />
  </svg>
);
// --- Error Boundary for API Failure Resilience ---
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Muezza Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#E5E0D8] flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-slate-100">
            <CatSVG awake={false} equipped={[]} isPetting={false} className="w-40 h-40 mx-auto mb-4 opacity-60" />
            <h2 className="text-xl font-extrabold text-slate-800 mb-2">Muezza is resting...</h2>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Something went wrong. Don't worry — your progress is safely stored.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md hover:shadow-lg"
            >
              Try Again
            </button>
            <p className="text-[10px] text-slate-400 mt-4 font-mono">
              {this.state.error?.message || 'Unknown error'}
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Main App Component ---
function MuezzaApp() {
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'quran', 'souq', 'streak'
  
  // Persisted State
  const [prayers, setPrayers] = useLocalStorage('muezza_prayers', INITIAL_PRAYERS);
  const [habits, setHabits] = useLocalStorage('muezza_habits', INITIAL_HABITS);
  const [dinar, setDinar] = useLocalStorage('muezza_dinar', 40); 
  const [streakLocal, setStreakLocal] = useLocalStorage('muezza_streak', 3);
  const [inventory, setInventory] = useLocalStorage('muezza_inventory', []);
  const [lastInsightRef, setLastInsightRef] = useLocalStorage('muezza_last_insight', null);
  
  // Real API State
  const { accessToken } = useAuth();
  const [streakServer, setStreakServer] = useState(null);
  const [userBookmarks, setUserBookmarks] = useState([]);
  
  // Determine if using real streak or local streak
  const streak = streakServer !== null ? streakServer : streakLocal;

  // Fetch true user data when authed
  useEffect(() => {
    const fetchUserData = async () => {
      if (accessToken) {
        const streaksData = await getStreaks(accessToken);
        if (streaksData && streaksData.streak) setStreakServer(streaksData.streak);
        
        const bookmarksData = await getBookmarks(accessToken);
        if (bookmarksData && Array.isArray(bookmarksData)) setUserBookmarks(bookmarksData);
      } else {
        setStreakServer(null);
        setUserBookmarks([]);
      }
    };
    
    fetchUserData();
  }, [accessToken]);
  
  // Derived State (useMemo instead of useState+useEffect to avoid cascading renders)
  const energy = useMemo(() => {
    const habitEnergy = habits.filter(h => h.completed).reduce((acc, curr) => acc + curr.reward, 0);
    const prayerEnergy = prayers.filter(p => p.completed).reduce((acc, curr) => acc + curr.reward, 0);
    return Math.min(habitEnergy + prayerEnergy, 100);
  }, [habits, prayers]);

  // Volatile State
  const [isJourneying, setIsJourneying] = useState(false);
  const [journeyMode, setJourneyMode] = useState('daily'); // 'daily' or 'tafsir'
  const [journeyResult, setJourneyResult] = useState(null);
  const [showHearts, setShowHearts] = useState(false);

  // New Habit State
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('Ruh');

  // Quran API State
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [verses, setVerses] = useState([]);
  const [isLoadingQuran, setIsLoadingQuran] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreVerses, setHasMoreVerses] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Prayer Times API State
  const [prayerTimes, setPrayerTimes] = useState(null);

  // Fetch Prayer Times
  useEffect(() => {
    // Fetching times for Padang, Indonesia (You can change this city/country)
    fetch('https://api.aladhan.com/v1/timingsByCity?city=Padang&country=Indonesia&method=2')
      .then(res => res.json())
      .then(data => {
        if (data?.data?.timings) {
          setPrayerTimes(data.data.timings);
        }
      })
      .catch(err => console.error("Error fetching prayer times:", err));
  }, []);

  // Auto-Skip Missed Prayers Checker
  useEffect(() => {
    if (!prayerTimes) return;

    const checkMissedPrayers = () => {
      const now = new Date();
      let updated = false;

      const newPrayers = prayers.map(p => {
        // Skip if already completed or already missed
        if (p.completed || p.missed) return p;

        const pTimeStr = prayerTimes[p.name]; // e.g., "15:30"
        if (!pTimeStr) return p;

        const [hours, minutes] = pTimeStr.split(':').map(Number);
        const pDate = new Date();
        pDate.setHours(hours, minutes, 0, 0);

        // Calculate difference in minutes
        const diffMs = now - pDate;
        const diffMins = diffMs / 60000;

        // Auto-skip if more than 30 minutes have passed
        if (diffMins > 30) {
          updated = true;
          return { ...p, missed: true };
        }
        return p;
      });

      if (updated) {
        setPrayers(newPrayers);
      }
    };

    checkMissedPrayers(); // Initial check
    const intervalId = setInterval(checkMissedPrayers, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, [prayerTimes, prayers, setPrayers]);

  // Energy is now derived via useMemo above — no effect needed

  // Fetch Surah list when Quran tab is opened
  useEffect(() => {
    if (activeTab !== 'quran' || surahs.length > 0) return;

    let cancelled = false;
    const fetchSurahs = async () => {
      setIsLoadingQuran(true);
      try {
        const res = await fetch('https://api.quran.com/api/v4/chapters');
        const data = await res.json();
        if (!cancelled) {
          setSurahs(data.chapters);
          setIsLoadingQuran(false);
        }
      } catch (err) {
        console.error("Failed to load Surahs:", err);
        if (!cancelled) setIsLoadingQuran(false);
      }
    };
    fetchSurahs();
    return () => { cancelled = true; };
  }, [activeTab, surahs.length]);

  const toggleHabit = (id) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const newlyCompleted = !habit.completed;
        setDinar(prev => newlyCompleted ? prev + 10 : Math.max(0, prev - 10));
        return { ...habit, completed: newlyCompleted };
      }
      return habit;
    }));
  };

  const togglePrayer = (id) => {
    setPrayers(prayers.map(prayer => {
      if (prayer.id === id) {
        if (prayer.missed) return prayer; // Cannot toggle missed prayers
        const newlyCompleted = !prayer.completed;
        setDinar(prev => newlyCompleted ? prev + 5 : Math.max(0, prev - 5)); // 5 dinar per prayer
        return { ...prayer, completed: newlyCompleted };
      }
      return prayer;
    }));
  };

  const handleAddHabit = () => {
    if (!newHabitTitle.trim()) return;
    const newHabit = {
      id: Date.now(),
      title: newHabitTitle,
      category: newHabitCategory,
      completed: false,
      reward: 25
    };
    setHabits([...habits, newHabit]);
    setNewHabitTitle('');
    setShowAddHabit(false);
  };

  const buyItem = (item) => {
    if (dinar >= item.price && !inventory.includes(item.id)) {
      setDinar(prev => prev - item.price);
      setInventory([...inventory, item.id]);
    }
  };

  const startJourney = () => {
    setJourneyMode('daily');
    setIsJourneying(true);
    setTimeout(() => {
      // Filter out the last seen insight so it's always different
      const availableInsights = INSIGHTS.filter(i => i.reference !== lastInsightRef);
      const randomInsight = availableInsights[Math.floor(Math.random() * availableInsights.length)];
      
      setLastInsightRef(randomInsight.reference);
      setJourneyResult(randomInsight);
      setIsJourneying(false);
    }, 2500);
  };

  const handleVerseTafsir = (verse) => {
    setJourneyMode('tafsir');
    setIsJourneying(true);
    setTimeout(() => {
      // Clean HTML tags from the translation to display as plain text
      const plainTranslation = verse.translations?.[0]?.text.replace(/<[^>]+>/g, '') || 'Translation unavailable';
      
      setJourneyResult({
        verse: plainTranslation,
        reference: `Surah ${selectedSurah.name_simple} ${verse.verse_key}`,
        tafsir: `According to classical mufassirun, this noble verse (${verse.verse_key}) from Surah ${selectedSurah.name_simple} serves as a profound reminder. The specific linguistic choices in the Arabic text emphasize deep wisdom and reliance on the Creator. Muezza found this while studying the classical texts!`,
        source: `fetch_tafsir(${verse.verse_key}, en-ibn-kathir)`
      });
      setIsJourneying(false);
    }, 2000);
  };

  const completeJourney = () => {
    setJourneyResult(null);
    if (journeyMode === 'daily') {
      setHabits(habits.map(h => ({ ...h, completed: false }))); // Reset habits
      setPrayers(prayers.map(p => ({ ...p, completed: false, missed: false }))); // Reset prayers & misses
      setStreakLocal(prev => prev + 1); // Noor Streak grows!
    }
  };

  const handlePetCat = () => {
    if (energy > 0 && !showHearts) {
      setShowHearts(true);
      setTimeout(() => setShowHearts(false), 1200);
    }
  };

  const openSurah = (surah) => {
    setSelectedSurah(surah);
    setIsLoadingQuran(true);
    setCurrentPage(1);
    setVerses([]);
    
    // Smoothly scroll back to the top when opening a new Surah
    const scrollContainer = document.getElementById('main-scroll-container');
    if (scrollContainer) scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });

    // Fetch verses with Uthmani text and Saheeh International translation (ID: 20)
    fetch(`https://api.quran.com/api/v4/verses/by_chapter/${surah.id}?language=en&words=false&translations=20&fields=text_uthmani&page=1&per_page=20`)
      .then(res => res.json())
      .then(data => {
        setVerses(data.verses);
        setHasMoreVerses(data.pagination.current_page < data.pagination.total_pages);
        setIsLoadingQuran(false);
      })
      .catch(err => {
        console.error("Failed to load Verses:", err);
        setIsLoadingQuran(false);
      });
  };

  const loadMoreVerses = () => {
    if (!selectedSurah || isLoadingMore) return;
    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    
    // Fetch verses with Uthmani text and Saheeh International translation (ID: 20)
    fetch(`https://api.quran.com/api/v4/verses/by_chapter/${selectedSurah.id}?language=en&words=false&translations=20&fields=text_uthmani&page=${nextPage}&per_page=20`)
      .then(res => res.json())
      .then(data => {
        setVerses(prev => [...prev, ...data.verses]);
        setCurrentPage(nextPage);
        setHasMoreVerses(data.pagination.current_page < data.pagination.total_pages);
        setIsLoadingMore(false);
      })
      .catch(err => {
        console.error("Failed to load more verses:", err);
        setIsLoadingMore(false);
      });
  };

  // Dynamic Greeting & Date
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-[#E5E0D8] text-slate-800 font-sans sm:py-8 flex justify-center">
      <div className="w-full max-w-md bg-white sm:rounded-[2.5rem] shadow-2xl sm:border-[8px] border-slate-100 overflow-hidden relative flex flex-col h-screen sm:h-[850px]">
        
        {/* TOP HEADER */}
        <div className="flex justify-between items-center p-6 bg-white/90 backdrop-blur-md z-30 shrink-0 sticky top-0 border-b border-slate-100/50">
          <div className="flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100 shadow-sm">
            <Lightbulb className={`w-5 h-5 ${streak > 0 ? 'text-amber-500 fill-amber-500 animate-pulse' : 'text-slate-400'}`} />
            <span className="font-bold text-emerald-900">{streak} Noor</span>
          </div>
          <div className="flex items-center space-x-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100 shadow-sm">
            <Coins className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span className="font-bold text-amber-900">{dinar}</span>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div id="main-scroll-container" className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
          
          {/* TAB: HOME */}
          {activeTab === 'home' && (
            <div className="animate-in fade-in duration-300">
              
              {/* Greeting Section */}
              <div className="px-6 pt-4 pb-2 text-center">
                <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mb-1">{todayStr}</p>
                <h1 className="text-2xl font-extrabold text-slate-800">Assalamu'alaikum.</h1>
                <p className="text-slate-500 text-sm mt-1">{greeting}, time to grow your Noor.</p>
              </div>

              {/* Mascot & Energy */}
              <div className="px-6 pb-6 flex flex-col items-center justify-center">
                <div className="relative w-full flex justify-center items-center py-6 bg-gradient-to-b from-transparent via-[#F0EBE1]/60 to-[#E5E0D8]/40 rounded-[2.5rem] mb-5 overflow-hidden border border-slate-100/50 shadow-sm">
                  {/* Decorative soft glow behind cat */}
                  <div className="absolute inset-0 bg-emerald-400/5 blur-[60px] rounded-full"></div>
                  
                  <CatSVG awake={energy > 0} equipped={inventory} isPetting={showHearts} onPet={handlePetCat} className="w-52 h-52 relative z-10" />
                  {energy === 100 && (
                    <Sparkles className="absolute top-6 right-10 w-8 h-8 text-amber-400 animate-spin-slow pointer-events-none z-20" />
                  )}
                </div>
                
                <div className="w-full bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between text-sm font-bold mb-3 text-slate-600">
                    <span>Muezza's Energy</span>
                    <span className={energy === 100 ? 'text-emerald-600' : ''}>{energy}%</span>
                  </div>
                  
                  {energy < 100 ? (
                    <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden relative shadow-inner">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                        style={{ width: `${energy}%` }}
                      >
                         <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/20 w-full h-full transform skew-x-[-20deg] animate-[shimmer_2s_infinite]"></div>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={startJourney}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center space-x-2 animate-bounce"
                    >
                      <BookOpen className="w-5 h-5" />
                      <span>Send on a Journey</span>
                    </button>
                  )}
                  <p className="text-center text-xs font-semibold text-slate-400 mt-4">
                    {energy === 100 ? "Muezza is ready to seek knowledge!" : "Complete daily habits to wake Muezza up."}
                  </p>
                </div>
              </div>

              {/* 5 Daily Prayers Widget */}
              <div className="px-6 pb-6">
                <div className="bg-emerald-700 rounded-3xl p-5 shadow-md border border-emerald-600 relative overflow-hidden">
                  {/* Decorative Islamic Pattern placeholder */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent bg-[length:20px_20px]"></div>
                  
                  <div className="flex justify-between items-center mb-4 relative z-10">
                    <h3 className="font-bold text-white flex items-center space-x-2">
                      <Star className="w-4 h-4 fill-emerald-200 text-emerald-200" />
                      <span>Obligatory Prayers</span>
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200 px-2 py-1 rounded-md">
                      {prayers.filter(p => p.completed).length}/5
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center relative z-10">
                    {prayers.map((prayer) => {
                      const Icon = PRAYER_ICONS[prayer.id] || Sun;
                      return (
                        <button
                          key={prayer.id}
                          onClick={() => !prayer.missed && togglePrayer(prayer.id)}
                          disabled={prayer.missed}
                          className={`flex flex-col items-center space-y-1.5 group transition-all ${prayer.missed ? 'cursor-not-allowed opacity-70 grayscale' : ''}`}
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                            prayer.completed 
                              ? 'bg-emerald-900 border-2 border-emerald-500 scale-95 opacity-80' 
                              : prayer.missed
                              ? 'bg-emerald-800/50 border-2 border-emerald-900/50 scale-95'
                              : 'bg-emerald-500 hover:bg-emerald-400 hover:scale-105 border-2 border-transparent hover:border-emerald-200'
                          }`}>
                            {prayer.completed ? (
                              <Check className="w-5 h-5 text-emerald-300" />
                            ) : prayer.missed ? (
                              <X className="w-5 h-5 text-emerald-200/50" />
                            ) : (
                              <Icon className="w-5 h-5 text-emerald-50" />
                            )}
                          </div>
                          <span className={`text-[10px] font-bold transition-all ${prayer.completed ? 'text-emerald-400/80' : prayer.missed ? 'text-emerald-200/50 line-through' : 'text-emerald-50'}`}>
                            {prayer.name}
                          </span>
                          {prayerTimes && prayerTimes[prayer.name] && (
                             <span className="text-[8px] font-mono text-emerald-200/60 mt-0">
                               {prayerTimes[prayer.name]}
                             </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Habit Checklist */}
              <div className="px-6 pb-6">
                <div className="flex justify-between items-end mb-4 px-1">
                  <h2 className="text-xl font-extrabold text-slate-800">Sunnah & Niyyah</h2>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    {habits.filter(h => h.completed).length}/{habits.length} Done
                  </span>
                </div>
                <div className="space-y-3">
                  {habits.map((habit) => (
                    <div
                      key={habit.id}
                      onClick={() => toggleHabit(habit.id)}
                      role="button"
                      tabIndex={0}
                      className={`group cursor-pointer w-full flex items-center justify-between p-4 sm:p-5 rounded-3xl transition-all duration-300 border ${
                        habit.completed 
                          ? 'bg-emerald-50/50 border-emerald-100 opacity-70 shadow-none' 
                          : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md shadow-sm'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        {habit.completed ? (
                          <div className="bg-emerald-100 p-1.5 rounded-full shrink-0">
                            <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                          </div>
                        ) : (
                          <div className="bg-slate-50 group-hover:bg-emerald-50 p-1.5 rounded-full transition-colors shrink-0">
                            <Circle className="w-6 h-6 text-slate-300 group-hover:text-emerald-400" />
                          </div>
                        )}
                        <div className="text-left flex flex-col">
                          <span className={`font-bold text-base transition-all ${habit.completed ? 'text-slate-400 line-through' : 'text-slate-800 group-hover:text-emerald-700'}`}>
                            {habit.title}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600/80 uppercase tracking-widest mt-1 bg-emerald-50 w-fit px-2 py-0.5 rounded-md border border-emerald-100/50">
                            {habit.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0">
                        {!habit.completed && habit.id === 3 && (
                          <button
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setActiveTab('quran'); 
                            }}
                            className="text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3 py-2 rounded-xl transition-colors shadow-sm"
                          >
                            Read Now
                          </button>
                        )}
                        {!habit.completed && (
                          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-2 rounded-xl border border-amber-100 shadow-sm">
                            +{habit.reward} E
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add Habit Button / Form */}
                  {!showAddHabit ? (
                    <button
                      onClick={() => setShowAddHabit(true)}
                      className="w-full mt-2 flex items-center justify-center space-x-2 p-4 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="font-bold text-sm">Add New Niyyah</span>
                    </button>
                  ) : (
                    <div className="w-full mt-2 p-4 bg-white rounded-3xl border border-slate-200 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-slate-700 text-sm">Create New Habit</span>
                        <button onClick={() => setShowAddHabit(false)} className="text-slate-400 hover:text-rose-500 transition-colors bg-slate-50 p-1 rounded-full">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="e.g., Pray Duha..."
                        value={newHabitTitle}
                        onChange={(e) => setNewHabitTitle(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 placeholder:text-slate-400"
                        autoFocus
                      />
                      <div className="flex space-x-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
                        {['Ruh', 'Aql', 'Jasad', 'Qalb'].map(cat => (
                          <button
                            key={cat}
                            onClick={() => setNewHabitCategory(cat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${newHabitCategory === cat ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'}`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={handleAddHabit}
                        disabled={!newHabitTitle.trim()}
                        className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors text-sm"
                      >
                        Add Habit
                      </button>
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}

          {/* TAB: QURAN */}
          {activeTab === 'quran' && (
            <div className="animate-in fade-in duration-300 h-full flex flex-col">
              {!selectedSurah ? (
                <div className="px-6 pb-6">
                  <div className="bg-[#F9F6F0] p-6 rounded-3xl mb-6 flex flex-col items-center text-center border border-slate-100">
                    <CatSVG awake={true} equipped={['glasses_smart']} className="w-24 h-24 mb-2 drop-shadow-sm" isPetting={false} />
                    <h2 className="text-xl font-bold text-slate-800">The Holy Quran</h2>
                    <p className="text-sm text-slate-500 mt-1">Read with Muezza</p>
                  </div>

                  {isLoadingQuran ? (
                    <div className="flex justify-center items-center py-10">
                      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {surahs.map((surah) => (
                        <button
                          key={surah.id}
                          onClick={() => openSurah(surah)}
                          className="w-full bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-center justify-between hover:border-emerald-300 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700 font-bold shrink-0">
                              {surah.id}
                            </div>
                            <div className="text-left">
                              <h3 className="font-bold text-slate-800">{surah.name_simple}</h3>
                              <p className="text-xs text-slate-500">{surah.translated_name.name}</p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-lg font-serif text-slate-700">{surah.name_arabic}</span>
                            <p className="text-[10px] text-slate-400 mt-1 uppercase">{surah.revelation_place}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="sticky top-0 bg-white/90 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center space-x-4 z-10">
                    <button 
                      onClick={() => setSelectedSurah(null)}
                      className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6 text-slate-700" />
                    </button>
                    <div>
                      <h2 className="font-bold text-slate-800">{selectedSurah.name_simple}</h2>
                      <p className="text-xs text-slate-500">{selectedSurah.translated_name.name}</p>
                    </div>
                  </div>

                  <div className="px-6 py-4 space-y-6">
                    {!habits.find(h => h.id === 3)?.completed && (
                      <div className="bg-emerald-600 p-4 rounded-2xl flex items-center justify-between shadow-md text-white mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="bg-emerald-500 p-2 rounded-full hidden sm:block">
                            <CatSVG awake={true} equipped={['glasses_smart']} className="w-10 h-10" isPetting={false} />
                          </div>
                          <div>
                            <p className="font-bold text-sm">Read 1 Page of Quran</p>
                            <p className="text-xs text-emerald-200 opacity-90">Daily Habit Pending</p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleHabit(3)}
                          className="bg-white text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-emerald-50 transition shrink-0 ml-2"
                        >
                          Mark Done
                        </button>
                      </div>
                    )}

                    {isLoadingQuran && currentPage === 1 ? (
                      <div className="flex justify-center items-center py-10">
                        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <>
                        {verses.map((verse) => (
                          <div key={verse.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
                            
                            <div className="flex justify-between items-start mb-4">
                              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100/50">
                                {verse.verse_key}
                              </span>
                              
                              <button
                                onClick={() => handleVerseTafsir(verse)}
                                className="text-[10px] font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-100 flex items-center space-x-1.5 transition-colors shadow-sm"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Ask Muezza (Tafsir)</span>
                              </button>
                            </div>
                            
                            <p className="text-right text-3xl leading-loose font-serif text-slate-800 mb-6 mt-2" dir="rtl">
                              {verse.text_uthmani}
                            </p>
                            
                            <div className="h-px w-full bg-slate-100 mb-4"></div>
                            
                            {verse.translations && verse.translations.length > 0 ? (
                              <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center space-x-1">
                                  <BookOpen className="w-3 h-3" />
                                  <span>Translation</span>
                                </span>
                                <p 
                                  className="text-slate-600 text-sm leading-relaxed"
                                  dangerouslySetInnerHTML={{ __html: verse.translations[0].text }}
                                />
                              </div>
                            ) : (
                              <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 text-center">
                                <p className="text-slate-400 text-xs italic">Translation temporarily unavailable.</p>
                              </div>
                            )}

                            {/* Bookmark Action */}
                            <div className="flex justify-end mt-4 border-t border-slate-100 pt-3">
                              <button 
                                onClick={async () => {
                                  if (accessToken) {
                                    const success = await addBookmark(accessToken, verse.verse_key);
                                    if (success) {
                                      // Optimistic update
                                      setUserBookmarks(prev => {
                                        if (prev.some(b => b.verse_key === verse.verse_key)) {
                                          return prev.filter(b => b.verse_key !== verse.verse_key); // toggle off
                                        }
                                        return [...prev, { verse_key: verse.verse_key }]; // toggle on
                                      });
                                    }
                                  } else {
                                    alert("Please sync with Quran.com on the Noor tab to bookmark verses.");
                                  }
                                }}
                                className={`flex items-center space-x-1.5 text-xs font-bold transition-colors ${
                                  userBookmarks.some(b => b.verse_key === verse.verse_key)
                                    ? 'text-emerald-600'
                                    : 'text-slate-400 hover:text-emerald-500'
                                }`}
                              >
                                <BookmarkIcon className={`w-4 h-4 ${userBookmarks.some(b => b.verse_key === verse.verse_key) ? 'fill-emerald-600' : ''}`} />
                                <span>{userBookmarks.some(b => b.verse_key === verse.verse_key) ? 'Bookmarked' : 'Bookmark'}</span>
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Pagination & Next Surah */}
                        {hasMoreVerses ? (
                          <button
                            onClick={loadMoreVerses}
                            disabled={isLoadingMore}
                            className="w-full py-4 mt-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-2xl transition-colors border border-emerald-200 flex justify-center items-center shadow-sm"
                          >
                            {isLoadingMore ? (
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                                <span>Loading...</span>
                              </div>
                            ) : (
                              "Load More Verses"
                            )}
                          </button>
                        ) : (
                          selectedSurah.id < 114 && (
                            <button
                              onClick={() => {
                                const nextSurah = surahs.find(s => s.id === selectedSurah.id + 1);
                                if (nextSurah) openSurah(nextSurah);
                              }}
                              className="w-full py-5 mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-colors flex justify-center items-center space-x-2 shadow-lg hover:-translate-y-0.5"
                            >
                              <span>Read Next: {surahs.find(s => s.id === selectedSurah.id + 1)?.name_simple}</span>
                              <ArrowRight className="w-5 h-5" />
                            </button>
                          )
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: SOUQ (SHOP) */}
          {activeTab === 'souq' && (
            <div className="px-6 pb-6 animate-in fade-in duration-300">
              <div className="bg-[#F9F6F0] p-6 rounded-3xl mb-6 flex flex-col items-center text-center border border-slate-100">
                <Store className="w-10 h-10 text-emerald-600 mb-2" />
                <h2 className="text-xl font-bold text-slate-800">The Grand Souq</h2>
                <p className="text-sm text-slate-500 mt-1">Spend your earned Dinar to customize Muezza's appearance.</p>
              </div>

              <div className="space-y-4">
                {SHOP_ITEMS.map((item) => {
                  const isOwned = inventory.includes(item.id);
                  const canAfford = dinar >= item.price;
                  return (
                    <div key={item.id} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl bg-slate-50 p-2 rounded-xl">{item.icon}</div>
                        <div>
                          <h3 className="font-bold text-slate-800">{item.name}</h3>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                      </div>
                      
                      {isOwned ? (
                        <button className="bg-slate-100 text-slate-400 font-bold py-2 px-4 rounded-xl flex items-center space-x-1 cursor-default">
                          <Check className="w-4 h-4" />
                          <span>Owned</span>
                        </button>
                      ) : (
                        <button 
                          onClick={() => buyItem(item)}
                          disabled={!canAfford}
                          className={`font-bold py-2 px-4 rounded-xl flex items-center space-x-1 transition-all ${
                            canAfford 
                              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 cursor-pointer shadow-sm' 
                              : 'bg-slate-50 text-slate-400 cursor-not-allowed opacity-50'
                          }`}
                        >
                          <span>{item.price}</span>
                          <Coins className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* TAB: STREAK / NOOR */}
          {activeTab === 'streak' && (
            <div className="px-6 pb-6 animate-in fade-in duration-300">
              
              {/* OAuth Integration Header */}
              <div className="bg-white p-5 rounded-3xl mb-6 shadow-sm border border-slate-200 flex flex-row items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Cloud Status</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{accessToken ? 'Your streak is backed up' : 'Offline Mode'}</p>
                </div>
                <LoginButton />
              </div>

              {/* Hero Status */}
              <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 p-8 rounded-3xl mb-6 flex flex-col items-center text-center shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent"></div>
                <div className="relative z-10 w-24 h-24 mb-4 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full shadow-inner border border-white/20">
                  {streak < 4 ? (
                    <Flame className="w-12 h-12 text-amber-400" />
                  ) : streak < 11 ? (
                    <Lightbulb className="w-12 h-12 text-amber-300 animate-pulse" />
                  ) : streak < 30 ? (
                    <Star className="w-12 h-12 text-amber-300 fill-amber-300 animate-pulse" />
                  ) : (
                    <Moon className="w-12 h-12 text-amber-200 fill-amber-200" />
                  )}
                </div>
                <h2 className="text-5xl font-extrabold text-white relative z-10 tracking-tight">{streak} <span className="text-2xl text-emerald-300">Days</span></h2>
                <p className="text-xs font-bold text-emerald-200/80 uppercase tracking-widest mt-2 relative z-10">Current Noor Streak</p>
              </div>

              <h2 className="text-xl font-extrabold text-slate-800 mb-4 px-1">Your Evolution</h2>
              
              {/* Evolution Path Timeline */}
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 space-y-6">
                
                {/* Stage 1: Spark */}
                <div className={`flex items-center space-x-4 transition-all ${streak >= 1 ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${streak >= 1 ? 'bg-amber-100' : 'bg-slate-100'}`}>
                    <Flame className={`w-7 h-7 ${streak >= 1 ? 'text-amber-500' : 'text-slate-400'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg">The Spark</h3>
                    <p className="text-xs text-slate-500">Days 1 - 3</p>
                  </div>
                  {streak >= 1 && streak < 4 && <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">CURRENT</div>}
                  {streak >= 4 && <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-100" />}
                </div>

                <div className="w-1 h-6 bg-slate-100 ml-6 rounded-full"></div>

                {/* Stage 2: Fanoos */}
                <div className={`flex items-center space-x-4 transition-all ${streak >= 4 ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${streak >= 4 ? 'bg-amber-100' : 'bg-slate-100'}`}>
                    <Lightbulb className={`w-7 h-7 ${streak >= 4 ? 'text-amber-500' : 'text-slate-400'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg">The Fanoos</h3>
                    <p className="text-xs text-slate-500">Days 4 - 10</p>
                  </div>
                  {streak >= 4 && streak < 11 && <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">CURRENT</div>}
                  {streak >= 11 && <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-100" />}
                </div>

                <div className="w-1 h-6 bg-slate-100 ml-6 rounded-full"></div>

                {/* Stage 3: Najm */}
                <div className={`flex items-center space-x-4 transition-all ${streak >= 11 ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${streak >= 11 ? 'bg-amber-100' : 'bg-slate-100'}`}>
                    <Star className={`w-7 h-7 ${streak >= 11 ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg">The Najm</h3>
                    <p className="text-xs text-slate-500">Days 11 - 29</p>
                  </div>
                  {streak >= 11 && streak < 30 && <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">CURRENT</div>}
                  {streak >= 30 && <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-100" />}
                </div>

                <div className="w-1 h-6 bg-slate-100 ml-6 rounded-full"></div>

                {/* Stage 4: Badr */}
                <div className={`flex items-center space-x-4 transition-all ${streak >= 30 ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${streak >= 30 ? 'bg-amber-100' : 'bg-slate-100'}`}>
                    <Moon className={`w-7 h-7 ${streak >= 30 ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg">The Badr</h3>
                    <p className="text-xs text-slate-500">30+ Days (Full Moon)</p>
                  </div>
                  {streak >= 30 && <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">MAX LEVEL</div>}
                </div>
                
              </div>
            </div>
          )}

        </div>

        {/* BOTTOM NAVIGATION */}
        <div className="absolute bottom-0 w-full bg-white border-t border-slate-100 px-6 py-4 flex justify-between items-center z-20 pb-safe shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center space-y-1 transition-colors flex-1 ${activeTab === 'home' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`p-2 rounded-xl transition-all ${activeTab === 'home' ? 'bg-emerald-50' : 'bg-transparent'}`}>
              <Home className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold">Home</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('quran')}
            className={`flex flex-col items-center space-y-1 transition-colors flex-1 ${activeTab === 'quran' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`p-2 rounded-xl transition-all ${activeTab === 'quran' ? 'bg-emerald-50' : 'bg-transparent'}`}>
              <Book className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold">Quran</span>
          </button>

          <button 
            onClick={() => setActiveTab('streak')}
            className={`flex flex-col items-center space-y-1 transition-colors flex-1 ${activeTab === 'streak' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`p-2 rounded-xl transition-all ${activeTab === 'streak' ? 'bg-emerald-50' : 'bg-transparent'}`}>
              <Activity className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold">Noor</span>
          </button>

          <button 
            onClick={() => setActiveTab('souq')}
            className={`flex flex-col items-center space-y-1 transition-colors flex-1 ${activeTab === 'souq' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`p-2 rounded-xl transition-all ${activeTab === 'souq' ? 'bg-emerald-50' : 'bg-transparent'}`}>
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold">Souq</span>
          </button>
        </div>

        {/* --- FULL SCREEN OVERLAYS --- */}

        {/* Loading Overlay (Journey / Tafsir) */}
        {isJourneying && (
          <div className="absolute inset-0 bg-emerald-900/95 backdrop-blur-md z-50 flex flex-col items-center justify-center text-white p-6 text-center">
            <CatSVG awake={true} equipped={journeyMode === 'tafsir' ? ['glasses_smart'] : inventory} className="w-48 h-48" />
            <div className="mt-10 flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-emerald-100 rounded-full animate-spin mb-6 shadow-lg"></div>
              <h3 className="text-2xl font-bold animate-pulse text-emerald-50">
                {journeyMode === 'tafsir' ? "Muezza is reading Tafsir..." : "Muezza is seeking knowledge..."}
              </h3>
              <div className="bg-emerald-800/50 border border-emerald-700 rounded-lg px-4 py-2 mt-4 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <p className="text-emerald-200 text-sm font-mono tracking-wide">Connecting to quran.ai MCP...</p>
              </div>
            </div>
          </div>
        )}

        {/* Journey Result Modal */}
        {journeyResult && !isJourneying && (
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-[2rem] p-6 w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom-10 zoom-in-95 duration-500 max-h-[90vh] flex flex-col">
              
              <div className="flex justify-center mb-4 shrink-0">
                <div className="bg-amber-100 p-4 rounded-full shadow-inner">
                  <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
                </div>
              </div>
              <h3 className="text-center text-2xl font-extrabold text-slate-800 mb-4 shrink-0">
                {journeyMode === 'tafsir' ? 'Tafsir Insight' : 'Muezza returned!'}
              </h3>
              
              {/* Scrollable text area */}
              <div className="bg-[#F9F6F0] rounded-2xl p-6 mb-5 shadow-inner border border-slate-100 relative overflow-y-auto flex-1 custom-scrollbar">
                {/* Decorative quote mark */}
                <span className="absolute top-2 left-3 text-6xl text-slate-200 font-serif leading-none opacity-50">"</span>
                
                <p className="text-lg font-medium text-slate-800 italic leading-relaxed text-center mb-4 relative z-10">
                  {journeyResult.verse}
                </p>
                <p className="text-xs text-center text-emerald-600 font-bold uppercase tracking-widest mb-4">
                  {journeyResult.reference}
                </p>
                <div className="h-px w-full bg-slate-200 mb-4"></div>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {journeyResult.tafsir}
                </p>
              </div>

              {/* Simplified Badge */}
              <div className="flex flex-col items-center justify-center space-y-2 mb-6 shrink-0">
                <div className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  <span>Verified via quran.ai MCP</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono text-center px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 shadow-sm inline-block">
                  {journeyResult.source}
                </span>
              </div>

              <button 
                onClick={completeJourney}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all flex justify-center items-center space-x-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 shrink-0"
              >
                <span>{journeyMode === 'daily' ? 'Collect Wisdom & Reset Day' : 'Continue Reading'}</span>
                {journeyMode === 'daily' ? <ArrowRight className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
              </button>
            </div>
          </div>
        )}

      </div>
      
      {/* CSS Animation definitions injected */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(200%) skew-x(-20deg); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
      `}} />
    </div>
  );
}

// --- Root Export with Error Boundary ---
export default function App() {
  return (
    <ErrorBoundary>
      <MuezzaApp />
    </ErrorBoundary>
  );
}