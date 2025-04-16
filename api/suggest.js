const { ChatOpenAI } = require("@langchain/openai");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");

module.exports = async (req, res) => {
  // Handle CORS and OPTIONS preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
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

    const response = await chatModel.invoke([
      new SystemMessage(
        `You are a movie recommendation system. Based on the user's prompt, please provide relevant movie titles, their year of release, and a short description. There is no limit to the number of movies you can suggest.`
      ),
      new HumanMessage(`${occasion}`)
    ]);

    // Send the raw response as is
    res.json({
      success: true,
      suggestions: response.content
    });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({
      error: "Failed to generate suggestions",
      details: error.message || JSON.stringify(error) || "Unknown error"
    });
  }
};
