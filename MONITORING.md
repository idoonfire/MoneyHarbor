# 🔍 Monitoring Your AI System

## 3 Ways to Monitor AI Requests

---

## 1️⃣ **Browser Console (Real-Time)** 🖥️

### Open DevTools:
- **Chrome/Edge**: Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- **Firefox**: Press `F12`
- **Safari**: Enable Developer Menu first, then `Cmd+Option+C`

### What You'll See:
When you submit the form, look for:

```
🚀 Calling AI API... {amount: 100000, timeHorizon: "3 שנים", ...}
⏱️ AI Response received in 2341ms
📊 Response data: {recommendations: [...], metadata: {...}}
✅ Using AI recommendations
💰 Cost: $0.0009
🔢 Tokens: 1847
```

### Status Indicators:
- ✅ **"Using AI recommendations"** = AI working!
- ⚠️ **"Using fallback algorithm"** = AI failed, using backup

---

## 2️⃣ **Server Terminal (Backend Logs)** 🖨️

### Where to Look:
The terminal where you ran `npm run dev`

### What You'll See:
```
🤖 AI Request Started: 10:45:23
📊 User Profile: {amount: 100000, timeHorizon: "3 שנים", ...}
✅ AI Response Received
💰 Tokens Used: 1847
📝 Recommendations: 3
⏱️ Request Complete: 10:45:25
```

### Error Messages:
If something goes wrong:
```
❌ AI Recommendation Error: [error details]
```

---

## 3️⃣ **OpenAI Dashboard (Usage & Costs)** 📊

### Access:
**https://platform.openai.com/usage**

### What You Can See:
- ✅ Total requests today/this month
- 💰 Total cost (in $)
- 📈 Usage trends over time
- 🔢 Tokens consumed per request
- 📊 Breakdown by model

### Example View:
```
Today: 47 requests
Cost: $0.04
Average tokens per request: 1,850
```

---

## 📊 **Understanding the Metrics**

### **Tokens Used:**
- Typical: 1,500-2,500 tokens per request
- Breakdown:
  - Input: ~1,200 tokens (your prompt + system prompt)
  - Output: ~1,200 tokens (3 recommendations)

### **Cost Per Request:**
- **GPT-4o-mini**: ~$0.0009 (less than 1 cent!)
- Formula: (tokens / 1,000,000) × $0.50

### **Response Time:**
- Normal: 2-4 seconds
- Fast: 1-2 seconds
- Slow: 5+ seconds (may indicate API issues)

---

## 🎯 **Quick Test**

1. **Open browser DevTools** (F12)
2. **Go to Console tab**
3. **Fill out the form on your site**
4. **Click submit**
5. **Watch the console!**

You should see:
- 🚀 Request started
- ⏱️ Response time
- ✅ AI confirmation
- 💰 Cost info

---

## 🐛 **Troubleshooting**

### "Using fallback algorithm"
**Possible causes:**
- API key not set correctly
- OpenAI API down
- Rate limit exceeded
- Billing issue

**Check:**
1. `.env.local` has correct API key
2. OpenAI dashboard for errors
3. Server terminal for detailed errors

### No logs appearing
**Solutions:**
- Clear browser cache (Ctrl+Shift+R)
- Restart dev server
- Check that DevTools Console is open

---

## 💡 **Pro Tips**

### Monitor Costs:
Set up billing alerts in OpenAI dashboard:
- Settings → Billing → Usage Limits
- Recommended: $10-20/month alert

### Performance:
- If requests take >5 seconds consistently, consider:
  - Shorter prompts
  - Reduce max_tokens
  - Check internet connection

### Quality:
Watch the recommendations quality:
- Are they relevant to Israeli market?
- Do they match user profile?
- Are pros/cons accurate?

---

## 📈 **Example Monitoring Session**

```
[Browser Console]
🚀 Calling AI API... 
⏱️ AI Response received in 2.3s
✅ Using AI recommendations
💰 Cost: $0.0009

[Server Terminal]
🤖 AI Request Started: 14:32:15
📊 User Profile: {amount: 50000, riskLevel: 45}
✅ AI Response Received
💰 Tokens Used: 1753
⏱️ Request Complete: 14:32:18

[OpenAI Dashboard]
Total Today: 12 requests
Cost Today: $0.01
```

---

**Happy Monitoring!** 🚀

Remember: The AI is working if you see ✅ in either console!

