import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const GUIDE_EXPANSION_PROMPT = `You are an expert financial writer and investment educator.

Your task is to generate a clear, well-structured **investment explainer report in Hebrew** for non-expert retail investors in Israel.

## General rules:
- Write in **Hebrew**, in simple, conversational language that a smart 16-year-old can understand
- Use short paragraphs and bullet points
- Be neutral and educational. **Do NOT give personal investment advice**
- Never promise returns or guarantee outcomes
- Clearly highlight risks, costs, and limitations
- Assume Israeli tax/regulatory environment
- **CRITICAL: Keep it concise - maximum 4 pages!** Each section should be brief (2-4 sentences max)

## Output JSON structure - MUST fit in 4 pages:
{
  "report": {
    "tldr": [
      "נקודה 1 (משפט אחד)",
      "נקודה 2 (משפט אחד)",
      "נקודה 3 (משפט אחד)",
      "נקודה 4 (משפט אחד)"
    ],
    "whatIsIt": "הסבר פשוט מהי ההשקעה (2-3 משפטים בלבד)",
    "whoIsItFor": {
      "suitable": ["מתאים למי ש... (משפט אחד)", "מתאים למי ש... (משפט אחד)"],
      "notSuitable": ["פחות מתאים למי ש... (משפט אחד)"]
    },
    "returns": {
      "historical": "תיאור קצר של תשואות עבר (1-2 משפטים)",
      "estimated": "טווח תשואה משוער (משפט אחד)",
      "disclaimer": "נתוני עבר אינם מבטיחים תשואות עתיד"
    },
    "risks": [
      "סיכון 1 (משפט אחד)",
      "סיכון 2 (משפט אחד)",
      "סיכון 3 (משפט אחד)",
      "סיכון 4 (משפט אחד)"
    ],
    "timeAndLiquidity": "הסבר על טווח זמן ונזילות (2-3 משפטים)",
    "costs": "הסבר על עלויות ועמלות (2-3 משפטים)",
    "taxation": "הסבר כללי על מיסוי (2-3 משפטים) + 'זה לא ייעוץ מס אישי'",
    "howToStart": [
      "צעד 1 (משפט אחד)",
      "צעד 2 (משפט אחד)",
      "צעד 3 (משפט אחד)"
    ],
    "questionsToAsk": [
      "שאלה 1?",
      "שאלה 2?",
      "שאלה 3?",
      "שאלה 4?",
      "שאלה 5?"
    ],
    "summary": [
      "מסקנה 1 (משפט אחד)",
      "מסקנה 2 (משפט אחד)",
      "מסקנה 3 (משפט אחד)"
    ],
    "disclaimer": "דיסקליימר מלא וברור"
  }
}

## Critical constraints:
- **Maximum 4 pages** - be extremely concise!
- Each section: 2-4 sentences max (except lists which can have 3-5 items)
- Use bullet points for clarity
- Avoid jargon - explain terms simply
- Be educational but neutral - no direct recommendations
- Always mention risks alongside benefits
- Include specific Israeli context when relevant
- **Return ONLY valid JSON** - no extra text
- All content in Hebrew except section keys
`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { investment } = body;

    if (!investment) {
      return NextResponse.json(
        { error: 'Missing investment data' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-api-key-here') {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 503 }
      );
    }

    console.log('📝 Generating detailed guide for:', investment.name);

    const userPrompt = `
Generate an educational investment report for:

**Investment:** ${investment.name}
**Description:** ${investment.description}
**Risk Level:** ${investment.riskLevel}
**Liquidity:** ${investment.liquidity}
**Min Amount:** ${investment.minAmount ? `₪${investment.minAmount.toLocaleString()}` : 'N/A'}
${investment.expectedReturn ? `**Expected Return:** ${investment.expectedReturn}%` : ''}

${investment.actionSteps?.platforms ? `**Known Platforms:** ${investment.actionSteps.platforms.join(', ')}` : ''}
${investment.actionSteps?.costs ? `**Cost Info:** ${investment.actionSteps.costs}` : ''}

**User Profile:**
- Amount: ${investment.userAmount || investment.minAmount || 'N/A'}
- Time horizon: ${investment.timeHorizon?.join(', ') || 'N/A'}
- Risk tolerance: ${investment.riskLevel}

---

**CRITICAL - Keep it to 4 pages maximum!**
- Each section: 2-4 sentences only
- Lists: 3-5 items max
- Be concise but educational
- Simple Hebrew language
- Include Israeli market context

Return ONLY the JSON structure specified above.
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: GUIDE_EXPANSION_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000, // Limit to 4 pages max
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from AI');
    }

    const result = JSON.parse(content);

    console.log('✅ Educational report generated successfully');

    return NextResponse.json({
      success: true,
      guide: result.report || result.detailedGuide // Support both formats for backward compatibility
    });

  } catch (error: any) {
    console.error('❌ Error generating detailed guide:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate guide' },
      { status: 500 }
    );
  }
}

