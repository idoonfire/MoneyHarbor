// My Harbor Page - Professional investment tracking dashboard

'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import InvestmentDetailsModal from '@/components/InvestmentDetailsModal';

interface SearchBatch {
  id: string;
  amount: number;
  timeHorizon: string;
  riskLevel: string;
  recommendations: any[];
  recommendationsCount: number;
  status: 'ביצעתי באחת' | 'השקעה משולבת' | 'לא ביצעתי';
  createdAt: string;
  reminderDate?: string;
}

export default function MyHarborPage() {
  const [batches, setBatches] = useState<SearchBatch[]>([]);
  const [totalInvestments, setTotalInvestments] = useState(0);
  const [totalQueries, setTotalQueries] = useState(0);
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null);
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null);
  const [selectedBatchAmount, setSelectedBatchAmount] = useState<number>(0);
  const [showReminderPopup, setShowReminderPopup] = useState(false);
  const [reminderEmail, setReminderEmail] = useState('');
  const [sendingReminder, setSendingReminder] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('moneyHarbor_batches');
    if (saved) {
      const parsedBatches = JSON.parse(saved);
      setBatches(parsedBatches);
      
      const totalInvested = parsedBatches.reduce((sum: number, batch: SearchBatch) => {
        if (batch.status === 'ביצעתי באחת') return sum + 1;
        if (batch.status === 'השקעה משולבת') return sum + (batch.recommendationsCount || 2);
        return sum;
      }, 0);
      
      setTotalInvestments(totalInvested);
      setTotalQueries(parsedBatches.length);
    }
  }, []);

  const updateStatus = (id: string, newStatus: SearchBatch['status'], count?: number) => {
    const updated = batches.map(b => 
      b.id === id ? { 
        ...b, 
        status: newStatus,
        recommendationsCount: count || (newStatus === 'ביצעתי באחת' ? 1 : newStatus === 'השקעה משולבת' ? 2 : 0)
      } : b
    );
    setBatches(updated);
    localStorage.setItem('moneyHarbor_batches', JSON.stringify(updated));
    
    const totalInvested = updated.reduce((sum, batch) => {
      if (batch.status === 'ביצעתי באחת') return sum + 1;
      if (batch.status === 'השקעה משולבת') return sum + (batch.recommendationsCount || 2);
      return sum;
    }, 0);
    setTotalInvestments(totalInvested);
  };

  const setupGlobalReminder = async () => {
    if (!reminderEmail || !reminderEmail.includes('@')) {
      alert('אנא הזן כתובת מייל תקינה');
      return;
    }

    setSendingReminder(true);
    
    try {
      // שלח בקשה לשרת לשמור תזכורת ולשלוח מייל
      const response = await fetch('/api/set-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: reminderEmail,
          reminderDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000) // 6 חודשים
        })
      });

      if (response.ok) {
        localStorage.setItem('globalReminder', new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString());
        alert('תזכורת נשמרה בהצלחה! נשלח לך מייל תזכורת בעוד 6 חודשים 🎉');
        setShowReminderPopup(false);
        setReminderEmail('');
      } else {
        alert('שגיאה בשמירת התזכורת. אנא נסה שוב.');
      }
    } catch (error) {
      console.error('Error setting reminder:', error);
      alert('שגיאה בשמירת התזכורת. אנא נסה שוב.');
    }
    
    setSendingReminder(false);
  };

  const getStatusMessage = () => {
    if (totalQueries === 0) return '';
    const percentage = Math.round((totalInvestments / totalQueries) * 100);
    
    if (percentage === 100) {
      return 'כל הכבוד – כל ההמלצות מצאו את מקומן לעגינה';
    } else if (percentage >= 75) {
      return 'התקדמות מצוינת – רוב ההמלצות בוצעו';
    } else if (percentage >= 50) {
      return 'מתקדמים יפה – חצי מהדרך';
    } else if (percentage > 0) {
      return 'התחלה טובה – יש עוד פוטנציאל';
    } else {
      return 'עדיין לא בוצעו השקעות מההמלצות';
    }
  };

  return (
    <main className="min-h-screen">
      <Navigation />
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#ff9500' }}>
            הנמל שלי
          </h1>
          <p className="text-base" style={{ color: '#8a8a8a' }}>
            עקוב אחרי ההשקעות שלך וראה את ההתקדמות
          </p>
        </div>

        {/* Status Card - Professional */}
        <div className="glass-light border rounded-xl p-6 mb-6" style={{
          borderColor: 'rgba(255, 149, 0, 0.2)'
        }}>
          <div className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: '#8a8a8a' }}>
            מצב העגינה של הכסף שלך
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-lg font-semibold mb-1" style={{ color: '#e5e4e2' }}>
                {totalInvestments} מתוך {totalQueries} המלצות סומנו כהושקעו בפועל
              </p>
              <p className="text-sm" style={{ color: totalInvestments === totalQueries && totalQueries > 0 ? '#10b981' : '#8a8a8a' }}>
                {getStatusMessage()}
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-4xl font-extrabold tabular-nums mb-1" style={{ color: '#ff9500' }}>
                {totalQueries > 0 ? Math.round((totalInvestments / totalQueries) * 100) : 0}%
              </div>
              <p className="text-xs" style={{ color: '#8a8a8a' }}>שיעור ביצוע</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-finance-darkgrey rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-500 rounded-full"
              style={{ 
                width: `${totalQueries > 0 ? (totalInvestments / totalQueries) * 100 : 0}%`,
                background: 'linear-gradient(90deg, #ffb347, #ff9500)'
              }}
            ></div>
          </div>
        </div>

        {/* Batches History */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#e5e4e2' }}>
            היסטוריית החיפושים
          </h2>

          {batches.length === 0 ? (
            <div className="glass-light border rounded-xl p-12 text-center" style={{
              borderColor: 'rgba(138, 138, 138, 0.2)'
            }}>
              <p className="text-lg mb-2" style={{ color: '#8a8a8a' }}>
                הנמל שלך עדיין ריק
              </p>
              <p className="text-sm mb-6" style={{ color: '#5a5a5a' }}>
                קבל המלצות השקעה כדי להתחיל לעקוב אחרי ההתקדמות שלך
              </p>
              <a 
                href="/"
                className="inline-block px-6 py-3 rounded-lg font-bold transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #ff9500 0%, #ffb347 100%)',
                  color: '#0a0a0a'
                }}
              >
                קבל המלצות עכשיו
              </a>
            </div>
          ) : (
            <div className="space-y-5">
              {batches.map((batch) => (
                <div 
                  key={batch.id}
                  className="glass-light border rounded-xl overflow-hidden"
                  style={{
                    borderColor: expandedBatch === batch.id ? 'rgba(255, 149, 0, 0.4)' : 'rgba(255, 149, 0, 0.2)'
                  }}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold mb-1" style={{ color: '#ff9500' }}>
                          חיפוש מ-{new Date(batch.createdAt).toLocaleDateString('he-IL')}
                        </p>
                        <p className="text-xs" style={{ color: '#8a8a8a' }}>
                          ₪{batch.amount.toLocaleString()} • {batch.timeHorizon} • {batch.riskLevel}
                        </p>
                      </div>
                      
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                        style={{
                          backgroundColor: batch.status === 'ביצעתי באחת' ? 'rgba(16, 185, 129, 0.2)' : 
                                         batch.status === 'השקעה משולבת' ? 'rgba(139, 92, 246, 0.2)' : 
                                         'rgba(138, 138, 138, 0.2)',
                          color: batch.status === 'ביצעתי באחת' ? '#10b981' : 
                                batch.status === 'השקעה משולבת' ? '#8b5cf6' : 
                                '#8a8a8a'
                        }}
                      >
                        {batch.status}
                      </span>
                    </div>

                    <button
                      onClick={() => setExpandedBatch(expandedBatch === batch.id ? null : batch.id)}
                      className="w-full py-2 rounded-lg text-sm font-semibold border transition-all mb-3"
                      style={{
                        backgroundColor: 'rgba(255, 149, 0, 0.05)',
                        borderColor: 'rgba(255, 149, 0, 0.3)',
                        color: '#ff9500'
                      }}
                    >
                      {expandedBatch === batch.id ? '▼ הסתר פרטים' : '▶ הצג את 3 ההמלצות'}
                    </button>

                    {expandedBatch === batch.id && (
                      <div className="space-y-3 mb-4 pt-3" style={{
                        borderTop: '1px solid rgba(138, 138, 138, 0.15)'
                      }}>
                        {batch.recommendations.map((rec, idx) => (
                          <div 
                            key={idx}
                            className="border rounded-lg p-4 hover:border-finance-gold/40 transition-all cursor-pointer"
                            style={{ 
                              backgroundColor: 'rgba(255, 149, 0, 0.03)',
                              borderColor: 'rgba(255, 149, 0, 0.2)'
                            }}
                            onClick={() => {
                              setSelectedInvestment({ 
                                ...rec, 
                                timeHorizon: Array.isArray(rec.timeHorizon) ? rec.timeHorizon : [batch.timeHorizon],
                                liquidity: rec.liquidity || 'בינונית'
                              });
                              setSelectedBatchAmount(batch.amount);
                            }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <p className="text-base font-semibold" style={{ color: '#ff9500' }}>
                                {idx + 1}. {rec.name}
                              </p>
                              <span className="px-2 py-0.5 rounded-full text-xs" style={{
                                backgroundColor: 'rgba(255, 149, 0, 0.2)',
                                color: '#ff9500'
                              }}>
                                {rec.riskLevel}
                              </span>
                            </div>
                            <p className="text-sm mb-3" style={{ color: '#b0b0b0' }}>
                              {rec.description}
                            </p>
                            {rec.matchReason && (
                              <p className="text-xs p-2 rounded" style={{ 
                                color: '#8a8a8a',
                                backgroundColor: 'rgba(255, 149, 0, 0.05)'
                              }}>
                                {rec.matchReason}
                              </p>
                            )}
                            <p className="text-xs mt-2" style={{ color: '#ff9500' }}>
                              לחץ לפרטים מלאים וקבלת PDF
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Status Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(batch.id, 'ביצעתי באחת', 1);
                        }}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                          batch.status === 'ביצעתי באחת' ? 'scale-[1.02]' : 'hover:scale-[1.02]'
                        }`}
                        style={{
                          backgroundColor: batch.status === 'ביצעתי באחת' ? '#10b981' : 'rgba(16, 185, 129, 0.1)',
                          color: batch.status === 'ביצעתי באחת' ? '#fff' : '#10b981',
                          border: batch.status === 'ביצעתי באחת' ? 'none' : '1px solid rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        ביצעתי באחת
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(batch.id, 'השקעה משולבת', 2);
                        }}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                          batch.status === 'השקעה משולבת' ? 'scale-[1.02]' : 'hover:scale-[1.02]'
                        }`}
                        style={{
                          backgroundColor: batch.status === 'השקעה משולבת' ? '#8b5cf6' : 'rgba(139, 92, 246, 0.1)',
                          color: batch.status === 'השקעה משולבת' ? '#fff' : '#8b5cf6',
                          border: batch.status === 'השקעה משולבת' ? 'none' : '1px solid rgba(139, 92, 246, 0.3)'
                        }}
                      >
                        השקעה משולבת
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(batch.id, 'לא ביצעתי', 0);
                        }}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                          batch.status === 'לא ביצעתי' ? 'scale-[1.02]' : 'hover:scale-[1.02]'
                        }`}
                        style={{
                          backgroundColor: batch.status === 'לא ביצעתי' ? '#6c757d' : 'rgba(138, 138, 138, 0.1)',
                          color: batch.status === 'לא ביצעתי' ? '#fff' : '#8a8a8a',
                          border: batch.status === 'לא ביצעתי' ? 'none' : '1px solid rgba(138, 138, 138, 0.3)'
                        }}
                      >
                        לא ביצעתי
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reminder Card - Compact, Below History */}
        <div className="glass-light border rounded-xl p-4 mb-8" style={{
          borderColor: 'rgba(255, 149, 0, 0.3)',
          background: 'linear-gradient(135deg, rgba(255, 149, 0, 0.05) 0%, rgba(212, 175, 55, 0.02) 100%)'
        }}>
          <h3 className="text-sm font-bold mb-2" style={{ color: '#ff9500' }}>
            בדיקת עגינה חוזרת
          </h3>
          <p className="text-xs mb-3" style={{ color: '#b0b0b0' }}>
            רוצה שנזכיר לך לבדוק שוב את הנמל בעוד 6 חודשים?
          </p>
          <button
            onClick={() => setShowReminderPopup(true)}
            className="w-full py-3 rounded-lg text-sm font-bold transition-all hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, #ff9500 0%, #ffb347 100%)',
              color: '#0a0a0a',
              boxShadow: '0 4px 20px rgba(255, 149, 0, 0.2)'
            }}
          >
            כן, שלחו לי תזכורת 🔔
          </button>
        </div>

        {/* Back Button - Branded */}
        <div className="text-center">
          <a 
            href="/"
            className="inline-block px-8 py-3 rounded-lg text-base font-semibold border transition-all hover:scale-105"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'rgba(255, 149, 0, 0.4)',
              color: '#ff9500'
            }}
          >
            ← חזרה למצוא נמל חדש לכסף
          </a>
        </div>
      </div>

      {/* Investment Details Modal */}
      {selectedInvestment && (
        <InvestmentDetailsModal
          investment={selectedInvestment}
          userAmount={selectedBatchAmount}
          onClose={() => setSelectedInvestment(null)}
        />
      )}

      {/* Reminder Email Popup */}
      {showReminderPopup && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowReminderPopup(false)}
        >
          <div 
            className="border rounded-xl p-6 max-w-md w-full mx-4"
            style={{
              backgroundColor: '#1a1a1a',
              borderColor: 'rgba(255, 149, 0, 0.5)',
              borderWidth: '2px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4" style={{ color: '#ff9500' }}>
              📧 תזכורת למייל
            </h3>
            
            <p className="text-sm mb-4" style={{ color: '#b0b0b0' }}>
              נשלח לך מייל תזכורת לבדוק מחדש את הנמל שלך בעוד 6 חודשים
            </p>
            
            <div className="mb-4">
              <label className="block text-sm mb-2 font-medium" style={{ color: '#b0b0b0' }}>
                כתובת מייל
              </label>
              <input
                type="email"
                value={reminderEmail}
                onChange={(e) => setReminderEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-lg text-base border-2 transition-all focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: '#0a0a0a',
                  borderColor: 'rgba(255, 149, 0, 0.3)',
                  color: '#e5e4e2'
                }}
                disabled={sendingReminder}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReminderPopup(false)}
                disabled={sendingReminder}
                className="flex-1 py-3 rounded-lg font-semibold border transition-all hover:opacity-70"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: 'rgba(138, 138, 138, 0.4)',
                  color: '#8a8a8a'
                }}
              >
                ביטול
              </button>
              <button
                onClick={setupGlobalReminder}
                disabled={sendingReminder || !reminderEmail}
                className="flex-1 py-3 rounded-lg font-semibold transition-all"
                style={{
                  background: sendingReminder ? '#555' : 'linear-gradient(135deg, #ff9500 0%, #ffb347 100%)',
                  color: '#0a0a0a',
                  opacity: sendingReminder || !reminderEmail ? 0.5 : 1,
                  cursor: sendingReminder || !reminderEmail ? 'not-allowed' : 'pointer'
                }}
              >
                {sendingReminder ? 'שולח...' : 'שלח תזכורת 🔔'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
