import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DemoBadge } from '../../components/common/DemoBadge';
import { InquiryDeal, PaymentRecord } from '../../types';
import { PaymentModal } from '../../components/payment/PaymentModal';
import { PaymentReceiptModal } from '../../components/payment/PaymentReceiptModal';
import { 
  Send, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  FileText, 
  ChevronRight, 
  Building2,
  Calendar,
  CreditCard,
  Lock,
  BadgeCheck,
  ArrowRight
} from 'lucide-react';

interface BuyerInquiriesProps {
  navigate: (route: string) => void;
}

export const BuyerInquiries: React.FC<BuyerInquiriesProps> = ({ navigate }) => {
  const { currentUser, deals, payments, addMessageToDeal, updateDealQuoteStatus, showToast } = useApp();

  const userDeals = deals.filter(d => currentUser && (d.buyerId === currentUser.id || d.buyerCompany === currentUser.companyName));
  const [selectedDealId, setSelectedDealId] = useState<string>(userDeals[0]?.id || '');
  const [replyText, setReplyText] = useState('');

  // Payment and receipt modals
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedPaymentForReceipt, setSelectedPaymentForReceipt] = useState<PaymentRecord | null>(null);

  const selectedDeal = deals.find(d => d.id === selectedDealId);
  const existingDealPayment = payments.find(p => p.dealId === selectedDeal?.id);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedDeal) return;
    addMessageToDeal(selectedDeal.id, replyText.trim(), false);
    setReplyText('');
  };

  const handleAcceptQuote = (quoteId: string) => {
    if (!selectedDeal) return;
    updateDealQuoteStatus(selectedDeal.id, quoteId, 'accepted');
  };

  const handleRejectQuote = (quoteId: string) => {
    if (!selectedDeal) return;
    updateDealQuoteStatus(selectedDeal.id, quoteId, 'rejected');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <DemoBadge variant="inline" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2A] tracking-tight mt-1">
            Inquiries, Quotes & Bilateral Negotiations
          </h1>
          <p className="text-xs text-[#69746D] mt-0.5">
            Direct communication channel with your assigned CarbonBridge broker and verified project originators.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Deals List */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#DDEBDD] overflow-hidden">
          <div className="p-4 border-b border-[#DDEBDD] bg-[#F7F8F4] flex items-center justify-between text-xs">
            <span className="font-bold text-[#123D2A]">Active Inquiries ({userDeals.length})</span>
            <span className="text-[#69746D]">Broker Assigned</span>
          </div>

          <div className="divide-y divide-[#DDEBDD]/60 max-h-[600px] overflow-y-auto">
            {userDeals.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#69746D]">
                No inquiries submitted yet.
              </div>
            ) : (
              userDeals.map(d => {
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
                      {d.listingName || d.bundleName || 'Carbon Portfolio'}
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
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#DDEBDD] overflow-hidden flex flex-col justify-between">
          {selectedDeal ? (
            <div className="divide-y divide-[#DDEBDD]">
              
              {/* Header */}
              <div className="p-6 bg-[#F7F8F4] space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-[#218653] text-sm">
                        {selectedDeal.referenceNumber}
                      </span>
                      <span aria-hidden="true" className="text-[#69746D]">·</span>
                      <span className="font-semibold text-[#123D2A]">
                        Current Stage: {selectedDeal.stage}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-[#123D2A] mt-1">
                      {selectedDeal.listingName || selectedDeal.bundleName || 'Procurement Portfolio'}
                    </h2>
                  </div>

                  <div className="text-right text-xs">
                    <span className="text-[#69746D] block">Assigned Channel Broker:</span>
                    <strong className="text-[#123D2A]">{selectedDeal.assignedAdminName || 'Platform Desk'}</strong>
                  </div>
                </div>

                {/* Deal Key Parameters Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                  <div className="bg-white p-2.5 rounded border border-[#DDEBDD]/80">
                    <span className="text-[10px] text-[#69746D] block">Volume Requested</span>
                    <span className="font-bold text-[#123D2A] font-mono tabular-nums">
                      {selectedDeal.requestedQuantity.toLocaleString()} {selectedDeal.quantityUnit}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded border border-[#DDEBDD]/80">
                    <span className="text-[10px] text-[#69746D] block">Project Supplier</span>
                    <span className="font-bold text-[#123D2A] truncate block">
                      {selectedDeal.sellerCompany || 'Designated Developer'}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded border border-[#DDEBDD]/80">
                    <span className="text-[10px] text-[#69746D] block">Application</span>
                    <span className="font-bold text-[#123D2A] truncate block">
                      {selectedDeal.intendedUse}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded border border-[#DDEBDD]/80">
                    <span className="text-[10px] text-[#69746D] block">Agreed Settlement</span>
                    <span className="font-bold text-[#218653] font-mono">
                      {selectedDeal.agreedUnitPrice ? `$${selectedDeal.agreedUnitPrice}/t` : 'In Negotiation'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Escrow Funding Action Strip if Agreement Pending or Quote Accepted */}
              {(selectedDeal.stage === 'Agreement Pending' || selectedDeal.quotes.some(q => q.status === 'accepted')) && selectedDeal.stage !== 'Completed' && (
                <div className="mx-6 my-4 p-4 rounded-xl bg-gradient-to-r from-[#123D2A] to-[#1B4D36] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm border border-[#218653]/50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#DDEBDD]">
                      <Lock className="w-3.5 h-3.5 text-[#218653]" />
                      <span className="font-bold uppercase tracking-wider text-emerald-300">Commercial Agreement Reached</span>
                    </div>
                    <h3 className="font-extrabold text-sm sm:text-base text-white">
                      Ready for B2B Escrow Funding & Registry Lock
                    </h3>
                    <p className="text-xs text-white/80">
                      Terms accepted: {(selectedDeal.agreedQuantity || selectedDeal.requestedQuantity).toLocaleString()} {selectedDeal.quantityUnit} at ${selectedDeal.agreedUnitPrice || selectedDeal.quotes.find(q => q.status === 'accepted')?.unitPrice || 12}/t. Fund escrow to trigger verified registry custody allocation.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-[#218653] hover:bg-emerald-600 text-white font-bold text-xs shrink-0 transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Fund Escrow & Settle Deal</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Completed Escrow Certificate banner if Completed */}
              {selectedDeal.stage === 'Completed' && (
                <div className="mx-6 my-4 p-4 rounded-xl bg-[#DDEBDD]/40 border border-[#218653] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#218653]">
                      <BadgeCheck className="w-4 h-4 text-[#218653]" />
                      <span>Escrow Settled & Registry Allocation Confirmed</span>
                    </div>
                    <p className="text-xs text-[#123D2A]">
                      This transaction has been funded and completed. Verified environmental units are locked in your corporate portfolio.
                    </p>
                  </div>

                  {existingDealPayment ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPaymentForReceipt(existingDealPayment);
                        setIsReceiptModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#123D2A] hover:bg-[#1B4D36] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Settlement Certificate</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-[#218653] hover:bg-[#1B4D36] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Generate Certificate</span>
                    </button>
                  )}
                </div>
              )}

              {/* Formal Quotes Received Section */}
              {selectedDeal.quotes.length > 0 && (
                <div className="p-6 bg-white space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#123D2A]">
                    Formal Commercial Quotes Received ({selectedDeal.quotes.length})
                  </h3>

                  <div className="space-y-3">
                    {selectedDeal.quotes.map((q) => (
                      <div
                        key={q.id}
                        className="bg-[#F7F8F4] p-4 rounded-xl border border-[#DDEBDD] space-y-3 text-xs"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#DDEBDD] pb-2">
                          <div>
                            <span className="text-[10px] uppercase font-mono text-[#69746D]">OFFER FROM</span>
                            <div className="font-bold text-[#123D2A]">{q.submittedBy}</div>
                          </div>

                          <div className="text-right">
                            <span className="text-base font-extrabold font-mono text-[#218653]">
                              ${q.unitPrice.toFixed(2)} USD
                            </span>
                            <span className="text-[#69746D] ml-1">/ tCO2e</span>
                            <span className="text-[10px] text-[#69746D] block font-mono">
                              Total: ${(q.quantity * q.unitPrice).toLocaleString()} USD
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#69746D]">
                          <div>
                            <strong className="text-[#123D2A]">Delivery Timeline: </strong>
                            {q.deliveryTimeline}
                          </div>
                          <div>
                            <strong className="text-[#123D2A]">Registry Transfer: </strong>
                            {q.registryAccountTerms}
                          </div>
                        </div>

                        {q.notes && (
                          <div className="p-2 bg-white rounded border border-[#DDEBDD] text-[11px] text-[#202923]">
                            {q.notes}
                          </div>
                        )}

                        {/* Accept / Reject actions */}
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] font-mono text-[#69746D]">
                            Valid until {q.validUntil}
                          </span>

                          <div className="flex items-center gap-2">
                            {q.status === 'pending' ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleRejectQuote(q.id)}
                                  className="px-3 py-1.5 rounded border border-[#C94C4C] text-[#C94C4C] hover:bg-red-50 text-xs font-semibold cursor-pointer"
                                >
                                  Decline
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAcceptQuote(q.id)}
                                  className="px-4 py-1.5 rounded bg-[#218653] text-white hover:bg-[#1B4D36] text-xs font-semibold cursor-pointer"
                                >
                                  Accept Terms & Proceed
                                </button>
                              </>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                  q.status === 'accepted' ? 'bg-[#DDEBDD] text-[#218653]' : 'bg-red-50 text-[#C94C4C]'
                                }`}>
                                  {q.status === 'accepted' ? 'Terms Accepted' : 'Offer Declined'}
                                </span>
                                {q.status === 'accepted' && selectedDeal.stage !== 'Completed' && (
                                  <button
                                    type="button"
                                    onClick={() => setIsPaymentModalOpen(true)}
                                    className="px-3 py-1 rounded-lg bg-[#218653] text-white hover:bg-[#1B4D36] text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                                  >
                                    <CreditCard className="w-3 h-3" />
                                    <span>Fund Escrow</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Thread History */}
              <div className="p-6 space-y-4 max-h-[350px] overflow-y-auto">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#123D2A]">
                  Communication Log
                </h3>

                <div className="space-y-3">
                  {selectedDeal.messages
                    .filter(m => !m.isInternalNote) // Internal notes strictly hidden from buyers
                    .map((msg) => {
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

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="p-4 bg-[#F7F8F4] flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message or counter-proposal to the broker desk..."
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
              Select an inquiry from the left panel to inspect terms and message history.
            </div>
          )}
        </div>

      </div>

      {/* Payment & Settlement Modal */}
      {selectedDeal && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          dealId={selectedDeal.id}
          dealReference={selectedDeal.referenceNumber}
          itemTitle={selectedDeal.listingName || selectedDeal.bundleName || 'Carbon Portfolio'}
          quantity={selectedDeal.agreedQuantity || selectedDeal.requestedQuantity}
          quantityUnit={selectedDeal.quantityUnit}
          unitPrice={selectedDeal.agreedUnitPrice || selectedDeal.quotes.find(q => q.status === 'accepted')?.unitPrice || 12.50}
          totalAmount={selectedDeal.agreedTotalValue}
          onPaymentSuccess={(payment) => {
            setSelectedPaymentForReceipt(payment);
          }}
          onViewReceipt={(payment) => {
            setSelectedPaymentForReceipt(payment);
            setIsReceiptModalOpen(true);
          }}
        />
      )}

      {/* Official Certificate & Escrow Settlement Modal */}
      <PaymentReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        payment={selectedPaymentForReceipt}
      />

    </div>
  );
};
