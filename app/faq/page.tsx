'use client';

import FAQ from '@/components/FAQ';
import Navigation from '@/components/Navigation';

export default function FAQPage() {
  return (
    <main className="min-h-screen">
      {/* Navigation Bar */}
      <Navigation />

      {/* Header Section - Minimal */}
      <div className="bg-gradient-to-br from-finance-black to-finance-charcoal text-white py-12 px-4 border-b" style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 rounded-full mb-4 text-xs font-semibold uppercase tracking-wider" style={{
            backgroundColor: 'rgba(255, 149, 0, 0.1)',
            color: '#ff9500',
            border: '1px solid rgba(255, 149, 0, 0.3)'
          }}>
            מידע חשוב
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight" style={{ color: '#ff9500' }}>
            שאלות ותשובות
          </h1>
          
          <p className="text-base max-w-xl mx-auto leading-relaxed" style={{ color: '#8a8a8a' }}>
            תשובות לשאלות הנפוצות ביותר
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <FAQ />
      </div>

      {/* Simple Footer */}
      <div className="text-center py-8">
        <p className="text-sm" style={{ color: '#8a8a8a' }}>
          © 2025 MoneyHarbor
        </p>
      </div>
    </main>
  );
}

