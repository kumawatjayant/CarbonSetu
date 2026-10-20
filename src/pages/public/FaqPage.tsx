import React, { useState } from 'react';
import { DemoBadge } from '../../components/common/DemoBadge';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FaqPageProps {
  navigate: (route: string) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ navigate }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: 'Marketplace Operations',
      items: [
        {
          q: 'What role does CarbonBridge play in carbon-credit transactions?',
          a: 'CarbonBridge operates as an independent B2B channel-partner marketplace and bundling platform. We help corporate buyers discover suitable carbon projects, help suppliers reach institutional demand, coordinate bilateral quote negotiations, organize multi-asset bundles, and monitor transactions.'
        },
        {
          q: 'Does CarbonBridge certify or issue carbon credits?',
          a: 'No. CarbonBridge is neither a carbon-credit registry nor a third-party verification body (such as TÜV, DNV, or SustainCERT). All credits featured on our platform are issued or registered by recognized independent carbon standards (such as Verra VCS, Gold Standard, Puro.earth, or ACR).'
        },
        {
          q: 'How are project listings reviewed and approved?',
          a: 'When a supplier submits a listing, our administrator team conducts an initial due-diligence review. We check project registry identifiers, PDD documentation, third-party validation statements, and issuance status before approving the listing to appear publicly.'
        }
      ]
    },
    {
      category: 'Bundling & Provenance',
      items: [
        {
          q: 'How does the Bundling Engine work?',
          a: 'Our Bundling Engine allows buyers or platform brokers to combine credits from multiple compatible projects into a single portfolio. Every individual component credit strictly retains its original project name, registry serial number, country, methodology, and vintage.'
        },
        {
          q: 'How is the weighted average indicative price calculated?',
          a: 'For simple compatible bundles, Weighted Average Price = Total Indicative Cost / Total Aggregate Quantity. If any component project lacks a valid indicative unit price, the engine explicitly alerts the user and displays "Pricing on Request" rather than guessing.'
        },
        {
          q: 'How do you prevent inventory double-counting in bundles?',
          a: 'Each component allocation in a bundle is validated and clamped against the supplier\'s actual available inventory. The platform prevents the same physical credit inventory from being committed simultaneously across conflicting contracts.'
        }
      ]
    },
    {
      category: 'Commercials & Facilitation',
      items: [
        {
          q: 'What is the CarbonBridge commission and fee structure?',
          a: 'CarbonBridge operates on a success-based facilitation model, typically charging 3.0% to 3.5% of the verified transaction value, plus an optional fixed facilitation fee for multi-supplier portfolio bundles. No fees are earned or due merely upon listing creation or initial inquiry.'
        },
        {
          q: 'How are credit transfers and retirements finalized?',
          a: 'Transfers are executed via electronic registry sub-account transfers between the seller\'s and buyer\'s accounts, or via official custodian retirement certificates in the buyer\'s designated corporate entity name.'
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div className="text-center space-y-3">
        <DemoBadge variant="inline" />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#123D2A] tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-[#69746D]">
          Everything you need to know about CarbonBridge, our channel-partner model, and carbon-credit bundling.
        </p>
      </div>

      <div className="space-y-8">
        {faqs.map((group, gIdx) => (
          <div key={gIdx} className="space-y-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#218653]">
              {group.category}
            </h2>
            <div className="space-y-2.5">
              {group.items.map((item, iIdx) => {
                const globalIdx = gIdx * 10 + iIdx;
                const isOpen = openIndex === globalIdx;
                return (
                  <div key={iIdx} className="bg-white rounded-xl border border-[#DDEBDD] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : globalIdx)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-[#123D2A]"
                    >
                      <span>{item.q}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-[#218653] shrink-0" /> : <ChevronDown className="w-4 h-4 text-[#69746D] shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs text-[#69746D] leading-relaxed border-t border-[#DDEBDD]/50 pt-3">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
