import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ListingCard } from '../../components/marketplace/ListingCard';
import { DemoBadge } from '../../components/common/DemoBadge';
import { ProjectCategory, CarbonStandard } from '../../types';
import { 
  Search, 
  Filter, 
  X, 
  SlidersHorizontal, 
  RotateCcw, 
  LayoutGrid, 
  List, 
  Check, 
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface MarketplacePageProps {
  navigate: (route: string) => void;
  onSelectListing: (listingId: string) => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({ 
  navigate, 
  onSelectListing 
}) => {
  const { listings } = useApp();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStandard, setSelectedStandard] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [minQuantity, setMinQuantity] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'qty_desc' | 'alpha'>('newest');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Extract unique countries
  const countries = useMemo(() => {
    const list = Array.from(new Set(listings.map(l => l.country))).sort();
    return list;
  }, [listings]);

  const categories: ProjectCategory[] = [
    'Forestry & Afforestation',
    'Renewable Energy',
    'Blue Carbon & Mangroves',
    'Biochar & Soil Carbon',
    'Direct Air Capture & Mineralization',
    'Cookstoves & Community Energy'
  ];

  const standards: CarbonStandard[] = [
    'Verra VCS',
    'Gold Standard',
    'Puro.earth',
    'American Carbon Registry (ACR)',
    'Climate Action Reserve (CAR)'
  ];

  // Filtering and sorting logic
  const filteredListings = useMemo(() => {
    return listings
      .filter((listing) => {
        // Only display approved active listings in the public marketplace
        if (listing.listingStatus !== 'approved') return false;

        // Search query match
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = listing.projectName.toLowerCase().includes(q);
          const matchDev = listing.projectDeveloper.toLowerCase().includes(q);
          const matchLoc = listing.country.toLowerCase().includes(q) || listing.region.toLowerCase().includes(q);
          const matchId = listing.projectIdentifier?.toLowerCase().includes(q);
          if (!matchName && !matchDev && !matchLoc && !matchId) return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && listing.projectCategory !== selectedCategory) {
          return false;
        }

        // Standard filter
        if (selectedStandard !== 'all' && listing.registryOrStandard !== selectedStandard) {
          return false;
        }

        // Country filter
        if (selectedCountry !== 'all' && listing.country !== selectedCountry) {
          return false;
        }

        // Min quantity
        if (minQuantity > 0 && listing.quantityAvailable < minQuantity) {
          return false;
        }

        // Max price filter (if listing is priced)
        if (listing.indicativeUnitPrice !== undefined && listing.indicativeUnitPrice > maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price_asc':
            return (a.indicativeUnitPrice || 9999) - (b.indicativeUnitPrice || 9999);
          case 'price_desc':
            return (b.indicativeUnitPrice || 0) - (a.indicativeUnitPrice || 0);
          case 'qty_desc':
            return b.quantityAvailable - a.quantityAvailable;
          case 'alpha':
            return a.projectName.localeCompare(b.projectName);
          case 'newest':
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
  }, [listings, searchQuery, selectedCategory, selectedStandard, selectedCountry, minQuantity, maxPrice, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedStandard('all');
    setSelectedCountry('all');
    setMaxPrice(200);
    setMinQuantity(0);
    setSortBy('newest');
  };

  const hasActiveFilters = 
    searchQuery !== '' || 
    selectedCategory !== 'all' || 
    selectedStandard !== 'all' || 
    selectedCountry !== 'all' || 
    minQuantity > 0 || 
    maxPrice < 200;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner and Heading */}
      <div className="space-y-2">
        <DemoBadge variant="inline" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2A] tracking-tight">
              Carbon Credit Marketplace
            </h1>
            <p className="text-xs text-[#69746D] mt-1">
              Browse approved project listings across audited registries. Request quotes or assemble custom bundles.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/bundles')}
              className="px-3.5 py-2 text-xs font-semibold text-[#123D2A] bg-white border border-[#DDEBDD] rounded-lg hover:bg-[#DDEBDD]/50 transition-colors"
            >
              View Pre-Made Bundles
            </button>
            <button
              onClick={() => navigate('/seller/listings/new')}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#123D2A] hover:bg-[#1B4D36] rounded-lg transition-colors"
            >
              + List Your Credits
            </button>
          </div>
        </div>
      </div>

      {/* Search and Quick Category Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#DDEBDD] space-y-4 shadow-xs">
        
        {/* Search input + Sort row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#69746D] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by project name, developer, country, or registry ID (e.g., VCS-2041)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653] bg-[#F7F8F4]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#69746D] hover:text-[#123D2A]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-[#69746D]">
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-medium text-[#123D2A] px-2.5 py-2 border border-[#DDEBDD] rounded-lg bg-white focus:outline-none focus:border-[#218653]"
              >
                <option value="newest">Newest Listed</option>
                <option value="price_asc">Lowest Unit Price</option>
                <option value="price_desc">Highest Unit Price</option>
                <option value="qty_desc">Highest Available Volume</option>
                <option value="alpha">Alphabetical (A-Z)</option>
              </select>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#123D2A] border border-[#DDEBDD] rounded-lg bg-[#F7F8F4]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-[#218653]" />}
            </button>
          </div>
        </div>

        {/* Category Segmented Filter Buttons (allowed interactive filter tabs) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 font-medium rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#123D2A] text-white shadow-xs'
                : 'text-[#69746D] hover:text-[#123D2A] hover:bg-[#F7F8F4]'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#123D2A] text-white shadow-xs'
                  : 'text-[#69746D] hover:text-[#123D2A] hover:bg-[#F7F8F4]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Main Grid + Sidebar Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Desktop Filters Sidebar (and responsive mobile drawer) */}
        <aside className={`lg:block bg-white p-5 rounded-xl border border-[#DDEBDD] space-y-6 ${isFilterDrawerOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="flex items-center justify-between border-b border-[#DDEBDD] pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#123D2A]">
              Filter Registry Attributes
            </h3>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[11px] font-medium text-[#218653] hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Standard / Registry */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#123D2A]">
              Standard / Custodian
            </label>
            <select
              value={selectedStandard}
              onChange={(e) => setSelectedStandard(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653] bg-[#F7F8F4]"
            >
              <option value="all">All Standards & Registries</option>
              {standards.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Country / Geography */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#123D2A]">
              Project Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653] bg-[#F7F8F4]"
            >
              <option value="all">All Countries ({countries.length})</option>
              {countries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Max Indicative Unit Price Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-[#123D2A]">Max Indicative Price</label>
              <span className="font-mono font-bold text-[#218653]">${maxPrice} / t</span>
            </div>
            <input
              type="range"
              min={5}
              max={200}
              step={5}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#218653] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#69746D]">
              <span>$5</span>
              <span>$100</span>
              <span>$200+</span>
            </div>
          </div>

          {/* Minimum Available Quantity */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#123D2A]">
              Minimum Available (tCO2e)
            </label>
            <select
              value={minQuantity}
              onChange={(e) => setMinQuantity(Number(e.target.value))}
              className="w-full text-xs px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653] bg-[#F7F8F4]"
            >
              <option value={0}>Any available volume</option>
              <option value={5000}>5,000+ tCO2e</option>
              <option value={10000}>10,000+ tCO2e</option>
              <option value={25000}>25,000+ tCO2e</option>
              <option value={50000}>50,000+ tCO2e</option>
            </select>
          </div>

          {/* Diligence note */}
          <div className="p-3 bg-[#F7F8F4] rounded-lg border border-[#DDEBDD] text-[11px] text-[#69746D] leading-relaxed">
            <strong className="text-[#123D2A] block mb-1">Audit Policy:</strong>
            Listings display indicative prices. Official transfer occurs via bilateral agreement after broker diligence.
          </div>
        </aside>

        {/* Listings Display Grid */}
        <main className="lg:col-span-3 space-y-4">
          
          {/* Active summary count */}
          <div className="flex items-center justify-between text-xs text-[#69746D]">
            <span>
              Showing <strong className="text-[#123D2A] tabular-nums">{filteredListings.length}</strong> verified project listings
            </span>
            {hasActiveFilters && (
              <span className="text-[#218653] font-medium">Filtered results</span>
            )}
          </div>

          {filteredListings.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#DDEBDD] p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#F7F8F4] text-[#69746D] flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#123D2A]">No Listings Match Your Filters</h3>
              <p className="text-xs text-[#69746D] max-w-sm mx-auto leading-relaxed">
                Try widening your price range, clearing selected standards, or resetting the search parameters to browse all available carbon opportunities.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#123D2A] rounded-lg hover:bg-[#1B4D36] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredListings.map(listing => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onViewDetails={onSelectListing}
                />
              ))}
            </div>
          )}

        </main>

      </div>

    </div>
  );
};
