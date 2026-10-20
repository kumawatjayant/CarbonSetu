import React from 'react';
import { useApp } from '../../context/AppContext';
import { DemoBadge } from '../../components/common/DemoBadge';
import { 
  Users, 
  Layers, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  FileText,
  TrendingUp,
  BarChart3,
  Scale
} from 'lucide-react';

interface AdminDashboardProps {
  navigate: (route: string) => void;
  onSelectListing: (listingId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  navigate,
  onSelectListing 
}) => {
  const { users, listings, bundles, deals, commissions, auditLogs } = useApp();

  const buyerCount = users.filter(u => u.role === 'buyer').length;
  const sellerCount = users.filter(u => u.role === 'seller').length;

  const approvedListings = listings.filter(l => l.listingStatus === 'approved');
  const pendingListings = listings.filter(l => l.listingStatus === 'under_review' || l.listingStatus === 'submitted');

  const activeDeals = deals.filter(d => d.stage !== 'Completed' && d.stage !== 'Cancelled');
  const completedDeals = deals.filter(d => d.stage === 'Completed');

  const totalCommissionsEarned = commissions.reduce((sum, c) => sum + (c.status === 'paid' ? c.netCommissionDue : 0), 0);
  const totalCommissionsPending = commissions.reduce((sum, c) => sum + (c.status === 'unpaid' ? c.netCommissionDue : 0), 0);

  // Category breakdown for data visualization
  const categoryCounts = listings.reduce<{ [cat: string]: number }>((acc, l) => {
    acc[l.projectCategory] = (acc[l.projectCategory] || 0) + 1;
    return acc;
  }, {});

  // Deal Pipeline stage counts
  const stageCounts = deals.reduce<{ [stage: string]: number }>((acc, d) => {
    acc[d.stage] = (acc[d.stage] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#DDEBDD] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#69746D]">
            <span className="font-semibold text-[#218653]">PLATFORM ADMINISTRATOR & CHANNEL PARTNER DESK</span>
            <span aria-hidden="true">·</span>
            <span>Governance Operations</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#123D2A] mt-1">
            CarbonBridge Platform Operations Console
          </h1>
          <p className="text-xs text-[#69746D] mt-0.5">
            Audit project evidence, oversee multi-asset bundling, supervise bilateral deal pipeline, and reconcile facilitation commissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/admin/listings')}
            className="px-3.5 py-2 text-xs font-semibold text-[#123D2A] bg-[#F7F8F4] border border-[#DDEBDD] rounded-lg hover:bg-[#DDEBDD]/50 transition-colors"
          >
            Review Pending Listings ({pendingListings.length})
          </button>
          <button
            onClick={() => navigate('/admin/deals')}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#123D2A] hover:bg-[#1B4D36] rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>Deal Pipeline Desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <DemoBadge variant="inline" />

      {/* Operational KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#DDEBDD]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#69746D] block">
            Registered Users
          </span>
          <span className="text-2xl font-extrabold text-[#123D2A] font-mono tabular-nums">
            {users.length}
          </span>
          <span className="text-[11px] text-[#69746D] block mt-1">
            {buyerCount} Buyers · {sellerCount} Sellers
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#DDEBDD]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#69746D] block">
            Approved Listings
          </span>
          <span className="text-2xl font-extrabold text-[#218653] font-mono tabular-nums">
            {approvedListings.length}
          </span>
          <span className="text-[11px] text-[#69746D] block mt-1">
            {pendingListings.length} awaiting audit
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#DDEBDD]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#69746D] block">
            Active Bundles
          </span>
          <span className="text-2xl font-extrabold text-[#123D2A] font-mono tabular-nums">
            {bundles.length}
          </span>
          <span className="text-[11px] text-[#69746D] block mt-1">
            Weighted portfolio mixes
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#DDEBDD]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#69746D] block">
            Deals in Negotiation
          </span>
          <span className="text-2xl font-extrabold text-[#D99A32] font-mono tabular-nums">
            {activeDeals.length}
          </span>
          <span className="text-[11px] text-[#69746D] block mt-1">
            {completedDeals.length} completed
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#DDEBDD]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#69746D] block">
            Commissions Collected
          </span>
          <span className="text-2xl font-extrabold text-[#218653] font-mono tabular-nums">
            ${totalCommissionsEarned.toLocaleString()}
          </span>
          <span className="text-[11px] text-[#69746D] block mt-1 font-mono">
            ${totalCommissionsPending.toLocaleString()} pending
          </span>
        </div>
      </div>

      {/* Operational Charts & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Category Distribution & Deal Pipeline */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Category Distribution Chart/Bar Container */}
          <div className="bg-white p-6 rounded-2xl border border-[#DDEBDD] space-y-4">
            <div className="flex items-center justify-between border-b border-[#DDEBDD] pb-3">
              <h3 className="text-sm font-bold text-[#123D2A]">
                Inventory by Project Category
              </h3>
              <span className="text-xs font-mono text-[#69746D]">
                Total: {listings.length} Projects
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {Object.entries(categoryCounts).map(([cat, count]) => {
                const percentage = Math.round((count / listings.length) * 100);
                return (
                  <div key={cat} className="space-y-1 text-xs">
                    <div className="flex justify-between text-[#202923]">
                      <span className="font-medium truncate mr-2">{cat}</span>
                      <span className="font-mono text-[#69746D] tabular-nums shrink-0">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#F7F8F4] h-2 rounded-full overflow-hidden border border-[#DDEBDD]/60">
                      <div 
                        className="bg-[#218653] h-full rounded-full transition-all" 
                        style={{ width: `${percentage}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Deal Pipeline Status Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-[#DDEBDD] space-y-4">
            <div className="flex items-center justify-between border-b border-[#DDEBDD] pb-3">
              <h3 className="text-sm font-bold text-[#123D2A]">
                Deal Pipeline Breakdown ({deals.length} Total)
              </h3>
              <button
                onClick={() => navigate('/admin/deals')}
                className="text-xs font-semibold text-[#218653] hover:underline"
              >
                Open Deal Pipeline &rarr;
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {['New Inquiry', 'Seller Matched', 'Negotiation', 'Completed'].map((stage) => {
                const count = stageCounts[stage] || 0;
                return (
                  <div key={stage} className="bg-[#F7F8F4] p-3 rounded-lg border border-[#DDEBDD]">
                    <span className="text-[10px] text-[#69746D] block">{stage}</span>
                    <span className="text-lg font-bold text-[#123D2A] font-mono tabular-nums">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Platform Audit Log Feed */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#DDEBDD] space-y-4">
          <div className="flex items-center justify-between border-b border-[#DDEBDD] pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#218653]" />
              <h3 className="text-sm font-bold text-[#123D2A]">
                Platform Audit Log Trail
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#69746D]">IMMUTABLE LOGS</span>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto divide-y divide-[#DDEBDD]/50">
            {auditLogs.map(log => (
              <div key={log.id} className="pt-3 first:pt-0 text-xs space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="font-bold text-[#218653]">{log.action}</span>
                  <span className="text-[#69746D]">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[#202923] leading-relaxed text-[11px]">
                  {log.changeSummary}
                </p>
                <div className="text-[10px] text-[#69746D] flex gap-2">
                  <span>Actor: {log.actorName}</span>
                  <span>·</span>
                  <span className="uppercase">{log.actorRole}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
