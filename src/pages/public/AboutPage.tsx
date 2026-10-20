import React from 'react';
import { DemoBadge } from '../../components/common/DemoBadge';
import { ShieldCheck, CheckCircle2, Award, Scale, Building2 } from 'lucide-react';

interface AboutPageProps {
  navigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <DemoBadge variant="inline" />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#123D2A] tracking-tight">
          About CarbonBridge
        </h1>
        <p className="text-sm text-[#69746D] leading-relaxed">
          Tagline: <strong className="text-[#123D2A]">Connecting Carbon. Creating Impact.</strong> CarbonBridge was founded to bring institutional rigor, transparency, and portfolio bundling infrastructure to voluntary carbon markets.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#DDEBDD] space-y-6 text-xs sm:text-sm text-[#69746D] leading-relaxed">
        <h2 className="text-lg font-bold text-[#123D2A]">Our Origin & Core Mission</h2>
        <p>
          The voluntary carbon market has suffered historically from opacity, fragmented communication channels, inconsistent project documentation, and excessive middleman margins. Buyers struggle to verify provenance across scattered registries, while legitimate high-impact project developers face hurdles reaching corporate balance sheets.
        </p>
        <p>
          CarbonBridge resolves this as an independent channel partner. We provide the digital and operational infrastructure to discover, vet, bundle, and negotiate environmental assets. By treating carbon credits as specialized environmental financial instruments that require rigorous provenance preservation, we ensure every corporate purchase delivers tangible, auditable climate impact.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
        <div className="bg-[#F7F8F4] p-5 rounded-xl border border-[#DDEBDD] space-y-2">
          <Scale className="w-5 h-5 text-[#218653]" />
          <h3 className="font-bold text-[#123D2A] text-sm">Broker-Assisted Integrity</h3>
          <p className="text-[#69746D]">
            We are not a speculative crypto token or automated matching bot. We are senior climate market intermediaries coordinating lawful bilateral transactions.
          </p>
        </div>

        <div className="bg-[#F7F8F4] p-5 rounded-xl border border-[#DDEBDD] space-y-2">
          <ShieldCheck className="w-5 h-5 text-[#218653]" />
          <h3 className="font-bold text-[#123D2A] text-sm">Truth in Advertising</h3>
          <p className="text-[#69746D]">
            We do not issue carbon credits or claim sovereign certification authority. All claims are grounded directly in accredited registry filings (Verra, GS, Puro.earth).
          </p>
        </div>

        <div className="bg-[#F7F8F4] p-5 rounded-xl border border-[#DDEBDD] space-y-2">
          <Building2 className="w-5 h-5 text-[#218653]" />
          <h3 className="font-bold text-[#123D2A] text-sm">Institutional Standards</h3>
          <p className="text-[#69746D]">
            Our bundling methodologies and audit logs are designed to comply with European CSRD, Oxford Offsetting Principles, and ISO 14064 criteria.
          </p>
        </div>
      </div>
    </div>
  );
};
