import React, { useState } from 'react';
import { Logo } from '../common/Logo';
import { useApp } from '../../context/AppContext';
import { Mail, ArrowRight, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  navigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { subscribeNewsletter, resetDemoData } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscribeNewsletter(email)) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#123D2A] text-[#DDEBDD] border-t border-[#1B4D36]">
      {/* Top section: Brand & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="lg" light={true} showTagline={true} />
            <p className="text-xs text-[#DDEBDD]/80 leading-relaxed max-w-sm">
              Connecting Carbon. Creating Impact. CarbonBridge is a specialized B2B marketplace and portfolio bundling platform facilitating channel-partner discovery, structured due diligence, and verified carbon-credit procurement.
            </p>
            <div className="pt-2">
              <button
                onClick={resetDemoData}
                className="text-[11px] font-mono text-[#DDEBDD]/70 hover:text-white underline decoration-[#218653] underline-offset-4 transition-colors"
                title="Restore default demonstration listings, bundles, and deals"
              >
                Reset Demonstration Records to Default
              </button>
            </div>
          </div>

          {/* Column 1: Marketplace & Bundles */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Marketplace</h4>
            <ul className="space-y-2 text-xs text-[#DDEBDD]/80">
              <li>
                <button onClick={() => navigate('/marketplace')} className="hover:text-white transition-colors">
                  All Credit Listings
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/bundles')} className="hover:text-white transition-colors">
                  Curated Bundles
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/for-buyers')} className="hover:text-white transition-colors">
                  For Corporate Buyers
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/for-sellers')} className="hover:text-white transition-colors">
                  For Project Developers
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/services')} className="hover:text-white transition-colors">
                  Broker Advisory Services
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Platform & Governance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2 text-xs text-[#DDEBDD]/80">
              <li>
                <button onClick={() => navigate('/how-it-works')} className="hover:text-white transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/pricing')} className="hover:text-white transition-colors">
                  Commercials & Fees
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-white transition-colors">
                  About CarbonBridge
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/faq')} className="hover:text-white transition-colors">
                  Registry & Market FAQ
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">
                  Contact Channel Desk
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsletter Briefing */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Market Briefing</h4>
            <p className="text-xs text-[#DDEBDD]/70 leading-relaxed">
              Curated voluntary carbon market pricing insights, standard updates, and bundle origination notices.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-[#218653] bg-white/10 p-2.5 rounded-lg border border-[#218653]/30">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#218653]" />
                <span>Subscribed to market briefings.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#1B4D36]/80 text-white placeholder-[#DDEBDD]/50 text-xs px-3 py-2 rounded-lg border border-[#218653]/50 focus:outline-none focus:border-white"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-2.5 bg-[#218653] hover:bg-[#299E64] text-white rounded text-xs transition-colors flex items-center justify-center"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[10px] text-[#DDEBDD]/50 block">No spam. Unsubscribe at any time.</span>
              </form>
            )}
          </div>

        </div>

        {/* Regulatory & Channel Partner Disclosure (Mandatory as per section 2 & 21) */}
        <div className="mt-10 pt-6 border-t border-[#1B4D36] text-[11px] leading-relaxed text-[#DDEBDD]/70 space-y-2">
          <p>
            <strong className="text-white">Channel Partner & Regulatory Notice:</strong> CarbonBridge operates as an independent B2B carbon-credit marketplace, facilitator, and bundling intermediary. CarbonBridge is not an official carbon-offset registry, nor an authorized third-party validation/verification body (VVB), nor an exchange. CarbonBridge does not originate carbon credits directly nor certify carbon claims. Listing approvals reflect platform administrative documentation reviews and do not substitute for buyer due diligence. All credit provenance, registry serial transfers, and retirements are executed under standard bilateral contractual agreements and official registry custodians (Verra, Gold Standard, Puro.earth, ACR).
          </p>
        </div>

        {/* Bottom copyright & legal links */}
        <div className="mt-6 pt-4 border-t border-[#1B4D36]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#DDEBDD]/60">
          <div>
            &copy; 2026 CarbonBridge Marketplace Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">
              Privacy Policy
            </button>
            <span>·</span>
            <button onClick={() => navigate('/terms')} className="hover:text-white transition-colors">
              Terms & Conditions
            </button>
            <span>·</span>
            <button onClick={() => navigate('/disclaimer')} className="hover:text-white transition-colors">
              Marketplace Disclaimer
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
