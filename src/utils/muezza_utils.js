import { FALLBACK_LOCATION, INITIAL_PRAYERS, INITIAL_HABITS } from '../constants/muezza_data';

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
