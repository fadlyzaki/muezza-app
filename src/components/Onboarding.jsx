import React, { useState } from 'react';
import CatSVG from './CatSVG';
import { Sparkles, BookOpen, Star, Moon, ArrowRight, Heart } from 'lucide-react';

const STEPS = [
  { id: 'welcome' },
  { id: 'loop' },
  { id: 'goal' },
  { id: 'launch' },
];

const GOALS = [
  {
    id: 'quran',
    title: 'Quran Journey',
    emoji: '📖',
    desc: 'Focus on daily Quran reading & reflection',
    color: 'emerald',
    habits: [
      { id: 10, title: 'Read 1 Page of Quran', category: 'Aql', completed: false, reward: 25 },
      { id: 11, title: 'Listen to a Surah recitation', category: 'Qalb', completed: false, reward: 25 },
      { id: 12, title: 'Reflect on one Ayah meaning', category: 'Ruh', completed: false, reward: 25 },
    ],
  },
  {
    id: 'prayer',
    title: 'Prayer Devotion',
    emoji: '🕌',
    desc: 'Perfect your salah & connection with Allah',
    color: 'blue',
    habits: [
      { id: 20, title: 'Pray Fajr on time', category: 'Ruh', completed: false, reward: 25 },
      { id: 21, title: 'Make Dhikr after each prayer', category: 'Qalb', completed: false, reward: 25 },
      { id: 22, title: 'Pray 2 Rakat Sunnah', category: 'Ruh', completed: false, reward: 25 },
    ],
  },
  {
    id: 'character',
    title: 'Noble Character',
    emoji: '🌙',
    desc: 'Daily acts of kindness & self-improvement',
    color: 'amber',
    habits: [
      { id: 30, title: 'Do one act of kindness', category: 'Qalb', completed: false, reward: 25 },
      { id: 31, title: 'Say Alhamdulillah 10 times', category: 'Ruh', completed: false, reward: 25 },
      { id: 32, title: 'Drink water & take care of Jasad', category: 'Jasad', completed: false, reward: 25 },
    ],
  },
];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(prev => prev + 1);
      setIsTransitioning(false);
    }, 300);
  };

  const handleComplete = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      onComplete(selectedGoal);
    }, 400);
  };

  const currentStep = STEPS[step];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a3a2a] via-[#0f2b1e] to-[#0a1f15] flex items-center justify-center p-6 overflow-hidden">
      {/* Ambient floating particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 animate-pulse"
            style={{
              width: `${8 + i * 4}px`,
              height: `${8 + i * 4}px`,
              background: 'radial-gradient(circle, #34d399, transparent)',
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div
        className={`w-full max-w-sm transition-all duration-300 ease-out ${
          isTransitioning ? 'opacity-0 translate-y-4 scale-95' : 'opacity-100 translate-y-0 scale-100'
        }`}
      >
        {/* Step Indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === step
                  ? 'w-8 bg-emerald-400'
                  : i < step
                  ? 'w-4 bg-emerald-600'
                  : 'w-4 bg-emerald-900/50'
              }`}
            />
          ))}
        </div>

        {/* ===== STEP 1: Welcome ===== */}
        {currentStep.id === 'welcome' && (
          <div className="flex flex-col items-center text-center">
            {/* Glowing ring behind cat */}
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-3xl scale-150 animate-pulse" />
              <CatSVG awake={false} equipped={[]} isPetting={false} className="w-48 h-48 mx-auto relative z-10" />
            </div>

            <p className="text-emerald-400/80 text-xs font-bold uppercase tracking-[0.3em] mb-3">
              بسم الله الرحمن الرحيم
            </p>

            <h1 className="text-3xl font-extrabold text-white mb-3 leading-tight">
              Assalamu'alaikum! 👋
            </h1>
            <h2 className="text-xl font-bold text-emerald-300 mb-4">
              I'm Muezza
            </h2>

            <p className="text-emerald-100/70 text-sm leading-relaxed max-w-xs mb-8">
              Your spiritual companion on the journey of faith.
              Together, we'll build beautiful daily habits that bring you closer to Allah.
            </p>

            <button
              onClick={goNext}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-400/30 hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
            >
              <span>Let's Begin</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* ===== STEP 2: The Spiritual Loop ===== */}
        {currentStep.id === 'loop' && (
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-3xl scale-150 animate-pulse" />
              <CatSVG awake={true} equipped={[]} isPetting={false} className="w-40 h-40 mx-auto relative z-10" />
            </div>

            <h2 className="text-2xl font-extrabold text-white mb-4">
              Every Deed Counts
            </h2>

            <div className="w-full space-y-3 mb-8">
              {[
                { icon: Star, text: 'Complete your 5 daily prayers', color: 'text-amber-400' },
                { icon: Heart, text: 'Build Sunnah habits for body, mind & soul', color: 'text-rose-400' },
                { icon: BookOpen, text: 'Read Quran with tafsir insights', color: 'text-emerald-400' },
                { icon: Sparkles, text: 'Watch my energy grow with your progress!', color: 'text-sky-400' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-left"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className={`${item.color} shrink-0`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <p className="text-emerald-100/80 text-sm font-medium">{item.text}</p>
                </div>
              ))}
            </div>

            {/* Simulated energy bar */}
            <div className="w-full bg-emerald-900/50 rounded-full h-3 mb-6 overflow-hidden border border-emerald-800/50">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all duration-1000"
                style={{ width: '75%' }}
              />
            </div>
            <p className="text-emerald-400/60 text-xs font-medium mb-6">
              My energy grows with each deed you complete ✨
            </p>

            <button
              onClick={goNext}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-400/30 hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
            >
              <span>I Understand</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* ===== STEP 3: Choose Your Path ===== */}
        {currentStep.id === 'goal' && (
          <div className="flex flex-col items-center text-center">
            <div className="mb-2">
              <Moon className="w-10 h-10 text-emerald-400 mx-auto" />
            </div>

            <h2 className="text-2xl font-extrabold text-white mb-2">
              Choose Your Path
            </h2>
            <p className="text-emerald-100/60 text-sm mb-6">
              What would you like to focus on first?
            </p>

            <div className="w-full space-y-3 mb-8">
              {GOALS.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 text-left group ${
                    selectedGoal?.id === goal.id
                      ? 'bg-emerald-500/15 border-emerald-400 shadow-lg shadow-emerald-500/10'
                      : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/8'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-all ${
                      selectedGoal?.id === goal.id
                        ? 'bg-emerald-500/20 scale-110'
                        : 'bg-white/5'
                    }`}
                  >
                    {goal.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-bold transition-colors ${
                        selectedGoal?.id === goal.id ? 'text-emerald-300' : 'text-white'
                      }`}
                    >
                      {goal.title}
                    </h3>
                    <p className="text-xs text-emerald-100/50 mt-0.5">{goal.desc}</p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                      selectedGoal?.id === goal.id
                        ? 'border-emerald-400 bg-emerald-400'
                        : 'border-white/20'
                    }`}
                  >
                    {selectedGoal?.id === goal.id && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={goNext}
              disabled={!selectedGoal}
              className={`w-full font-bold py-4 px-8 rounded-2xl transition-all flex items-center justify-center gap-2 group ${
                selectedGoal
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-400/30 hover:-translate-y-0.5'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              <span>Continue</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* ===== STEP 4: Launch ===== */}
        {currentStep.id === 'launch' && (
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-emerald-400/15 blur-3xl scale-[2] animate-pulse" />
              <div className="absolute inset-0 rounded-full bg-amber-400/10 blur-2xl scale-125 animate-pulse" style={{ animationDelay: '1s' }} />
              <CatSVG awake={true} equipped={[]} isPetting={true} className="w-52 h-52 mx-auto relative z-10" />
            </div>

            <h2 className="text-2xl font-extrabold text-white mb-3">
              Our Journey Begins 🌟
            </h2>

            <p className="text-emerald-100/70 text-sm leading-relaxed max-w-xs mb-3">
              May this app be a source of <span className="text-emerald-300 font-bold">Barakah</span> for you.
              Every small step is a victory in the eyes of Allah.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 mb-8 backdrop-blur-sm">
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">Your Focus</p>
              <p className="text-white font-bold text-lg">{selectedGoal?.emoji} {selectedGoal?.title}</p>
            </div>

            <button
              onClick={handleComplete}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-white font-extrabold py-4 px-8 rounded-2xl transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-400/40 hover:-translate-y-0.5 flex items-center justify-center gap-2 group text-lg"
            >
              <span>Enter the Dashboard</span>
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
