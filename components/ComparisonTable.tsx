// Investment comparison table with mini performance graphs

'use client';

import { ScoredInvestment } from '@/lib/scoring';

interface ComparisonTableProps {
  investments: ScoredInvestment[];
  onClose: () => void;
}

export default function ComparisonTable({ investments, onClose }: ComparisonTableProps) {
  
  // Calculate expected return based on risk level
  const getExpectedReturn = (riskLevel: string) => {
    switch (riskLevel) {
      case 'נמוכה': return { percent: 3, label: '+3%' };
      case 'בינונית': return { percent: 7, label: '+7%' };
      case 'גבוהה': return { percent: 12, label: '+12%' };
      default: return { percent: 5, label: '+5%' };
    }
  };

  // Mini sparkline graph component
  const MiniGraph = ({ riskLevel }: { riskLevel: string }) => {
    const returns = getExpectedReturn(riskLevel);
    const points = [];
    let value = 100;
    
    // Generate 6 points
    for (let i = 0; i < 6; i++) {
      points.push(value);
      value *= (1 + returns.percent / 100);
    }
    
    // Normalize to 0-100 range for SVG
    const max = Math.max(...points);
    const min = Math.min(...points);
    const normalized = points.map(p => ((p - min) / (max - min)) * 100);
    
    // Create SVG path
    const width = 80;
    const height = 30;
    const path = normalized.map((y, i) => {
      const x = (i / (normalized.length - 1)) * width;
      const yPos = height - (y / 100) * height;
      return i === 0 ? `M ${x} ${yPos}` : `L ${x} ${yPos}`;
    }).join(' ');

    const color = getRiskColor(riskLevel);

    return (
      <div className="flex flex-col items-center gap-1">
        <svg width={width} height={height} className="mb-1">
          <defs>
            <linearGradient id={`gradient-${riskLevel}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          {/* Area under line */}
          <path
            d={`${path} L ${width} ${height} L 0 ${height} Z`}
            fill={`url(#gradient-${riskLevel})`}
          />
          {/* Line */}
          <path
            d={path}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span className="text-xs font-bold" style={{ color }}>
          {returns.label} בשנה
        </span>
      </div>
    );
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
        className="border rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-auto shadow-2xl"
        style={{ 
          backgroundColor: 'rgba(26, 26, 26, 0.98)',
          borderColor: 'rgba(255, 215, 0, 0.4)',
          borderWidth: '2px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 border-b p-6 flex items-center justify-between z-10" style={{ 
          backgroundColor: 'rgba(26, 26, 26, 0.98)',
          borderColor: 'rgba(255, 215, 0, 0.2)'
        }}>
          <h2 className="text-2xl font-bold" style={{ color: '#ffd700' }}>
            השוואה בין האפשרויות
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:rotate-90"
            style={{
              background: 'linear-gradient(135deg, #ffd700 0%, #d4af37 100%)',
              color: '#0a0a0a',
              fontSize: '18px',
              fontWeight: 'bold'
            }}
          >
            ✕
          </button>
        </div>

        {/* Comparison Table */}
        <div className="p-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'rgba(255, 215, 0, 0.2)' }}>
                <th className="text-right py-4 px-4 font-bold uppercase tracking-wider text-xs" style={{ color: '#ffd700' }}>אפיק השקעה</th>
                <th className="text-center py-4 px-4 font-bold uppercase tracking-wider text-xs" style={{ color: '#ffd700' }}>סיכון</th>
                <th className="text-center py-4 px-4 font-bold uppercase tracking-wider text-xs" style={{ color: '#ffd700' }}>טווח זמן</th>
                <th className="text-center py-4 px-4 font-bold uppercase tracking-wider text-xs" style={{ color: '#ffd700' }}>נזילות</th>
                <th className="text-center py-4 px-4 font-bold uppercase tracking-wider text-xs" style={{ color: '#ffd700' }}>תשואה צפויה</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((inv, index) => (
                <tr 
                  key={inv.id}
                  className="border-b transition-all hover:bg-finance-gold/5"
                  style={{ borderColor: 'rgba(138, 138, 138, 0.1)' }}
                >
                  {/* Investment Name Only */}
                  <td className="py-5 px-4">
                    <div className="font-bold text-base" style={{ color: '#ffd700' }}>
                      {inv.name}
                    </div>
                  </td>
                  
                  {/* Risk */}
                  <td className="text-center py-5 px-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      inv.riskLevel === 'נמוכה' ? 'text-success bg-success/20 border border-success/40' :
                      inv.riskLevel === 'בינונית' ? 'text-warning bg-warning/20 border border-warning/40' :
                      'text-danger bg-danger/20 border border-danger/40'
                    }`}>
                      {inv.riskLevel}
                    </span>
                  </td>
                  
                  {/* Time Horizon */}
                  <td className="text-center py-5 px-4 font-medium" style={{ color: '#b0b0b0' }}>
                    {inv.timeHorizon.join(', ')}
                  </td>
                  
                  {/* Liquidity */}
                  <td className="text-center py-5 px-4 font-medium" style={{ color: '#b0b0b0' }}>
                    {inv.liquidity}
                  </td>
                  
                  {/* Mini Graph with Return */}
                  <td className="text-center py-5 px-4">
                    <MiniGraph riskLevel={inv.riskLevel} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="p-6 pt-0 border-t" style={{ borderColor: 'rgba(255, 215, 0, 0.1)' }}>
          <p className="text-xs text-center" style={{ color: '#5a5a5a' }}>
            לחץ מחוץ לטבלה או על ✕ לסגירה
          </p>
        </div>
      </div>
    </div>
  );
}
