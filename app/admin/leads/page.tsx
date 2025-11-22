// Admin Leads Page - View all PDF requests (leads)
// Protected route - for admin only

'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';

interface Lead {
  id: string;
  email: string;
  fullName: string | null;
  investmentName: string;
  amount: number;
  timeHorizon: string;
  riskLevel: string;
  knowledgeLevel: string | null;
  additionalNotes: string | null;
  createdAt: string;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/admin/leads');
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads || []);
      } else {
        setError('Failed to load leads');
      }
    } catch (err) {
      setError('Error loading leads');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#ffd700' }}>
            Admin - Leads
          </h1>
          <p className="text-base" style={{ color: '#8a8a8a' }}>
            כל המשתמשים שביקשו דוח PDF
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg" style={{ color: '#ffd700' }}>טוען...</div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-lg" style={{ color: '#ef4444' }}>{error}</div>
          </div>
        ) : (
          <div className="glass-light border rounded-xl overflow-hidden" style={{
            borderColor: 'rgba(255, 215, 0, 0.2)'
          }}>
            {/* Stats Summary */}
            <div className="p-6 border-b" style={{ borderColor: 'rgba(138, 138, 138, 0.15)' }}>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{ color: '#ffd700' }}>{leads.length}</div>
                  <div className="text-xs" style={{ color: '#8a8a8a' }}>סה"כ לידים</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{ color: '#10b981' }}>
                    ₪{Math.round(leads.reduce((sum, l) => sum + l.amount, 0) / 1000)}K
                  </div>
                  <div className="text-xs" style={{ color: '#8a8a8a' }}>סכום כולל</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{ color: '#8b5cf6' }}>
                    {leads.filter(l => l.knowledgeLevel === 'מתחיל').length}
                  </div>
                  <div className="text-xs" style={{ color: '#8a8a8a' }}>מתחילים</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{ color: '#f59e0b' }}>
                    {leads.filter(l => new Date(l.createdAt) > new Date(Date.now() - 7*24*60*60*1000)).length}
                  </div>
                  <div className="text-xs" style={{ color: '#8a8a8a' }}>השבוע</div>
                </div>
              </div>
            </div>

            {/* Leads Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b" style={{ borderColor: 'rgba(138, 138, 138, 0.15)' }}>
                  <tr>
                    <th className="px-4 py-3 text-right text-xs font-semibold" style={{ color: '#ffd700' }}>שם</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold" style={{ color: '#ffd700' }}>מייל</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold" style={{ color: '#ffd700' }}>השקעה</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold" style={{ color: '#ffd700' }}>סכום</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold" style={{ color: '#ffd700' }}>טווח</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold" style={{ color: '#ffd700' }}>סיכון</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold" style={{ color: '#ffd700' }}>תאריך</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, idx) => (
                    <tr key={lead.id} className="border-b" style={{ 
                      borderColor: 'rgba(138, 138, 138, 0.1)',
                      backgroundColor: idx % 2 === 0 ? 'rgba(255, 215, 0, 0.02)' : 'transparent'
                    }}>
                      <td className="px-4 py-3 text-sm" style={{ color: '#e5e4e2' }}>{lead.fullName || '-'}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: '#b0b0b0' }}>{lead.email}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: '#ffd700' }}>{lead.investmentName}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: '#10b981' }}>₪{lead.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: '#8a8a8a' }}>{lead.timeHorizon}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: '#8a8a8a' }}>{lead.riskLevel}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: '#5a5a5a' }}>
                        {new Date(lead.createdAt).toLocaleDateString('he-IL')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {leads.length === 0 && !loading && (
              <div className="p-12 text-center">
                <p style={{ color: '#8a8a8a' }}>אין לידים עדיין</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}


