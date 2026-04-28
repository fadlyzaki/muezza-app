import { 
  FALLBACK_LOCATION, 
  INITIAL_PRAYERS, 
  INITIAL_HABITS,
  DEFAULT_DINAR,
  DEFAULT_STREAK,
  SURAH_NAMES_SIMPLE
} from '../constants/muezza_data';

export function getTodayKey() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const localDate = new Date(now.getTime() - offset);
  return localDate.toISOString().split('T')[0];
}

export function getHijriContext(date = new Date()) {
  const fallback = {
    month: null,
    monthName: null,
    day: null,
    weekday: date.getDay(),
    isFriday: date.getDay() === 5,
  };

  try {
    const parts = new Intl.DateTimeFormat('en-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      weekday: 'long',
    }).formatToParts(date);
    const day = Number(parts.find((part) => part.type === 'day')?.value);
    const monthName = parts.find((part) => part.type === 'month')?.value || null;
    const normalizedMonth = monthName?.toLowerCase() || '';
    const monthMap = [
      ['muharram', 1],
      ['safar', 2],
      ['rabi', 3],
      ['jumada', 5],
      ['rajab', 7],
      ['sha', 8],
      ['ramadan', 9],
      ['shawwal', 10],
      ['dhu al-qadah', 11],
      ['dhuʻl-qadah', 11],
      ['dhu al-hijjah', 12],
      ['dhuʻl-hijjah', 12],
      ['dhul hijjah', 12],
    ];
    const matchedMonth = monthMap.find(([label]) => normalizedMonth.includes(label));

    return {
      ...fallback,
      day: Number.isFinite(day) ? day : null,
      month: matchedMonth?.[1] || null,
      monthName,
    };
  } catch {
    return fallback;
  }
}

/**
 * Determine whether a mission bundle should be visible based on the current
 * Islamic calendar context.
 *
 * Returns one of:
 *   'active'   – the event month/day is NOW
 *   'upcoming' – the event is within the bundle's `activeWindow.before` months
 *   'hidden'   – not near the event
 */
export function isBundleSeasonActive(bundle, hijriContext) {
  if (!bundle?.activeWhen) return 'hidden';

  // Weekday-based bundles (e.g. Jummah on Friday)
  if (bundle.activeWhen.weekday !== undefined) {
    return hijriContext.weekday === bundle.activeWhen.weekday ? 'active' : 'hidden';
  }

  // Hijri month-based bundles
  if (bundle.activeWhen.hijriMonth && hijriContext.month) {
    const target = bundle.activeWhen.hijriMonth;
    const current = hijriContext.month;
    const before = bundle.activeWindow?.before ?? 1;

    if (current === target) return 'active';

    // Check proximity window (handles wrap-around, e.g. month 12 → 1)
    for (let i = 1; i <= before; i++) {
      const preMonth = ((target - 1 - i + 12) % 12) + 1;
      if (current === preMonth) return 'upcoming';
    }

    return 'hidden';
  }

  return 'hidden';
}

/**
 * Filter MISSION_BUNDLES to only those that are 'active' or 'upcoming',
 * attaching the status to each returned bundle.
 */
export function getActiveBundles(allBundles, hijriContext) {
  return allBundles
    .map((bundle) => {
      const status = isBundleSeasonActive(bundle, hijriContext);
      return { ...bundle, _status: status };
    })
    .filter((bundle) => bundle._status !== 'hidden');
}

export function parseVerseKey(verseKey) {
  const [chapterId, verseNumber] = String(verseKey || '').split(':').map(Number);
  if (!chapterId || !verseNumber) return null;
  return { chapterId, verseNumber };
}

export function createRangeFromVerseKey(verseKey) {
  const parsed = parseVerseKey(verseKey);
  if (!parsed) return null;
  return `${parsed.chapterId}:${parsed.verseNumber}-${parsed.chapterId}:${parsed.verseNumber}`;
}

export function inferHabitKind(title = '') {
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

export function normalizeHabit(habit) {
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

export function normalizePrayer(prayer) {
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

export function normalizeHabits(habits) {
  return Array.isArray(habits) ? habits.map(normalizeHabit) : INITIAL_HABITS.map(normalizeHabit);
}

export function normalizePrayers(prayers) {
  return Array.isArray(prayers) ? prayers.map(normalizePrayer) : INITIAL_PRAYERS.map(normalizePrayer);
}

export function resetHabitProgress(habits) {
  return habits.map((habit) => ({ ...normalizeHabit(habit), completed: false }));
}

export function resetPrayerProgress(prayers) {
  return prayers.map((prayer) => ({ ...normalizePrayer(prayer), completed: false, missed: false }));
}

export function getTranslationText(verse) {
  const html = verse?.translations?.[0]?.text || '';
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function getVerseReference(verse) {
  const verseKey = verse?.verse_key || verse?.verseKey;
  const parsed = parseVerseKey(verseKey);
  if (!parsed) return verseKey || 'Quran';
  return `${SURAH_NAMES_SIMPLE[parsed.chapterId] || `Surah ${parsed.chapterId}`} ${verseKey}`;
}

export function getVerseAudioUrl(verse) {
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

export function getBookmarkVerseKey(bookmark) {
  return bookmark?.verse_key || bookmark?.verseKey || bookmark?.ayah_key || null;
}

export function formatLocationLabel(location) {
  if (!location) return FALLBACK_LOCATION.label;
  if (location.label) return location.label;
  return [location.city, location.country].filter(Boolean).join(', ') || FALLBACK_LOCATION.label;
}

export function fetchJson(url, options = {}) {
  return fetch(url, options).then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return res.json();
  });
}

export function readStorageJson(key) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function hasStoredAppState() {
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
      lastInsight
  );
}

export function deriveInitialOnboardingState() {
  const storedValue = readStorageJson('muezza_onboarded');
  if (typeof storedValue === 'boolean') {
    return storedValue;
  }
  return hasStoredAppState();
}

export function hasMeaningfulDailyState({ prayers, habits, dinar, streak, inventory, lastInsightRef }) {
  return Boolean(
    prayers.some((prayer) => prayer.completed || prayer.missed) ||
      habits.some((habit) => habit.completed) ||
      dinar !== DEFAULT_DINAR ||
      streak !== DEFAULT_STREAK ||
      inventory.length > 0 ||
      lastInsightRef
  );
}

export async function reverseGeocode(latitude, longitude) {
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
