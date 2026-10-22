import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  UserRole, 
  CreditListing, 
  CarbonBundle, 
  BuyerRequirement, 
  InquiryDeal, 
  CommercialQuote,
  CommissionRecord, 
  AuditLogItem, 
  ContactSubmission,
  ListingStatus,
  DealStage,
  PaymentRecord
} from '../types';
import { 
  DEMO_USERS, 
  DEMO_LISTINGS, 
  DEMO_BUNDLES, 
  DEMO_REQUIREMENTS, 
  DEMO_DEALS, 
  DEMO_COMMISSIONS, 
  DEMO_AUDIT_LOGS,
  DEMO_PAYMENTS
} from '../data/demoData';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'error' | 'warning';
  message: string;
}

interface AppContextType {
  currentUser: UserProfile | null;
  users: UserProfile[];
  loginAs: (role: UserRole | 'guest', userId?: string) => void;
  logout: () => void;
  registerUser: (userData: Omit<UserProfile, 'id' | 'createdAt'>) => UserProfile;
  updateUserProfile: (userId: string, updates: Partial<UserProfile>) => void;

  // Listings
  listings: CreditListing[];
  createListing: (data: Partial<CreditListing>) => CreditListing;
  updateListing: (id: string, updates: Partial<CreditListing>) => void;
  updateListingStatus: (id: string, status: ListingStatus, notes?: string) => void;
  savedListingIds: string[];
  toggleSaveListing: (id: string) => void;

  // Bundles
  bundles: CarbonBundle[];
  createBundle: (data: Omit<CarbonBundle, 'id' | 'createdAt' | 'updatedAt'>) => CarbonBundle;
  updateBundle: (id: string, updates: Partial<CarbonBundle>) => void;
  savedBundleIds: string[];
  toggleSaveBundle: (id: string) => void;

  // Buyer Requirements
  requirements: BuyerRequirement[];
  createRequirement: (data: Omit<BuyerRequirement, 'id' | 'createdAt'>) => BuyerRequirement;
  updateRequirement: (id: string, updates: Partial<BuyerRequirement>) => void;

  // Inquiries and Deals
  deals: InquiryDeal[];
  createInquiry: (
    data: {
      listingId?: string;
      bundleId?: string;
      requestedQuantity: number;
      intendedUse: string;
      message: string;
      indicativeBudget?: number;
    }
  ) => InquiryDeal | null;
  addMessageToDeal: (dealId: string, text: string, isInternalNote?: boolean) => void;
  submitQuoteToDeal: (dealId: string, quoteData: Omit<CommercialQuote, 'id' | 'inquiryId' | 'createdAt'>) => void;
  updateDealQuoteStatus: (dealId: string, quoteId: string, status: 'accepted' | 'rejected') => void;
  updateDealStage: (
    dealId: string, 
    newStage: DealStage, 
    commercialData?: { 
      agreedQuantity?: number; 
      agreedUnitPrice?: number; 
      agreedTotalValue?: number; 
      agreedCommissionRate?: number; 
      agreedFixedFee?: number; 
      closureReason?: string;
    }
  ) => void;
  assignDealAdmin: (dealId: string, adminId: string, adminName: string) => void;

  // Commissions
  commissions: CommissionRecord[];
  updateCommissionStatus: (id: string, status: CommissionRecord['status']) => void;

  // Payments & Escrow Settlement
  payments: PaymentRecord[];
  processPayment: (paymentData: Omit<PaymentRecord, 'id' | 'timestamp' | 'certificateNumber'>) => PaymentRecord;

  // Contacts & Newsletter
  contactSubmissions: ContactSubmission[];
  submitContact: (sub: Omit<ContactSubmission, 'id' | 'createdAt' | 'status'>) => void;
  newsletterSubscribers: string[];
  subscribeNewsletter: (email: string) => boolean;

  // Audit Logs
  auditLogs: AuditLogItem[];

