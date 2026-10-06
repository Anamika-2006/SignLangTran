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
  Globe,
  Fingerprint,
  Scan,
  KeyRound,
  ShieldAlert,
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
    if (passScore === 0) return { label: 'Enter Password', color: 'text-slate-500', barColor: 'bg-slate-700' };
    if (passScore <= 25) return { label: 'Weak Security', color: 'text-rose-400', barColor: 'bg-rose-500' };
    if (passScore <= 50) return { label: 'Fair Security', color: 'text-amber-400', barColor: 'bg-amber-500' };
    if (passScore <= 75) return { label: 'Strong Security', color: 'text-cyan-400', barColor: 'bg-cyan-500' };
    return { label: 'Enterprise Military-Grade', color: 'text-emerald-400 font-bold', barColor: 'bg-emerald-500' };
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-2xl animate-in fade-in duration-300">
      
      {/* Background Ambient Radial Light Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Glassmorphic Modal Card */}
      <div className="relative w-full max-w-xl rounded-[32px] bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 border border-cyan-500/40 p-6 sm:p-8 shadow-[0_0_80px_rgba(6,182,212,0.25)] flex flex-col gap-6 text-left max-h-[94vh] overflow-y-auto scrollbar-thin">
        
        {/* Top Floating Glow Border Accent */}
        <div className="absolute top-0 left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee]" />

        {/* Modal Close Button */}
        <button
          onClick={() => { sounds.playClick(); onClose(); }}
          className="absolute right-5 top-5 p-2 rounded-2xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700/80 border border-slate-700/50 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header & Animated 3D Hologram Badge */}
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600 p-[2px] shadow-xl shadow-cyan-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <span className="text-3xl filter drop-shadow">🤟</span>
            </div>
            {/* Spinning Orbit Ring */}
            <div className="absolute inset-0 rounded-2xl border border-cyan-400/50 animate-ping opacity-40 pointer-events-none" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-black text-white font-mono tracking-tight">
                GESTURE<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">SYNC</span>
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-mono">
                SECURE ID
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Next-Gen Neural Sign Language & Multimodal Vocal Intelligence Suite
            </p>
          </div>
        </div>

        {/* 1-Click Instant Demo VIP Banner */}
        <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/30 flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">Instant 1-Click Access</p>
              <p className="text-[11px] text-cyan-300">Test all features instantly without typing credentials</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('Certified Interpreter')}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs whitespace-nowrap shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
          >
            Launch Demo
          </button>
        </div>

        {/* Dynamic Mode Switcher: Sign In vs Sign Up */}
        <div className="flex p-1.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold shadow-inner">
          <button
            onClick={() => { sounds.playClick(); setActiveTab('signin'); setForgotPasswordMode(false); }}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              activeTab === 'signin' && !forgotPasswordMode
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/25 font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In to Account
          </button>
          <button
            onClick={() => { sounds.playClick(); setActiveTab('signup'); setForgotPasswordMode(false); }}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              activeTab === 'signup' && !forgotPasswordMode
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/25 font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Free Account
          </button>
        </div>

        {/* FORGOT PASSWORD SUB-FLOW */}
        {forgotPasswordMode ? (
          <div className="flex flex-col gap-4 py-2">
            <div>
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-cyan-400" />
                Reset Account Credentials
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Enter your verified email address to receive a neural access token and reset link.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">ACCOUNT EMAIL ADDRESS</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="name@gesturesync.ai"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:border-cyan-400 outline-none"
                />
              </div>
            </div>

            {forgotSent ? (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Security reset link dispatched! Please check your inbox.</span>
              </div>
            ) : (
              <button
                onClick={() => { sounds.playSuccess(); setForgotSent(true); }}
                className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-md transition-all active:scale-95"
              >
                Send Recovery Link
              </button>
            )}

            <button
              onClick={() => setForgotPasswordMode(false)}
              className="text-xs text-cyan-400 hover:underline text-center pt-2"
            >
              &larr; Return to Sign In
            </button>
          </div>
        ) : activeTab === 'signin' ? (
          /* ================= SIGN IN TAB ================= */
          <form onSubmit={handleSignInSubmit} className="flex flex-col gap-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">EMAIL ADDRESS OR USERNAME</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="anamika@gesturesync.ai"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:border-cyan-400 outline-none shadow-inner transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <label className="text-slate-300">SECURITY PASSWORD</label>
                <button
                  type="button"
                  onClick={() => setForgotPasswordMode(true)}
                  className="text-cyan-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type={showSignInPassword ? 'text' : 'password'}
                  required
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-3 text-white text-sm focus:border-cyan-400 outline-none shadow-inner transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowSignInPassword(!showSignInPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                >
                  {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded accent-cyan-500 w-4 h-4 bg-slate-950"
                />
                <span>Remember session authentication</span>
              </label>

              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                TLS 1.3 Encrypted
              </span>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/25 active:scale-95 transition-all mt-2"
            >
              Sign In to GestureSync Studio
            </button>

            {/* Biometric / Quick Gesture Scan Trigger */}
            <button
              type="button"
              onClick={handleBiometricLogin}
              disabled={isBiometricScanning}
              className="w-full py-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Fingerprint className={`w-4 h-4 ${isBiometricScanning ? 'animate-spin text-emerald-400' : 'text-cyan-400'}`} />
              <span>{isBiometricScanning ? 'Verifying Gesture Signature...' : 'Sign In with Hand Sign / Biometric ID'}</span>
            </button>

            {/* Social Logins Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase font-mono">
                <span className="bg-slate-900 px-3 text-slate-500">OR CONNECT WITH</span>
              </div>
            </div>

            {/* Social Providers Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              {/* Google */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Google Signer')}
                className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>Google</span>
              </button>

              {/* GitHub */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('GitHub Signer')}
                className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                <span>GitHub</span>
              </button>

              {/* Apple */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Apple Signer')}
                className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.87-.96.04-2.13.64-2.79 1.41-.57.66-.99 1.74-.94 2.81 1.08.08 2.1-.6 2.72-1.35z"/>
                </svg>
                <span>Apple</span>
              </button>
            </div>

          </form>
        ) : (
          /* ================= SIGN UP TAB ================= */
          <form onSubmit={handleSignUpSubmit} className="flex flex-col gap-4">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">FULL NAME</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  placeholder="Anamika Pandey"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:border-cyan-400 outline-none shadow-inner transition-colors"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">EMAIL ADDRESS</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="anamika@gesturesync.ai"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:border-cyan-400 outline-none shadow-inner transition-colors"
                />
              </div>
            </div>

            {/* Password with Real-Time Strength Matrix */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <label className="text-slate-300">CREATE SECURITY PASSWORD</label>
                <span className={getStrengthMeta().color}>
                  {getStrengthMeta().label}
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type={showSignUpPassword ? 'text' : 'password'}
                  required
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-white text-sm focus:border-cyan-400 outline-none shadow-inner transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
                >
                  {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* 4-Segment Strength Indicator */}
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                <div className={`h-1.5 rounded-full transition-all ${passScore >= 25 ? getStrengthMeta().barColor : 'bg-slate-800'}`} />
                <div className={`h-1.5 rounded-full transition-all ${passScore >= 50 ? getStrengthMeta().barColor : 'bg-slate-800'}`} />
                <div className={`h-1.5 rounded-full transition-all ${passScore >= 75 ? getStrengthMeta().barColor : 'bg-slate-800'}`} />
                <div className={`h-1.5 rounded-full transition-all ${passScore >= 100 ? getStrengthMeta().barColor : 'bg-slate-800'}`} />
              </div>

              {/* Live Validation Checklist */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 pt-1">
                <span className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {hasMinLength ? '✓' : '•'} 8+ chars
                </span>
                <span className={`flex items-center gap-1 ${hasUpperCase ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {hasUpperCase ? '✓' : '•'} 1 Uppercase
                </span>
                <span className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {hasNumber ? '✓' : '•'} 1 Number
                </span>
                <span className={`flex items-center gap-1 ${hasSpecial ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {hasSpecial ? '✓' : '•'} 1 Symbol
                </span>
              </div>
            </div>

            {/* Profile Community Role Selection */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-mono text-slate-300">COMMUNITY ROLE PROFILE</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'Deaf / Hard-of-Hearing', icon: '🤟', label: 'Deaf / Hard-of-Hearing', desc: 'Primary Signer' },
                  { id: 'Sign Language Interpreter', icon: '🗣️', label: 'Certified Interpreter', desc: 'Professional' },
                  { id: 'Student / Learner', icon: '🎓', label: 'Student / Learner', desc: 'Sign Academy' },
                  { id: 'Healthcare Worker', icon: '🏥', label: 'Healthcare & Public', desc: 'First Responder' },
                ].map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => { sounds.playClick(); setSelectedRole(role.id); }}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                      selectedRole === role.id
                        ? 'bg-gradient-to-r from-cyan-950/80 to-indigo-950/80 border-cyan-400 text-white shadow-lg shadow-cyan-950/50'
                        : 'bg-slate-950/70 border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <span className="text-xl leading-none mt-0.5">{role.icon}</span>
                    <div className="overflow-hidden">
                      <p className="font-bold text-xs truncate leading-tight text-white">{role.label}</p>
                      <p className="text-[10px] text-slate-500">{role.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Terms of Service Checkbox */}
            <div className="flex items-center gap-2 text-xs text-slate-300 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="rounded accent-cyan-500 w-4 h-4 bg-slate-950 cursor-pointer"
              />
              <label htmlFor="terms" className="cursor-pointer text-[11px] leading-tight text-slate-400">
                I accept the <span className="text-cyan-400 underline">Accessibility Ethics Code</span> and <span className="text-cyan-400 underline">Privacy Terms</span>.
              </label>
            </div>

            {/* Register Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 active:scale-95 transition-all mt-1"
            >
              Complete Registration & Access Studio
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
