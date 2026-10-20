import React from 'react';
import { DemoBadge } from '../../components/common/DemoBadge';
import { Search, Layers, Scale, FileText, CheckCircle2 } from 'lucide-react';

interface ServicesPageProps {
  navigate: (route: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ navigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <DemoBadge variant="inline" />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#123D2A] tracking-tight">
          CarbonBridge Marketplace Services
        </h1>
        <p className="text-sm text-[#69746D] leading-relaxed">
          Comprehensive intermediation, due diligence, portfolio structuring, and transaction coordination for voluntary carbon markets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#DDEBDD] space-y-3">
          <Search className="w-5 h-5 text-[#218653]" />
          <h3 className="text-base font-bold text-[#123D2A]">1. Project Discovery & Document Auditing</h3>
          <p className="text-xs text-[#69746D] leading-relaxed">
            We review registry serial status, host country Article 6 alignment, Project Design Documents, and third-party VVB validation reports before listings go live.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#DDEBDD] space-y-3">
          <Layers className="w-5 h-5 text-[#218653]" />
          <h3 className="text-base font-bold text-[#123D2A]">2. Carbon-Credit Portfolio Bundling</h3>
          <p className="text-xs text-[#69746D] leading-relaxed">
            Our proprietary bundling engine synthesizes multi-project credit portfolios with mathematical weighted average price calculations and guaranteed zero provenance erosion.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#DDEBDD] space-y-3">
          <Scale className="w-5 h-5 text-[#218653]" />
          <h3 className="text-base font-bold text-[#123D2A]">3. Channel Partner Broker Intermediation</h3>
          <p className="text-xs text-[#69746D] leading-relaxed">
            Dedicated human carbon brokers manage counterparty negotiations, volume tranche adjustments, delivery milestones, and bilateral contract drafting.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#DDEBDD] space-y-3">
          <FileText className="w-5 h-5 text-[#218653]" />
          <h3 className="text-base font-bold text-[#123D2A]">4. Transaction & Escrow Settlement Advisory</h3>
          <p className="text-xs text-[#69746D] leading-relaxed">
            Coordination of registry serial electronic transfers, retirement certificates in the buyer's legal name, and transparent commission ledger administration.
          </p>
        </div>
      </div>
    </div>
  );
};