  // Demo Reset
  resetDemoData: () => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'carbonbridge_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from localStorage or defaults
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}users`);
    return saved ? JSON.parse(saved) : DEMO_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}currentUser`);
    if (saved) return JSON.parse(saved);
    // default to demo buyer for preview experience
    return DEMO_USERS[0];
  });

  const [listings, setListings] = useState<CreditListing[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}listings`);
    return saved ? JSON.parse(saved) : DEMO_LISTINGS;
  });

  const [bundles, setBundles] = useState<CarbonBundle[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}bundles`);
    return saved ? JSON.parse(saved) : DEMO_BUNDLES;
  });

  const [requirements, setRequirements] = useState<BuyerRequirement[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}requirements`);
    return saved ? JSON.parse(saved) : DEMO_REQUIREMENTS;
  });

  const [deals, setDeals] = useState<InquiryDeal[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}deals`);
    return saved ? JSON.parse(saved) : DEMO_DEALS;
  });

  const [commissions, setCommissions] = useState<CommissionRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}commissions`);
    return saved ? JSON.parse(saved) : DEMO_COMMISSIONS;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}payments`);
    return saved ? JSON.parse(saved) : DEMO_PAYMENTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}auditLogs`);
    return saved ? JSON.parse(saved) : DEMO_AUDIT_LOGS;
  });

  const [savedListingIds, setSavedListingIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}savedListings`);
    return saved ? JSON.parse(saved) : ['list-101', 'list-104'];
  });

  const [savedBundleIds, setSavedBundleIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}savedBundles`);
    return saved ? JSON.parse(saved) : ['bndl-1'];
  });

  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}contacts`);
    return saved ? JSON.parse(saved) : [];
  });

  const [newsletterSubscribers, setNewsletterSubscribers] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}newsletter`);
    return saved ? JSON.parse(saved) : [];
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Synchronize state changes to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}currentUser`, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}listings`, JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}bundles`, JSON.stringify(bundles));
  }, [bundles]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}requirements`, JSON.stringify(requirements));
  }, [requirements]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}deals`, JSON.stringify(deals));
  }, [deals]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}commissions`, JSON.stringify(commissions));
  }, [commissions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}payments`, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}auditLogs`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}savedListings`, JSON.stringify(savedListingIds));
  }, [savedListingIds]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}savedBundles`, JSON.stringify(savedBundleIds));
  }, [savedBundleIds]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}contacts`, JSON.stringify(contactSubmissions));
  }, [contactSubmissions]);

  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const logAudit = (action: string, entityType: AuditLogItem['entityType'], entityId: string, changeSummary: string) => {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      actorId: currentUser ? currentUser.id : 'guest',
      actorName: currentUser ? currentUser.fullName : 'Guest Visitor',
      actorRole: currentUser ? currentUser.role : 'buyer',
      action,
      entityType,
      entityId,
      changeSummary,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Auth operations
  const loginAs = (role: UserRole | 'guest', userId?: string) => {
    if (role === 'guest') {
      setCurrentUser(null);
      showToast('Logged out to public guest view.', 'info');
      return;
    }

    let user: UserProfile | undefined;
    if (userId) {
      user = users.find(u => u.id === userId);
    } else {
      user = users.find(u => u.role === role);
    }

    if (user) {
      setCurrentUser(user);
      showToast(`Switched account to ${user.fullName} (${user.role.toUpperCase()})`, 'success');
      logAudit('Session Login', 'user', user.id, `Logged in as ${user.role}: ${user.companyName}`);
    }
  };

  const logout = () => {
    if (currentUser) {
      logAudit('Session Logout', 'user', currentUser.id, `User logged out: ${currentUser.email}`);
    }
    setCurrentUser(null);
    showToast('Signed out successfully.', 'info');
  };

  const registerUser = (userData: Omit<UserProfile, 'id' | 'createdAt'>): UserProfile => {
    const newUser: UserProfile = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    logAudit('Account Registration', 'user', newUser.id, `Registered new ${newUser.role} account for ${newUser.companyName}`);
    showToast(`Welcome to CarbonBridge, ${newUser.fullName}!`, 'success');
    return newUser;
  };

  const updateUserProfile = (userId: string, updates: Partial<UserProfile>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    }
    logAudit('Profile Update', 'user', userId, `Updated company/profile details for user ID: ${userId}`);
    showToast('Profile updated successfully.', 'success');
  };

  // Listings operations
  const createListing = (data: Partial<CreditListing>): CreditListing => {
    const id = `list-${Date.now()}`;
    const newListing: CreditListing = {
      id,
      projectId: data.projectId || `PRJ-${Date.now().toString().slice(-5)}`,
      projectName: data.projectName || 'New Project Listing',
      projectCategory: data.projectCategory || 'Forestry & Afforestation',
      projectDeveloper: data.projectDeveloper || (currentUser ? currentUser.companyName : 'Independent Developer'),
      sellerId: currentUser ? currentUser.id : 'user-seller-1',
      sellerDisplayName: currentUser ? currentUser.companyName : 'Solaria Energy & Nature Capital',
      country: data.country || 'International',
      region: data.region || 'Regional Basin',
      projectIdentifier: data.projectIdentifier || 'REG-PENDING',
      registryOrStandard: data.registryOrStandard || 'Verra VCS',
      methodology: data.methodology || 'Standard Carbon Accounting Methodology',
      verificationStatus: data.verificationStatus || 'Under Audit',
      verificationEvidenceSummary: data.verificationEvidenceSummary || 'Submitted for preliminary documentation audit.',
      vintageStart: data.vintageStart || 2024,
      vintageEnd: data.vintageEnd || 2025,
      quantityAvailable: Number(data.quantityAvailable) || 5000,
      quantityUnit: data.quantityUnit || 'tCO2e',
      indicativeUnitPrice: data.indicativeUnitPrice ? Number(data.indicativeUnitPrice) : undefined,
      currency: data.currency || 'USD',
      minimumQuantity: Number(data.minimumQuantity) || 500,
      issuanceStatus: data.issuanceStatus || 'Expected Issuance',
      retirementStatus: 'Active Inventory',
      description: data.description || '',
      limitationsOrConditions: data.limitationsOrConditions || '',
      supportingDocuments: data.supportingDocuments || [],
      listingStatus: 'under_review', // Listings require admin approval before going live
      demoRecord: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setListings(prev => [newListing, ...prev]);
    logAudit('Listing Created', 'listing', newListing.id, `Created listing: ${newListing.projectName} (${newListing.quantityAvailable} ${newListing.quantityUnit}) awaiting review.`);
    showToast('Listing submitted! It is now under review by CarbonBridge platform administrators.', 'success');
    return newListing;
  };

  const updateListing = (id: string, updates: Partial<CreditListing>) => {
    setListings(prev => prev.map(l => {
      if (l.id === id) {
        return { ...l, ...updates, updatedAt: new Date().toISOString() };
      }
      return l;
    }));
    logAudit('Listing Updated', 'listing', id, `Updated listing attributes.`);
    showToast('Listing updated successfully.', 'success');
  };

  const updateListingStatus = (id: string, status: ListingStatus, notes?: string) => {
    setListings(prev => prev.map(l => {
      if (l.id === id) {
        return { 
          ...l, 
          listingStatus: status, 
          adminReviewNotes: notes || l.adminReviewNotes,
          updatedAt: new Date().toISOString() 
        };
      }
      return l;
    }));
    logAudit('Listing Status Changed', 'listing', id, `Status changed to ${status.toUpperCase()}${notes ? `. Notes: ${notes}` : ''}`);
    showToast(`Listing status updated to ${status}.`, 'info');
  };

  const toggleSaveListing = (id: string) => {
    setSavedListingIds(prev => {
      if (prev.includes(id)) {
        showToast('Removed listing from saved items.', 'info');
        return prev.filter(item => item !== id);
      } else {
        showToast('Listing saved to your watchlist.', 'success');
        return [...prev, id];
      }
    });
  };

  // Bundles operations
  const createBundle = (data: Omit<CarbonBundle, 'id' | 'createdAt' | 'updatedAt'>): CarbonBundle => {
    const id = `bndl-${Date.now()}`;
    const newBundle: CarbonBundle = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setBundles(prev => [newBundle, ...prev]);
    logAudit('Bundle Created', 'bundle', id, `Created bundle: ${newBundle.bundleName} (${newBundle.totalQuantity} ${newBundle.quantityUnit})`);
    showToast(`Bundle "${newBundle.bundleName}" created!`, 'success');
    return newBundle;
  };

  const updateBundle = (id: string, updates: Partial<CarbonBundle>) => {
    setBundles(prev => prev.map(b => {
      if (b.id === id) {
        return { ...b, ...updates, updatedAt: new Date().toISOString() };
      }
      return b;
    }));
    logAudit('Bundle Updated', 'bundle', id, `Modified bundle attributes.`);
    showToast('Bundle updated.', 'success');
  };

  const toggleSaveBundle = (id: string) => {
    setSavedBundleIds(prev => {
      if (prev.includes(id)) {
        showToast('Removed bundle from saved portfolios.', 'info');
        return prev.filter(b => b !== id);
      } else {
        showToast('Bundle added to saved portfolios.', 'success');
        return [...prev, id];
      }
    });
  };

  // Buyer Requirements operations
  const createRequirement = (data: Omit<BuyerRequirement, 'id' | 'createdAt'>): BuyerRequirement => {
    const id = `req-${Date.now()}`;
    const newReq: BuyerRequirement = {
      ...data,
      id,
      createdAt: new Date().toISOString()
    };
    setRequirements(prev => [newReq, ...prev]);
    logAudit('Purchase Requirement Posted', 'deal', id, `Buyer posted requirement: ${newReq.title} (${newReq.desiredQuantity} ${newReq.quantityUnit})`);
    showToast('Purchase requirement created and entered into the CarbonBridge matching pipeline.', 'success');
    return newReq;
  };

  const updateRequirement = (id: string, updates: Partial<BuyerRequirement>) => {
    setRequirements(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    showToast('Purchase requirement updated.', 'info');
  };

  // Deals and Inquiries operations
  const createInquiry = (data: {
    listingId?: string;
    bundleId?: string;
    requestedQuantity: number;
    intendedUse: string;
    message: string;
    indicativeBudget?: number;
  }): InquiryDeal | null => {
    if (!currentUser) {
      showToast('Please sign in or select a demo account to submit an inquiry.', 'warning');
      return null;
    }

    const id = `deal-${Date.now()}`;
    const referenceNumber = `CB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    let listingName: string | undefined;
    let sellerId: string | undefined;
    let sellerName: string | undefined;
    let sellerCompany: string | undefined;

    if (data.listingId) {
      const listing = listings.find(l => l.id === data.listingId);
      if (listing) {
        listingName = listing.projectName;
        sellerId = listing.sellerId;
        sellerCompany = listing.sellerDisplayName;
        sellerName = listing.projectDeveloper;
      }
    }

    let bundleName: string | undefined;
    if (data.bundleId) {
      const bundle = bundles.find(b => b.id === data.bundleId);
      if (bundle) {
        bundleName = bundle.bundleName;
        // In bundles, CarbonBridge channel desk acts as initial intermediary
        sellerCompany = 'Channel Partner Curated Syndicate';
      }
    }

    const newDeal: InquiryDeal = {
      id,
      referenceNumber,
      buyerId: currentUser.id,
      buyerName: currentUser.fullName,
      buyerCompany: currentUser.companyName,
      buyerEmail: currentUser.email,
      sellerId,
      sellerName,
      sellerCompany,
      listingId: data.listingId,
      listingName,
      bundleId: data.bundleId,
      bundleName,
      requestedQuantity: Number(data.requestedQuantity),
      quantityUnit: 'tCO2e',
      indicativeBudget: data.indicativeBudget ? Number(data.indicativeBudget) : undefined,
      currency: 'USD',
      intendedUse: data.intendedUse,
      assignedAdminId: 'user-admin-1',
      assignedAdminName: 'Aarav Patel',
      stage: 'New Inquiry',
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.fullName,
          senderRole: currentUser.role,
          text: data.message,
          timestamp: new Date().toISOString()
        }
      ],
      quotes: [],
      agreedCommissionRate: 3.5, // Default platform channel rate 3.5%
      demoRecord: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setDeals(prev => [newDeal, ...prev]);
    logAudit('Inquiry Submitted', 'deal', id, `Ref: ${referenceNumber} created by ${currentUser.companyName} for ${data.requestedQuantity} tCO2e.`);
    showToast(`Inquiry ${referenceNumber} submitted! Assigned to CarbonBridge channel partner desk.`, 'success');
    return newDeal;
  };

  const addMessageToDeal = (dealId: string, text: string, isInternalNote = false) => {
    if (!currentUser) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.fullName + (isInternalNote ? ' (Channel Partner Internal)' : ''),
      senderRole: currentUser.role,
      text,
      timestamp: new Date().toISOString(),
      isInternalNote
    };

    setDeals(prev => prev.map(d => {
      if (d.id === dealId) {
        return {
          ...d,
          messages: [...d.messages, newMessage],
          updatedAt: new Date().toISOString()
        };
      }
      return d;
    }));

    showToast(isInternalNote ? 'Internal note saved (private to channel partner).' : 'Message sent.', 'success');
  };

  const submitQuoteToDeal = (dealId: string, quoteData: Omit<CommercialQuote, 'id' | 'inquiryId' | 'createdAt'>) => {
    const newQuote: CommercialQuote = {
      ...quoteData,
      id: `quote-${Date.now()}`,
      inquiryId: dealId,
      createdAt: new Date().toISOString()
    };

    setDeals(prev => prev.map(d => {
      if (d.id === dealId) {
        return {
          ...d,
          stage: 'Quote Submitted',
          quotes: [...d.quotes, newQuote],
          updatedAt: new Date().toISOString()
        };
      }
      return d;
    }));

    logAudit('Quote Submitted', 'deal', dealId, `Submitted commercial quote at $${quoteData.unitPrice}/tCO2e for ${quoteData.quantity} tCO2e.`);
    showToast('Commercial quote submitted for buyer review.', 'success');
  };

  const updateDealQuoteStatus = (dealId: string, quoteId: string, status: 'accepted' | 'rejected') => {
    setDeals(prev => prev.map(d => {
      if (d.id === dealId) {
        const updatedQuotes = d.quotes.map(q => q.id === quoteId ? { ...q, status } : q);
        const targetQuote = d.quotes.find(q => q.id === quoteId);

        let newStage: DealStage = d.stage;
        let agreedQuantity = d.agreedQuantity;
        let agreedUnitPrice = d.agreedUnitPrice;
        let agreedTotalValue = d.agreedTotalValue;

        if (status === 'accepted' && targetQuote) {
          newStage = 'Agreement Pending';
          agreedQuantity = targetQuote.quantity;
          agreedUnitPrice = targetQuote.unitPrice;
          agreedTotalValue = targetQuote.quantity * targetQuote.unitPrice;
        }

        return {
          ...d,
          quotes: updatedQuotes,
          stage: newStage,
          agreedQuantity,
          agreedUnitPrice,
          agreedTotalValue,
          updatedAt: new Date().toISOString()
        };
      }
      return d;
    }));

    logAudit('Quote Status Updated', 'deal', dealId, `Quote status changed to ${status.toUpperCase()}`);
    showToast(`Quote has been marked as ${status}.`, 'info');
  };

  const updateDealStage = (
    dealId: string, 
    newStage: DealStage, 
    commercialData?: { 
      agreedQuantity?: number; 
      agreedUnitPrice?: number; 
      agreedTotalValue?: number; 
      agreedCommissionRate?: number; 
      agreedFixedFee?: number; 
      closureReason?: string;
    }
  ) => {
    let dealTarget: InquiryDeal | undefined;

    setDeals(prev => prev.map(d => {
      if (d.id === dealId) {
        dealTarget = {
          ...d,
          stage: newStage,
          agreedQuantity: commercialData?.agreedQuantity !== undefined ? commercialData.agreedQuantity : d.agreedQuantity,
          agreedUnitPrice: commercialData?.agreedUnitPrice !== undefined ? commercialData.agreedUnitPrice : d.agreedUnitPrice,
          agreedTotalValue: commercialData?.agreedTotalValue !== undefined ? commercialData.agreedTotalValue : d.agreedTotalValue,
          agreedCommissionRate: commercialData?.agreedCommissionRate !== undefined ? commercialData.agreedCommissionRate : d.agreedCommissionRate,
          agreedFixedFee: commercialData?.agreedFixedFee !== undefined ? commercialData.agreedFixedFee : d.agreedFixedFee,
          closureReason: commercialData?.closureReason || d.closureReason,
          updatedAt: new Date().toISOString()
        };
        return dealTarget;
      }
      return d;
    }));

    // If deal transitioned to 'Completed', automatically generate or update commission record
    if (newStage === 'Completed' && dealTarget) {
      const qty = dealTarget.agreedQuantity || dealTarget.requestedQuantity || 0;
      const unitP = dealTarget.agreedUnitPrice || 10;
      const totalVal = dealTarget.agreedTotalValue || (qty * unitP);
      const rate = dealTarget.agreedCommissionRate || 3.5;
      const fixed = dealTarget.agreedFixedFee || 500;
      const platformFee = (totalVal * (rate / 100)) + fixed;

      const existingComm = commissions.find(c => c.dealId === dealId);
      if (!existingComm) {
        const newComm: CommissionRecord = {
          id: `comm-${Date.now()}`,
          dealId,
          dealReference: dealTarget.referenceNumber,
          buyerCompany: dealTarget.buyerCompany,
          sellerCompany: dealTarget.sellerCompany || 'Designated Carbon Developer',
          transactionQuantity: qty,
          quantityUnit: 'tCO2e',
          agreedUnitPrice: unitP,
          currency: 'USD',
          eligibleTransactionValue: totalVal,
          commissionRate: rate,
          fixedFee: fixed,
          totalPlatformFee: Math.round(platformFee),
          netCommissionDue: Math.round(platformFee),
          amountPaid: 0,
          commissionPayer: 'Seller (Deducted)',
          status: 'unpaid',
          termsSummary: `${rate}% channel fee + $${fixed} facilitation fee upon verified registry delivery.`,
          demoRecord: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setCommissions(prev => [newComm, ...prev]);
        logAudit('Commission Generated', 'commission', newComm.id, `Created commission record for deal ${dealTarget.referenceNumber}: $${platformFee.toFixed(2)} due.`);
      }
    }

    logAudit('Deal Stage Changed', 'deal', dealId, `Stage advanced to: ${newStage}`);
    showToast(`Deal advanced to ${newStage}.`, 'info');
  };

  const assignDealAdmin = (dealId: string, adminId: string, adminName: string) => {
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, assignedAdminId: adminId, assignedAdminName: adminName, updatedAt: new Date().toISOString() } : d));
    logAudit('Deal Reassigned', 'deal', dealId, `Assigned channel broker to ${adminName}`);
    showToast(`Deal assigned to ${adminName}.`, 'info');
  };

  // Commissions
  const updateCommissionStatus = (id: string, status: CommissionRecord['status']) => {
    setCommissions(prev => prev.map(c => {
      if (c.id === id) {
        const amountPaid = status === 'paid' ? c.netCommissionDue : (status === 'unpaid' ? 0 : c.amountPaid);
        return { ...c, status, amountPaid, updatedAt: new Date().toISOString() };
      }
      return c;
    }));
    logAudit('Commission Status Updated', 'commission', id, `Commission status set to ${status.toUpperCase()}`);
    showToast(`Commission marked as ${status}.`, 'info');
  };

  // Contacts
  const submitContact = (sub: Omit<ContactSubmission, 'id' | 'createdAt' | 'status'>) => {
    const newSubmission: ContactSubmission = {
      ...sub,
      id: `contact-${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    setContactSubmissions(prev => [newSubmission, ...prev]);
    showToast('Your message has been received! A CarbonBridge marketplace specialist will get in touch.', 'success');
  };

  const subscribeNewsletter = (email: string): boolean => {
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid business email address.', 'error');
      return false;
    }
    if (newsletterSubscribers.includes(email.toLowerCase())) {
      showToast('This email is already subscribed to the CarbonBridge Briefing.', 'info');
      return true;
    }
    setNewsletterSubscribers(prev => [...prev, email.toLowerCase()]);
    showToast('Subscribed to CarbonBridge market intelligence briefings.', 'success');
    return true;
  };

  // Process Payment & Escrow Settlement
  const processPayment = (paymentData: Omit<PaymentRecord, 'id' | 'timestamp' | 'certificateNumber'>): PaymentRecord => {
    const id = `pay-${Date.now()}`;
    const certificateNumber = `CB-CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toISOString();

    const newPayment: PaymentRecord = {
      ...paymentData,
      id,
      certificateNumber,
      timestamp,
      registrySerialBatch: paymentData.registrySerialBatch || `VCS-BATCH-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`
    };

    setPayments(prev => [newPayment, ...prev]);

    // If linked to an inquiry or deal, transition deal to Completed
    if (paymentData.dealId) {
      updateDealStage(paymentData.dealId, 'Completed', {
        agreedQuantity: paymentData.quantity,
        agreedTotalValue: paymentData.amount,
        closureReason: `Settled via ${paymentData.paymentMethod} (Escrow Ref: ${paymentData.escrowReference})`
      });

      // Also mark commission as paid if exists
      setCommissions(prev => prev.map(c => {
        if (c.dealId === paymentData.dealId) {
          return { ...c, status: 'paid', amountPaid: c.netCommissionDue, updatedAt: new Date().toISOString() };
        }
        return c;
      }));
    }

    logAudit('Payment Settled', 'deal', id, `Settled $${paymentData.amount.toLocaleString()} for ${paymentData.quantity.toLocaleString()} ${paymentData.quantityUnit} (${paymentData.paymentMethod})`);
    showToast(`Payment of $${paymentData.amount.toLocaleString()} confirmed! Certificate ${certificateNumber} generated.`, 'success');

    return newPayment;
  };

  // Reset to original demo data
  const resetDemoData = () => {
    setUsers(DEMO_USERS);
    setCurrentUser(DEMO_USERS[0]);
    setListings(DEMO_LISTINGS);
    setBundles(DEMO_BUNDLES);
    setRequirements(DEMO_REQUIREMENTS);
    setDeals(DEMO_DEALS);
    setCommissions(DEMO_COMMISSIONS);
    setPayments(DEMO_PAYMENTS);
    setAuditLogs(DEMO_AUDIT_LOGS);
    setSavedListingIds(['list-101', 'list-104']);
    setSavedBundleIds(['bndl-1']);
    setContactSubmissions([]);
    setNewsletterSubscribers([]);

    localStorage.removeItem(`${STORAGE_KEY_PREFIX}users`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}currentUser`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}listings`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}bundles`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}requirements`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}deals`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}commissions`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}payments`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}auditLogs`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}savedListings`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}savedBundles`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}contacts`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}newsletter`);

    showToast('Application reset to default demonstration records.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        loginAs,
        logout,
        registerUser,
        updateUserProfile,
        listings,
        createListing,
        updateListing,
        updateListingStatus,
        savedListingIds,
        toggleSaveListing,
        bundles,
        createBundle,
        updateBundle,
        savedBundleIds,
        toggleSaveBundle,
        requirements,
        createRequirement,
        updateRequirement,
        deals,
        createInquiry,
        addMessageToDeal,
        submitQuoteToDeal,
        updateDealQuoteStatus,
        updateDealStage,
        assignDealAdmin,
        commissions,
        updateCommissionStatus,
        payments,
        processPayment,
        contactSubmissions,
        submitContact,
        newsletterSubscribers,
        subscribeNewsletter,
        auditLogs,
        resetDemoData,
        toasts,
        showToast,
        dismissToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
