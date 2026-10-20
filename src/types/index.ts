export type UserRole = 'buyer' | 'seller' | 'admin';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  companyName: string;
  jobTitle?: string;
  country: string;
  phone?: string;
  website?: string;
  accountStatus: 'active' | 'pending_verification' | 'suspended';
  companyType?: 'developer' | 'corporate_buyer' | 'broker' | 'fund';
  businessDescription?: string;
  createdAt: string;
}

export type ProjectCategory = 
  | 'Forestry & Afforestation'
  | 'Renewable Energy'
  | 'Blue Carbon & Mangroves'
  | 'Biochar & Soil Carbon'
  | 'Direct Air Capture & Mineralization'
  | 'Cookstoves & Community Energy';

export type CarbonStandard = 
  | 'Verra VCS'
  | 'Gold Standard'
  | 'Puro.earth'
  | 'American Carbon Registry (ACR)'
  | 'Climate Action Reserve (CAR)'
  | 'Pending Standard Review';

export type ListingStatus = 
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'changes_requested'
  | 'approved'
  | 'rejected'
  | 'suspended'
  | 'archived';

export interface CreditListing {
  id: string;
  projectId: string;
  projectName: string;
  projectCategory: ProjectCategory;
  projectDeveloper: string;
  sellerId: string;
  sellerDisplayName: string;
  country: string;
  region: string;
  projectIdentifier?: string; // e.g., VCS-1942
  registryOrStandard: CarbonStandard;
  methodology?: string; // e.g., VM0007 REDD+
  verificationStatus: 'Verified & Certified' | 'Under Audit' | 'Pending Verification' | 'Self-Reported Only';
  verificationEvidenceSummary?: string;
  vintageStart: number;
  vintageEnd: number;
  quantityAvailable: number; // in tCO2e
  quantityUnit: string; // default "tCO2e"
  indicativeUnitPrice?: number; // USD per tCO2e
  currency: string; // default "USD"
  minimumQuantity: number;
  issuanceStatus: 'Issued in Registry' | 'Expected Issuance' | 'Forward Credits' | 'Pending Deposit';
  retirementStatus?: 'Active Inventory' | 'Partially Retired' | 'Custom Buffer';
  description: string;
  limitationsOrConditions?: string;
  supportingDocuments: {
    id: string;
    title: string;
    documentType: 'Project Design Doc (PDD)' | 'Monitoring Report' | 'Third-Party Verification Statement' | 'Letter of Authorization';
    fileName: string;
    reviewStatus: 'Verified' | 'Pending Review' | 'Flagged';
  }[];
  listingStatus: ListingStatus;
  adminReviewNotes?: string;
  demoRecord: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BundleComponent {
  listingId: string;
  allocatedQuantity: number;
  quantityUnit: string;
  projectName: string;
  category: ProjectCategory;
  standard: CarbonStandard;
  vintage: string;
  country: string;
  indicativeUnitPrice?: number;
}

export interface CarbonBundle {
  id: string;
  bundleName: string;
  description: string;
  bundleCategory: 'Renewable Energy Portfolio' | 'Nature and Forestry Portfolio' | 'Mixed Project Portfolio' | 'High-Durability CDR Portfolio' | 'Buyer-Customized Portfolio';
  components: BundleComponent[];
  totalQuantity: number;
  quantityUnit: string;
  weightedAveragePrice?: number;
  isCurrenciesCompatible: boolean;
  bundleStatus: 'active' | 'draft' | 'archived';
  demoRecord: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface BuyerRequirement {
  id: string;
  buyerId: string;
  buyerName: string;
  companyName: string;
  title: string;
  desiredQuantity: number;
  quantityUnit: string;
  preferredCategories: ProjectCategory[];
  preferredCountries?: string[];
  vintageRange?: { start: number; end: number };
  preferredStandards?: CarbonStandard[];
  budgetMin?: number;
  budgetMax?: number;
  currency: string;
  intendedUse: 'Corporate Scope 1/2 Offset' | 'Value Chain Scope 3 Neutralization' | 'Compliance Buffer' | 'Portfolio Resale' | 'ESG Reporting';
  preferredTimeframe: string;
  documentationRequirements?: string;
  status: 'open' | 'matched' | 'in_negotiation' | 'fulfilled' | 'closed';
  createdAt: string;
}

export type DealStage = 
  | 'New Inquiry'
  | 'Qualification'
  | 'Seller Matched'
  | 'Quote Requested'
  | 'Quote Submitted'
  | 'Negotiation'
  | 'Agreement Pending'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled'
  | 'Disputed';

export interface InquiryMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  isInternalNote?: boolean; // Only visible to admin/broker!
}

export interface CommercialQuote {
  id: string;
  inquiryId: string;
  submittedBy: string; // seller or admin
  quantity: number;
  unitPrice: number;
  currency: string;
  deliveryTimeline: string;
  registryAccountTerms: string;
  validUntil: string;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  notes?: string;
  createdAt: string;
}

export interface InquiryDeal {
  id: string;
  referenceNumber: string; // e.g., "CB-2026-8812"
  buyerId: string;
  buyerName: string;
  buyerCompany: string;
  buyerEmail: string;
  sellerId?: string;
  sellerName?: string;
  sellerCompany?: string;
  listingId?: string;
  listingName?: string;
  bundleId?: string;
  bundleName?: string;
  requestedQuantity: number;
  quantityUnit: string;
  indicativeBudget?: number;
  currency: string;
  intendedUse: string;
  assignedAdminId?: string;
  assignedAdminName?: string;
  stage: DealStage;
  messages: InquiryMessage[];
  quotes: CommercialQuote[];
  agreedQuantity?: number;
  agreedUnitPrice?: number;
  agreedTotalValue?: number;
  agreedCommissionRate?: number; // e.g., 3.5%
  agreedFixedFee?: number;
  closureReason?: string;
  demoRecord: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommissionRecord {
  id: string;
  dealId: string;
  dealReference: string;
  buyerCompany: string;
  sellerCompany: string;
  transactionQuantity: number;
  quantityUnit: string;
  agreedUnitPrice: number;
  currency: string;
  eligibleTransactionValue: number;
  commissionRate: number; // percentage, e.g. 3.5%
  fixedFee: number;
  totalPlatformFee: number;
  netCommissionDue: number;
  amountPaid: number;
  commissionPayer: 'Seller (Deducted)' | 'Buyer (Added Facilitation)' | 'Split 50/50';
  status: 'unpaid' | 'paid' | 'overdue' | 'waived' | 'disputed';
  termsSummary: string;
  demoRecord: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogItem {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: 'listing' | 'bundle' | 'deal' | 'user' | 'commission';
  entityId: string;
  changeSummary: string;
  timestamp: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  companyName: string;
  subject: string;
  message: string;
  status: 'new' | 'reviewed' | 'resolved';
  createdAt: string;
}
