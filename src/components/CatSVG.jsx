import React from 'react';

const CatSVG = ({ awake, equipped, isPetting, onPet, stage = 'adult', className = "w-56 h-56 mx-auto" }) => {
  const isKitten = stage === 'kitten';
  const isMajestic = stage === 'majestic';
  
  // Base scales: kitten is smaller, majestic is slightly bigger/larger presence
  const scaleFactor = isKitten ? 0.75 : isMajestic ? 1.05 : 1.0;
  const bodyColor = isKitten ? '#FFE5D9' : '#FAEDCD';
  const earColor = isKitten ? '#EAC7A1' : '#D4A373';
  const tailColor = isKitten ? '#EAC7A1' : '#D4A373';

  return (
    <svg 
      viewBox="0 0 200 200" 
      className={`${className} drop-shadow-lg transition-all duration-700 ${awake ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}`}
      onClick={awake ? onPet : undefined}
      style={{
        filter: isMajestic ? 'drop-shadow(0 0 12px rgba(251, 191, 36, 0.6))' : undefined,
      }}
    >
      <g transform={`translate(${100 - 100 * scaleFactor}, ${120 - 120 * scaleFactor}) scale(${scaleFactor})`}>
        {/* Dynamic Sajjadah (Rug) */}
        {equipped?.includes('sajjadah_red') && (
          <rect x="30" y="150" width="140" height="20" rx="10" fill="#9b2226" />
        )}
        {equipped?.includes('sajjadah_red') && (
          <path d="M20 160 L40 160 M160 160 L180 160" stroke="#f4a261" strokeWidth="4" strokeDasharray="4 4"/>
        )}
        {equipped?.includes('sajjadah_midnight') && (
          <rect x="28" y="148" width="144" height="24" rx="12" fill="#1d3557" />
        )}
        {equipped?.includes('sajjadah_midnight') && (
          <path d="M38 160 H162" stroke="#a8dadc" strokeWidth="3" strokeDasharray="10 6" />
        )}

        {/* Majestic Aura/Halo */}
        {isMajestic && (
          <g className="animate-pulse">
            <circle cx="100" cy="80" r="60" fill="url(#majesticGlow)" opacity="0.4" />
            <defs>
              <radialGradient id="majesticGlow">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
              </radialGradient>
            </defs>
            <path d="M70 40 Q100 20 130 40" stroke="#fbbf24" strokeWidth="2" fill="none" opacity="0.6" />
          </g>
        )}

        {/* Ears */}
        <path d="M60 70 L50 30 L90 60 Z" fill={earColor} />
        <path d="M140 70 L150 30 L110 60 Z" fill={earColor} />
        {/* Body & Head */}
        <circle cx="100" cy="110" r="50" fill={bodyColor} />
        <circle cx="100" cy="90" r={isKitten ? 45 : 40} fill={bodyColor} />
        
        {/* Dynamic Kufi (Hat) */}
        {equipped?.includes('kufi_green') && (
          <path d="M75 65 Q100 40 125 65 Z" fill="#2a9d8f" />
        )}
        {equipped?.includes('turban_cream') && (
          <g>
            <ellipse cx="100" cy="62" rx="28" ry="12" fill="#f5ebe0" />
            <path d="M74 64 Q100 48 126 64" fill="#e9d8c5" />
            <path d="M121 64 Q129 74 122 82" stroke="#d6ccc2" strokeWidth="6" strokeLinecap="round" fill="none" />
          </g>
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
        {equipped?.includes('tasbih_amber') && (
          <g transform="translate(48, 118)">
            <path d="M0 0 Q12 22 28 18" stroke="#b5651d" strokeWidth="3" fill="none" />
            {[0, 6, 12, 18, 24].map((offset) => (
              <circle key={offset} cx={offset} cy={offset === 24 ? 16 : offset === 18 ? 18 : offset === 12 ? 16 : offset === 6 ? 10 : 2} r="3.5" fill="#d4a373" />
            ))}
          </g>
        )}

        {/* Face */}
        {awake ? (
          <>
            <circle cx="85" cy="85" r={isKitten ? 5 : 4} fill="#333" />
            <circle cx="115" cy="85" r={isKitten ? 5 : 4} fill="#333" />
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
            {equipped?.includes('sunglasses_rose') && (
              <g stroke="#7f1d1d" strokeWidth="3" fill="none">
                <rect x="71" y="74" width="24" height="16" rx="6" fill="#fda4af" fillOpacity="0.4" />
                <rect x="105" y="74" width="24" height="16" rx="6" fill="#fda4af" fillOpacity="0.4" />
                <path d="M95 82 L105 82" />
                <path d="M71 82 L59 78" />
                <path d="M129 82 L141 78" />
              </g>
            )}
            {equipped?.includes('bow_lilac') && (
              <g transform="translate(56, 56)">
                <path d="M0 8 Q8 0 16 8 Q8 10 0 8" fill="#cdb4db" />
                <path d="M16 8 Q24 0 32 8 Q24 10 16 8" fill="#cdb4db" />
                <circle cx="16" cy="8" r="4" fill="#b185db" />
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
        <path d="M140 140 Q170 140 160 110" stroke={tailColor} strokeWidth={isKitten ? 10 : 15} strokeLinecap="round" fill="none" />
        {equipped?.includes('scarf_sky') && (
          <g>
            <path d="M68 115 Q100 102 132 115" stroke="#60a5fa" strokeWidth="10" strokeLinecap="round" fill="none" />
            <path d="M124 115 Q132 132 122 150" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" fill="none" />
          </g>
        )}
      </g>
    </svg>
  );
};

export default CatSVG;
