# Code and Run – Project Conventions

This document outlines naming, structuring, and coding conventions followed in the **Code and Run** project to maintain consistency and clarity across the codebase.

---

## 1. Folder & File Structure

### App Directory (Next.js App Router)
- Each route is represented by a folder inside `app/`
- `page.js` represents the route component
- `layout.js` is used for persistent layouts (not used in current setup)

### Examples:
```
/app
  /login
    page.js
  /signup
    page.js
  /dashboard
    page.js
  page.js     ← Homepage (/)
```

### Components Directory
- All shared components live inside `/components`
- Components are kept functional and modular

```
/components
  LoginForm.js
  SignupForm.js
  Header.js
```

---

## 2. Naming Conventions

### Files & Folders
- kebab-case for folders: `/session-routes`
- camelCase for filenames (JS/TS/JSX): `sessionRoutes.js`, `loginForm.js`
- PascalCase for React component names: `LoginForm`, `SignupPage`

### Variables & Functions
- camelCase for all variables and functions: `handleSubmit`, `formData`
- Constants in UPPER_SNAKE_CASE if outside component: `JWT_SECRET`

### Events in localStorage
- Use clear and specific keys: `loginEvent`, `logoutEvent`, `session-updated`

---

## 3. API Design

- Use RESTful naming: `/api/signup`, `/api/session/logout`
- Only use GET/POST for now
- Responses are JSON with meaningful status codes

---

## 4. Styling Conventions

- Tailwind CSS is used for all styling
- Use utility-first approach and group similar styles
- Shared animations (e.g. loaders, transitions) follow naming like `animate-ping-slow`

---

## 5. Other Rules

- Keep pages client-side where user session is needed (`"use client"`)
- Session check happens inside `useEffect()` on all auth-sensitive pages
- Use `router.replace()` for redirects to avoid back navigation glitches
- Wrap all fetch calls in `try/catch`

---

Following these conventions ensures scalable, clean, and dev-friendly code.

*Last updated: April 11, 2025*

