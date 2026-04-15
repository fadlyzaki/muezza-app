import { Sunrise, Sun, Sunset, Moon } from 'lucide-react';

export const FALLBACK_LOCATION = {
  city: 'Padang',
  country: 'Indonesia',
  latitude: -0.9471,
  longitude: 100.4172,
  label: 'Padang, Indonesia',
  source: 'fallback',
};

export const INITIAL_PRAYERS = [
  { id: 'fajr', name: 'Fajr', completed: false, missed: false, energyReward: 10, coinReward: 10 },
  { id: 'dhuhr', name: 'Dhuhr', completed: false, missed: false, energyReward: 10, coinReward: 10 },
  { id: 'asr', name: 'Asr', completed: false, missed: false, energyReward: 10, coinReward: 10 },
  { id: 'maghrib', name: 'Maghrib', completed: false, missed: false, energyReward: 10, coinReward: 10 },
  { id: 'isha', name: 'Isha', completed: false, missed: false, energyReward: 10, coinReward: 10 },
];

export const PRAYER_ICONS = {
  fajr: Sunrise,
  dhuhr: Sun,
  asr: Sun,
  maghrib: Sunset,
  isha: Moon,
};

export const INITIAL_HABITS = [
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

export const SHOP_ITEMS = [
  // Spiritual Modules
  { id: 'sajjadah_red', name: 'Crimson Sajjadah', price: 60, type: 'rug', icon: '📿', desc: 'A beautiful prayer mat.' },
  { id: 'kufi_green', name: 'Emerald Kufi', price: 100, type: 'hat', icon: '🧢', desc: 'Keep Muezza looking sharp.' },
  { id: 'glasses_smart', name: 'Scholarly Glasses', price: 150, type: 'accessory', icon: '👓', desc: 'For deep Tafsir reading.' },
  { id: 'turban_cream', name: 'Cream Turban', price: 160, type: 'hat', icon: '🤍', desc: 'A classic wrap for a scholarly look.' },
  { id: 'lantern_gold', name: 'Golden Fanoos', price: 200, type: 'decor', icon: '🏮', desc: 'Illuminates the room.' },
  { id: 'sajjadah_midnight', name: 'Midnight Sajjadah', price: 220, type: 'rug', icon: '🌌', desc: 'A deep-blue rug with moonlit accents.' },
  
  // Food & Sustenance
  { id: 'dates_ajwa', name: 'Ajwa Dates', price: 30, type: 'food', icon: '🌴', desc: 'Sun-ripened dates from Madinah.' },
  { id: 'zamzam_water', name: 'Zamzam Water', price: 45, type: 'food', icon: '💧', desc: 'Sacred water for spiritual vitality.' },
  { id: 'honey_sidr', name: 'Yemeni Honey', price: 80, type: 'food', icon: '🍯', desc: 'Pure Sidr honey for energy restoration.' },
  { id: 'milk_camel', name: 'Camel Milk', price: 50, type: 'food', icon: '🥛', desc: 'Fresh, nutrient-rich desert milk.' },
];

export const DAILY_INSIGHTS = [
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

export const WISDOM_COLLECTION = [
  {
    text: "The first thing that the servant will be called to account for on the Day of Resurrection will be the prayer.",
    source: "Hadith: At-Tirmidhi"
  },
  {
    text: "Prayer is a pillar of the religion. He who establishes it, establishes the religion.",
    source: "Hadith: Shu'ab al-Iman"
  },
  {
    text: "The heart needs a grounding force to withstand the storms of the world. Let prayer be your anchor today.",
    source: "Muezza Reflection"
  },
  {
    text: "Do not let yesterday's silence prevent today's Niyyah. Every prostration is a new beginning.",
    source: "Muezza Reflection"
  },
  {
    text: "Salah is not just a duty; it is a conversation with the Creator. Reconnect and find peace.",
    source: "Muezza Reflection"
  }
];

export const TRANSLATION_OPTIONS = [
  { id: 20, label: 'EN', name: 'Saheeh International' },
];

export const DEFAULT_RECITER_ID = 2;
export const DEFAULT_DINAR = 40;
export const DEFAULT_STREAK = 0;
export const INFO_MODAL_VERSION = 'v2';

export const ADVISOR_MOODS = [
  { id: 'grateful', label: 'Grateful', sub: 'Shukr', icon: '🤲' },
  { id: 'anxious', label: 'Anxious', sub: 'Tawakkul', icon: '🍃' },
  { id: 'tired', label: 'Overwhelmed', sub: 'Sabr', icon: '⏳' },
  { id: 'searching', label: 'Searching', sub: 'Hidayah', icon: '🧭' },
];

export const MOOD_RESPONSES = {
  grateful: {
    muezza_advice: "Assalamualaikum! My whiskers are twitching with joy for you. Gratitude is a catalyst—it expands the heart and invites more blessings into your substrate.",
    verse: "And [remember] when your Lord proclaimed, 'If you are grateful, I will surely increase you [in favor]...'",
    reference: "Surah Ibrahim 14:7",
    tafsir: "Shukr is not just a 'thank you'. It is the preservation of blessings through their recognition and use in ways that please the Creator."
  },
  anxious: {
    muezza_advice: "Peace be upon your heart, seeker. When the winds of dunya blow too hard, remember that I don't worry about my next bowl of milk because it is recorded. Your provision and path are even more secure.",
    verse: "And will provide for him from where he does not expect. And whoever relies upon Allah - then He is sufficient for him.",
    reference: "Surah At-Talaq 65:3",
    tafsir: "Tawakkul is the quiet confidence that the outcome is handled, allowing the mind to focus exclusively on the effort."
  },
  tired: {
    muezza_advice: "Even Muezza needs a long nap sometimes. But remember, every heavy breath you take in patience is a form of dhikr. Your struggle is not invisible; it is being written as strength.",
    verse: "O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.",
    reference: "Surah Al-Baqarah 2:153",
    tafsir: "Sabr is not passive waiting; it is the active restraint of the soul from despair while maintaining the rhythm of worship."
  },
  searching: {
    muezza_advice: "The pursuit of knowledge is a light that never dims. My scholarly glasses are ready! To search is to admit that only He can guide, and that admission is the first step of Hidayah.",
    verse: "And He found you lost and guided [you].",
    reference: "Surah Ad-Duhaa 93:7",
    tafsir: "Guidance is a continuous divine response to a sincere heart. If you are looking, it is because He is already reaching for you."
  }
};
