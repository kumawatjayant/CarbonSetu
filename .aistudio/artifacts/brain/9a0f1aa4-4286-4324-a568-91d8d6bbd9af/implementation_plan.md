# Implementation Plan: CarbonBridge High-Fidelity Demo Payment & Escrow Settlement System

Build an interactive, enterprise-grade demonstration payment and escrow settlement engine for CarbonBridge. This enables corporate buyers to fund carbon purchases and settle channel platform commissions through realistic payment flows with animated state transitions, verifiable receipts, and automated deal stage progression.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> - **Simulated / Demo Rails Only (Confirmed)**: Zero real credit card processing or live gateway credentials required. All payment steps will use rich interactive animations (authorization, 3DS authentication, escrow lock, settlement confirmation) matching modern fintech standards (Stripe/Wise/Ramp).
> - **Dual Settlement Flow**:
>   1. **Wholesale B2B Escrow Wire (SWIFT / SEPA / Fedwire)**: For large volume deals with generated escrow reference numbers, automated wire simulation, and verification.
>   2. **Corporate Purchasing Card / Direct Debit**: For instant tranche purchases and platform commission payments with 3D Secure verification modal.
> - **Automatic State Synchronization**: Successful payment transitions deals from `Agreement Pending` to `Completed`, books paid commissions in the financial ledger, and issues a serialized CarbonBridge Retirement / Ownership Receipt.

---

## 1. Overview & Core Concept

- **What It Does**: Integrates realistic B2B checkout flows where corporate buyers can settle accepted quotes or buy standard credit tranches directly. Once payment is initiated, an animated multi-stage processing dialog authenticates the transaction, simulates registry escrow lock, and produces a tamper-evident digital receipt.
- **Where Payments Are Added**:
  1. **Buyer Inquiry & Negotiation Workspace (`/buyer/inquiries`)**: When a quote is accepted, a prominent **"Fund Escrow & Settle Payment"** button triggers the checkout flow.
  2. **Direct Instant Purchase from Marketplace (`/marketplace/:listingId` & `/bundles/:bundleId`)**: Alongside "Request Bespoke Quote", users can click **"Instant Purchase & Retire"** for standard tranches.
  3. **Admin & Seller Commission Settlement (`/admin/commissions`)**: A **"Settle Platform Commission"** flow allows simulating paying broker facilitation fees.
- **Target Persona**: Corporate sustainability directors, procurement officers, and carbon brokers managing high-value environmental transactions.

---

## 2. User Experience & Visual Design

```
┌────────────────────────────────────────────────────────────────────────┐
│                   CarbonBridge Secure Checkout Modal                  │
├────────────────────────────────────────────────────────────────────────┤
│ Order Summary: Cordillera Cloud Forest Restoration (8,000 tCO2e)       │
│ Settlement Amount: $111,200.00 USD (Includes $500 Facilitation Fee)    │
├────────────────────────────────┬───────────────────────────────────────┤
│ Select Payment Rail:           │ Payment Details:                      │
│ [x] B2B Escrow Wire Transfer   │ Beneficiary: CarbonBridge Escrow Custody│
│ [ ] Corporate Credit Card      │ Bank: Silicon Climate Bank, London    │
│ [ ] Instant ACH / SEPA Direct  │ Escrow Reference: CB-ESC-8812-US      │
├────────────────────────────────┴───────────────────────────────────────┤
│  [ Processing Animation: 1. Authorizing -> 2. Escrow Lock -> 3. Paid ] │
│  [ Action: Confirm Wire Transfer / Authorize Card Charge ($111,200) ]  │
└────────────────────────────────────────────────────────────────────────┘
```

### Visual Identity & Theme
- **Color Discipline**: Deep forest green (`#123D2A`), primary emerald (`#218653`), soft sage (`#DDEBDD`), and warm amber (`#D99A32`) for pending escrow flags.
- **Micro-Interactions & Animation**:
  - Segmented rail switcher (Wire Transfer vs. Card vs. Direct Debit).
  - Realistic credit card preview that formats card numbers (`4242 •••• •••• 4242`) and shows security badges.
  - Multi-phase processing spinner:
    - *Step 1*: Authorizing counterparty credentials & sanctions screening (`~600ms`)
    - *Step 2*: Encrypting registry sub-account escrow allocation (`~700ms`)
    - *Step 3*: Settlement confirmed & receipt generated (`~400ms`)
- **Post-Payment Success Screen**:
  - Confetti particle trigger & prominent checkmark.
  - Downloadable/Printable Transaction & Retirement Certificate modal view.
  - 1-click return to updated deal timeline showing status changed to `Completed`.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Native Interactive Component vs. Third-Party Sandboxes**
  - *Chosen Approach*: Self-contained, state-driven React modal component with zero external payment SDK dependencies (no Stripe account setup needed).
  - *Why*: Allows instant, friction-free testing on Vercel or local preview without broken iframe redirects or API key failures.
- **Decision 2: Realistic B2B Financial Data Models**
  - *Chosen Approach*: Model real transaction attributes: Transaction Reference, Payment Method, Escrow Account Number, Timestamp, Tax / Facilitation breakdown, and Registry Holding ID.
  - *Why*: Conveys genuine enterprise maturity suited for climate-tech fintech applications.

---

## 4. Technical Architecture & Component Structure

```
┌────────────────────────────────────────────────────────────┐
│                    AppContext / State Store                │
│  - deals[] (status updates to 'Completed')                 │
│  - commissions[] (status updates to 'paid')                │
│  - payments[] (stores completed receipt records)           │
└─────────────────────────────┬──────────────────────────────┘
                              │
            ┌─────────────────┴─────────────────┐
            ▼                                   ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│     Buyer / Deal Workflow     │   │      Direct Marketplace       │
│  - /buyer/inquiries           │   │  - /marketplace/:listingId    │
│  - "Fund Escrow / Pay Deal"   │   │  - "Instant Buy & Settle"     │
└───────────────┬───────────────┘   └───────────────┬───────────────┘
                │                                   │
                └─────────────────┬─────────────────┘
                                  ▼
┌───────────────────────────────────────────────────────────────────┐
│                     PaymentModal Component                        │
│  - Tab 1: B2B Escrow Wire Transfer                                │
│  - Tab 2: Corporate Purchasing Card (with live card preview)     │
│  - Tab 3: SEPA / ACH Direct Bank Debit                            │
│  - State Machine: Idle -> Authorizing -> Escrow Lock -> Complete   │
│  - Receipt / Certificate Generator Modal                          │
└───────────────────────────────────────────────────────────────────┘
```

### Proposed State Additions:
1. `PaymentRecord` interface in `src/types/index.ts`:
   - `id`, `dealId`, `referenceNumber`, `amount`, `currency`, `method`, `status`, `payerCompany`, `beneficiary`, `timestamp`, `escrowReference`.
2. `payments: PaymentRecord[]` in `AppContext` with `processPayment(paymentData)` method.
3. `PaymentModal.tsx` in `src/components/payment/PaymentModal.tsx`.
4. `PaymentReceiptModal.tsx` in `src/components/payment/PaymentReceiptModal.tsx` for viewing and printing/downloading formal transaction statements.
