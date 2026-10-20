import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DemoBadge } from '../../components/common/DemoBadge';
import { UserRole } from '../../types';
import { 
  Building2, 
  Layers, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface AuthPagesProps {
  mode: 'login' | 'register' | 'forgot_password';
  navigate: (route: string) => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({ mode, navigate }) => {
  const { loginAs, registerUser, showToast, users } = useApp();

  // Mode state if user wants to switch between login & register
  const [currentMode, setCurrentMode] = useState<'login' | 'register' | 'forgot_password'>(mode);
  
  // Registration role choice (Buyer or Seller only; never Admin via public signup)
  const [registerRole, setRegisterRole] = useState<'buyer' | 'seller'>('buyer');

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [country, setCountry] = useState('Germany');
  const [companyType, setCompanyType] = useState<'developer' | 'corporate_buyer' | 'broker'>('corporate_buyer');
  const [businessDescription, setBusinessDescription] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      loginAs(existing.role, existing.id);
      navigate(existing.role === 'buyer' ? '/buyer/dashboard' : existing.role === 'seller' ? '/seller/dashboard' : '/admin/dashboard');
    } else {
      // Default fallback for demo testing
      showToast('Account not found with that email. Using demo Buyer credentials for session.', 'info');
      loginAs('buyer');
      navigate('/buyer/dashboard');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted) {
      showToast('Please accept the CarbonBridge Terms of Service and Privacy Policy.', 'warning');
      return;
    }

    const newUser = registerUser({
      fullName,
      email,
      role: registerRole,
      companyName,
      jobTitle: jobTitle || undefined,
      country,
      accountStatus: 'active',
      companyType: registerRole === 'buyer' ? 'corporate_buyer' : companyType,
      businessDescription: businessDescription || undefined
    });

    navigate(registerRole === 'buyer' ? '/buyer/dashboard' : '/seller/dashboard');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSubmitted(true);
    showToast(`Password reset link dispatched to ${email} (Simulated).`, 'info');
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
      
      {/* Top Demo Login Fast-Switch Box */}
      <div className="bg-white p-5 rounded-2xl border border-[#DDEBDD] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#218653]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#123D2A]">
              Instant Demo Access
            </span>
          </div>
          <span className="text-[10px] text-[#69746D]">No password required</span>
        </div>

        <p className="text-xs text-[#69746D]">
          Switch between fully populated demonstration accounts to test specific marketplace perspectives:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => { loginAs('buyer'); navigate('/buyer/dashboard'); }}
            className="p-3 text-left rounded-xl border border-[#DDEBDD] bg-[#F7F8F4] hover:bg-[#DDEBDD]/40 transition-colors flex flex-col justify-between"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#123D2A] mb-1">
              <Building2 className="w-3.5 h-3.5 text-[#218653]" />
              <span>Buyer Desk</span>
            </div>
            <div className="text-[10px] text-[#69746D] truncate">Apex Logistics</div>
            <div className="text-[10px] text-[#218653] font-medium mt-1">Elena Rostova &rarr;</div>
          </button>

          <button
            type="button"
            onClick={() => { loginAs('seller'); navigate('/seller/dashboard'); }}
            className="p-3 text-left rounded-xl border border-[#DDEBDD] bg-[#F7F8F4] hover:bg-[#DDEBDD]/40 transition-colors flex flex-col justify-between"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#123D2A] mb-1">
              <Layers className="w-3.5 h-3.5 text-[#218653]" />
              <span>Seller Desk</span>
            </div>
            <div className="text-[10px] text-[#69746D] truncate">Solaria Capital</div>
            <div className="text-[10px] text-[#218653] font-medium mt-1">Marcus Vance &rarr;</div>
          </button>

          <button
            type="button"
            onClick={() => { loginAs('admin'); navigate('/admin/dashboard'); }}
            className="p-3 text-left rounded-xl border border-[#DDEBDD] bg-[#F7F8F4] hover:bg-[#DDEBDD]/40 transition-colors flex flex-col justify-between"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#123D2A] mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#218653]" />
              <span>Admin Broker</span>
            </div>
            <div className="text-[10px] text-[#69746D] truncate">CarbonBridge Desk</div>
            <div className="text-[10px] text-[#218653] font-medium mt-1">Aarav Patel &rarr;</div>
          </button>
        </div>
      </div>

      {/* Main Form Box */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#DDEBDD] shadow-sm space-y-6">
        
        {/* LOGIN VIEW */}
        {currentMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div className="text-center space-y-1 pb-2">
              <h1 className="text-xl font-extrabold text-[#123D2A]">Sign in to CarbonBridge</h1>
              <p className="text-[#69746D]">
                Enter your work credentials or use the instant demo buttons above.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-[#123D2A] mb-1">Work Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="elena.rostova@apexlogistics.global"
                className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-[#123D2A]">Password</label>
                <button
                  type="button"
                  onClick={() => setCurrentMode('forgot_password')}
                  className="text-[11px] text-[#218653] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-semibold text-white bg-[#123D2A] hover:bg-[#1B4D36] rounded-lg transition-colors"
            >
              Log In
            </button>

            <div className="text-center pt-2 text-[#69746D]">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => setCurrentMode('register')}
                className="text-[#218653] font-semibold hover:underline"
              >
                Register as Corporate Buyer or Seller
              </button>
            </div>
          </form>
        )}

        {/* REGISTRATION VIEW */}
        {currentMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
            <div className="text-center space-y-1 pb-2">
              <h1 className="text-xl font-extrabold text-[#123D2A]">Create an Account</h1>
              <p className="text-[#69746D]">
                Select your participant role. Public signup provisions Buyer or Seller accounts.
              </p>
            </div>

            {/* Role Segmented Selector */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#F7F8F4] rounded-lg border border-[#DDEBDD]">
              <button
                type="button"
                onClick={() => setRegisterRole('buyer')}
                className={`py-2 px-3 rounded-md font-semibold text-center transition-colors ${
                  registerRole === 'buyer'
                    ? 'bg-[#123D2A] text-white shadow-xs'
                    : 'text-[#69746D] hover:text-[#123D2A]'
                }`}
              >
                Corporate Buyer
              </button>
              <button
                type="button"
                onClick={() => setRegisterRole('seller')}
                className={`py-2 px-3 rounded-md font-semibold text-center transition-colors ${
                  registerRole === 'seller'
                    ? 'bg-[#123D2A] text-white shadow-xs'
                    : 'text-[#69746D] hover:text-[#123D2A]'
                }`}
              >
                Credit Seller / Dev
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#123D2A] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#123D2A] mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Northern Carbon Solutions"
                  className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#123D2A] mb-1">Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Sustainability Director"
                  className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#123D2A] mb-1">Country *</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. United Kingdom"
                  className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#123D2A] mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653]"
                />
              </div>
            </div>

            {registerRole === 'seller' && (
              <div>
                <label className="block font-semibold text-[#123D2A] mb-1">Developer Company Type</label>
                <select
                  value={companyType}
                  onChange={(e) => setCompanyType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653] bg-white"
                >
                  <option value="developer">Project Developer & Operator</option>
                  <option value="broker">Authorized Environmental Asset Broker</option>
                  <option value="fund">Climate Investment Fund / Origination Desk</option>
                </select>
              </div>
            )}

            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 accent-[#218653]"
              />
              <label htmlFor="terms" className="text-[11px] text-[#69746D]">
                I agree to the CarbonBridge Terms of Service, Marketplace Due Diligence Policy, and Privacy Terms.
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-semibold text-white bg-[#123D2A] hover:bg-[#1B4D36] rounded-lg transition-colors"
            >
              Complete Registration
            </button>

            <div className="text-center pt-2 text-[#69746D]">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setCurrentMode('login')}
                className="text-[#218653] font-semibold hover:underline"
              >
                Log In
              </button>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD VIEW */}
        {currentMode === 'forgot_password' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
            <div className="text-center space-y-1 pb-2">
              <h1 className="text-xl font-extrabold text-[#123D2A]">Reset Your Password</h1>
              <p className="text-[#69746D]">
                Enter your registered corporate email to receive recovery instructions.
              </p>
            </div>

            {forgotSubmitted ? (
              <div className="p-4 bg-[#DDEBDD]/50 rounded-lg text-center space-y-2">
                <CheckCircle2 className="w-6 h-6 text-[#218653] mx-auto" />
                <p className="font-semibold text-[#123D2A]">Recovery Email Dispatched</p>
                <p className="text-[#69746D] text-[11px]">
                  If an active account is associated with {email}, you will receive a secure token.
                </p>
                <button
                  type="button"
                  onClick={() => { setForgotSubmitted(false); setCurrentMode('login'); }}
                  className="text-xs font-semibold text-[#218653] hover:underline block mx-auto pt-2"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <>
                <div>
                  <label className="block font-semibold text-[#123D2A] mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3 py-2 border border-[#DDEBDD] rounded-lg focus:outline-none focus:border-[#218653]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 text-xs font-semibold text-white bg-[#123D2A] hover:bg-[#1B4D36] rounded-lg transition-colors"
                >
                  Send Recovery Link
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setCurrentMode('login')}
                    className="text-xs text-[#69746D] hover:underline"
                  >
                    Back to Sign In
                  </button>
                </div>
              </>
            )}
          </form>
        )}

      </div>
    </div>
  );
};
