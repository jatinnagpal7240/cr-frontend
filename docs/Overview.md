# 📘 Project Overview: Code & Run

## 🧠 What is Code & Run?
Code & Run is a full-stack educational platform designed to help users learn, build, and grow. It features a simple authentication system and a user-centric dashboard built with modern web technologies.

## 🚀 Tech Stack
- **Frontend**: Next.js (App Router), Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: MongoDB Atlas
- **Deployment**: Frontend on **Vercel**, Backend on **Render**

## 🏗️ Folder Structure
```
/code-and-run
│
├── /app
│   ├── /login
│   ├── /signup
│   ├── /dashboard
│   └── page.js (Homepage)
│
├── /components
│   └── Shared UI elements, input fields, etc.
│
├── /public
│   └── Static assets (e.g., logo.png)
│
├── .env.local → local environment variables
├── next.config.js
├── tailwind.config.js
└── README.md
```

## ⚙️ How to Run Locally
1. Clone the repo
2. Run `npm install`
3. Add `.env.local` with:
```env
NEXT_PUBLIC_API_BASE_URL=https://cr-backend-r0vn.onrender.com
```
4. Start dev server:
```bash
npm run dev
```

## 🌐 Environments
- Production: `https://codeandrun.in`
- Backend: `https://cr-backend-r0vn.onrender.com`

---

See related docs:
- [Authentication.md](./Authentication.md)
- [API.md](./API.md)
- [Pages.md](./Pages.md)
- [Conventions.md](./Conventions.md)
- [Setup.md](./Setup.md)

