import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/ToastContainer';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { MarketplacePage } from './pages/public/MarketplacePage';
import { ListingDetailPage } from './pages/public/ListingDetailPage';
import { BundlesPage } from './pages/public/BundlesPage';
import { BundleDetailPage } from './pages/public/BundleDetailPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { ForBuyersPage } from './pages/public/ForBuyersPage';
import { ForSellersPage } from './pages/public/ForSellersPage';
import { AboutPage } from './pages/public/AboutPage';
import { ServicesPage } from './pages/public/ServicesPage';
import { PricingPage } from './pages/public/PricingPage';
import { FaqPage } from './pages/public/FaqPage';
import { ContactPage } from './pages/public/ContactPage';
import { LegalPages } from './pages/public/LegalPages';
import { AuthPages } from './pages/public/AuthPages';

// Buyer Pages
import { BuyerDashboard } from './pages/buyer/BuyerDashboard';
import { BuyerRequirements } from './pages/buyer/BuyerRequirements';
import { BuyerInquiries } from './pages/buyer/BuyerInquiries';
import { BuyerSaved } from './pages/buyer/BuyerSaved';

// Seller Pages
import { SellerDashboard } from './pages/seller/SellerDashboard';
import { SellerListings } from './pages/seller/SellerListings';
import { SellerNewListing } from './pages/seller/SellerNewListing';
import { SellerInquiries } from './pages/seller/SellerInquiries';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminListings } from './pages/admin/AdminListings';
import { AdminBundles } from './pages/admin/AdminBundles';
import { AdminInquiriesDeals } from './pages/admin/AdminInquiriesDeals';
import { AdminCommissions } from './pages/admin/AdminCommissions';
import { AdminUsers } from './pages/admin/AdminUsers';

