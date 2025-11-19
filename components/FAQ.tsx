// Minimal FAQ component - Professional and clean

'use client';

import { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

function FAQItem({ question, answer, isOpen, onClick }: FAQItemProps) {
  return (
    <div className={`border rounded-lg mb-3 overflow-hidden transition-all ${
      isOpen ? 'shadow-md' : 'shadow-sm'
    }`} style={{
      borderColor: isOpen ? '#ffd700' : 'rgba(138, 138, 138, 0.2)',
      backgroundColor: 'rgba(26, 26, 26, 0.5)'
    }}>
      <button
        onClick={onClick}
        className="w-full text-right p-4 hover:bg-finance-darkgrey/30 transition-colors flex justify-between items-center gap-4"
      >
        <span className="font-semibold text-base" style={{ color: '#e5e4e2' }}>
          {question}
        </span>
        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all text-xs font-bold ${
          isOpen ? 'rotate-180' : ''
        }`} style={{
          backgroundColor: isOpen ? '#ffd700' : 'rgba(138, 138, 138, 0.2)',
          color: isOpen ? '#0a0a0a' : '#8a8a8a'
        }}>
          ↓
        </div>
      </button>
      {isOpen && (
        <div className="p-4 pt-0 border-t" style={{ borderColor: 'rgba(138, 138, 138, 0.1)' }}>
          <p className="text-sm leading-relaxed" style={{ color: '#b0b0b0' }}>
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems = [
    {
      question: 'מה זה השקעה פסיבית?',
      answer: 'השקעה פסיבית היא אסטרטגיה להשקעה ארוכת טווח שבה משקיעים בקרנות מחקות מדדים או נכסים דומים ומחזיקים בהם לאורך זמן, במקום לנסות לתזמן את השוק או למסחר באופן תכוף.',
    },
    {
      question: 'למה רמת הסיכון חשובה?',
      answer: 'רמת הסיכון משקפת את יכולתך והנכונות שלך לספוג תנודות בערך ההשקעה. התאמת רמת הסיכון למצבך האישי היא קריטית להצלחה ולשמירה על שקט נפשי.',
    },
    {
      question: 'כמה זמן לוקח לפתוח חשבון השקעות?',
      answer: 'בדרך כלל 2-5 ימי עסקים ברוב הבנקים ובתי ההשקעות בישראל. תהליך הפתיחה כולל מילוי טפסים, אימות זהות, והעברת כסף לחשבון.',
    },
    {
      question: 'מהן העמלות הנפוצות?',
      answer: 'עמלות קנייה/מכירה נעות בין 0.15%-0.5% מהסכום. דמי ניהול שנתיים של קרנות: 0.05%-1%. מס רווח הון: 25% על הרווחים בעת מכירה.',
    },
    {
      question: 'האם אני צריך יועץ השקעות?',
      answer: 'מומלץ להתייעץ עם יועץ מוסמך, במיוחד אם מדובר בסכומים גדולים או במצב פיננסי מורכב. יועץ יכול לספק ייעוץ מותאם למצבך הספציפי.',
    },
    {
      question: 'מה ההבדל בין קרן מחקה לקרן נאמנות?',
      answer: 'קרן מחקה (ETF) עוקבת באופן פסיבי אחרי מדד ויש לה עמלות נמוכות. קרן נאמנות מנוהלת באופן אקטיבי, עם עמלות גבוהות יותר, ומנסה לנצח את השוק.',
    },
    {
      question: 'האם יש הגנה על ההשקעות שלי?',
      answer: 'פיקדונות בנקאיים מבוטחים עד 250,000 ש״ח. השקעות במניות ואג״ח אינן מבוטחות ועלולות לרדת בערך. חשוב לבחור פלטפורמות מוסדרות ומפוקחות.',
    },
    {
      question: 'כמה כסף צריך כדי להתחיל להשקיע?',
      answer: 'תלוי בסוג ההשקעה. פיקדונות - ללא מינימום. קרנות מחקות - מ-1,000 ש״ח. נדל״ן - מ-300,000 ש״ח. מומלץ להתחיל עם סכום שאתה מוכן להפסיד.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-3">
        {faqItems.map((item, index) => (
          <FAQItem
            key={index}
            question={item.question}
            answer={item.answer}
            isOpen={openIndex === index}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>

      {/* Bottom Note */}
      <div className="mt-8 p-4 rounded-lg text-center" style={{ 
        backgroundColor: 'rgba(255, 215, 0, 0.05)',
        border: '1px solid rgba(255, 215, 0, 0.2)'
      }}>
        <p className="text-sm leading-relaxed" style={{ color: '#b0b0b0' }}>
          יש שאלה נוספת? <a href="/disclaimer" className="underline font-semibold" style={{ color: '#ffd700' }}>קרא את הצהרת האחריות המלאה</a>
        </p>
      </div>
    </div>
  );
}
