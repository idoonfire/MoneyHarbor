'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import FilterForm from '@/components/FilterForm';
import InvestmentCard from '@/components/InvestmentCard';
import ComparisonTable from '@/components/ComparisonTable';
import InvestmentDetailsModal from '@/components/InvestmentDetailsModal';
import { investmentOptions } from '@/lib/investments';
import { getTopRecommendations, UserPreferences, ScoredInvestment } from '@/lib/scoring';

// Helper function to save search batches to localStorage for "My Harbor"
function saveSearchesToLocalStorage(recommendations: any[], preferences: UserPreferences) {
  try {
    const existing = localStorage.getItem('moneyHarbor_batches');
    const existingBatches = existing ? JSON.parse(existing) : [];
    
    // Save as a batch (group of 3 recommendations) with FULL data
    const newBatch = {
      id: `batch-${Date.now()}`,
      amount: preferences.amount,
      timeHorizon: preferences.timeHorizon,
      riskLevel: preferences.riskLevel,
      knowledgeLevel: preferences.knowledgeLevel,
      additionalNotes: preferences.additionalNotes,
      recommendationsCount: 0, // How many investments user made from this batch (0-3)
      recommendations: recommendations.slice(0, 3), // Save FULL recommendation data
      status: 'לא ביצעתי', // "ביצעתי באחת" | "השקעה משולבת" | "לא ביצעתי"
      createdAt: new Date().toISOString(),
    };
    
    const combined = [newBatch, ...existingBatches];
    localStorage.setItem('moneyHarbor_batches', JSON.stringify(combined));
    
    // Also save latest preferences for PDF requests
    localStorage.setItem('moneyHarbor_lastPreferences', JSON.stringify(preferences));
    
    console.log('✅ Search batch saved to My Harbor');
  } catch (error) {
    console.error('Error saving searches:', error);
  }
}

