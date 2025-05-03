# Project Setup Guide

This document provides the initial setup instructions for the Code and Run platform.

---

## 1. Prerequisites

- Node.js (v18+ recommended)
- npm (v9+)
- Git
- MongoDB Atlas account (or local instance)
- Vercel account for frontend deployment
- Render account for backend deployment

---

## 2. Clone the Repository

```bash
git clone https://github.com/jatinnagpal7240/codeandrun.git
cd codeandrun
```

---

## 3. Environment Variables

### Frontend (.env.local)

```
NEXT_PUBLIC_API_BASE_URL=https://cr-backend-r0vn.onrender.com
```

### Backend (.env)

```
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
```

---

## 4. Install Dependencies

### Frontend
```bash
cd frontend
npm install
```

### Backend
```bash
cd backend
npm install
```

---

## 5. Running Locally

### Frontend
```bash
npm run dev
```

### Backend
```bash
node index.js
```

---

## 6. Deployment

### Frontend (Vercel)
- Connect GitHub repo
- Set `NEXT_PUBLIC_API_BASE_URL` in Vercel dashboard

### Backend (Render)
- Create Web Service
- Set `MONGO_URI` and `JWT_SECRET`
- Deploy from GitHub repo

---

*Last updated: April 11, 2025*

