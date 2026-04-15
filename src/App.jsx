import React, { useEffect, useMemo, useRef, useState, Component } from 'react';
import {
  Activity,
  ArrowRight,
  Book,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  Circle,
  Coins,
  Flame,
  Home,
  Info,
  Lightbulb,
  MapPin,
  Moon,
  Pause,
  Pencil,
  Play,
  Plus,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Sun,
  Sunrise,
  Sunset,
  Trash2,
  X,
  Bookmark as BookmarkIcon,
} from 'lucide-react';
import { useAuth } from './auth/useAuth';
import LoginButton from './auth/LoginButton';
import { getStreaks } from './api/streaks';
import { addBookmark, getBookmarks } from './api/bookmarks';
import CatSVG from './components/CatSVG';
import Onboarding from './components/Onboarding';

const FALLBACK_LOCATION = {
  city: 'Padang',
  country: 'Indonesia',
  latitude: -0.9471,
  longitude: 100.4172,
  label: 'Padang, Indonesia',
  source: 'fallback',
};

const INITIAL_PRAYERS = [
  { id: 'fajr', name: 'Fajr', completed: false, missed: false, energyReward: 10, coinReward: 10 },
  { id: 'dhuhr', name: 'Dhuhr', completed: false, missed: false, energyReward: 10, coinReward: 10 },
  { id: 'asr', name: 'Asr', completed: false, missed: false, energyReward: 10, coinReward: 10 },
  { id: 'maghrib', name: 'Maghrib', completed: false, missed: false, energyReward: 10, coinReward: 10 },
  { id: 'isha', name: 'Isha', completed: false, missed: false, energyReward: 10, coinReward: 10 },
];

const PRAYER_ICONS = {
  fajr: Sunrise,
  dhuhr: Sun,
  asr: Sun,
  maghrib: Sunset,
  isha: Moon,
};

const INITIAL_HABITS = [
  {
    id: 2,
    title: 'Drink a glass of water',
    category: 'Jasad',
    completed: false,
    kind: 'body_care',
    energyReward: 25,
    coinReward: 25,
  },
  {
    id: 3,
    title: 'Read 1 Page of Quran',
    category: 'Aql',
    completed: false,
    kind: 'quran_reading',
    energyReward: 25,
    coinReward: 25,
  },
  {
    id: 4,
    title: 'Say Alhamdulillah 3x',
    category: 'Qalb',
    completed: false,
    kind: 'gratitude',
    energyReward: 25,
    coinReward: 25,
  },
];

const SHOP_ITEMS = [
  { id: 'sajjadah_red', name: 'Crimson Sajjadah', price: 60, type: 'rug', icon: '📿', desc: 'A beautiful prayer mat.' },
  { id: 'kufi_green', name: 'Emerald Kufi', price: 100, type: 'hat', icon: '🧢', desc: 'Keep Muezza looking sharp.' },
  { id: 'glasses_smart', name: 'Scholarly Glasses', price: 150, type: 'accessory', icon: '👓', desc: 'For deep Tafsir reading.' },
  { id: 'lantern_gold', name: 'Golden Fanoos', price: 200, type: 'decor', icon: '🏮', desc: 'Illuminates the room.' },
  { id: 'bow_lilac', name: 'Lilac Bow', price: 80, type: 'accessory', icon: '🎀', desc: 'A soft ribbon for gentle elegance.' },
  { id: 'scarf_sky', name: 'Sky Scarf', price: 110, type: 'accessory', icon: '🧣', desc: 'A breezy scarf for cool evening dhikr.' },
  { id: 'tasbih_amber', name: 'Amber Tasbih', price: 130, type: 'decor', icon: '📿', desc: 'Prayer beads that rest beside Muezza.' },
  { id: 'turban_cream', name: 'Cream Turban', price: 160, type: 'hat', icon: '🤍', desc: 'A classic wrap for a scholarly look.' },
  { id: 'sunglasses_rose', name: 'Rose Sunglasses', price: 175, type: 'accessory', icon: '🕶️', desc: 'A playful pair for sunny Noor days.' },
  { id: 'sajjadah_midnight', name: 'Midnight Sajjadah', price: 220, type: 'rug', icon: '🌌', desc: 'A deep-blue rug with moonlit accents.' },
];

const DAILY_INSIGHTS = [
  {
    verse: 'So remember Me; I will remember you. And be grateful to Me and do not deny Me.',
    reference: 'Surah Al-Baqarah 2:152',
    tafsir: 'Dhikr softens the heart back into remembrance. A moment of gratitude is never small in the sight of Allah.',
    source: 'Tafsir Ibn Kathir',
    live: false,
  },
  {
    verse: 'Indeed, with hardship [will be] ease.',
    reference: 'Surah Ash-Sharh 94:6',
    tafsir: 'Ease is not only after hardship. Allah often places relief inside the struggle itself, alongside patience and trust.',
    source: 'Tafsir Al-Tahrir wa al-Tanwir',
    live: false,
  },
  {
    verse: 'Allah does not burden a soul beyond that it can bear.',
    reference: 'Surah Al-Baqarah 2:286',
    tafsir: 'This verse is a mercy and a boundary. Whatever you are carrying today, Allah already knows the full weight of it.',
    source: 'Tafsir Ibn Kathir',
    live: false,
  },
  {
    verse: 'And He found you lost and guided [you].',
    reference: 'Surah Ad-Duhaa 93:7',
    tafsir: 'Guidance is not a single moment from the past. It is a continuous act of divine care that keeps reaching for the heart.',
    source: "Tafsir As-Sa'di",
    live: false,
  },
  {
    verse: 'Unquestionably, by the remembrance of Allah hearts are assured.',
    reference: "Surah Ar-Ra'd 13:28",
    tafsir: 'Peace is not the disappearance of every problem. It is the arrival of steadiness in the heart through remembrance.',
    source: 'Tafsir Ibn Kathir',
    live: false,
  },
];

const TRANSLATION_OPTIONS = [
  { id: 20, label: 'EN', name: 'Saheeh International' },
  { id: 33, label: 'ID', name: 'Bahasa Indonesia' },
  { id: 131, label: 'UR', name: 'Dr. Israr Ahmed' },
];

const DEFAULT_RECITER_ID = 2;
const DEFAULT_DINAR = 40;
const DEFAULT_STREAK = 0;
const INFO_MODAL_VERSION = 'v2';

function getTodayKey() {
  const now = new Date();
  // Ensure we use local date precisely
  const offset = now.getTimezoneOffset() * 60000;
  const localDate = new Date(now.getTime() - offset);
  return localDate.toISOString().split('T')[0];
}

function inferHabitKind(title = '') {
  const normalized = title.toLowerCase();

  if (normalized.includes('read') && normalized.includes('quran')) return 'quran_reading';
  if (normalized.includes('listen') && normalized.includes('surah')) return 'quran_audio';
  if (normalized.includes('ayah') || normalized.includes('reflect')) return 'ayah_reflection';
  if (normalized.includes('fajr')) return 'fajr_devotion';
  if (normalized.includes('dhikr')) return 'dhikr';
  if (normalized.includes('kindness')) return 'kindness';
  if (normalized.includes('water') || normalized.includes('jasad')) return 'body_care';
  if (normalized.includes('alhamdulillah')) return 'gratitude';
  return 'custom';
}

