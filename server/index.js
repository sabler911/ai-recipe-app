require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/recipe', async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients) {
      return res.status(400).json({ error: 'Please provide ingredients' });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a professional chef. The user will give you a list of ingredients. You must respond ONLY with a valid JSON object. Do not include markdown formatting, backticks, or any text outside the JSON. The JSON must have this exact structure: { "title": "Recipe Name", "ingredients": ["item 1", "item 2"], "instructions": ["Step 1", "Step 2"] }'
        },
        {
          role: 'user',
          content: `Here are my ingredients: ${ingredients}`
        }
      ],
      model: 'openai/gpt-oss-120b',
    });

    // Parse the AI response into JSON
    const aiResponse = chatCompletion.choices[0]?.message?.content;
    const recipeData = JSON.parse(aiResponse);

    res.json(recipeData);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate recipe' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});