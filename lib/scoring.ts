// Rule-based scoring algorithm to match user preferences with investment options
// TODO: Replace this heuristic approach with an API call to an AI model for personalized recommendations

import { InvestmentOption, RiskLevel, TimeHorizon, Liquidity, KnowledgeLevel } from './investments';

export interface UserPreferences {
  amount: number;
  timeHorizon: string; // 'עד שנה' | '1-3 שנים' | '3-7 שנים' | 'מעל 7 שנים'
  riskLevel: RiskLevel;
  liquidity: string; // 'חשוב לי נזילות גבוהה' | 'אפשר לנעול לתקופה בינונית' | 'לא חייב נזילות גבוהה'
  knowledgeLevel?: KnowledgeLevel;
  additionalNotes?: string; // Free text for additional preferences
}

export interface ScoredInvestment extends InvestmentOption {
  score: number;
  matchReason: string;
}

// Map user inputs to internal types
function mapTimeHorizonToInternal(userInput: string): TimeHorizon {
  switch (userInput) {
    case 'שנה':
      return 'קצר';
    case 'שנתיים':
    case '3 שנים':
      return 'בינוני';
    case '4 שנים':
    case '5 שנים':
    case '6 שנים':
    case '7+ שנים':
      return 'ארוך';
    default:
      return 'בינוני';
  }
}

function mapLiquidityToInternal(userInput: string): Liquidity {
  switch (userInput) {
    case 'חשוב לי נזילות גבוהה':
      return 'גבוהה';
    case 'אפשר לנעול לתקופה בינונית':
      return 'בינונית';
    case 'לא חייב נזילות גבוהה':
      return 'נמוכה';
    default:
      return 'בינונית';
  }
}

// Calculate match score for a single investment option
function calculateScore(
  investment: InvestmentOption,
  preferences: UserPreferences
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // Time horizon matching (30 points)
  const userTimeHorizon = mapTimeHorizonToInternal(preferences.timeHorizon);
  if (investment.timeHorizon.includes(userTimeHorizon)) {
    score += 30;
    reasons.push(`מתאים לטווח הזמן שבחרת (${preferences.timeHorizon})`);
  } else {
    score -= 10; // Penalty for mismatch
  }

  // Risk level matching (35 points)
  if (investment.riskLevel === preferences.riskLevel) {
    score += 35;
    reasons.push(`תואם את רמת הסיכון המועדפת שלך (${preferences.riskLevel})`);
  } else {
    // Partial points for adjacent risk levels
    const riskOrder: RiskLevel[] = ['נמוכה', 'בינונית', 'גבוהה'];
    const userRiskIndex = riskOrder.indexOf(preferences.riskLevel);
    const investmentRiskIndex = riskOrder.indexOf(investment.riskLevel);
    const riskDiff = Math.abs(userRiskIndex - investmentRiskIndex);
    
    if (riskDiff === 1) {
      score += 15;
    } else {
      score -= 15;
    }
  }

  // Liquidity matching (20 points)
  const userLiquidity = mapLiquidityToInternal(preferences.liquidity);
  const liquidityOrder: Liquidity[] = ['נמוכה', 'בינונית', 'גבוהה'];
  const userLiqIndex = liquidityOrder.indexOf(userLiquidity);
  const investLiqIndex = liquidityOrder.indexOf(investment.liquidity);
  
  if (investment.liquidity === userLiquidity) {
    score += 20;
    reasons.push('נזילות תואמת את הדרישות שלך');
  } else if (investLiqIndex >= userLiqIndex) {
    // Investment has higher or equal liquidity than required - still good
    score += 10;
  } else {
    score -= 10;
  }

  // Minimum amount check (10 points or penalty)
  if (investment.minAmount !== undefined) {
    if (preferences.amount >= investment.minAmount) {
      score += 10;
    } else {
      score -= 30; // Strong penalty if amount is too low
      reasons.push(`דורש סכום התחלתי מינימלי של ₪${investment.minAmount.toLocaleString()}`);
    }
  } else {
    score += 10; // No minimum requirement
  }

  // Knowledge level matching (5 points bonus)
  if (preferences.knowledgeLevel && investment.suitableFor.includes(preferences.knowledgeLevel)) {
    score += 5;
    reasons.push('מתאים לרמת הידע שלך');
  }

  return { score, reasons };
}

// Helper function to categorize investments for diversity
function getInvestmentCategory(investment: InvestmentOption): string {
  const name = investment.name.toLowerCase();
  
  // Categorize by type of investment
  if (name.includes('s&p') || name.includes('nasdaq') || name.includes('מדד') || name.includes('גלובלי')) {
    return 'index-funds';
  }
  if (name.includes('אג״ח') || name.includes('מק״מ')) {
    return 'bonds';
  }
  if (name.includes('נדל״ן')) {
    return 'real-estate';
  }
  if (name.includes('p2p') || name.includes('הלוואות')) {
    return 'lending';
  }
  if (name.includes('ביטקוין') || name.includes('קריפטו')) {
    return 'crypto';
  }
  if (name.includes('דיבידנד')) {
    return 'dividend-stocks';
  }
  if (name.includes('חיסכון') || name.includes('פיקדון')) {
    return 'savings';
  }
  
  return 'other';
}

// Internal type for scoring with category
interface ScoredWithCategory extends ScoredInvestment {
  category: string;
}

// Main function to get top 3 recommendations with diversity
export function getTopRecommendations(
  investments: InvestmentOption[],
  preferences: UserPreferences
): ScoredInvestment[] {
  // Score all investments
  const scored: ScoredWithCategory[] = investments.map((investment) => {
    const { score, reasons } = calculateScore(investment, preferences);
    
    // Add small random factor (±5 points) for variety in recommendations
    const randomFactor = Math.random() * 10 - 5;
    
    return {
      ...investment,
      score: score + randomFactor,
      matchReason: reasons.length > 0 
        ? reasons.join(', ') 
        : 'אפשרות השקעה חלופית',
      category: getInvestmentCategory(investment),
    };
  });

  // Sort by score (descending)
  const sortedScored = scored.sort((a, b) => b.score - a.score);
  
  // Select top 3 with diversity - prefer different categories
  const selected: ScoredWithCategory[] = [];
  const usedCategories = new Set<string>();
  
  // First pass: add highest-scoring items from unique categories
  for (const investment of sortedScored) {
    if (selected.length >= 3) break;
    
    if (!usedCategories.has(investment.category)) {
      selected.push(investment);
      usedCategories.add(investment.category);
    }
  }
  
  // Second pass: if we still need more, add remaining highest-scoring items
  if (selected.length < 3) {
    for (const investment of sortedScored) {
      if (selected.length >= 3) break;
      if (!selected.includes(investment)) {
        selected.push(investment);
      }
    }
  }

  // Remove category field before returning
  return selected.slice(0, 3).map(({ category, ...rest }) => rest);
}

