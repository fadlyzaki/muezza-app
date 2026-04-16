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

export const SURAH_NAMES_SIMPLE = [
  null,
  'Al-Fatihah',
  'Al-Baqarah',
  'Ali Imran',
  'An-Nisa',
  "Al-Ma'idah",
  "Al-An'am",
  "Al-A'raf",
  'Al-Anfal',
  'At-Tawbah',
  'Yunus',
  'Hud',
  'Yusuf',
  "Ar-Ra'd",
  'Ibrahim',
  'Al-Hijr',
  'An-Nahl',
  'Al-Isra',
  'Al-Kahf',
  'Maryam',
  'Taha',
  'Al-Anbya',
  'Al-Hajj',
  "Al-Mu'minun",
  'An-Nur',
  'Al-Furqan',
  "Ash-Shu'ara",
  'An-Naml',
  'Al-Qasas',
  'Al-Ankabut',
  'Ar-Rum',
  'Luqman',
  'As-Sajdah',
  'Al-Ahzab',
  'Saba',
  'Fatir',
  'Ya-Sin',
  'As-Saffat',
  'Sad',
  'Az-Zumar',
  'Ghafir',
  'Fussilat',
  'Ash-Shuraa',
  'Az-Zukhruf',
  'Ad-Dukhan',
  'Al-Jathiyah',
  'Al-Ahqaf',
  'Muhammad',
  'Al-Fath',
  'Al-Hujurat',
  'Qaf',
  'Adh-Dhariyat',
  'At-Tur',
  'An-Najm',
  'Al-Qamar',
  'Ar-Rahman',
  "Al-Waqi'ah",
  'Al-Hadid',
  'Al-Mujadila',
  'Al-Hashr',
  'Al-Mumtahanah',
  'As-Saff',
  "Al-Jumu'ah",
  'Al-Munafiqun',
  'At-Taghabun',
  'At-Talaq',
  'At-Tahrim',
  'Al-Mulk',
  'Al-Qalam',
  'Al-Haqqah',
  "Al-Ma'arij",
  'Nuh',
  'Al-Jinn',
  'Al-Muzzammil',
  'Al-Muddaththir',
  'Al-Qiyamah',
  'Al-Insan',
  'Al-Mursalat',
  'An-Naba',
  "An-Nazi'at",
  'Abasa',
  'At-Takwir',
  'Al-Infitar',
  'Al-Mutaffifin',
  'Al-Inshiqaq',
  'Al-Buruj',
  'At-Tariq',
  "Al-A'la",
  'Al-Ghashiyah',
  'Al-Fajr',
  'Al-Balad',
  'Ash-Shams',
  'Al-Layl',
  'Ad-Duhaa',
  'Ash-Sharh',
  'At-Tin',
  'Al-Alaq',
  'Al-Qadr',
  'Al-Bayyinah',
  'Az-Zalzalah',
  'Al-Adiyat',
  "Al-Qari'ah",
  'At-Takathur',
  'Al-Asr',
  'Al-Humazah',
  'Al-Fil',
  'Quraysh',
  "Al-Ma'un",
  'Al-Kawthar',
  'Al-Kafirun',
  'An-Nasr',
  'Al-Masad',
  'Al-Ikhlas',
  'Al-Falaq',
  'An-Nas',
];

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
  { id: 'tasbih_amber', name: 'Amber Tasbih', price: 120, type: 'accessory', icon: '📿', desc: 'A string of amber prayer beads for dhikr.' },
  { id: 'scarf_sky', name: 'Sky Scarf', price: 140, type: 'accessory', icon: '🧣', desc: 'A light blue scarf for a refined look.' },
  { id: 'sunglasses_rose', name: 'Rose Sunglasses', price: 180, type: 'accessory', icon: '🕶️', desc: 'Stylish rose-tinted shades.' },
  { id: 'bow_lilac', name: 'Lilac Bow', price: 90, type: 'accessory', icon: '🎀', desc: 'A dainty lilac bow for the ear.' },
  { id: 'lantern_gold', name: 'Golden Fanoos', price: 200, type: 'decor', icon: '🏮', desc: 'Illuminates the room.' },
  { id: 'sajjadah_midnight', name: 'Midnight Sajjadah', price: 220, type: 'rug', icon: '🌌', desc: 'A deep-blue rug with moonlit accents.' },
  
  // Food & Sustenance
  // Food & Sustenance
  { id: 'zamzam_water', name: 'Zamzam Water', price: 45, type: 'food', icon: '💧', desc: 'Sacred water from Makkah to keep Muezza hydrated.' },
  { id: 'milk_camel', name: 'Camel Milk', price: 50, type: 'food', icon: '🥛', desc: 'Fresh desert milk, exactly how traditional cats like it.' },
  { id: 'fish_bosphorus', name: 'Bosphorus Anchovy', price: 65, type: 'food', icon: '🐟', desc: 'A fresh catch favored by the beloved street cats of Istanbul.' },
  { id: 'meat_halal', name: 'Halal Chicken Cut', price: 80, type: 'food', icon: '🍗', desc: 'Premium halal-certified poultry for your carnivorous friend.' },
  { id: 'catnip_madinah', name: 'Madinah Catnip', price: 30, type: 'food', icon: '🌿', desc: 'A natural, soothing herb grown in the blessed city.' },
  { id: 'olives_green', name: 'Blessed Olives', price: 40, type: 'food', icon: '🫒', desc: 'From a blessed tree. Cats famously go crazy for their scent!' },
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
  { id: 'impatient', label: 'Impatient', sub: 'Istiqamah', icon: '🏃' },
  { id: 'lonely', label: 'Lonely', sub: 'Uns', icon: '🕯️' },
  { id: 'joyful', label: 'Joyful', sub: 'Hamd', icon: '✨' },
  { id: 'confident', label: 'Confident', sub: 'Taqwa', icon: '🛡️' },
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
  },
  impatient: {
    muezza_advice: "Speed is for the dunya, but the heart travels in circles around the One. Slow your whiskers down, child. Istiqamah is not a sprint; it is the courage to repeat small good deeds without ceasing.",
    verse: "So remain on a right course as you have been commanded...",
    reference: "Surah Hud 11:112",
    tafsir: "Consistency is more beloved to Allah than a temporary burst of extreme effort. True strength is found in the quiet repetition of the path."
  },
  lonely: {
    muezza_advice: "Isolation is the playground of the mind, but solitude is the palace of the heart. You are never alone when the One who created your pulse is closer than your jugular vein. Let Uns (intimacy with the Divine) warm you.",
    verse: "And We have already created man and know what his soul whispers to him, and We are closer to him than [his] jugular vein.",
    reference: "Surah Qaf 50:16",
    tafsir: "Loneliness is often a call from the Divine to return to a conversation that the world was drowning out. It is an invitation into closeness."
  },
  joyful: {
    muezza_advice: "Ah! My ears are perked up at your light! Joy is a sign that you have recognized a gift from the Source. Amplify this light by sharing it, for Hamd (praise) is the fuel that keeps a blessing alive.",
    verse: "Say, 'In the bounty of Allah and in His mercy - in that let them rejoice; it is better than what they accumulate.'",
    reference: "Surah Yunus 10:58",
    tafsir: "True joy is not found in the gift itself, but in the recognition of the Giver. Rejoicing in Allah's mercy is a form of worship that illuminates the substrate."
  },
  confident: {
    muezza_advice: "Stability looks good on you! But remember, true confidence (Taqwa) is not self-assurance; it is 'Allah-assurance.' It is the shield that keeps your steps steady because you know who is guarding your back.",
    verse: "And whoever fears Allah - He will make for him a way out.",
    reference: "Surah At-Talaq 65:2",
    tafsir: "Confidence is the byproduct of consciousness. When you are aware of the Highest Security, the local threats of the world lose their power over you."
  }
};
