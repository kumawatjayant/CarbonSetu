import React, { useState } from 'react';
import { CreditListing, CarbonBundle } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { ShieldCheck, Send, CheckCircle2 } from 'lucide-react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing?: CreditListing;
  bundle?: CarbonBundle;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  listing,
  bundle
}) => {
  const { currentUser, createInquiry, showToast } = useApp();

  const [quantity, setQuantity] = useState<number>(() => {
    if (listing) return Math.max(listing.minimumQuantity, 1000);
    if (bundle) return Math.min(bundle.totalQuantity, 5000);
    return 1000;
  });

  const [intendedUse, setIntendedUse] = useState<string>('Corporate Scope 1/2 Offset');
  const [indicativeBudget, setIndicativeBudget] = useState<string>('');
  const [preferredTimeframe, setPreferredTimeframe] = useState<string>('Q3-Q4 2026 Delivery');
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('Please sign in or select a demo account before requesting a quote.', 'warning');
      return;
    }

    if (quantity <= 0) {
      showToast('Please specify a positive credit quantity.', 'error');
      return;
    }

    if (listing && quantity < listing.minimumQuantity) {
      showToast(`Minimum order quantity for this project is ${listing.minimumQuantity.toLocaleString()} tCO2e.`, 'warning');
      return;
    }

    setIsSubmitting(true);

    const fullMessage = message.trim() || `Inquiry from ${currentUser.companyName} for ${quantity.toLocaleString()} tCO2e. Preferred delivery: ${preferredTimeframe}. Intended use: ${intendedUse}.`;

    const result = createInquiry({
      listingId: listing?.id,
      bundleId: bundle?.id,
      requestedQuantity: Number(quantity),
      intendedUse,
      indicativeBudget: indicativeBudget ? Number(indicativeBudget) : undefined,
      message: fullMessage
    });

    setIsSubmitting(false);

    if (result) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    }
  };

  const itemTitle = listing ? listing.projectName : bundle ? bundle.bundleName : 'Carbon Credit Inquiry';
  const unitPrice = listing?.indicativeUnitPrice || bundle?.weightedAveragePrice;
  const estimatedCost = unitPrice ? (quantity * unitPrice) : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Commercial Quote"
      subtitle={`Initiate channel-partner inquiry for: ${itemTitle}`}
      maxWidth="lg"
    >
      {submitted ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#DDEBDD] text-[#218653] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-[#123D2A]">Inquiry Successfully Dispatched</h4>
          <p className="text-xs text-[#69746D] max-w-sm mx-auto leading-relaxed">
            Your quote request has been entered into the CarbonBridge Channel Desk pipeline. A broker will review terms and coordinate with the supplier.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          {/* Item summary banner */}
          <div className="bg-[#F7F8F4] p-3.5 rounded-lg border border-[#DDEBDD] text-xs space-y-1">
            <div className="flex items-center justify-between text-[#123D2A] font-medium">
              <span className="truncate font-semibold">{itemTitle}</span>
              {unitPrice && (
                <span className="font-mono text-[#218653] font-semibold">
                  ~${unitPrice.toFixed(2)} / tCO2e (indicative)
                </span>
              )}
            </div>
            <div className="text-[11px] text-[#69746D] flex items-center gap-2">
              {listing ? (
                <>
                  <span>Standard: {listing.registryOrStandard}</span>
                  <span>·</span>
                  <span>Vintage: {listing.vintageStart}-{listing.vintageEnd}</span>
                  <span>·</span>
                  <span>Min order: {listing.minimumQuantity.toLocaleString()} tCO2e</span>
                </>
              ) : bundle ? (
                <>
                  <span>Portfolio Mix: {bundle.components.length} Projects</span>
                  <span>·</span>
                  <span>Available: {bundle.totalQuantity.toLocaleString()} tCO2e</span>
                </>
              ) : null}
            </div>
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#123D2A] mb-1">
                Requested Quantity (tCO2e) *
              </label>
              <input
                type="number"
                required
                min={listing?.minimumQuantity || 1}
                max={listing?.quantityAvailable || bundle?.totalQuantity || 1000000}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653] tabular-nums"
              />
              <span className="text-[10px] text-[#69746D] mt-0.5 block">
                Standard registry-transfer metric tons
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#123D2A] mb-1">
                Intended Application *
              </label>
              <select
                value={intendedUse}
                onChange={(e) => setIntendedUse(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653] bg-white"
              >
                <option value="Corporate Scope 1/2 Offset">Corporate Scope 1/2 Offset</option>
                <option value="Value Chain Scope 3 Neutralization">Value Chain Scope 3 Neutralization</option>
                <option value="Compliance Buffer">Compliance Buffer</option>
                <option value="Portfolio Resale">Portfolio Resale / Brokerage</option>
                <option value="ESG Reporting">CSRD & ESG Reporting</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#123D2A] mb-1">
                Target Budget (USD) <span className="text-[#69746D] font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                placeholder={estimatedCost ? `~${Math.round(estimatedCost)}` : 'Enter indicative total budget'}
                value={indicativeBudget}
                onChange={(e) => setIndicativeBudget(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653] tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#123D2A] mb-1">
                Target Delivery Window
              </label>
              <input
                type="text"
                value={preferredTimeframe}
                onChange={(e) => setPreferredTimeframe(e.target.value)}
                placeholder="e.g., September 2026"
                className="w-full text-xs px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#123D2A] mb-1">
              Commercial Terms or Special Requirements
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Specify requirements regarding Article 6 compliance, registry sub-accounts, retirement certificate wording, or payment escrow..."
              className="w-full text-xs px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653]"
            />
          </div>

          {/* Indicative estimate disclaimer */}
          {estimatedCost && (
            <div className="p-3 bg-[#DDEBDD]/30 border border-[#DDEBDD] rounded-lg flex items-start gap-2 text-xs text-[#123D2A]">
              <ShieldCheck className="w-4 h-4 text-[#218653] shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <span>Indicative Total: </span>
                <strong className="font-mono font-semibold text-[#123D2A]">
                  ${estimatedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </strong>
                <span className="text-[#69746D] block">
                  Final price, volume discounts, and payment terms will be formalized by CarbonBridge channel partners following supplier negotiation.
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#DDEBDD]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#69746D] hover:text-[#123D2A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#123D2A] hover:bg-[#1B4D36] rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-60"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Transmitting...' : 'Submit Quote Request'}</span>
            </button>
          </div>

        </form>
      )}
    </Modal>
  );
};
