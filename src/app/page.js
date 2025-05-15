"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check session from backend
  const verifySession = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/session/verify`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok && data.success) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (err) {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    verifySession();

    const handleStorage = (event) => {
      if (event.key === "logoutEvent" || event.key == "loginEvent") {
        verifySession();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white font-[Open_Sans] bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600">
      {/* Logo */}
      <div className="absolute top-10">
        <Image
          src="/logo.png"
          alt="Code and Run Logo"
          width={200}
          height={70}
          priority
        />
      </div>

      {/* Welcome Message */}
      <div className="text-center">
        <h1 className="text-5xl font-semibold">Welcome to Code & Run</h1>
        <p className="text-2xl mt-2">Learn. Build. Grow.</p>

        {/* Buttons */}
        <div className="mt-6 flex justify-center space-x-4">
          <Link href="/signup">
            <button className="w-48 px-6 py-2 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition">
              Create Account
            </button>
          </Link>

          {isLoggedIn ? (
            <Link href="/dashboard">
              <button className="w-48 px-6 py-2 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 transition">
                Dashboard
              </button>
            </Link>
          ) : (
            <Link href="/login">
              <button className="w-48 px-6 py-2 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition">
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
