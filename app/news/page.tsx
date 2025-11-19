'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';

interface NewsItem {
  title: string;
  summary: string;
  impact: 'positive' | 'negative' | 'neutral';
  category: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [generatedAt, setGeneratedAt] = useState<string>('');
  const [isDemo, setIsDemo] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setIsLoading(true);
    setLoadingStep(0);
    
    // Animate loading steps
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => Math.min(prev + 1, 4));
    }, 600);
    
    try {
      const response = await fetch('/api/news');
      const data = await response.json();
      setNews(data.briefing || []);
      setGeneratedAt(data.generatedAt || '');
      setIsDemo(data.isDemo || false);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
    
    clearInterval(stepInterval);
    setIsLoading(false);
    setLoadingStep(0);
  };

  const getImpactStyle = (impact: string) => {
    switch (impact) {
      case 'positive':
        return { color: '#10b981', label: 'חיובי', symbol: '↗' };
      case 'negative':
        return { color: '#ef4444', label: 'שלילי', symbol: '↘' };
      default:
        return { color: '#8a8a8a', label: 'ניטרלי', symbol: '→' };
    }
  };

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Header - Minimal */}
      <div className="bg-gradient-to-br from-finance-black to-finance-charcoal text-white py-12 px-4 border-b" style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="inline-block px-4 py-1.5 rounded-full mb-3 text-xs font-semibold uppercase tracking-wider" style={{
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                color: '#ffd700',
                border: '1px solid rgba(255, 215, 0, 0.3)'
              }}>
                עדכונים
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-2 leading-tight" style={{ color: '#ffd700' }}>
                חדשות השקעות
              </h1>
              
              <p className="text-base leading-relaxed" style={{ color: '#8a8a8a' }}>
                סיכום יומי של מה שקורה בשוק
              </p>
            </div>

            <button
              onClick={fetchNews}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg text-sm font-medium border transition-all hover:scale-105 disabled:opacity-50"
              style={{
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                borderColor: 'rgba(255, 215, 0, 0.3)',
                color: '#ffd700'
              }}
            >
              {isLoading ? 'טוען...' : 'רענן'}
            </button>
          </div>

          {generatedAt && (
            <p className="text-xs" style={{ color: '#5a5a5a' }}>
              עדכון אחרון: {generatedAt} 
              {isDemo && ' (תוכן לדוגמה)'}
            </p>
          )}
        </div>
      </div>

      {/* News Feed */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="max-w-md mx-auto text-center py-16">
            {/* Animated spinner with glow */}
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 border-3 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#ffd700', borderWidth: '3px' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full animate-pulse" style={{ 
                  background: 'radial-gradient(circle, #ffd700 0%, transparent 70%)',
                  opacity: 0.4
                }}></div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-5">
              <div className="h-1 bg-finance-darkgrey rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-500 rounded-full"
                  style={{ 
                    width: `${(loadingStep / 4) * 100}%`,
                    background: 'linear-gradient(90deg, #d4af37, #ffd700)'
                  }}
                ></div>
              </div>
            </div>

            {/* Dynamic status messages */}
            <div className="space-y-2">
              <p className="text-lg font-semibold" style={{ color: '#e5e4e2' }}>
                {loadingStep === 0 && 'מתחבר למערכת החדשות...'}
                {loadingStep === 1 && 'סורק את השוק הפיננסי...'}
                {loadingStep === 2 && 'מנתח מגמות ואירועים...'}
                {loadingStep === 3 && 'מכין סיכום מותאם...'}
                {loadingStep === 4 && 'כמעט מוכן...'}
              </p>
              <p className="text-sm" style={{ color: '#8a8a8a' }}>
                יוצר עבורך סיכום אישי של החדשות החמות
              </p>
            </div>

            {/* Loading items preview */}
            <div className="mt-8 space-y-3">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="h-20 rounded-lg animate-pulse"
                  style={{ 
                    backgroundColor: 'rgba(42, 42, 42, 0.3)',
                    animationDelay: `${i * 0.2}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-base" style={{ color: '#8a8a8a' }}>
              לא נמצאו עדכונים כרגע
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {news.map((item, index) => {
              const impactStyle = getImpactStyle(item.impact);
              
              return (
                <div
                  key={index}
                  className="glass-light border rounded-lg p-5 transition-all hover:border-finance-gold/30"
                  style={{ borderColor: 'rgba(138, 138, 138, 0.2)' }}
                >
                  <div className="flex items-start gap-4">
                    {/* Number badge */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{
                      backgroundColor: 'rgba(255, 215, 0, 0.1)',
                      color: '#ffd700',
                      border: '1px solid rgba(255, 215, 0, 0.3)'
                    }}>
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      {/* Title */}
                      <h3 className="text-lg font-bold leading-tight mb-2" style={{ color: '#e5e4e2' }}>
                        {item.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-sm leading-relaxed mb-3" style={{ color: '#b0b0b0' }}>
                        {item.summary}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="px-2.5 py-1 rounded-full font-medium" style={{
                          backgroundColor: 'rgba(255, 215, 0, 0.1)',
                          color: '#ffd700',
                          border: '1px solid rgba(255, 215, 0, 0.2)'
                        }}>
                          {item.category}
                        </span>
                        <span className="px-2.5 py-1 rounded-full font-medium flex items-center gap-1" style={{
                          backgroundColor: `${impactStyle.color}15`,
                          color: impactStyle.color,
                          border: `1px solid ${impactStyle.color}30`
                        }}>
                          <span>{impactStyle.symbol}</span>
                          <span>{impactStyle.label}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* External Sources */}
        <div className="mt-10 pt-6 border-t" style={{ borderColor: 'rgba(138, 138, 138, 0.15)' }}>
          <p className="text-sm mb-3 font-semibold" style={{ color: '#b0b0b0' }}>
            קרא עוד מהמקורות:
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="https://www.globes.co.il"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg text-sm font-medium border transition-all hover:scale-105"
              style={{
                backgroundColor: 'rgba(0, 102, 204, 0.1)',
                borderColor: 'rgba(0, 102, 204, 0.3)',
                color: '#0066cc'
              }}
            >
              גלובס
            </a>
            <a
              href="https://www.calcalist.co.il"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg text-sm font-medium border transition-all hover:scale-105"
              style={{
                backgroundColor: 'rgba(255, 102, 0, 0.1)',
                borderColor: 'rgba(255, 102, 0, 0.3)',
                color: '#ff6600'
              }}
            >
              כלכליסט
            </a>
            <a
              href="https://www.themarker.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg text-sm font-medium border transition-all hover:scale-105"
              style={{
                backgroundColor: 'rgba(0, 170, 0, 0.1)',
                borderColor: 'rgba(0, 170, 0, 0.3)',
                color: '#00aa00'
              }}
            >
              TheMarker
            </a>
          </div>
        </div>

        {/* Update info */}
        <div className="mt-8 p-4 rounded-lg text-center" style={{ 
          backgroundColor: 'rgba(255, 215, 0, 0.05)',
          border: '1px solid rgba(255, 215, 0, 0.2)'
        }}>
          <p className="text-xs" style={{ color: '#8a8a8a' }}>
            הסיכום מתעדכן אוטומטית כל 4 שעות • מופעל על ידי AI
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8">
        <p className="text-sm" style={{ color: '#8a8a8a' }}>
          © 2025 MoneyHarbor
        </p>
      </div>
    </main>
  );
}
