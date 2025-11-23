// Professional minimal filter form - Clean and human-designed feel
// Wizard-style multi-step form for reduced anxiety

'use client';

import { useState } from 'react';
import { UserPreferences } from '@/lib/scoring';
import { KnowledgeLevel } from '@/lib/investments';

interface FilterFormProps {
  onSubmit: (preferences: UserPreferences) => void;
  isLoading: boolean;
}

export default function FilterForm({ onSubmit, isLoading }: FilterFormProps) {
  // Wizard state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 3;
  
  // Form state
  const [amount, setAmount] = useState<number>(50000);
  const [isLargeInvestment, setIsLargeInvestment] = useState<boolean>(false);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [timeHorizon, setTimeHorizon] = useState<number>(2);
  const [riskScore, setRiskScore] = useState<number>(50);
  const [age, setAge] = useState<number>(35);
  const [hasChildren, setHasChildren] = useState<boolean>(false);
  const [numberOfChildren, setNumberOfChildren] = useState<string>('');
  const [knowledgeLevel, setKnowledgeLevel] = useState<string>('');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

  const timeHorizonLabels = ['שנה', 'שנתיים', '3 שנים', '4 שנים', '5 שנים', '6 שנים', '7+ שנים'];
  
  const getRiskCategory = (score: number): 'נמוכה' | 'בינונית' | 'גבוהה' => {
    if (score <= 33) return 'נמוכה';
    if (score <= 66) return 'בינונית';
    return 'גבוהה';
  };
  
  const getRiskColor = (score: number) => {
    if (score <= 33) return { bg: '#10b981', text: 'שמרני' };
    if (score <= 66) return { bg: '#f59e0b', text: 'מאוזן' };
    return { bg: '#ef4444', text: 'אגרסיבי' };
  };

  const handleNext = () => {
    // Validation for step 3
    if (currentStep === 2 && currentStep + 1 === 3) {
      // About to go to step 3 - no validation needed yet
      setCurrentStep(currentStep + 1);
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const canSubmit = () => {
    // Require knowledge level and some text in additional notes
    return knowledgeLevel.length > 0 && additionalNotes.length >= 15;
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate step 3 requirements
    if (!canSubmit()) {
      alert('אנא בחר רמת ידע וספר לנו על ההעדפות שלך (לפחות 15 תווים) כדי שהיועץ יוכל למצוא את ההשקעה המתאימה ביותר');
      return;
    }

    let finalAmount = amount;
    if (isLargeInvestment && customAmount) {
      finalAmount = parseFloat(customAmount.replace(/,/g, ''));
      if (isNaN(finalAmount) || finalAmount <= 0) {
        alert('אנא הזן סכום תקין');
        return;
      }
    }

    const preferences: UserPreferences = {
      amount: finalAmount,
      timeHorizon: timeHorizonLabels[timeHorizon],
      riskLevel: getRiskCategory(riskScore) as any,
      liquidity: 'בינונית',
      knowledgeLevel: knowledgeLevel as KnowledgeLevel,
      additionalNotes: additionalNotes,
    };

    onSubmit(preferences);
    
    // Scroll to results section after submit
    setTimeout(() => {
      const resultsSection = document.getElementById('results-section');
      if (resultsSection) {
        resultsSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 300);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      onKeyDown={(e) => {
        // Prevent form submission on Enter key
        if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'BUTTON') {
          e.preventDefault();
        }
      }}
      className="glass-light border rounded-xl shadow-2xl p-6 max-w-2xl mx-auto" 
      style={{ borderColor: 'rgba(212, 175, 55, 0.3)' }}
    >
      
      {/* Wizard Progress Indicator */}
      <div className="mb-6 pb-5 border-b" style={{ borderColor: 'rgba(138, 138, 138, 0.2)' }}>
        <div className="relative mb-4">
          {/* Progress Line */}
          <div className="absolute top-6 left-0 right-0 h-1 rounded-full" style={{ backgroundColor: 'rgba(42, 42, 42, 0.5)' }}></div>
          <div 
            className="absolute top-6 right-0 h-1 rounded-full transition-all duration-300"
            style={{ 
              backgroundColor: '#ff9500',
              width: `${((currentStep - 1) / 2) * 100}%`
            }}
          ></div>
          
          {/* Steps */}
          <div className="relative flex justify-between items-start">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center" style={{ width: '80px' }}>
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base transition-all ${
                    step === currentStep ? 'scale-110' : ''
                  }`}
                  style={{
                    backgroundColor: step <= currentStep ? '#ff9500' : 'rgba(42, 42, 42, 0.5)',
                    color: step <= currentStep ? '#0a0a0a' : '#5a5a5a',
                    border: step === currentStep ? '3px solid #ff9500' : 'none',
                    boxShadow: step === currentStep ? '0 0 20px rgba(255, 149, 0, 0.5)' : 'none'
                  }}
                >
                  {step}
                </div>
                <span className="text-xs mt-2 text-center" style={{ color: step <= currentStep ? '#ff9500' : '#5a5a5a' }}>
                  {step === 1 && 'סכום וזמן'}
                  {step === 2 && 'סיכון ופרופיל'}
                  {step === 3 && 'סיכום ומיקוד'}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm font-semibold mb-1" style={{ color: '#e5e4e2' }}>
            צעד {currentStep} מתוך {totalSteps}
          </p>
          <p className="text-xs" style={{ color: '#8a8a8a' }}>
            {currentStep === 1 && 'בואו נתחיל עם הבסיס - כמה וכמה זמן?'}
            {currentStep === 2 && 'עכשיו נדבר על הסיכון והמצב האישי שלך'}
            {currentStep === 3 && 'ספר למערכת שלנו - מה חשוב לך?'}
          </p>
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[420px] py-4">
        {/* Step 1: Amount + Time Horizon */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-fadeIn">
            {/* Amount - Clean & Minimal */}
            <div>
              <div className="flex items-baseline justify-between mb-4">
                <label className="text-base font-semibold uppercase tracking-wider" style={{ color: '#b0b0b0' }}>
                  סכום ההשקעה
                </label>
                {!isLargeInvestment && (
                  <div className="text-3xl font-bold tabular-nums" style={{ color: '#ff9500' }}>
                    {formatCurrency(amount)}
                  </div>
                )}
              </div>
              
              {!isLargeInvestment ? (
                <>
                  <div 
                    className="relative w-full rounded-full"
                    style={{ 
                      background: `linear-gradient(to left, #ff9500 0%, #ff9500 ${((amount - 1000) / (500000 - 1000)) * 100}%, #2a2a2a ${((amount - 1000) / (500000 - 1000)) * 100}%, #2a2a2a 100%)`,
                      height: '8px'
                    }}
                  >
                    <input
                      type="range"
                      min="1000"
                      max="500000"
                      step="1000"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="absolute top-0 w-full cursor-pointer"
                      style={{ 
                        direction: 'rtl',
                        height: '8px',
                        background: 'transparent',
                        WebkitAppearance: 'none',
                        appearance: 'none',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm" style={{ color: '#5a5a5a' }}>₪1K</span>
                    <span className="text-sm" style={{ color: '#5a5a5a' }}>₪500K</span>
                  </div>
                </>
              ) : (
                <input
                  type="text"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value.replace(/[^\d,]/g, ''))}
                  placeholder="הזן סכום"
                  className="w-full px-4 py-2.5 rounded-lg font-bold text-xl text-center border"
                  style={{
                    backgroundColor: 'rgba(26, 26, 26, 0.8)',
                    borderColor: 'rgba(212, 175, 55, 0.4)',
                    color: '#ff9500'
                  }}
                />
              )}
              
              <label className="flex items-center gap-2 mt-2 text-xs cursor-pointer" style={{ color: '#8a8a8a' }}>
                <input
                  type="checkbox"
                  checked={isLargeInvestment}
                  onChange={(e) => {
                    setIsLargeInvestment(e.target.checked);
                    if (!e.target.checked) setCustomAmount('');
                  }}
                  className="w-3.5 h-3.5 rounded accent-yellow-600"
                />
                מעל ₪500,000
              </label>
            </div>

            {/* Time Horizon - Minimal */}
            <div>
              <div className="flex items-baseline justify-between mb-4">
                <label className="text-base font-semibold uppercase tracking-wider" style={{ color: '#b0b0b0' }}>
                  טווח זמן להשקעה
                </label>
                <div className="text-2xl font-bold" style={{ color: '#ff9500' }}>
                  {timeHorizonLabels[timeHorizon]}
                </div>
              </div>
              <div 
                className="relative w-full rounded-full"
                style={{ 
                  background: `linear-gradient(to left, #ff9500 0%, #ff9500 ${(timeHorizon / 6) * 100}%, #2a2a2a ${(timeHorizon / 6) * 100}%, #2a2a2a 100%)`,
                  height: '8px'
                }}
              >
                <input
                  type="range"
                  min="0"
                  max="6"
                  step="1"
                  value={timeHorizon}
                  onChange={(e) => setTimeHorizon(Number(e.target.value))}
                  className="absolute top-0 w-full cursor-pointer"
                  style={{ 
                    direction: 'rtl',
                    height: '8px',
                    background: 'transparent',
                    WebkitAppearance: 'none',
                    appearance: 'none',
                    outline: 'none'
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm" style={{ color: '#5a5a5a' }}>
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7+</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Risk + Age */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-fadeIn">
            {/* Risk Score - Clean Design */}
            <div>
              <div className="flex items-baseline justify-between mb-4">
                <label className="text-base font-semibold uppercase tracking-wider" style={{ color: '#b0b0b0' }}>
                  רמת סיכון
                </label>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium" style={{ color: getRiskColor(riskScore).bg }}>
                    {getRiskColor(riskScore).text}
                  </span>
                  <div className="text-3xl font-bold tabular-nums" style={{ color: '#ff9500' }}>
                    {riskScore}
                  </div>
                </div>
              </div>
              <div 
                className="relative w-full rounded-full"
                style={{ 
                  background: `linear-gradient(to left, ${getRiskColor(riskScore).bg} 0%, ${getRiskColor(riskScore).bg} ${riskScore}%, #2a2a2a ${riskScore}%, #2a2a2a 100%)`,
                  height: '8px'
                }}
              >
                <input
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  value={riskScore}
                  onChange={(e) => setRiskScore(Number(e.target.value))}
                  className="absolute top-0 w-full cursor-pointer"
                  style={{ 
                    direction: 'rtl',
                    height: '8px',
                    background: 'transparent',
                    WebkitAppearance: 'none',
                    appearance: 'none',
                    outline: 'none'
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm" style={{ color: '#5a5a5a' }}>
                <span>שמרני</span>
                <span>מאוזן</span>
                <span>אגרסיבי</span>
              </div>
            </div>

            {/* Age */}
            <div>
              <div className="flex items-baseline justify-between mb-4">
                <label className="text-base font-semibold uppercase tracking-wider" style={{ color: '#b0b0b0' }}>
                  גיל
                </label>
                <div className="text-2xl font-bold tabular-nums" style={{ color: '#ff9500' }}>
                  {age}
                </div>
              </div>
              <div 
                className="relative w-full rounded-full"
                style={{ 
                  background: `linear-gradient(to left, #ff9500 0%, #ff9500 ${((age - 18) / (80 - 18)) * 100}%, #2a2a2a ${((age - 18) / (80 - 18)) * 100}%, #2a2a2a 100%)`,
                  height: '8px'
                }}
              >
                <input
                  type="range"
                  min="18"
                  max="80"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="absolute top-0 w-full cursor-pointer"
                  style={{ 
                    direction: 'rtl',
                    height: '8px',
                    background: 'transparent',
                    WebkitAppearance: 'none',
                    appearance: 'none',
                    outline: 'none'
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm" style={{ color: '#5a5a5a' }}>
                <span>18</span>
                <span>50</span>
                <span>80</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Knowledge Level + Additional Notes (Optional) */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-fadeIn">
            {/* Knowledge Level - Required */}
            <div>
              <label className="text-base font-semibold uppercase tracking-wider mb-3 block" style={{ color: '#b0b0b0' }}>
                רמת ידע <span className="text-sm normal-case" style={{ color: '#ff9500' }}>*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['מתחיל', 'בינוני', 'מתקדם'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setKnowledgeLevel(level)}
                    className="py-3 px-4 rounded-lg text-base font-medium transition-all"
                    style={{
                      backgroundColor: knowledgeLevel === level ? 'rgba(255, 149, 0, 0.15)' : 'transparent',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: knowledgeLevel === level ? '#ff9500' : 'rgba(138, 138, 138, 0.2)',
                      color: knowledgeLevel === level ? '#ff9500' : '#8a8a8a'
                    }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Agent Prompt - Required */}
            <div>
              <label className="text-base font-semibold uppercase tracking-wider mb-3 block" style={{ color: '#b0b0b0' }}>
                💬 ספר למערכת שלנו <span className="text-sm normal-case" style={{ color: '#ff9500' }}>*</span>
              </label>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder='ספר לנו - מה חשוב לך? יש העדפות מיוחדות?&#10;&#10;לדוגמה:&#10;• "אני מעוניין בהשקעה בתל אביב 125"&#10;• "רוצה להימנע מקריפטו"&#10;• "מחפש משהו עם נזילות גבוהה"&#10;• "חשוב לי דיבידנדים קבועים"'
                rows={6}
                maxLength={200}
                required
                className="w-full px-4 py-3 rounded-lg text-base border resize-none transition-all focus:outline-none focus:ring-2 focus:ring-yellow-500"
                style={{
                  backgroundColor: 'rgba(26, 26, 26, 0.5)',
                  borderColor: additionalNotes.length >= 15 ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255, 149, 0, 0.3)',
                  borderWidth: '2px',
                  color: '#e5e4e2'
                }}
              />
              <div className="flex justify-between mt-2">
                <p className="text-xs" style={{ color: additionalNotes.length >= 15 ? '#10b981' : '#ff9500' }}>
                  🤖 {additionalNotes.length >= 15 ? 'מעולה! המערכת מבינה בדיוק מה אתה צריך' : 'ספר עוד כמה מילים כדי שהמערכת תבין טוב יותר'}
                </p>
                <span className="text-xs" style={{ color: additionalNotes.length >= 15 ? '#10b981' : '#5a5a5a' }}>
                  {additionalNotes.length}/200
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="space-y-3 mt-8">
        <div className="flex gap-3">
          {/* Previous Button */}
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="px-6 py-3 rounded-lg text-base font-semibold transition-all border"
              style={{
                backgroundColor: 'transparent',
                borderColor: 'rgba(138, 138, 138, 0.3)',
                color: '#8a8a8a'
              }}
            >
              חזור →
            </button>
          )}

          {/* Next/Submit Button */}
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 py-3.5 rounded-lg text-base font-bold transition-all"
              style={{
                background: 'linear-gradient(135deg, #ff9500 0%, #ffb347 100%)',
                color: '#0a0a0a',
                letterSpacing: '0.02em'
              }}
            >
              הבא ←
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (!canSubmit()) {
                  alert('אנא בחר רמת ידע וספר לנו קצת על ההעדפות שלך (לפחות 15 תווים)');
                  return;
                }
                const form = e.currentTarget.form;
                if (form) {
                  const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                  form.dispatchEvent(submitEvent);
                }
              }}
              disabled={isLoading || !canSubmit()}
              className="flex-1 py-3.5 rounded-lg text-base font-bold transition-all disabled:opacity-50"
              style={{
                background: canSubmit() ? 'linear-gradient(135deg, #ff9500 0%, #ffb347 100%)' : 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
                color: '#0a0a0a',
                letterSpacing: '0.02em'
              }}
            >
              {isLoading ? 'המערכת עובדת...' : canSubmit() ? '🤖 מצא לי נמל' : '⚠️ השלם את הפרטים'}
            </button>
          )}
        </div>

      </div>
    </form>
  );
}
