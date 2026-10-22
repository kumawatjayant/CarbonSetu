import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { PaymentRecord } from '../../types';
import { Logo } from '../common/Logo';
import { 
  Printer, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  Check, 
  Lock, 
  BadgeCheck, 
  Share2,
  FileCheck
} from 'lucide-react';

interface PaymentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentRecord | null;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  isOpen,
  onClose,
  payment
}) => {
  const [copied, setCopied] = useState(false);

  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(`${payment.certificateNumber} | ${payment.escrowReference} | Hash: 0x9f8e4a77b2190cd4`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Escrow Settlement Certificate"
      subtitle="CarbonBridge Custody Clearinghouse & Verified Registry Lock Statement"
      maxWidth="lg"
    >
      <div className="space-y-6">
        
        {/* Printable Certificate Frame */}
        <div id="certificate-print-area" className="relative p-6 sm:p-8 bg-[#F7F8F4] border-2 border-[#123D2A] rounded-2xl shadow-inner space-y-6 overflow-hidden">
          
          {/* Subtle Decorative Background Watermark */}
          <div className="absolute right-0 bottom-0 pointer-events-none opacity-[0.04] select-none text-[180px] font-black text-[#123D2A] leading-none -mr-10 -mb-10">
            CB
          </div>

          {/* Certificate Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-[#123D2A]/20 pb-5">
            <div className="space-y-1">
              <Logo size="md" />
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#218653] font-bold">
                CLIMATE ASSET ESCROW CUSTODY CERTIFICATE
              </p>
            </div>

            <div className="text-right space-y-0.5">
              <span className="text-[9px] uppercase font-mono tracking-wider text-[#69746D] block">
                CERTIFICATE SERIAL
              </span>
              <span className="text-sm font-black font-mono text-[#123D2A]">
                {payment.certificateNumber}
              </span>
              <div className="text-[10px] text-[#69746D] font-mono">
                {new Date(payment.timestamp).toUTCString()}
              </div>
            </div>
          </div>

          {/* Core Attestation Banner */}
          <div className="bg-white p-5 rounded-xl border border-[#DDEBDD] space-y-2 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDEBDD] text-[#218653] text-[11px] font-bold uppercase tracking-wider">
              <BadgeCheck className="w-4 h-4" />
              <span>Verified Custody Escrow Lock</span>
            </div>
            <h3 className="text-lg font-extrabold text-[#123D2A]">
              Attestation of Carbon Purchase & Escrow Settlement
            </h3>
            <p className="text-xs text-[#69746D] max-w-xl mx-auto leading-relaxed">
              This institutional certificate confirms that corporate funds have been irrevocably settled through CarbonBridge independent escrow custody to lock and allocate the verified carbon environmental assets detailed below.
            </p>
          </div>

          {/* Detailed Transaction Parameters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-white p-4 rounded-xl border border-[#DDEBDD] space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#69746D] block font-semibold">
                PROCUREMENT BENEFICIARY
              </span>
              <div className="font-extrabold text-[#123D2A] text-sm">{payment.payerCompany}</div>
              <div className="text-[11px] text-[#69746D]">
                Authorized Representative: <strong className="text-[#123D2A]">{payment.payerName}</strong>
              </div>
              <div className="text-[11px] text-[#69746D]">
                Settlement Rail: <strong className="text-[#123D2A]">{payment.paymentMethod}</strong>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#DDEBDD] space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#69746D] block font-semibold">
                ASSET ALLOCATION & VOLUME
              </span>
              <div className="font-extrabold text-[#218653] text-sm truncate">{payment.itemTitle}</div>
              <div className="text-[11px] text-[#69746D]">
                Transacted Volume: <strong className="font-mono text-[#123D2A]">{payment.quantity.toLocaleString()} {payment.quantityUnit}</strong>
              </div>
              <div className="text-[11px] text-[#69746D]">
                Total Escrow Settled: <strong className="font-mono text-[#123D2A]">${payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {payment.currency}</strong>
              </div>
            </div>
          </div>

          {/* Escrow Custody Ledger Strip */}
          <div className="bg-white p-4 rounded-xl border border-[#DDEBDD] text-xs space-y-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#DDEBDD] pb-2">
              <div>
                <span className="text-[10px] text-[#69746D] block">Registry Serial Batch / Holding ID</span>
                <span className="font-mono font-bold text-[#123D2A]">{payment.registrySerialBatch}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#69746D] block">Escrow Reference Tag</span>
                <span className="font-mono font-bold text-[#218653]">{payment.escrowReference}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 text-[11px] text-[#69746D]">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#218653]" />
                <span>Custody Depository: <strong className="text-[#123D2A]">Silicon Climate Bank, London Custody Hub</strong></span>
              </div>
              <div>
                Deal Link: <strong className="font-mono text-[#123D2A]">{payment.dealReference || 'Direct Marketplace Settle'}</strong>
              </div>
            </div>
          </div>

          {/* Cryptographic Signature & Seals */}
          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs border-t border-[#DDEBDD]">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#69746D] block">CRYPTOGRAPHIC AUDIT PROOF (SHA-256)</span>
              <div className="flex items-center gap-2">
                <code className="font-mono text-[10px] bg-white px-2 py-1 rounded border border-[#DDEBDD] text-[#123D2A]">
                  0x9f8e4a77...b2190cd4
                </code>
                <button
                  type="button"
                  onClick={handleCopyHash}
                  className="text-[#218653] hover:text-[#123D2A] p-1 text-[11px] flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3 text-[#218653]" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="flex items-center justify-end gap-1 text-[#218653] font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>CarbonBridge Authorized Issuer</span>
              </div>
              <p className="text-[10px] text-[#69746D]">
                Independent Channel Partner & Escrow Facility
              </p>
            </div>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-xs text-[#69746D]">
            Official proof for corporate Scope 1/2 ESG reporting and registry audit.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#123D2A] text-white hover:bg-[#1B4D36] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save Certificate PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white text-[#123D2A] border border-[#DDEBDD] hover:bg-[#F7F8F4] text-xs font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </Modal>
  );
};
