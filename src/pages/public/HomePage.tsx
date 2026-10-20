import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ListingCard } from '../../components/marketplace/ListingCard';
import { BundleCard } from '../../components/bundles/BundleCard';
import { ProjectArtwork } from '../../components/common/ProjectArtwork';
import { DemoBadge } from '../../components/common/DemoBadge';
import { 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  FileCheck2, 
  Search, 
  Sparkles, 
  Building2, 
  ChevronDown, 
  ChevronUp,
  BarChart3,
  Scale,
  Handshake,
  ExternalLink
} from 'lucide-react';

interface HomePageProps {
  navigate: (route: string) => void;
  onSelectListing: (listingId: string) => void;
  onSelectBundle: (bundleId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  navigate, 
  onSelectListing, 
  onSelectBundle 
}) => {
  const { listings, bundles } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const featuredListings = listings.filter(l => l.listingStatus === 'approved').slice(0, 3);
  const featuredBundle = bundles[0];

  const faqs = [
    {
      q: 'What is CarbonBridge and what role does it play?',
      a: 'CarbonBridge is a specialized B2B carbon-credit marketplace and bundling intermediary operating on a channel-partner model. We connect eligible project developers and verified credit suppliers with corporate sustainability teams, coordinating discovery, project diligence, bundle assembly, and commercial terms.'
    },
    {
      q: 'Does CarbonBridge issue or certify carbon credits?',
      a: 'No. CarbonBridge is not an official carbon offset registry (such as Verra, Gold Standard, or Puro.earth) nor an accredited validation/verification body (VVB). All listings originate from established registries, and official transfers or retirements are executed directly through the respective registry custodians.'
    },
    {
      q: 'How does carbon-credit bundling work on CarbonBridge?',
      a: 'Our Bundling Engine groups compatible carbon credits into a unified portfolio (e.g., combining high-permanence CDR with nature-based co-benefits or renewable grid displacement). Crucially, every component credit retains its original registry ID, methodology, country, and vintage, with transparent weighted-average pricing.'
    },
    {
      q: 'How are commercial transactions and fees handled?',
      a: 'Commercial terms, volume tranches, and delivery timelines are agreed through broker-assisted quote negotiations. CarbonBridge records agreed channel-partner facilitation fees (typically 3–4% of eligible transaction value or negotiated fixed facilitation) only upon verified contractual closing.'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* Demo notice banner */}
      <DemoBadge variant="banner" />

      {/* SECTION 1: HERO SECTION */}
      <section className="relative overflow-hidden pt-4 pb-12 sm:pt-8 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#218653] uppercase tracking-wider">
                <span>Enterprise Carbon-Credit Marketplace & Bundling Engine</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#123D2A] tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
                A Smarter Way to Discover and Bundle Carbon Credits
              </h1>

              <p className="text-base sm:text-lg text-[#69746D] leading-relaxed max-w-2xl">
                Connect with carbon-credit suppliers, explore project opportunities, and build portfolios aligned with your sustainability requirements through one transparent platform.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/marketplace')}
                  className="px-6 py-3.5 text-sm font-semibold text-white bg-[#123D2A] hover:bg-[#1B4D36] rounded-xl transition-all shadow-sm flex items-center gap-2"
                >
                  <span>Explore Marketplace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/seller/listings/new')}
                  className="px-6 py-3.5 text-sm font-semibold text-[#123D2A] bg-white hover:bg-[#DDEBDD]/50 border border-[#DDEBDD] rounded-xl transition-all"
                >
                  <span>List Your Credits</span>
                </button>
              </div>

              {/* Verification & Trust badges inline */}
              <div className="pt-4 border-t border-[#DDEBDD] flex flex-wrap items-center gap-6 text-xs text-[#69746D]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#218653]" />
                  <span>Audited Documentation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#218653]" />
                  <span>Provenance-Preserving Bundles</span>
                </div>
                <div className="flex items-center gap-2">
                  <Handshake className="w-4 h-4 text-[#218653]" />
                  <span>Broker-Assisted Delivery</span>
                </div>
              </div>
            </div>

            {/* Right Column: High-Fidelity Thematic Graphic Panel */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-[#DDEBDD] shadow-xl overflow-hidden">
                <div className="p-4 bg-[#123D2A] text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#218653]" />
                    <span className="text-xs font-semibold tracking-wide">Live Marketplace Snapshot</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#DDEBDD]">Verra · GS · Puro.earth</span>
                </div>

                {/* SVG Visual Graphic */}
                <ProjectArtwork category="Forestry & Afforestation" height="h-52" />

                <div className="p-5 space-y-4 bg-white">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#69746D]">Active Registry Inventory</span>
                    <span className="font-bold text-[#123D2A] font-mono tabular-nums">227,400 tCO2e</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#69746D]">Curated Portfolio Bundles</span>
                    <span className="font-bold text-[#123D2A] font-mono tabular-nums">3 Institutional Mixes</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#69746D]">Facilitation Fee Structure</span>
                    <span className="font-bold text-[#218653] font-mono">3.0% – 3.5% (Transparent)</span>
                  </div>

                  <button
                    onClick={() => navigate('/bundles')}
                    className="w-full py-2.5 text-xs font-semibold text-center text-[#123D2A] bg-[#F7F8F4] hover:bg-[#DDEBDD] rounded-lg border border-[#DDEBDD] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Inspect Pre-Assembled Bundles</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: HOW IT WORKS (5 Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-semibold text-[#218653] uppercase tracking-wider">
            Operational Blueprint
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#123D2A]">
            How the CarbonBridge Marketplace Works
          </h2>
          <p className="text-sm text-[#69746D]">
            A structured channel-partner workflow guiding institutional buyers and project operators through verified credit procurement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: '01',
              title: 'Discover Projects',
              desc: 'Explore categorized environmental assets across forestry, blue carbon, biochar, and renewable power.'
            },
            {
              step: '02',
              title: 'Compare Attributes',
              desc: 'Evaluate vintage, methodology, registry serial readiness, co-benefits, and indicative unit pricing.'
            },
            {
              step: '03',
              title: 'Request or Bundle',
              desc: 'Submit a quote for single project tranches or assemble a diversified portfolio with weighted math.'
            },
            {
              step: '04',
              title: 'Channel Desk Connect',
              desc: 'CarbonBridge brokers coordinate directly with verified suppliers to establish bilateral delivery terms.'
            },
            {
              step: '05',
              title: 'Due Diligence & Close',
              desc: 'Execute formal contracts, confirm registry sub-account transfers, and record transparent fees.'
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-[#DDEBDD] relative flex flex-col justify-between">
              <div>
                <span className="text-2xl font-mono font-extrabold text-[#DDEBDD] block mb-2">
                  {item.step}
                </span>
                <h3 className="text-sm font-bold text-[#123D2A] mb-2">{item.title}</h3>
                <p className="text-xs text-[#69746D] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: FEATURED OPPORTUNITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold text-[#218653] uppercase tracking-wider">
              Marketplace Spotlights
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#123D2A]">
              Featured Credit Opportunities
            </h2>
            <p className="text-xs text-[#69746D] mt-1">
              Active projects with verified registry documentation and available volume.
            </p>
          </div>

          <button
            onClick={() => navigate('/marketplace')}
            className="text-xs font-semibold text-[#218653] hover:text-[#123D2A] transition-colors flex items-center gap-1"
          >
            <span>View All Listings ({listings.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredListings.map(listing => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onViewDetails={onSelectListing}
            />
          ))}
        </div>
      </section>

      {/* SECTION 4: BUNDLING BENEFITS */}
      <section className="bg-white border-y border-[#DDEBDD] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-semibold text-[#218653] uppercase tracking-wider">
                Portfolio Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#123D2A]">
                The Strategic Power of Carbon-Credit Bundles
              </h2>
              <p className="text-sm text-[#69746D] leading-relaxed">
                Rather than relying on a single project or registry, institutional buyers build multi-asset portfolios to manage risk, balance cost, and satisfy rigorous CSRD and Oxford Principles guidelines.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  {
                    title: 'Multi-opportunity discovery in one place',
                    desc: 'Combine immediate avoided emission credits with long-permanence carbon removals.'
                  },
                  {
                    title: 'Organize compatible project credits',
                    desc: 'Group by geography, standard, or vintage with strict compatibility validation.'
                  },
                  {
                    title: 'Preserve individual credit provenance',
                    desc: 'Every component maintains its distinct registry serial identifiers and audits.'
                  },
                  {
                    title: 'Weighted-average price transparency',
                    desc: 'Exact mathematical calculation: Total Indicative Cost / Total Allocated Volume.'
                  },
                  {
                    title: 'Unified inquiry & quote coordination',
                    desc: 'Communicate through a single CarbonBridge channel broker rather than multiple scattered sellers.'
                  }
                ].map((pt, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#218653] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-[#123D2A]">{pt.title}</h4>
                      <p className="text-xs text-[#69746D]">{pt.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigate('/bundles')}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#123D2A] hover:bg-[#1B4D36] rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>Explore Carbon Bundles</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Featured Bundle preview card */}
            <div className="lg:col-span-6">
              {featuredBundle && (
                <div className="bg-[#F7F8F4] p-6 rounded-2xl border border-[#DDEBDD]">
                  <div className="text-xs font-mono text-[#218653] mb-2 font-semibold">
                    SAMPLE PRE-ASSEMBLED BUNDLE
                  </div>
                  <BundleCard
                    bundle={featuredBundle}
                    onViewDetails={onSelectBundle}
                  />
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: AUDIENCE-SPECIFIC BENEFITS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-semibold text-[#218653] uppercase tracking-wider">
            Tailored Marketplace Value
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#123D2A]">
            Built for Key Market Participants
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* For Buyers */}
          <div className="bg-white p-6 rounded-xl border border-[#DDEBDD] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-[#DDEBDD] text-[#123D2A] flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#123D2A]">For Corporate Buyers</h3>
              <p className="text-xs text-[#69746D] leading-relaxed">
                Access pre-vetted project documentation, compare vintages and standards, build customized bundles, and negotiate tranches through dedicated channel brokers.
              </p>
              <ul className="text-xs text-[#202923] space-y-1.5 pt-2">
                <li>· Post bespoke purchase requirements</li>
                <li>· Monitor bilateral negotiations & quotes</li>
                <li>· Export full audit trail for ESG auditors</li>
              </ul>
            </div>
            <div className="pt-6">
              <button
                onClick={() => navigate('/for-buyers')}
                className="text-xs font-semibold text-[#218653] hover:text-[#123D2A] flex items-center gap-1"
              >
                <span>Learn about buyer tools</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* For Suppliers & Developers */}
          <div className="bg-white p-6 rounded-xl border border-[#DDEBDD] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-[#DDEBDD] text-[#123D2A] flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#123D2A]">For Project Developers</h3>
              <p className="text-xs text-[#69746D] leading-relaxed">
                List high-quality credits directly to qualified institutional buyers without opaque intermediary margins or premature inventory retirement pledges.
              </p>
              <ul className="text-xs text-[#202923] space-y-1.5 pt-2">
                <li>· Multi-step listing submission & document audit</li>
                <li>· Retain full control over minimum order sizes</li>
                <li>· Receive qualified buyer inquiries directly</li>
              </ul>
            </div>
            <div className="pt-6">
              <button
                onClick={() => navigate('/for-sellers')}
                className="text-xs font-semibold text-[#218653] hover:text-[#123D2A] flex items-center gap-1"
              >
                <span>List your project credits</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* For Channel Partners & Brokers */}
          <div className="bg-white p-6 rounded-xl border border-[#DDEBDD] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-[#DDEBDD] text-[#123D2A] flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#123D2A]">For Channel Partners</h3>
              <p className="text-xs text-[#69746D] leading-relaxed">
                Coordinate complex deal workflows, review evidence, match buyer specifications, record transparent commercial terms, and track platform commissions.
              </p>
              <ul className="text-xs text-[#202923] space-y-1.5 pt-2">
                <li>· 11-stage pipeline management console</li>
                <li>· Automated commission ledger & math</li>
                <li>· Private broker notes & counter-offers</li>
              </ul>
            </div>
            <div className="pt-6">
              <button
                onClick={() => navigate('/how-it-works')}
                className="text-xs font-semibold text-[#218653] hover:text-[#123D2A] flex items-center gap-1"
              >
                <span>Channel model breakdown</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: HOW CARBONBRIDGE WORKS (Visual Diagram) */}
      <section className="bg-[#123D2A] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-semibold text-[#DDEBDD] uppercase tracking-wider">
              Intermediary Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold">
              The CarbonBridge Channel Desk
            </h2>
            <p className="text-xs text-[#DDEBDD]/80">
              How we connect suppliers, bundles, and buyers while maintaining absolute provenance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Box 1 */}
            <div className="bg-[#1B4D36] p-6 rounded-xl border border-[#218653]/40 space-y-2 text-center">
              <span className="text-xs font-mono uppercase tracking-wider text-[#DDEBDD]">SUPPLIERS & DEVELOPERS</span>
              <h3 className="text-base font-bold">Originators & Registry Holders</h3>
              <p className="text-xs text-[#DDEBDD]/80">
                Deposit project verification documentation, specify available tranches, and set minimum reservation thresholds.
              </p>
            </div>

            {/* Box 2 (Center Intermediary) */}
            <div className="bg-white text-[#123D2A] p-6 rounded-xl shadow-2xl border-2 border-[#218653] space-y-2 text-center relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#218653] text-white px-3 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                CORE PLATFORM
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#218653] font-semibold">CARBONBRIDGE DESK</span>
              <h3 className="text-base font-bold">Discovery, Bundling & Facilitation</h3>
              <p className="text-xs text-[#69746D]">
                Independent listing audit, compatible bundle assembly, buyer matching, broker quote facilitation, and commission records.
              </p>
            </div>

            {/* Box 3 */}
            <div className="bg-[#1B4D36] p-6 rounded-xl border border-[#218653]/40 space-y-2 text-center">
              <span className="text-xs font-mono uppercase tracking-wider text-[#DDEBDD]">CORPORATE BUYERS</span>
              <h3 className="text-base font-bold">Procurement & ESG Teams</h3>
              <p className="text-xs text-[#DDEBDD]/80">
                Evaluate structured bundles, submit quote parameters, verify evidence files, and receive registry serial retirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: TRUST AND TRANSPARENCY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F7F8F4] p-8 sm:p-12 rounded-2xl border border-[#DDEBDD] space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-semibold text-[#218653] uppercase tracking-wider">
              Governance & Truth in Advertising
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#123D2A]">
              Rigorous Documentation, No Fabricated Claims
            </h2>
            <p className="text-sm text-[#69746D] leading-relaxed">
              Integrity in the carbon markets requires radical honesty. CarbonBridge enforces strict disclosure boundaries to ensure buyers and suppliers interact with total clarity:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            <div className="bg-white p-4 rounded-xl border border-[#DDEBDD] space-y-1.5">
              <h4 className="text-xs font-bold text-[#123D2A]">Explicit Status Labeling</h4>
              <p className="text-xs text-[#69746D]">
                We distinguish between Project Listings, Issued Credits, Forward Contracts, and Retired Serials. No generic badges.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#DDEBDD] space-y-1.5">
              <h4 className="text-xs font-bold text-[#123D2A]">Document Verification</h4>
              <p className="text-xs text-[#69746D]">
                All listings require verified PDDs, monitoring audits, and third-party validation statements prior to public display.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#DDEBDD] space-y-1.5">
              <h4 className="text-xs font-bold text-[#123D2A]">No Double-Counting</h4>
              <p className="text-xs text-[#69746D]">
                Allocated quantities in bundles are clamped against actual free inventory to prevent overlapping commercial commitments.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#DDEBDD] space-y-1.5">
              <h4 className="text-xs font-bold text-[#123D2A]">Clear Registry Provenance</h4>
              <p className="text-xs text-[#69746D]">
                Credits are delivered via official accounts at Verra, Gold Standard, Puro.earth, or ACR. No proprietary closed tokens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#123D2A] text-white p-8 sm:p-14 rounded-2xl text-center space-y-6 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Find the Right Carbon-Credit Opportunities for Your Needs
            </h2>
            <p className="text-sm text-[#DDEBDD]/80 leading-relaxed">
              Explore live verified listings, configure customized project bundles, or speak with a CarbonBridge channel specialist today.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/marketplace')}
              className="px-6 py-3 text-xs font-semibold text-[#123D2A] bg-white hover:bg-[#DDEBDD] rounded-xl transition-all shadow-md"
            >
              Explore the Marketplace
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-6 py-3 text-xs font-semibold text-white bg-[#218653] hover:bg-[#299E64] rounded-xl transition-all"
            >
              Contact Channel Desk
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 9: FAQ PREVIEW */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-semibold text-[#218653] uppercase tracking-wider">
            Common Inquiries
          </span>
          <h2 className="text-2xl font-bold text-[#123D2A]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx}
                className="bg-white rounded-xl border border-[#DDEBDD] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-sm text-[#123D2A]"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[#218653] shrink-0" /> : <ChevronDown className="w-4 h-4 text-[#69746D] shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-[#69746D] leading-relaxed border-t border-[#DDEBDD]/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/faq')}
            className="text-xs font-semibold text-[#218653] hover:underline"
          >
            Read all market and registry FAQs &rarr;
          </button>
        </div>
      </section>

    </div>
  );
};