function normalizeHabit(habit) {
  return {
    id: habit.id ?? Date.now(),
    title: habit.title || 'Untitled habit',
    category: habit.category || 'Qalb',
    completed: Boolean(habit.completed),
    kind: habit.kind || inferHabitKind(habit.title),
    energyReward: Number(habit.energyReward ?? habit.reward ?? 25),
    coinReward: Number(habit.coinReward ?? 25),
  };
}

function normalizePrayer(prayer) {
  const definition = INITIAL_PRAYERS.find((item) => item.id === prayer.id) || {};
  return {
    id: prayer.id,
    name: prayer.name || definition.name || prayer.id,
    completed: Boolean(prayer.completed),
    missed: Boolean(prayer.missed),
    energyReward: Number(prayer.energyReward ?? prayer.reward ?? definition.energyReward ?? 10),
    coinReward: Number(prayer.coinReward ?? definition.coinReward ?? 10),
  };
}

function normalizeHabits(habits) {
  return Array.isArray(habits) ? habits.map(normalizeHabit) : INITIAL_HABITS.map(normalizeHabit);
}

function normalizePrayers(prayers) {
  return Array.isArray(prayers) ? prayers.map(normalizePrayer) : INITIAL_PRAYERS.map(normalizePrayer);
}

function resetHabitProgress(habits) {
  return habits.map((habit) => ({ ...normalizeHabit(habit), completed: false }));
}

function resetPrayerProgress(prayers) {
  return prayers.map((prayer) => ({ ...normalizePrayer(prayer), completed: false, missed: false }));
}

function getTranslationText(verse) {
  const html = verse?.translations?.[0]?.text || '';
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function getVerseAudioUrl(verse) {
  let url =
    verse?.audio?.url ||
    verse?.audio?.audio_url ||
    verse?.audio?.audioUrl ||
    verse?.audio_url ||
    verse?.audioUrl ||
    null;

  if (url && !url.startsWith('http') && !url.startsWith('//')) {
    url = `https://audio.qurancdn.com/${url}`;
  }

  return url;
}

function getBookmarkVerseKey(bookmark) {
  return bookmark?.verse_key || bookmark?.verseKey || bookmark?.ayah_key || null;
}

function formatLocationLabel(location) {
  if (!location) return FALLBACK_LOCATION.label;
  if (location.label) return location.label;
  return [location.city, location.country].filter(Boolean).join(', ') || FALLBACK_LOCATION.label;
}

function readStorageJson(key) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function hasStoredAppState() {
  const prayers = readStorageJson('muezza_prayers');
  const habits = readStorageJson('muezza_habits');
  const dinar = readStorageJson('muezza_dinar');
  const streak = readStorageJson('muezza_streak');
  const inventory = readStorageJson('muezza_inventory');
  const lastInsight = readStorageJson('muezza_last_insight');

  return Boolean(
    (Array.isArray(prayers) && prayers.length > 0) ||
      (Array.isArray(habits) && habits.length > 0) ||
      (typeof dinar === 'number' && dinar !== DEFAULT_DINAR) ||
      (typeof streak === 'number' && streak !== DEFAULT_STREAK) ||
      (Array.isArray(inventory) && inventory.length > 0) ||
      lastInsight,
  );
}

function deriveInitialOnboardingState() {
  const storedValue = readStorageJson('muezza_onboarded');
  if (typeof storedValue === 'boolean') {
    return storedValue;
  }

  return hasStoredAppState();
}

function hasMeaningfulDailyState({ prayers, habits, dinar, streak, inventory, lastInsightRef }) {
  return Boolean(
    prayers.some((prayer) => prayer.completed || prayer.missed) ||
      habits.some((habit) => habit.completed) ||
      dinar !== DEFAULT_DINAR ||
      streak !== DEFAULT_STREAK ||
      inventory.length > 0 ||
      lastInsightRef,
  );
}

function useLocalStorage(key, initialValue, hydrate = (value) => value) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? hydrate(JSON.parse(item)) : hydrate(initialValue);
    } catch {
      return hydrate(initialValue);
    }
  });

  const setValue = (value) => {
    try {
      const nextValue = value instanceof Function ? value(storedValue) : value;
      const hydratedValue = hydrate(nextValue);
      setStoredValue(hydratedValue);
      window.localStorage.setItem(key, JSON.stringify(hydratedValue));
    } catch {
      console.log('Local storage failed, using memory fallback.');
    }
  };

  return [storedValue, setValue];
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error || payload?.message || 'Request failed.');
  }

  return payload;
}

async function reverseGeocode(latitude, longitude) {
  const params = new URLSearchParams({
    lat: latitude,
    lon: longitude,
    format: 'jsonv2',
    zoom: '10',
  });
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to reverse geocode location.');
  }

  const payload = await response.json();
  const address = payload.address || {};
  const city =
    address.city ||
    address.town ||
    address.municipality ||
    address.county ||
    address.state ||
    FALLBACK_LOCATION.city;
  const country = address.country || FALLBACK_LOCATION.country;

  return {
    city,
    country,
    latitude,
    longitude,
    label: `${city}, ${country}`,
    source: 'geo',
  };
}

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
              Something went wrong. Don&apos;t worry — your progress is safely stored.
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

