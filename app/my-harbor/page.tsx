// My Harbor Page - User's investment tracking dashboard
// Tracks search batches, investment status, and reminders

'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import InvestmentDetailsModal from '@/components/InvestmentDetailsModal';

interface SearchBatch {
  id: string;
  amount: number;
  timeHorizon: string;
  riskLevel: string;
  recommendations: any[]; // Full recommendation objects
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

  const setReminder = (id: string) => {
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
    
    const updated = batches.map(b => 
      b.id === id ? { ...b, reminderDate: sixMonthsLater.toISOString() } : b
    );
    setBatches(updated);
    localStorage.setItem('moneyHarbor_batches', JSON.stringify(updated));
    
    alert('תזכורת נקבעה ל-' + sixMonthsLater.toLocaleDateString('he-IL'));
  };

  const toggleExpand = (id: string) => {
    setExpandedBatch(expandedBatch === id ? null : id);
  };

  return (
    <main className="min-h-screen">
      <Navigation />
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#ffd700' }}>
            ⚓ הנמל שלי
          </h1>
          <p className="text-base" style={{ color: '#8a8a8a' }}>
            עקוב אחרי ההשקעות שלך וראה את ההתקדמות
          </p>
        </div>

        {/* Compact Score */}
        <div className="glass-light border rounded-xl p-4 mb-6 flex items-center justify-between" style={{
          borderColor: 'rgba(255, 215, 0, 0.2)'
        }}>
          <div className="flex items-center gap-6">
            <div className="text-center border-l pl-6" style={{ borderColor: 'rgba(138, 138, 138, 0.2)' }}>
              <div className="text-3xl font-extrabold mb-0.5 tabular-nums" style={{ color: '#ffd700' }}>
                {totalInvestments}
              </div>
              <p className="text-xs" style={{ color: '#8a8a8a' }}>השקעות</p>
            </div>
            
            <div className="flex-1">
              <p className="text-sm mb-1.5 font-semibold" style={{ color: '#e5e4e2' }}>
                ביצעת {totalInvestments} השקעות מתוך {totalQueries} שאילתות
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-finance-darkgrey rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500 rounded-full"
                    style={{ 
                      width: `${totalQueries > 0 ? (totalInvestments / totalQueries) * 100 : 0}%`,
                      background: 'linear-gradient(90deg, #d4af37, #ffd700)'
                    }}
                  ></div>
                </div>
                <span className="text-xs font-bold tabular-nums" style={{ color: '#10b981' }}>
                  {totalQueries > 0 ? Math.round((totalInvestments / totalQueries) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Batches */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#e5e4e2' }}>
            📊 היסטוריית החיפושים
          </h2>

          {batches.length === 0 ? (
            <div className="glass-light border rounded-xl p-12 text-center" style={{
              borderColor: 'rgba(138, 138, 138, 0.2)'
            }}>
              <div className="text-4xl mb-4">🏝️</div>
              <p className="text-lg mb-2" style={{ color: '#8a8a8a' }}>הנמל שלך עדיין ריק</p>
              <p className="text-sm mb-6" style={{ color: '#5a5a5a' }}>
                קבל המלצות השקעה כדי להתחיל לעקוב אחרי ההתקדמות שלך
              </p>
              <a 
                href="/"
                className="inline-block px-6 py-3 rounded-lg font-bold transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #ffd700 0%, #d4af37 100%)',
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
                    borderColor: expandedBatch === batch.id ? 'rgba(255, 215, 0, 0.4)' : 'rgba(255, 215, 0, 0.2)'
                  }}
                >
                  {/* Batch Header - Always Visible */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold mb-1" style={{ color: '#ffd700' }}>
                          📅 חיפוש מ-{new Date(batch.createdAt).toLocaleDateString('he-IL')}
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

                    {/* Expand/Collapse Button */}
                    <button
                      onClick={() => toggleExpand(batch.id)}
                      className="w-full py-2 rounded-lg text-sm font-semibold border transition-all mb-3"
                      style={{
                        backgroundColor: 'rgba(255, 215, 0, 0.05)',
                        borderColor: 'rgba(255, 215, 0, 0.3)',
                        color: '#ffd700'
                      }}
                    >
                      {expandedBatch === batch.id ? '▼ הסתר פרטים' : '▶ הצג את 3 ההמלצות'}
                    </button>

                    {/* Expanded Content - 3 Recommendations */}
                    {expandedBatch === batch.id && (
                      <div className="space-y-3 mb-4 pt-3" style={{
                        borderTop: '1px solid rgba(138, 138, 138, 0.15)'
                      }}>
                        {batch.recommendations.map((rec, idx) => (
                          <div 
                            key={idx}
                            className="border rounded-lg p-4 hover:border-finance-gold/40 transition-all cursor-pointer"
                            style={{ 
                              backgroundColor: 'rgba(255, 215, 0, 0.03)',
                              borderColor: 'rgba(255, 215, 0, 0.2)'
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
                              <p className="text-base font-semibold" style={{ color: '#ffd700' }}>
                                {idx + 1}. {rec.name}
                              </p>
                              <span className="px-2 py-0.5 rounded-full text-xs" style={{
                                backgroundColor: 'rgba(255, 215, 0, 0.2)',
                                color: '#ffd700'
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
                                backgroundColor: 'rgba(255, 215, 0, 0.05)'
                              }}>
                                💡 {rec.matchReason}
                              </p>
                            )}
                            <p className="text-xs mt-2" style={{ color: '#ffd700' }}>
                              👆 לחץ לפרטים מלאים וקבלת PDF
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Status Buttons */}
                    <div className="flex gap-2 mb-3">
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
                        ✓ ביצעתי באחת
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
                        ⚡ השקעה משולבת
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
                        ✗ לא ביצעתי
                      </button>
                    </div>

                    {/* Reminder */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setReminder(batch.id);
                      }}
                      className="w-full py-2 rounded-lg text-sm font-semibold border transition-all hover:scale-[1.01]"
                      style={{
                        backgroundColor: batch.reminderDate ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
                        borderColor: 'rgba(255, 215, 0, 0.3)',
                        color: batch.reminderDate ? '#ffd700' : '#8a8a8a'
                      }}
                    >
                      {batch.reminderDate ? 
                        `🔔 תזכורת: ${new Date(batch.reminderDate).toLocaleDateString('he-IL')}` :
                        '🔔 תזכר לי בעוד 6 חודשים'
                      }
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back */}
        <div className="text-center">
          <a 
            href="/"
            className="inline-block px-8 py-3 rounded-lg text-base font-semibold border transition-all hover:scale-105"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'rgba(255, 215, 0, 0.4)',
              color: '#ffd700'
            }}
          >
            ← חזור לעמוד הראשי
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
    </main>
  );
}
