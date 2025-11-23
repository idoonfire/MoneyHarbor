// Simplified Investment Details Modal - Clean and focused on getting the PDF

'use client';

import { useState } from 'react';
import { ScoredInvestment } from '@/lib/scoring';
import EmailReportPopup from './EmailReportPopup';
import { generateInvestmentPDFClient } from '@/lib/generatePDFClient';

interface InvestmentDetailsModalProps {
  investment: ScoredInvestment & {
    actionSteps?: {
      howToStart?: string;
      platforms?: string[];
      costs?: string;
      timeline?: string;
      tips?: string[];
    };
  };
  userAmount: number;
  onClose: () => void;
  onEmailSent?: () => void;
}

export default function InvestmentDetailsModal({ investment, userAmount, onClose, onEmailSent }: InvestmentDetailsModalProps) {
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSendEmail = async (email: string, fullName: string) => {
    // Close popup and show success immediately
    setShowEmailPopup(false);
    setEmailSent(true);
    
    // Trigger toast notification
    if (onEmailSent) {
      onEmailSent();
    }
    
    // Close success message and modal after 2 seconds
    setTimeout(() => {
      setEmailSent(false);
      onClose();
    }, 2000);
    
    // Send email in background - fire and forget
    (async () => {
      try {
        console.log('🤖 Generating detailed guide with AI in background...');
        
        let detailedGuide = null;
        try {
          const guideResponse = await fetch('/api/expand-guide', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ investment })
          });
          
          if (guideResponse.ok) {
            const guideData = await guideResponse.json();
            detailedGuide = guideData.guide;
            console.log('✅ Detailed guide generated');
          }
        } catch (error) {
          console.error('⚠️ Error generating detailed guide:', error);
        }
        
        console.log('📄 Generating PDF in background...');
        
        const pdfBase64 = await generateInvestmentPDFClient(investment, userAmount, detailedGuide);
        console.log('✅ PDF generated');
        
        console.log('📧 Sending email...');
        
        // Get user's original search preferences for database tracking
        const savedPreferences = localStorage.getItem('moneyHarbor_lastPreferences');
        const preferences = savedPreferences ? JSON.parse(savedPreferences) : {};
        
        // Send email
        const response = await fetch('/api/send-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email, 
            fullName, 
            investment, 
            pdfBase64,
            searchParams: {
              amount: userAmount,
              timeHorizon: preferences.timeHorizon || investment.timeHorizon,
              riskLevel: preferences.riskLevel || investment.riskLevel,
              knowledgeLevel: preferences.knowledgeLevel,
              additionalNotes: preferences.additionalNotes,
            }
          })
        });
        
        if (response.ok) {
          console.log('✅ Email sent successfully in background');
        } else {
          console.error('❌ Email failed to send');
        }
        
      } catch (error) {
        console.error('❌ Background email error:', error);
      }
    })();
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'נמוכה': return '#10b981';
      case 'בינונית': return '#f59e0b';
      case 'גבוהה': return '#ef4444';
      default: return '#8a8a8a';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(10, 10, 10, 0.95)' }} onClick={onClose}>
      <div 
        className="border rounded-2xl w-full max-w-3xl shadow-2xl"
        style={{ 
          backgroundColor: 'rgba(26, 26, 26, 0.98)',
          borderColor: 'rgba(255, 149, 0, 0.4)',
          borderWidth: '2px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
          <button
            onClick={onClose}
          className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:rotate-90"
            style={{
              background: 'linear-gradient(135deg, #ff9500 0%, #ffb347 100%)',
              color: '#0a0a0a',
              fontSize: '18px',
              fontWeight: 'bold'
            }}
          >
            ✕
          </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Investment Name */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#ff9500' }}>
              {investment.name}
            </h2>
            <span className="px-4 py-1.5 rounded-full text-sm font-bold inline-block" style={{
              backgroundColor: `${getRiskColor(investment.riskLevel)}20`,
              color: getRiskColor(investment.riskLevel)
            }}>
              רמת סיכון: {investment.riskLevel}
            </span>
          </div>

          {/* Description */}
          <p className="text-base mb-8 leading-relaxed max-w-2xl mx-auto" style={{ color: '#b0b0b0' }}>
            {investment.description || 'אפיק השקעה מומלץ'}
          </p>

          {/* Quick Stats - 3 Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="border rounded-lg p-4" style={{ 
              backgroundColor: 'rgba(255, 149, 0, 0.05)',
              borderColor: 'rgba(255, 149, 0, 0.3)'
            }}>
              <div className="text-xs mb-1" style={{ color: '#8a8a8a' }}>טווח זמן</div>
              <div className="font-bold text-base" style={{ color: '#ff9500' }}>
                {Array.isArray(investment.timeHorizon) ? investment.timeHorizon.join(', ') : investment.timeHorizon}
              </div>
            </div>

            <div className="border rounded-lg p-4" style={{ 
              backgroundColor: 'rgba(255, 149, 0, 0.05)',
              borderColor: 'rgba(255, 149, 0, 0.3)'
            }}>
              <div className="text-xs mb-1" style={{ color: '#8a8a8a' }}>נזילות</div>
              <div className="font-bold text-base" style={{ color: '#ff9500' }}>
                {investment.liquidity || 'בינונית'}
              </div>
            </div>

            <div className="border rounded-lg p-4" style={{ 
              backgroundColor: 'rgba(255, 149, 0, 0.05)',
              borderColor: 'rgba(255, 149, 0, 0.3)'
            }}>
              <div className="text-xs mb-1" style={{ color: '#8a8a8a' }}>מינימום</div>
              <div className="font-bold text-base" style={{ color: '#ff9500' }}>
                {investment.minAmount ? `₪${Number(investment.minAmount).toLocaleString()}` : 'ללא'}
              </div>
            </div>
          </div>

          {/* Main CTA */}
            <div className="space-y-4">
            <div className="border-t border-b py-6" style={{ borderColor: 'rgba(255, 149, 0, 0.2)' }}>
              <p className="text-sm mb-3" style={{ color: '#8a8a8a' }}>
                רוצה לקבל דוח מפורט עם כל המידע, המלצות ומדריך מעשי?
              </p>
          <button
            onClick={() => setShowEmailPopup(true)}
                className="w-full py-4 rounded-xl text-lg font-extrabold transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #ff9500 0%, #ffb347 100%)',
              color: '#0a0a0a',
                  boxShadow: '0 10px 30px rgba(255, 149, 0, 0.3)'
            }}
          >
                📄 קבל דו״ח מקצועי למייל
          </button>
              <p className="text-xs mt-3" style={{ color: '#5a5a5a' }}>
                הדו״ח כולל: ניתוח מעמיק • גרף תשואה • פלטפורמות • עלויות • מדריך התחלה
              </p>
        </div>

            {/* Match Reason if exists */}
            {investment.matchReason && (
              <div className="border rounded-lg p-4 text-right" style={{ 
                backgroundColor: 'rgba(255, 149, 0, 0.05)',
                borderColor: 'rgba(255, 149, 0, 0.2)'
              }}>
                <div className="text-xs font-bold mb-2" style={{ color: '#ff9500' }}>💡 למה זה מתאים לך?</div>
                <p className="text-sm" style={{ color: '#b0b0b0' }}>
                  {investment.matchReason}
                </p>
              </div>
            )}
              </div>
            </div>

        {/* Email Popup */}
        {showEmailPopup && !emailSent && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-2xl">
            <EmailReportPopup
              onSend={handleSendEmail}
              onClose={() => setShowEmailPopup(false)}
              isLoading={isSending}
            />
          </div>
        )}

        {/* Success Message */}
        {emailSent && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center rounded-2xl">
            <div className="text-center p-8 rounded-xl" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderWidth: '2px', borderColor: '#10b981' }}>
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold mb-2 text-success">נשלח בהצלחה!</h3>
              <p className="text-sm" style={{ color: '#8a8a8a' }}>הדו&quot;ח נשלח למייל שלך</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

