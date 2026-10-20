import React from 'react';

interface DemoBadgeProps {
  className?: string;
  variant?: 'inline' | 'banner';
}

export const DemoBadge: React.FC<DemoBadgeProps> = ({ 
  className = '', 
  variant = 'inline' 
}) => {
  if (variant === 'banner') {
    return (
      <div className={`w-full bg-[#DDEBDD]/50 border-b border-[#DDEBDD] px-4 py-1.5 text-center text-xs font-medium text-[#123D2A] flex items-center justify-center gap-2 ${className}`}>
        <span className="font-semibold uppercase tracking-wider text-[11px] text-[#218653]">Demo Environment</span>
        <span aria-hidden="true" className="text-[#69746D]">·</span>
        <span>Simulated illustrative data for market verification testing.</span>
      </div>
    );
  }

  return (
    <span 
      className={`text-[11px] font-mono tracking-tight text-[#69746D] inline-flex items-center gap-1.5 ${className}`}
      title="This record is demonstration data for platform evaluation"
    >
      <span className="text-[#D99A32] font-semibold">DEMO DATA</span>
      <span aria-hidden="true">·</span>
      <span>For demonstration purposes only</span>
    </span>
  );
};
