import React from 'react';
import { DemoBadge } from '../../components/common/DemoBadge';
import { 
  Search, 
  Layers, 
  FileCheck2, 
  Scale, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Handshake,
  Building2,
  Lock
} from 'lucide-react';

interface HowItWorksPageProps {
  navigate: (route: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ navigate }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <DemoBadge variant="inline" />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#123D2A] tracking-tight">
          How CarbonBridge Works
        </h1>
        <p className="text-sm text-[#69746D] leading-relaxed">
          CarbonBridge operates as a specialized B2B channel-partner marketplace. We bridge the gap between verified carbon project developers and institutional buyers without claiming false certification authority.
        </p>
      </div>

      {/* The 4 Market Participants */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            role: 'Carbon Suppliers',
            who: 'Project developers, forestry operators, renewable operators, biochar plants.',
            action: 'Submit listings with PDDs, monitor audits, and specify tranche quantities.'
          },
          {
            role: 'Corporate Buyers',
            who: 'Procurement heads, ESG teams, corporate sustainability officers.',
            action: 'Browse projects, post purchase requirements, request quotes, and assemble bundles.'
          },
          {
            role: 'Channel Partner Desk',
            who: 'CarbonBridge senior brokers and platform intermediaries.',
            action: 'Coordinate diligence, match counterparties, validate bundles, and facilitate closing.'
          },
          {
            role: 'Registry Custodians',
            who: 'Verra, Gold Standard, Puro.earth, ACR, CAR.',
            action: 'Official third-party registries holding the actual serialized credit certificates.'
          }
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-[#DDEBDD] space-y-2 text-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#218653] font-bold block">
              Participant 0{idx + 1}
            </span>
            <h3 className="font-bold text-[#123D2A] text-sm">{item.role}</h3>
            <p className="text-[#69746D] leading-relaxed">{item.who}</p>
            <div className="pt-2 border-t border-[#DDEBDD]/60 text-[#202923]">
              <strong>Role:</strong> {item.action}
            </div>
          </div>
        ))}
      </div>

      {/* 5 Phase Execution Journey */}
      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#DDEBDD] space-y-8">
        <div>
          <h2 className="text-xl font-bold text-[#123D2A]">The End-to-End Deal Pipeline</h2>
          <p className="text-xs text-[#69746D] mt-1">
            Every transaction follows our 11-stage broker facilitation governance to protect buyer and seller interests.
          </p>
        </div>

        <div className="space-y-6">
          {[
            {
              phase: 'Phase 1: Listing Submission & Independent Audit',
              details: 'The project developer submits technical documentation, PDD, validation statement from accredited VVBs, and host-nation authorization. CarbonBridge administrators review evidence before approving the listing to the public marketplace.'
            },
            {
              phase: 'Phase 2: Discovery or Portfolio Bundling',
              details: 'Buyers browse individual project tranches or use our Bundling Engine to blend high-permanence CDR with nature-based credits. The engine guarantees zero loss of provenance and calculates strictly accurate weighted average pricing.'
            },
            {
              phase: 'Phase 3: Formal Inquiry & Broker Qualification',
              details: 'The buyer submits requested quantity, intended use (Scope 1/2 vs Scope 3 vs CSRD), and delivery timelines. CarbonBridge channel desk confirms available inventory with the developer and opens bilateral negotiation.'
            },
            {
              phase: 'Phase 4: Commercial Quote & Bilateral Term Sheet',
              details: 'The supplier submits a formal quote including volume discounts and delivery conditions. Buyer and seller agree on commercial terms through the platform with complete transparency.'
            },
            {
              phase: 'Phase 5: Contract Execution & Registry Transfer',
              details: 'Bilateral legal agreements are executed. Credits are electronically transferred between registry accounts (or retired with official certificate). CarbonBridge records agreed channel commissions only upon successful fulfillment.'
            }
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 text-xs">
              <div className="w-6 h-6 rounded-full bg-[#123D2A] text-white flex items-center justify-center font-mono font-bold shrink-0 mt-0.5">
                {i + 1}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-[#123D2A]">{item.phase}</h4>
                <p className="text-[#69746D] leading-relaxed">{item.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Strip */}
      <div className="bg-[#123D2A] text-white p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold">Ready to Explore Opportunities?</h3>
          <p className="text-xs text-[#DDEBDD]/80 mt-1">
            Browse verified listings or speak with a carbon channel specialist.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/marketplace')}
            className="px-4 py-2.5 text-xs font-semibold text-[#123D2A] bg-white rounded-lg hover:bg-[#DDEBDD] transition-colors"
          >
            Explore Marketplace
          </button>
          <button
            onClick={() => navigate('/bundles')}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-[#218653] rounded-lg hover:bg-[#1B4D36] transition-colors"
          >
            Browse Bundles
          </button>
        </div>
      </div>

    </div>
  );
};
