# 🎬 Movie World – AI-Powered Movie Suggestion App

**Movie World** is a React-based web application that allows users to:
- Search for movies using the OMDb API
- Get smart movie suggestions for any occasion using an integrated AI agent powered by LangChain and Groq's LLaMA 3

Whether you're looking for a movie to watch on a rainy day or planning a themed movie night, the AI assistant has your back with context-aware suggestions!

---

## ✨ Features

- Search movies by title using OMDb
- AI-powered recommendations based on your occasion
- Clean UI with dynamic loading state
- Environment-safe architecture: OMDb runs client-side, OpenAI runs securely server-side

---

## 🤖 How AI Suggestions Work

The app uses:
- **LangChain** to structure and manage prompts
- **Groq API** (running LLaMA 3) to generate movie suggestions
- A **custom backend API** (`/api/suggest`) to securely handle API keys and return clean results to the frontend
