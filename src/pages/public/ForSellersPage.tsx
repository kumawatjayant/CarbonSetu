import React from 'react';
import { DemoBadge } from '../../components/common/DemoBadge';
import { Layers, ShieldCheck, Scale, CheckCircle2, ArrowRight } from 'lucide-react';

interface ForSellersPageProps {
  navigate: (route: string) => void;
}

export const ForSellersPage: React.FC<ForSellersPageProps> = ({ navigate }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <DemoBadge variant="inline" />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#123D2A] tracking-tight">
          List Your Environmental Assets with CarbonBridge
        </h1>
        <p className="text-sm text-[#69746D] leading-relaxed">
          Connect directly with qualified institutional buyers, receive verified corporate quote inquiries, and retain complete control over your minimum order tranches and pricing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#DDEBDD] space-y-3">
          <div className="w-9 h-9 rounded-lg bg-[#DDEBDD] text-[#123D2A] flex items-center justify-center">
            <Layers className="w-5 h-5 text-[#218653]" />
          </div>
          <h3 className="text-base font-bold text-[#123D2A]">Structured Listing Review</h3>
          <p className="text-xs text-[#69746D] leading-relaxed">
            Our multi-step listing submission captures your project design document, monitoring reports, and registry identifiers for rapid administrator approval.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#DDEBDD] space-y-3">
          <div className="w-9 h-9 rounded-lg bg-[#DDEBDD] text-[#123D2A] flex items-center justify-center">
            <Scale className="w-5 h-5 text-[#218653]" />
          </div>
          <h3 className="text-base font-bold text-[#123D2A]">Transparent Facilitation</h3>
          <p className="text-xs text-[#69746D] leading-relaxed">
            No opaque broker markups or hidden spreads. Our agreed success fee (typically 3.0%–3.5%) is established up front and invoiced only upon settlement.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#DDEBDD] space-y-3">
          <div className="w-9 h-9 rounded-lg bg-[#DDEBDD] text-[#123D2A] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#218653]" />
          </div>
          <h3 className="text-base font-bold text-[#123D2A]">Retain Custody Until Close</h3>
          <p className="text-xs text-[#69746D] leading-relaxed">
            Never surrender registry serials or enter exclusive lock-ups prior to agreed escrow funding. You maintain holding control throughout discussions.
          </p>
        </div>
      </div>

      <div className="bg-[#123D2A] text-white p-8 sm:p-10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-xl font-bold">Ready to List Your Carbon Credits?</h3>
          <p className="text-xs text-[#DDEBDD]/80">
            Submit your project details for administrator review in minutes.
          </p>
        </div>
        <button
          onClick={() => navigate('/seller/listings/new')}
          className="px-5 py-2.5 text-xs font-semibold text-[#123D2A] bg-white rounded-lg hover:bg-[#DDEBDD] transition-colors shrink-0"
        >
          Submit New Project Listing &rarr;
        </button>
      </div>
    </div>
  );
};
