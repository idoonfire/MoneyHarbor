import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Cache for 4 hours (14400 seconds)
export const revalidate = 14400;

const NEWS_PROMPT = `אתה עיתונאי כלכלי מומחה המכיר היטב את השוק הישראלי והעולמי.

צור סיכום מקצועי של **5-7 נושאים חמים** שקורים עכשיו בעולם ההשקעות והכלכלה, 
עם דגש על השוק הישראלי אבל כולל גם מגמות עולמיות רלוונטיות.

לכל נושא כלול:
- כותרת קצרה ומעניינת (10-15 מילים)
- הסבר קצר מה קורה ולמה זה חשוב (2-3 משפטים)
- האם זה השפעה חיובית/שלילית/ניטרלית

פורמט JSON בלבד:
{
  "briefing": [
    {
      "title": "כותרת קצרה ומושכת",
      "summary": "הסבר קצר של מה קורה ולמה זה חשוב למשקיעים",
      "impact": "positive" | "negative" | "neutral",
      "category": "ישראל" | "עולמי" | "מטבעות" | "מניות" | "אג״ח" | "נדל״ן"
    }
  ],
  "generatedAt": "תאריך ושעה בעברית"
}

התמקד בנושאים רלוונטיים למשקיעים פסיביים בישראל.`;

export async function GET() {
  try {
    console.log('📰 Generating AI news briefing...');

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-api-key-here') {
      return NextResponse.json({
        briefing: getDemoContent(),
        generatedAt: new Date().toLocaleString('he-IL'),
        isDemo: true
      });
    }

    // Call OpenAI for news briefing
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: NEWS_PROMPT },
        { role: 'user', content: 'צור סיכום חדשות עדכני לשוק ההשקעות הישראלי והעולמי.' }
      ],
      temperature: 0.8, // More creative for news
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    });

    const aiResponse = completion.choices?.[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    const newsData = JSON.parse(aiResponse);

    console.log(`✅ Generated ${newsData.briefing?.length || 0} news items`);
    console.log(`💰 Tokens used: ${completion.usage?.total_tokens || 0}`);

    return NextResponse.json({
      ...newsData,
      metadata: {
        tokensUsed: completion.usage?.total_tokens || 0,
        cost: ((completion.usage?.total_tokens || 0) / 1000000) * 0.50,
        model: 'gpt-4o-mini'
      }
    });

  } catch (error: any) {
    console.error('❌ Error generating news:', error);
    
    // Return demo content on error
    return NextResponse.json({
      briefing: getDemoContent(),
      generatedAt: new Date().toLocaleString('he-IL'),
      isDemo: true,
      error: error.message
    });
  }
}

// Demo content if AI fails
function getDemoContent() {
  return [
    {
      title: 'עמוד חדשות בפיתוח',
      summary: 'אנחנו עובדים על הבאת עדכונים בזמן אמת מהשוק הפיננסי הישראלי והעולמי. בקרוב תראו כאן ניתוחים וסיכומים יומיים.',
      impact: 'neutral',
      category: 'עדכון'
    }
  ];
}
