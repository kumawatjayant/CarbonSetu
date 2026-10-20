import React, { useState } from 'react';
import { DemoBadge } from '../../components/common/DemoBadge';
import { Calculator, ShieldCheck, CheckCircle2, ArrowRight, HelpCircle } from 'lucide-react';

interface PricingPageProps {
  navigate: (route: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ navigate }) => {
  // Calculator inputs
  const [quantity, setQuantity] = useState<number>(10000);
  const [unitPrice, setUnitPrice] = useState<number>(12.50);
  const [commissionRate, setCommissionRate] = useState<number>(3.5);
  const [fixedFee, setFixedFee] = useState<number>(500);
  const [feePayer, setFeePayer] = useState<'seller' | 'buyer' | 'split'>('seller');

  // Mathematical outputs
  const transactionValue = quantity * unitPrice;
  const percentageFee = (transactionValue * (commissionRate / 100));
  const totalPlatformFee = percentageFee + fixedFee;
  const effectivePercentage = transactionValue > 0 ? ((totalPlatformFee / transactionValue) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <DemoBadge variant="inline" />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#123D2A] tracking-tight">
          Commercial Model & Facilitation Fees
        </h1>
        <p className="text-sm text-[#69746D] leading-relaxed">
          Transparent, performance-based channel partner commercials. No hidden brokerage spreads or markups. Fees are recorded strictly upon verified bilateral closing.
        </p>
      </div>

      {/* Commercial Structures Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#DDEBDD] space-y-4">
          <div className="text-xs font-mono font-semibold text-[#218653] uppercase tracking-wider">
            Standard Marketplace Facilitation
          </div>
          <h3 className="text-xl font-bold text-[#123D2A]">3.0% – 3.5%</h3>
          <p className="text-xs text-[#69746D] leading-relaxed">
            Standard success fee calculated as a percentage of verified transaction value, typically deducted from seller proceeds upon registry settlement.
          </p>
          <ul className="text-xs text-[#202923] space-y-2 pt-2 border-t border-[#DDEBDD]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#218653]" />
              <span>Full listing audit and documentation</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#218653]" />
              <span>Direct channel-broker negotiation support</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#218653]" />
              <span>Registry sub-account transfer escrow support</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl border-2 border-[#123D2A] shadow-md space-y-4 relative">
          <div className="absolute -top-3 right-5 bg-[#123D2A] text-white px-3 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
            MOST COMMON
          </div>
          <div className="text-xs font-mono font-semibold text-[#218653] uppercase tracking-wider">
            Structured Portfolio Bundling
          </div>
          <h3 className="text-xl font-bold text-[#123D2A]">3.0% + $500–$750</h3>
          <p className="text-xs text-[#69746D] leading-relaxed">
            For multi-project bundles requiring cross-standard registry balancing, weighted pricing calculation, and syndicated legal contracts.
          </p>
          <ul className="text-xs text-[#202923] space-y-2 pt-2 border-t border-[#DDEBDD]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#218653]" />
              <span>Multi-originator coordination desk</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#218653]" />
              <span>Single consolidated commercial invoice</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#218653]" />
              <span>Cross-registry retirement proof packet</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#DDEBDD] space-y-4">
          <div className="text-xs font-mono font-semibold text-[#218653] uppercase tracking-wider">
            Institutional Enterprise Desk
          </div>
          <h3 className="text-xl font-bold text-[#123D2A]">Negotiated Custom</h3>
          <p className="text-xs text-[#69746D] leading-relaxed">
            For transactions exceeding 50,000 tCO2e or bespoke multi-year forward credit offtake agreements with custom Article 6 authorization clauses.
          </p>
          <ul className="text-xs text-[#202923] space-y-2 pt-2 border-t border-[#DDEBDD]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#218653]" />
              <span>Dedicated senior carbon broker</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#218653]" />
              <span>Bespoke RFP and supplier tender management</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#218653]" />
              <span>Capped volume-tier fee structures</span>
            </li>
          </ul>
        </div>
      </div>

      {/* INTERACTIVE COMMISSION CALCULATOR (Section 13) */}
      <div className="bg-[#123D2A] text-white p-6 sm:p-10 rounded-2xl space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#218653]/40 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#218653] text-white flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Interactive Commission & Fee Calculator</h2>
              <p className="text-xs text-[#DDEBDD]/80">
                Simulate platform facilitation economics based on transaction parameters.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono bg-[#1B4D36] px-3 py-1 rounded text-[#DDEBDD] border border-[#218653]/40">
            HYPOTHETICAL DEMO SIMULATION
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Inputs Column */}
          <div className="lg:col-span-6 space-y-4 text-xs">
            
            {/* Quantity */}
            <div>
              <div className="flex justify-between text-[#DDEBDD] mb-1">
                <label className="font-semibold">Credit Volume (tCO2e)</label>
                <span className="font-mono tabular-nums font-bold text-white">{quantity.toLocaleString()} tCO2e</span>
              </div>
              <input
                type="range"
                min={1000}
                max={100000}
                step={1000}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full accent-[#218653] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#DDEBDD]/60 mt-0.5">
                <span>1,000</span>
                <span>50,000</span>
                <span>100,000 t</span>
              </div>
            </div>

            {/* Price */}
            <div>
              <div className="flex justify-between text-[#DDEBDD] mb-1">
                <label className="font-semibold">Agreed Unit Price ($/tCO2e)</label>
                <span className="font-mono tabular-nums font-bold text-white">${unitPrice.toFixed(2)} USD</span>
              </div>
              <input
                type="range"
                min={5}
                max={150}
                step={0.5}
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                className="w-full accent-[#218653] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#DDEBDD]/60 mt-0.5">
                <span>$5/t</span>
                <span>$75/t</span>
                <span>$150/t</span>
              </div>
            </div>

            {/* Rate */}
            <div>
              <div className="flex justify-between text-[#DDEBDD] mb-1">
                <label className="font-semibold">Commission Rate (%)</label>
                <span className="font-mono tabular-nums font-bold text-white">{commissionRate.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min={1.0}
                max={8.0}
                step={0.1}
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-full accent-[#218653] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#DDEBDD]/60 mt-0.5">
                <span>1.0%</span>
                <span>3.5% (Default)</span>
                <span>8.0%</span>
              </div>
            </div>

            {/* Fixed fee */}
            <div>
              <label className="block text-[#DDEBDD] font-semibold mb-1">
                Fixed Facilitation / Escrow Fee (USD)
              </label>
              <select
                value={fixedFee}
                onChange={(e) => setFixedFee(Number(e.target.value))}
                className="w-full bg-[#1B4D36] border border-[#218653]/50 text-white rounded-lg px-3 py-2 text-xs focus:outline-none"
              >
                <option value={0}>$0 (Standard Single Project)</option>
                <option value={500}>$500 (Standard Portfolio Bundle)</option>
                <option value={750}>$750 (Complex Multi-Standard Syndicate)</option>
                <option value={1000}>$1,000 (Custom Cross-Border Escrow)</option>
              </select>
            </div>

            {/* Payer */}
            <div>
              <label className="block text-[#DDEBDD] font-semibold mb-1">
                Commission Payer Attribution
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFeePayer('seller')}
                  className={`py-2 px-2 text-center rounded border transition-colors ${
                    feePayer === 'seller' ? 'bg-[#218653] border-white text-white font-semibold' : 'border-[#218653]/40 bg-[#1B4D36] text-[#DDEBDD]'
                  }`}
                >
                  Seller Deducted
                </button>
                <button
                  type="button"
                  onClick={() => setFeePayer('buyer')}
                  className={`py-2 px-2 text-center rounded border transition-colors ${
                    feePayer === 'buyer' ? 'bg-[#218653] border-white text-white font-semibold' : 'border-[#218653]/40 bg-[#1B4D36] text-[#DDEBDD]'
                  }`}
                >
                  Buyer Added
                </button>
                <button
                  type="button"
                  onClick={() => setFeePayer('split')}
                  className={`py-2 px-2 text-center rounded border transition-colors ${
                    feePayer === 'split' ? 'bg-[#218653] border-white text-white font-semibold' : 'border-[#218653]/40 bg-[#1B4D36] text-[#DDEBDD]'
                  }`}
                >
                  Split 50/50
                </button>
              </div>
            </div>

          </div>

          {/* Results Column */}
          <div className="lg:col-span-6 bg-[#1B4D36] p-6 rounded-xl border border-[#218653]/50 space-y-5">
            <span className="text-xs font-mono uppercase tracking-wider text-[#DDEBDD] block">
              Calculated Financial Summary
            </span>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#DDEBDD]">
                <span>Gross Credit Transaction Value:</span>
                <span className="text-base font-bold font-mono text-white tabular-nums">
                  ${transactionValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-[#DDEBDD]">
                <span>Percentage Channel Fee ({commissionRate.toFixed(1)}%):</span>
                <span className="font-mono text-white tabular-nums">
                  ${percentageFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-[#DDEBDD]">
                <span>Fixed Facilitation / Bundle Admin Fee:</span>
                <span className="font-mono text-white tabular-nums">
                  ${fixedFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="border-t border-[#218653]/60 pt-3 flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#DDEBDD] font-semibold block">Total Platform Fee:</span>
                  <span className="text-[11px] text-[#DDEBDD]/70 font-mono">
                    Effective Rate: {effectivePercentage.toFixed(2)}%
                  </span>
                </div>
                <span className="text-2xl font-extrabold font-mono text-white tabular-nums">
                  ${totalPlatformFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* Settlement distribution */}
              <div className="bg-[#123D2A] p-4 rounded-lg border border-[#218653]/40 space-y-2 text-xs">
                <span className="font-semibold text-[#DDEBDD] block">Settlement Allocation ({feePayer.toUpperCase()}):</span>
                {feePayer === 'seller' && (
                  <div className="flex justify-between text-[#DDEBDD]">
                    <span>Net Disbursed to Project Developer:</span>
                    <strong className="text-white font-mono">
                      ${(transactionValue - totalPlatformFee).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </strong>
                  </div>
                )}
                {feePayer === 'buyer' && (
                  <div className="flex justify-between text-[#DDEBDD]">
                    <span>Total Invoiced to Corporate Buyer:</span>
                    <strong className="text-white font-mono">
                      ${(transactionValue + totalPlatformFee).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </strong>
                  </div>
                )}
                {feePayer === 'split' && (
                  <>
                    <div className="flex justify-between text-[#DDEBDD]">
                      <span>Buyer Share (+{(totalPlatformFee / 2).toLocaleString()}):</span>
                      <strong className="text-white font-mono">
                        ${(transactionValue + (totalPlatformFee / 2)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </strong>
                    </div>
                    <div className="flex justify-between text-[#DDEBDD]">
                      <span>Net Seller Proceeds (-{(totalPlatformFee / 2).toLocaleString()}):</span>
                      <strong className="text-white font-mono">
                        ${(transactionValue - (totalPlatformFee / 2)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </strong>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="text-[11px] text-[#DDEBDD]/70 leading-relaxed border-t border-[#218653]/40 pt-3">
              All figures above are illustrative simulations. Formal fees are stipulated in signed bilateral agreements and become due strictly upon verified registry delivery.
            </div>

            <button
              onClick={() => navigate('/contact')}
              className="w-full py-2.5 text-xs font-semibold text-center text-[#123D2A] bg-white hover:bg-[#DDEBDD] rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Discuss Commercial Terms With Broker Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
