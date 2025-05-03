"use server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export async function getSession() {
  try {
    const token = cookies().get("token")?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, SECRET_KEY);

    // ✅ Only return safe user info — avoid returning full token
    return { userId: decoded.id }; // consistent with payload in token
  } catch (error) {
    return null;
  }
}
