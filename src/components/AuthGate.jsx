import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  Fingerprint, 
  CheckCircle2, 
  KeyRound,
  Layers,
  Video,
  Mic,
  Cpu,
  Globe2,
  Check
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function AuthGate({ onLoginSuccess }) {
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  
  // Sign In State
  const [signInEmail, setSignInEmail] = useState('anamika@gesturesync.ai');
  const [signInPassword, setSignInPassword] = useState('GestureSync2026!');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);

  // Sign Up State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [signUpRole, setSignUpRole] = useState('Deaf / Hard-of-Hearing Individual');
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  // Forgot Password Mode
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  // Password Strength Calculation
  const hasMinLength = signUpPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(signUpPassword);
  const hasNumber = /[0-9]/.test(signUpPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(signUpPassword);

  const calculateScore = () => {
    let score = 0;
    if (signUpPassword.length >= 6) score += 25;
    if (hasMinLength) score += 25;
    if (hasUpperCase) score += 25;
    if (hasNumber || hasSpecial) score += 25;
    return score;
  };

  const passScore = calculateScore();

  const handleSignIn = (e) => {
    e.preventDefault();
    sounds.playSuccess();
    const user = {
      name: signInEmail ? signInEmail.split('@')[0] : 'Anamika',
      email: signInEmail || 'anamika@gesturesync.ai',
      role: 'Verified Community Member',
      avatar: '🤟',
      plan: 'Enterprise Pro'
    };
    onLoginSuccess(user);
  };

  const handleSignUp = (e) => {
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
      role: signUpRole,
      avatar: '✨',
      plan: 'Community Pro'
    };
    onLoginSuccess(user);
  };

  // Instant 1-Click VIP Demo Login
  const handleQuickDemoAccess = (role = 'Certified ASL/ISL Specialist') => {
    sounds.playSuccess();
    const demoUser = {
      name: 'Anamika',
      email: 'anamika@gesturesync.ai',
      role: role,
      avatar: '🤟',
      plan: 'Enterprise VIP'
    };
    onLoginSuccess(demoUser);
  };

  // Simulated Biometric Hand Scan Access
  const handleBiometricScan = () => {
    sounds.playClick();
    setIsBiometricScanning(true);
    setTimeout(() => {
      sounds.playSuccess();
      setIsBiometricScanning(false);
      handleQuickDemoAccess('Biometric Verified Signer');
    }, 1400);
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-slate-900 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      
      {/* Background Ambient Gradient Meshes */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Branding */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-xl shadow-md shadow-indigo-500/20">
            🤟
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-slate-900 font-sans">
                Gesture<span className="text-indigo-600">Sync</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                PRO PLATFORM
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Universal Multimodal Sign Language & Speech Platform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="font-semibold">Sub-15ms Edge AI Online</span>
        </div>
      </header>

      {/* Main Split Gateway Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-center z-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white/80 backdrop-blur-xl rounded-[32px] border border-slate-200/90 shadow-2xl shadow-indigo-950/5 overflow-hidden p-6 sm:p-10">
          
          {/* Left Column: Interactive Product Showcase & Trust Indicators */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-8 text-left border-b lg:border-b-0 lg:border-r border-slate-200/80 pb-8 lg:pb-0 lg:pr-10">
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                ENTERPRISE SIGN INTELLIGENCE SUITE
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Sign in to access the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800">
                  Universal Sign Platform
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                Real-time gesture recognition, bidirectional voice-to-sign conversion, 21-joint 3D spatial kinematics, and instant neural voice synthesis.
              </p>
            </div>

            {/* 3 Core Highlight Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs">
                  <Video className="w-4 h-4" />
                  <span>Vision Studio</span>
                </div>
                <p className="text-lg font-black text-slate-900 font-mono mt-0.5">60 FPS</p>
                <p className="text-[11px] text-slate-500">Sub-15ms edge latency</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
                  <Mic className="w-4 h-4" />
                  <span>Voice-to-Sign</span>
                </div>
                <p className="text-lg font-black text-slate-900 font-mono mt-0.5">2-Way</p>
                <p className="text-[11px] text-slate-500">Spoken voice into sign</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Privacy</span>
                </div>
                <p className="text-lg font-black text-slate-900 font-mono mt-0.5">WASM</p>
                <p className="text-[11px] text-slate-500">Zero cloud storage</p>
              </div>
            </div>

            {/* Instant VIP Demo Access Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-50 border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">Fast 1-Click VIP Demo Pass</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Evaluate all studios immediately without creating credentials</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleQuickDemoAccess('Certified ASL/ISL Specialist')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs whitespace-nowrap shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                Enter Platform Now &rarr;
              </button>
            </div>

            {/* Privacy Compliance Footer */}
            <div className="flex items-center gap-3 text-xs text-slate-500 border-t border-slate-100 pt-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>HIPAA & GDPR Compliant &bull; 100% Client-Side Video Processing &bull; Open-Source</span>
            </div>

          </div>

          {/* Right Column: Authentication Form Interface */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left">
            <div className="w-full max-w-md mx-auto space-y-6">
              
              {/* Tab Switcher: Sign In vs Sign Up */}
              <div className="flex p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => { sounds.playClick(); setAuthMode('signin'); setIsForgotPassword(false); }}
                  className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer ${
                    authMode === 'signin' && !isForgotPassword
                      ? 'bg-white text-indigo-600 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign In to Platform
                </button>
                <button
                  type="button"
                  onClick={() => { sounds.playClick(); setAuthMode('signup'); setIsForgotPassword(false); }}
                  className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer ${
                    authMode === 'signup' && !isForgotPassword
                      ? 'bg-white text-indigo-600 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Create New Account
                </button>
              </div>

              {/* FORGOT PASSWORD SUB-FLOW */}
              {isForgotPassword ? (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <KeyRound className="w-5 h-5 text-indigo-600" />
                      Reset Your Password
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Enter your account email address to receive password reset instructions.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">ACCOUNT EMAIL</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        placeholder="anamika@gesturesync.ai"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                      />
                    </div>
                  </div>

                  {recoverySent ? (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Password reset link sent! Check your inbox to proceed.</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (recoveryEmail) {
                          sounds.playSuccess();
                          setRecoverySent(true);
                        }
                      }}
                      className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
                    >
                      Send Password Reset Link
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => { sounds.playClick(); setIsForgotPassword(false); setRecoverySent(false); }}
                    className="text-xs text-indigo-600 hover:underline block text-center cursor-pointer"
                  >
                    &larr; Back to Sign In
                  </button>
                </div>
              ) : authMode === 'signin' ? (

                /* SIGN IN FORM */
                <form onSubmit={handleSignIn} className="space-y-4">
                  
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
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700">PASSWORD</label>
                      <button
                        type="button"
                        onClick={() => { sounds.playClick(); setIsForgotPassword(true); }}
                        className="text-xs text-indigo-600 hover:underline cursor-pointer"
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
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPassword(!showSignInPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                      />
                      <span>Keep me signed in for 30 days</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Sign In & Unlock Platform</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-200" />
                    <span className="flex-shrink mx-3 text-[11px] text-slate-400 uppercase font-semibold">Or Biometric Scan</span>
                    <div className="flex-grow border-t border-slate-200" />
                  </div>

                  <button
                    type="button"
                    onClick={handleBiometricScan}
                    disabled={isBiometricScanning}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Fingerprint className={`w-4 h-4 text-indigo-600 ${isBiometricScanning ? 'animate-spin' : ''}`} />
                    <span>{isBiometricScanning ? 'Verifying Neural Hand Scan...' : 'Quick Hand Sign / Biometric Access'}</span>
                  </button>

                </form>

              ) : (

                /* SIGN UP FORM */
                <form onSubmit={handleSignUp} className="space-y-4">
                  
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
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">WORK / PERSONAL EMAIL</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="anamika@gesturesync.ai"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">PRIMARY COMMUNITY ROLE</label>
                    <select
                      value={signUpRole}
                      onChange={(e) => setSignUpRole(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                    >
                      <option value="Deaf / Hard-of-Hearing Individual">Deaf / Hard-of-Hearing Individual</option>
                      <option value="Certified ASL / ISL Interpreter">Certified ASL / ISL Interpreter</option>
                      <option value="Healthcare & Hospital Worker">Healthcare & Hospital Worker</option>
                      <option value="Educator or Academic Researcher">Educator or Academic Researcher</option>
                      <option value="Family Member or Ally">Family Member or Ally</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">PASSWORD</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showSignUpPassword ? 'text' : 'password'}
                        required
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        placeholder="Minimum 8 characters..."
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {signUpPassword.length > 0 && (
                      <div className="pt-1.5 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Security Score:</span>
                          <span className={passScore >= 75 ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                            {passScore >= 75 ? 'Strong Security' : 'Moderate'}
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${passScore >= 75 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${passScore}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-2 pt-1 text-xs text-slate-600">
                    <input
                      type="checkbox"
                      required
                      id="termsCheckGate"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="w-4 h-4 mt-0.5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    />
                    <label htmlFor="termsCheckGate" className="cursor-pointer leading-tight">
                      I agree to terms of service & 100% on-device private processing.
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Create Account & Enter</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>
      </main>

      {/* Footer Branding */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 border-t border-slate-200/60 z-10">
        <p>&copy; 2026 GestureSync AI Platform. Accessibility & dignity first.</p>
        <p className="flex items-center gap-1 mt-1 sm:mt-0">
          Engineered by Anamika &bull; Open Source on GitHub
        </p>
      </footer>

    </div>
  );
}
