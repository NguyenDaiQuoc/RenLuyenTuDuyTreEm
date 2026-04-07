# BrainyKids - Gamified Learning for Curious Minds

BrainyKids is a production-ready platform designed to help children (3+ years old) develop critical thinking, logic, and creativity. Unlike traditional rote-memorization apps, BrainyKids uses interactive games, AI-powered storytelling, and gamified progression to make learning an adventure.

## 🚀 Features
- **Gamified Progression**: XP system, levels, badges, and stars.
- **Interactive Modules**: Math, Science, and Nature subjects with visual quizzes.
- **AI Tutors**: Personalized learning assistance using Gemini 3.1.
- **Creative Lab**: Generate images (Gemini 3 Pro), videos (Veo), and music (Lyria) as rewards.
- **Competitive Mode**: Real-time PvP quiz battles.
- **Admin Dashboard**: Manage content and track platform analytics.

## 🛠 Tech Stack
- **Frontend**: React (Vite), TypeScript, TailwindCSS, Zustand, React Query, Framer Motion.
- **Backend**: Node.js (Express), Socket.io.
- **Database & Auth**: Firebase (Firestore, Auth).
- **AI**: Google Gemini SDK (@google/genai).

## 📦 Setup Instructions
1. **Environment Variables**:
   - Copy `.env.example` to `.env`.
   - Add your `GEMINI_API_KEY`.
2. **Firebase Setup**:
   - The app uses Firebase for Auth and Firestore.
   - Ensure `firebase-applet-config.json` is present (automatically handled in AI Studio).
3. **Installation**:
   ```bash
   npm install
   ```
4. **Run Locally**:
   ```bash
   npm run dev
   ```

## 🎮 How to Play
1. Register an account.
2. Choose a subject (Math, Science, or Nature).
3. Complete levels to earn XP and unlock badges.
4. Use the "Creative Lab" to generate AI art based on your achievements!
