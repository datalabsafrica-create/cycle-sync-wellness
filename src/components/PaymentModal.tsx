import { useState, useEffect } from 'react';
import { Check, ArrowRight, MessageCircle, Mail, PlayCircle, ExternalLink } from 'lucide-react';

// ============================================================================
// 🛑 PASTE YOUR SMART AD LINK HERE 🛑
// Replace the empty string below with your actual ad network smart link.
// Example: const SMART_AD_LINK = 'https://cleanmaster.com/special-offer';
// ============================================================================
const SMART_AD_LINK = ''; 
// ============================================================================

interface PaymentModalProps {
  onSuccess: (method: 'whatsapp' | 'email') => void;
  onClose: () => void;
}

export default function PaymentModal({ onSuccess, onClose }: PaymentModalProps) {
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'whatsapp' | 'email'>('whatsapp');
  const [adClicked, setAdClicked] = useState(false);

  useEffect(() => {
    if (adClicked && !isProcessing) {
      const handleFocus = () => {
        setIsProcessing(true);
        setTimeout(() => {
          onSuccess(deliveryMethod);
        }, 1000);
        window.removeEventListener('focus', handleFocus);
        window.removeEventListener('visibilitychange', handleVisibility);
      };

      const handleVisibility = () => {
        if (document.visibilityState === 'visible') {
          handleFocus();
        }
      };

      const timeoutId = setTimeout(() => {
        window.addEventListener('focus', handleFocus);
        window.addEventListener('visibilitychange', handleVisibility);
      }, 500);

      const fallbackTimer = setTimeout(() => {
        if (!isProcessing) {
          setIsProcessing(true);
          onSuccess(deliveryMethod);
        }
      }, 20000);

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(fallbackTimer);
        window.removeEventListener('focus', handleFocus);
        window.removeEventListener('visibilitychange', handleVisibility);
      };
    }
  }, [adClicked, isProcessing, deliveryMethod, onSuccess]);

  const handleWatchAd = () => {
    if (!SMART_AD_LINK) {
      alert("Developer: Please configure the SMART_AD_LINK in the PaymentModal.tsx file first to use this feature.");
      return;
    }
    
    // Open the smart ad link in a new tab
    window.open(SMART_AD_LINK, '_blank');
    
    setAdClicked(true);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-10 text-2xl leading-none"
        >
          &times;
        </button>
        
        <div className="p-8">
          {step === 'details' ? (
            <div className="relative z-10">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Unlock Your 7-Day Plan</h2>
              <p className="text-slate-500 text-sm text-center mb-6">Get your personalized, full weekly meal & workout plan.</p>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Delivery Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setDeliveryMethod('whatsapp')}
                      className={`flex flex-col items-center justify-center py-4 rounded-xl border-2 transition-all ${deliveryMethod === 'whatsapp' ? 'border-[#25D366] bg-[#25D366]/5' : 'border-slate-200 hover:border-slate-300 bg-slate-50'}`}
                    >
                      <MessageCircle className={`w-6 h-6 mb-1 ${deliveryMethod === 'whatsapp' ? 'text-[#25D366]' : 'text-slate-400'}`} />
                      <span className={`text-sm font-semibold ${deliveryMethod === 'whatsapp' ? 'text-[#25D366]' : 'text-slate-500'}`}>WhatsApp</span>
                    </button>
                    <button 
                      onClick={() => setDeliveryMethod('email')}
                      className={`flex flex-col items-center justify-center py-4 rounded-xl border-2 transition-all ${deliveryMethod === 'email' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300 bg-slate-50'}`}
                    >
                      <Mail className={`w-6 h-6 mb-1 ${deliveryMethod === 'email' ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span className={`text-sm font-semibold ${deliveryMethod === 'email' ? 'text-indigo-600' : 'text-slate-500'}`}>Email</span>
                    </button>
                  </div>
                </div>
                
                {deliveryMethod === 'whatsapp' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp Number</label>
                    <input type="tel" placeholder="+1 (555) 000-0000" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#25D366] outline-none" />
                  </div>
                )}
                {deliveryMethod === 'email' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input type="email" placeholder="you@example.com" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                )}
              </div>

              <button 
                onClick={() => setStep('payment')} 
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-md border hover:bg-indigo-700 transition-colors"
              >
                 Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="relative z-10 transition-all">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Confirm Summary</h2>
                <p className="text-slate-500 text-sm">You are one step away from your personalized weekly plan.</p>
              </div>
              
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-8">
                <div className="flex items-end justify-center gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-slate-900">Free</span>
                  <span className="text-xs text-emerald-600 font-bold bg-emerald-100 px-2 py-1 rounded-full mb-1">100% Free</span>
                </div>
                
                <ul className="space-y-3">
                  {[
                    'Full 7-Day Personalized Meal Plan',
                    'Categorized Grocery List',
                    'Specific Mode & Hormone Insights',
                    `Delivered directly to your ${deliveryMethod === 'whatsapp' ? 'WhatsApp' : 'Email'}`,
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                      <div className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <Check className="w-3 h-3" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handleWatchAd}
                  disabled={adClicked || isProcessing}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                     <div className="flex items-center gap-2">
                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                       <span>Unlocking...</span>
                     </div>
                  ) : adClicked ? (
                     <div className="flex items-center gap-2">
                       <span className="animate-pulse">Waiting for you to finish...</span>
                     </div>
                  ) : (
                    <>
                      <PlayCircle className="w-5 h-5" />
                      Watch Ad to Unlock
                      <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
                    </>
                  )}
                </button>
                <button 
                  onClick={() => setStep('details')}
                  className="w-full py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700"
                  disabled={isProcessing}
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
