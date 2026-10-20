import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CreditListing, BundleComponent, CarbonBundle } from '../../types';
import { Modal } from '../common/Modal';
import { Plus, Trash2, Check, AlertTriangle, Calculator, Sparkles } from 'lucide-react';

interface BundleBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBundleCreated?: (bundle: CarbonBundle) => void;
}

export const BundleBuilderModal: React.FC<BundleBuilderModalProps> = ({
  isOpen,
  onClose,
  onBundleCreated
}) => {
  const { listings, createBundle, showToast, currentUser } = useApp();

  const [bundleName, setBundleName] = useState('');
  const [description, setDescription] = useState('');
  const [bundleCategory, setBundleCategory] = useState<CarbonBundle['bundleCategory']>('Mixed Project Portfolio');
  
  // Selected components with allocated quantity
  const [selectedAllocations, setSelectedAllocations] = useState<{ [listingId: string]: number }>({});
  const [selectedListingToAdd, setSelectedListingToAdd] = useState<string>('');

  // Active eligible approved listings only
  const eligibleListings = useMemo(() => {
    return listings.filter(l => l.listingStatus === 'approved' && l.quantityAvailable > 0);
  }, [listings]);

  const handleAddProject = () => {
    if (!selectedListingToAdd) return;
    const target = eligibleListings.find(l => l.id === selectedListingToAdd);
    if (!target) return;

    if (selectedAllocations[target.id] !== undefined) {
      showToast('This project is already in your bundle draft.', 'info');
      return;
    }

    const defaultQty = Math.min(target.quantityAvailable, 5000);
    setSelectedAllocations(prev => ({
      ...prev,
      [target.id]: defaultQty
    }));
    setSelectedListingToAdd('');
  };

  const handleRemoveProject = (listingId: string) => {
    setSelectedAllocations(prev => {
      const copy = { ...prev };
      delete copy[listingId];
      return copy;
    });
  };

  const handleQuantityChange = (listingId: string, val: number) => {
    const listing = eligibleListings.find(l => l.id === listingId);
    if (!listing) return;

    const clamped = Math.max(0, Math.min(val, listing.quantityAvailable));
    setSelectedAllocations(prev => ({
      ...prev,
      [listingId]: clamped
    }));
  };

  // Math calculations
  const componentsList: BundleComponent[] = useMemo(() => {
    return Object.entries(selectedAllocations).map(([listingId, allocatedQty]) => {
      const listing = eligibleListings.find(l => l.id === listingId)!;
      return {
        listingId,
        allocatedQuantity: allocatedQty,
        quantityUnit: listing?.quantityUnit || 'tCO2e',
        projectName: listing?.projectName || 'Project',
        category: listing?.projectCategory,
        standard: listing?.registryOrStandard,
        vintage: `${listing?.vintageStart}-${listing?.vintageEnd}`,
        country: listing?.country || 'International',
        indicativeUnitPrice: listing?.indicativeUnitPrice
      };
    });
  }, [selectedAllocations, eligibleListings]);

  const totalQuantity = useMemo(() => {
    return componentsList.reduce((sum, c) => sum + c.allocatedQuantity, 0);
  }, [componentsList]);

  // Check currency compatibility & calculate weighted average
  const { totalIndicativeCost, weightedAveragePrice, hasUnpricedComponent } = useMemo(() => {
    let cost = 0;
    let unpriced = false;

    for (const c of componentsList) {
      if (c.indicativeUnitPrice === undefined || c.indicativeUnitPrice === null) {
        unpriced = true;
      } else {
        cost += (c.allocatedQuantity * c.indicativeUnitPrice);
      }
    }

    const avg = (totalQuantity > 0 && !unpriced) ? (cost / totalQuantity) : undefined;

    return {
      totalIndicativeCost: cost,
      weightedAveragePrice: avg,
      hasUnpricedComponent: unpriced
    };
  }, [componentsList, totalQuantity]);

  const handleSaveBundle = (e: React.FormEvent) => {
    e.preventDefault();

    if (!bundleName.trim()) {
      showToast('Please provide a descriptive bundle name.', 'warning');
      return;
    }

    if (componentsList.length < 2) {
      showToast('A carbon bundle requires at least 2 distinct component projects.', 'warning');
      return;
    }

    if (totalQuantity <= 0) {
      showToast('Please allocate a valid quantity greater than zero for each project.', 'error');
      return;
    }

    const newBundle = createBundle({
      bundleName,
      description: description.trim() || `Custom diversified carbon bundle created on CarbonBridge. Total volume: ${totalQuantity.toLocaleString()} tCO2e across ${componentsList.length} verified projects.`,
      bundleCategory,
      components: componentsList,
      totalQuantity,
      quantityUnit: 'tCO2e',
      weightedAveragePrice: weightedAveragePrice ? Number(weightedAveragePrice.toFixed(2)) : undefined,
      isCurrenciesCompatible: true,
      bundleStatus: 'active',
      demoRecord: false,
      createdBy: currentUser ? currentUser.fullName : 'Independent Portfolio Desk'
    });

    if (onBundleCreated) {
      onBundleCreated(newBundle);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Carbon Credit Bundling Engine"
      subtitle="Assemble compatible projects into an aggregate corporate procurement portfolio with audit trail"
      maxWidth="2xl"
    >
      <form onSubmit={handleSaveBundle} className="space-y-5">
        
        {/* Name and category */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#123D2A] mb-1">
              Bundle / Portfolio Name *
            </label>
            <input
              type="text"
              required
              value={bundleName}
              onChange={(e) => setBundleName(e.target.value)}
              placeholder="e.g., European Compliance & Nature Resilience Blend 2026"
              className="w-full text-xs px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#123D2A] mb-1">
              Portfolio Strategy *
            </label>
            <select
              value={bundleCategory}
              onChange={(e) => setBundleCategory(e.target.value as any)}
              className="w-full text-xs px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653] bg-white"
            >
              <option value="Mixed Project Portfolio">Mixed Project Portfolio</option>
              <option value="Nature and Forestry Portfolio">Nature and Forestry Portfolio</option>
              <option value="Renewable Energy Portfolio">Renewable Energy Portfolio</option>
              <option value="High-Durability CDR Portfolio">High-Durability CDR Portfolio</option>
              <option value="Buyer-Customized Portfolio">Buyer-Customized Portfolio</option>
            </select>
          </div>
        </div>

        {/* Component Selector */}
        <div className="bg-[#F7F8F4] p-4 rounded-xl border border-[#DDEBDD] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#123D2A]">
              Add Component Credits
            </h4>
            <span className="text-[11px] text-[#69746D]">
              Select from approved registry-verified listings
            </span>
          </div>

          <div className="flex gap-2">
            <select
              value={selectedListingToAdd}
              onChange={(e) => setSelectedListingToAdd(e.target.value)}
              className="flex-1 text-xs px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653] bg-white truncate"
            >
              <option value="">-- Select an approved project to include --</option>
              {eligibleListings.map(l => (
                <option key={l.id} value={l.id}>
                  {l.projectName} ({l.country} · {l.projectCategory} · {l.quantityAvailable.toLocaleString()} tCO2e available · {l.indicativeUnitPrice ? `$${l.indicativeUnitPrice}/t` : 'Quote only'})
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleAddProject}
              disabled={!selectedListingToAdd}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-[#218653] hover:bg-[#1B4D36] rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Include</span>
            </button>
          </div>

          {/* Active list of components */}
          {componentsList.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#69746D] border border-dashed border-[#DDEBDD] rounded-lg bg-white">
              No projects added yet. Select at least two compatible project listings from the dropdown above to calculate weighted pricing.
            </div>
          ) : (
            <div className="space-y-2.5 pt-1">
              {componentsList.map((comp) => {
                const listing = eligibleListings.find(l => l.id === comp.listingId);
                const maxAvailable = listing?.quantityAvailable || 100000;
                const percentage = totalQuantity > 0 ? Math.round((comp.allocatedQuantity / totalQuantity) * 100) : 0;

                return (
                  <div key={comp.listingId} className="bg-white p-3 rounded-lg border border-[#DDEBDD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[#123D2A] truncate">
                        {comp.projectName}
                      </div>
                      <div className="text-[11px] text-[#69746D] flex items-center gap-1.5 mt-0.5">
                        <span>{comp.country}</span>
                        <span>·</span>
                        <span>{comp.standard}</span>
                        <span>·</span>
                        <span>Vintages {comp.vintage}</span>
                        <span>·</span>
                        <span className="font-mono text-[#218653]">
                          {comp.indicativeUnitPrice ? `$${comp.indicativeUnitPrice.toFixed(2)}/t` : 'Unpriced'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={1}
                            max={maxAvailable}
                            value={comp.allocatedQuantity}
                            onChange={(e) => handleQuantityChange(comp.listingId, Number(e.target.value))}
                            className="w-28 text-xs px-2.5 py-1.5 border border-[#DDEBDD] rounded focus:outline-none focus:border-[#218653] font-mono tabular-nums text-right"
                          />
                          <span className="text-xs text-[#69746D]">tCO2e</span>
                        </div>
                        <span className="text-[10px] text-[#69746D] block text-right mt-0.5">
                          {percentage}% of bundle (Max: {maxAvailable.toLocaleString()})
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveProject(comp.listingId)}
                        className="p-1.5 text-[#C94C4C] hover:bg-red-50 rounded"
                        title="Remove project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Live Calculation Matrix */}
        {componentsList.length > 0 && (
          <div className="bg-[#123D2A] text-white p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#218653]/40 pb-2.5">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#DDEBDD]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#DDEBDD]">
                  Portfolio Aggregation Metrics
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#DDEBDD]/80">
                Formula: &Sigma;(Quantity &times; Price) / Total Quantity
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#DDEBDD]/70 block">
                  Total Aggregate Quantity
                </span>
                <span className="text-lg font-bold tabular-nums">
                  {totalQuantity.toLocaleString()}
                </span>
                <span className="text-xs text-[#DDEBDD] ml-1 font-mono">tCO2e</span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#DDEBDD]/70 block">
                  Estimated Total Portfolio Cost
                </span>
                <span className="text-lg font-bold tabular-nums text-[#DDEBDD]">
                  ${totalIndicativeCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-[#DDEBDD]/70 ml-1">USD</span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#DDEBDD]/70 block">
                  Weighted Average Price
                </span>
                {weightedAveragePrice ? (
                  <span className="text-lg font-bold tabular-nums text-[#DDEBDD]">
                    ${weightedAveragePrice.toFixed(2)}
                    <span className="text-xs font-normal text-[#DDEBDD]/70 ml-1">/ tCO2e</span>
                  </span>
                ) : (
                  <span className="text-xs text-amber-300 font-medium">
                    {hasUnpricedComponent ? 'Contains unpriced components' : '—'}
                  </span>
                )}
              </div>
            </div>

            {hasUnpricedComponent && (
              <div className="flex items-center gap-2 text-xs text-amber-200 bg-amber-900/30 p-2 rounded border border-amber-500/30">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-300" />
                <span>
                  Notice: One or more selected projects require bespoke quote pricing. Weighted average excludes unpriced components.
                </span>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-[#123D2A] mb-1">
            Portfolio Description & Strategic Alignment
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the thesis for this portfolio mix (e.g. blend of immediate avoided emissions and long-permanence removals)..."
            className="w-full text-xs px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653]"
          />
        </div>

        {/* Buttons */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#DDEBDD]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#69746D] hover:text-[#123D2A]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={componentsList.length < 2 || totalQuantity <= 0}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#123D2A] hover:bg-[#1B4D36] rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Assemble & Publish Bundle</span>
          </button>
        </div>

      </form>
    </Modal>
  );
};
