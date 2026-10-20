import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DemoBadge } from '../../components/common/DemoBadge';
import { InquiryDeal, DealStage } from '../../types';
import { 
  Send, 
  Lock, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  DollarSign, 
  Search,
  Filter,
  Eye,
  AlertTriangle
} from 'lucide-react';

interface AdminInquiriesDealsProps {
  navigate: (route: string) => void;
}

export const AdminInquiriesDeals: React.FC<AdminInquiriesDealsProps> = ({ navigate }) => {
  const { deals, updateDealStage, addMessageToDeal, assignDealAdmin, users, showToast } = useApp();

  const [selectedDealId, setSelectedDealId] = useState<string>(deals[0]?.id || '');
  const [filterStage, setFilterStage] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Internal note input
  const [internalNoteText, setInternalNoteText] = useState('');
  
  // Public communication text
  const [publicMsgText, setPublicMsgText] = useState('');

  // Commercial terms form states
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [commercialStage, setCommercialStage] = useState<DealStage>('Completed');
  const [agreedQty, setAgreedQty] = useState<number>(10000);
  const [agreedPrice, setAgreedPrice] = useState<number>(12.50);
  const [commissionRate, setCommissionRate] = useState<number>(3.5);
  const [fixedFee, setFixedFee] = useState<number>(500);

  const selectedDeal = deals.find(d => d.id === selectedDealId);

  const stages: DealStage[] = [
    'New Inquiry',
    'Qualification',
    'Seller Matched',
    'Quote Requested',
    'Quote Submitted',
    'Negotiation',
    'Agreement Pending',
    'In Progress',
    'Completed',
    'Cancelled',
    'Disputed'
  ];

  const filteredDeals = deals.filter(d => {
    if (filterStage !== 'all' && d.stage !== filterStage) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!d.referenceNumber.toLowerCase().includes(q) && !d.buyerCompany.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const handleSendInternalNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!internalNoteText.trim() || !selectedDeal) return;
    addMessageToDeal(selectedDeal.id, internalNoteText.trim(), true);
    setInternalNoteText('');
  };

  const handleSendPublicMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicMsgText.trim() || !selectedDeal) return;
    addMessageToDeal(selectedDeal.id, publicMsgText.trim(), false);
    setPublicMsgText('');
  };

  const handleStageSelect = (newStage: DealStage) => {
    if (!selectedDeal) return;
    if (newStage === 'Completed') {
      setCommercialStage('Completed');
      setAgreedQty(selectedDeal.agreedQuantity || selectedDeal.requestedQuantity);
      setAgreedPrice(selectedDeal.agreedUnitPrice || 12.00);
      setIsTermsModalOpen(true);
    } else {
      updateDealStage(selectedDeal.id, newStage);
    }
  };

  const handleConfirmCommercials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeal) return;

    const totalVal = agreedQty * agreedPrice;
    updateDealStage(selectedDeal.id, commercialStage, {
      agreedQuantity: Number(agreedQty),
      agreedUnitPrice: Number(agreedPrice),
      agreedTotalValue: totalVal,
      agreedCommissionRate: Number(commissionRate),
      agreedFixedFee: Number(fixedFee),
      closureReason: 'Bilateral agreement closed & verified registry serial transfer confirmed.'
    });

    setIsTermsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <DemoBadge variant="inline" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2A] tracking-tight mt-1">
            Channel Desk Deal & Pipeline Console
          </h1>
          <p className="text-xs text-[#69746D] mt-0.5">
            11-stage intermediation workflow. Coordinate buyers and project originators, maintain private audit notes, and record agreed commercials.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Deals list & pipeline filter */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#DDEBDD] overflow-hidden space-y-3">
          <div className="p-4 border-b border-[#DDEBDD] bg-[#F7F8F4] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#123D2A]">Active Pipeline ({filteredDeals.length})</span>
              <span className="font-mono text-[#218653]">Broker Desk</span>
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search ref or buyer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs border border-[#DDEBDD] rounded-lg bg-white focus:outline-none"
              />
              <select
                value={filterStage}
                onChange={(e) => setFilterStage(e.target.value)}
                className="text-xs px-2 py-1.5 border border-[#DDEBDD] rounded-lg bg-white focus:outline-none"
              >
                <option value="all">All Stages</option>
                {stages.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="divide-y divide-[#DDEBDD]/60 max-h-[640px] overflow-y-auto px-1">
            {filteredDeals.map(d => {
              const isSelected = d.id === selectedDealId;
              return (
                <div
                  key={d.id}
                  onClick={() => setSelectedDealId(d.id)}
                  className={`p-3.5 rounded-xl cursor-pointer transition-colors text-xs space-y-1.5 my-1 ${
                    isSelected ? 'bg-[#DDEBDD]/40 border-l-4 border-l-[#123D2A]' : 'hover:bg-[#F7F8F4]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#218653]">{d.referenceNumber}</span>
                    <span className="text-[10px] uppercase font-semibold text-[#123D2A] bg-white px-2 py-0.5 rounded border border-[#DDEBDD]">
                      {d.stage}
                    </span>
                  </div>

                  <div className="font-bold text-[#123D2A]">
                    {d.buyerCompany} &rarr; {d.sellerCompany || 'Pending Match'}
                  </div>

                  <div className="text-[11px] text-[#69746D] flex items-center justify-between">
                    <span>{d.requestedQuantity.toLocaleString()} {d.quantityUnit}</span>
                    <span>Broker: {d.assignedAdminName || 'Unassigned'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Deal Workspace */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#DDEBDD] overflow-hidden">
          {selectedDeal ? (
            <div className="divide-y divide-[#DDEBDD]">
              
              {/* Deal Header and Stage Advancement */}
              <div className="p-6 bg-[#F7F8F4] space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-[#218653] text-sm">{selectedDeal.referenceNumber}</span>
                      <span aria-hidden="true" className="text-[#69746D]">·</span>
                      <span className="text-[#69746D]">{new Date(selectedDeal.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h2 className="text-lg font-bold text-[#123D2A] mt-1">
                      {selectedDeal.listingName || selectedDeal.bundleName || 'Carbon Portfolio'}
                    </h2>
                  </div>

                  {/* Stage Dropdown Controller */}
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-[#69746D] block mb-1">
                      Advance Stage
                    </span>
                    <select
                      value={selectedDeal.stage}
                      onChange={(e) => handleStageSelect(e.target.value as DealStage)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#218653] bg-white text-[#123D2A] focus:outline-none"
                    >
                      {stages.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                {/* Deal Overview Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                  <div className="bg-white p-2.5 rounded border border-[#DDEBDD]">
                    <span className="text-[10px] text-[#69746D] block">Buyer Entity</span>
                    <span className="font-bold text-[#123D2A] truncate block">{selectedDeal.buyerCompany}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-[#DDEBDD]">
                    <span className="text-[10px] text-[#69746D] block">Supplier Entity</span>
                    <span className="font-bold text-[#123D2A] truncate block">{selectedDeal.sellerCompany || 'Unmatched'}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-[#DDEBDD]">
                    <span className="text-[10px] text-[#69746D] block">Volume Tranche</span>
                    <span className="font-bold text-[#123D2A] font-mono tabular-nums block">
                      {selectedDeal.agreedQuantity || selectedDeal.requestedQuantity} tCO2e
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-[#DDEBDD]">
                    <span className="text-[10px] text-[#69746D] block">Channel Commission</span>
                    <span className="font-bold text-[#218653] font-mono block">
                      {selectedDeal.agreedCommissionRate || 3.5}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Private Broker Internal Notes (Section 12) */}
              <div className="p-6 bg-amber-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <Lock className="w-3.5 h-3.5 text-[#D99A32]" />
                    <span>Private Broker Notes (CONFIDENTIAL — Hidden from Buyer & Seller)</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#D99A32]">INTERNAL AUDIT LOG</span>
                </div>

                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {selectedDeal.messages.filter(m => m.isInternalNote).length === 0 ? (
                    <div className="text-[11px] text-[#69746D]">No internal broker notes logged yet.</div>
                  ) : (
                    selectedDeal.messages.filter(m => m.isInternalNote).map(note => (
                      <div key={note.id} className="p-2.5 bg-white rounded border border-amber-200 text-xs text-amber-950 space-y-0.5">
                        <div className="flex justify-between text-[10px] text-amber-800 font-mono">
                          <span>{note.senderName}</span>
                          <span>{new Date(note.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p>{note.text}</p>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleSendInternalNote} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add private note regarding counterparty credit, registry check..."
                    value={internalNoteText}
                    onChange={(e) => setInternalNoteText(e.target.value)}
                    className="flex-1 text-xs px-3 py-1.5 border border-amber-200 rounded bg-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!internalNoteText.trim()}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-[#D99A32] hover:bg-amber-700 rounded disabled:opacity-50"
                  >
                    Save Note
                  </button>
                </form>
              </div>

              {/* Public Deal Communications Log */}
              <div className="p-6 space-y-4 max-h-[350px] overflow-y-auto">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#123D2A]">
                  Public Communication Log ({selectedDeal.messages.filter(m => !m.isInternalNote).length})
                </h3>

                <div className="space-y-3">
                  {selectedDeal.messages.filter(m => !m.isInternalNote).map(msg => (
                    <div key={msg.id} className="p-3 bg-[#F7F8F4] rounded-lg border border-[#DDEBDD] text-xs space-y-1">
                      <div className="flex justify-between text-[10px] text-[#69746D] font-mono">
                        <span className="font-semibold text-[#123D2A]">{msg.senderName} ({msg.senderRole})</span>
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-[#202923]">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendPublicMessage} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Broadcast message to buyer & seller thread..."
                    value={publicMsgText}
                    onChange={(e) => setPublicMsgText(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 border border-[#DDEBDD] rounded-lg bg-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!publicMsgText.trim()}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#123D2A] hover:bg-[#1B4D36] rounded-lg disabled:opacity-50"
                  >
                    Send to Thread
                  </button>
                </form>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-xs text-[#69746D]">
              Select a deal from the pipeline to manage terms and communications.
            </div>
          )}
        </div>

      </div>

      {/* Commercial Terms Modal (triggered on completion or formal agreement) */}
      {isTermsModalOpen && selectedDeal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#123D2A]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-[#DDEBDD] shadow-xl p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-[#123D2A]">
              Finalize Commercial Terms & Record Deal Completion
            </h3>
            
            <p className="text-[#69746D]">
              Recording completion confirms verified registry serial delivery and automatically books the agreed facilitation commission into the platform revenue ledger.
            </p>

            <form onSubmit={handleConfirmCommercials} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#123D2A] mb-1">Agreed Quantity (tCO2e) *</label>
                  <input
                    type="number"
                    required
                    value={agreedQty}
                    onChange={(e) => setAgreedQty(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg font-mono tabular-nums"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#123D2A] mb-1">Agreed Unit Price ($/t) *</label>
                  <input
                    type="number"
                    step={0.1}
                    required
                    value={agreedPrice}
                    onChange={(e) => setAgreedPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg font-mono tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#123D2A] mb-1">Commission Rate (%) *</label>
                  <input
                    type="number"
                    step={0.1}
                    required
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg font-mono tabular-nums"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#123D2A] mb-1">Fixed Facilitation Fee ($)</label>
                  <input
                    type="number"
                    value={fixedFee}
                    onChange={(e) => setFixedFee(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg font-mono tabular-nums"
                  />
                </div>
              </div>

              <div className="bg-[#123D2A] text-white p-4 rounded-xl space-y-1 font-mono">
                <div className="flex justify-between text-xs">
                  <span>Gross Transaction Value:</span>
                  <span className="font-bold">${(agreedQty * agreedPrice).toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between text-xs text-[#DDEBDD]">
                  <span>Total Platform Success Fee:</span>
                  <span className="font-bold text-[#DDEBDD]">
                    ${((agreedQty * agreedPrice * (commissionRate / 100)) + fixedFee).toLocaleString()} USD
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#DDEBDD]">
                <button
                  type="button"
                  onClick={() => setIsTermsModalOpen(false)}
                  className="px-4 py-2 font-medium text-[#69746D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-[#218653] hover:bg-[#1B4D36] rounded-lg"
                >
                  Confirm & Mark Deal Completed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
