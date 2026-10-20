import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DemoBadge } from '../../components/common/DemoBadge';
import { BundleBuilderModal } from '../../components/bundles/BundleBuilderModal';
import { CarbonBundle } from '../../types';
import { Layers, Plus, ArrowUpRight, CheckCircle2, Archive, Eye } from 'lucide-react';

interface AdminBundlesProps {
  navigate: (route: string) => void;
  onSelectBundle: (bundleId: string) => void;
}

export const AdminBundles: React.FC<AdminBundlesProps> = ({ 
  navigate,
  onSelectBundle 
}) => {
  const { bundles, updateBundle, showToast } = useApp();
  const [builderOpen, setBuilderOpen] = useState(false);

  const toggleStatus = (bundle: CarbonBundle) => {
    const nextStatus = bundle.bundleStatus === 'active' ? 'draft' : 'active';
    updateBundle(bundle.id, { bundleStatus: nextStatus });
    showToast(`Bundle "${bundle.bundleName}" status changed to ${nextStatus.toUpperCase()}`, 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <DemoBadge variant="inline" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2A] tracking-tight mt-1">
            Bundle & Portfolio Management Desk
          </h1>
          <p className="text-xs text-[#69746D] mt-0.5">
            Curate multi-project blended portfolios, enforce mathematical weighted average pricing, and prevent inventory double-counting.
          </p>
        </div>

        <button
          onClick={() => setBuilderOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#123D2A] hover:bg-[#1B4D36] rounded-xl transition-all shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 text-[#DDEBDD]" />
          <span>Assemble New Bundle</span>
        </button>
      </div>

      {/* Bundles Table */}
      <div className="bg-white rounded-2xl border border-[#DDEBDD] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#DDEBDD] text-[#69746D] font-mono text-[11px] uppercase bg-[#F7F8F4]">
                <th className="py-3 px-4">Portfolio Name & Category</th>
                <th className="py-3 px-4">Component Mix</th>
                <th className="py-3 px-4 text-right">Total Volume</th>
                <th className="py-3 px-4 text-right">Weighted Avg Price</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDEBDD]/60">
              {bundles.map(b => (
                <tr key={b.id} className="hover:bg-[#F7F8F4]/80 transition-colors">
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-bold text-[#123D2A] truncate">{b.bundleName}</div>
                    <div className="text-[11px] text-[#218653] font-semibold">{b.bundleCategory}</div>
                  </td>
                  <td className="py-3.5 px-4 text-[#202923]">
                    <div className="flex flex-col gap-0.5">
                      {b.components.map((c, i) => (
                        <span key={i} className="text-[11px] text-[#69746D] truncate max-w-xs">
                          {c.projectName} ({c.allocatedQuantity.toLocaleString()} t)
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#123D2A] tabular-nums whitespace-nowrap">
                    {b.totalQuantity.toLocaleString()} {b.quantityUnit}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-medium text-[#218653] tabular-nums whitespace-nowrap">
                    {b.weightedAveragePrice ? `$${b.weightedAveragePrice.toFixed(2)}/t` : 'Custom quote'}
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      b.bundleStatus === 'active'
                        ? 'bg-[#DDEBDD] text-[#218653]'
                        : 'bg-neutral-100 text-[#69746D]'
                    }`}>
                      {b.bundleStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onSelectBundle(b.id)}
                        className="p-1.5 text-[#69746D] hover:text-[#123D2A] rounded border border-[#DDEBDD]"
                        title="View Public Presentation"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => toggleStatus(b)}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded border border-[#DDEBDD] hover:bg-[#F7F8F4]"
                      >
                        {b.bundleStatus === 'active' ? 'Unpublish' : 'Publish'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <BundleBuilderModal
        isOpen={builderOpen}
        onClose={() => setBuilderOpen(false)}
        onBundleCreated={(newB) => onSelectBundle(newB.id)}
      />

    </div>
  );
};
