"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState(null);
  const [usernameSuccess, setUsernameSuccess] = useState(null);
  const usernameRegex = /^[a-zA-Z0-9_]{10,}$/;
  const [showTooltip, setShowTooltip] = useState(false);

  const tooltipIconRef = useRef(null);
  const tooltipBoxRef = useRef(null);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/session/verify`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) router.push("/login");
        else {
          const data = await res.json();
          setUser(data.user);
          setLoading(false);
        }
      } catch (err) {
        router.push("/login");
      }
    };
    verifySession();

    const handleStorageChange = (event) => {
      if (event.key === "logoutEvent") window.location.reload();
    };
    window.addEventListener("storage", handleStorageChange);

    // ✅ Scoped click handler (fresh refs + state)
    const handleClickOutside = (event) => {
      const isInDropdown =
        dropdownRef.current?.contains(event.target) ||
        buttonRef.current?.contains(event.target);
      const isInTooltip =
        tooltipIconRef.current?.contains(event.target) ||
        tooltipBoxRef.current?.contains(event.target);

      if (!isInDropdown && dropdownOpen) {
        setDropdownOpen(false);
      }

      if (!isInTooltip && showTooltip) {
        setShowTooltip(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen, showTooltip, router]);

  const handleLogout = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/session/logout`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (res.ok) {
        localStorage.setItem("session-updated", Date.now());
        localStorage.setItem("logoutEvent", Date.now());
        router.push("/login");
      }
    } catch (err) {
      alert("Something went wrong.");
    }
  };

  const checkUsernameAvailability = async () => {
    const trimmed = username.trim();
    if (!trimmed) return;

    if (!usernameRegex.test(trimmed)) {
      setUsernameStatus("invalid");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/username/check?username=${trimmed}`
      );
      setUsernameStatus(res.status === 200 ? "available" : "taken");
    } catch (err) {
      console.error("Error checking username availability", err);
      setUsernameStatus(null);
    }
  };

  const submitUsername = async () => {
    const trimmed = username.trim();
    if (!trimmed) return;

    if (!usernameRegex.test(trimmed)) {
      setShowTooltip(true);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/username/set`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: trimmed }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setUsername("");
        setUsernameStatus(null);
        setUsernameSuccess(`Username Set - ${data.user.username}`);
        setShowTooltip(false);
      } else {
        alert("❌ Could not set username.");
      }
    } catch (err) {
      console.error("Error setting username", err);
      alert("❌ Could not set username.");
    }
  };

  const renderAvatar = () => {
    if (user?.photo) {
      return (
        <img
          src={user.photo}
          alt="User"
          className="w-12 h-12 rounded-full object-cover shadow"
        />
      );
    } else if (user?.name) {
      return (
        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold text-white shadow">
          {user.name.charAt(0).toUpperCase()}
        </div>
      );
    } else {
      return (
        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 shadow">
          <User className="w-6 h-6" />
        </div>
      );
    }
  };

  if (loading) {
    return (
      <p className="text-center pt-8 text-gray-500">
        Loading your dashboard...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100">
      <div
        className="w-full bg-black shadow-md flex items-center justify-between"
        style={{ height: "80px", padding: "0 24px" }}
      >
        <div className="flex items-center h-full">
          <img
            src="/Code___Run_-_Logos__1_-removebg-preview (1).png"
            alt="Logo"
            className="h-18 w-auto object-contain"
          />
        </div>
        <div className="relative mr-4">
          <button
            ref={buttonRef}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="focus:outline-none"
          >
            {renderAvatar()}
          </button>

          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-3 w-[420px] backdrop-blur-xl bg-white/80 rounded-2xl shadow-2xl border p-6 z-50 animate-fade-in"
            >
              <button
                onClick={() => setDropdownOpen(false)}
                className="absolute top-2 right-4 text-gray-500 hover:text-gray-800 text-2xl"
              >
                &times;
              </button>
              <div className="flex items-center gap-4">
                {renderAvatar()}
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {user?.name || "User"}
                  </h3>
                  <p className="text-gray-500 text-sm">{user?.email}</p>
                </div>
              </div>

              <div className="mt-6">
                {usernameSuccess ? (
                  <div className="text-green-600 text-sm space-y-1">
                    <p>
                      <strong>{usernameSuccess}</strong>
                    </p>
                    <p className="text-gray-700">
                      You can use it to login next time.
                    </p>
                  </div>
                ) : !user?.username ? (
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Choose a unique username
                      <span className="relative">
                        <svg
                          ref={tooltipIconRef}
                          onClick={() => setShowTooltip(!showTooltip)}
                          className="w-4 h-4 text-gray-500 cursor-pointer"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 16h-1v-4h-1m1-4h.01M12 19a7 7 0 100-14 7 7 0 000 14z"
                          />
                        </svg>
                        {showTooltip && (
                          <div
                            ref={tooltipBoxRef}
                            className="absolute z-50 top-6 left-1/2 transform -translate-x-1/2 bg-white text-gray-700 border rounded-lg p-2 shadow-lg text-xs w-64"
                          >
                            ✅ Username must be at least{" "}
                            <strong>10 characters</strong> long, and can only
                            contain letters, numbers, and underscores.
                          </div>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          setUsernameStatus(null);
                        }}
                        onBlur={checkUsernameAvailability}
                        placeholder="Create your username"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      <button
                        onClick={submitUsername}
                        disabled={!username}
                        className={`p-2 rounded-lg transition ${
                          username
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        }`}
                        title="Submit Username"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </button>
                    </div>
                    {usernameStatus === "available" && (
                      <p className="text-green-600 text-xs">
                        Username available!
                      </p>
                    )}
                    {usernameStatus === "taken" && (
                      <p className="text-red-500 text-xs">
                        Username already taken.
                      </p>
                    )}
                  </div>
                ) : null}
              </div>

              <div className="mt-6 flex gap-4">
                <button className="flex-1 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                  Manage your CR Account
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3 text-sm font-semibold text-red-600 border border-red-500 rounded-lg hover:bg-red-50 transition"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-16 max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-10 text-center">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
          Welcome back, {user?.name || "User"}!
        </h2>
        <p className="text-gray-600 text-lg">
          Your personal CR Dashboard is ready.
        </p>
        <div className="mt-6 text-sm text-gray-500">
          ✨ More features coming soon — stay tuned!
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
