'use client';

import Navigation from '@/components/Navigation';

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Header Section - Minimal */}
      <div className="bg-gradient-to-br from-finance-black to-finance-charcoal text-white py-12 px-4 border-b" style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 rounded-full mb-4 text-xs font-semibold uppercase tracking-wider" style={{
            backgroundColor: 'rgba(255, 215, 0, 0.1)',
            color: '#ffd700',
            border: '1px solid rgba(255, 215, 0, 0.3)'
          }}>
            מידע משפטי
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight" style={{ color: '#ffd700' }}>
            הצהרת אחריות
          </h1>
          
          <p className="text-base max-w-xl mx-auto leading-relaxed" style={{ color: '#8a8a8a' }}>
            תנאי שימוש והצהרות משפטיות
          </p>
        </div>
      </div>

      {/* Content Section - Compact */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-4">
          
          {/* Main sections - minimal */}
          <section className="glass-light border rounded-lg p-5" style={{ borderColor: 'rgba(138, 138, 138, 0.2)' }}>
            <h2 className="text-lg font-bold mb-2" style={{ color: '#ffd700' }}>
              הצהרה כללית
            </h2>
            <p className="text-sm leading-relaxed mb-2" style={{ color: '#b0b0b0' }}>
              האתר MoneyHarbor הינו אתר חינוכי ומידעי בלבד.
            </p>
            <p className="text-sm font-semibold" style={{ color: '#e5e4e2' }}>
              המידע באתר אינו מהווה ייעוץ השקעות אישי או המלצה לרכישה/מכירה.
            </p>
          </section>

          <section className="glass-light border rounded-lg p-5" style={{ borderColor: 'rgba(138, 138, 138, 0.2)' }}>
            <h2 className="text-lg font-bold mb-2" style={{ color: '#e5e4e2' }}>
              סיכונים
            </h2>
            <ul className="space-y-1.5 text-sm" style={{ color: '#b0b0b0' }}>
              <li>• כל השקעה כרוכה בסיכון הפסד</li>
              <li>• ביצועי עבר אינם מבטיחים ביצועים עתידיים</li>
              <li>• ערך ההשקעות עלול לרדת ולעלות</li>
            </ul>
          </section>

          <section className="glass-light border rounded-lg p-5" style={{ borderColor: 'rgba(138, 138, 138, 0.2)' }}>
            <h2 className="text-lg font-bold mb-2" style={{ color: '#e5e4e2' }}>
              ייעוץ מקצועי
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#b0b0b0' }}>
              מומלץ להתייעץ עם יועץ השקעות מוסמך לפני כל החלטת השקעה.
              ההמלצות באתר אינן מתחשבות במצבך הפיננסי המלא.
            </p>
          </section>

          <section className="glass-light border rounded-lg p-5" style={{ borderColor: 'rgba(138, 138, 138, 0.2)' }}>
            <h2 className="text-lg font-bold mb-2" style={{ color: '#e5e4e2' }}>
              שימוש ב-AI
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#b0b0b0' }}>
              האתר משתמש בבינה מלאכותית ליצירת המלצות. המערכת עלולה לטעות או להציג מידע לא מעודכן.
            </p>
          </section>

          <section className="glass-light border rounded-lg p-5" style={{ borderColor: 'rgba(138, 138, 138, 0.2)' }}>
            <h2 className="text-lg font-bold mb-2" style={{ color: '#e5e4e2' }}>
              הגבלת אחריות
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#b0b0b0' }}>
              מפעילי האתר אינם אחראים לנזקים הנובעים משימוש באתר. השימוש על אחריותך בלבד.
            </p>
          </section>

          {/* Warning box */}
          <div className="border-2 rounded-lg p-4 text-center" style={{ 
            borderColor: 'rgba(239, 68, 68, 0.3)',
            backgroundColor: 'rgba(239, 68, 68, 0.05)'
          }}>
            <p className="text-sm font-bold mb-1" style={{ color: '#ef4444' }}>
              אל תבצע החלטות על בסיס המידע באתר בלבד
            </p>
            <p className="text-xs" style={{ color: '#b0b0b0' }}>
              תמיד התייעץ עם יועץ מוסמך
            </p>
          </div>

          {/* Footer */}
          <div className="text-center pt-2">
            <p className="text-xs" style={{ color: '#5a5a5a' }}>
              עדכון אחרון: נובמבר 2025 | © 2025 MoneyHarbor
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
