import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import { UserRole } from '../../types';
import { 
  Menu, 
  X, 
  ChevronDown, 
  User, 
  LogOut, 
  Layers, 
  ShieldCheck, 
  Building2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, navigate }) => {
  const { currentUser, loginAs, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [demoSwitchOpen, setDemoSwitchOpen] = useState(false);

  const navLinks = [
    { label: 'Marketplace', route: '/marketplace' },
    { label: 'Bundles', route: '/bundles' },
    { label: 'How It Works', route: '/how-it-works' },
    { label: 'Pricing', route: '/pricing' },
    { label: 'About', route: '/about' }
  ];

  const handleNavClick = (route: string) => {
    navigate(route);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setDemoSwitchOpen(false);
  };

  const getDashboardRoute = (role: UserRole) => {
    switch (role) {
      case 'buyer':
        return '/buyer/dashboard';
      case 'seller':
        return '/seller/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/marketplace';
    }
  };

  return (
    <>
      {/* Top Bar following 3-Zone Contract */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#DDEBDD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-8 h-16">
            
            {/* Zone 1: Brand title & logo (single element wordmark) */}
            <div className="flex items-center gap-3 shrink-0">
              <button 
                onClick={() => handleNavClick('/')}
                className="flex items-center text-left hover:opacity-90 transition-opacity"
              >
                <Logo size="md" />
              </button>
            </div>

            {/* Zone 2: 4–5 concise single-line nav links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#69746D]">
              {navLinks.map((link) => {
                const isActive = currentRoute === link.route || currentRoute.startsWith(link.route + '/');
                return (
                  <button
                    key={link.route}
                    onClick={() => handleNavClick(link.route)}
                    className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                      isActive 
                        ? 'text-[#123D2A] font-semibold border-b-2 border-[#218653]' 
                        : 'hover:text-[#123D2A]'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Zone 3: 1 primary action / User profile & Switcher */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Quick Demo Role Switcher (Compact, labeled clearly) */}
              <div className="relative hidden md:block">
                <button
                  type="button"
                  onClick={() => setDemoSwitchOpen(!demoSwitchOpen)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-medium rounded border border-[#DDEBDD] bg-[#F7F8F4] text-[#123D2A] hover:bg-[#DDEBDD]/50 transition-colors whitespace-nowrap shrink-0"
                  title="Switch between demonstration accounts: Buyer, Seller, Admin"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#218653]" />
                  <span>
                    Role: <span className="font-semibold capitalize">{currentUser ? currentUser.role : 'Guest'}</span>
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#69746D]" />
                </button>

                {demoSwitchOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-[#DDEBDD] py-2 z-50">
                    <div className="px-3 py-1.5 border-b border-[#DDEBDD] text-[11px] font-mono text-[#69746D]">
                      SELECT DEMO PERSPECTIVE
                    </div>
                    <button
                      onClick={() => { loginAs('buyer'); setDemoSwitchOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#F7F8F4] text-[#202923]"
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#218653]" />
                        <div>
                          <div className="font-semibold">Corporate Buyer</div>
                          <div className="text-[10px] text-[#69746D]">Apex Global Logistics (Elena)</div>
                        </div>
                      </div>
                      {currentUser?.role === 'buyer' && <span className="text-[10px] font-bold text-[#218653]">Active</span>}
                    </button>
                    <button
                      onClick={() => { loginAs('seller'); setDemoSwitchOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#F7F8F4] text-[#202923]"
                    >
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#218653]" />
                        <div>
                          <div className="font-semibold">Carbon Seller / Dev</div>
                          <div className="text-[10px] text-[#69746D]">Solaria Capital (Marcus)</div>
                        </div>
                      </div>
                      {currentUser?.role === 'seller' && <span className="text-[10px] font-bold text-[#218653]">Active</span>}
                    </button>
                    <button
                      onClick={() => { loginAs('admin'); setDemoSwitchOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#F7F8F4] text-[#202923]"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#218653]" />
                        <div>
                          <div className="font-semibold">Platform Admin / Broker</div>
                          <div className="text-[10px] text-[#69746D]">CarbonBridge Operations (Aarav)</div>
                        </div>
                      </div>
                      {currentUser?.role === 'admin' && <span className="text-[10px] font-bold text-[#218653]">Active</span>}
                    </button>
                    <div className="border-t border-[#DDEBDD] mt-1 pt-1">
                      <button
                        onClick={() => { loginAs('guest'); setDemoSwitchOpen(false); }}
                        className="w-full text-left px-3 py-1.5 text-xs text-[#69746D] hover:bg-[#F7F8F4]"
                      >
                        Sign Out (Public Guest View)
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Logged in Workspace Button or Login CTA */}
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg bg-[#123D2A] text-white hover:bg-[#1B4D36] transition-colors whitespace-nowrap shrink-0"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>{currentUser.companyName.split(' ')[0]}</span>
                    <ChevronDown className="w-3 h-3 text-[#DDEBDD]" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-[#DDEBDD] py-1.5 z-50">
                      <div className="px-3 py-2 border-b border-[#DDEBDD]">
                        <div className="text-xs font-bold text-[#123D2A]">{currentUser.fullName}</div>
                        <div className="text-[11px] text-[#69746D]">{currentUser.companyName}</div>
                        <div className="text-[10px] uppercase tracking-wider text-[#218653] font-semibold mt-1">
                          Role: {currentUser.role}
                        </div>
                      </div>

                      <button
                        onClick={() => handleNavClick(getDashboardRoute(currentUser.role))}
                        className="w-full text-left px-3 py-2 text-xs text-[#202923] hover:bg-[#F7F8F4] flex items-center justify-between"
                      >
                        <span>Go to {currentUser.role.toUpperCase()} Dashboard</span>
                        <ArrowRight className="w-3 h-3 text-[#69746D]" />
                      </button>

                      {currentUser.role === 'buyer' && (
                        <>
                          <button
                            onClick={() => handleNavClick('/buyer/requirements')}
                            className="w-full text-left px-3 py-1.5 text-xs text-[#69746D] hover:bg-[#F7F8F4]"
                          >
                            My Purchase Requirements
                          </button>
                          <button
                            onClick={() => handleNavClick('/buyer/inquiries')}
                            className="w-full text-left px-3 py-1.5 text-xs text-[#69746D] hover:bg-[#F7F8F4]"
                          >
                            Inquiries & Quotes
                          </button>
                          <button
                            onClick={() => handleNavClick('/buyer/saved')}
                            className="w-full text-left px-3 py-1.5 text-xs text-[#69746D] hover:bg-[#F7F8F4]"
                          >
                            Saved Listings & Bundles
                          </button>
                        </>
                      )}

                      {currentUser.role === 'seller' && (
                        <>
                          <button
                            onClick={() => handleNavClick('/seller/listings')}
                            className="w-full text-left px-3 py-1.5 text-xs text-[#69746D] hover:bg-[#F7F8F4]"
                          >
                            My Credit Listings
                          </button>
                          <button
                            onClick={() => handleNavClick('/seller/listings/new')}
                            className="w-full text-left px-3 py-1.5 text-xs text-[#218653] font-semibold hover:bg-[#F7F8F4]"
                          >
                            + Submit New Listing
                          </button>
                          <button
                            onClick={() => handleNavClick('/seller/inquiries')}
                            className="w-full text-left px-3 py-1.5 text-xs text-[#69746D] hover:bg-[#F7F8F4]"
                          >
                            Buyer Inquiries & Offers
                          </button>
                        </>
                      )}

                      {currentUser.role === 'admin' && (
                        <>
                          <button
                            onClick={() => handleNavClick('/admin/listings')}
                            className="w-full text-left px-3 py-1.5 text-xs text-[#69746D] hover:bg-[#F7F8F4]"
                          >
                            Listing Approvals
                          </button>
                          <button
                            onClick={() => handleNavClick('/admin/bundles')}
                            className="w-full text-left px-3 py-1.5 text-xs text-[#69746D] hover:bg-[#F7F8F4]"
                          >
                            Portfolio Bundles
                          </button>
                          <button
                            onClick={() => handleNavClick('/admin/deals')}
                            className="w-full text-left px-3 py-1.5 text-xs text-[#69746D] hover:bg-[#F7F8F4]"
                          >
                            Deal Pipeline & Channel Desk
                          </button>
                          <button
                            onClick={() => handleNavClick('/admin/commissions')}
                            className="w-full text-left px-3 py-1.5 text-xs text-[#69746D] hover:bg-[#F7F8F4]"
                          >
                            Commission Ledger
                          </button>
                        </>
                      )}

                      <div className="border-t border-[#DDEBDD] mt-1 pt-1">
                        <button
                          onClick={() => { logout(); setUserDropdownOpen(false); }}
                          className="w-full text-left px-3 py-1.5 text-xs text-[#C94C4C] hover:bg-[#F7F8F4] flex items-center gap-1.5"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleNavClick('/login')}
                    className="px-3.5 py-2 text-xs font-semibold text-[#123D2A] hover:text-[#218653] transition-colors whitespace-nowrap shrink-0"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => handleNavClick('/register')}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#123D2A] rounded-lg hover:bg-[#1B4D36] transition-colors whitespace-nowrap shrink-0"
                  >
                    Get Started
                  </button>
                </div>
              )}

              {/* Mobile menu hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-[#69746D] hover:text-[#123D2A]"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-[#DDEBDD] bg-white px-4 pt-3 pb-5 space-y-3">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.route}
                  onClick={() => handleNavClick(link.route)}
                  className={`text-left text-sm py-2 px-3 rounded-md ${
                    currentRoute === link.route 
                      ? 'bg-[#DDEBDD]/50 text-[#123D2A] font-semibold' 
                      : 'text-[#69746D] hover:bg-[#F7F8F4]'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-[#DDEBDD]">
              <div className="text-xs font-mono text-[#69746D] mb-2">QUICK DEMO SWITCH:</div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => { loginAs('buyer'); setMobileMenuOpen(false); }}
                  className={`px-2 py-1.5 text-xs text-center rounded border ${currentUser?.role === 'buyer' ? 'bg-[#123D2A] text-white' : 'border-[#DDEBDD] bg-[#F7F8F4]'}`}
                >
                  Buyer
                </button>
                <button
                  onClick={() => { loginAs('seller'); setMobileMenuOpen(false); }}
                  className={`px-2 py-1.5 text-xs text-center rounded border ${currentUser?.role === 'seller' ? 'bg-[#123D2A] text-white' : 'border-[#DDEBDD] bg-[#F7F8F4]'}`}
                >
                  Seller
                </button>
                <button
                  onClick={() => { loginAs('admin'); setMobileMenuOpen(false); }}
                  className={`px-2 py-1.5 text-xs text-center rounded border ${currentUser?.role === 'admin' ? 'bg-[#123D2A] text-white' : 'border-[#DDEBDD] bg-[#F7F8F4]'}`}
                >
                  Admin
                </button>
              </div>
            </div>

            {currentUser ? (
              <div className="pt-2">
                <button
                  onClick={() => handleNavClick(getDashboardRoute(currentUser.role))}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-center text-white bg-[#123D2A] rounded-lg"
                >
                  Open {currentUser.role.toUpperCase()} Workspace
                </button>
              </div>
            ) : (
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => handleNavClick('/login')}
                  className="flex-1 py-2 text-xs font-semibold text-center border border-[#123D2A] text-[#123D2A] rounded-lg"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNavClick('/register')}
                  className="flex-1 py-2 text-xs font-semibold text-center bg-[#123D2A] text-white rounded-lg"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
};
