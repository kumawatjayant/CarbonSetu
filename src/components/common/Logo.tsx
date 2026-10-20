import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  showTagline = false,
  light = false 
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Connected Arch Bridge + Bio-Node Emblem */}
      <svg 
        className={`${iconSizes[size]} shrink-0`} 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="32" height="32" rx="8" fill={light ? '#FFFFFF' : '#123D2A'} />
        {/* Bridge span arc */}
        <path 
          d="M6 22C10 14 22 14 26 22" 
          stroke={light ? '#123D2A' : '#DDEBDD'} 
          strokeWidth="2.5" 
          strokeLinecap="round" 
        />
        {/* Keystone node */}
        <circle 
          cx="16" 
          cy="14" 
          r="3" 
          fill={light ? '#218653' : '#218653'} 
        />
        {/* Leaf arc vein */}
        <path 
          d="M16 11C18 7 21 8 22 10C22 12 19 13 16 14" 
          fill={light ? '#218653' : '#DDEBDD'} 
        />
        {/* Bridge pillars */}
        <path 
          d="M10 20V23M22 20V23" 
          stroke={light ? '#123D2A' : '#DDEBDD'} 
          strokeWidth="2" 
          strokeLinecap="round" 
        />
      </svg>

      <div className="flex flex-col">
        <span className={`${textSizes[size]} font-bold tracking-tight ${light ? 'text-white' : 'text-[#123D2A]'} whitespace-nowrap`}>
          Carbon<span className={light ? 'text-[#DDEBDD]' : 'text-[#218653]'}>Bridge</span>
        </span>
        {showTagline && (
          <span className={`text-[10px] uppercase tracking-wider font-medium ${light ? 'text-[#DDEBDD]/80' : 'text-[#69746D]'}`}>
            Connecting Carbon. Creating Impact.
          </span>
        )}
      </div>
    </div>
  );
};