export default function Home() {
  const [recommendations, setRecommendations] = useState<ScoredInvestment[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<ScoredInvestment | null>(null);
  const [userAmount, setUserAmount] = useState<number>(0);

  // Reset search function
  const resetSearch = () => {
    setRecommendations(null);
    setHasSearched(false);
    setLoadingStep(0);
    setShowComparison(false);
    setSelectedInvestment(null);
    setIsLoading(false);
    
    // Scroll to form
    setTimeout(() => {
      const formElement = document.getElementById('investment-form');
      if (formElement) {
        formElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  const handleFormSubmit = async (preferences: UserPreferences) => {
    setIsLoading(true);
    setHasSearched(true);
    setLoadingStep(0);
    setUserAmount(preferences.amount); // Save user's investment amount
    
    // Simulate loading steps for better UX with faster updates
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => Math.min(prev + 1, 3));
    }, 600); // Faster progression for more interactive feel
    
    try {
      console.log('🚀 Calling AI API...', preferences);
      const startTime = Date.now();
      
      // Call AI API for recommendations
      const response = await fetch('/api/ai-recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      const data = await response.json();
      const duration = Date.now() - startTime;
      
      console.log(`⏱️ AI Response received in ${duration}ms`);
      console.log('📊 Response data:',  data);

      // Check if we should use fallback
      if (!response.ok || data.useFallback) {
        console.warn('⚠️ Using fallback algorithm:', data.error);
        // Fallback to rule-based algorithm
        const results = getTopRecommendations(investmentOptions, preferences);
        setRecommendations(results);
        
        // Save searches to localStorage for "My Harbor" feature
        saveSearchesToLocalStorage(results, preferences);
      } else {
        // Use AI recommendations
        console.log('✅ Using AI recommendations');
        console.log('💰 Cost:', `$${data.metadata?.cost?.toFixed(4) || '0.0009'}`);
        console.log('🔢 Tokens:', data.metadata?.tokensUsed || 'N/A');
        
        const aiRecommendations = data.recommendations.map((rec: any, index: number) => ({
          ...rec,
          id: `ai-${index}`,
          score: 100 - (index * 10), // Mock score for display
          suitableFor: ['מתחיל', 'בינוני', 'מתקדם'],
        }));
        setRecommendations(aiRecommendations);
        
        // Save searches to localStorage for "My Harbor" feature
        saveSearchesToLocalStorage(aiRecommendations, preferences);
      }
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
      // Fallback to rule-based algorithm on error
      const results = getTopRecommendations(investmentOptions, preferences);
      setRecommendations(results);
      
      // Save searches to localStorage for "My Harbor" feature
      saveSearchesToLocalStorage(results, preferences);
    }

    clearInterval(stepInterval);
    setIsLoading(false);
    setLoadingStep(0);

    // Scroll to results smoothly
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  return (
    <main className="min-h-screen">
      {/* Navigation Bar */}
      <Navigation onLogoClick={resetSearch} />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-finance-black via-finance-charcoal to-finance-black text-white py-20 md:py-32 px-4 overflow-hidden border-b-4 border-finance-gold">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #d4af37 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Accent Circles */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-finance-gold rounded-full filter blur-3xl opacity-10 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-finance-brightgold rounded-full filter blur-3xl opacity-10 translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Minimal Badge */}
          <div className="inline-block px-4 py-1.5 rounded-full mb-8 text-xs font-semibold uppercase tracking-wider" style={{
            backgroundColor: 'rgba(255, 215, 0, 0.1)',
            color: '#ffd700',
            border: '1px solid rgba(255, 215, 0, 0.3)'
          }}>
            פלטפורמה חינוכית
          </div>
          
          <div className="flex flex-col items-center gap-8 mb-8">
            {/* Anchor Logo - Interactive */}
            <div className="relative group cursor-pointer">
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full animate-pulse" style={{
                background: 'radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%)',
                filter: 'blur(20px)'
              }}></div>
              
              {/* Main logo */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 flex items-center justify-center rounded-full border-4 shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12" style={{
                background: 'linear-gradient(135deg, #ffd700 0%, #d4af37 100%)',
                borderColor: '#ffd700',
                boxShadow: '0 0 60px rgba(255, 215, 0, 0.4)'
              }}>
                <div className="w-[85%] h-[85%] bg-white rounded-full flex items-center justify-center">
                  {/* Beautiful Anchor SVG */}
                  <svg className="w-3/5 h-3/5 transition-transform duration-500 group-hover:scale-110" viewBox="0 0 100 100" fill="none">
                    {/* Anchor ring */}
                    <circle cx="50" cy="20" r="8" fill="#0a0a0a"/>
                    <circle cx="50" cy="20" r="5" fill="white"/>
                    
                    {/* Anchor shaft */}
                    <rect x="47.5" y="28" width="5" height="50" fill="#0a0a0a" rx="1"/>
                    
                    {/* Anchor arms - curved */}
                    <path d="M50 75 Q35 70, 25 80 L25 85 Q35 75, 50 78 Z" fill="#0a0a0a"/>
                    <path d="M50 75 Q65 70, 75 80 L75 85 Q65 75, 50 78 Z" fill="#0a0a0a"/>
                    
                    {/* Anchor crossbar */}
                    <rect x="25" y="43" width="50" height="5" fill="#0a0a0a" rx="2"/>
                    
                    {/* Decorative details */}
                    <circle cx="25" cy="45.5" r="3" fill="#ffd700"/>
                    <circle cx="75" cy="45.5" r="3" fill="#ffd700"/>
                  </svg>
                </div>
              </div>
              
              {/* Floating particles */}
              <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full animate-bounce" style={{ 
                background: '#ffd700',
                animationDelay: '0s',
                animationDuration: '2s'
              }}></div>
              <div className="absolute -bottom-2 -left-2 w-2 h-2 rounded-full animate-bounce" style={{ 
                background: '#d4af37',
                animationDelay: '0.5s',
                animationDuration: '2.5s'
              }}></div>
            </div>
            
            {/* Title */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight drop-shadow-2xl text-center" style={{ color: '#ffd700' }}>
              MoneyHarbor
            </h1>
          </div>
          
          <p className="text-2xl md:text-3xl mb-6 font-semibold leading-relaxed" style={{ color: '#b0b0b0' }}>
            גלו איפה הכי כדאי לעגון את הכסף שלכם
          </p>
          
          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#8a8a8a' }}>
            ענו על כמה שאלות, וקבלו אפשרויות השקעה מותאמות אישית - 
            עם פירוט מעשי, פלטפורמות ועלויות
          </p>
          
          {/* CTA Button */}
          <div className="mt-12">
            <button
              onClick={() => {
                // Reset search if user already searched
                if (hasSearched || recommendations) {
                  resetSearch();
                } else {
                  // Normal scroll behavior for first time
                  setTimeout(() => {
                    const formElement = document.getElementById('investment-form');
                    if (formElement) {
                      formElement.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                      });
                      // Small delay then focus on first input
                      setTimeout(() => {
                        const firstInput = formElement.querySelector('input, select, textarea') as HTMLElement;
                        firstInput?.focus();
                      }, 800);
                    }
                  }, 100);
                }
              }}
              className="px-10 py-5 rounded-xl text-xl font-extrabold transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 inline-flex items-center gap-3"
              style={{
                background: 'linear-gradient(135deg, #ffd700 0%, #d4af37 100%)',
                color: '#0a0a0a',
                boxShadow: '0 10px 40px rgba(255, 215, 0, 0.3)'
              }}
            >
              <span>מתחילים – בואו נמצא נמל לכסף שלכם</span>
              <span className="text-2xl">↓</span>
            </button>
          </div>

          {/* Trust Indicators - Minimal */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm" style={{ color: '#8a8a8a' }}>
            <span>חינם לחלוטין</span>
            <span style={{ color: '#5a5a5a' }}>•</span>
            <span>מידע אובייקטיבי</span>
            <span style={{ color: '#5a5a5a' }}>•</span>
            <span>מופעל ב-AI</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Filter Form Section */}
        <div id="investment-form" className="mb-12 scroll-mt-20">
          <FilterForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        </div>

        {/* Loading - Interactive with Skeleton Cards */}
        {isLoading && (
          <div id="results-section" className="mb-12">
            {/* Status Header */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-4">
                <div className="w-16 h-16 border-3 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#ffd700', borderWidth: '3px' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full animate-pulse" style={{ 
                    background: 'radial-gradient(circle, #ffd700 0%, transparent 70%)',
                    opacity: 0.4
                  }}></div>
                </div>
              </div>

              {/* Progress Percentage with smooth animation */}
              <div className="text-6xl font-extrabold mb-6 tabular-nums transition-all duration-500" style={{ 
                color: '#ffd700',
                textShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
                transform: `scale(${1 + (loadingStep * 0.02)})`
              }}>
                {Math.round((loadingStep / 4) * 100)}%
              </div>

              {/* Progress Bar */}
              <div className="max-w-md mx-auto mb-6">
                <div className="h-2 bg-finance-darkgrey rounded-full overflow-hidden relative">
                  <div 
                    className="h-full transition-all duration-500 rounded-full relative overflow-hidden"
                    style={{ 
                      width: `${(loadingStep / 4) * 100}%`,
                      background: 'linear-gradient(90deg, #d4af37, #ffd700)',
                      boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)'
                    }}
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 animate-pulse" style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                      animation: 'shimmer 1.5s infinite'
                    }}></div>
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs" style={{ color: '#5a5a5a' }}>
                  <span>מתחיל...</span>
                  <span>כמעט מוכן!</span>
                </div>
              </div>

              {/* Status Messages with Icons and animations */}
              <div className="mb-2 min-h-[40px] flex items-center justify-center">
                <p className="text-xl font-semibold mb-1 flex items-center justify-center gap-3 animate-fadeIn" style={{ color: '#e5e4e2' }}>
                  {loadingStep === 0 && <><span className="text-2xl animate-bounce">🔍</span> <span>מנתח את הפרופיל שלך...</span></>}
                  {loadingStep === 1 && <><span className="text-2xl animate-bounce">💼</span> <span>בוחן אפשרויות השקעה בשוק...</span></>}
                  {loadingStep === 2 && <><span className="text-2xl animate-bounce">⚖️</span> <span>משווה בין עשרות אפשרויות...</span></>}
                  {loadingStep === 3 && <><span className="text-2xl animate-bounce">✨</span> <span>מכין המלצות מותאמות אישית...</span></>}
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <p className="text-sm font-semibold" style={{ color: '#ffd700' }}>
                  {loadingStep < 3 ? `שלב ${loadingStep + 1} מתוך 4` : 'כמעט מוכן'}
                </p>
                <span className="text-sm animate-pulse" style={{ color: '#8a8a8a' }}>
                  • 🤖 היועץ AI עובד עבורך
                </span>
              </div>
            </div>

            {/* Skeleton Cards - Preview of results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => (
                <div 
                  key={i}
                  className="glass-light border rounded-xl overflow-hidden"
                  style={{ 
                    borderColor: 'rgba(138, 138, 138, 0.2)',
                    animationDelay: `${i * 0.15}s`
                  }}
                >
                  {/* Skeleton header */}
                  <div className="p-5 border-b animate-pulse" style={{ 
                    borderColor: 'rgba(138, 138, 138, 0.15)',
                    backgroundColor: 'rgba(26, 26, 26, 0.3)'
                  }}>
                    <div className="h-5 rounded mb-3" style={{ 
                      backgroundColor: 'rgba(255, 215, 0, 0.1)',
                      width: '80%'
                    }}></div>
                    <div className="flex gap-2">
                      <div className="h-6 w-16 rounded-full" style={{ backgroundColor: 'rgba(138, 138, 138, 0.2)' }}></div>
                      <div className="h-6 w-16 rounded-full" style={{ backgroundColor: 'rgba(138, 138, 138, 0.2)' }}></div>
                    </div>
                  </div>
                  
                  {/* Skeleton body */}
                  <div className="p-5 space-y-3 animate-pulse" style={{ backgroundColor: 'rgba(26, 26, 26, 0.3)' }}>
                    <div className="h-3 rounded" style={{ backgroundColor: 'rgba(138, 138, 138, 0.2)', width: '100%' }}></div>
                    <div className="h-3 rounded" style={{ backgroundColor: 'rgba(138, 138, 138, 0.2)', width: '90%' }}></div>
                    <div className="h-3 rounded" style={{ backgroundColor: 'rgba(138, 138, 138, 0.2)', width: '95%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Section */}
        {!isLoading && recommendations && recommendations.length > 0 && (
          <div id="results-section" className="mb-12">
            {/* Results Header with Disclaimer */}
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#e5e4e2' }}>
                ההמלצות עבורך
              </h2>
              <p className="text-sm max-w-2xl mx-auto leading-relaxed mb-4" style={{ color: '#8a8a8a' }}>
                הצעות אלו מבוססות על הפרמטרים שהזנתם. זה לא ייעוץ אישי. 
                <a href="/disclaimer" className="underline" style={{ color: '#ffd700' }}>קרא עוד</a>
              </p>
              
              {/* Comparison Button - Enlarged */}
              <button
                onClick={() => setShowComparison(true)}
                className="px-10 py-4 rounded-xl text-lg font-extrabold border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(212, 175, 55, 0.1) 100%)',
                  borderColor: 'rgba(255, 215, 0, 0.6)',
                  color: '#ffd700',
                  boxShadow: '0 4px 20px rgba(255, 215, 0, 0.2)'
                }}
              >
                📊 השווה את ההמלצות
              </button>
              <p className="text-xs mt-2" style={{ color: '#5a5a5a' }}>
                ראה טבלת השוואה מפורטת של כל האפשרויות
              </p>
            </div>

            {/* Investment Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {recommendations.map((investment) => (
                <InvestmentCard 
                  key={investment.id} 
                  investment={investment}
                  onShowDetails={(inv) => setSelectedInvestment(inv)}
                />
              ))}
            </div>

          </div>
        )}

        {/* Show message if no results after search */}
        {!isLoading && hasSearched && (!recommendations || recommendations.length === 0) && (
          <div className="text-center py-16">
            <p className="text-finance-lightsilver text-xl">לא נמצאו המלצות מתאימות. אנא נסו שילוב אחר של פרמטרים.</p>
          </div>
        )}

        {/* Simple Footer */}
        <div className="text-center py-8">
          <p className="text-sm" style={{ color: '#8a8a8a' }}>
            © 2025 MoneyHarbor | <span style={{ color: '#ffd700' }}>נבנה עם ❤️ למשקיעים בישראל</span>
          </p>
        </div>
      </div>

      {/* Comparison Table Modal */}
      {showComparison && recommendations && (
        <ComparisonTable 
          investments={recommendations}
          onClose={() => setShowComparison(false)}
        />
      )}

      {/* Investment Details Modal */}
      {selectedInvestment && (
        <InvestmentDetailsModal
          investment={selectedInvestment}
          userAmount={userAmount}
          onClose={() => setSelectedInvestment(null)}
        />
      )}
    </main>
  );
}

