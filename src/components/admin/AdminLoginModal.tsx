import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../../context/AdminContext';
import {
  X,
  Lock,
  ShieldCheck,
  AlertCircle,
  Mail,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { sendVerificationCode, verifySecurityCode, login } = useAdmin();

  // Login steps: 'credentials' -> 'verify_otp'
  const [step, setStep] = useState<'credentials' | 'verify_otp'>('credentials');

  // Form states
  const [email, setEmail] = useState('ukfurniture1111@gmail.com');
  const [password, setPassword] = useState('ukfurniture2026');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [latestPreviewCode, setLatestPreviewCode] = useState<string | null>(null);
  const [recipientEmail, setRecipientEmail] = useState('piyarafawad36@gmail.com');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Reset states when opened
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setStep('credentials');
      setOtpDigits(['', '', '', '', '', '']);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Step 1: Request OTP Code
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await sendVerificationCode(email, password);
      if (res.success) {
        setRecipientEmail(res.recipientEmail || 'piyarafawad36@gmail.com');
        if (res.previewCode) {
          setLatestPreviewCode(res.previewCode);
        }
        setStep('verify_otp');
        setResendCooldown(60);
        // Focus first OTP box
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 150);
      } else {
        setError(res.error || 'Failed to dispatch verification code');
      }
    } catch (err: any) {
      setError(err.message || 'Request failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Handle OTP input changes
  const handleOtpChange = (index: number, val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '');
    if (!cleaned) {
      const newDigits = [...otpDigits];
      newDigits[index] = '';
      setOtpDigits(newDigits);
      return;
    }

    // If pasted multi-character code
    if (cleaned.length > 1) {
      const chars = cleaned.slice(0, 6).split('');
      const newDigits = [...otpDigits];
      chars.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setOtpDigits(newDigits);
      const nextIdx = Math.min(chars.length, 5);
      otpInputRefs.current[nextIdx]?.focus();
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = cleaned[0];
    setOtpDigits(newDigits);

    // Auto move to next input
    if (cleaned && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Auto fill code from preview banner
  const handleAutoFillCode = () => {
    if (!latestPreviewCode) return;
    const chars = latestPreviewCode.split('').slice(0, 6);
    setOtpDigits(chars);
    otpInputRefs.current[5]?.focus();
  };

  // Step 2: Submit OTP Verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits of the confirmation code.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const res = await verifySecurityCode(code);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.error || 'Invalid confirmation code');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend code handler
  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await sendVerificationCode(email, password);
      if (res.success) {
        setResendCooldown(60);
        if (res.previewCode) setLatestPreviewCode(res.previewCode);
      } else {
        setError(res.error || 'Failed to resend code');
      }
    } catch (err: any) {
      setError(err.message || 'Resend failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-stone-900 text-white p-6 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-serif font-bold text-lg shadow-inner">
              UK
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-white">Master Admin Portal</h3>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  2FA Verified
                </span>
              </div>
              <div className="text-xs text-stone-400">UK Furniture Hub Management</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Close admin login"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: CREDENTIALS ENTRY */}
        {step === 'credentials' && (
          <form onSubmit={handleRequestCode} className="p-6 space-y-4">
            {/* 2FA Notice Banner */}
            <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>2-Step Email Verification Required</span>
              </div>
              <p className="text-amber-800 leading-relaxed">
                For security, a 6-digit confirmation code will be dispatched to{' '}
                <strong className="text-amber-950 font-semibold underline">piyarafawad36@gmail.com</strong>{' '}
                upon submitting credentials.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-stone-500" />
                Admin Account Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ukfurniture1111@gmail.com"
                className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-sm rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-stone-800 focus:outline-hidden font-medium"
              />
              <span className="text-[11px] text-stone-500 mt-1 block">
                Primary Master Admin: <code className="font-bold text-stone-800">ukfurniture1111@gmail.com</code>
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-stone-500" />
                Admin Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-stone-50 border border-stone-300 text-stone-900 text-sm rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-stone-800 focus:outline-hidden font-medium"
              />
              <span className="text-[11px] text-stone-500 mt-1 block">
                Default Master Password: <code className="font-mono bg-stone-100 px-1 py-0.5 rounded text-stone-800">ukfurniture2026</code>
              </span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white font-bold py-3.5 rounded-xl text-sm transition-transform active:scale-98 shadow-md flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'Sending Security Code...' : 'Send Confirmation Code'}</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: 2FA OTP VERIFICATION */}
        {step === 'verify_otp' && (
          <form onSubmit={handleVerifyOtp} className="p-6 space-y-5">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto mb-2 border border-amber-200">
                <KeyRound className="w-6 h-6 text-amber-700" />
              </div>
              <h4 className="font-serif font-bold text-lg text-stone-900">Enter Confirmation Code</h4>
              <p className="text-xs text-stone-600 leading-relaxed px-2">
                A 6-digit code has been generated and sent to:
                <br />
                <span className="font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded-md inline-block mt-1">
                  {recipientEmail}
                </span>
              </p>
            </div>

            {/* Live Security Code Notification / Fast-Fill Card */}
            {latestPreviewCode && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between gap-3 shadow-2xs animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-bold text-emerald-950">Code Dispatched to Email:</div>
                    <div className="font-mono text-sm tracking-widest font-extrabold text-emerald-800">
                      {latestPreviewCode}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAutoFillCode}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors shrink-0 shadow-2xs"
                >
                  Auto-Fill
                </button>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* 6 OTP Input Boxes */}
            <div className="flex justify-between gap-2 sm:gap-2.5">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { otpInputRefs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-mono font-bold bg-stone-50 border-2 border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:border-amber-500 focus:outline-hidden transition-all shadow-inner"
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="flex items-center gap-1 text-stone-600 hover:text-stone-900 font-semibold transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={resendCooldown > 0 || isSubmitting}
                onClick={handleResendCode}
                className="flex items-center gap-1.5 text-amber-700 hover:text-amber-800 font-bold disabled:text-stone-400 transition-colors"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
                <span>{resendCooldown > 0 ? `Resend Code (${resendCooldown}s)` : 'Resend Code'}</span>
              </button>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || otpDigits.join('').length !== 6}
                className="w-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white font-bold py-3.5 rounded-xl text-sm transition-transform active:scale-98 shadow-md flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>{isSubmitting ? 'Verifying Code...' : 'Verify & Unlock Admin Access'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Footer info */}
        <div className="bg-stone-50 border-t border-stone-200 px-6 py-3 text-[11px] text-stone-500 flex items-center justify-between">
          <span>UK Furniture Hub Showroom Security</span>
          <span className="font-semibold text-stone-700">All Access Enabled</span>
        </div>
      </div>
    </div>
  );
};
