import React from 'react';
import { ProjectCategory } from '../../types';

interface ProjectArtworkProps {
  category: ProjectCategory;
  className?: string;
  height?: string;
}

export const ProjectArtwork: React.FC<ProjectArtworkProps> = ({ 
  category, 
  className = '', 
  height = 'h-48' 
}) => {
  switch (category) {
    case 'Forestry & Afforestation':
      return (
        <div className={`w-full ${height} bg-[#123D2A] relative overflow-hidden flex items-center justify-center ${className}`}>
          <svg className="w-full h-full object-cover" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" fill="none">
            {/* Sky gradient background */}
            <rect width="400" height="220" fill="url(#forestSky)" />
            {/* Mountain silhouette background */}
            <path d="M0 160L80 110L170 145L260 90L340 135L400 110V220H0V160Z" fill="#1B4D36" fillOpacity="0.7" />
            <path d="M0 180L110 130L210 165L310 120L400 150V220H0V180Z" fill="#143D2A" />
            {/* Forest canopy trees */}
            <circle cx="50" cy="190" r="30" fill="#218653" />
            <circle cx="90" cy="180" r="38" fill="#1B6F45" />
            <circle cx="140" cy="195" r="32" fill="#299E64" />
            <circle cx="190" cy="175" r="42" fill="#218653" />
            <circle cx="250" cy="190" r="36" fill="#1B6F45" />
            <circle cx="310" cy="180" r="40" fill="#299E64" />
            <circle cx="370" cy="192" r="34" fill="#218653" />
            {/* Foreground tree trunks & detail */}
            <path d="M190 190V220" stroke="#0E2B1E" strokeWidth="6" strokeLinecap="round" />
            <path d="M90 195V220" stroke="#0E2B1E" strokeWidth="5" strokeLinecap="round" />
            <path d="M310 195V220" stroke="#0E2B1E" strokeWidth="6" strokeLinecap="round" />
            {/* Atmospheric mist layer */}
            <ellipse cx="200" cy="160" rx="220" ry="25" fill="#DDEBDD" fillOpacity="0.15" />
            <defs>
              <linearGradient id="forestSky" x1="200" y1="0" x2="200" y2="220" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2A5C43" />
                <stop offset="1" stopColor="#123D2A" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute top-3 left-3 bg-[#123D2A]/85 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium text-[#DDEBDD] border border-[#218653]/30">
            Native Afforestation & Conservation
          </div>
        </div>
      );

    case 'Renewable Energy':
      return (
        <div className={`w-full ${height} bg-[#1A3344] relative overflow-hidden flex items-center justify-center ${className}`}>
          <svg className="w-full h-full object-cover" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" fill="none">
            {/* Bright sky */}
            <rect width="400" height="220" fill="url(#solarSky)" />
            {/* Distant mountains */}
            <path d="M0 130L90 100L180 120L290 85L400 115V220H0V130Z" fill="#1E4459" fillOpacity="0.5" />
            {/* Horizon terrain */}
            <rect y="125" width="400" height="95" fill="#162D3B" />
            {/* Solar PV arrays perspective */}
            <g stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.6">
              {/* Row 1 */}
              <polygon points="40,140 160,140 140,165 20,165" fill="#0C4A6E" />
              <polygon points="180,140 300,140 280,165 160,165" fill="#0C4A6E" />
              <polygon points="320,140 420,140 400,165 300,165" fill="#0C4A6E" />
              {/* Grid cell lines */}
              <line x1="80" y1="140" x2="60" y2="165" />
              <line x1="120" y1="140" x2="100" y2="165" />
              <line x1="220" y1="140" x2="200" y2="165" />
              <line x1="260" y1="140" x2="240" y2="165" />
              {/* Row 2 (foreground) */}
              <polygon points="10,175 160,175 130,215 -20,215" fill="#075985" />
              <polygon points="180,175 330,175 300,215 150,215" fill="#075985" />
              <polygon points="350,175 440,175 420,215 320,215" fill="#075985" />
              <line x1="60" y1="175" x2="30" y2="215" />
              <line x1="110" y1="175" x2="80" y2="215" />
              <line x1="230" y1="175" x2="200" y2="215" />
              <line x1="280" y1="175" x2="250" y2="215" />
            </g>
            {/* Solar glare flare */}
            <circle cx="340" cy="50" r="28" fill="#FDE047" fillOpacity="0.8" />
            <circle cx="340" cy="50" r="45" fill="#FEF08A" fillOpacity="0.25" />
            <defs>
              <linearGradient id="solarSky" x1="200" y1="0" x2="200" y2="220" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0284C7" />
                <stop offset="0.6" stopColor="#38BDF8" />
                <stop offset="1" stopColor="#BAE6FD" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute top-3 left-3 bg-[#0C4A6E]/85 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium text-[#E0F2FE] border border-[#38BDF8]/30">
            Utility-Scale Solar PV & Grid Decarbonization
          </div>
        </div>
      );

    case 'Blue Carbon & Mangroves':
      return (
        <div className={`w-full ${height} bg-[#0D3833] relative overflow-hidden flex items-center justify-center ${className}`}>
          <svg className="w-full h-full object-cover" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" fill="none">
            {/* Coastal sky */}
            <rect width="400" height="220" fill="url(#mangroveSky)" />
            {/* Estuarine water body */}
            <path d="M0 120C120 115 280 125 400 120V220H0V120Z" fill="#0D4F46" />
            {/* Tidal mudflat and sandbar */}
            <path d="M0 145C110 135 220 160 400 140V220H0V145Z" fill="#134E4A" fillOpacity="0.7" />
            {/* Mangrove islands */}
            <ellipse cx="90" cy="120" rx="70" ry="25" fill="#115E59" />
            <ellipse cx="260" cy="115" rx="80" ry="28" fill="#0F766E" />
            {/* Mangrove root stilt clusters */}
            <g stroke="#042F2E" strokeWidth="2.5" strokeLinecap="round">
              <path d="M70 125L50 160M75 125L70 160M85 125L95 160M90 125L110 160" />
              <path d="M240 120L220 155M250 120L245 155M265 120L275 155M270 120L290 155" />
            </g>
            {/* Canopy foliage */}
            <circle cx="80" cy="100" r="32" fill="#2DD4BF" fillOpacity="0.85" />
            <circle cx="260" cy="95" r="36" fill="#14B8A6" />
            <circle cx="300" cy="105" r="28" fill="#0D9488" />
            {/* Water reflections */}
            <line x1="30" y1="180" x2="130" y2="180" stroke="#5EEAD4" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
            <line x1="200" y1="175" x2="320" y2="175" stroke="#5EEAD4" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
            <line x1="120" y1="195" x2="240" y2="195" stroke="#5EEAD4" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
            <defs>
              <linearGradient id="mangroveSky" x1="200" y1="0" x2="200" y2="220" gradientUnits="userSpaceOnUse">
                <stop stopColor="#134E4A" />
                <stop offset="0.6" stopColor="#0D9488" />
                <stop offset="1" stopColor="#CCFBF1" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute top-3 left-3 bg-[#042F2E]/85 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium text-[#CCFBF1] border border-[#2DD4BF]/30">
            Coastal Mangrove & Tidal Wetland Blue Carbon
          </div>
        </div>
      );

    case 'Biochar & Soil Carbon':
      return (
        <div className={`w-full ${height} bg-[#26201B] relative overflow-hidden flex items-center justify-center ${className}`}>
          <svg className="w-full h-full object-cover" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" fill="none">
            {/* Dark industrial atmospheric sky */}
            <rect width="400" height="220" fill="url(#biocharSky)" />
            {/* Soil stratum layers */}
            <rect y="130" width="400" height="90" fill="#1F1B18" />
            <path d="M0 155C100 150 250 160 400 152V220H0V155Z" fill="#14110F" />
            {/* Biochar particles in soil */}
            <g fill="#000000">
              <circle cx="45" cy="175" r="4" />
              <circle cx="85" cy="190" r="5" />
              <circle cx="130" cy="165" r="6" />
              <circle cx="170" cy="185" r="4" />
              <circle cx="215" cy="170" r="5" />
              <circle cx="270" cy="195" r="6" />
              <circle cx="330" cy="170" r="5" />
              <circle cx="370" cy="185" r="4" />
            </g>
            {/* Pyrolysis furnace silhouette */}
            <rect x="150" y="70" width="100" height="60" rx="6" fill="#3D322B" stroke="#D99A32" strokeWidth="2" />
            <path d="M185 70V45H215V70" fill="#3D322B" stroke="#D99A32" strokeWidth="2" />
            {/* Chamber heat glow */}
            <circle cx="200" cy="100" r="16" fill="#EA580C" fillOpacity="0.85" />
            <circle cx="200" cy="100" r="8" fill="#FDE047" />
            {/* Sustainable plant sprouting from rich soil */}
            <path d="M70 155C70 140 85 135 95 130C90 140 80 145 70 155Z" fill="#22C55E" />
            <path d="M340 155C340 140 325 135 315 130C320 140 330 145 340 155Z" fill="#22C55E" />
            <defs>
              <linearGradient id="biocharSky" x1="200" y1="0" x2="200" y2="220" gradientUnits="userSpaceOnUse">
                <stop stopColor="#44352D" />
                <stop offset="0.7" stopColor="#2A211B" />
                <stop offset="1" stopColor="#1B1511" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute top-3 left-3 bg-[#1B1511]/85 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium text-[#FED7AA] border border-[#D99A32]/30">
            High-Permanence Pyrolysis Biochar CDR
          </div>
        </div>
      );

    default:
      return (
        <div className={`w-full ${height} bg-[#123D2A] relative overflow-hidden flex items-center justify-center ${className}`}>
          <svg className="w-full h-full object-cover" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" fill="none">
            <rect width="400" height="220" fill="#123D2A" />
            <circle cx="200" cy="110" r="60" stroke="#218653" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="200" cy="110" r="35" fill="#1B4D36" />
            <path d="M185 110C185 95 215 95 215 110C215 125 185 125 185 110Z" fill="#218653" />
          </svg>
          <div className="absolute top-3 left-3 bg-[#123D2A]/85 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium text-[#DDEBDD] border border-[#218653]/30">
            {category}
          </div>
        </div>
      );
  }
};
