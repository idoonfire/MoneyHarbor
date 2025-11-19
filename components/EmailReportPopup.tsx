// Email report popup component

'use client';

import { useState } from 'react';

interface EmailReportPopupProps {
  onSend: (email: string, fullName: string) => void;
  onClose: () => void;
  isLoading: boolean;
}

export default function EmailReportPopup({ onSend, onClose, isLoading }: EmailReportPopupProps) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || fullName.trim().length < 2) {
      alert('אנא הזן שם מלא');
      return;
    }
    if (email && email.includes('@')) {
      onSend(email, fullName.trim());
    } else {
      alert('אנא הזן כתובת מייל תקינה');
    }
  };

  return (
    <div 
      className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20"
      onClick={onClose}
    >
      <div 
        className="border rounded-xl p-6 max-w-md w-full mx-4"
        style={{
          backgroundColor: '#1a1a1a',
          borderColor: 'rgba(255, 215, 0, 0.5)',
          borderWidth: '2px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4" style={{ color: '#ffd700' }}>
          📧 שליחת דו&quot;ח למייל
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm mb-2 font-medium" style={{ color: '#b0b0b0' }}>
              שם מלא:
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="הזן את שמך המלא"
              className="w-full px-4 py-3 rounded-lg border text-base"
              style={{
                backgroundColor: 'rgba(42, 42, 42, 0.8)',
                borderColor: 'rgba(255, 215, 0, 0.3)',
                color: '#e5e4e2'
              }}
              required
              autoFocus
              minLength={2}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm mb-2 font-medium" style={{ color: '#b0b0b0' }}>
              כתובת מייל:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full px-4 py-3 rounded-lg border text-base"
              style={{
                backgroundColor: 'rgba(42, 42, 42, 0.8)',
                borderColor: 'rgba(255, 215, 0, 0.3)',
                color: '#e5e4e2'
              }}
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-lg text-sm font-semibold border transition-all"
              style={{
                backgroundColor: 'transparent',
                borderColor: 'rgba(138, 138, 138, 0.3)',
                color: '#8a8a8a'
              }}
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 rounded-lg text-base font-bold transition-all disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #ffd700 0%, #d4af37 100%)',
                color: '#0a0a0a'
              }}
            >
              {isLoading ? 'שולח...' : '📧 שלח דו״ח'}
            </button>
          </div>
        </form>

        <p className="text-xs mt-4 text-center" style={{ color: '#5a5a5a' }}>
          הדו&quot;ח יישלח תוך מספר שניות
        </p>
      </div>
    </div>
  );
}