function MuezzaApp() {
  const { accessToken } = useAuth();
  const audioPlayerRef = useRef(null);

  const [activeTab, setActiveTab] = useState('home');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage(
    'muezza_onboarded',
    deriveInitialOnboardingState(),
  );
  const [prayers, setPrayers] = useLocalStorage('muezza_prayers', INITIAL_PRAYERS, normalizePrayers);
  const [habits, setHabits] = useLocalStorage('muezza_habits', INITIAL_HABITS, normalizeHabits);
  const [dinar, setDinar] = useLocalStorage('muezza_dinar', 40);
  const [streakLocal, setStreakLocal] = useLocalStorage('muezza_streak', DEFAULT_STREAK);
  const [inventory, setInventory] = useLocalStorage('muezza_inventory', []);
  const [lastInsightRef, setLastInsightRef] = useLocalStorage('muezza_last_insight', null);
  const [lastResetDate, setLastResetDate] = useLocalStorage('muezza_last_reset_date', null);
  const [savedLocation, setSavedLocation] = useLocalStorage('muezza_location', FALLBACK_LOCATION);
  const [translationId, setTranslationId] = useLocalStorage('muezza_translation_id', 20);
  const [reciterId] = useLocalStorage('muezza_reciter_id', DEFAULT_RECITER_ID);
  const [hasSeenInfoModal, setHasSeenInfoModal] = useLocalStorage(
    'muezza_info_modal_seen',
    null,
  );

  const [streakServer, setStreakServer] = useState(null);
  const [userBookmarks, setUserBookmarks] = useState([]);
  const [isJourneying, setIsJourneying] = useState(false);
  const [journeyMode, setJourneyMode] = useState('daily');
  const [journeyResult, setJourneyResult] = useState(null);
  const [journeyError, setJourneyError] = useState(null);
  const [showHearts, setShowHearts] = useState(false);

  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('Ruh');
  const [editingHabitId, setEditingHabitId] = useState(null);

  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [verses, setVerses] = useState([]);
  const [isLoadingQuran, setIsLoadingQuran] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreVerses, setHasMoreVerses] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [quranError, setQuranError] = useState(null);

  const [prayerTimes, setPrayerTimes] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle');
  const [activeAudioVerseKey, setActiveAudioVerseKey] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoModalTab, setInfoModalTab] = useState('guide'); // 'guide' | 'settings' | 'glossary'

  // Translation state (persistent)
  const [translationId, setTranslationId] = useState(() => {
    return Number(localStorage.getItem('muezza_translation_id')) || 20;
  });

  useEffect(() => {
    localStorage.setItem('muezza_translation_id', translationId.toString());
  }, [translationId]);

  // Location Search
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [isLocationSearching, setIsLocationSearching] = useState(false);
  const [locationSearchResults, setLocationSearchResults] = useState([]);

  // Cat Evolution Stage
  const catStage = useMemo(() => {
    const currentStreak = Math.max(streakLocal, streakServer || 0);
    if (currentStreak >= 31) return 'majestic';
    if (currentStreak >= 8) return 'adult';
    return 'kitten';
  }, [streakLocal, streakServer]);

  const streak = streakServer !== null ? streakServer : streakLocal;

  const quranReadingHabit = useMemo(
    () => habits.find((habit) => habit.kind === 'quran_reading'),
    [habits],
  );

  const energy = useMemo(() => {
    const habitEnergy = habits
      .filter((habit) => habit.completed)
      .reduce((sum, habit) => sum + habit.energyReward, 0);
    const prayerEnergy = prayers
      .filter((prayer) => prayer.completed)
      .reduce((sum, prayer) => sum + prayer.energyReward, 0);
    return Math.min(habitEnergy + prayerEnergy, 100);
  }, [habits, prayers]);

  const locationLabel = useMemo(() => formatLocationLabel(savedLocation), [savedLocation]);

  const bookmarkedVerseKeys = useMemo(
    () => new Set(userBookmarks.map(getBookmarkVerseKey).filter(Boolean)),
    [userBookmarks],
  );

  const handleOnboardingComplete = (selectedGoal) => {
    if (selectedGoal?.habits) {
      setHabits(selectedGoal.habits);
    }

    setLastResetDate(getTodayKey());
    setHasCompletedOnboarding(true);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!accessToken) {
        setStreakServer(null);
        setUserBookmarks([]);
        return;
      }

      const [streaksData, bookmarksData] = await Promise.all([
        getStreaks(accessToken),
        getBookmarks(accessToken),
      ]);

      if (streaksData?.streak) {
        setStreakServer(streaksData.streak);
      } else {
        setStreakServer(null);
      }

      setUserBookmarks(Array.isArray(bookmarksData) ? bookmarksData : []);
    };

    fetchUserData();
  }, [accessToken]);

  useEffect(() => {
    if (!hasCompletedOnboarding) return undefined;

    let cancelled = false;

    const applyFallbackLocation = () => {
      if (cancelled) return;
      setSavedLocation(FALLBACK_LOCATION);
      setLocationStatus('fallback');
    };

    if (!navigator.geolocation) {
      applyFallbackLocation();
      return undefined;
    }

    if (savedLocation?.source === 'geo') {
      setLocationStatus('resolved');
      return undefined;
    }

    setLocationStatus('locating');
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const resolvedLocation = await reverseGeocode(coords.latitude, coords.longitude);
          if (!cancelled) {
            setSavedLocation(resolvedLocation);
            setLocationStatus('resolved');
          }
        } catch (error) {
          console.error('Failed to reverse geocode location:', error);
          applyFallbackLocation();
        }
      },
      () => {
        applyFallbackLocation();
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 6 * 60 * 60 * 1000,
      },
    );

    return () => {
      cancelled = true;
    };
  }, [hasCompletedOnboarding, savedLocation?.source, setSavedLocation]);

  useEffect(() => {
    if (!hasCompletedOnboarding || !savedLocation?.latitude || !savedLocation?.longitude) return;

    let cancelled = false;

    const fetchPrayerTimes = async () => {
      try {
        const payload = await fetchJson(
          `https://api.aladhan.com/v1/timings?latitude=${savedLocation.latitude}&longitude=${savedLocation.longitude}&method=2`,
        );
        if (!cancelled) {
          setPrayerTimes(payload?.data?.timings || null);
        }
      } catch (error) {
        console.error('Error fetching prayer times:', error);
        if (!cancelled) {
          setPrayerTimes(null);
        }
      }
    };

    fetchPrayerTimes();

    return () => {
      cancelled = true;
    };
  }, [hasCompletedOnboarding, savedLocation]);

  useEffect(() => {
    if (!hasCompletedOnboarding) return undefined;

    if (!lastResetDate) {
      const today = getTodayKey();
      const shouldPreserveState = hasMeaningfulDailyState({
        prayers,
        habits,
        dinar,
        streak: streakLocal,
        inventory,
        lastInsightRef,
      });

      setLastResetDate(today);

      if (shouldPreserveState) {
        return undefined;
      }
    }

    const syncDayBoundary = () => {
      const today = getTodayKey();
      if (lastResetDate !== today) {
        setHabits((currentHabits) => resetHabitProgress(currentHabits));
        setPrayers((currentPrayers) => resetPrayerProgress(currentPrayers));
        setLastResetDate(today);
      }
    };

    syncDayBoundary();
    const intervalId = window.setInterval(syncDayBoundary, 60_000);
    return () => window.clearInterval(intervalId);
  }, [
    dinar,
    habits,
    hasCompletedOnboarding,
    inventory,
    lastInsightRef,
    lastResetDate,
    prayers,
    setHabits,
    setLastResetDate,
    setPrayers,
    streakLocal,
  ]);

  useEffect(() => {
    if (!hasCompletedOnboarding) return;

    if (hasSeenInfoModal !== INFO_MODAL_VERSION) {
      setShowInfoModal(true);
    }
  }, [hasCompletedOnboarding, hasSeenInfoModal]);

  useEffect(() => {
    if (!hasCompletedOnboarding || !prayerTimes) return undefined;

    const checkMissedPrayers = () => {
      const now = new Date();
      let updated = false;

      const nextPrayers = prayers.map((prayer) => {
        if (prayer.completed || prayer.missed) return prayer;

        const prayerTime = prayerTimes[prayer.name];
        if (!prayerTime) return prayer;

        const [hours, minutes] = prayerTime.split(':').map(Number);
        const prayerDate = new Date();
        prayerDate.setHours(hours, minutes, 0, 0);

        const diffMins = (now - prayerDate) / 60000;
        if (diffMins > 30) {
          updated = true;
          return { ...prayer, missed: true };
        }

        return prayer;
      });

      if (updated) {
        setPrayers(nextPrayers);
      }
    };

    checkMissedPrayers();
    const intervalId = window.setInterval(checkMissedPrayers, 60_000);
    return () => window.clearInterval(intervalId);
  }, [hasCompletedOnboarding, prayerTimes, prayers, setPrayers]);

  useEffect(() => {
    if (activeTab !== 'quran' || surahs.length > 0) return undefined;

    let cancelled = false;

    const loadSurahs = async () => {
      setIsLoadingQuran(true);
      setQuranError(null);

      try {
        const payload = await fetchJson('/api/chapters');
        if (!cancelled) {
          setSurahs(payload?.chapters || []);
          setIsLoadingQuran(false);
        }
      } catch (error) {
        console.error('Failed to load surahs:', error);
        if (!cancelled) {
          setQuranError(error.message);
          setIsLoadingQuran(false);
        }
      }
    };

    loadSurahs();

    return () => {
      cancelled = true;
    };
  }, [activeTab, surahs.length]);

  useEffect(() => () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
  }, []);

  const fetchSurahPage = async (surah, page, { append = false, scrollTop = false } = {}) => {
    if (!surah) return;

    if (scrollTop) {
      const scrollContainer = document.getElementById('main-scroll-container');
      scrollContainer?.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (page === 1) {
      setIsLoadingQuran(true);
      setQuranError(null);
      setVerses([]);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const payload = await fetchJson(
        `/api/verses?chapter=${surah.id}&page=${page}&perPage=20&translationId=${translationId}&reciterId=${reciterId}`,
      );
      const nextVerses = payload?.verses || [];
      const pagination = payload?.pagination || {};

      setVerses((currentVerses) => (append ? [...currentVerses, ...nextVerses] : nextVerses));
      setCurrentPage(page);
      setHasMoreVerses(
        Number(pagination.current_page || page) < Number(pagination.total_pages || page),
      );
      setSelectedSurah(surah);
    } catch (error) {
      console.error('Failed to load verses:', error);
      setQuranError(error.message);
    } finally {
      setIsLoadingQuran(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!selectedSurah) return;
    fetchSurahPage(selectedSurah, 1);
  }, [translationId, reciterId]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleHabit = (id) => {
    const targetHabit = habits.find((habit) => habit.id === id);
    if (!targetHabit) return;

    const delta = targetHabit.completed ? -targetHabit.coinReward : targetHabit.coinReward;

    setHabits(
      habits.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit,
      ),
    );
    setDinar((currentDinar) => Math.max(0, currentDinar + delta));
  };

  const togglePrayer = (id) => {
    const targetPrayer = prayers.find((prayer) => prayer.id === id);
    if (!targetPrayer || targetPrayer.missed) return;

    const delta = targetPrayer.completed ? -targetPrayer.coinReward : targetPrayer.coinReward;

    setPrayers(
      prayers.map((prayer) =>
        prayer.id === id ? { ...prayer, completed: !prayer.completed } : prayer,
      ),
    );
    setDinar((currentDinar) => Math.max(0, currentDinar + delta));
  };

  const resetHabitComposer = () => {
    setShowAddHabit(false);
    setEditingHabitId(null);
    setNewHabitTitle('');
    setNewHabitCategory('Ruh');
  };

  const openAddHabitForm = () => {
    setShowAddHabit(true);
    setEditingHabitId(null);
    setNewHabitTitle('');
    setNewHabitCategory('Ruh');
  };

  const openEditHabitForm = (habit) => {
    setShowAddHabit(true);
    setEditingHabitId(habit.id);
    setNewHabitTitle(habit.title);
    setNewHabitCategory(habit.category);
  };

  const handleSaveHabit = () => {
    if (!newHabitTitle.trim()) return;

    if (editingHabitId) {
      setHabits(
        habits.map((habit) =>
          habit.id === editingHabitId
            ? {
                ...habit,
                title: newHabitTitle.trim(),
                category: newHabitCategory,
              }
            : habit,
        ),
      );
    } else {
      setHabits([
        ...habits,
        {
          id: Date.now(),
          title: newHabitTitle.trim(),
          category: newHabitCategory,
          completed: false,
          kind: 'custom',
          energyReward: 25,
          coinReward: 25,
        },
      ]);
    }

    resetHabitComposer();
  };

  const handleDeleteHabit = (habitId) => {
    const targetHabit = habits.find((habit) => habit.id === habitId);
    if (!targetHabit) return;

    setHabits(habits.filter((habit) => habit.id !== habitId));

    if (editingHabitId === habitId) {
      resetHabitComposer();
    }
  };

  const buyItem = (item) => {
    if (dinar >= item.price && !inventory.includes(item.id)) {
      setDinar((currentDinar) => currentDinar - item.price);
      setInventory([...inventory, item.id]);
    }
  };

  const startJourney = () => {
    setJourneyMode('daily');
    setJourneyError(null);
    setJourneyResult(null);
    setIsJourneying(true);

    window.setTimeout(() => {
      const availableInsights = DAILY_INSIGHTS.filter((insight) => insight.reference !== lastInsightRef);
      const randomInsight =
        availableInsights[Math.floor(Math.random() * availableInsights.length)] || DAILY_INSIGHTS[0];

      setLastInsightRef(randomInsight.reference);
      setJourneyResult(randomInsight);
      setIsJourneying(false);
    }, 1800);
  };

  const handleVerseTafsir = async (verse) => {
    setJourneyMode('tafsir');
    setJourneyError(null);
    setJourneyResult(null);
    setIsJourneying(true);

    try {
      const payload = await fetchJson('/api/tafsir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verseKey: verse.verse_key,
          translationText: getTranslationText(verse),
          surahName: selectedSurah?.name_simple,
        }),
      });

      setJourneyResult(payload);
    } catch (error) {
      console.error('Failed to load tafsir:', error);
      setJourneyError(error.message);
    } finally {
      setIsJourneying(false);
    }
  };

  const completeJourney = () => {
    setJourneyError(null);
    setJourneyResult(null);

    if (journeyMode === 'daily') {
      setHabits((currentHabits) => resetHabitProgress(currentHabits));
      setPrayers((currentPrayers) => resetPrayerProgress(currentPrayers));
      setStreakLocal((currentStreak) => currentStreak + 1);
      setLastResetDate(getTodayKey());
    }
  };

  const handlePetCat = () => {
    if (energy > 0 && !showHearts) {
      setShowHearts(true);
      window.setTimeout(() => setShowHearts(false), 1200);
    }
  };

  const openSurah = (surah) => {
    fetchSurahPage(surah, 1, { scrollTop: true });
  };

  const loadMoreVerses = () => {
    if (!selectedSurah || isLoadingMore) return;
    fetchSurahPage(selectedSurah, currentPage + 1, { append: true });
  };

  const toggleVerseAudio = (verse) => {
    const audioUrl = getVerseAudioUrl(verse);
    if (!audioUrl) return;

    if (audioPlayerRef.current && activeAudioVerseKey === verse.verse_key) {
      if (isAudioPlaying) {
        audioPlayerRef.current.pause();
        setIsAudioPlaying(false);
      } else {
        audioPlayerRef.current.play();
        setIsAudioPlaying(true);
      }
      return;
    }

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }

    const nextAudio = new Audio(audioUrl);
    nextAudio.addEventListener('ended', () => {
      setActiveAudioVerseKey(null);
      setIsAudioPlaying(false);
    });
    nextAudio.addEventListener('pause', () => {
      setIsAudioPlaying(false);
    });
    nextAudio.addEventListener('play', () => {
      setIsAudioPlaying(true);
    });
    nextAudio.play().catch((error) => {
      console.error('Audio playback failed:', error);
      setActiveAudioVerseKey(null);
      setIsAudioPlaying(false);
    });

    audioPlayerRef.current = nextAudio;
    setActiveAudioVerseKey(verse.verse_key);
  };

  const saveBookmark = async (verse) => {
    if (!accessToken) {
      alert('Please sync with Quran.com on the Noor tab to bookmark verses.');
      return;
    }

    if (bookmarkedVerseKeys.has(verse.verse_key)) {
      return;
    }

    const success = await addBookmark(accessToken, verse.verse_key);
    if (success) {
      setUserBookmarks((currentBookmarks) => [...currentBookmarks, { verse_key: verse.verse_key }]);
    }
  };

  const closeInfoModal = () => {
    setShowInfoModal(false);
    setInfoModalTab('guide');
    setHasSeenInfoModal(INFO_MODAL_VERSION);
  };

  const handleCitySearch = async () => {
    if (!locationSearchQuery.trim()) return;
    setIsLocationSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationSearchQuery)}&limit=5`);
      const data = await res.json();
      setLocationSearchResults(data.map(item => ({
        city: item.display_name.split(',')[0],
        label: item.display_name,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        country: item.display_name.split(',').pop().trim()
      })));
    } catch (error) {
      console.error('Search failed', error);
      alert('Search failed. Please try again.');
    } finally {
      setIsLocationSearching(false);
    }
  };

  const selectManualLocation = (loc) => {
    const newLoc = { ...loc, source: 'manual' };
    setSavedLocation(newLoc);
    setIsLocationModalOpen(false);
    setLocationSearchQuery('');
    setLocationSearchResults([]);
  };

  const handleStreakRestore = () => {
    const val = prompt('Enter your current streak number to restore:', streakLocal.toString());
    if (val !== null) {
      const num = parseInt(val, 10);
      if (!isNaN(num)) {
        setStreakLocal(num);
        alert('Streak restored successfully!');
      }
    }
  };

  const handleExportData = () => {
    const data = {
      habits,
      prayers,
      dinar,
      streakLocal,
      inventory,
      lastResetDate
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `muezza_backup_${getTodayKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  if (!hasCompletedOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-[#E5E0D8] text-slate-800 font-sans sm:py-8 flex justify-center">
      <div className="w-full max-w-md bg-white sm:rounded-[2.5rem] shadow-2xl sm:border-[8px] border-slate-100 overflow-hidden relative flex flex-col h-screen sm:h-[850px]">
        <div className="flex justify-between items-center p-6 bg-white/90 backdrop-blur-md z-30 shrink-0 sticky top-0 border-b border-slate-100/50">
          <button
            onClick={() => setActiveTab('streak')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-2xl border shadow-sm transition-colors ${
              activeTab === 'streak'
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'bg-emerald-50 border-emerald-100 text-emerald-900 hover:bg-emerald-100'
            }`}
            aria-label="Open Noor streak"
          >
            <Lightbulb className={`w-5 h-5 ${streak > 0 ? 'text-amber-500 fill-amber-500 animate-pulse' : 'text-slate-400'}`} />
            <span className="font-bold">{streak} Noor</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInfoModal(true)}
              className="w-11 h-11 rounded-2xl border border-slate-200 bg-white text-slate-500 hover:text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50 transition-colors shadow-sm flex items-center justify-center"
              aria-label="Open app guide"
            >
              <Info className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100 shadow-sm">
              <Coins className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="font-bold text-amber-900">{dinar}</span>
            </div>
          </div>
        </div>

        <div id="main-scroll-container" className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
          {activeTab === 'home' && (
            <div className="animate-in fade-in duration-300">
              <div className="px-6 pt-4 pb-2 text-center">
                <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mb-1">{todayStr}</p>
                <h1 className="text-2xl font-extrabold text-slate-800">Assalamu&apos;alaikum.</h1>
                <p className="text-slate-500 text-sm mt-1">{greeting}, time to grow your Noor.</p>
              </div>

              <div className="px-6 pb-4">
                <div className="bg-gradient-to-b from-[#F0EBE1]/60 to-white rounded-3xl border border-slate-100/50 shadow-sm overflow-hidden">
                  <div className="relative flex justify-center items-center pt-4 pb-2">
                    <div className="absolute inset-0 bg-emerald-400/5 blur-[60px] rounded-full"></div>
                    <CatSVG awake={energy > 0} equipped={inventory} isPetting={showHearts} onPet={handlePetCat} stage={catStage} className="w-36 h-36 relative z-10" />
                    {energy === 100 && (
                      <Sparkles className="absolute top-4 right-8 w-6 h-6 text-amber-400 animate-spin-slow pointer-events-none z-20" />
                    )}
                  </div>

                  <div className="px-5 pb-4">
                    <div className="flex justify-between text-xs font-bold mb-2 text-slate-500">
                      <span>Muezza&apos;s Energy</span>
                      <span className={energy === 100 ? 'text-emerald-600' : ''}>{energy}%</span>
                    </div>

                    {energy < 100 ? (
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden relative shadow-inner">
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
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-5 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center space-x-2 animate-bounce text-sm"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Send on a Journey</span>
                      </button>
                    )}

                    <p className="text-center text-[11px] font-semibold text-slate-400 mt-2">
                      {energy === 100 ? 'Muezza is ready to seek knowledge!' : 'Complete daily habits to wake Muezza up.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6">
                <div className="bg-emerald-700 rounded-3xl p-5 shadow-md border border-emerald-600 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent bg-[length:20px_20px]"></div>

                  <div className="flex justify-between items-start mb-4 relative z-10 gap-4">
                    <div>
                      <h3 className="font-bold text-white flex items-center space-x-2">
                        <Star className="w-4 h-4 fill-emerald-200 text-emerald-200" />
                        <span>Obligatory Prayers</span>
                      </h3>
                      <button 
                        onClick={() => setIsLocationModalOpen(true)}
                        className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-emerald-100/80 uppercase tracking-widest hover:text-white transition-colors"
                      >
                        <MapPin className="w-3 h-3" />
                        <span>{locationLabel}</span>
                        <Pencil className="w-2.5 h-2.5 ml-1 opacity-50" />
                      </button>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200 px-2 py-1 rounded-md">
                      {prayers.filter((prayer) => prayer.completed).length}/5
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
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                              prayer.completed
                                ? 'bg-emerald-900 border-2 border-emerald-500 scale-95 opacity-80'
                                : prayer.missed
                                  ? 'bg-emerald-800/50 border-2 border-emerald-900/50 scale-95'
                                  : 'bg-emerald-500 hover:bg-emerald-400 hover:scale-105 border-2 border-transparent hover:border-emerald-200'
                            }`}
                          >
                            {prayer.completed ? (
                              <Check className="w-5 h-5 text-emerald-300" />
                            ) : prayer.missed ? (
                              <X className="w-5 h-5 text-emerald-200/50" />
                            ) : (
                              <Icon className="w-5 h-5 text-emerald-50" />
                            )}
                          </div>
                          <span
                            className={`text-[10px] font-bold transition-all ${
                              prayer.completed
                                ? 'text-emerald-400/80'
                                : prayer.missed
                                  ? 'text-emerald-200/50 line-through'
                                  : 'text-emerald-50'
                            }`}
                          >
                            {prayer.name}
                          </span>
                          {prayerTimes?.[prayer.name] && (
                            <span className="text-[8px] font-mono text-emerald-200/60 mt-0">
                              {prayerTimes[prayer.name]}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {locationStatus === 'fallback' && (
                    <p className="relative z-10 mt-4 text-[10px] text-emerald-100/70">
                      Using fallback prayer times until location access is available.
                    </p>
                  )}
                </div>
              </div>

              <div className="px-6 pb-6">
                <div className="flex justify-between items-end mb-4 px-1">
                  <h2 className="text-xl font-extrabold text-slate-800">Sunnah &amp; Niyyah</h2>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    {habits.filter((habit) => habit.completed).length}/{habits.length} Done
                  </span>
                </div>

                <div className="space-y-3">
                  {habits.map((habit) => (
                    <div
                      key={habit.id}
                      className={`group relative cursor-pointer w-full rounded-3xl transition-all duration-300 border ${
                        habit.completed
                          ? 'bg-emerald-50/50 border-emerald-100 opacity-70 shadow-none'
                          : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md shadow-sm'
                      }`}
                    >
                      {/* Main row – tap to toggle */}
                      <div
                        onClick={() => toggleHabit(habit.id)}
                        role="button"
                        tabIndex={0}
                        className="flex items-center justify-between p-4 sm:p-5"
                      >
                        <div className="flex items-center space-x-4 min-w-0">
                          {habit.completed ? (
                            <div className="bg-emerald-100 p-1.5 rounded-full shrink-0">
                              <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                            </div>
                          ) : (
                            <div className="bg-slate-50 group-hover:bg-emerald-50 p-1.5 rounded-full transition-colors shrink-0">
                              <Circle className="w-6 h-6 text-slate-300 group-hover:text-emerald-400" />
                            </div>
                          )}

                          <div className="text-left flex flex-col min-w-0">
                            <span
                              className={`font-bold text-base leading-tight transition-all truncate ${
                                habit.completed ? 'text-slate-400 line-through' : 'text-slate-800 group-hover:text-emerald-700'
                              }`}
                            >
                              {habit.title}
                            </span>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[10px] font-bold text-emerald-600/80 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/50">
                                {habit.category}
                              </span>
                              {!habit.completed && (
                                <span className="text-[10px] font-bold text-amber-600/90 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100/50">
                                  +{habit.energyReward} Energy
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Primary CTA – only for quran reading */}
                        {!habit.completed && habit.kind === 'quran_reading' && (
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              setActiveTab('quran');
                            }}
                            className="text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3 py-2 rounded-xl transition-colors shadow-sm shrink-0 ml-3"
                          >
                            Read Now
                          </button>
                        )}
                      </div>

                      {/* Edit / Delete – revealed on hover */}
                      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            openEditHabitForm(habit);
                          }}
                          className="p-1.5 rounded-lg bg-white/90 backdrop-blur text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors shadow-sm border border-slate-100"
                          aria-label={`Edit ${habit.title}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDeleteHabit(habit.id);
                          }}
                          className="p-1.5 rounded-lg bg-white/90 backdrop-blur text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shadow-sm border border-slate-100"
                          aria-label={`Delete ${habit.title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {!showAddHabit ? (
                    <button
                      onClick={openAddHabitForm}
                      className="w-full mt-2 flex items-center justify-center space-x-2 p-4 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="font-bold text-sm">Add New Niyyah</span>
                    </button>
                  ) : (
                    <div className="w-full mt-2 p-4 bg-white rounded-3xl border border-slate-200 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-slate-700 text-sm">
                          {editingHabitId ? 'Edit Habit' : 'Create New Habit'}
                        </span>
                        <button
                          onClick={resetHabitComposer}
                          className="text-slate-400 hover:text-rose-500 transition-colors bg-slate-50 p-1 rounded-full"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <input
                        type="text"
                        placeholder="e.g., Pray Duha..."
                        value={newHabitTitle}
                        onChange={(event) => setNewHabitTitle(event.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 placeholder:text-slate-400"
                        autoFocus
                      />

                      <div className="flex space-x-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
                        {['Ruh', 'Aql', 'Jasad', 'Qalb'].map((category) => (
                          <button
                            key={category}
                            onClick={() => setNewHabitCategory(category)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                              newHabitCategory === category
                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={handleSaveHabit}
                        disabled={!newHabitTitle.trim()}
                        className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors text-sm"
                      >
                        {editingHabitId ? 'Save Changes' : 'Add Habit'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quran' && (
            <div className="animate-in fade-in duration-300 h-full flex flex-col">
              {!selectedSurah ? (
                <div className="px-6 pb-6">
                  <div className="bg-[#F9F6F0] p-6 rounded-3xl mb-6 flex flex-col items-center text-center border border-slate-100">
                    <CatSVG awake={true} equipped={['glasses_smart']} className="w-24 h-24 mb-2 drop-shadow-sm" isPetting={false} />
                    <h2 className="text-xl font-bold text-slate-800">The Holy Quran</h2>
                    <p className="text-sm text-slate-500 mt-1">Read with Muezza</p>

                    <div className="mt-4 flex gap-2 flex-wrap justify-center">
                      {TRANSLATION_OPTIONS.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setTranslationId(option.id)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                            translationId === option.id
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-300 hover:text-emerald-700'
                          }`}
                        >
                          {option.label} · {option.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {isLoadingQuran ? (
                    <div className="flex justify-center items-center py-10">
                      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : quranError ? (
                    <div className="bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl p-4 text-sm">
                      {quranError}
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
                              <p className="text-xs text-slate-500">{surah.translated_name?.name}</p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-2xl font-['Amiri_Quran'] text-slate-700">{surah.name_arabic}</span>
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
                    <div className="flex-1">
                      <h2 className="font-bold text-slate-800">{selectedSurah.name_simple}</h2>
                      <p className="text-xs text-slate-500">{selectedSurah.translated_name?.name}</p>
                    </div>
                  </div>

                  <div className="px-6 py-4 space-y-6">
                    {!quranReadingHabit?.completed && quranReadingHabit && (
                      <div className="bg-emerald-600 p-4 rounded-2xl flex items-center justify-between shadow-md text-white mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="bg-emerald-500 p-2 rounded-full hidden sm:block">
                            <CatSVG awake={true} equipped={['glasses_smart']} className="w-10 h-10" isPetting={false} />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{quranReadingHabit.title}</p>
                            <p className="text-xs text-emerald-200 opacity-90">Daily Habit Pending</p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleHabit(quranReadingHabit.id)}
                          className="bg-white text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-emerald-50 transition shrink-0 ml-2"
                        >
                          Mark Done
                        </button>
                      </div>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      {TRANSLATION_OPTIONS.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setTranslationId(option.id)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                            translationId === option.id
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-300 hover:text-emerald-700'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>

                    {isLoadingQuran && currentPage === 1 ? (
                      <div className="flex justify-center items-center py-10">
                        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : quranError ? (
                      <div className="bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl p-4 text-sm">
                        {quranError}
                      </div>
                    ) : (
                      <>
                        {verses.map((verse) => {
                          const audioUrl = getVerseAudioUrl(verse);
                          const translationText = getTranslationText(verse);
                          const isBookmarked = bookmarkedVerseKeys.has(verse.verse_key);
                          const isActiveAudio = activeAudioVerseKey === verse.verse_key;

                          return (
                            <div key={verse.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
                              <div className="flex justify-between items-start mb-4 gap-3">
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100/50">
                                  {verse.verse_key}
                                </span>

                                <div className="flex items-center gap-2">
                                  {audioUrl && (
                                    <button
                                      onClick={() => toggleVerseAudio(verse)}
                                      className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border flex items-center space-x-1.5 transition-colors shadow-sm ${
                                        isActiveAudio && isAudioPlaying
                                          ? 'text-emerald-700 bg-emerald-100 border-emerald-200'
                                          : 'text-sky-700 bg-sky-50 hover:bg-sky-100 border-sky-100'
                                      }`}
                                    >
                                      {isActiveAudio && isAudioPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                                      <span>{isActiveAudio && isAudioPlaying ? 'Pause' : 'Play Audio'}</span>
                                    </button>
                                  )}

                                  <button
                                    onClick={() => handleVerseTafsir(verse)}
                                    className="text-[10px] font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-100 flex items-center space-x-1.5 transition-colors shadow-sm"
                                  >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Ask Muezza (Tafsir)</span>
                                  </button>
                                </div>
                              </div>

                              <p className="text-right text-4xl leading-[2.2] text-slate-800 mb-6 mt-2 font-['Amiri_Quran'] antialiased notranslate" dir="rtl" translate="no">
                                {verse.text_uthmani}
                              </p>

                              <div className="h-px w-full bg-slate-100 mb-4"></div>

                              {translationText ? (
                                <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center space-x-1">
                                    <BookOpen className="w-3 h-3" />
                                    <span>{TRANSLATION_OPTIONS.find((option) => option.id === translationId)?.name || 'Translation'}</span>
                                  </span>
                                  <p
                                    className="text-slate-600 text-sm leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: verse.translations?.[0]?.text || '' }}
                                  />
                                </div>
                              ) : (
                                <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 text-center">
                                  <p className="text-slate-400 text-xs italic">Translation temporarily unavailable.</p>
                                </div>
                              )}

                              <div className="flex justify-end mt-4 border-t border-slate-100 pt-3">
                                <button
                                  onClick={() => saveBookmark(verse)}
                                  disabled={isBookmarked}
                                  className={`flex items-center space-x-1.5 text-xs font-bold transition-colors ${
                                    isBookmarked
                                      ? 'text-emerald-600 cursor-default'
                                      : 'text-slate-400 hover:text-emerald-500'
                                  }`}
                                >
                                  <BookmarkIcon className={`w-4 h-4 ${isBookmarked ? 'fill-emerald-600' : ''}`} />
                                  <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}

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
                              'Load More Verses'
                            )}
                          </button>
                        ) : (
                          selectedSurah.id < 114 && (
                            <button
                              onClick={() => {
                                const nextSurah = surahs.find((surah) => surah.id === selectedSurah.id + 1);
                                if (nextSurah) openSurah(nextSurah);
                              }}
                              className="w-full py-5 mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-colors flex justify-center items-center space-x-2 shadow-lg hover:-translate-y-0.5"
                            >
                              <span>Read Next: {surahs.find((surah) => surah.id === selectedSurah.id + 1)?.name_simple}</span>
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

          {activeTab === 'souq' && (
            <div className="px-6 pb-6 animate-in fade-in duration-300">
              <div className="bg-[#F9F6F0] p-6 rounded-3xl mb-6 flex flex-col items-center text-center border border-slate-100">
                <Store className="w-10 h-10 text-emerald-600 mb-2" />
                <h2 className="text-xl font-bold text-slate-800">The Grand Souq</h2>
                <p className="text-sm text-slate-500 mt-1">Spend your earned Dinar to customize Muezza&apos;s appearance.</p>
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
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'streak' && (
            <div className="px-6 pb-6 animate-in fade-in duration-300">
              <div className="bg-white p-5 rounded-3xl mb-6 shadow-sm border border-slate-200 flex flex-row items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Cloud Status</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{accessToken ? 'Your streak is backed up' : 'Offline Mode'}</p>
                </div>
                <LoginButton />
              </div>

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

              <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 space-y-6">
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
            onClick={() => setActiveTab('souq')}
            className={`flex flex-col items-center space-y-1 transition-colors flex-1 ${activeTab === 'souq' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`p-2 rounded-xl transition-all ${activeTab === 'souq' ? 'bg-emerald-50' : 'bg-transparent'}`}>
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold">Souq</span>
          </button>
        </div>

        {isJourneying && (
          <div className="absolute inset-0 bg-emerald-900/95 backdrop-blur-md z-50 flex flex-col items-center justify-center text-white p-6 text-center">
            <CatSVG awake={true} equipped={journeyMode === 'tafsir' ? ['glasses_smart'] : inventory} className="w-48 h-48" />
            <div className="mt-10 flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-emerald-100 rounded-full animate-spin mb-6 shadow-lg"></div>
              <h3 className="text-2xl font-bold animate-pulse text-emerald-50">
                {journeyMode === 'tafsir' ? 'Loading live tafsir...' : 'Muezza is seeking knowledge...'}
              </h3>
              <div className="bg-emerald-800/50 border border-emerald-700 rounded-lg px-4 py-2 mt-4 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <p className="text-emerald-200 text-sm font-mono tracking-wide">
                  {journeyMode === 'tafsir' ? 'Fetching from Quran Foundation...' : "Preparing today's reflection..."}
                </p>
              </div>
            </div>
          </div>
        )}

        {(journeyResult || journeyError) && !isJourneying && (
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-[2rem] p-6 w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom-10 zoom-in-95 duration-500 max-h-[90vh] flex flex-col">
              <div className="flex justify-center mb-4 shrink-0">
                <div className={`p-4 rounded-full shadow-inner ${journeyError ? 'bg-rose-100' : 'bg-amber-100'}`}>
                  {journeyError ? <X className="w-8 h-8 text-rose-500" /> : <Star className="w-8 h-8 text-amber-500 fill-amber-500" />}
                </div>
              </div>

              <h3 className="text-center text-2xl font-extrabold text-slate-800 mb-4 shrink-0">
                {journeyError
                  ? 'Tafsir unavailable'
                  : journeyMode === 'tafsir'
                    ? 'Tafsir Insight'
                    : 'Muezza returned!'}
              </h3>

              <div className="bg-[#F9F6F0] rounded-2xl p-6 mb-5 shadow-inner border border-slate-100 relative overflow-y-auto flex-1 custom-scrollbar">
                {journeyError ? (
                  <p className="text-sm text-slate-600 leading-relaxed font-medium text-center">
                    {journeyError}
                  </p>
                ) : (
                  <>
                    <span className="absolute top-2 left-3 text-6xl text-slate-200 font-serif leading-none opacity-50">&quot;</span>
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
                  </>
                )}
              </div>

              {!journeyError && (
                <div className="flex flex-col items-center justify-center space-y-2 mb-6 shrink-0">
                  <div className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Sparkles className="w-3 h-3 text-emerald-500" />
                    <span>{journeyResult.live ? 'Live source' : 'Grounded reflection'}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono text-center px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 shadow-sm inline-block">
                    {journeyResult.source}
                  </span>
                </div>
              )}

              <button
                onClick={completeJourney}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all flex justify-center items-center space-x-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 shrink-0"
              >
                <span>
                  {journeyError
                    ? 'Close'
                    : journeyMode === 'daily'
                      ? 'Collect Wisdom & Reset Day'
                      : 'Continue Reading'}
                </span>
                {!journeyError && (journeyMode === 'daily' ? <ArrowRight className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />)}
              </button>
            </div>
          </div>
        )}

        {showInfoModal && (
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-[2rem] w-full max-w-[22rem] shadow-2xl animate-in slide-in-from-bottom-10 zoom-in-95 duration-500 max-h-[78vh] flex flex-col overflow-hidden">
               <div className="p-5 pb-0">
                <div className="flex items-start justify-between gap-4 mb-4 shrink-0">
                  <div>
                    <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mb-1.5 font-mono">
                      Muezza Terminal
                    </p>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                      {infoModalTab === 'guide' ? 'System Guide' : infoModalTab === 'settings' ? 'Core Settings' : 'Glossary'}
                    </h3>
                  </div>
                  <button
                    onClick={closeInfoModal}
                    className="text-slate-400 hover:text-slate-700 transition-colors bg-slate-50 p-2.5 rounded-2xl shrink-0 border border-slate-100 shadow-sm"
                    aria-label="Close app guide"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex space-x-1 mb-5 bg-slate-50 p-1 rounded-xl border border-slate-200/50">
                  {[
                    { id: 'guide', label: 'Guide', icon: BookOpen },
                    { id: 'glossary', label: 'Glossary', icon: Info },
                    { id: 'settings', label: 'Settings', icon: Activity },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setInfoModalTab(tab.id)}
                      className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        infoModalTab === tab.id
                          ? 'bg-white text-emerald-700 shadow-sm border border-slate-200'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <tab.icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar px-5 pb-5 space-y-3">
                {infoModalTab === 'guide' && (
                  <>
                    <div className="bg-[#F9F6F0] rounded-2xl p-4 border border-slate-200/50">
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Muezza helps you build Quranic habits with low friction. Your progress stays on this device, and onboarding only runs once unless storage is cleared.
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      <div className="rounded-2xl border border-slate-100 p-3.5 bg-white">
                        <h4 className="font-bold text-slate-800 mb-1.5 flex items-center space-x-2">
                          <Activity className="w-4 h-4 text-emerald-500" />
                          <span>Daily loop</span>
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          Complete prayers and habits to fill Muezza&apos;s energy. At 100%, send Muezza on a journey and collect a reflection.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-100 p-3.5 bg-white">
                        <h4 className="font-bold text-slate-800 mb-1.5 flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-emerald-500" />
                          <span>What to allow</span>
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          Location improves prayer times for your city. Quran.com sync is optional, but needed for cloud streaks and bookmarks.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-100 p-3.5 bg-white">
                        <h4 className="font-bold text-slate-800 mb-1.5 flex items-center space-x-2">
                          <Star className="w-4 h-4 text-emerald-500" />
                          <span>Evolution</span>
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium mb-2">Muezza grows with your streak:</p>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                             <p className="text-[10px] font-bold text-slate-400 mb-1">STREAK</p>
                             <p className="text-xs font-black text-slate-700">0-7D</p>
                             <p className="text-[9px] font-medium text-slate-500 uppercase mt-0.5">Kitten</p>
                          </div>
                          <div className="text-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                             <p className="text-[10px] font-bold text-slate-400 mb-1">STREAK</p>
                             <p className="text-xs font-black text-slate-700">8-30D</p>
                             <p className="text-[9px] font-medium text-slate-500 uppercase mt-0.5">Adult</p>
                          </div>
                          <div className="text-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                             <p className="text-[10px] font-bold text-slate-400 mb-1">STREAK</p>
                             <p className="text-xs font-black text-slate-700">31D+</p>
                             <p className="text-[9px] font-medium text-slate-500 uppercase mt-0.5">Majestic</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {infoModalTab === 'glossary' && (
                  <div className="rounded-2xl border border-slate-100 p-3.5 bg-white space-y-2.5">
                    <div className="text-sm text-slate-600 leading-relaxed space-y-1">
                      {[
                        { term: 'Noor', desc: 'Light (your spiritual progress)' },
                        { term: 'Ruh', desc: 'Soul/Spirit (spiritual connection)' },
                        { term: 'Aql', desc: 'Mind/Intellect (learning & thought)' },
                        { term: 'Jasad', desc: 'Body (physical health & care)' },
                        { term: 'Qalb', desc: 'Heart (emotional & mindfulness)' },
                        { term: 'Dinar', desc: 'Coins earned to spend in the shop' },
                      ].map((item) => (
                        <div key={item.term} className="flex space-x-2 py-1.5 border-b border-slate-50 last:border-0">
                          <strong className="text-emerald-700 w-12 shrink-0">{item.term}:</strong>
                          <span className="text-slate-500">{item.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {infoModalTab === 'settings' && (
                  <div className="space-y-4">
                     <div className="rounded-2xl border border-slate-100 p-4 bg-white">
                      <h4 className="font-bold text-slate-800 mb-3 flex items-center space-x-2">
                        <Book className="w-4 h-4 text-emerald-500" />
                        <span>Translation</span>
                      </h4>
                      <div className="flex flex-col space-y-2">
                        {TRANSLATION_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setTranslationId(opt.id)}
                            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                              translationId === opt.id 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                                : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
                            }`}
                          >
                            <span className="font-bold text-sm tracking-tight">{opt.name}</span>
                            <span className="text-[10px] font-black opacity-60 bg-white/50 px-1.5 py-0.5 rounded uppercase">{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-100 p-4 bg-white">
                      <h4 className="font-bold text-slate-800 mb-3 flex items-center space-x-2">
                         <Activity className="w-4 h-4 text-emerald-500" />
                        <span>Terminal Tools</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                         <button
                          onClick={handleStreakRestore}
                          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-50 border border-amber-100 text-amber-900 hover:bg-amber-100 transition-colors"
                        >
                          <Flame className="w-5 h-5 mb-1" />
                          <span className="text-[10px] font-black uppercase">Restore Streak</span>
                        </button>
                        <button
                          onClick={handleExportData}
                          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-blue-50 border border-blue-100 text-blue-900 hover:bg-blue-100 transition-colors"
                        >
                          <Activity className="w-5 h-5 mb-1" />
                          <span className="text-[10px] font-black uppercase">Backup Data</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {isLocationModalOpen && (
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-[2rem] p-5 w-full max-w-[22rem] shadow-2xl animate-in slide-in-from-bottom-10 zoom-in-95 duration-500">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">Set Location</h3>
                  <button onClick={() => setIsLocationModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
               </div>
               
               <div className="relative mb-4">
                <input 
                  type="text" 
                  value={locationSearchQuery}
                  onChange={(e) => setLocationSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCitySearch()}
                  placeholder="Enter city name..."
                  className="w-full p-4 pl-11 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <button 
                  onClick={handleCitySearch}
                  disabled={isLocationSearching}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:bg-slate-300 transition-all shadow-sm"
                >
                  {isLocationSearching ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <ArrowRight className="w-4 h-4" />}
                </button>
               </div>

               <div className="space-y-2 max-h-[30vh] overflow-y-auto custom-scrollbar pr-1">
                  {locationSearchResults.length > 0 ? (
                    locationSearchResults.map((loc, idx) => (
                      <button 
                        key={idx}
                        onClick={() => selectManualLocation(loc)}
                        className="w-full text-left p-3 rounded-xl hover:bg-emerald-50 border border-transparent hover:border-emerald-100 transition-all flex items-start space-x-3 group"
                      >
                         <MapPin className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 mt-0.5" />
                         <span className="text-xs text-slate-600 font-medium group-hover:text-emerald-800 leading-tight">{loc.label}</span>
                      </button>
                    ))
                  ) : locationSearchQuery && !isLocationSearching ? (
                    <p className="text-center py-4 text-slate-400 text-xs italic">No results found for your query.</p>
                  ) : (
                    <p className="text-center py-4 text-emerald-600/60 text-xs font-bold uppercase tracking-widest bg-emerald-50/50 rounded-2xl border border-dashed border-emerald-200">
                      Search by City Name
                    </p>
                  )}
               </div>
            </div>
          </div>
        )}

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
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
      ` }} />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MuezzaApp />
    </ErrorBoundary>
  );
}
