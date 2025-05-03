# Authentication & Session Management

This document explains how authentication and session sync are handled in the **Code and Run** platform.

## Auth Flow Summary

- Uses **HTTP-only secure cookies** named `token` for session persistence
- Sessions are verified on the backend via `/api/session/verify`
- On successful login/signup, cookie is set via server response
- On logout, the cookie is cleared via `/api/session/logout`

## Session Sync Across Tabs

To ensure the app reflects login/logout state across all open browser tabs, we use `localStorage` events:

### On Login:
```js
localStorage.setItem("loginEvent", Date.now());
localStorage.setItem("session-updated", Date.now());
```

### On Logout:
```js
localStorage.setItem("logoutEvent", Date.now());
localStorage.setItem("session-updated", Date.now());
```

### Listening for Events (in login/signup/home/dashboard):
```js
window.addEventListener("storage", (event) => {
  if (event.key === "logoutEvent") {
    location.reload();
  }
  if (event.key === "loginEvent") {
    location.reload();
  }
  if (event.key === "session-updated") {
    // Optional re-check or sync logic
  }
});
```

## Page Behaviors

- `/login` and `/signup` redirect to `/dashboard` if session exists
- `/dashboard` redirects to `/login` if session doesn't exist
- `/` (home) redirects to `/dashboard` if session exists

## Cookie Details

| Property     | Value            |
|--------------|------------------|
| Name         | `token`          |
| HttpOnly     | `true`           |
| Secure       | `true` (HTTPS)   |
| SameSite     | `None`           |
| Expires      | Long-term expiry |

---

This setup ensures both **security** and **usability** across the entire auth flow.

---
_Last updated: April 11, 2025_

