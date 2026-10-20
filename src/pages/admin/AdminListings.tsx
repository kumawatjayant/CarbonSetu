import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DemoBadge } from '../../components/common/DemoBadge';
import { CreditListing, ListingStatus } from '../../types';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  ShieldCheck, 
  Search, 
  ArrowUpRight,
  Eye
} from 'lucide-react';

interface AdminListingsProps {
  navigate: (route: string) => void;
  onSelectListing: (listingId: string) => void;
}

export const AdminListings: React.FC<AdminListingsProps> = ({ 
  navigate,
  onSelectListing 
}) => {
  const { listings, updateListingStatus, showToast } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedListing, setSelectedListing] = useState<CreditListing | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionModal, setActionModal] = useState<'approve' | 'reject' | 'changes' | null>(null);

  const filtered = listings.filter(l => {
    if (filterStatus !== 'all' && l.listingStatus !== filterStatus) return false;
    return true;
  });

  const handleApprove = (listingId: string) => {
    updateListingStatus(listingId, 'approved', 'Listing approved by administrator following verification of third-party audit documentation.');
    setActionModal(null);
    setSelectedListing(null);
  };

  const handleReject = (listingId: string) => {
    if (!rejectionReason.trim()) {
      showToast('Please provide a specific reason for rejection.', 'warning');
      return;
    }
    updateListingStatus(listingId, 'rejected', rejectionReason.trim());
    setActionModal(null);
    setSelectedListing(null);
    setRejectionReason('');
  };

  const handleRequestChanges = (listingId: string) => {
    if (!rejectionReason.trim()) {
      showToast('Please specify the corrections required.', 'warning');
      return;
    }
    updateListingStatus(listingId, 'changes_requested', rejectionReason.trim());
    setActionModal(null);
    setSelectedListing(null);
    setRejectionReason('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <DemoBadge variant="inline" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2A] tracking-tight mt-1">
            Listing Audit & Approval Desk
          </h1>
          <p className="text-xs text-[#69746D] mt-0.5">
            Review supplier submissions, inspect uploaded Project Design Documents and validation audits, and publish approved inventory.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          {['all', 'under_review', 'approved', 'changes_requested', 'rejected'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                filterStatus === st ? 'bg-[#123D2A] text-white shadow-xs' : 'text-[#69746D] bg-white border border-[#DDEBDD]'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-[#DDEBDD] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#DDEBDD] text-[#69746D] font-mono text-[11px] uppercase bg-[#F7F8F4]">
                <th className="py-3 px-4">Project & Category</th>
                <th className="py-3 px-4">Developer</th>
                <th className="py-3 px-4">Standard & Vintage</th>
                <th className="py-3 px-4 text-right">Volume (tCO2e)</th>
                <th className="py-3 px-4 text-right">Price</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDEBDD]/60">
              {filtered.map(l => (
                <tr key={l.id} className="hover:bg-[#F7F8F4]/80 transition-colors">
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-bold text-[#123D2A] truncate">{l.projectName}</div>
                    <div className="text-[11px] text-[#69746D]">{l.country} · {l.projectCategory}</div>
                  </td>
                  <td className="py-3.5 px-4 text-[#202923] whitespace-nowrap">
                    {l.sellerDisplayName}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#69746D] whitespace-nowrap">
                    {l.registryOrStandard} ({l.vintageStart}-{l.vintageEnd})
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#123D2A] tabular-nums whitespace-nowrap">
                    {l.quantityAvailable.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-medium text-[#218653] tabular-nums whitespace-nowrap">
                    {l.indicativeUnitPrice ? `$${l.indicativeUnitPrice}/t` : 'Quote only'}
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      l.listingStatus === 'approved'
                        ? 'bg-[#DDEBDD] text-[#218653]'
                        : l.listingStatus === 'under_review'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-50 text-[#C94C4C]'
                    }`}>
                      {l.listingStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onSelectListing(l.id)}
                        className="p-1.5 text-[#69746D] hover:text-[#123D2A] rounded border border-[#DDEBDD] hover:bg-white"
                        title="View Public Page"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {l.listingStatus !== 'approved' && (
                        <button
                          onClick={() => {
                            setSelectedListing(l);
                            setActionModal('approve');
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold text-white bg-[#218653] hover:bg-[#1B4D36] rounded"
                        >
                          Approve
                        </button>
                      )}

                      {l.listingStatus !== 'rejected' && (
                        <button
                          onClick={() => {
                            setSelectedListing(l);
                            setActionModal('reject');
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold text-[#C94C4C] border border-[#C94C4C]/40 hover:bg-red-50 rounded"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action / Review Modal */}
      {actionModal && selectedListing && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#123D2A]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-[#DDEBDD] shadow-xl p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-[#123D2A]">
              {actionModal === 'approve' ? 'Approve Project Listing' : 'Reject Listing / Request Corrections'}
            </h3>

            <div className="bg-[#F7F8F4] p-3 rounded-lg border border-[#DDEBDD] space-y-1">
              <div className="font-bold text-[#123D2A]">{selectedListing.projectName}</div>
              <div className="text-[11px] text-[#69746D]">
                Supplier: {selectedListing.sellerDisplayName} · {selectedListing.registryOrStandard} · {selectedListing.quantityAvailable.toLocaleString()} tCO2e
              </div>
            </div>

            {actionModal === 'approve' ? (
              <p className="text-[#69746D] leading-relaxed">
                Confirming approval will index this project into the public CarbonBridge marketplace. Verified documentation will become downloadable by registered corporate buyers.
              </p>
            ) : (
              <div>
                <label className="block font-semibold text-[#123D2A] mb-1">
                  Reason for Rejection or Corrections Needed *
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Detail missing documentation, unverifiable registry references, or inconsistent volume claims..."
                  className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653]"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-[#DDEBDD]">
              <button
                type="button"
                onClick={() => { setActionModal(null); setSelectedListing(null); }}
                className="px-4 py-2 font-medium text-[#69746D]"
              >
                Cancel
              </button>
              {actionModal === 'approve' ? (
                <button
                  type="button"
                  onClick={() => handleApprove(selectedListing.id)}
                  className="px-4 py-2 font-semibold text-white bg-[#218653] hover:bg-[#1B4D36] rounded-lg"
                >
                  Confirm & Publish
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleReject(selectedListing.id)}
                  className="px-4 py-2 font-semibold text-white bg-[#C94C4C] hover:bg-red-800 rounded-lg"
                >
                  Submit Rejection
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
