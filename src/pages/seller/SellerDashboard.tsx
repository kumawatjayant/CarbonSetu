import React from 'react';
import { useApp } from '../../context/AppContext';
import { DemoBadge } from '../../components/common/DemoBadge';
import { 
  Layers, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ArrowRight, 
  FileText,
  DollarSign,
  Building2,
  ChevronRight
} from 'lucide-react';

interface SellerDashboardProps {
  navigate: (route: string) => void;
  onSelectListing: (listingId: string) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ 
  navigate,
  onSelectListing 
}) => {
  const { currentUser, listings, deals } = useApp();

  const sellerListings = listings.filter(l => currentUser && (l.sellerId === currentUser.id || l.sellerDisplayName === currentUser.companyName));
  const approvedListings = sellerListings.filter(l => l.listingStatus === 'approved');
  const pendingReview = sellerListings.filter(l => l.listingStatus === 'under_review' || l.listingStatus === 'submitted');
  const changesRequested = sellerListings.filter(l => l.listingStatus === 'changes_requested');

  const sellerDeals = deals.filter(d => currentUser && (d.sellerId === currentUser.id || d.sellerCompany === currentUser.companyName));
  const activeInquiries = sellerDeals.filter(d => d.stage !== 'Completed' && d.stage !== 'Cancelled');
  const completedDeals = sellerDeals.filter(d => d.stage === 'Completed');

  const totalListedInventory = sellerListings.reduce((sum, l) => sum + l.quantityAvailable, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#DDEBDD] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#69746D]">
            <span className="font-semibold text-[#218653]">CARBON SUPPLIER & DEVELOPER DESK</span>
            <span aria-hidden="true">·</span>
            <span>{currentUser?.companyName}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#123D2A] mt-1">
            Supplier Operations: {currentUser?.fullName || 'Project Originator'}
          </h1>
          <p className="text-xs text-[#69746D] mt-0.5">
            Manage your project listings, respond to institutional buyer inquiries, and track registry deliveries.
          </p>
        </div>

        <button
          onClick={() => navigate('/seller/listings/new')}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-[#123D2A] hover:bg-[#1B4D36] rounded-xl transition-all shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 text-[#DDEBDD]" />
          <span>Submit New Listing</span>
        </button>
      </div>

      <DemoBadge variant="inline" />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#DDEBDD]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#69746D] block">
            Approved Active Listings
          </span>
          <span className="text-2xl font-extrabold text-[#218653] font-mono tabular-nums">
            {approvedListings.length}
          </span>
          <span className="text-[11px] text-[#69746D] block mt-1">Live in marketplace</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#DDEBDD]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#69746D] block">
            Listings Awaiting Review
          </span>
          <span className="text-2xl font-extrabold text-[#D99A32] font-mono tabular-nums">
            {pendingReview.length}
          </span>
          <span className="text-[11px] text-[#69746D] block mt-1">Audit team verification</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#DDEBDD]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#69746D] block">
            Buyer Inquiries
          </span>
          <span className="text-2xl font-extrabold text-[#123D2A] font-mono tabular-nums">
            {activeInquiries.length}
          </span>
          <span className="text-[11px] text-[#69746D] block mt-1">Open quote requests</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#DDEBDD]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#69746D] block">
            Total Inventory Volume
          </span>
          <span className="text-2xl font-extrabold text-[#123D2A] font-mono tabular-nums">
            {totalListedInventory.toLocaleString()}
          </span>
          <span className="text-[11px] text-[#69746D] block mt-1">tCO2e across projects</span>
        </div>
      </div>

      {/* Two Column Layout: My Listings & Buyer Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: My Project Listings */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#DDEBDD] space-y-4">
          <div className="flex items-center justify-between border-b border-[#DDEBDD] pb-3">
            <div>
              <h2 className="text-base font-bold text-[#123D2A]">
                My Credit Listings ({sellerListings.length})
              </h2>
              <p className="text-xs text-[#69746D]">
                Registry-connected project asset records
              </p>
            </div>
            <button
              onClick={() => navigate('/seller/listings')}
              className="text-xs font-semibold text-[#218653] hover:underline"
            >
              Manage All &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {sellerListings.map(l => (
              <div
                key={l.id}
                onClick={() => onSelectListing(l.id)}
                className="p-4 rounded-xl border border-[#DDEBDD] hover:border-[#218653] transition-colors bg-[#F7F8F4] cursor-pointer text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#123D2A] text-sm truncate mr-2">
                    {l.projectName}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    l.listingStatus === 'approved' 
                      ? 'bg-[#DDEBDD] text-[#218653]' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {l.listingStatus.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[#69746D] text-[11px]">
                  <span>{l.country}</span>
                  <span>·</span>
                  <span>{l.registryOrStandard}</span>
                  <span>·</span>
                  <span>Vintages {l.vintageStart}-{l.vintageEnd}</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#DDEBDD]/50 text-xs">
                  <div>
                    <span className="text-[#69746D]">Available: </span>
                    <strong className="text-[#123D2A] tabular-nums font-mono">
                      {l.quantityAvailable.toLocaleString()} {l.quantityUnit}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#69746D]">Indicative Price: </span>
                    <strong className="text-[#218653] tabular-nums font-mono">
                      {l.indicativeUnitPrice ? `$${l.indicativeUnitPrice}/t` : 'Quote only'}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Inbound Inquiries & Action Requests */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#DDEBDD] space-y-4">
            <div className="flex items-center justify-between border-b border-[#DDEBDD] pb-3">
              <h3 className="text-sm font-bold text-[#123D2A]">
                Inbound Inquiries ({sellerDeals.length})
              </h3>
              <button
                onClick={() => navigate('/seller/inquiries')}
                className="text-xs font-semibold text-[#218653] hover:underline"
              >
                Respond &rarr;
              </button>
            </div>

            {sellerDeals.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#69746D]">
                No active buyer inquiries at this time.
              </div>
            ) : (
              <div className="space-y-3">
                {sellerDeals.map(d => (
                  <div
                    key={d.id}
                    onClick={() => navigate('/seller/inquiries')}
                    className="p-3.5 rounded-lg border border-[#DDEBDD] bg-[#F7F8F4] hover:bg-[#DDEBDD]/30 transition-colors cursor-pointer text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[#218653] font-semibold">{d.referenceNumber}</span>
                      <span className="text-[10px] text-[#69746D]">{d.stage}</span>
                    </div>
                    <div className="font-bold text-[#123D2A]">
                      Buyer: {d.buyerCompany}
                    </div>
                    <div className="text-[11px] text-[#69746D]">
                      Requested: {d.requestedQuantity.toLocaleString()} {d.quantityUnit} for {d.intendedUse}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Listing Quality & Document Policy Notice */}
          <div className="bg-[#123D2A] text-white p-5 rounded-2xl space-y-2 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-[11px] text-[#DDEBDD]">
              Registry Holding Safeguards
            </h4>
            <p className="text-[#DDEBDD]/80 leading-relaxed text-[11px]">
              CarbonBridge verifies that your listed serials remain unencumbered. When updating available inventory, ensure serial certificates reflect registry balances to maintain high platform credibility.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
