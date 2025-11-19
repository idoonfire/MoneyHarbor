#!/bin/bash
echo "Creating .env.local file..."
cat > .env.local << 'ENVEOF'
# OpenAI API Key
# Get your key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=your-api-key-here

# Optional: Set to 'true' to use AI, 'false' for rule-based only
USE_AI_RECOMMENDATIONS=true
ENVEOF
echo "✅ .env.local created! Now edit it and add your OpenAI API key."
