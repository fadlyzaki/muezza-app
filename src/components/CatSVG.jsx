import React from 'react';

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

export default CatSVG;
