# 🤖 AI Integration Setup Guide

## ✅ What's Been Done

Your investment recommendation system now uses **OpenAI GPT-4o-mini** for intelligent, personalized recommendations!

### Features:
- ✅ AI-powered recommendations based on Israeli market
- ✅ Cost-effective (~$0.90 per 1000 requests)
- ✅ Automatic fallback to rule-based algorithm if AI fails
- ✅ Expert knowledge of Israeli investments (נדל"ן, אג"ח, P2P, קרנות, וכו')

---

## 🔧 Setup Instructions

### Step 1: Create `.env.local` File

Create a file named `.env.local` in your project root:

```bash
# OpenAI API Key
OPENAI_API_KEY=your-api-key-here

# Optional: Set to 'true' to use AI, 'false' for rule-based only
USE_AI_RECOMMENDATIONS=true
```

### Step 2: Add Your API Key

Replace `your-api-key-here` with your actual OpenAI API key that looks like:
```
sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Get your key from:** https://platform.openai.com/api-keys

### Step 3: Restart Development Server

```bash
npm run dev
```

---

## 💰 Cost Estimates

### GPT-4o-mini (Current Setup):
- **Per request**: ~$0.0009
- **100 users/day**: ~$2.70/month
- **1000 users/day**: ~$27/month

### If You Want to Upgrade to GPT-4o:
Change in `app/api/ai-recommend/route.ts`:
```typescript
model: 'gpt-4o', // More powerful but ~15x more expensive
```

---

## 🧪 Testing

1. Fill out the investment form
2. Click "מצאו לי את החניה הכי כדאית"
3. Wait 2-3 seconds
4. You'll see AI-generated recommendations!

---

## 🔄 Fallback System

If AI fails (no API key, API error, etc.), the system automatically falls back to your original rule-based algorithm. **Your users will always get recommendations!**

---

## 📊 What the AI Knows

The AI is an expert in:
- 📈 **Israeli Stock Market**: תל אביב 125, תא-35
- 🏠 **Real Estate**: Investment properties in Israel
- 💵 **P2P Lending**: BTB (Be the Bank)
- 📊 **Israeli Bonds**: Government and corporate
- 🌍 **Global Markets**: S&P 500, NASDAQ
- ₿ **Crypto**: Via regulated platforms (Bits of Gold)
- 🏦 **Savings**: Banks, pension funds, etc.

---

## 🛡️ Security

- ✅ `.env.local` is in `.gitignore` - never committed to Git
- ✅ API key is server-side only (not exposed to browser)
- ✅ Rate limiting can be added if needed

---

## 🎯 Next Steps

### Optional Enhancements:
1. **Add caching** to reduce API calls (save 60-80% on costs)
2. **Add rate limiting** to prevent abuse
3. **Track usage** in OpenAI dashboard
4. **Set spending limits** in OpenAI billing settings

---

## 🐛 Troubleshooting

### "OpenAI API key not configured"
- Make sure `.env.local` exists in project root
- Check that the API key is correctly copied
- Restart the dev server

### "Failed to generate recommendations"
- Check OpenAI billing is set up
- Verify API key is valid
- Check console for detailed error messages
- System will automatically use fallback algorithm

---

## 📝 Files Created/Modified

- ✅ `app/api/ai-recommend/route.ts` - AI API endpoint
- ✅ `app/page.tsx` - Updated to call AI API
- ✅ `.gitignore` - Added `.env.local`
- ✅ `package.json` - Added OpenAI SDK

---

**Ready to test!** 🚀 Just add your API key and start getting AI-powered investment recommendations!

