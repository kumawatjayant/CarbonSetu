import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { PaymentRecord } from '../../types';
import { 
  ShieldCheck, 
  CreditCard, 
  Building2, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  Check, 
  Loader2, 
  Sparkles,
  FileText,
  BadgeCheck,
  AlertCircle
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealId?: string;
  dealReference?: string;
  itemTitle: string;
  quantity: number;
  quantityUnit?: string;
  unitPrice?: number;
  totalAmount?: number;
  onPaymentSuccess?: (payment: PaymentRecord) => void;
  onViewReceipt?: (payment: PaymentRecord) => void;
}

type PaymentRail = 'wire' | 'card' | 'ach';
type ProcessingPhase = 'idle' | 'sanctions' | 'escrow_lock' | 'settled' | 'success';

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  dealId,
  dealReference,
  itemTitle,
  quantity,
  quantityUnit = 'tCO2e',
  unitPrice = 12.50,
  totalAmount,
  onPaymentSuccess,
  onViewReceipt
}) => {
  const { currentUser, processPayment, showToast } = useApp();

  const [activeRail, setActiveRail] = useState<PaymentRail>('wire');
  const [processingPhase, setProcessingPhase] = useState<ProcessingPhase>('idle');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [createdPayment, setCreatedPayment] = useState<PaymentRecord | null>(null);

  // Card form state
  const [cardNumber, setCardNumber] = useState('4242 8890 2341 9924');
  const [cardHolder, setCardHolder] = useState(currentUser?.fullName || 'Elena Rostova');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvc, setCardCvc] = useState('482');

  // ACH form state
  const [selectedBank, setSelectedBank] = useState('JPMorgan Chase Commercial');
  const [achAccount, setAchAccount] = useState('88392019482');
  const [achRouting, setAchRouting] = useState('021000021');
  const [achAuthorized, setAchAuthorized] = useState(true);

  // Financial calculations
  const grossCreditsValue = totalAmount !== undefined ? totalAmount : (quantity * unitPrice);
  const facilitationFee = 500; // Standard CarbonBridge escrow facilitation & registry transfer fee
  const totalDue = grossCreditsValue + facilitationFee;

  const escrowRef = dealReference 
    ? `CB-ESC-${dealReference.replace('CB-', '')}-ST`
    : `CB-ESC-${Math.floor(1000 + Math.random() * 9000)}-TR`;

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setProcessingPhase('idle');
      setCreatedPayment(null);
    }
  }, [isOpen]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`Copied ${key} to clipboard.`, 'info');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleExecutePayment = () => {
    if (activeRail === 'ach' && !achAuthorized) {
      showToast('Please check the mandate authorization to proceed with ACH transfer.', 'error');
      return;
    }

    setProcessingPhase('sanctions');

    // Realistic phase 1 -> phase 2 -> phase 3 -> success animation timeline
    setTimeout(() => {
      setProcessingPhase('escrow_lock');
    }, 950);

    setTimeout(() => {
      setProcessingPhase('settled');
    }, 2050);

    setTimeout(() => {
      const railLabel: PaymentRecord['paymentMethod'] = 
        activeRail === 'wire' ? 'B2B Escrow Wire' : 
        activeRail === 'card' ? 'Corporate Purchasing Card' : 'Direct SEPA/ACH Debit';

      const paymentRecord = processPayment({
        dealId,
        dealReference,
        itemTitle,
        quantity,
        quantityUnit,
        amount: totalDue,
        currency: 'USD',
        paymentMethod: railLabel,
        payerCompany: currentUser?.companyName || 'Corporate Procurement Buyer',
        payerName: currentUser?.fullName || 'Procurement Executive',
        beneficiary: 'CarbonBridge Escrow Custody Account #9924-US',
        escrowReference: escrowRef,
        status: 'settled',
        registrySerialBatch: `GS-IND-2025-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10000 + Math.random() * 90000)}`
      });

      setCreatedPayment(paymentRecord);
      setProcessingPhase('success');
      if (onPaymentSuccess) {
        onPaymentSuccess(paymentRecord);
      }
    }, 3100);
  };

  const formatCardInput = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const parts = raw.match(/[\s\S]{1,4}/g) || [];
    setCardNumber(parts.join(' '));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (processingPhase !== 'idle' && processingPhase !== 'success') return; // Prevent close during settlement
        onClose();
      }}
      title={processingPhase === 'success' ? 'Settlement Confirmed' : 'B2B Escrow Settlement & Payment'}
      subtitle={
        processingPhase === 'success' 
          ? 'Registry escrow locked and verified retirement certificate generated.' 
          : 'Complete corporate purchase with institutional escrow custody protection.'
      }
      maxWidth="lg"
    >
      <div className="space-y-6">
        
        {/* Processing State Animation View */}
        {processingPhase !== 'idle' && processingPhase !== 'success' && (
          <div className="py-10 px-4 text-center space-y-6">
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-[#DDEBDD] border-t-[#218653] animate-spin" />
              <div className="w-16 h-16 rounded-full bg-[#DDEBDD]/50 flex items-center justify-center text-[#218653]">
                {processingPhase === 'sanctions' && <ShieldCheck className="w-8 h-8 animate-pulse text-[#218653]" />}
                {processingPhase === 'escrow_lock' && <Lock className="w-8 h-8 animate-bounce text-[#218653]" />}
                {processingPhase === 'settled' && <CheckCircle2 className="w-8 h-8 text-[#218653]" />}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#218653] font-bold">
                {processingPhase === 'sanctions' && 'PHASE 1 OF 3: COMPLIANCE CHECK'}
                {processingPhase === 'escrow_lock' && 'PHASE 2 OF 3: ESCROW CUSTODY LOCK'}
                {processingPhase === 'settled' && 'PHASE 3 OF 3: FINAL CLEARING & CERTIFICATE'}
              </span>
              <h3 className="text-xl font-extrabold text-[#123D2A]">
                {processingPhase === 'sanctions' && 'Screening Counterparty AML & Sanctions...'}
                {processingPhase === 'escrow_lock' && 'Locking Sub-Account Registry Assets in Escrow...'}
                {processingPhase === 'settled' && 'Minting Cryptographic Serial Certificate...'}
              </h3>
              <p className="text-xs text-[#69746D] max-w-md mx-auto leading-relaxed">
                {processingPhase === 'sanctions' && 'Verifying corporate tax status, sanctions check, and bilateral deal terms through automated banking protocols.'}
                {processingPhase === 'escrow_lock' && `Reserving ${quantity.toLocaleString()} ${quantityUnit} from project registry into CarbonBridge bankruptcy-remote escrow custody.`}
                {processingPhase === 'settled' && 'Generating irrevocable transaction hash, signing retirement certificate, and updating marketplace ledger.'}
              </p>
            </div>

            {/* Stepper Dots */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <div className={`h-2 rounded-full transition-all duration-300 ${processingPhase === 'sanctions' ? 'w-8 bg-[#218653]' : 'w-2 bg-[#218653]'}`} />
              <div className={`h-2 rounded-full transition-all duration-300 ${processingPhase === 'escrow_lock' ? 'w-8 bg-[#218653]' : processingPhase === 'settled' ? 'w-2 bg-[#218653]' : 'w-2 bg-[#DDEBDD]'}`} />
              <div className={`h-2 rounded-full transition-all duration-300 ${processingPhase === 'settled' ? 'w-8 bg-[#218653]' : 'w-2 bg-[#DDEBDD]'}`} />
            </div>
          </div>
        )}

        {/* Success View */}
        {processingPhase === 'success' && createdPayment && (
          <div className="py-4 space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#DDEBDD] text-[#218653] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#218653] font-bold">
                  ESCROW FUNDED & SETTLEMENT CONFIRMED
                </span>
                <h3 className="text-2xl font-extrabold text-[#123D2A]">
                  ${createdPayment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD Settled
                </h3>
                <p className="text-xs text-[#69746D]">
                  {createdPayment.quantity.toLocaleString()} {createdPayment.quantityUnit} transferred to your corporate custody balance.
                </p>
              </div>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-[#F7F8F4] p-5 rounded-2xl border border-[#DDEBDD] space-y-3 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#DDEBDD]">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#69746D] block">OFFICIAL CERTIFICATE NUMBER</span>
                  <span className="font-mono font-bold text-[#123D2A] text-sm">{createdPayment.certificateNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-[#69746D] block">ESCROW REFERENCE</span>
                  <span className="font-mono font-semibold text-[#218653]">{createdPayment.escrowReference}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <span className="text-[10px] text-[#69746D] block">Environmental Asset</span>
                  <span className="font-bold text-[#123D2A] truncate block">{createdPayment.itemTitle}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#69746D] block">Settlement Rail</span>
                  <span className="font-semibold text-[#123D2A]">{createdPayment.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#69746D] block">Beneficiary Entity</span>
                  <span className="font-semibold text-[#123D2A] truncate block">{createdPayment.payerCompany}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#DDEBDD]/70 flex items-center justify-between text-[11px] text-[#69746D]">
                <span>Registry Serial Batch: <strong className="font-mono text-[#123D2A]">{createdPayment.registrySerialBatch}</strong></span>
                <span className="flex items-center gap-1 text-[#218653] font-semibold">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Audit Verified
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onViewReceipt) onViewReceipt(createdPayment);
                }}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#218653] text-white hover:bg-[#1B4D36] text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>View Official Settlement Certificate</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#F7F8F4] text-[#123D2A] hover:bg-[#DDEBDD] text-xs font-semibold border border-[#DDEBDD] transition-colors"
              >
                Close & Return
              </button>
            </div>
          </div>
        )}

        {/* Normal Payment Selection & Checkout Form */}
        {processingPhase === 'idle' && (
          <div className="space-y-6">
            
            {/* Order Overview Strip */}
            <div className="bg-[#F7F8F4] p-4 rounded-xl border border-[#DDEBDD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-mono text-[#69746D] block">
                  {dealReference ? `Deal Ref: ${dealReference}` : 'Instant Procurement'}
                </span>
                <h4 className="font-bold text-sm text-[#123D2A]">{itemTitle}</h4>
                <div className="text-[11px] text-[#69746D]">
                  Volume: <strong className="text-[#123D2A]">{quantity.toLocaleString()} {quantityUnit}</strong> · Escrow Ref: <span className="font-mono text-[#218653] font-semibold">{escrowRef}</span>
                </div>
              </div>

              <div className="text-right sm:border-l sm:border-[#DDEBDD] sm:pl-4 shrink-0">
                <span className="text-[10px] uppercase font-mono text-[#69746D] block">TOTAL ESCROW SETTLEMENT</span>
                <span className="text-xl font-black font-mono text-[#218653]">
                  ${totalDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] text-[#69746D] block">USD (Incl. $500 platform fee)</span>
              </div>
            </div>

            {/* Payment Rail Switcher Tabs */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#123D2A]">
                Select Institutional Payment Rail
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setActiveRail('wire')}
                  className={`p-3 rounded-xl border text-left transition-all text-xs flex flex-col justify-between gap-2 ${
                    activeRail === 'wire'
                      ? 'border-[#218653] bg-[#DDEBDD]/40 ring-1 ring-[#218653]'
                      : 'border-[#DDEBDD] bg-white hover:bg-[#F7F8F4]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Building2 className={`w-4 h-4 ${activeRail === 'wire' ? 'text-[#218653]' : 'text-[#69746D]'}`} />
                    <span className="text-[9px] uppercase font-mono font-semibold px-1.5 py-0.5 rounded bg-white border border-[#DDEBDD]">
                      Recommended
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-[#123D2A]">B2B Escrow Wire</div>
                    <div className="text-[10px] text-[#69746D]">Fedwire / SWIFT / SEPA</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveRail('card')}
                  className={`p-3 rounded-xl border text-left transition-all text-xs flex flex-col justify-between gap-2 ${
                    activeRail === 'card'
                      ? 'border-[#218653] bg-[#DDEBDD]/40 ring-1 ring-[#218653]'
                      : 'border-[#DDEBDD] bg-white hover:bg-[#F7F8F4]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <CreditCard className={`w-4 h-4 ${activeRail === 'card' ? 'text-[#218653]' : 'text-[#69746D]'}`} />
                    <span className="text-[9px] uppercase font-mono font-semibold px-1.5 py-0.5 rounded bg-white border border-[#DDEBDD]">
                      Instant Lock
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-[#123D2A]">Corporate Card</div>
                    <div className="text-[10px] text-[#69746D]">Visa / Mastercard / Amex</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveRail('ach')}
                  className={`p-3 rounded-xl border text-left transition-all text-xs flex flex-col justify-between gap-2 ${
                    activeRail === 'ach'
                      ? 'border-[#218653] bg-[#DDEBDD]/40 ring-1 ring-[#218653]'
                      : 'border-[#DDEBDD] bg-white hover:bg-[#F7F8F4]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <ShieldCheck className={`w-4 h-4 ${activeRail === 'ach' ? 'text-[#218653]' : 'text-[#69746D]'}`} />
                    <span className="text-[9px] uppercase font-mono font-semibold px-1.5 py-0.5 rounded bg-white border border-[#DDEBDD]">
                      Direct Debit
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-[#123D2A]">ACH / SEPA Direct</div>
                    <div className="text-[10px] text-[#69746D]">Direct corporate account</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Tab 1: Wire Transfer Details */}
            {activeRail === 'wire' && (
              <div className="space-y-4 bg-white p-4 rounded-xl border border-[#DDEBDD]">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-[#DDEBDD]">
                  <span className="font-bold text-[#123D2A]">CarbonBridge Escrow Custody Account</span>
                  <span className="text-[11px] text-[#218653] flex items-center gap-1 font-semibold">
                    <Lock className="w-3.5 h-3.5" />
                    Bankruptcy Remote Trust
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#F7F8F4] p-3 rounded-lg border border-[#DDEBDD]/70 space-y-1">
                    <span className="text-[10px] text-[#69746D] block">Beneficiary Name</span>
                    <div className="flex items-center justify-between">
                      <strong className="text-[#123D2A] text-xs">CarbonBridge Escrow Custody LLC</strong>
                      <button
                        type="button"
                        onClick={() => handleCopy('CarbonBridge Escrow Custody LLC', 'Beneficiary')}
                        className="text-[#218653] hover:text-[#123D2A]"
                      >
                        {copiedKey === 'Beneficiary' ? <Check className="w-3.5 h-3.5 text-[#218653]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#F7F8F4] p-3 rounded-lg border border-[#DDEBDD]/70 space-y-1">
                    <span className="text-[10px] text-[#69746D] block">Depository Bank & SWIFT</span>
                    <div className="flex items-center justify-between">
                      <strong className="text-[#123D2A] text-xs">Silicon Climate Bank (CLIMUS33)</strong>
                      <button
                        type="button"
                        onClick={() => handleCopy('CLIMUS33', 'SWIFT')}
                        className="text-[#218653] hover:text-[#123D2A]"
                      >
                        {copiedKey === 'SWIFT' ? <Check className="w-3.5 h-3.5 text-[#218653]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#F7F8F4] p-3 rounded-lg border border-[#DDEBDD]/70 space-y-1">
                    <span className="text-[10px] text-[#69746D] block">Routing / ABA (Wire)</span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#123D2A]">021000089</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('021000089', 'Routing')}
                        className="text-[#218653] hover:text-[#123D2A]"
                      >
                        {copiedKey === 'Routing' ? <Check className="w-3.5 h-3.5 text-[#218653]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#F7F8F4] p-3 rounded-lg border border-[#DDEBDD]/70 space-y-1">
                    <span className="text-[10px] text-[#69746D] block">Custody Sub-Account Number</span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#123D2A]">889201948271</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('889201948271', 'Account')}
                        className="text-[#218653] hover:text-[#123D2A]"
                      >
                        {copiedKey === 'Account' ? <Check className="w-3.5 h-3.5 text-[#218653]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Critical Reference Banner */}
                <div className="p-3 bg-amber-50/80 rounded-lg border border-amber-200/80 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-[#D99A32] shrink-0 mt-0.5" />
                  <div className="space-y-1 text-[#202923]">
                    <div className="font-bold text-[#123D2A]">
                      Mandatory Wire Memo / Reference: <span className="font-mono text-[#218653]">{escrowRef}</span>
                    </div>
                    <p className="text-[11px] text-[#69746D]">
                      In this demo simulation, clicking below mimics immediate bank wire receipt and automatic escrow verification.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Corporate Purchasing Card Form & Realistic Card Graphic */}
            {activeRail === 'card' && (
              <div className="space-y-4">
                {/* Visual Card Artwork */}
                <div className="w-full max-w-sm mx-auto h-44 rounded-2xl bg-gradient-to-tr from-[#123D2A] via-[#1B4D36] to-[#218653] p-5 text-white shadow-lg flex flex-col justify-between border border-[#218653]/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-6 rounded bg-amber-200/90 border border-amber-300 flex items-center justify-center">
                        <div className="w-4 h-3 border border-amber-500/50 rounded-xs" />
                      </div>
                      <span className="text-[10px] font-mono tracking-wider opacity-80 uppercase">Corporate Commercial</span>
                    </div>
                    <span className="font-extrabold italic text-sm tracking-widest text-white/90">VISA</span>
                  </div>

                  <div className="font-mono text-lg tracking-widest text-white/95">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>

                  <div className="flex items-end justify-between text-xs">
                    <div>
                      <span className="text-[8px] uppercase tracking-wider text-white/60 block">Cardholder</span>
                      <span className="font-bold uppercase tracking-wider text-white/90 truncate max-w-[170px] block">
                        {cardHolder || 'CORPORATE BUYER'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[8px] uppercase tracking-wider text-white/60 block">Expires</span>
                      <span className="font-mono font-bold text-white/90">{cardExpiry || 'MM/YY'}</span>
                    </div>
                  </div>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-[#123D2A] block mb-1">Corporate Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => formatCardInput(e.target.value)}
                      placeholder="4242 8890 2341 9924"
                      className="w-full px-3 py-2 rounded-lg border border-[#DDEBDD] focus:border-[#218653] focus:ring-1 focus:ring-[#218653] outline-hidden font-mono text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#123D2A] block mb-1">Cardholder Entity / Name</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Full Corporate Name"
                      className="w-full px-3 py-2 rounded-lg border border-[#DDEBDD] focus:border-[#218653] focus:ring-1 focus:ring-[#218653] outline-hidden text-xs bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-[#123D2A] block mb-1">Expires (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="08/29"
                        maxLength={5}
                        className="w-full px-3 py-2 rounded-lg border border-[#DDEBDD] focus:border-[#218653] outline-hidden font-mono text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#123D2A] block mb-1">CVC / CVV</label>
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.slice(0, 4))}
                        placeholder="•••"
                        maxLength={4}
                        className="w-full px-3 py-2 rounded-lg border border-[#DDEBDD] focus:border-[#218653] outline-hidden font-mono text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-[#69746D] bg-[#F7F8F4] p-2.5 rounded-lg border border-[#DDEBDD]">
                  <ShieldCheck className="w-4 h-4 text-[#218653] shrink-0" />
                  <span>3D Secure 2.0 corporate tokenization active. Funds directly allocated to escrow.</span>
                </div>
              </div>
            )}

            {/* Tab 3: ACH / SEPA Direct Debit */}
            {activeRail === 'ach' && (
              <div className="space-y-4 bg-white p-4 rounded-xl border border-[#DDEBDD] text-xs">
                <div>
                  <label className="text-[11px] font-bold text-[#123D2A] block mb-1">Select Corporate Clearing Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#DDEBDD] focus:border-[#218653] outline-hidden text-xs bg-white"
                  >
                    <option value="JPMorgan Chase Commercial">JPMorgan Chase Commercial Treasury</option>
                    <option value="Deutsche Bank Global Transaction Banking">Deutsche Bank Global Transaction Banking (SEPA)</option>
                    <option value="HSBC Global Liquidity & Cash Management">HSBC Global Liquidity & Cash Management</option>
                    <option value="BNP Paribas Corporate Banking">BNP Paribas Corporate Banking</option>
                    <option value="Barclays Corporate Settlement">Barclays Corporate Settlement</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#123D2A] block mb-1">Routing / Transit Number</label>
                    <input
                      type="text"
                      value={achRouting}
                      onChange={(e) => setAchRouting(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#DDEBDD] outline-hidden font-mono text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#123D2A] block mb-1">Corporate Account Number</label>
                    <input
                      type="text"
                      value={achAccount}
                      onChange={(e) => setAchAccount(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#DDEBDD] outline-hidden font-mono text-xs bg-white"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-2.5 pt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={achAuthorized}
                    onChange={(e) => setAchAuthorized(e.target.checked)}
                    className="mt-0.5 rounded text-[#218653] focus:ring-[#218653]"
                  />
                  <span className="text-[11px] text-[#69746D] leading-snug">
                    I authorize CarbonBridge Escrow Custody to execute a direct debit of <strong>${totalDue.toLocaleString()} USD</strong> from our corporate clearing account for verified carbon registry locking.
                  </span>
                </label>
              </div>
            )}

            {/* Fee Breakdown Transparency Table */}
            <div className="bg-[#F7F8F4] p-3.5 rounded-xl border border-[#DDEBDD] space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[#69746D]">
                <span>Carbon Credits Tranche ({quantity.toLocaleString()} {quantityUnit})</span>
                <span className="font-mono text-[#123D2A]">${grossCreditsValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-center justify-between text-[#69746D]">
                <span>CarbonBridge Facilitation & Settlement Fee</span>
                <span className="font-mono text-[#123D2A]">${facilitationFee.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-[#69746D]">
                <span>Escrow Trust Custody & Verification</span>
                <span className="font-mono text-[#218653] font-semibold">$0.00 (Covered)</span>
              </div>
              <div className="border-t border-[#DDEBDD] pt-1.5 flex items-center justify-between font-bold text-[#123D2A]">
                <span>Net Total to Escrow</span>
                <span className="font-mono text-base text-[#218653]">${totalDue.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD</span>
              </div>
            </div>

            {/* Submit Action */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleExecutePayment}
                className="w-full py-3.5 px-4 rounded-xl bg-[#218653] text-white hover:bg-[#1B4D36] text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {activeRail === 'wire' && `Simulate Wire Execution & Escrow Lock ($${totalDue.toLocaleString()})`}
                  {activeRail === 'card' && `Authorize Card & Lock Escrow ($${totalDue.toLocaleString()})`}
                  {activeRail === 'ach' && `Execute Direct Debit ($${totalDue.toLocaleString()})`}
                </span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <p className="text-[10px] text-center text-[#69746D]">
                Demo Mode: Simulated transaction with instant settlement validation and registry certificate generation.
              </p>
            </div>

          </div>
        )}

      </div>
    </Modal>
  );
};
