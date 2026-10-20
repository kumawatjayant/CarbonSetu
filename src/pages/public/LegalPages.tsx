import React, { useState } from 'react';
import { DemoBadge } from '../../components/common/DemoBadge';
import { ShieldCheck, FileText, AlertTriangle } from 'lucide-react';

interface LegalPagesProps {
  initialTab?: 'privacy' | 'terms' | 'disclaimer';
}

export const LegalPages: React.FC<LegalPagesProps> = ({ initialTab = 'privacy' }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'disclaimer'>(initialTab);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <DemoBadge variant="inline" />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2A] tracking-tight">
          Legal, Privacy & Marketplace Terms
        </h1>
        <p className="text-xs text-[#69746D]">
          Regulatory governance and contractual disclosures for participants on CarbonBridge.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#DDEBDD] pb-1 text-xs">
        <button
          onClick={() => setActiveTab('privacy')}
          className={`py-2 px-3 font-semibold rounded-t-lg transition-colors ${
            activeTab === 'privacy'
              ? 'border-b-2 border-[#218653] text-[#123D2A] bg-white'
              : 'text-[#69746D] hover:text-[#123D2A]'
          }`}
        >
          Privacy Policy
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          className={`py-2 px-3 font-semibold rounded-t-lg transition-colors ${
            activeTab === 'terms'
              ? 'border-b-2 border-[#218653] text-[#123D2A] bg-white'
              : 'text-[#69746D] hover:text-[#123D2A]'
          }`}
        >
          Terms and Conditions
        </button>
        <button
          onClick={() => setActiveTab('disclaimer')}
          className={`py-2 px-3 font-semibold rounded-t-lg transition-colors ${
            activeTab === 'disclaimer'
              ? 'border-b-2 border-[#218653] text-[#123D2A] bg-white'
              : 'text-[#69746D] hover:text-[#123D2A]'
          }`}
        >
          Marketplace Disclaimer
        </button>
      </div>

      {/* Draft Template Notice banner */}
      <div className="p-3 bg-[#DDEBDD]/50 border border-[#218653]/30 rounded-lg flex items-center gap-2 text-xs text-[#123D2A]">
        <FileText className="w-4 h-4 text-[#218653] shrink-0" />
        <span>
          <strong>Draft Legal Template:</strong> These terms are structured templates reflecting channel-partner governance prior to formal commercial execution in applicable jurisdictions.
        </span>
      </div>

      {/* Content Container */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#DDEBDD] text-xs sm:text-sm text-[#69746D] leading-relaxed space-y-6">
        
        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-[#123D2A]">1. CarbonBridge Privacy Policy</h2>
            <p>
              CarbonBridge Marketplace Ltd (&quot;CarbonBridge&quot;, &quot;we&quot;, &quot;our&quot;) is committed to protecting the privacy of corporate representatives, environmental project developers, brokers, and platform visitors.
            </p>
            <h3 className="font-bold text-[#123D2A] text-xs">Information We Collect</h3>
            <p>
              We collect information provided directly during registration, including your full name, work email address, corporate entity name, job title, phone number, and jurisdictional location. For project suppliers, we additionally collect and store Project Design Documents, registry sub-account identifications, and third-party audit reports.
            </p>
            <h3 className="font-bold text-[#123D2A] text-xs">Use of Data & Confidentiality</h3>
            <p>
              We use collected information strictly to facilitate marketplace interactions, qualify counterparties, assemble credit bundles, and coordinate quote negotiations. We do not sell corporate contact details to external advertisers. Private supplier documentation is made available only to registered corporate buyers who have accepted bilateral due diligence terms.
            </p>
            <h3 className="font-bold text-[#123D2A] text-xs">Data Security & Storage</h3>
            <p>
              Uploaded project certificates and registry filings are stored in secured object storage with access policies restricted by role-based authorization controls.
            </p>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-[#123D2A]">2. Terms and Conditions of Platform Use</h2>
            <p>
              By accessing the CarbonBridge web application, you agree to comply with and be bound by these commercial terms and operating guidelines.
            </p>
            <h3 className="font-bold text-[#123D2A] text-xs">Channel Partner Relationship</h3>
            <p>
              CarbonBridge acts solely as an intermediary and facilitator between environmental project suppliers and institutional buyers. CarbonBridge is not the legal issuer of carbon credits, does not guarantee future market value or price appreciation, and does not warrant compliance with prospective unilateral national regulatory mandates.
            </p>
            <h3 className="font-bold text-[#123D2A] text-xs">Supplier Listing Warranties</h3>
            <p>
              Suppliers listing credits warrant that they hold lawful, unencumbered rights to offer the specified volume and that no credits listed have been pledged, double-counted, retired, or claimed elsewhere without explicit disclosure.
            </p>
            <h3 className="font-bold text-[#123D2A] text-xs">Commissions and Facilitation Fees</h3>
            <p>
              Facilitation fees become payable only upon formal mutual agreement and verified delivery or registry retirement. No fees are due solely for viewing listings or creating inquiries.
            </p>
          </div>
        )}

        {activeTab === 'disclaimer' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-[#123D2A]">3. Carbon-Credit Marketplace Disclaimer</h2>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs">
              <strong className="block mb-1">Crucial Regulatory Boundary:</strong>
              CarbonBridge is not an independent standards body, carbon-offset registry, or accredited third-party validation/verification body (VVB).
            </div>
            <p>
              The display of any credit listing on CarbonBridge indicates solely that the project developer has provided documentation that passed our platform administrative checklist. Approval of a listing does not constitute an environmental guarantee, financial certification, or endorsement by CarbonBridge.
            </p>
            <p>
              All environmental claims, permanence estimates, additionality metrics, and co-benefits are grounded in the referenced carbon standards (Verra, Gold Standard, Puro.earth, ACR). Buyers remain solely responsible for conducting their own legal, regulatory, and technical due diligence prior to executing bilateral contracts.
            </p>
          </div>
        )}

      </div>

    </div>
  );
};
