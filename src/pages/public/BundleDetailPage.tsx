import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DemoBadge } from '../../components/common/DemoBadge';
import { QuoteModal } from '../../components/marketplace/QuoteModal';
import { 
  ArrowLeft, 
  Bookmark, 
  Layers, 
  Calculator, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  ArrowUpRight,
  PieChart,
  CheckCircle2
} from 'lucide-react';

interface BundleDetailPageProps {
  bundleId: string;
  navigate: (route: string) => void;
  onSelectListing: (listingId: string) => void;
}

export const BundleDetailPage: React.FC<BundleDetailPageProps> = ({ 
  bundleId, 
  navigate,
  onSelectListing 
}) => {
  const { bundles, savedBundleIds, toggleSaveBundle } = useApp();
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const bundle = bundles.find(b => b.id === bundleId);

  if (!bundle) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#123D2A]">Bundle Not Found</h2>
        <p className="text-xs text-[#69746D]">
          The requested portfolio bundle could not be found or has expired.
        </p>
        <button
          onClick={() => navigate('/bundles')}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#123D2A] rounded-lg"
        >
          Return to Bundles
        </button>
      </div>
    );
  }

  const isSaved = savedBundleIds.includes(bundle.id);
  const totalValue = bundle.weightedAveragePrice 
    ? (bundle.totalQuantity * bundle.weightedAveragePrice) 
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top back button and action */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/bundles')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#69746D] hover:text-[#123D2A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Bundles</span>
        </button>

        <button
          type="button"
          onClick={() => toggleSaveBundle(bundle.id)}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded border transition-colors flex items-center gap-1.5 ${
            isSaved
              ? 'bg-[#123D2A] text-white border-[#123D2A]'
              : 'bg-white text-[#123D2A] border-[#DDEBDD] hover:bg-[#F7F8F4]'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
          <span>{isSaved ? 'Saved to Portfolios' : 'Save Bundle'}</span>
        </button>
      </div>

      {bundle.demoRecord && (
        <DemoBadge variant="inline" />
      )}

      {/* Header Overview Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#DDEBDD] shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 text-xs text-[#69746D]">
              <span className="font-semibold text-[#218653]">{bundle.bundleCategory}</span>
              <span aria-hidden="true">·</span>
              <span>Curated by {bundle.createdBy}</span>
              <span aria-hidden="true">·</span>
              <span>Created {new Date(bundle.createdAt).toLocaleDateString()}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2A]">
              {bundle.bundleName}
            </h1>

            <p className="text-xs sm:text-sm text-[#69746D] leading-relaxed max-w-3xl">
              {bundle.description}
            </p>
          </div>

          {/* Pricing Box */}
          <div className="bg-[#123D2A] text-white p-5 rounded-xl space-y-3 shrink-0 w-full sm:w-72">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#DDEBDD]/70 block">
                Weighted Avg Indicative Price
              </span>
              <div className="text-2xl font-bold font-mono tabular-nums text-white">
                {bundle.weightedAveragePrice ? `$${bundle.weightedAveragePrice.toFixed(2)}` : 'Custom Quote'}
                <span className="text-xs font-normal text-[#DDEBDD]/70 ml-1">/ tCO2e</span>
              </div>
            </div>

            <div className="border-t border-[#218653]/40 pt-2 flex items-center justify-between text-xs text-[#DDEBDD]">
              <span>Total Volume:</span>
              <span className="font-mono font-bold text-white tabular-nums">
                {bundle.totalQuantity.toLocaleString()} tCO2e
              </span>
            </div>

            {totalValue && (
              <div className="flex items-center justify-between text-xs text-[#DDEBDD]">
                <span>Indicative Total:</span>
                <span className="font-mono font-bold text-white tabular-nums">
                  ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} USD
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setQuoteModalOpen(true)}
              className="w-full py-2.5 text-xs font-semibold text-center text-[#123D2A] bg-white hover:bg-[#DDEBDD] rounded-lg transition-colors shadow-xs"
            >
              Request Quote for Bundle
            </button>
          </div>
        </div>
      </div>

      {/* Component Breakdown Table & Allocation */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#DDEBDD] space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#123D2A]">
              Underlying Project Provenance Breakdown
            </h2>
            <p className="text-xs text-[#69746D]">
              Every component credit retains its original project audit, methodology, and custodian registry.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-[#218653]">
            {bundle.components.length} Projects
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#DDEBDD] text-[#69746D] font-mono text-[11px] uppercase">
                <th className="py-3 px-3">Component Project</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Geography</th>
                <th className="py-3 px-3">Standard & Vintage</th>
                <th className="py-3 px-3 text-right">Allocated Volume</th>
                <th className="py-3 px-3 text-right">Share of Mix</th>
                <th className="py-3 px-3 text-right">Indicative Unit Price</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDEBDD]/60">
              {bundle.components.map((comp, idx) => {
                const percentage = Math.round((comp.allocatedQuantity / bundle.totalQuantity) * 100);
                return (
                  <tr key={idx} className="hover:bg-[#F7F8F4]/80 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-[#123D2A] max-w-xs truncate">
                      {comp.projectName}
                    </td>
                    <td className="py-3.5 px-3 text-[#69746D] whitespace-nowrap">
                      {comp.category}
                    </td>
                    <td className="py-3.5 px-3 text-[#202923] whitespace-nowrap">
                      {comp.country}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap font-mono text-[11px] text-[#69746D]">
                      {comp.standard} · {comp.vintage}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-semibold text-[#123D2A] tabular-nums whitespace-nowrap">
                      {comp.allocatedQuantity.toLocaleString()} tCO2e
                    </td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <span className="font-mono text-[#218653] font-semibold">{percentage}%</span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-medium text-[#202923] tabular-nums whitespace-nowrap">
                      {comp.indicativeUnitPrice ? `$${comp.indicativeUnitPrice.toFixed(2)}/t` : 'Quote only'}
                    </td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => onSelectListing(comp.listingId)}
                        className="text-[11px] font-semibold text-[#218653] hover:underline inline-flex items-center gap-0.5"
                      >
                        <span>Inspect</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Methodology and Due Diligence Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#F7F8F4] p-6 rounded-2xl border border-[#DDEBDD] space-y-3 text-xs">
          <div className="flex items-center gap-2 text-[#123D2A] font-bold">
            <Calculator className="w-4 h-4 text-[#218653]" />
            <span>Mathematical Allocation Proof</span>
          </div>
          <p className="text-[#69746D] leading-relaxed">
            The weighted average unit price is derived strictly by taking the total sum of each component's volume multiplied by its agreed indicative price, divided by the aggregate portfolio quantity:
          </p>
          <div className="bg-white p-3 rounded-lg border border-[#DDEBDD] font-mono text-[11px] text-[#123D2A]">
            Weighted Price = &Sigma;(Comp Quantity &times; Unit Price) &divide; {bundle.totalQuantity.toLocaleString()} tCO2e
          </div>
        </div>

        <div className="bg-[#F7F8F4] p-6 rounded-2xl border border-[#DDEBDD] space-y-3 text-xs">
          <div className="flex items-center gap-2 text-[#123D2A] font-bold">
            <ShieldCheck className="w-4 h-4 text-[#218653]" />
            <span>Delivery & Registry Fulfillment</span>
          </div>
          <p className="text-[#69746D] leading-relaxed">
            Upon bilateral contract execution, serial allocations are transferred directly from each supplier's registry holding account (Verra, Gold Standard, Puro.earth, etc.) to the buyer's custodian account or officially retired in the buyer's legal name.
          </p>
        </div>
      </div>

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        bundle={bundle}
      />
    </div>
  );
};
