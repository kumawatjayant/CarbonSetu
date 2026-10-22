import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DemoBadge } from '../../components/common/DemoBadge';
import { PaymentReceiptModal } from '../../components/payment/PaymentReceiptModal';
import { PaymentRecord } from '../../types';
import { 
  Building2, 
  Layers, 
  Bookmark, 
  FileText, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles,
  Plus,
  Scale,
  CreditCard,
  BadgeCheck,
  Lock
} from 'lucide-react';

interface BuyerDashboardProps {
  navigate: (route: string) => void;
  onSelectListing: (listingId: string) => void;
  onSelectBundle: (bundleId: string) => void;
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ 
  navigate,
  onSelectListing,
  onSelectBundle 
}) => {
  const { currentUser, deals, listings, bundles, savedListingIds, savedBundleIds, requirements, payments } = useApp();
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  const userDeals = deals.filter(d => currentUser && (d.buyerId === currentUser.id || d.buyerCompany === currentUser.companyName));
  const activeInquiries = userDeals.filter(d => d.stage !== 'Completed' && d.stage !== 'Cancelled');
  const completedDeals = userDeals.filter(d => d.stage === 'Completed');
  const userRequirements = requirements.filter(r => currentUser && r.buyerId === currentUser.id);
  const userPayments = payments.filter(p => !currentUser || p.payerCompany === currentUser.companyName || currentUser.role === 'buyer' || currentUser.role === 'admin');

  // Recommendations: match open requirements with listings
  const recommendedListings = listings.filter(l => l.listingStatus === 'approved').slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#DDEBDD] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#69746D]">
            <span className="font-semibold text-[#218653]">CORPORATE BUYER WORKSPACE</span>
            <span aria-hidden="true">·</span>
            <span>{currentUser?.companyName}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#123D2A] mt-1">
            Welcome back, {currentUser?.fullName || 'Procurement Executive'}
          </h1>
          <p className="text-xs text-[#69746D] mt-0.5">
            Monitor active quote inquiries, track broker negotiations, and manage your sustainability credit portfolio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/buyer/requirements')}
            className="px-3.5 py-2 text-xs font-semibold text-[#123D2A] bg-[#F7F8F4] border border-[#DDEBDD] rounded-lg hover:bg-[#DDEBDD]/50 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-[#218653]" />
            <span>Post Requirement</span>
          </button>
          <button
            onClick={() => navigate('/marketplace')}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#123D2A] hover:bg-[#1B4D36] rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>Browse Marketplace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <DemoBadge variant="inline" />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#DDEBDD]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#69746D] block">
            Active Inquiries & Deals
          </span>
          <span className="text-2xl font-extrabold text-[#123D2A] font-mono tabular-nums">
            {activeInquiries.length}
          </span>
          <span className="text-[11px] text-[#69746D] block mt-1">In broker pipeline</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#DDEBDD]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#69746D] block">
            Saved Opportunities
          </span>
          <span className="text-2xl font-extrabold text-[#123D2A] font-mono tabular-nums">
            {savedListingIds.length + savedBundleIds.length}
          </span>
          <span className="text-[11px] text-[#69746D] block mt-1">Listings & bundles</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#DDEBDD]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#69746D] block">
            Purchase Requirements
          </span>
          <span className="text-2xl font-extrabold text-[#123D2A] font-mono tabular-nums">
            {userRequirements.length}
          </span>
          <span className="text-[11px] text-[#69746D] block mt-1">Active targets</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#DDEBDD]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#69746D] block">
            Completed Transactions
          </span>
          <span className="text-2xl font-extrabold text-[#218653] font-mono tabular-nums">
            {completedDeals.length}
          </span>
          <span className="text-[11px] text-[#69746D] block mt-1">Registry verified</span>
        </div>
      </div>

      {/* Settled Escrow Payments & Registry Certificates */}
      {userPayments.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-[#DDEBDD] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#DDEBDD] pb-3">
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-[#218653]" />
              <div>
                <h2 className="text-base font-bold text-[#123D2A]">
                  Settled Escrow Payments & Verified Registry Certificates ({userPayments.length})
                </h2>
                <p className="text-xs text-[#69746D]">
                  Audited environmental unit holdings irrevocably funded into CarbonBridge Escrow Custody.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-semibold text-[#218653] bg-[#DDEBDD] px-2 py-0.5 rounded">
              Escrow Custody Protected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userPayments.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-xl border border-[#DDEBDD] bg-[#F7F8F4] hover:border-[#218653] transition-all space-y-3 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#69746D] block">
                      CERTIFICATE #{p.certificateNumber}
                    </span>
                    <h4 className="font-bold text-[#123D2A] text-sm mt-0.5 truncate max-w-[240px]">
                      {p.itemTitle}
                    </h4>
                  </div>
                  <span className="text-[10px] uppercase font-semibold font-mono text-[#218653] bg-white px-2 py-0.5 rounded border border-[#DDEBDD]">
                    {p.paymentMethod}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#69746D] bg-white p-2.5 rounded-lg border border-[#DDEBDD]/70">
                  <div>
                    <span>Volume Settled:</span>
                    <strong className="block text-[#123D2A] font-mono">{p.quantity.toLocaleString()} {p.quantityUnit}</strong>
                  </div>
                  <div>
                    <span>Amount Transacted:</span>
                    <strong className="block text-[#218653] font-mono">${p.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="text-[10px] text-[#69746D]">
                    Ref: <span className="font-mono text-[#123D2A]">{p.escrowReference}</span> · {new Date(p.timestamp).toLocaleDateString()}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedReceipt(p);
                      setReceiptModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#123D2A] hover:bg-[#1B4D36] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Certificate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Two Column View: Active Inquiries & Matching Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Active Inquiries & Quotes List */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#DDEBDD] space-y-5">
          <div className="flex items-center justify-between border-b border-[#DDEBDD] pb-3">
            <div>
              <h2 className="text-base font-bold text-[#123D2A]">
                Commercial Inquiries & Deal Pipeline
              </h2>
              <p className="text-xs text-[#69746D]">
                Facilitated by CarbonBridge Channel Desk
              </p>
            </div>
            <button
              onClick={() => navigate('/buyer/inquiries')}
              className="text-xs font-semibold text-[#218653] hover:underline flex items-center gap-1"
            >
              <span>View All Inquiries</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {userDeals.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#69746D] space-y-2">
              <p>You have no active inquiries yet.</p>
              <button
                onClick={() => navigate('/marketplace')}
                className="text-[#218653] font-semibold hover:underline"
              >
                Browse marketplace and request a quote &rarr;
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {userDeals.map((deal) => {
                const pendingQuote = deal.quotes.find(q => q.status === 'pending');
                return (
                  <div
                    key={deal.id}
                    onClick={() => navigate('/buyer/inquiries')}
                    className="p-4 rounded-xl border border-[#DDEBDD] hover:border-[#218653] transition-all bg-[#F7F8F4] cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-[#218653]">{deal.referenceNumber}</span>
                        <span aria-hidden="true" className="text-[#69746D]">·</span>
                        <span className="font-semibold text-[#123D2A]">{deal.stage}</span>
                      </div>
                      <h4 className="font-bold text-sm text-[#123D2A]">
                        {deal.listingName || deal.bundleName || 'Custom Portfolio Request'}
                      </h4>
                      <div className="text-[11px] text-[#69746D] flex items-center gap-2">
                        <span>Volume: {deal.requestedQuantity.toLocaleString()} {deal.quantityUnit}</span>
                        <span>·</span>
                        <span>Supplier: {deal.sellerCompany || 'Designated Supplier'}</span>
                        <span>·</span>
                        <span>Broker: {deal.assignedAdminName || 'Channel Desk'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {pendingQuote && (
                        <span className="px-2.5 py-1 text-[11px] font-semibold bg-[#218653] text-white rounded">
                          Quote Ready: ${pendingQuote.unitPrice}/t
                        </span>
                      )}
                      <button className="text-xs font-semibold text-[#218653] hover:underline">
                        Open Thread &rarr;
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Portfolio Matching Recommendations */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-[#DDEBDD] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#218653]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#123D2A]">
                  Recommended Opportunities
                </h3>
              </div>
              <span className="text-[10px] text-[#69746D]">Rule Match</span>
            </div>

            <p className="text-xs text-[#69746D] leading-relaxed">
              Based on your open purchase preferences for vintage 2023–2025 and audited registries:
            </p>

            <div className="space-y-3">
              {recommendedListings.map(l => (
                <div
                  key={l.id}
                  onClick={() => onSelectListing(l.id)}
                  className="p-3 rounded-lg border border-[#DDEBDD] bg-[#F7F8F4] hover:bg-[#DDEBDD]/30 transition-colors cursor-pointer text-xs space-y-1"
                >
                  <div className="font-bold text-[#123D2A] truncate">
                    {l.projectName}
                  </div>
                  <div className="text-[11px] text-[#69746D] flex items-center justify-between">
                    <span>{l.country} · {l.projectCategory}</span>
                    <span className="font-mono text-[#218653] font-semibold">
                      {l.indicativeUnitPrice ? `$${l.indicativeUnitPrice}/t` : 'Quote'}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#218653] font-medium pt-0.5">
                    Matches your Scope 1/2 criteria
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/buyer/requirements')}
              className="w-full py-2 text-xs font-semibold text-center text-[#123D2A] bg-[#F7F8F4] hover:bg-[#DDEBDD] rounded-lg border border-[#DDEBDD] transition-colors"
            >
              Manage Purchase Targets
            </button>
          </div>

          {/* Quick links to Saved Watchlist */}
          <div className="bg-white p-5 rounded-2xl border border-[#DDEBDD] space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#123D2A]">Saved Watchlist</span>
              <span className="font-mono text-[#218653] font-semibold">{savedListingIds.length} Listings</span>
            </div>
            <p className="text-[#69746D]">
              Quickly retrieve projects and bundles you have bookmarked for internal ESG committee review.
            </p>
            <button
              onClick={() => navigate('/buyer/saved')}
              className="text-[#218653] font-semibold hover:underline block pt-1"
            >
              Open Saved Watchlist &rarr;
            </button>
          </div>
        </div>

      </div>

      <PaymentReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        payment={selectedReceipt}
      />

    </div>
  );
};
