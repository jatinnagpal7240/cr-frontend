# Pages Overview – Code and Run

This document outlines the core pages of the Code and Run platform and their session-aware behaviors.

---

## 1. `/` – Homepage

**Purpose:** Entry point of the platform

**Behavior:**
- Redirects to `/dashboard` if an active session exists
- Displays logo, welcome text, and buttons for Login & Signup if not logged in
- Listens for `loginEvent` and `logoutEvent` via `localStorage` to sync state

---

## 2. `/login` – Sign In

**Purpose:** User authentication via email/phone and password

**Behavior:**
- Redirects to `/dashboard` if already logged in
- On successful login:
  - Sets `token` cookie
  - Triggers:
    ```js
    localStorage.setItem("loginEvent", Date.now());
    localStorage.setItem("session-updated", Date.now());
    ```
  - Redirects to `/dashboard`
- Listens for login/logout events across tabs and reloads if necessary

---

## 3. `/signup` – Create Account

**Purpose:** User registration with email/phone and password

**Behavior:**
- Redirects to `/dashboard` if already logged in
- After successful signup:
  - Shows welcome message and redirect animation
  - Redirects to `/login` after 4s (using `router.replace`)
- Listens for login/logout events via `localStorage`

---

## 4. `/dashboard`

**Purpose:** Main logged-in view for users

**Behavior:**
- Redirects to `/login` if session is invalid or expired
- On logout:
  - Triggers:
    ```js
    localStorage.setItem("logoutEvent", Date.now());
    localStorage.setItem("session-updated", Date.now());
    ```
  - Redirects to `/login`
- Listens for logout event and reloads if triggered from another tab

---

Each page is fully session-aware and stays in sync with other tabs via `localStorage` events.

---

*Last updated: April 11, 2025*

