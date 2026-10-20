import React, { useState } from 'react';
import { CreditListing } from '../../types';
import { useApp } from '../../context/AppContext';
import { ProjectArtwork } from '../common/ProjectArtwork';
import { DemoBadge } from '../common/DemoBadge';
import { QuoteModal } from './QuoteModal';
import { Bookmark, Shield, MapPin, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface ListingCardProps {
  listing: CreditListing;
  onViewDetails: (listingId: string) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onViewDetails }) => {
  const { savedListingIds, toggleSaveListing } = useApp();
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const isSaved = savedListingIds.includes(listing.id);

  return (
    <>
      <div className="bg-white rounded-xl border border-[#DDEBDD] overflow-hidden hover:border-[#218653]/40 transition-all flex flex-col justify-between group">
        
        {/* Top media artwork container */}
        <div className="relative">
          <ProjectArtwork category={listing.projectCategory} height="h-44" />
          
          {/* Top action: Save / Bookmark */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveListing(listing.id);
            }}
            className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-sm transition-colors ${
              isSaved 
                ? 'bg-[#123D2A] text-white' 
                : 'bg-white/80 text-[#202923] hover:bg-white'
            }`}
            aria-label={isSaved ? 'Remove from saved' : 'Save listing'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
          </button>

          {/* Standard & Registry tag (unboxed subtle bar) */}
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-white/90">
            <span className="bg-[#123D2A]/80 px-2 py-0.5 rounded backdrop-blur-xs">
              {listing.registryOrStandard}
            </span>
            <span className="bg-[#123D2A]/80 px-2 py-0.5 rounded backdrop-blur-xs">
              Vintages {listing.vintageStart}–{listing.vintageEnd}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Location & Category unboxed metadata line */}
            <div className="flex items-center gap-2 text-xs text-[#69746D] mb-1.5 flex-wrap">
              <span className="flex items-center gap-1 font-medium text-[#202923]">
                <MapPin className="w-3.5 h-3.5 text-[#218653]" />
                {listing.country}
              </span>
              <span aria-hidden="true">·</span>
              <span>{listing.region}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#123D2A] font-medium">{listing.projectCategory}</span>
            </div>

            {/* Title */}
            <h3 
              onClick={() => onViewDetails(listing.id)}
              className="text-base font-bold text-[#123D2A] leading-snug cursor-pointer hover:text-[#218653] transition-colors"
            >
              {listing.projectName}
            </h3>

            {/* Brief description */}
            <p className="text-xs text-[#69746D] line-clamp-2 mt-2 leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Verification evidence status & Developer info */}
          <div className="mt-4 pt-3 border-t border-[#DDEBDD]/80 space-y-2.5">
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[#123D2A]">
                <Shield className="w-3.5 h-3.5 text-[#218653]" />
                <span className="font-semibold">{listing.verificationStatus}</span>
              </div>
              <span className="text-[#69746D] text-[11px] truncate max-w-[130px]">
                {listing.sellerDisplayName}
              </span>
            </div>

            {/* Price & Quantity Grid */}
            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#69746D] block">
                  Available Volume
                </span>
                <span className="text-base font-bold text-[#123D2A] tabular-nums">
                  {listing.quantityAvailable.toLocaleString()}
                </span>
                <span className="text-xs text-[#69746D] ml-1 font-mono">
                  {listing.quantityUnit}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-[#69746D] block">
                  Indicative Unit Price
                </span>
                {listing.indicativeUnitPrice ? (
                  <span className="text-base font-bold text-[#218653] tabular-nums">
                    ${listing.indicativeUnitPrice.toFixed(2)}
                    <span className="text-xs font-normal text-[#69746D] ml-1">/ t</span>
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-[#69746D]">
                    Quote on Request
                  </span>
                )}
              </div>
            </div>

            {/* Demo indicator if applicable */}
            {listing.demoRecord && (
              <div className="pt-1">
                <DemoBadge />
              </div>
            )}
          </div>
        </div>

        {/* Card Action footer */}
        <div className="p-4 pt-0 bg-white grid grid-cols-2 gap-2 border-t border-[#DDEBDD]/50 mt-2">
          <button
            type="button"
            onClick={() => onViewDetails(listing.id)}
            className="w-full py-2 px-3 text-xs font-semibold text-[#123D2A] bg-[#F7F8F4] hover:bg-[#DDEBDD]/50 rounded-lg border border-[#DDEBDD] transition-colors flex items-center justify-center gap-1"
          >
            <span>Project Details</span>
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

      {/* Quote Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        listing={listing}
      />
    </>
  );
};
