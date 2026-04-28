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
        {equipped?.includes('kahf_lantern') && (
          <g transform="translate(150, 95)">
            <rect x="0" y="10" width="18" height="28" fill="#0f766e" rx="4" />
            <path d="M2 10 Q9 -2 16 10" fill="#fbbf24" />
            <circle cx="9" cy="24" r="5" fill="#fde68a" className="animate-pulse" />
            <path d="M9 -2 L9 -13 Q19 -13 19 -4" stroke="#fbbf24" strokeWidth="2" fill="none" />
          </g>
        )}
        {equipped?.includes('hijri_scroll') && (
          <g transform="translate(32, 128)">
            <rect x="0" y="0" width="32" height="18" rx="4" fill="#f5deb3" stroke="#d4a373" strokeWidth="2" />
            <path d="M7 6 H25 M7 12 H20" stroke="#8b5e34" strokeWidth="2" strokeLinecap="round" />
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

        {/* Consumable Sustenance Decorations */}
        {equipped?.includes('zamzam_water') && (
          <g transform="translate(130, 130)">
            {/* Clay Cup */}
            <path d="M0 0 Q5 15 15 15 Q25 15 30 0 Z" fill="#d4a373" />
            {/* Water inside */}
            <ellipse cx="15" cy="0" rx="15" ry="4" fill="#48cae4" />
            <path d="M2 0 Q15 6 28 0" stroke="#0077b6" strokeWidth="1" fill="none" opacity="0.5" />
            <circle cx="15" cy="-8" r="2" fill="#ade8f4" className="animate-ping" style={{ animationDuration: '3s' }} />
          </g>
        )}
        
        {equipped?.includes('fish_bosphorus') && (
          <g transform="translate(100, 138)">
            {/* Anchovy Fish Body */}
            <path d="M5 2 Q10 -2 15 2 Q22 6 25 2 L28 0 L26 5 L28 9 L24 4 Q15 10 5 2 Q0 -2 5 2 Z" fill="#94a3b8" />
            {/* Fish Eye */}
            <circle cx="8" cy="2" r="1.5" fill="#1e293b" />
          </g>
        )}

        {equipped?.includes('meat_halal') && (
          <g transform="translate(68, 135)">
            {/* Bone */}
            <path d="M5 10 L15 2" stroke="#fff1e6" strokeWidth="4" strokeLinecap="round" />
            <circle cx="15" cy="0" r="3" fill="#fff1e6" />
            <circle cx="18" cy="3" r="3" fill="#fff1e6" />
            {/* Meat */}
            <path d="M0 5 Q-5 15 5 18 Q15 15 10 5 Z" fill="#e07a5f" />
          </g>
        )}

        {equipped?.includes('milk_camel') && (
          <g transform="translate(35, 132)">
            {/* Brass Bowl */}
            <path d="M0 0 Q5 12 15 12 Q25 12 30 0 Z" fill="#e9c46a" />
            {/* Milk inside */}
            <ellipse cx="15" cy="0" rx="15" ry="3.5" fill="#fdfcdc" />
            {/* Bubble */}
            <circle cx="10" cy="1" r="1.5" fill="#ffffff" />
            <circle cx="20" cy="0" r="1" fill="#ffffff" />
          </g>
        )}

        {equipped?.includes('catnip_madinah') && (
          <g transform="translate(115, 142)">
            {/* Catnip Herbs */}
            <path d="M10 5 Q5 0 0 5 Q5 10 10 5 Z" fill="#2a9d8f" transform="rotate(-30 5 5)" />
            <path d="M10 5 Q5 0 0 5 Q5 10 10 5 Z" fill="#40916c" transform="rotate(30 5 5)" />
            <path d="M10 5 Q5 0 0 5 Q5 10 10 5 Z" fill="#52b788" transform="rotate(-10 5 5)" />
          </g>
        )}

        {equipped?.includes('olives_green') && (
          <g transform="translate(80, 145)">
            {/* Little wooden cup */}
            <path d="M0 0 Q5 8 10 8 Q15 8 20 0 Z" fill="#8b5a2b" />
            {/* Olives */}
            <ellipse cx="6" cy="0" rx="3" ry="4" fill="#a5be00" transform="rotate(-20 6 0)" />
            <circle cx="6" cy="0" r="1" fill="#e63946" /> {/* Pimento */}
            <ellipse cx="14" cy="1" rx="3" ry="4" fill="#a5be00" transform="rotate(20 14 1)" />
            <circle cx="14" cy="1" r="1" fill="#e63946" />
            <ellipse cx="10" cy="-2" rx="3" ry="4" fill="#a5be00" />
            <circle cx="10" cy="-2" r="1" fill="#e63946" />
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
            {equipped?.includes('crescent_collar') && (
              <g transform="translate(77, 112)">
                <path d="M0 0 Q23 16 46 0" stroke="#10b981" strokeWidth="7" strokeLinecap="round" fill="none" />
                <path d="M23 12 A7 7 0 1 1 30 2 A5 5 0 1 0 23 12" fill="#fbbf24" />
              </g>
            )}
            {equipped?.includes('ihram_wrap') && (
              <g transform="translate(68, 105)">
                <path d="M0 12 Q32 26 64 12 L58 44 Q32 56 6 44 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
                <path d="M12 20 Q32 30 52 20" stroke="#cbd5e1" strokeWidth="2" fill="none" />
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
