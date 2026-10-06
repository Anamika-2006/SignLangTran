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
  Globe
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('signin'); // 'signin' or 'signup'
  
  // Sign In Form States
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

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

  if (!isOpen) return null;

  // Calculate dynamic password strength (0 to 100)
  const calculatePasswordStrength = (pass) => {
    let score = 0;
    if (pass.length > 5) score += 25;
    if (pass.length > 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const passStrength = calculatePasswordStrength(signUpPassword);

  const getStrengthLabel = () => {
    if (passStrength === 0) return { label: 'Empty', color: 'text-slate-500' };
    if (passStrength <= 25) return { label: 'Weak', color: 'text-rose-400' };
    if (passStrength <= 50) return { label: 'Medium', color: 'text-amber-400' };
    if (passStrength <= 75) return { label: 'Strong', color: 'text-cyan-400' };
    return { label: 'Military-Grade Protected', color: 'text-emerald-400' };
  };

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    sounds.playSuccess();
    const user = {
      name: signInEmail.split('@')[0] || 'Aura User',
      email: signInEmail || 'user@gesturesync.ai',
      role: 'Registered Signer'
    };
    onLoginSuccess(user);
    onClose();
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (!acceptedTerms) {
      alert('Please accept terms of service');
      return;
    }
    sounds.playSuccess();
    const user = {
      name: signUpName || 'New Member',
      email: signUpEmail || 'new@gesturesync.ai',
      role: selectedRole
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
      role: role
    };
    onLoginSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-cyan-500/40 p-6 sm:p-8 shadow-2xl shadow-cyan-950/50 flex flex-col gap-6 text-left max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => { sounds.playClick(); onClose(); }}
          className="absolute right-5 top-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/30">
            🤟
          </div>
          <div>
            <h3 className="text-xl font-black text-white font-mono">
              GESTURE<span className="text-cyan-400">SYNC</span> ID
            </h3>
            <p className="text-xs text-slate-400">
              Universal Sign Language Neural Access Portal
            </p>
          </div>
        </div>

        {/* 1-Click Instant Demo Access Strip */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/50 via-indigo-950/40 to-slate-900 border border-cyan-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400 flex-shrink-0 animate-pulse" />
            <span className="text-xs text-cyan-200 font-medium">
              Want instant access without registering?
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('Certified Interpreter')}
            className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs whitespace-nowrap shadow-md transition-all active:scale-95"
          >
            1-Click Demo
          </button>
        </div>

        {/* Tabs: Sign In / Sign Up */}
        <div className="flex p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold">
          <button
            onClick={() => { sounds.playClick(); setActiveTab('signin'); setForgotPasswordMode(false); }}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              activeTab === 'signin' && !forgotPasswordMode
                ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In to Account
          </button>
          <button
            onClick={() => { sounds.playClick(); setActiveTab('signup'); setForgotPasswordMode(false); }}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              activeTab === 'signup' && !forgotPasswordMode
                ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* FORGOT PASSWORD SUB-FLOW */}
        {forgotPasswordMode ? (
          <div className="flex flex-col gap-4">
            <h4 className="text-base font-bold text-white">Reset Account Password</h4>
            <p className="text-xs text-slate-400">
              Enter your email address and we will dispatch a neural cryptographic reset token to your inbox.
            </p>
            <input
              type="email"
              placeholder="name@domain.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-cyan-400 outline-none"
            />
            {forgotSent ? (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-medium">
                Reset instruction token sent! Please check your email.
              </div>
            ) : (
              <button
                onClick={() => { sounds.playSuccess(); setForgotSent(true); }}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-md"
              >
                Send Reset Link
              </button>
            )}
            <button
              onClick={() => setForgotPasswordMode(false)}
              className="text-xs text-cyan-400 hover:underline text-center"
            >
              &larr; Return to Sign In
            </button>
          </div>
        ) : activeTab === 'signin' ? (
          /* SIGN IN FORM */
          <form onSubmit={handleSignInSubmit} className="flex flex-col gap-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">EMAIL OR USERNAME</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="anamika@gesturesync.ai"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:border-cyan-400 outline-none shadow-inner"
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-white text-sm focus:border-cyan-400 outline-none shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowSignInPassword(!showSignInPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
                >
                  {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded accent-cyan-500 w-4 h-4 bg-slate-950"
              />
              <label htmlFor="remember" className="cursor-pointer">
                Keep session authenticated on this machine
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all mt-2 active:scale-95"
            >
              Sign In to GestureSync
            </button>

            {/* Social Logins */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase font-mono">
                <span className="bg-slate-900 px-2 text-slate-500">OR CONNECT WITH</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {['Google', 'GitHub', 'Apple'].map((provider) => (
                <button
                  key={provider}
                  type="button"
                  onClick={() => handleQuickDemoLogin(`${provider} Signer`)}
                  className="py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition-colors"
                >
                  {provider}
                </button>
              ))}
            </div>

          </form>
        ) : (
          /* SIGN UP FORM */
          <form onSubmit={handleSignUpSubmit} className="flex flex-col gap-4">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">YOUR FULL NAME</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  placeholder="Anamika Pandey"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:border-cyan-400 outline-none shadow-inner"
                />
              </div>
            </div>

            {/* Email */}
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:border-cyan-400 outline-none shadow-inner"
                />
              </div>
            </div>

            {/* Password with Strength Meter */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <label className="text-slate-300">CREATE SECURE PASSWORD</label>
                <span className={getStrengthLabel().color}>
                  {getStrengthLabel().label}
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-white text-sm focus:border-cyan-400 outline-none shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
                >
                  {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength Meter Bar */}
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full transition-all duration-300 ${
                    passStrength <= 25 ? 'bg-rose-500' :
                    passStrength <= 50 ? 'bg-amber-500' :
                    passStrength <= 75 ? 'bg-cyan-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${passStrength}%` }}
                />
              </div>
            </div>

            {/* Role Selection Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">COMMUNITY ROLE PROFILE</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'Deaf / Hard-of-Hearing', icon: '🤟', label: 'Deaf / Hard of Hearing' },
                  { id: 'Sign Language Interpreter', icon: '🗣️', label: 'Certified Interpreter' },
                  { id: 'Student / Learner', icon: '🎓', label: 'Sign Language Student' },
                  { id: 'Healthcare Worker', icon: '🏥', label: 'Healthcare & Public' },
                ].map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => { sounds.playClick(); setSelectedRole(role.id); }}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      selectedRole === role.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-white font-semibold shadow'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-base">{role.icon}</span>
                    <span className="truncate">{role.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-center gap-2 text-xs text-slate-300 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="rounded accent-cyan-500 w-4 h-4 bg-slate-950"
              />
              <label htmlFor="terms" className="cursor-pointer">
                I agree to the Accessibility Privacy Pledge and Terms
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 transition-all mt-2 active:scale-95"
            >
              Complete Registration & Enter
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
