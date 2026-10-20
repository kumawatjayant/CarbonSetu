import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DemoBadge } from '../../components/common/DemoBadge';
import { Mail, Send, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

interface ContactPageProps {
  navigate: (route: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ navigate }) => {
  const { submitContact, showToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [subject, setSubject] = useState('Carbon Credit Procurement Inquiry');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!consent) {
      showToast('Please check the box to consent to communications for this inquiry.', 'warning');
      return;
    }

    submitContact({
      name,
      email,
      companyName,
      subject,
      message
    });

    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div className="text-center space-y-3">
        <DemoBadge variant="inline" />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#123D2A] tracking-tight">
          Contact CarbonBridge Channel Desk
        </h1>
        <p className="text-sm text-[#69746D] max-w-xl mx-auto">
          Connect with our marketplace intermediation and portfolio structuring specialists.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Form */}
        <div className="md:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-[#DDEBDD] shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#DDEBDD] text-[#218653] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#123D2A]">Inquiry Dispatched Successfully</h3>
              <p className="text-xs text-[#69746D] max-w-sm mx-auto leading-relaxed">
                Thank you, {name}. Your inquiry has been saved into the CarbonBridge platform channel inbox. A representative will contact you at {email}.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-semibold text-[#218653] hover:underline"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#123D2A] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Elena Rostova"
                    className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#123D2A] mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#123D2A] mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Apex Global Logistics"
                    className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#123D2A] mb-1">Topic / Subject *</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653] bg-white"
                  >
                    <option value="Carbon Credit Procurement Inquiry">Corporate Credit Procurement Inquiry</option>
                    <option value="Project Developer Listing Application">Project Developer Listing Application</option>
                    <option value="Portfolio Bundling Inquiry">Custom Portfolio Bundling Inquiry</option>
                    <option value="Broker Facilitation Partnership">Broker Facilitation Partnership</option>
                    <option value="Platform Audit Question">Registry & Evidence Audit Question</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#123D2A] mb-1">Message Details *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Outline your volume requirements, project category preferences, delivery timelines, or developer listing details..."
                  className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653]"
                />
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 accent-[#218653]"
                />
                <label htmlFor="consent" className="text-[11px] text-[#69746D] leading-snug">
                  I agree that CarbonBridge may process my contact information to respond to this commercial carbon market inquiry in accordance with the Privacy Policy.
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#123D2A] hover:bg-[#1B4D36] rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Inquiry to Channel Desk</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Info */}
        <div className="md:col-span-4 space-y-4 text-xs text-[#69746D]">
          <div className="bg-[#F7F8F4] p-5 rounded-2xl border border-[#DDEBDD] space-y-3">
            <h4 className="font-bold text-[#123D2A] text-sm">Channel Partner Desk</h4>
            <p className="leading-relaxed">
              CarbonBridge coordinates introductions and commercial discussions. Unsolicited marketing or unverified project claims are discarded during qualification.
            </p>
            <div className="pt-2 border-t border-[#DDEBDD] space-y-1">
              <span className="font-semibold text-[#123D2A] block">Email Desk:</span>
              <span className="font-mono text-[#218653]">operations@carbonbridge.market</span>
            </div>
            <div className="space-y-1">
              <span className="font-semibold text-[#123D2A] block">Operating Model:</span>
              <span>B2B Intermediation & Bundling Platform</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
