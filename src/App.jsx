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
  CloudOff,
  RefreshCw,
  WifiOff,
  AlertCircle,
  Zap
} from 'lucide-react';
import { useAuth } from './auth/useAuth';
import LoginButton from './auth/LoginButton';
import { getStreaks, addStreak } from './api/streaks';
import { addBookmark, getBookmarks } from './api/bookmarks';
import CatSVG from './components/CatSVG';
import Onboarding from './components/Onboarding';

import {
  FALLBACK_LOCATION,
  INITIAL_PRAYERS,
  PRAYER_ICONS,
  INITIAL_HABITS,
  SHOP_ITEMS,
  DAILY_INSIGHTS,
  WISDOM_COLLECTION,
  TRANSLATION_OPTIONS,
  DEFAULT_RECITER_ID,
  DEFAULT_DINAR,
  DEFAULT_STREAK,
  INFO_MODAL_VERSION
} from './constants/muezza_data';

import {
  getTodayKey,
  inferHabitKind,
  normalizeHabit,
  normalizePrayer,
  normalizeHabits,
  normalizePrayers,
  resetHabitProgress,
  resetPrayerProgress,
  getTranslationText,
  getVerseAudioUrl,
  getBookmarkVerseKey,
  formatLocationLabel,
  fetchJson,
  readStorageJson,
  hasStoredAppState,
  deriveInitialOnboardingState,
  hasMeaningfulDailyState,
  reverseGeocode
} from './utils/muezza_utils';

import { useLocalStorage } from './hooks/useLocalStorage';
import { ErrorState } from './components/common/ErrorState';
import { WisdomReminder } from './components/modals/WisdomReminder';
import { LocationModal } from './components/modals/LocationModal.jsx';
import { InfoModal } from './components/modals/InfoModal';
import { JourneyModal } from './components/modals/JourneyModal';
import { AdvisorTab } from './components/tabs/AdvisorTab';
import {
  ADVISOR_MOODS,
  MOOD_RESPONSES
} from './constants/muezza_data';
import { HomeTab } from './components/tabs/HomeTab';
import { QuranTab } from './components/tabs/QuranTab';
import { NoorTab } from './components/tabs/NoorTab';
import { SouqTab } from './components/tabs/SouqTab';


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
        <div className="min-h-screen bg-[#E5E0D8] flex items-center justify-center p-6 antialiased">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-2xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-rose-500"></div>
            <CatSVG awake={false} equipped={[]} className="w-40 h-40 mx-auto mb-6 opacity-40 grayscale" />
            <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tighter">System Interruption</h2>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">
              Muezza encountered an unexpected architectural state. Don&apos;t worry—your spiritual progress is safely stored in local state.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-xl hover:shadow-slate-200 active:scale-[0.98]"
            >
              Restart System
            </button>
            <div className="mt-6 pt-6 border-t border-slate-50">
              <p className="text-[10px] text-slate-300 font-mono uppercase tracking-widest bg-slate-50 py-2 rounded-lg">
                Error Code: {this.state.error?.name || 'Unknown'}
              </p>
              <p className="text-[9px] text-slate-400 mt-2 font-mono truncate px-4">
                {this.state.error?.message || 'Standard Runtime Exception'}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const SidebarButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-4 px-6 py-4 rounded-3xl transition-all group ${
      active 
        ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 translate-x-1' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 hover:translate-x-1'
    }`}
  >
    <div className={`p-2 rounded-2xl transition-all ${active ? 'bg-emerald-500' : 'bg-transparent group-hover:bg-white'}`}>
      <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600'}`} />
    </div>
    <span className="font-black text-sm tracking-tight">{label}</span>
  </button>
);

const BottomNavButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center space-y-1 transition-colors flex-1 ${active ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
  >
    <div className={`p-2 rounded-xl transition-all ${active ? 'bg-emerald-50' : 'bg-transparent'}`}>
      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
    </div>
    <span className="text-[9px] font-bold">{label}</span>
  </button>
);

