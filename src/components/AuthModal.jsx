import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  ArrowRight,
  Zap,
  Fingerprint,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('signin'); // 'signin' or 'signup'
  
  // Sign In Form States
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);

  // Sign Up Form States
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Deaf / Hard-of-Hearing');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Forgot password dialog state
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');

  if (!isOpen) return null;

  // Real-time password criteria
  const hasMinLength = signUpPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(signUpPassword);
  const hasNumber = /[0-9]/.test(signUpPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(signUpPassword);

  const calculatePasswordScore = () => {
    let score = 0;
    if (signUpPassword.length >= 6) score += 25;
    if (hasMinLength) score += 25;
    if (hasUpperCase) score += 25;
    if (hasNumber || hasSpecial) score += 25;
    return score;
  };

  const passScore = calculatePasswordScore();

  const getStrengthMeta = () => {
    if (passScore === 0) return { label: 'Enter Password', color: 'text-slate-400', barColor: 'bg-slate-200' };
    if (passScore <= 25) return { label: 'Weak Security', color: 'text-rose-600', barColor: 'bg-rose-500' };
    if (passScore <= 50) return { label: 'Fair Security', color: 'text-amber-600', barColor: 'bg-amber-500' };
    if (passScore <= 75) return { label: 'Strong Security', color: 'text-blue-600', barColor: 'bg-blue-500' };
    return { label: 'Enterprise Grade', color: 'text-emerald-600 font-bold', barColor: 'bg-emerald-500' };
  };

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    sounds.playSuccess();
    const user = {
      name: signInEmail ? signInEmail.split('@')[0] : 'GestureSigner',
      email: signInEmail || 'signer@gesturesync.ai',
      role: 'Verified Community Member',
      avatar: '🤟'
    };
    onLoginSuccess(user);
    onClose();
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (!acceptedTerms) {
      sounds.playClick();
      alert('Please accept terms of service to proceed.');
      return;
    }
    sounds.playSuccess();
    const user = {
      name: signUpName || 'New Member',
      email: signUpEmail || 'member@gesturesync.ai',
      role: selectedRole,
      avatar: '✨'
    };
    onLoginSuccess(user);
    onClose();
  };

  // 1-Click Instant Demo Login
  const handleQuickDemoLogin = (role = 'Deaf Community Member') => {
    sounds.playSuccess();
    const demoUser = {
      name: 'Anamika',
      email: 'anamika@gesturesync.ai',
      role: role,
      avatar: '🤟'
    };
    onLoginSuccess(demoUser);
    onClose();
  };

  // Biometric / Hand Sign Quick Scan Login
  const handleBiometricLogin = () => {
    sounds.playClick();
    setIsBiometricScanning(true);
    setTimeout(() => {
      sounds.playSuccess();
      setIsBiometricScanning(false);
      handleQuickDemoLogin('Biometric Verified Signer');
    }, 1500);
  };

  const strengthMeta = getStrengthMeta();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Main Professional Light Modal Card */}
      <div className="relative w-full max-w-xl rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl flex flex-col gap-5 text-left max-h-[94vh] overflow-y-auto">
        
        {/* Modal Close Button */}
        <button
          onClick={() => { sounds.playClick(); onClose(); }}
          className="absolute right-5 top-5 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 p-2 shadow-xs">
            <span className="text-2xl">🤟</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Gesture<span className="text-indigo-600">Sync</span> Account
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                PRO PORTAL
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Secure Sign Language AI Platform & Multimodal Workspace
            </p>
          </div>
        </div>

        {/* 1-Click Instant Demo VIP Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-50 border border-indigo-100 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">Instant 1-Click Access</p>
              <p className="text-[11px] text-slate-600">Test all features immediately without typing credentials</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('Certified Interpreter')}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs whitespace-nowrap shadow-xs active:scale-95 transition-all"
          >
            Launch Demo
          </button>
        </div>

        {/* Dynamic Mode Switcher: Sign In vs Sign Up */}
        <div className="flex p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => { sounds.playClick(); setActiveTab('signin'); setForgotPasswordMode(false); }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'signin' && !forgotPasswordMode
                ? 'bg-white text-indigo-600 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In to Account
          </button>
          <button
            onClick={() => { sounds.playClick(); setActiveTab('signup'); setForgotPasswordMode(false); }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === 'signup' && !forgotPasswordMode
                ? 'bg-white text-indigo-600 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* FORGOT PASSWORD SUB-FLOW */}
        {forgotPasswordMode ? (
          <div className="flex flex-col gap-4 py-2">
            <div>
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-indigo-600" />
                Reset Account Password
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Enter your verified email address to receive an access token and password reset link.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">ACCOUNT EMAIL ADDRESS</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="name@gesturesync.ai"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>

            {forgotSent ? (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Password reset link dispatched! Please check your inbox.</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (recoveryEmail) {
                    sounds.playSuccess();
                    setForgotSent(true);
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xs transition-colors"
              >
                Send Password Reset Link
              </button>
            )}

            <button
              type="button"
              onClick={() => { sounds.playClick(); setForgotPasswordMode(false); setForgotSent(false); }}
              className="text-xs text-indigo-600 hover:underline text-center"
            >
              &larr; Back to Sign In
            </button>
          </div>
        ) : activeTab === 'signin' ? (

          /* SIGN IN FORM VIEW */
          <form onSubmit={handleSignInSubmit} className="flex flex-col gap-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">EMAIL ADDRESS</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="anamika@gesturesync.ai"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">PASSWORD</label>
                <button
                  type="button"
                  onClick={() => { sounds.playClick(); setForgotPasswordMode(true); }}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showSignInPassword ? 'text' : 'password'}
                  required
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
                <button
                  type="button"
                  onClick={() => setShowSignInPassword(!showSignInPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center justify-between text-xs text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <span>Remember this device for 30 days</span>
              </label>

              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                256-Bit SSL
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In to GestureSync</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Biometric / Hand Gesture Login */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200" />
              <span className="flex-shrink mx-3 text-[11px] text-slate-400 uppercase font-semibold">Or fast authenticate</span>
              <div className="flex-grow border-t border-slate-200" />
            </div>

            <button
              type="button"
              onClick={handleBiometricLogin}
              disabled={isBiometricScanning}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Fingerprint className={`w-4 h-4 text-indigo-600 ${isBiometricScanning ? 'animate-spin' : ''}`} />
              <span>{isBiometricScanning ? 'Verifying Neural Hand Scan...' : 'Quick Sign / Biometric Access'}</span>
            </button>

          </form>

        ) : (

          /* SIGN UP FORM VIEW */
          <form onSubmit={handleSignUpSubmit} className="flex flex-col gap-4">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">FULL NAME</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  placeholder="Anamika"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">WORK OR PERSONAL EMAIL</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="anamika@gesturesync.ai"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">PRIMARY ROLE IN COMMUNITY</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              >
                <option value="Deaf / Hard-of-Hearing">Deaf / Hard-of-Hearing Individual</option>
                <option value="Certified Interpreter">Certified ASL / ISL Interpreter</option>
                <option value="Educator / Researcher">Educator or Researcher</option>
                <option value="Healthcare Worker">Healthcare & Emergency Worker</option>
                <option value="Family & Ally">Family, Friend, or Ally</option>
              </select>
            </div>

            {/* Password Field with Strength Meter */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">SECURE PASSWORD</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showSignUpPassword ? 'text' : 'password'}
                  required
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="Minimum 8 characters..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
                <button
                  type="button"
                  onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {signUpPassword.length > 0 && (
                <div className="pt-1.5 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Security Level:</span>
                    <span className={strengthMeta.color}>{strengthMeta.label}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strengthMeta.barColor}`}
                      style={{ width: `${passScore}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Terms of Service Checkbox */}
            <div className="flex items-start gap-2 pt-1 text-xs text-slate-600">
              <input
                type="checkbox"
                required
                id="termsCheck"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              <label htmlFor="termsCheck" className="cursor-pointer leading-tight">
                I agree to the <span className="text-indigo-600 font-semibold underline">Terms of Service</span> and acknowledge that my local webcam frames are processed 100% on-device for privacy.
              </label>
            </div>

            {/* Create Account Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 mt-1"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>
        )}

        {/* Footer Security Assurance */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Zero Server Storage &bull; GDPR & HIPAA Compliant &bull; Edge Encrypted</span>
        </div>

      </div>
    </div>
  );
}
