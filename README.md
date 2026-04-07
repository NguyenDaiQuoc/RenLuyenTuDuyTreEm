# 🧠 BrainyKids (RenLuyenTuDuyTreEm)

> Gamified AI Learning Platform for Kids (3+)

![Build](https://img.shields.io/github/actions/workflow/status/NguyenDaiQuoc/RenLuyenTuDuyTreEm/ci.yml?label=build)
![Deploy](https://img.shields.io/badge/deploy-vercel-black)
![License](https://img.shields.io/github/license/NguyenDaiQuoc/RenLuyenTuDuyTreEm)
![Tech](https://img.shields.io/badge/stack-React%20%7C%20Node%20%7C%20Firebase%20%7C%20AI-blue)

BrainyKids là nền tảng học tập tương tác giúp trẻ phát triển tư duy logic, sáng tạo và khả năng giải quyết vấn đề thông qua **gamification + AI**.

---

## 🚀 Demo
- 🌐 Live: (coming soon)
- 📦 Repo: https://github.com/NguyenDaiQuoc/RenLuyenTuDuyTreEm

---

## 🖼 UI Preview

### 🏠 Home Screen
![Home UI](./docs/screenshots/home.png)

### 🎮 Learning Game
![Game UI](./docs/screenshots/game.png)

### 🤖 AI Tutor
![AI UI](./docs/screenshots/ai.png)

### 🛠 Admin Dashboard
![Admin UI](./docs/screenshots/admin.png)

> 📌 Tip: đặt ảnh vào thư mục `docs/screenshots/`

---

## ✨ Core Features

### 🎮 Gamified Learning
- XP, Levels, Badges, Stars
- Progression system như game
- Unlock content theo tiến độ

### 📚 Interactive Modules
- Math (toán tư duy)
- Science (khoa học cơ bản)
- Nature (thế giới xung quanh)
- Quiz trực quan, hình ảnh sinh động

### 🤖 AI-Powered System
- AI Tutor (giải thích, gợi ý học)
- AI Storytelling (học qua câu chuyện)
- Personalized learning path

### 🎨 Creative Lab (Reward System)
- Generate ảnh (Gemini)
- Generate video (Veo)
- Generate nhạc (Lyria)
- Unlock bằng thành tích học

### ⚔️ Multiplayer Mode
- PvP quiz realtime
- Leaderboard
- Competitive learning

### 🛠 Admin Dashboard
- Quản lý nội dung học
- Quản lý user
- Analytics (DAU, retention, progress)

---

## 🧱 Tech Stack

### Frontend
- React (Vite)
- TypeScript
- TailwindCSS
- Zustand
- React Query
- Framer Motion

### Backend
- Node.js (Express)
- Socket.io (Realtime)

### Database & Auth
- Firebase
- Firestore

### AI
- Google Gemini SDK (`@google/genai`)

---

## 🏗 Architecture (High-level)

```
Client (React)
   ↓
API Server (Express)
   ↓
Firebase (DB + Auth)
   ↓
AI Services (Gemini APIs)

Realtime:
Client ↔ Socket.io ↔ Server
```

---

## 📦 Getting Started

### 1. Clone repo
```bash
git clone https://github.com/NguyenDaiQuoc/RenLuyenTuDuyTreEm.git
cd RenLuyenTuDuyTreEm
```

### 2. Setup environment
```bash
cp .env.example .env
```

Add:
```env
GEMINI_API_KEY=your_key_here
```

### 3. Install dependencies
```bash
npm install
```

### 4. Run dev
```bash
npm run dev
```

---

## 🔐 Environment Variables

| Key | Description |
|-----|------------|
| GEMINI_API_KEY | Google Gemini API key |
| FIREBASE_CONFIG | Firebase config JSON |

---

## 🧪 Scripts

```bash
npm run dev       # start dev server
npm run build     # build production
npm run preview   # preview build
```

---

## 📊 Roadmap

### v1 (DONE)
- Basic learning website
- Static quiz system

### v2 (CURRENT)
- AI integration
- Gamification system
- Realtime multiplayer

### v3 (FUTURE)
- Mobile app (React Native)
- Subscription (Stripe)
- Parent dashboard (AI report)
- Advanced analytics (cohort, retention)
- Recommendation engine

---

## 💰 Monetization (Planned)

- Freemium model
- Subscription (monthly/yearly)
- Premium AI features
- School / organization packages

---

## 🎯 Product Vision

- Biến việc học thành trải nghiệm giống game
- Cá nhân hoá giáo dục bằng AI
- Xây dựng nền tảng học tập thế hệ mới cho trẻ em Việt Nam

---

## ⚙️ Deployment (Recommended)

### Frontend
- Vercel

### Backend
- Railway / Render

### Database
- Firebase / Supabase (optional migration)

---

## 🤝 Contributing

PRs are welcome.

```bash
git checkout -b feat/your-feature
git commit -m "feat: add feature"
git push origin feat/your-feature
```

---

## 👤 Author

**Nguyen Dai Quoc**

- GitHub: https://github.com/NguyenDaiQuoc

---

## 📄 License

MIT License

