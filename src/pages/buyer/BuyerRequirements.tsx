import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DemoBadge } from '../../components/common/DemoBadge';
import { BuyerRequirement, ProjectCategory, CarbonStandard } from '../../types';
import { Plus, Check, Sparkles, Filter, Trash2, ArrowUpRight } from 'lucide-react';

interface BuyerRequirementsProps {
  navigate: (route: string) => void;
  onSelectListing: (listingId: string) => void;
}

export const BuyerRequirements: React.FC<BuyerRequirementsProps> = ({ 
  navigate,
  onSelectListing 
}) => {
  const { currentUser, requirements, createRequirement, listings, showToast } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [desiredQuantity, setDesiredQuantity] = useState<number>(10000);
  const [intendedUse, setIntendedUse] = useState<BuyerRequirement['intendedUse']>('Corporate Scope 1/2 Offset');
  const [preferredCategories, setPreferredCategories] = useState<ProjectCategory[]>(['Forestry & Afforestation', 'Renewable Energy']);
  const [vintageStart, setVintageStart] = useState<number>(2023);
  const [vintageEnd, setVintageEnd] = useState<number>(2025);
  const [budgetMax, setBudgetMax] = useState<number>(25);
  const [preferredTimeframe, setPreferredTimeframe] = useState('Q4 2026 Delivery');
  const [documentationRequirements, setDocumentationRequirements] = useState('');

  const allCategories: ProjectCategory[] = [
    'Forestry & Afforestation',
    'Renewable Energy',
    'Blue Carbon & Mangroves',
    'Biochar & Soil Carbon',
    'Direct Air Capture & Mineralization',
    'Cookstoves & Community Energy'
  ];

  const handleToggleCategory = (cat: ProjectCategory) => {
    if (preferredCategories.includes(cat)) {
      setPreferredCategories(prev => prev.filter(c => c !== cat));
    } else {
      setPreferredCategories(prev => [...prev, cat]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!title.trim()) {
      showToast('Please provide a title for this procurement target.', 'warning');
      return;
    }

    if (preferredCategories.length === 0) {
      showToast('Select at least one preferred project category.', 'warning');
      return;
    }

    createRequirement({
      buyerId: currentUser.id,
      buyerName: currentUser.fullName,
      companyName: currentUser.companyName,
      title,
      desiredQuantity: Number(desiredQuantity),
      quantityUnit: 'tCO2e',
      preferredCategories,
      vintageRange: { start: Number(vintageStart), end: Number(vintageEnd) },
      budgetMax: Number(budgetMax),
      currency: 'USD',
      intendedUse,
      preferredTimeframe,
      documentationRequirements: documentationRequirements || undefined,
      status: 'open'
    });

    setShowCreateModal(false);
    setTitle('');
  };

  const userReqs = requirements.filter(r => currentUser && r.buyerId === currentUser.id);

  // Rule-based match search: find listings matching categories and vintage
  const findMatches = (req: BuyerRequirement) => {
    return listings.filter(l => {
      if (l.listingStatus !== 'approved') return false;
      const catMatch = req.preferredCategories.includes(l.projectCategory);
      const priceMatch = req.budgetMax ? (!l.indicativeUnitPrice || l.indicativeUnitPrice <= req.budgetMax) : true;
      return catMatch && priceMatch;
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <DemoBadge variant="inline" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2A] tracking-tight mt-1">
            Purchase Targets & Specifications
          </h1>
          <p className="text-xs text-[#69746D] mt-0.5">
            Define your corporate carbon credit criteria. The CarbonBridge matching engine scans active supplier listings.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#123D2A] hover:bg-[#1B4D36] rounded-xl transition-all shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Purchase Target</span>
        </button>
      </div>

      {/* List of Requirements */}
      <div className="space-y-6">
        {userReqs.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-[#DDEBDD] text-center space-y-3">
            <h3 className="text-base font-bold text-[#123D2A]">No Purchase Targets Configured</h3>
            <p className="text-xs text-[#69746D] max-w-sm mx-auto">
              Post your target volume, acceptable registries, and vintage preferences so our channel brokers can match suitable tranches.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#123D2A] rounded-lg"
            >
              Configure Target Now
            </button>
          </div>
        ) : (
          userReqs.map(req => {
            const matches = findMatches(req);
            return (
              <div key={req.id} className="bg-white p-6 rounded-2xl border border-[#DDEBDD] shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#DDEBDD] pb-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#69746D]">
                      <span className="font-mono text-[#218653] font-semibold">{req.intendedUse}</span>
                      <span>·</span>
                      <span>Target: {req.desiredQuantity.toLocaleString()} {req.quantityUnit}</span>
                      <span>·</span>
                      <span>Max: ${req.budgetMax}/t</span>
                    </div>
                    <h3 className="text-base font-bold text-[#123D2A] mt-0.5">{req.title}</h3>
                  </div>

                  <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider bg-[#DDEBDD]/50 text-[#123D2A] rounded">
                    Status: {req.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#69746D]">
                  <div>
                    <span className="font-semibold text-[#123D2A] block">Categories:</span>
                    <span>{req.preferredCategories.join(', ')}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#123D2A] block">Vintage Target:</span>
                    <span>{req.vintageRange ? `${req.vintageRange.start}–${req.vintageRange.end}` : 'Flexible'}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#123D2A] block">Target Delivery:</span>
                    <span>{req.preferredTimeframe}</span>
                  </div>
                </div>

                {/* Live Match Engine output */}
                <div className="bg-[#F7F8F4] p-4 rounded-xl border border-[#DDEBDD] space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-[#123D2A]">
                      <Sparkles className="w-3.5 h-3.5 text-[#218653]" />
                      <span>Platform Match Engine: {matches.length} Compatible Supplier Listings</span>
                    </div>
                    <span className="text-[11px] text-[#69746D]">Real-time audit correlation</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                    {matches.map(l => (
                      <div
                        key={l.id}
                        onClick={() => onSelectListing(l.id)}
                        className="bg-white p-3 rounded-lg border border-[#DDEBDD] hover:border-[#218653] transition-colors cursor-pointer text-xs flex items-center justify-between"
                      >
                        <div className="truncate mr-2">
                          <div className="font-semibold text-[#123D2A] truncate">{l.projectName}</div>
                          <div className="text-[10px] text-[#69746D]">
                            {l.country} · {l.quantityAvailable.toLocaleString()} tCO2e available
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-mono text-[#218653] font-bold">
                            {l.indicativeUnitPrice ? `$${l.indicativeUnitPrice}/t` : 'Quote'}
                          </span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-[#69746D] ml-auto mt-0.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#123D2A]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-[#DDEBDD] shadow-xl p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-[#123D2A]">Post New Purchase Specification</h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-[#123D2A] mb-1">Target Name *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Scope 1 Aviation Fuel Neutralization Q4"
                  className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#123D2A] mb-1">Desired Volume (tCO2e) *</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={desiredQuantity}
                    onChange={(e) => setDesiredQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653] font-mono tabular-nums"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#123D2A] mb-1">Max Indicative Budget ($/t) *</label>
                  <input
                    type="number"
                    required
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653] font-mono tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#123D2A] mb-1">Intended Application</label>
                <select
                  value={intendedUse}
                  onChange={(e) => setIntendedUse(e.target.value as any)}
                  className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653] bg-white"
                >
                  <option value="Corporate Scope 1/2 Offset">Corporate Scope 1/2 Offset</option>
                  <option value="Value Chain Scope 3 Neutralization">Value Chain Scope 3 Neutralization</option>
                  <option value="Compliance Buffer">Compliance Buffer</option>
                  <option value="Portfolio Resale">Portfolio Resale</option>
                  <option value="ESG Reporting">CSRD & ESG Reporting</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#123D2A] mb-1.5">
                  Acceptable Project Categories (Select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {allCategories.map(cat => {
                    const isSelected = preferredCategories.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => handleToggleCategory(cat)}
                        className={`p-2 rounded border text-left transition-colors flex items-center justify-between ${
                          isSelected ? 'bg-[#123D2A] text-white border-[#123D2A]' : 'bg-[#F7F8F4] text-[#202923] border-[#DDEBDD]'
                        }`}
                      >
                        <span className="truncate">{cat}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#DDEBDD]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 font-medium text-[#69746D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-[#123D2A] rounded-lg hover:bg-[#1B4D36]"
                >
                  Save Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