// Shield / Lock Icon for Role Guard
import { ShieldAlert, Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser, loginAs } = useApp();

  // Router state
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.hash ? window.location.hash.replace('#', '') : '/';
  });

  // Keep hash synced with state
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setCurrentRoute(hash || '/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: string) => {
    window.location.hash = route;
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectListing = (id: string) => {
    navigate(`/marketplace/${id}`);
  };

  const handleSelectBundle = (id: string) => {
    navigate(`/bundles/${id}`);
  };

  // Render Role Guard when user tries to access protected views without required role
  const renderRoleGuard = (requiredRole: 'buyer' | 'seller' | 'admin') => (
    <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-[#DDEBDD] shadow-md text-center space-y-4">
      <div className="w-12 h-12 rounded-full bg-amber-50 text-[#D99A32] flex items-center justify-center mx-auto">
        <ShieldAlert className="w-6 h-6" />
      </div>
      <h2 className="text-lg font-bold text-[#123D2A]">
        {requiredRole.toUpperCase()} Permission Required
      </h2>
      <p className="text-xs text-[#69746D] leading-relaxed">
        This workspace route requires a verified <strong>{requiredRole}</strong> account. You are currently logged in as {currentUser ? currentUser.role : 'Guest'}.
      </p>
      <div className="pt-2 flex flex-col gap-2">
        <button
          onClick={() => loginAs(requiredRole)}
          className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#123D2A] hover:bg-[#1B4D36] rounded-lg transition-colors flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#218653]" />
          <span>Switch to Demo {requiredRole.toUpperCase()} Account</span>
        </button>
        <button
          onClick={() => navigate('/marketplace')}
          className="text-xs text-[#69746D] hover:underline"
        >
          Return to Public Marketplace
        </button>
      </div>
    </div>
  );

  // Router matching logic
  const renderRoute = () => {
    // Parameterized routes
    if (currentRoute.startsWith('/marketplace/')) {
      const listingId = currentRoute.replace('/marketplace/', '');
      return <ListingDetailPage listingId={listingId} navigate={navigate} />;
    }

    if (currentRoute.startsWith('/bundles/')) {
      const bundleId = currentRoute.replace('/bundles/', '');
      return (
        <BundleDetailPage 
          bundleId={bundleId} 
          navigate={navigate} 
          onSelectListing={handleSelectListing} 
        />
      );
    }

    // Role-Guarded Buyer Routes
    if (currentRoute.startsWith('/buyer/')) {
      if (!currentUser || (currentUser.role !== 'buyer' && currentUser.role !== 'admin')) {
        return renderRoleGuard('buyer');
      }

      switch (currentRoute) {
        case '/buyer/dashboard':
          return (
            <BuyerDashboard 
              navigate={navigate} 
              onSelectListing={handleSelectListing} 
              onSelectBundle={handleSelectBundle} 
            />
          );
        case '/buyer/requirements':
          return (
            <BuyerRequirements 
              navigate={navigate} 
              onSelectListing={handleSelectListing} 
            />
          );
        case '/buyer/inquiries':
          return <BuyerInquiries navigate={navigate} />;
        case '/buyer/saved':
          return (
            <BuyerSaved 
              navigate={navigate} 
              onSelectListing={handleSelectListing} 
              onSelectBundle={handleSelectBundle} 
            />
          );
        default:
          return (
            <BuyerDashboard 
              navigate={navigate} 
              onSelectListing={handleSelectListing} 
              onSelectBundle={handleSelectBundle} 
            />
          );
      }
    }

    // Role-Guarded Seller Routes
    if (currentRoute.startsWith('/seller/')) {
      if (!currentUser || (currentUser.role !== 'seller' && currentUser.role !== 'admin')) {
        return renderRoleGuard('seller');
      }

      switch (currentRoute) {
        case '/seller/dashboard':
          return <SellerDashboard navigate={navigate} onSelectListing={handleSelectListing} />;
        case '/seller/listings':
          return <SellerListings navigate={navigate} onSelectListing={handleSelectListing} />;
        case '/seller/listings/new':
          return <SellerNewListing navigate={navigate} onSelectListing={handleSelectListing} />;
        case '/seller/inquiries':
          return <SellerInquiries navigate={navigate} />;
        default:
          return <SellerDashboard navigate={navigate} onSelectListing={handleSelectListing} />;
      }
    }

    // Role-Guarded Admin Routes
    if (currentRoute.startsWith('/admin/')) {
      if (!currentUser || currentUser.role !== 'admin') {
        return renderRoleGuard('admin');
      }

      switch (currentRoute) {
        case '/admin/dashboard':
          return <AdminDashboard navigate={navigate} onSelectListing={handleSelectListing} />;
        case '/admin/listings':
          return <AdminListings navigate={navigate} onSelectListing={handleSelectListing} />;
        case '/admin/bundles':
          return <AdminBundles navigate={navigate} onSelectBundle={handleSelectBundle} />;
        case '/admin/deals':
          return <AdminInquiriesDeals navigate={navigate} />;
        case '/admin/commissions':
          return <AdminCommissions navigate={navigate} />;
        case '/admin/users':
          return <AdminUsers navigate={navigate} />;
        default:
          return <AdminDashboard navigate={navigate} onSelectListing={handleSelectListing} />;
      }
    }

    // Standard Public Routes
    switch (currentRoute) {
      case '/':
        return (
          <HomePage 
            navigate={navigate} 
            onSelectListing={handleSelectListing} 
            onSelectBundle={handleSelectBundle} 
          />
        );
      case '/marketplace':
        return (
          <MarketplacePage 
            navigate={navigate} 
            onSelectListing={handleSelectListing} 
          />
        );
      case '/bundles':
        return (
          <BundlesPage 
            navigate={navigate} 
            onSelectBundle={handleSelectBundle} 
          />
        );
      case '/how-it-works':
        return <HowItWorksPage navigate={navigate} />;
      case '/for-buyers':
        return <ForBuyersPage navigate={navigate} />;
      case '/for-sellers':
        return <ForSellersPage navigate={navigate} />;
      case '/about':
        return <AboutPage navigate={navigate} />;
      case '/services':
        return <ServicesPage navigate={navigate} />;
      case '/pricing':
        return <PricingPage navigate={navigate} />;
      case '/faq':
        return <FaqPage navigate={navigate} />;
      case '/contact':
        return <ContactPage navigate={navigate} />;
      case '/privacy':
        return <LegalPages initialTab="privacy" />;
      case '/terms':
        return <LegalPages initialTab="terms" />;
      case '/disclaimer':
        return <LegalPages initialTab="disclaimer" />;
      case '/login':
        return <AuthPages mode="login" navigate={navigate} />;
      case '/register':
        return <AuthPages mode="register" navigate={navigate} />;
      case '/forgot-password':
        return <AuthPages mode="forgot_password" navigate={navigate} />;
      default:
        return (
          <HomePage 
            navigate={navigate} 
            onSelectListing={handleSelectListing} 
            onSelectBundle={handleSelectBundle} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8F4] text-[#202923]">
      <Navbar currentRoute={currentRoute} navigate={navigate} />
      <main className="flex-1">
        {renderRoute()}
      </main>
      <Footer navigate={navigate} />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
