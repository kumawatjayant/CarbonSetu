import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BundleCard } from '../../components/bundles/BundleCard';
import { BundleBuilderModal } from '../../components/bundles/BundleBuilderModal';
import { DemoBadge } from '../../components/common/DemoBadge';
import { Layers, Plus, Search, Sparkles, Filter, Calculator } from 'lucide-react';

interface BundlesPageProps {
  navigate: (route: string) => void;
  onSelectBundle: (bundleId: string) => void;
}

export const BundlesPage: React.FC<BundlesPageProps> = ({ 
  navigate, 
  onSelectBundle 
}) => {
  const { bundles } = useApp();
  const [builderOpen, setBuilderOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'Mixed Project Portfolio',
    'Nature and Forestry Portfolio',
    'High-Durability CDR Portfolio',
    'Renewable Energy Portfolio',
    'Buyer-Customized Portfolio'
  ];

  const filteredBundles = bundles.filter(b => {
    if (b.bundleStatus !== 'active') return false;

    if (selectedCategory !== 'all' && b.bundleCategory !== selectedCategory) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = b.bundleName.toLowerCase().includes(q);
      const matchDesc = b.description.toLowerCase().includes(q);
      const matchComp = b.components.some(c => c.projectName.toLowerCase().includes(q) || c.country.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchComp) return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="space-y-2">
        <DemoBadge variant="inline" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2A] tracking-tight">
              Carbon Credit Portfolio Bundles
            </h1>
            <p className="text-xs text-[#69746D] mt-1 max-w-2xl leading-relaxed">
              Pre-assembled multi-asset portfolios designed for corporate ESG balancing. Group compatible credits, preserve full component provenance, and access transparent weighted pricing.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setBuilderOpen(true)}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-[#123D2A] hover:bg-[#1B4D36] rounded-xl transition-all shadow-sm flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4 text-[#DDEBDD]" />
            <span>Assemble Custom Bundle</span>
          </button>
        </div>
      </div>

      {/* Mathematical Principles strip */}
      <div className="bg-white p-4 rounded-xl border border-[#DDEBDD] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#DDEBDD] text-[#123D2A] flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4 text-[#218653]" />
          </div>
          <div>
            <strong className="text-[#123D2A] block">Zero Provenance Loss</strong>
            <span className="text-[#69746D] text-[11px]">
              Every credit keeps its underlying registry project ID, vintage, and standard.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#DDEBDD] text-[#123D2A] flex items-center justify-center shrink-0">
            <Calculator className="w-4 h-4 text-[#218653]" />
          </div>
          <div>
            <strong className="text-[#123D2A] block">Weighted Math Engine</strong>
            <span className="text-[#69746D] text-[11px]">
              Strictly calculated as &Sigma;(Quantity &times; Price) / Total Quantity. No hidden spread.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#DDEBDD] text-[#123D2A] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-[#218653]" />
          </div>
          <div>
            <strong className="text-[#123D2A] block">Inventory Safeguards</strong>
            <span className="text-[#69746D] text-[11px]">
              Component allocations are clamped to avoid duplicate claims across bundles.
            </span>
          </div>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#69746D] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by bundle name, project, or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-[#DDEBDD] rounded-lg bg-white focus:outline-none focus:border-[#218653]"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
              selectedCategory === 'all'
                ? 'bg-[#123D2A] text-white shadow-xs'
                : 'text-[#69746D] hover:bg-white'
            }`}
          >
            All Portfolios
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
                selectedCategory === cat
                  ? 'bg-[#123D2A] text-white shadow-xs'
                  : 'text-[#69746D] hover:bg-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Bundles Grid */}
      {filteredBundles.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#DDEBDD] p-12 text-center space-y-3">
          <h3 className="text-base font-bold text-[#123D2A]">No Portfolios Found</h3>
          <p className="text-xs text-[#69746D]">
            No bundles match your search criteria. Build a custom portfolio using our bundling engine.
          </p>
          <button
            onClick={() => setBuilderOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#123D2A] rounded-lg"
          >
            Assemble Custom Bundle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBundles.map(bundle => (
            <BundleCard
              key={bundle.id}
              bundle={bundle}
              onViewDetails={onSelectBundle}
            />
          ))}
        </div>
      )}

      {/* Bundle Builder Modal */}
      <BundleBuilderModal
        isOpen={builderOpen}
        onClose={() => setBuilderOpen(false)}
        onBundleCreated={(newB) => onSelectBundle(newB.id)}
      />

    </div>
  );
};
