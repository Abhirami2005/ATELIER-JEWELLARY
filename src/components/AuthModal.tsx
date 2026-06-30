import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Lock, Mail, X, Shield, ShieldCheck, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { userId: string; name: string; email: string; role: 'Customer' | 'Admin' }) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Sign up fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // --- CASE 1: ADMIN OVERRIDE LOGIN (HARD-CODED) ---
    if (!isSignUp && usernameOrEmail.trim() === 'ATELIER' && password === 'ATELIER2005') {
      const adminUser = {
        userId: 'admin',
        name: 'Atelier Administrator',
        email: 'ATELIER',
        role: 'Admin' as const,
      };
      localStorage.setItem('atelier_current_user', JSON.stringify(adminUser));
      onLoginSuccess(adminUser);
      onClose();
      return;
    }

    // --- CASE 2: REGULAR CUSTOMER SIGN UP ---
    if (isSignUp) {
      if (!name || !email || !password) {
        setErrorMsg('Please populate all fields with valid data.');
        return;
      }
      
      // Get existing registered users
      const storedUsers = localStorage.getItem('atelier_users');
      const usersList = storedUsers ? JSON.parse(storedUsers) : [];
      
      // Check for duplicates
      if (usersList.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
        setErrorMsg('This email address has already been registered.');
        return;
      }

      const userId = email.toLowerCase();
      const newCustomer = {
        userId,
        name,
        email,
        password,
        role: 'Customer' as const
      };

      usersList.push(newCustomer);
      localStorage.setItem('atelier_users', JSON.stringify(usersList));
      
      const sessionUser = { userId, name, email, role: 'Customer' as const };
      localStorage.setItem('atelier_current_user', JSON.stringify(sessionUser));
      
      onLoginSuccess(sessionUser);
      onClose();
      return;
    }

    // --- CASE 3: REGULAR CUSTOMER LOGIN ---
    if (!isSignUp) {
      if (!usernameOrEmail || !password) {
        setErrorMsg('Please input valid email and security credentials.');
        return;
      }

      const storedUsers = localStorage.getItem('atelier_users');
      const usersList = storedUsers ? JSON.parse(storedUsers) : [];

      const foundUser = usersList.find(
        (u: any) => u.email.toLowerCase() === usernameOrEmail.toLowerCase() && u.password === password
      );

      if (foundUser) {
        const userId = foundUser.userId || foundUser.email.toLowerCase();
        const sessionUser = { userId, name: foundUser.name, email: foundUser.email, role: 'Customer' as const };
        localStorage.setItem('atelier_current_user', JSON.stringify(sessionUser));
        onLoginSuccess(sessionUser);
        onClose();
      } else {
        setErrorMsg('Invalid login credentials. Normal account not found or password incorrect.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md text-left">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-md rounded-lg border border-[#1d2f30] bg-[#0a1617] p-6 md:p-8 shadow-gold-heavy overflow-hidden"
      >
        {/* Top gold line */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gold-gradient" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white border border-[#1d2f30] hover:border-[#c5a059] rounded-full h-8 w-8 flex items-center justify-center bg-[#111e1f] cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059]">
            <Sparkles className="h-5 w-5" />
          </div>
          <h2 className="font-luxury-title text-xl text-white font-medium">
            {isSignUp ? 'Establish Sovereign Account' : 'Authenticate with Atelier'}
          </h2>
          <p className="text-[10px] text-neutral-400 font-sans tracking-wide">
            {isSignUp ? 'Enter name, email, and security password' : 'Log in as a Sovereign Patron'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded border border-rose-500/30 bg-rose-500/5 text-rose-400 text-xs text-center font-sans font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isSignUp && (
            /* Name Input for Signup */
            <div className="space-y-1.5">
              <label className="block text-[9px] font-display tracking-widest text-neutral-500 uppercase font-semibold">
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                <input
                  required
                  type="text"
                  placeholder="e.g. Anandita Bose"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#111e1f] rounded border border-[#1d2f30] py-3.5 pl-10 pr-4 text-xs text-neutral-200 focus:border-[#c5a059] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Email or Username */}
          <div className="space-y-1.5">
            <label className="block text-[9px] font-display tracking-widest text-neutral-500 uppercase font-semibold">
              {isSignUp ? 'Email Address' : 'Email Address or Username'}
            </label>
            <div className="relative">
              {isSignUp ? (
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
              ) : (
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
              )}
              <input
                required
                type={isSignUp ? 'email' : 'text'}
                placeholder={isSignUp ? 'e.g. radha@heritage.com' : 'Enter email or ATELIER...'}
                value={isSignUp ? email : usernameOrEmail}
                onChange={(e) => {
                  if (isSignUp) setEmail(e.target.value);
                  else setUsernameOrEmail(e.target.value);
                }}
                className="w-full bg-[#111e1f] rounded border border-[#1d2f30] py-3.5 pl-10 pr-4 text-xs text-neutral-200 focus:border-[#c5a059] focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-[9px] font-display tracking-widest text-neutral-500 uppercase font-semibold">
                Security Password
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
              <input
                required
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#111e1f] rounded border border-[#1d2f30] py-3.5 pl-10 pr-4 text-xs text-neutral-200 focus:border-[#c5a059] focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded bg-gold-gradient py-3.5 text-xs font-display font-bold uppercase tracking-[0.2em] text-black hover:opacity-95 shadow-gold-glow transition-all cursor-pointer"
          >
            {isSignUp ? 'ESTABLISH MEMBER ACCOUNT' : 'LOGIN SECURELY'}
          </button>
        </form>

        {/* Toggle Mode Footer */}
        <div className="mt-5 pt-4 border-t border-[#1d2f30]/40 text-center">
          <p className="text-[10px] text-neutral-500 font-sans">
            {isSignUp ? 'Already have an Atelier account?' : 'New to India modern luxury house?'}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg(null);
              }}
              className="ml-1 text-[#c5a059] font-semibold hover:underline focus:outline-none cursor-pointer"
            >
              {isSignUp ? 'Log In Instead' : 'Register Customer Profile'}
            </button>
          </p>
        </div>

        {/* Staff/Admin Notice */}
        {!isSignUp && (
          <div className="mt-4 p-3 rounded bg-amber-500/5 border border-amber-500/10 text-center">
            <p className="text-[9px] text-neutral-400 font-sans leading-normal">
              Atelier Management: authenticate with Staff Credentials to unlock direct administrative oversight of orders, inventory parameters, and high jewellery commissions.
            </p>
          </div>
        )}

      </motion.div>
    </div>
  );
}
