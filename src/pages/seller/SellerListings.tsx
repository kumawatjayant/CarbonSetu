import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DemoBadge } from '../../components/common/DemoBadge';
import { CreditListing, ListingStatus } from '../../types';
import { Plus, ArrowUpRight, Search, ShieldCheck, Filter } from 'lucide-react';

interface SellerListingsProps {
  navigate: (route: string) => void;
  onSelectListing: (listingId: string) => void;
}

export const SellerListings: React.FC<SellerListingsProps> = ({ 
  navigate,
  onSelectListing 
}) => {
  const { currentUser, listings } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  const sellerListings = listings.filter(l => 
    currentUser && (l.sellerId === currentUser.id || l.sellerDisplayName === currentUser.companyName)
  );

  const filtered = sellerListings.filter(l => {
    if (filterStatus !== 'all' && l.listingStatus !== filterStatus) return false;
    if (search.trim() && !l.projectName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <DemoBadge variant="inline" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2A] tracking-tight mt-1">
            My Environmental Project Listings
          </h1>
          <p className="text-xs text-[#69746D] mt-0.5">
            Manage your registered carbon projects, track review stages, and update available tranches.
          </p>
        </div>

        <button
          onClick={() => navigate('/seller/listings/new')}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#123D2A] hover:bg-[#1B4D36] rounded-xl transition-all shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Submit New Listing</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#DDEBDD] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Filter by project title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 text-xs border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653] sm:w-72"
        />

        <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1">
          {['all', 'approved', 'under_review', 'draft', 'rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap capitalize transition-colors ${
                filterStatus === st
                  ? 'bg-[#123D2A] text-white shadow-xs'
                  : 'text-[#69746D] hover:bg-[#F7F8F4]'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Table / Cards */}
      <div className="bg-white rounded-2xl border border-[#DDEBDD] overflow-hidden shadow-xs">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#69746D] space-y-3">
            <p>No project listings match the chosen filter.</p>
            <button
              onClick={() => navigate('/seller/listings/new')}
              className="text-[#218653] font-semibold hover:underline"
            >
              Submit your first project listing &rarr;
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#DDEBDD]">
            {filtered.map(l => (
              <div
                key={l.id}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs hover:bg-[#F7F8F4]/80 transition-colors"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      l.listingStatus === 'approved' 
                        ? 'bg-[#DDEBDD] text-[#218653]' 
                        : l.listingStatus === 'under_review'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-50 text-[#C94C4C]'
                    }`}>
                      {l.listingStatus.replace('_', ' ')}
                    </span>
                    <span className="font-mono text-[#69746D]">{l.registryOrStandard}</span>
                    <span aria-hidden="true" className="text-[#69746D]">·</span>
                    <span className="text-[#69746D]">{l.country}</span>
                  </div>

                  <h3 
                    onClick={() => onSelectListing(l.id)}
                    className="text-base font-bold text-[#123D2A] truncate cursor-pointer hover:text-[#218653]"
                  >
                    {l.projectName}
                  </h3>

                  <div className="flex items-center gap-3 text-[#69746D] text-[11px]">
                    <span>Vintages {l.vintageStart}–{l.vintageEnd}</span>
                    <span>·</span>
                    <span>ID: {l.projectIdentifier || 'Pending'}</span>
                    <span>·</span>
                    <span>Documents: {l.supportingDocuments.length} Verified</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0 text-right">
                  <div>
                    <span className="text-[10px] uppercase text-[#69746D] block">Available</span>
                    <span className="text-sm font-bold text-[#123D2A] font-mono tabular-nums">
                      {l.quantityAvailable.toLocaleString()} {l.quantityUnit}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-[#69746D] block">Price</span>
                    <span className="text-sm font-bold text-[#218653] font-mono tabular-nums">
                      {l.indicativeUnitPrice ? `$${l.indicativeUnitPrice}/t` : 'Quote only'}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectListing(l.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-[#123D2A] bg-white border border-[#DDEBDD] rounded-lg hover:bg-[#DDEBDD]/50 transition-colors flex items-center gap-1"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
