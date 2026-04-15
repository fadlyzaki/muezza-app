import { 
  FALLBACK_LOCATION, 
  INITIAL_PRAYERS, 
  INITIAL_HABITS,
  DEFAULT_DINAR,
  DEFAULT_STREAK
} from '../constants/muezza_data';

export function getTodayKey() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const localDate = new Date(now.getTime() - offset);
  return localDate.toISOString().split('T')[0];
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
