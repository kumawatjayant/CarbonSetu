import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DemoBadge } from '../../components/common/DemoBadge';
import { Send, FileText, CheckCircle2, DollarSign, Calendar, Clock } from 'lucide-react';

interface SellerInquiriesProps {
  navigate: (route: string) => void;
}

export const SellerInquiries: React.FC<SellerInquiriesProps> = ({ navigate }) => {
  const { currentUser, deals, addMessageToDeal, submitQuoteToDeal, showToast } = useApp();

  const sellerDeals = deals.filter(d => 
    currentUser && (d.sellerId === currentUser.id || d.sellerCompany === currentUser.companyName)
  );

  const [selectedDealId, setSelectedDealId] = useState<string>(sellerDeals[0]?.id || '');
  const [replyText, setReplyText] = useState('');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Quote form inputs
  const [quotePrice, setQuotePrice] = useState<number>(14.00);
  const [quoteQuantity, setQuoteQuantity] = useState<number>(5000);
  const [deliveryTimeline, setDeliveryTimeline] = useState('Within 14 business days of escrow confirmation');
  const [registryTerms, setRegistryTerms] = useState('Direct electronic transfer to buyer registry sub-account');
  const [validUntil, setValidUntil] = useState('2026-06-30');
  const [quoteNotes, setQuoteNotes] = useState('');

  const selectedDeal = deals.find(d => d.id === selectedDealId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedDeal) return;
    addMessageToDeal(selectedDeal.id, replyText.trim(), false);
    setReplyText('');
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeal) return;

    submitQuoteToDeal(selectedDeal.id, {
      submittedBy: currentUser?.companyName || 'Project Originator',
      quantity: Number(quoteQuantity),
      unitPrice: Number(quotePrice),
      currency: 'USD',
      deliveryTimeline,
      registryAccountTerms: registryTerms,
      validUntil,
      status: 'pending',
      notes: quoteNotes || undefined
    });

    setIsQuoteModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div>
        <DemoBadge variant="inline" />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2A] tracking-tight mt-1">
          Buyer Inquiries & Quote Issuance Desk
        </h1>
        <p className="text-xs text-[#69746D] mt-0.5">
          Review qualified buyer purchase inquiries routed through the CarbonBridge channel partner desk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Inquiries list */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#DDEBDD] overflow-hidden">
          <div className="p-4 border-b border-[#DDEBDD] bg-[#F7F8F4] flex items-center justify-between text-xs">
            <span className="font-bold text-[#123D2A]">Buyer Inquiries ({sellerDeals.length})</span>
            <span className="text-[#69746D]">Live Desk</span>
          </div>

          <div className="divide-y divide-[#DDEBDD]/60 max-h-[600px] overflow-y-auto">
            {sellerDeals.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#69746D]">
                No inbound inquiries for your projects at this time.
              </div>
            ) : (
              sellerDeals.map(d => {
                const isSelected = d.id === selectedDealId;
                return (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDealId(d.id)}
                    className={`p-4 cursor-pointer transition-colors text-xs space-y-1 ${
                      isSelected ? 'bg-[#DDEBDD]/30 border-l-4 border-l-[#218653]' : 'hover:bg-[#F7F8F4]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#218653]">{d.referenceNumber}</span>
                      <span className="text-[10px] uppercase font-semibold text-[#123D2A] bg-white px-1.5 py-0.5 rounded border border-[#DDEBDD]">
                        {d.stage}
                      </span>
                    </div>

                    <h4 className="font-bold text-[#123D2A] truncate">
                      Buyer: {d.buyerCompany}
                    </h4>

                    <div className="text-[11px] text-[#69746D] flex items-center justify-between">
                      <span>{d.requestedQuantity.toLocaleString()} {d.quantityUnit}</span>
                      <span>{new Date(d.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Selected Deal Detail View & Message Thread */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#DDEBDD] overflow-hidden">
          {selectedDeal ? (
            <div className="divide-y divide-[#DDEBDD]">
              
              {/* Header */}
              <div className="p-6 bg-[#F7F8F4] space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-[#218653] text-sm">{selectedDeal.referenceNumber}</span>
                      <span aria-hidden="true" className="text-[#69746D]">·</span>
                      <span className="font-semibold text-[#123D2A]">{selectedDeal.stage}</span>
                    </div>
                    <h2 className="text-lg font-bold text-[#123D2A] mt-1">
                      Inquiry from {selectedDeal.buyerCompany} ({selectedDeal.buyerName})
                    </h2>
                  </div>

                  <button
                    onClick={() => {
                      setQuoteQuantity(selectedDeal.requestedQuantity);
                      setIsQuoteModalOpen(true);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#218653] hover:bg-[#1B4D36] rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Issue Commercial Quote</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                  <div className="bg-white p-2.5 rounded border border-[#DDEBDD]">
                    <span className="text-[10px] text-[#69746D] block">Requested Volume</span>
                    <span className="font-bold text-[#123D2A] font-mono tabular-nums">
                      {selectedDeal.requestedQuantity.toLocaleString()} {selectedDeal.quantityUnit}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-[#DDEBDD]">
                    <span className="text-[10px] text-[#69746D] block">Intended Use</span>
                    <span className="font-bold text-[#123D2A] truncate block">{selectedDeal.intendedUse}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-[#DDEBDD]">
                    <span className="text-[10px] text-[#69746D] block">Target Project</span>
                    <span className="font-bold text-[#123D2A] truncate block">{selectedDeal.listingName || 'Portfolio'}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-[#DDEBDD]">
                    <span className="text-[10px] text-[#69746D] block">Assigned Broker</span>
                    <span className="font-bold text-[#218653] truncate block">{selectedDeal.assignedAdminName || 'Desk'}</span>
                  </div>
                </div>
              </div>

              {/* Quotes Issued */}
              {selectedDeal.quotes.length > 0 && (
                <div className="p-6 bg-white space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#123D2A]">
                    Submitted Commercial Quotes ({selectedDeal.quotes.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedDeal.quotes.map(q => (
                      <div key={q.id} className="bg-[#F7F8F4] p-3 rounded-lg border border-[#DDEBDD] text-xs flex items-center justify-between">
                        <div>
                          <div className="font-bold text-[#123D2A]">
                            ${q.unitPrice.toFixed(2)}/t · {q.quantity.toLocaleString()} tCO2e (${(q.quantity * q.unitPrice).toLocaleString()} Total)
                          </div>
                          <div className="text-[11px] text-[#69746D]">
                            Valid until {q.validUntil} · Terms: {q.registryAccountTerms}
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          q.status === 'accepted' ? 'bg-[#DDEBDD] text-[#218653]' : 'bg-white text-[#69746D] border border-[#DDEBDD]'
                        }`}>
                          {q.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="p-6 space-y-4 max-h-[350px] overflow-y-auto">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#123D2A]">
                  Channel Conversation
                </h3>
                <div className="space-y-3">
                  {selectedDeal.messages.map(msg => {
                    const isOwn = currentUser && msg.senderId === currentUser.id;
                    return (
                      <div
                        key={msg.id}
                        className={`p-3.5 rounded-xl text-xs space-y-1 max-w-[85%] ${
                          isOwn 
                            ? 'ml-auto bg-[#123D2A] text-white' 
                            : 'mr-auto bg-[#F7F8F4] text-[#202923] border border-[#DDEBDD]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4 text-[10px] font-mono opacity-80">
                          <span>{msg.senderName}</span>
                          <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="leading-relaxed">{msg.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendMessage} className="p-4 bg-[#F7F8F4] flex gap-2">
                <input
                  type="text"
                  placeholder="Send a response to the buyer and channel broker..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653] bg-white"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#123D2A] hover:bg-[#1B4D36] rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>

            </div>
          ) : (
            <div className="p-12 text-center text-xs text-[#69746D]">
              Select an inquiry from the left to view buyer requirements and issue commercial quotes.
            </div>
          )}
        </div>

      </div>

      {/* Issue Commercial Quote Modal */}
      {isQuoteModalOpen && selectedDeal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#123D2A]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-[#DDEBDD] shadow-xl p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-[#123D2A]">
              Issue Formal Commercial Quote ({selectedDeal.referenceNumber})
            </h3>
            
            <form onSubmit={handleQuoteSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#123D2A] mb-1">Offered Unit Price ($/tCO2e) *</label>
                  <input
                    type="number"
                    step={0.1}
                    required
                    value={quotePrice}
                    onChange={(e) => setQuotePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg font-mono tabular-nums focus:outline-none focus:border-[#218653]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#123D2A] mb-1">Volume Tranche (tCO2e) *</label>
                  <input
                    type="number"
                    required
                    value={quoteQuantity}
                    onChange={(e) => setQuoteQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg font-mono tabular-nums focus:outline-none focus:border-[#218653]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#123D2A] mb-1">Delivery Window</label>
                <input
                  type="text"
                  value={deliveryTimeline}
                  onChange={(e) => setDeliveryTimeline(e.target.value)}
                  className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#123D2A] mb-1">Registry Settlement Terms</label>
                <input
                  type="text"
                  value={registryTerms}
                  onChange={(e) => setRegistryTerms(e.target.value)}
                  className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#123D2A] mb-1">Quote Validity Date</label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653]"
                />
              </div>

              <div className="bg-[#F7F8F4] p-3 rounded-lg border border-[#DDEBDD] flex justify-between font-mono font-bold text-[#123D2A]">
                <span>Total Quote Value:</span>
                <span className="text-[#218653]">${(quotePrice * quoteQuantity).toLocaleString()} USD</span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#DDEBDD]">
                <button
                  type="button"
                  onClick={() => setIsQuoteModalOpen(false)}
                  className="px-4 py-2 font-medium text-[#69746D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-[#218653] hover:bg-[#1B4D36] rounded-lg"
                >
                  Issue Formal Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
