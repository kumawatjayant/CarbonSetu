import React from 'react';
import { useApp } from '../../context/AppContext';
import { ListingCard } from '../../components/marketplace/ListingCard';
import { BundleCard } from '../../components/bundles/BundleCard';
import { DemoBadge } from '../../components/common/DemoBadge';
import { Bookmark, ArrowRight } from 'lucide-react';

interface BuyerSavedProps {
  navigate: (route: string) => void;
  onSelectListing: (listingId: string) => void;
  onSelectBundle: (bundleId: string) => void;
}

export const BuyerSaved: React.FC<BuyerSavedProps> = ({ 
  navigate,
  onSelectListing,
  onSelectBundle 
}) => {
  const { listings, bundles, savedListingIds, savedBundleIds } = useApp();

  const savedListings = listings.filter(l => savedListingIds.includes(l.id));
  const savedBundles = bundles.filter(b => savedBundleIds.includes(b.id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div>
        <DemoBadge variant="inline" />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2A] tracking-tight mt-1">
          Saved Opportunities & Watchlist
        </h1>
        <p className="text-xs text-[#69746D] mt-0.5">
          Projects and carbon bundles bookmarked for ongoing due diligence.
        </p>
      </div>

      {/* Saved Listings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#DDEBDD] pb-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#123D2A]">
            Bookmarked Project Listings ({savedListings.length})
          </h2>
          <button
            onClick={() => navigate('/marketplace')}
            className="text-xs font-semibold text-[#218653] hover:underline"
          >
            Find more in marketplace &rarr;
          </button>
        </div>

        {savedListings.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-[#DDEBDD] text-center text-xs text-[#69746D]">
            No project listings bookmarked. Browse the marketplace and tap the bookmark icon on any card.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedListings.map(l => (
              <ListingCard key={l.id} listing={l} onViewDetails={onSelectListing} />
            ))}
          </div>
        )}
      </div>

      {/* Saved Bundles */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-[#DDEBDD] pb-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#123D2A]">
            Bookmarked Portfolio Bundles ({savedBundles.length})
          </h2>
          <button
            onClick={() => navigate('/bundles')}
            className="text-xs font-semibold text-[#218653] hover:underline"
          >
            Find more bundles &rarr;
          </button>
        </div>

        {savedBundles.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-[#DDEBDD] text-center text-xs text-[#69746D]">
            No bundles bookmarked. Explore pre-made portfolios or create your own custom blend.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedBundles.map(b => (
              <BundleCard key={b.id} bundle={b} onViewDetails={onSelectBundle} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
