// Minimal investment card - Summary only

'use client';

import { ScoredInvestment } from '@/lib/scoring';

interface InvestmentCardProps {
  investment: ScoredInvestment & {
    actionSteps?: {
      howToStart?: string;
      platforms?: string[];
      costs?: string;
      timeline?: string;
      tips?: string[];
    };
  };
  onShowDetails: (investment: ScoredInvestment) => void;
}

export default function InvestmentCard({ investment, onShowDetails }: InvestmentCardProps) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'נמוכה':
        return { color: '#10b981', label: 'סיכון נמוך' };
      case 'בינונית':
        return { color: '#f59e0b', label: 'סיכון בינוני' };
      case 'גבוהה':
        return { color: '#ef4444', label: 'סיכון גבוה' };
      default:
        return { color: '#8a8a8a', label: 'סיכון' };
    }
  };

  const riskStyle = getRiskColor(investment.riskLevel);

  return (
    <div 
      className="glass-light border rounded-xl shadow-lg transition-all duration-200 overflow-hidden h-full flex flex-col hover:border-finance-gold/40 hover:scale-[1.02] cursor-pointer"
      style={{
        borderWidth: '1px',
        borderColor: 'rgba(138, 138, 138, 0.2)'
      }}
      onClick={() => onShowDetails(investment)}
    >
      {/* Header - Compact */}
      <div className="p-5 border-b" style={{ borderColor: 'rgba(138, 138, 138, 0.15)' }}>
        <h3 className="text-lg font-bold leading-tight mb-3" style={{ color: '#e5e4e2' }}>
          {investment.name}
        </h3>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full font-medium" style={{
            backgroundColor: `${riskStyle.color}20`,
            color: riskStyle.color,
            border: `1px solid ${riskStyle.color}40`
          }}>
            {investment.riskLevel}
          </span>
          <span className="px-2.5 py-1 rounded-full font-medium" style={{
            backgroundColor: 'rgba(255, 149, 0, 0.1)',
            color: '#ff9500',
            border: '1px solid rgba(255, 149, 0, 0.2)'
          }}>
            {investment.timeHorizon?.[0] || investment.timeHorizon || 'בינוני'}
          </span>
        </div>
      </div>

      {/* Content - Very brief */}
      <div className="p-5 flex-1 flex flex-col" style={{ backgroundColor: 'rgba(26, 26, 26, 0.3)' }}>
        <p className="text-sm leading-relaxed mb-4" style={{ color: '#b0b0b0' }}>
          {investment.description?.substring(0, 100) || 'אפיק השקעה'}...
        </p>

        {/* Quick highlights */}
        {investment.pros?.[0] && investment.cons?.[0] && (
          <div className="text-xs space-y-1.5 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-success">+</span>
              <span style={{ color: '#8a8a8a' }}>{investment.pros[0]}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-warning">−</span>
              <span style={{ color: '#8a8a8a' }}>{investment.cons[0]}</span>
            </div>
          </div>
        )}

        {/* CTA Button */}
        <div className="mt-auto pt-3 border-t" style={{ borderColor: 'rgba(138, 138, 138, 0.15)' }}>
          <div 
            className="w-full text-center py-2.5 rounded-lg text-sm font-bold transition-all"
            style={{
              background: 'linear-gradient(135deg, #ff9500 0%, #ffb347 100%)',
              color: '#0a0a0a'
            }}
          >
            📈 לחץ לפרטים מלאים
          </div>
        </div>
      </div>
    </div>
  );
}
