const express = require('express');
const { ChatOpenAI } = require("@langchain/openai");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { occasion } = req.body;

    if (!occasion || typeof occasion !== 'string') {
      return res.status(400).json({ 
        error: "Valid occasion string is required",
        example: "Provide movie suggestions for the cryptography seminar."
      });
    }

    const chatModel = new ChatOpenAI({
      temperature: 0.7,
      modelName: "llama3-8b-8192",
      apiKey: process.env.OPENAI_API_KEY,
      configuration: {
        baseURL: process.env.OPENAI_API_BASE,
      },
    });

    // Modify the system message to suggest an unlimited number of movies based on the occasion
    const response = await chatModel.invoke([
      new SystemMessage(
        `You are a movie recommendation system. Based on the user's prompt, please provide relevant movie titles, their year of release, and a short description. There is no limit to the number of movies you can suggest.`
      ),
      new HumanMessage(`${occasion}`)
    ]);

    // Send the raw response as is, no parsing necessary
    res.json({ 
      success: true,
      suggestions: response.content
    });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ 
      error: "Failed to generate suggestions",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
