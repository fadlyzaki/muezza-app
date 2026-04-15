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
  AlertCircle
} from 'lucide-react';
import { useAuth } from './auth/useAuth';
import LoginButton from './auth/LoginButton';
import { getStreaks } from './api/streaks';
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
import { AdvisorModal } from './components/modals/AdvisorModal';
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
  const [pendingWisdom, setPendingWisdom] = useLocalStorage('muezza_pending_wisdom', null);
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
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);
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
        // DETECT MISSED DAY: If zero prayers were done yesterday
        const missedAllPrayers = prayers.every((p) => !p.completed);
        if (missedAllPrayers) {
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

  const handleOpenAdvisorModal = () => {
    setAdviceResult(null);
    setIsAdvisorModalOpen(true);
  };

  const handleSeekAdvice = (moodId) => {
    setIsAdvisorThinking(true);
    setAdviceResult(null);

    // Simulate AI Reflection thinking time
    setTimeout(() => {
      const result = MOOD_RESPONSES[moodId];
      setAdviceResult(result);
      setIsAdvisorThinking(false);
    }, 1800);
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
            <HomeTab 
              dinar={dinar}
              streak={streakLocal}
              energy={totalDailyPercentage}
              prayers={prayers}
              habits={habits}
              locationLabel={formatLocationLabel(savedLocation)}
              onOpenLocationModal={() => setShowLocationModal(true)}
              onPet={handlePetCat}
              isPetting={isPetting}
              inventory={inventory}
              onTogglePrayer={togglePrayer}
              onToggleHabit={toggleHabit}
              onEditHabit={handleEditHabit}
              onAddHabitClick={() => setShowAddHabit(true)}
              onStartJourney={startJourney}
              onOpenInfoModal={() => setShowInfoModal(true)}
              onOpenAdvisorModal={handleOpenAdvisorModal}
            />
          )}

          {activeTab === 'quran' && (
            <QuranTab 
              surahs={surahs}
              isLoading={isLoadingQuran}
              error={quranError}
              onRetry={fetchSurahs}
              onOpenSurah={openSurah}
              selectedSurah={selectedSurah}
              onCloseSurah={() => setSelectedSurah(null)}
              verses={verses}
              hasNextPage={hasMoreVerses}
              onLoadMore={loadMoreVerses}
              isLoadingMore={isLoadingMore}
              activeAudio={activeAudioVerseKey}
              onToggleAudio={toggleVerseAudio}
              isPlaying={isAudioPlaying}
              onBookmark={saveBookmark}
              bookmarkedKeys={bookmarkedVerseKeys}
              readingHabit={quranReadingHabit}
              onToggleHabit={toggleHabit}
              onTafsir={handleVerseTafsir}
            />
          )}

          {activeTab === 'souq' && (
            <SouqTab 
              dinar={dinar}
              inventory={inventory}
              onBuy={buyItem}
            />
          )}

          {activeTab === 'noor' && (
            <NoorTab 
              streak={streakLocal}
              user={accessToken ? { name: "Warrior" } : null}
              onRefresh={() => {}} 
              isSyncing={false}
              bookmarks={bookmarks}
              onOpenSurahByBookmark={(bm) => openSurah({ id: bm.surah_id, name_simple: bm.surah_name })}
            />
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

          <button
            onClick={() => setActiveTab('noor')}
            className={`flex flex-col items-center space-y-1 transition-colors flex-1 ${activeTab === 'noor' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`p-2 rounded-xl transition-all ${activeTab === 'noor' ? 'bg-emerald-50' : 'bg-transparent'}`}>
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold">Noor</span>
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
            handleMuezzaClick();
          }}
          inventory={inventory}
        />

        <InfoModal 
          isOpen={showInfoModal}
          onClose={() => setShowInfoModal(false)}
        />

        <AdvisorModal 
          isOpen={isAdvisorModalOpen}
          onClose={() => setIsAdvisorModalOpen(false)}
          onSeekAdvice={handleSeekAdvice}
          adviceResult={adviceResult}
          isThinking={isAdvisorThinking}
        />

        <LocationModal 
          isOpen={showLocationModal}
          onClose={() => setShowLocationModal(false)}
          searchQuery={locationSearchQuery}
          onSearchChange={(e) => setLocationSearchQuery(e.target.value)}
          onSearch={handleCitySearch}
          results={locationSearchResults}
          isSearching={isLocationSearching}
          onSelect={selectManualLocation}
        />


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
