# MoneyHarbor | נמל הכסף

An AI-powered educational investment platform in Hebrew (RTL layout) that helps users discover passive investment options based on their preferences.

## Overview

This website is designed for Hebrew speakers who have money to invest passively but are overwhelmed by the options available. It provides a simple, educational interface to explore different investment types based on user preferences like:

- Investment amount
- Time horizon
- Risk tolerance
- Liquidity needs
- Knowledge level

**IMPORTANT:** This site is for educational purposes only and does not constitute personal financial advice.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Utility-first styling
- **React** - UI components
- **Hebrew/RTL** - Full right-to-left layout support

## Features

### ✅ Implemented

1. **Hero Section** - Clean, professional landing with clear value proposition
2. **Filter Form** - Comprehensive user preference collection:
   - Investment amount (₪)
   - Time horizon (short/medium/long term)
   - Risk level (low/medium/high)
   - Liquidity preference
   - Optional knowledge level
3. **Smart Recommendations** - Rule-based scoring algorithm that matches user preferences with 9 investment types:
   - S&P 500 Index Funds (ETF)
   - Government Bonds / Short-term Bonds
   - P2P Lending (BTB)
   - Bitcoin (via regulated platforms)
   - Real Estate Investment
   - Global Index Funds
   - Corporate Bonds
   - Dividend Stocks
   - High-yield Savings
4. **Investment Cards** - Detailed cards showing:
   - Investment name and description
   - Risk level and time horizon
   - Why it matches user preferences
   - Pros (with checkmarks)
   - Cons/Risks (with warnings)
   - Minimum investment amount
5. **FAQ Section** - Educational content about passive investing
6. **Legal Disclaimers** - Prominent disclaimers throughout
7. **Loading States** - Smooth UX with loading animations
8. **Responsive Design** - Mobile-first, works on all devices
9. **RTL Layout** - Proper Hebrew right-to-left support

## Getting Started

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
/
├── app/
│   ├── layout.tsx          # Root layout with RTL configuration
│   ├── page.tsx            # Main landing page
│   └── globals.css         # Global styles and fonts
├── components/
│   ├── FilterForm.tsx      # User preference input form
│   ├── InvestmentCard.tsx  # Investment recommendation card
│   └── FAQ.tsx             # FAQ and educational section
├── lib/
│   ├── investments.ts      # Investment data types and dataset
│   └── scoring.ts          # Rule-based recommendation algorithm
└── public/                 # Static assets
```

## Future Enhancements

The current implementation uses a simple rule-based scoring algorithm. Future improvements could include:

1. **AI-Powered Recommendations** - Replace the heuristic scoring with an AI model or API
   - See TODO comments in `lib/scoring.ts` and `app/page.tsx`
2. **User Accounts** - Save preferences and track portfolio
3. **Detailed Investment Pages** - Deep-dive into each investment type
4. **Comparison Tool** - Side-by-side comparison of investments
5. **Educational Content** - Blog posts, videos, guides
6. **Multi-language Support** - Add English and Arabic
7. **Real-time Data** - Integration with financial APIs for live data

## Customization

### Adding New Investment Types

1. Add new investment objects to `investmentOptions` array in `lib/investments.ts`
2. Ensure all required fields are filled:
   - `id`, `name`, `description`
   - `riskLevel`, `timeHorizon`, `liquidity`
   - `pros`, `cons`
   - Optional: `minAmount`, `suitableFor`

### Modifying the Scoring Algorithm

Edit the `calculateScore` function in `lib/scoring.ts` to adjust how investments are matched to user preferences.

### Styling Changes

- Global styles: `app/globals.css`
- Tailwind config: `tailwind.config.ts`
- Color palette is based on professional blues and grays

## Legal Notice

המידע באתר הוא כללי וחינוכי בלבד ואינו מהווה ייעוץ השקעות אישי. לפני קבלת החלטות השקעה יש להיוועץ ביועץ השקעות מוסמך.

The information on this site is general and educational only and does not constitute personal investment advice. Before making any investment decisions, consult with a licensed financial advisor.

## License

Educational project - use at your own discretion.

