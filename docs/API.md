# API Reference

This document outlines all backend authentication-related endpoints for **Code and Run**.

---

## Base URL
```
https://cr-backend-r0vn.onrender.com
```

---

## POST `/api/login`
Authenticate user via email/phone and password.

### Request Body:
```json
{
  "identifier": "user@example.com or 9876543210",
  "password": "UserPassword123@"
}
```

### Response:
- `200 OK` → sets `token` cookie (HttpOnly, Secure)
- `401 Unauthorized` → invalid credentials

---

## POST `/api/signup`
Register a new user account.

### Request Body:
```json
{
  "email": "user@example.com",
  "phone": "9876543210",
  "password": "UserPassword123@"
}
```

### Response:
- `200 OK` → success
- `409 Conflict` → user already exists

---

## GET `/api/session/verify`
Verifies active session using token in cookie.

### Headers:
Sent automatically via browser with `credentials: "include"`

### Response:
- `200 OK` + user object (excluding password)
- `401 Unauthorized` → invalid or expired token

---

## GET `/api/session/logout`
Logs out current user and clears the token.

### Response:
- `200 OK` → session cleared

### Cookie Cleared:
- `token` (HttpOnly, Secure, SameSite=None)

---

*Last updated: April 11, 2025*