function MuezzaApp() {
  const { accessToken, user, logout } = useAuth();
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
  const [pendingWisdom, setPendingWisdom] = useLocalStorage('muezza_pending_wisdom', null);
  const [pendingReflection, setPendingReflection] = useLocalStorage('muezza_pending_reflection', false);
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

  // Location Search
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [isLocationSearching, setIsLocationSearching] = useState(false);
  const [locationSearchResults, setLocationSearchResults] = useState([]);

  // Advisor States
  const [adviceResult, setAdviceResult] = useState(null);
  const [isAdvisorThinking, setIsAdvisorThinking] = useState(false);

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
        if (lastResetDate) {
          // Calculate yesterday's energy BEFORE resetting
          const habitEnergy = habits
            .filter((habit) => habit.completed)
            .reduce((sum, habit) => sum + habit.energyReward, 0);
          const prayerEnergy = prayers
            .filter((prayer) => prayer.completed)
            .reduce((sum, prayer) => sum + prayer.energyReward, 0);
          const energyYesterday = Math.min(habitEnergy + prayerEnergy, 100);

          if (energyYesterday >= 100) {
            setStreakLocal((current) => current + 1);
            setPendingReflection(true);
            if (accessToken) {
              addStreak(accessToken).catch(() => {});
            }
          } else {
            setStreakLocal(0);
          }
        }

        const missedAllPrayers = prayers.every((p) => !p.completed);
        if (missedAllPrayers && lastResetDate) {
          const randomIndex = Math.floor(Math.random() * WISDOM_COLLECTION.length);
          setPendingWisdom(WISDOM_COLLECTION[randomIndex]);
        }

        setHabits((currentHabits) => resetHabitProgress(currentHabits));
        setPrayers((currentPrayers) => resetPrayerProgress(currentPrayers));
        setLastResetDate(today);
      }
    };

    syncDayBoundary();
    const intervalId = window.setInterval(syncDayBoundary, 60_000);
    return () => window.clearInterval(intervalId);
  }, [
    accessToken,
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

  const fetchSurahs = async () => {
    setIsLoadingQuran(true);
    setQuranError(null);

    try {
      const payload = await fetchJson('/api/chapters');
      setSurahs(payload?.chapters || []);
      setIsLoadingQuran(false);
    } catch (error) {
      console.error('Failed to load surahs:', error);
      setQuranError(error.message);
      setIsLoadingQuran(false);
    }
  };

  useEffect(() => {
    if (activeTab !== 'quran' || surahs.length > 0) return;
    fetchSurahs();
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
    if (!targetPrayer) return;

    const delta = targetPrayer.completed ? -targetPrayer.coinReward : targetPrayer.coinReward;

    setPrayers(
      prayers.map((prayer) =>
        prayer.id === id 
          ? { ...prayer, completed: !prayer.completed, missed: false } 
          : prayer
      ),
    );
    setDinar((currentDinar) => Math.max(0, currentDinar + delta));
  };

  const toggleMissedPrayer = (id) => {
    setPrayers((currentPrayers) =>
      currentPrayers.map((p) =>
        p.id === id 
          ? { ...p, missed: !p.missed, completed: false } 
          : p
      )
    );
  };

  // Auto-Skip Engine
  useEffect(() => {
    if (!prayerTimes) return;

    const interval = setInterval(() => {
      const now = new Date();
      const RITUAL_SEQUENCE = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
      
      setPrayers((currentPrayers) => {
        const nextPrayers = currentPrayers.map((prayer) => {
          if (prayer.completed || prayer.missed) return prayer;

          const currentIndex = RITUAL_SEQUENCE.indexOf(prayer.name);
          if (currentIndex === -1) return prayer;

          let nextRitualName;
          let isNextDay = false;
          
          if (currentIndex === RITUAL_SEQUENCE.length - 1) {
            nextRitualName = RITUAL_SEQUENCE[0]; // Isha -> Fajr
            isNextDay = true;
          } else {
            nextRitualName = RITUAL_SEQUENCE[currentIndex + 1];
          }

          const nextRitualTimeStr = prayerTimes[nextRitualName];
          if (!nextRitualTimeStr) return prayer;

          const [hours, minutes] = nextRitualTimeStr.split(':').map(Number);
          const nextRitualDate = new Date(now);
          nextRitualDate.setHours(hours, minutes, 0, 0);
          if (isNextDay) nextRitualDate.setDate(nextRitualDate.getDate() + 1);

          // Threshold: 15 minutes before next prayer
          const threshold = new Date(nextRitualDate.getTime() - 15 * 60000);

          if (now > threshold) {
            return { ...prayer, missed: true };
          }
          return prayer;
        });

        const hasChanges = JSON.stringify(nextPrayers) !== JSON.stringify(currentPrayers);
        return hasChanges ? nextPrayers : currentPrayers;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [prayerTimes]);

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

  const openEditHabitForm = (habitOrId) => {
    const habitId = typeof habitOrId === 'object' ? habitOrId.id : habitOrId;
    const targetHabit = habits.find((h) => h.id === habitId);
    if (!targetHabit) return;

    setShowAddHabit(true);
    setEditingHabitId(targetHabit.id);
    setNewHabitTitle(targetHabit.title);
    setNewHabitCategory(targetHabit.category);
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
    if (dinar < item.price) return;

    if (item.type === 'food') {
      // CONSUMABLE LOGIC
      setDinar((currentDinar) => currentDinar - item.price);
      
      // Visual feedback: Trigger hearts
      handlePetCat();

      // Mechanical feedback: Energy Boost (if not already at 100)
      setHabits((currentHabits) => {
        const bonusHabit = {
          id: `sustenance_${Date.now()}`,
          title: `Consumed ${item.name}`,
          category: 'Jasad',
          completed: true,
          energyReward: 10,
          coinReward: 0,
          kind: 'sustenance'
        };
        return [...currentHabits, bonusHabit];
      });
      
      // Auto-remove the temporary sustenance habit after energy calculation?
      // Actually, adding it to habits ensures it's counted in the useMemo 'energy'.
      // But we don't want a long list of "Consumed" items.
      // Better way: Adjust energy calculation or use a separate state?
      // Let's use a simpler one-time 'bonusEnergy' state that decays or resets daily.
    } else {
      // PERMANENT EQUIPMENT
      if (!inventory.includes(item.id)) {
        setDinar((currentDinar) => currentDinar - item.price);
        setInventory([...inventory, item.id]);
      }
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
      setPendingReflection(false);
    }
  };

  const handleSeekAdvice = (moodId) => {
    setIsAdvisorThinking(true);
    setAdviceResult(null);
    setTimeout(() => {
      setAdviceResult(MOOD_RESPONSES[moodId] || MOOD_RESPONSES.grateful);
      setIsAdvisorThinking(false);
    }, 2000);
  };

  const resetAdvice = () => {
    setAdviceResult(null);
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
    if (!loc) return;
    const newLoc = { ...loc, source: 'manual' };
    setSavedLocation(newLoc);
    setIsLocationModalOpen(false);
    setLocationSearchQuery('');
    setLocationSearchResults([]);
  };

  const handleDetectLocation = () => {
    setLocationStatus('locating');
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const resolvedLocation = await reverseGeocode(coords.latitude, coords.longitude);
          setSavedLocation(resolvedLocation);
          setLocationStatus('resolved');
          setIsLocationModalOpen(false);
        } catch (error) {
          console.error('Failed to resolve location:', error);
          alert('Could not resolve your precise address. Please search manually.');
          setLocationStatus('idle');
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Location access denied or unavailable.');
        setLocationStatus('idle');
      },
      { timeout: 10000 }
    );
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
    <div className="min-h-screen bg-[#FDFCFB] text-slate-800 font-sans flex overflow-hidden">
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-100 h-screen sticky top-0 z-50 p-8">
        <div className="flex items-center space-x-3 mb-12 px-4">
          <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-800">Muezza</span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={Home} label="Vitals Hub" />
          <SidebarButton active={activeTab === 'quran'} onClick={() => setActiveTab('quran')} icon={Book} label="The Quran" />
          <SidebarButton active={activeTab === 'advisor'} onClick={() => setActiveTab('advisor')} icon={Sparkles} label="Muezza Advisor" />
          <SidebarButton active={activeTab === 'souq'} onClick={() => setActiveTab('souq')} icon={ShoppingBag} label="Spiritual Souq" />
          <SidebarButton active={activeTab === 'noor'} onClick={() => setActiveTab('noor')} icon={Activity} label="Spiritual Path" />
        </nav>

        <div className="mt-auto pt-8 border-t border-slate-50 px-4">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Master Status</p>
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Wallet</span>
                <span className="text-xs font-black text-slate-800">🪙 {dinar}</span>
             </div>
             <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Streak</span>
                <span className="text-xs font-black text-emerald-600">⚡ {streakLocal} Days</span>
             </div>
             <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Sync</span>
                {user ? (
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span>Connected</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">Offline</span>
                )}
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="w-full max-w-6xl mx-auto min-h-full flex flex-col">
            {/* Top Navigation Bar (Header) */}
            <header className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-6 bg-white/80 backdrop-blur-md z-40 sticky top-0 border-b border-slate-100/50">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={() => setActiveTab('noor')}
                  className="flex items-center space-x-1.5 sm:space-x-2.5 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-emerald-50 border border-emerald-100/50 active:scale-95 transition-all group"
                >
                  <Zap className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${streakLocal > 0 ? 'text-amber-500 fill-amber-500 animate-pulse' : 'text-slate-400'}`} />
                  <span className="text-[10px] sm:text-[11px] font-black text-emerald-900 leading-none lowercase tracking-tighter">{streakLocal}<span className="hidden sm:inline"> NOOR STREAK</span></span>
                </button>

                <button 
                  onClick={() => setIsLocationModalOpen(true)}
                  className="flex items-center space-x-1.5 sm:space-x-2 bg-slate-50 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm active:scale-95 transition-all group"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 group-hover:animate-bounce" />
                  <span className="hidden sm:inline text-[11px] font-black text-slate-800 tracking-tight">{formatLocationLabel(savedLocation)}</span>
                </button>
              </div>

              <div className="flex items-center space-x-1.5 sm:space-x-3">
                <div className="hidden sm:flex items-center space-x-2 bg-amber-50/80 px-4 py-2.5 rounded-2xl border border-amber-100 shadow-sm">
                  <span className="text-amber-500 text-sm">🪙</span>
                  <span className="font-mono text-xs font-black text-amber-900 tracking-tighter">{dinar} DINAR</span>
                </div>
                {user ? (
                  <button
                    onClick={() => setActiveTab('noor')}
                    className="flex items-center space-x-1.5 sm:space-x-2 px-2 py-1.5 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl bg-emerald-50 border border-emerald-100 shadow-sm active:scale-95 transition-all group"
                    title={`Synced as ${user.first_name || user.email || 'User'}`}
                  >
                    <div className="relative">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 bg-emerald-600 rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs font-black shadow-sm">
                        {(user.first_name || user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                    </div>
                    <span className="hidden sm:block text-[10px] font-black text-emerald-800 uppercase tracking-wider">Synced</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('noor')}
                    className="flex items-center px-2 py-1.5 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 shadow-sm active:scale-95 transition-all group hover:border-emerald-200"
                  >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-slate-200 rounded-full flex items-center justify-center">
                      <CloudOff className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
                    </div>
                  </button>
                )}
                <button 
                  onClick={() => setShowInfoModal(true)}
                  className="hidden sm:flex p-3 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm"
                >
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </header>

            <main className="flex-1 pb-32 md:pb-12">
          {activeTab === 'home' && (
            <HomeTab 
              energy={energy}
              canReflect={pendingReflection}
              prayers={prayers}
              habits={habits}
              onPet={handlePetCat}
              isPetting={showHearts}
              inventory={inventory}
              catStage={streakLocal >= 30 ? 'majestic' : streakLocal >= 7 ? 'adult' : 'kitten'}
              onTogglePrayer={togglePrayer}
              onToggleMissedPrayer={toggleMissedPrayer}
              onToggleHabit={toggleHabit}
              onEditHabit={openEditHabitForm}
              onDeleteHabit={handleDeleteHabit}
              onAddHabitClick={openAddHabitForm}
              onStartJourney={startJourney}
              onOpenInfoModal={() => setShowInfoModal(true)}
              prayerTimes={prayerTimes}
            />
          )}

          {activeTab === 'quran' && (
            <QuranTab 
              surahs={surahs}
              isLoadingQuran={isLoadingQuran}
              quranError={quranError}
              fetchSurahs={fetchSurahs}
              onOpenSurah={openSurah}
              selectedSurah={selectedSurah}
              onCloseSurah={() => setSelectedSurah(null)}
              verses={verses}
              hasMoreVerses={hasMoreVerses}
              onLoadMore={loadMoreVerses}
              isLoadingMore={isLoadingMore}
              activeAudioVerseKey={activeAudioVerseKey}
              onToggleVerseAudio={toggleVerseAudio}
              isAudioPlaying={isAudioPlaying}
              onToggleBookmark={saveBookmark}
              bookmarkedVerseKeys={bookmarkedVerseKeys}
              quranReadingHabit={quranReadingHabit}
              onToggleHabit={toggleHabit}
              onVerseTafsir={handleVerseTafsir}
              getVerseAudioUrl={getVerseAudioUrl}
              getTranslationText={getTranslationText}
            />
          )}

          {activeTab === 'souq' && (
            <SouqTab 
              dinar={dinar}
              inventory={inventory}
              onBuy={buyItem}
              catStage={streakLocal >= 30 ? 'majestic' : streakLocal >= 7 ? 'adult' : 'kitten'}
            />
          )}

          {activeTab === 'noor' && (
            <NoorTab 
              streak={streakLocal}
              user={user}
              onRefresh={() => {}} 
              isSyncing={false}
              bookmarks={userBookmarks}
              onOpenSurahByBookmark={(bm) => openSurah({ id: bm.surah_id, name_simple: bm.surah_name })}
              onLogout={logout}
              onLogin={() => {}}
            />
          )}

          {activeTab === 'advisor' && (
            <AdvisorTab 
              onSeekAdvice={handleSeekAdvice}
              adviceResult={adviceResult}
              isThinking={isAdvisorThinking}
              onResetAdvice={resetAdvice}
              inventory={inventory}
              catStage={streakLocal >= 30 ? 'majestic' : streakLocal >= 7 ? 'adult' : 'kitten'}
            />
          )}
            </main>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden absolute bottom-0 w-full bg-white border-t border-slate-100 px-3 py-4 flex justify-between items-center z-50 pb-safe shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center space-y-1 transition-colors flex-1 ${activeTab === 'home' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`p-2 rounded-xl transition-all ${activeTab === 'home' ? 'bg-emerald-50' : 'bg-transparent'}`}>
              <Home className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[9px] font-bold">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('quran')}
            className={`flex flex-col items-center space-y-1 transition-colors flex-1 ${activeTab === 'quran' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`p-2 rounded-xl transition-all ${activeTab === 'quran' ? 'bg-emerald-50' : 'bg-transparent'}`}>
              <Book className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[9px] font-bold">Quran</span>
          </button>

          <button
            onClick={() => setActiveTab('advisor')}
            className={`flex flex-col items-center space-y-1 transition-colors flex-1 ${activeTab === 'advisor' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`p-2 rounded-xl transition-all ${activeTab === 'advisor' ? 'bg-emerald-50' : 'bg-transparent'}`}>
              <Sparkles className={`w-5 h-5 sm:w-6 sm:h-6 ${activeTab === 'advisor' ? 'text-amber-500 fill-amber-500 shadow-sm' : ''}`} />
            </div>
            <span className="text-[9px] font-bold">Advisor</span>
          </button>

          <button
            onClick={() => setActiveTab('souq')}
            className={`flex flex-col items-center space-y-1 transition-colors flex-1 ${activeTab === 'souq' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`p-2 rounded-xl transition-all ${activeTab === 'souq' ? 'bg-emerald-50' : 'bg-transparent'}`}>
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[9px] font-bold">Souq</span>
          </button>

          <button
            onClick={() => setActiveTab('noor')}
            className={`flex flex-col items-center space-y-1 transition-colors flex-1 ${activeTab === 'noor' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`p-2 rounded-xl transition-all ${activeTab === 'noor' ? 'bg-emerald-50' : 'bg-transparent'}`}>
              <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[9px] font-bold">Noor</span>
          </button>
        </div>

        <JourneyModal 
          isOpen={isJourneying || !!journeyResult || !!journeyError}
          isJourneying={isJourneying}
          mode={journeyMode}
          result={journeyResult}
          error={journeyError}
          onClose={completeJourney}
          onRetry={() => {
            setJourneyError(null);
            setIsJourneying(true);
            handlePetCat();
          }}
          inventory={inventory}
        />

        <InfoModal 
          isOpen={showInfoModal}
          onClose={closeInfoModal}
          activeTab={infoModalTab}
          setActiveTab={setInfoModalTab}
          onReset={handleExportData} 
        />


        <LocationModal 
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          searchQuery={locationSearchQuery}
          setSearchQuery={setLocationSearchQuery}
          onSearch={handleCitySearch}
          searchResults={locationSearchResults}
          isSearching={isLocationSearching}
          onSelectResult={selectManualLocation}
          onDetect={handleDetectLocation} 
        />

        {/* Habit Composer Modal */}
        {showAddHabit && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
            <div 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={resetHabitComposer}
            />
            <div className="relative w-full max-w-md bg-white rounded-t-[3rem] sm:rounded-[4rem] p-10 shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
              <div className="w-16 h-1.5 bg-slate-100 rounded-full mx-auto mb-10 sm:hidden" />
              
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tighter">
                    {editingHabitId ? 'Refine Path' : 'New Habit'}
                  </h3>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">
                    Grounded Ritual Performance
                  </p>
                </div>
                <button 
                  onClick={resetHabitComposer}
                  className="p-3 bg-slate-50 text-slate-400 rounded-2xl border border-slate-100 active:scale-95 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Habit Definition</label>
                  <input
                    type="text"
                    placeholder="e.g., Read 10 Ayahs of Quran..."
                    value={newHabitTitle}
                    onChange={(e) => setNewHabitTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 p-5 rounded-3xl text-slate-800 font-bold placeholder:text-slate-300 focus:outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                    autoFocus
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Dimensional Focus</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Ruh', 'Aql', 'Jasad'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setNewHabitCategory(cat)}
                        className={`py-4 rounded-2xl font-black text-[11px] uppercase tracking-tighter border-2 transition-all ${
                          newHabitCategory === cat
                            ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/20 scale-[0.98]'
                            : 'bg-white border-slate-100 text-slate-400 hover:border-emerald-100 hover:bg-emerald-50/30'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSaveHabit}
                  disabled={!newHabitTitle.trim()}
                  className={`w-full py-5 rounded-[2.5rem] font-black text-lg shadow-xl transition-all flex items-center justify-center space-x-3 active:scale-[0.98] mt-4 ${
                    newHabitTitle.trim()
                      ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20'
                      : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className={`w-6 h-6 ${newHabitTitle.trim() ? 'text-emerald-400' : ''}`} />
                  <span>{editingHabitId ? 'Save Changes' : 'Initialize Habit'}</span>
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Main Footer */}
        <footer className="mt-12 mb-8 px-6 flex flex-col items-center justify-center space-y-4 opacity-40 hover:opacity-100 transition-opacity">
          <div className="flex items-center space-x-4">
            <a href="/privacy" className="text-[10px] font-bold text-slate-500 hover:text-emerald-700 uppercase tracking-widest transition-colors">Privacy Policy</a>
            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
            <a href="/terms" className="text-[10px] font-bold text-slate-500 hover:text-emerald-700 uppercase tracking-widest transition-colors">Terms of Service</a>
          </div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
            © 2026 <a href="https://fadlyzaki-design.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors">Fadly Uzzaki</a> • Grounded Quranic Habits
          </p>
        </footer>
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
