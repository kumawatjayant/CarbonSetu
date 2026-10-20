import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DemoBadge } from '../../components/common/DemoBadge';
import { ProjectCategory, CarbonStandard } from '../../types';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  Upload, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

interface SellerNewListingProps {
  navigate: (route: string) => void;
  onSelectListing: (listingId: string) => void;
}

export const SellerNewListing: React.FC<SellerNewListingProps> = ({ 
  navigate,
  onSelectListing 
}) => {
  const { currentUser, createListing, showToast } = useApp();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Basic Information
  const [projectName, setProjectName] = useState('');
  const [projectCategory, setProjectCategory] = useState<ProjectCategory>('Forestry & Afforestation');
  const [country, setCountry] = useState('Colombia');
  const [region, setRegion] = useState('');
  const [projectIdentifier, setProjectIdentifier] = useState('');
  const [description, setDescription] = useState('');

  // Step 2: Credit Information
  const [quantityAvailable, setQuantityAvailable] = useState<number>(15000);
  const [quantityUnit, setQuantityUnit] = useState('tCO2e');
  const [vintageStart, setVintageStart] = useState<number>(2024);
  const [vintageEnd, setVintageEnd] = useState<number>(2025);
  const [indicativeUnitPrice, setIndicativeUnitPrice] = useState<number>(16.50);
  const [minimumQuantity, setMinimumQuantity] = useState<number>(1000);
  const [registryOrStandard, setRegistryOrStandard] = useState<CarbonStandard>('Verra VCS');
  const [methodology, setMethodology] = useState('VM0007 REDD+ Methodology v1.3');
  const [issuanceStatus, setIssuanceStatus] = useState<'Issued in Registry' | 'Expected Issuance' | 'Forward Credits'>('Issued in Registry');
  const [limitationsOrConditions, setLimitationsOrConditions] = useState('');

  // Step 3: Evidence & Documents
  const [docTitle, setDocTitle] = useState('Project Design Document (PDD)');
  const [docFileName, setDocFileName] = useState('Project_Design_Document_Final_Approved.pdf');
  const [docType, setDocType] = useState<'Project Design Doc (PDD)' | 'Third-Party Verification Statement' | 'Monitoring Report' | 'Letter of Authorization'>('Project Design Doc (PDD)');
  const [verificationEvidenceSummary, setVerificationEvidenceSummary] = useState('');

  // Step 4: Review & Terms
  const [termsAccepted, setTermsAccepted] = useState(false);

  const categories: ProjectCategory[] = [
    'Forestry & Afforestation',
    'Renewable Energy',
    'Blue Carbon & Mangroves',
    'Biochar & Soil Carbon',
    'Direct Air Capture & Mineralization',
    'Cookstoves & Community Energy'
  ];

  const standards: CarbonStandard[] = [
    'Verra VCS',
    'Gold Standard',
    'Puro.earth',
    'American Carbon Registry (ACR)',
    'Climate Action Reserve (CAR)'
  ];

  const handleNext = () => {
    if (currentStep === 1) {
      if (!projectName.trim() || !country.trim()) {
        showToast('Please provide a project name and country.', 'warning');
        return;
      }
    }
    if (currentStep === 2) {
      if (quantityAvailable <= 0) {
        showToast('Please specify a positive credit quantity.', 'warning');
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted) {
      showToast('Please accept the listing terms and unencumbered serial warranty.', 'warning');
      return;
    }

    const created = createListing({
      projectName,
      projectCategory,
      country,
      region: region || 'Regional Basin',
      projectIdentifier: projectIdentifier || 'REG-PENDING',
      description,
      quantityAvailable: Number(quantityAvailable),
      quantityUnit,
      vintageStart: Number(vintageStart),
      vintageEnd: Number(vintageEnd),
      indicativeUnitPrice: Number(indicativeUnitPrice),
      currency: 'USD',
      minimumQuantity: Number(minimumQuantity),
      registryOrStandard,
      methodology,
      issuanceStatus,
      limitationsOrConditions,
      verificationEvidenceSummary: verificationEvidenceSummary || 'Submitted with Project Design Document and preliminary VVB audit records.',
      supportingDocuments: [
        {
          id: `doc-${Date.now()}`,
          title: docTitle,
          documentType: docType,
          fileName: docFileName,
          reviewStatus: 'Pending Review'
        }
      ]
    });

    navigate('/seller/listings');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <DemoBadge variant="inline" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2A] tracking-tight mt-1">
            Submit New Credit Listing
          </h1>
          <p className="text-xs text-[#69746D] mt-0.5">
            4-step listing audit wizard. Approved records will be indexed into the CarbonBridge public marketplace.
          </p>
        </div>

        <button
          onClick={() => navigate('/seller/listings')}
          className="text-xs font-semibold text-[#69746D] hover:text-[#123D2A]"
        >
          Cancel & Exit
        </button>
      </div>

      {/* Progress Steps Header */}
      <div className="bg-white p-4 rounded-xl border border-[#DDEBDD] grid grid-cols-4 gap-2 text-xs text-center font-medium">
        {[
          { step: 1, title: 'Basic Info' },
          { step: 2, title: 'Credit Data' },
          { step: 3, title: 'Evidence & Docs' },
          { step: 4, title: 'Review & Submit' }
        ].map((s) => (
          <div
            key={s.step}
            className={`py-2 px-1 rounded-lg transition-colors ${
              currentStep === s.step
                ? 'bg-[#123D2A] text-white font-bold'
                : currentStep > s.step
                ? 'bg-[#DDEBDD]/60 text-[#218653] font-semibold'
                : 'text-[#69746D]'
            }`}
          >
            <span>{s.step}. {s.title}</span>
          </div>
        ))}
      </div>

      {/* Form Container */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#DDEBDD] shadow-sm">
        
        {/* STEP 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-4 text-xs">
            <h2 className="text-base font-bold text-[#123D2A] border-b border-[#DDEBDD] pb-2">
              Step 1: Project Identity & Location
            </h2>

            <div>
              <label className="block font-semibold text-[#123D2A] mb-1">Project Name *</label>
              <input
                type="text"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Sierra Madre Cloud Forest Canopy Conservation"
                className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#123D2A] mb-1">Project Category *</label>
                <select
                  value={projectCategory}
                  onChange={(e) => setProjectCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653] bg-white"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#123D2A] mb-1">Registry Identifier (if assigned)</label>
                <input
                  type="text"
                  value={projectIdentifier}
                  onChange={(e) => setProjectIdentifier(e.target.value)}
                  placeholder="e.g. VCS-2041 or GS-4920"
                  className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#123D2A] mb-1">Country *</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Colombia"
                  className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#123D2A] mb-1">Region / Basin</label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="e.g. Santander Highlands"
                  className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#123D2A] mb-1">Project Description & Scope</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail the project's ecological or technological mechanism, baseline emissions calculations, and community co-benefits..."
                className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653]"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Credit Information */}
        {currentStep === 2 && (
          <div className="space-y-4 text-xs">
            <h2 className="text-base font-bold text-[#123D2A] border-b border-[#DDEBDD] pb-2">
              Step 2: Credit Accounting & Pricing Parameters
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#123D2A] mb-1">Standard / Registry *</label>
                <select
                  value={registryOrStandard}
                  onChange={(e) => setRegistryOrStandard(e.target.value as any)}
                  className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653] bg-white"
                >
                  {standards.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#123D2A] mb-1">Methodology Applied</label>
                <input
                  type="text"
                  value={methodology}
                  onChange={(e) => setMethodology(e.target.value)}
                  placeholder="e.g. VM0007 REDD+ v1.3"
                  className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-[#123D2A] mb-1">Available Quantity *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={quantityAvailable}
                  onChange={(e) => setQuantityAvailable(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653] font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#123D2A] mb-1">Vintage Start Year *</label>
                <input
                  type="number"
                  required
                  value={vintageStart}
                  onChange={(e) => setVintageStart(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653] font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#123D2A] mb-1">Vintage End Year *</label>
                <input
                  type="number"
                  required
                  value={vintageEnd}
                  onChange={(e) => setVintageEnd(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653] font-mono tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-[#123D2A] mb-1">Indicative Unit Price (USD / t) *</label>
                <input
                  type="number"
                  step={0.1}
                  value={indicativeUnitPrice}
                  onChange={(e) => setIndicativeUnitPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653] font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#123D2A] mb-1">Min Order Tranche (tCO2e)</label>
                <input
                  type="number"
                  value={minimumQuantity}
                  onChange={(e) => setMinimumQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653] font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#123D2A] mb-1">Issuance Status</label>
                <select
                  value={issuanceStatus}
                  onChange={(e) => setIssuanceStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653] bg-white"
                >
                  <option value="Issued in Registry">Issued in Registry</option>
                  <option value="Expected Issuance">Expected Issuance</option>
                  <option value="Forward Credits">Forward Credits</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#123D2A] mb-1">Delivery Terms or Restrictions</label>
              <textarea
                rows={2}
                value={limitationsOrConditions}
                onChange={(e) => setLimitationsOrConditions(e.target.value)}
                placeholder="Specify minimum drawing tranches, escrow conditions, or Article 6 host-nation alignment details..."
                className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653]"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Evidence & Documents */}
        {currentStep === 3 && (
          <div className="space-y-4 text-xs">
            <h2 className="text-base font-bold text-[#123D2A] border-b border-[#DDEBDD] pb-2">
              Step 3: Verification Evidence & Registry Documents
            </h2>

            <div className="p-4 bg-[#F7F8F4] rounded-xl border border-[#DDEBDD] space-y-3">
              <h3 className="font-bold text-[#123D2A]">Primary Audit Document</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#123D2A] mb-1">Document Classification</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653] bg-white"
                  >
                    <option value="Project Design Doc (PDD)">Project Design Document (PDD)</option>
                    <option value="Third-Party Verification Statement">Third-Party Verification Statement</option>
                    <option value="Monitoring Report">Monitoring Report</option>
                    <option value="Letter of Authorization">Letter of Host-Nation Authorization</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#123D2A] mb-1">Document Title</label>
                  <input
                    type="text"
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#123D2A] mb-1">File Attachment Reference</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 bg-white border border-[#DDEBDD] rounded-lg text-[#69746D] font-mono text-[11px] truncate">
                    {docFileName}
                  </div>
                  <span className="text-[11px] text-[#218653] font-semibold bg-[#DDEBDD]/50 px-2.5 py-2 rounded">
                    Ready to attach
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#123D2A] mb-1">
                Third-Party Auditor Verification Evidence Summary
              </label>
              <textarea
                rows={3}
                value={verificationEvidenceSummary}
                onChange={(e) => setVerificationEvidenceSummary(e.target.value)}
                placeholder="State the accredited audit firm (e.g. TÜV SÜD, DNV, SustainCERT), audit dates, and key verification statements..."
                className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653]"
              />
            </div>
          </div>
        )}

        {/* STEP 4: Review and Submit */}
        {currentStep === 4 && (
          <div className="space-y-4 text-xs">
            <h2 className="text-base font-bold text-[#123D2A] border-b border-[#DDEBDD] pb-2">
              Step 4: Review Summary & Acceptance of Listing Terms
            </h2>

            <div className="bg-[#F7F8F4] p-4 rounded-xl border border-[#DDEBDD] space-y-2">
              <div className="flex justify-between font-bold text-[#123D2A] text-sm">
                <span>{projectName || 'Untitled Project'}</span>
                <span className="font-mono text-[#218653]">${indicativeUnitPrice}/t</span>
              </div>
              <div className="text-[11px] text-[#69746D] flex gap-2">
                <span>{country}</span>
                <span>·</span>
                <span>{projectCategory}</span>
                <span>·</span>
                <span>{registryOrStandard}</span>
                <span>·</span>
                <span>Vintages {vintageStart}–{vintageEnd}</span>
              </div>
              <div className="text-[11px] text-[#202923] pt-1">
                Volume Available: <strong>{quantityAvailable.toLocaleString()} {quantityUnit}</strong> (Min order: {minimumQuantity.toLocaleString()})
              </div>
            </div>

            <div className="p-4 bg-[#DDEBDD]/40 border border-[#DDEBDD] rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-[#123D2A]">
                <ShieldCheck className="w-4 h-4 text-[#218653]" />
                <span>Supplier Listing Warranty & Anti-Double-Counting Undertaking</span>
              </div>
              <p className="text-[11px] text-[#69746D] leading-relaxed">
                By submitting this listing for administrator review, you warrant that your organization holds legal authority to market these credits, that the serial inventory is free of conflicting pledges, and that fees become due solely under executed bilateral agreements.
              </p>
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="listingTerms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 accent-[#218653]"
              />
              <label htmlFor="listingTerms" className="text-[11px] text-[#123D2A] font-semibold leading-snug">
                I confirm the accuracy of this listing data and submit it for CarbonBridge channel partner review.
              </label>
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-[#DDEBDD] mt-6">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="px-4 py-2 text-xs font-semibold text-[#69746D] hover:text-[#123D2A] disabled:opacity-30 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#123D2A] hover:bg-[#1B4D36] rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-[#218653] hover:bg-[#1B4D36] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>Submit for Administrator Review</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
