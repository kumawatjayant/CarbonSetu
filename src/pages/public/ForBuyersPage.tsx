import React from 'react';
import { DemoBadge } from '../../components/common/DemoBadge';
import { Building2, ShieldCheck, Layers, FileCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface ForBuyersPageProps {
  navigate: (route: string) => void;
}

export const ForBuyersPage: React.FC<ForBuyersPageProps> = ({ navigate }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <DemoBadge variant="inline" />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#123D2A] tracking-tight">
          Carbon Procurement for Corporate & ESG Leaders
        </h1>
        <p className="text-sm text-[#69746D] leading-relaxed">
          Streamline voluntary carbon-credit acquisition with transparent documentation, multi-asset portfolio bundling, and broker-assisted tranche execution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#DDEBDD] space-y-3">
          <div className="w-9 h-9 rounded-lg bg-[#DDEBDD] text-[#123D2A] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#218653]" />
          </div>
          <h3 className="text-base font-bold text-[#123D2A]">Audited Documentation First</h3>
          <p className="text-xs text-[#69746D] leading-relaxed">
            Inspect Project Design Documents (PDDs), monitoring reports, and accredited third-party validation statements before committing capital.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#DDEBDD] space-y-3">
          <div className="w-9 h-9 rounded-lg bg-[#DDEBDD] text-[#123D2A] flex items-center justify-center">
            <Layers className="w-5 h-5 text-[#218653]" />
          </div>
          <h3 className="text-base font-bold text-[#123D2A]">Multi-Asset Portfolio Bundling</h3>
          <p className="text-xs text-[#69746D] leading-relaxed">
            Blend short-term avoided emissions with high-permanence CDR removals (e.g. Puro.earth biochar) to satisfy corporate Net-Zero transition milestones.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#DDEBDD] space-y-3">
          <div className="w-9 h-9 rounded-lg bg-[#DDEBDD] text-[#123D2A] flex items-center justify-center">
            <FileCheck className="w-5 h-5 text-[#218653]" />
          </div>
          <h3 className="text-base font-bold text-[#123D2A]">Post Purchase Requirements</h3>
          <p className="text-xs text-[#69746D] leading-relaxed">
            Submit your specific volume, vintage, geography, and standard targets. Our channel partner desk actively matches matching supplier inventory.
          </p>
        </div>
      </div>

      <div className="bg-[#123D2A] text-white p-8 sm:p-10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-xl font-bold">Start Building Your Carbon Portfolio</h3>
          <p className="text-xs text-[#DDEBDD]/80">
            Create a corporate buyer profile or browse currently listed inventory.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/buyer/requirements')}
            className="px-4 py-2.5 text-xs font-semibold text-[#123D2A] bg-white rounded-lg hover:bg-[#DDEBDD] transition-colors"
          >
            Post Purchase Requirement
          </button>
          <button
            onClick={() => navigate('/marketplace')}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-[#218653] rounded-lg hover:bg-[#1B4D36] transition-colors"
          >
            Explore Marketplace
          </button>
        </div>
      </div>
    </div>
  );
};
