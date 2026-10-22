import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectArtwork } from '../../components/common/ProjectArtwork';
import { DemoBadge } from '../../components/common/DemoBadge';
import { QuoteModal } from '../../components/marketplace/QuoteModal';
import { PaymentModal } from '../../components/payment/PaymentModal';
import { PaymentReceiptModal } from '../../components/payment/PaymentReceiptModal';
import { PaymentRecord } from '../../types';
import { 
  ArrowLeft, 
  Bookmark, 
  ShieldCheck, 
  FileText, 
  Download, 
  MapPin, 
  Building2, 
  Calendar, 
  AlertCircle,
  ExternalLink,
  Lock,
  Layers,
  Flag,
  CreditCard,
  Sparkles
} from 'lucide-react';

interface ListingDetailPageProps {
  listingId: string;
  navigate: (route: string) => void;
}

export const ListingDetailPage: React.FC<ListingDetailPageProps> = ({ 
  listingId, 
  navigate 
}) => {
  const { listings, savedListingIds, toggleSaveListing, showToast, currentUser } = useApp();
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [completedPayment, setCompletedPayment] = useState<PaymentRecord | null>(null);
  const [trancheQuantity, setTrancheQuantity] = useState<number>(1000);

  const listing = listings.find(l => l.id === listingId);

  if (!listing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#123D2A]">Listing Not Found</h2>
        <p className="text-xs text-[#69746D]">
          The requested project listing could not be found or may have been archived.
        </p>
        <button
          onClick={() => navigate('/marketplace')}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#123D2A] rounded-lg"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  const isSaved = savedListingIds.includes(listing.id);

  const handleDownloadDoc = (docTitle: string) => {
    if (!currentUser) {
      showToast('Please sign in or select a demo account to access verified audit documents.', 'info');
      return;
    }
    showToast(`Access granted: Downloading ${docTitle} (Verified Registry Copy)`, 'success');
  };

  const handleReport = () => {
    showToast('Listing flagged for intermediary audit team review.', 'info');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top back navigation and save button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/marketplace')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#69746D] hover:text-[#123D2A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReport}
            className="px-3 py-1.5 text-xs text-[#69746D] hover:text-[#C94C4C] rounded border border-[#DDEBDD] bg-white transition-colors flex items-center gap-1"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Report or Request Clarification</span>
          </button>

          <button
            type="button"
            onClick={() => toggleSaveListing(listing.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded border transition-colors flex items-center gap-1.5 ${
              isSaved
                ? 'bg-[#123D2A] text-white border-[#123D2A]'
                : 'bg-white text-[#123D2A] border-[#DDEBDD] hover:bg-[#F7F8F4]'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
            <span>{isSaved ? 'Saved to Watchlist' : 'Save Opportunity'}</span>
          </button>
        </div>
      </div>

      {listing.demoRecord && (
        <DemoBadge variant="inline" />
      )}

      {/* Hero Split Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Artwork & Metadata */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl overflow-hidden border border-[#DDEBDD] shadow-xs">
            <ProjectArtwork category={listing.projectCategory} height="h-64 sm:h-80" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-[#69746D] flex-wrap">
              <span className="font-semibold text-[#123D2A]">{listing.projectCategory}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#218653]" />
                {listing.country}, {listing.region}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-[#218653]">ID: {listing.projectIdentifier || 'Pending'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2A] leading-tight">
              {listing.projectName}
            </h1>

            <p className="text-sm text-[#69746D] leading-relaxed">
              {listing.description}
            </p>
          </div>
        </div>

        {/* Right Procurement Action Card */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#DDEBDD] shadow-md space-y-6">
          <div className="border-b border-[#DDEBDD] pb-4 space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#69746D] block">
              Commercial Overview
            </span>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-bold text-[#218653] font-mono tabular-nums">
                  {listing.indicativeUnitPrice ? `$${listing.indicativeUnitPrice.toFixed(2)}` : 'Bespoke Quote'}
                </span>
                {listing.indicativeUnitPrice && (
                  <span className="text-xs text-[#69746D] ml-1">/ {listing.quantityUnit}</span>
                )}
              </div>
              <span className="text-xs font-semibold text-[#123D2A] bg-[#DDEBDD]/50 px-2 py-1 rounded">
                {listing.issuanceStatus}
              </span>
            </div>
            <p className="text-[11px] text-[#69746D]">
              Indicative pricing. Actual settlement price determined via bilateral channel agreement.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#F7F8F4] p-3 rounded-lg border border-[#DDEBDD]/60">
              <span className="text-[10px] text-[#69746D] block">Available Volume</span>
              <span className="text-sm font-bold text-[#123D2A] tabular-nums">
                {listing.quantityAvailable.toLocaleString()} {listing.quantityUnit}
              </span>
            </div>

            <div className="bg-[#F7F8F4] p-3 rounded-lg border border-[#DDEBDD]/60">
              <span className="text-[10px] text-[#69746D] block">Min Order Size</span>
              <span className="text-sm font-bold text-[#123D2A] tabular-nums">
                {listing.minimumQuantity.toLocaleString()} {listing.quantityUnit}
              </span>
            </div>

            <div className="bg-[#F7F8F4] p-3 rounded-lg border border-[#DDEBDD]/60">
              <span className="text-[10px] text-[#69746D] block">Vintage Range</span>
              <span className="text-sm font-bold text-[#123D2A]">
                {listing.vintageStart} – {listing.vintageEnd}
              </span>
            </div>

            <div className="bg-[#F7F8F4] p-3 rounded-lg border border-[#DDEBDD]/60">
              <span className="text-[10px] text-[#69746D] block">Standard</span>
              <span className="text-sm font-bold text-[#123D2A] truncate block">
                {listing.registryOrStandard}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <div className="bg-[#F7F8F4] p-3 rounded-xl border border-[#DDEBDD] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#123D2A] flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-[#218653]" />
                  <span>Instant Escrow Tranche (Demo)</span>
                </span>
                <span className="text-[10px] text-[#218653] font-semibold bg-[#DDEBDD] px-1.5 py-0.5 rounded">
                  Instant Lock
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {[listing.minimumQuantity || 500, 1000, 2500].map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setTrancheQuantity(qty)}
                    className={`py-1 px-2 rounded-lg text-xs font-mono font-semibold border transition-all cursor-pointer ${
                      trancheQuantity === qty
                        ? 'bg-[#123D2A] text-white border-[#123D2A]'
                        : 'bg-white text-[#123D2A] border-[#DDEBDD] hover:bg-[#DDEBDD]/50'
                    }`}
                  >
                    {qty.toLocaleString()} t
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setPaymentModalOpen(true)}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#218653] hover:bg-[#1B4D36] rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>
                  Instant Buy {trancheQuantity.toLocaleString()} {listing.quantityUnit} & Settle (${((trancheQuantity * (listing.indicativeUnitPrice || 12.50)) + 500).toLocaleString()})
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setQuoteModalOpen(true)}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#123D2A] hover:bg-[#1B4D36] rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Request Bespoke Quote via Broker</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/contact')}
              className="w-full py-2 px-4 text-xs font-semibold text-[#123D2A] bg-white hover:bg-[#DDEBDD] rounded-xl border border-[#DDEBDD] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Contact Channel Desk Specialist</span>
            </button>
          </div>

          <div className="text-[11px] text-[#69746D] space-y-1 pt-2 border-t border-[#DDEBDD]">
            <div className="flex items-center gap-1.5 text-[#123D2A] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#218653]" />
              <span>Broker Facilitation Guard</span>
            </div>
            <p className="leading-snug">
              Inquiries are coordinated through CarbonBridge channel brokers. No direct contact details are shared without bilateral mutual authorization.
            </p>
          </div>
        </div>

      </div>

      {/* Detailed Technical Specifications & Evidence Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        
        {/* Left: Detailed Specs & Verification Evidence */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Section: Methodology & Registry Attributes */}
          <div className="bg-white p-6 rounded-2xl border border-[#DDEBDD] space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#123D2A]">
              Carbon Accounting & Methodology
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#69746D] block">Registry / Standard</span>
                <span className="font-semibold text-[#123D2A]">{listing.registryOrStandard}</span>
              </div>

              <div>
                <span className="text-[#69746D] block">Methodology Protocol</span>
                <span className="font-semibold text-[#123D2A]">{listing.methodology || 'Under Review'}</span>
              </div>

              <div>
                <span className="text-[#69746D] block">Verification Status</span>
                <span className="font-semibold text-[#218653] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {listing.verificationStatus}
                </span>
              </div>

              <div>
                <span className="text-[#69746D] block">Project Developer</span>
                <span className="font-semibold text-[#123D2A]">{listing.projectDeveloper}</span>
              </div>
            </div>

            {listing.verificationEvidenceSummary && (
              <div className="mt-4 p-3.5 bg-[#F7F8F4] rounded-lg border border-[#DDEBDD] text-xs space-y-1">
                <span className="font-bold text-[#123D2A] block">Third-Party Audit Summary:</span>
                <p className="text-[#69746D] leading-relaxed">
                  {listing.verificationEvidenceSummary}
                </p>
              </div>
            )}
          </div>

          {/* Section: Supporting Documentation & Evidence Downloads */}
          <div className="bg-white p-6 rounded-2xl border border-[#DDEBDD] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#123D2A]">
                Supporting Due Diligence Documents
              </h3>
              <span className="text-xs text-[#69746D]">
                {listing.supportingDocuments.length} Verified Files
              </span>
            </div>

            <div className="space-y-2">
              {listing.supportingDocuments.map((doc) => (
                <div 
                  key={doc.id}
                  className="bg-[#F7F8F4] p-3 rounded-lg border border-[#DDEBDD] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-[#218653] shrink-0" />
                    <div>
                      <div className="font-semibold text-[#123D2A]">{doc.title}</div>
                      <div className="text-[11px] text-[#69746D]">
                        {doc.documentType} · <span className="font-mono">{doc.fileName}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownloadDoc(doc.title)}
                    className="px-3 py-1.5 text-[11px] font-semibold text-[#123D2A] bg-white hover:bg-[#DDEBDD]/50 border border-[#DDEBDD] rounded transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>

            {!currentUser && (
              <p className="text-[11px] text-[#69746D] flex items-center gap-1.5 pt-1">
                <Lock className="w-3.5 h-3.5 text-[#D99A32]" />
                <span>Unauthenticated visitors can view metadata; log in with a demo account to simulate document retrieval.</span>
              </p>
            )}
          </div>

          {/* Section: Conditions & Limitations */}
          {listing.limitationsOrConditions && (
            <div className="bg-white p-6 rounded-2xl border border-[#DDEBDD] space-y-2 text-xs">
              <h3 className="font-bold uppercase tracking-wider text-[#123D2A]">
                Commercial Limitations & Delivery Conditions
              </h3>
              <p className="text-[#69746D] leading-relaxed">
                {listing.limitationsOrConditions}
              </p>
            </div>
          )}

        </div>

        {/* Right Sidebar: Governance & Channel Workflow */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#F7F8F4] p-5 rounded-2xl border border-[#DDEBDD] space-y-4 text-xs">
            <h4 className="font-bold text-[#123D2A] uppercase tracking-wider text-[11px]">
              Procurement & Delivery Protocol
            </h4>

            <div className="space-y-3 text-[#69746D]">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-[#123D2A] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  1
                </div>
                <p>Submit formal tranche request with desired volume & delivery window.</p>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-[#123D2A] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  2
                </div>
                <p>CarbonBridge confirms registry sub-account availability with project developer.</p>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-[#123D2A] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  3
                </div>
                <p>Bilateral sales agreement executed with escrow settlement and serial retirement certificates.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#DDEBDD] space-y-3 text-xs">
            <h4 className="font-bold text-[#123D2A]">Explore Bundles With This Project</h4>
            <p className="text-[#69746D] leading-relaxed">
              This project is eligible for multi-asset portfolio bundling to balance vintage mix and geographic presence.
            </p>
            <button
              onClick={() => navigate('/bundles')}
              className="w-full py-2 text-xs font-semibold text-center text-[#218653] hover:underline"
            >
              Browse Active Bundles &rarr;
            </button>
          </div>
        </div>

      </div>

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        listing={listing}
      />

      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        itemTitle={listing.projectName}
        quantity={trancheQuantity}
        quantityUnit={listing.quantityUnit}
        unitPrice={listing.indicativeUnitPrice || 12.50}
        totalAmount={trancheQuantity * (listing.indicativeUnitPrice || 12.50)}
        onPaymentSuccess={(payment) => {
          setCompletedPayment(payment);
        }}
        onViewReceipt={(payment) => {
          setCompletedPayment(payment);
          setReceiptModalOpen(true);
        }}
      />

      <PaymentReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        payment={completedPayment}
      />
    </div>
  );
};
