import React, { useState } from 'react';
import { CarbonBundle } from '../../types';
import { useApp } from '../../context/AppContext';
import { DemoBadge } from '../common/DemoBadge';
import { QuoteModal } from '../marketplace/QuoteModal';
import { Layers, Bookmark, ArrowUpRight, PieChart, ShieldCheck } from 'lucide-react';

interface BundleCardProps {
  bundle: CarbonBundle;
  onViewDetails: (bundleId: string) => void;
}

export const BundleCard: React.FC<BundleCardProps> = ({ bundle, onViewDetails }) => {
  const { savedBundleIds, toggleSaveBundle } = useApp();
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const isSaved = savedBundleIds.includes(bundle.id);

  return (
    <>
      <div className="bg-white rounded-xl border border-[#DDEBDD] overflow-hidden hover:border-[#218653]/40 transition-all flex flex-col justify-between">
        
        {/* Header bar */}
        <div className="p-5 pb-4 border-b border-[#DDEBDD]/70 bg-[#F7F8F4]/60">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#69746D] mb-1">
                <span className="text-[#218653] font-semibold">{bundle.bundleCategory}</span>
                <span aria-hidden="true">·</span>
                <span>{bundle.components.length} Component Projects</span>
              </div>
              <h3 
                onClick={() => onViewDetails(bundle.id)}
                className="text-base font-bold text-[#123D2A] leading-snug cursor-pointer hover:text-[#218653] transition-colors"
              >
                {bundle.bundleName}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => toggleSaveBundle(bundle.id)}
              className={`p-2 rounded-lg border border-[#DDEBDD] transition-colors ${
                isSaved 
                  ? 'bg-[#123D2A] text-white border-[#123D2A]' 
                  : 'bg-white text-[#69746D] hover:text-[#123D2A]'
              }`}
              aria-label={isSaved ? 'Remove from saved' : 'Save bundle'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
            </button>
          </div>

          <p className="text-xs text-[#69746D] mt-2 line-clamp-2 leading-relaxed">
            {bundle.description}
          </p>
        </div>

        {/* Component breakdown list preserving provenance */}
        <div className="p-5 flex-1 space-y-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#69746D] flex items-center justify-between">
            <span>Portfolio Provenance</span>
            <span>Allocated Volume</span>
          </div>

          <div className="space-y-2">
            {bundle.components.map((comp, idx) => {
              const percentage = Math.round((comp.allocatedQuantity / bundle.totalQuantity) * 100);
              return (
                <div key={idx} className="bg-[#F7F8F4] p-2.5 rounded-lg border border-[#DDEBDD]/60 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-semibold text-[#123D2A] truncate">
                      {comp.projectName}
                    </div>
                    <div className="text-right shrink-0 font-mono font-medium text-[#202923] tabular-nums">
                      {comp.allocatedQuantity.toLocaleString()} {comp.quantityUnit}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-[11px] text-[#69746D] mt-1">
                    <div className="flex items-center gap-1.5">
                      <span>{comp.country}</span>
                      <span aria-hidden="true">·</span>
                      <span>{comp.standard}</span>
                      <span aria-hidden="true">·</span>
                      <span>{comp.vintage}</span>
                    </div>
                    <span className="font-medium text-[#218653]">{percentage}% of bundle</span>
                  </div>

                  {/* Allocation horizontal bar */}
                  <div className="w-full bg-[#DDEBDD] h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className="bg-[#218653] h-full rounded-full" 
                      style={{ width: `${percentage}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pricing & Volume Totals */}
          <div className="mt-4 pt-3 border-t border-[#DDEBDD]/80 flex items-baseline justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#69746D] block">
                Total Portfolio Volume
              </span>
              <span className="text-base font-bold text-[#123D2A] tabular-nums">
                {bundle.totalQuantity.toLocaleString()}
              </span>
              <span className="text-xs text-[#69746D] ml-1 font-mono">
                {bundle.quantityUnit}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-[#69746D] block">
                Weighted Avg Indicative Price
              </span>
              {bundle.weightedAveragePrice ? (
                <span className="text-base font-bold text-[#218653] tabular-nums">
                  ${bundle.weightedAveragePrice.toFixed(2)}
                  <span className="text-xs font-normal text-[#69746D] ml-1">/ tCO2e</span>
                </span>
              ) : (
                <span className="text-xs font-semibold text-[#69746D]">Pricing on Request</span>
              )}
            </div>
          </div>

          {bundle.demoRecord && (
            <div className="pt-1">
              <DemoBadge />
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 pt-0 grid grid-cols-2 gap-2 border-t border-[#DDEBDD]/50 bg-white">
          <button
            type="button"
            onClick={() => onViewDetails(bundle.id)}
            className="w-full py-2 px-3 text-xs font-semibold text-[#123D2A] bg-[#F7F8F4] hover:bg-[#DDEBDD]/50 rounded-lg border border-[#DDEBDD] transition-colors flex items-center justify-center gap-1"
          >
            <span>View Portfolio</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setQuoteModalOpen(true)}
            className="w-full py-2 px-3 text-xs font-semibold text-white bg-[#123D2A] hover:bg-[#1B4D36] rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            <span>Request Quote</span>
          </button>
        </div>

      </div>

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        bundle={bundle}
      />
    </>
  );
};
