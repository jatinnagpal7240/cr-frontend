"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

const DashboardNavbar = ({ user, setUser }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState(null);
  const [usernameSuccess, setUsernameSuccess] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const usernameRegex = /^[a-zA-Z0-9_]{10,}$/;

  const tooltipIconRef = useRef(null);
  const tooltipBoxRef = useRef(null);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !dropdownRef.current?.contains(e.target) &&
        !buttonRef.current?.contains(e.target)
      )
        setDropdownOpen(false);

      if (
        !tooltipIconRef.current?.contains(e.target) &&
        !tooltipBoxRef.current?.contains(e.target)
      )
        setShowTooltip(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    } catch {
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
    } catch {
      setUsernameStatus(null);
    }
  };

  const submitUsername = async () => {
    const trimmed = username.trim();
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
      } else {
        alert("Could not set username.");
      }
    } catch {
      alert("Could not set username.");
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
        <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-xl font-bold text-white shadow">
          {user.name.charAt(0).toUpperCase()}
        </div>
      );
    } else {
      return (
        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-black shadow">
          <User className="w-6 h-6" />
        </div>
      );
    }
  };

  return (
    <div
      className="w-full bg-white text-black shadow-md flex items-center justify-between px-4 sm:px-8 border-b border-gray-200"
      style={{ height: "70px" }}
    >
      {/* Logo & Nav */}
      <div className="flex items-center gap-8">
        <img
          src="/logo1.png"
          alt="Logo"
          className="h-12 w-auto object-contain hover:scale-105 transition-transform"
        />
        <div className="hidden md:flex items-center gap-6">
          {[
            { name: "Beginner Courses", href: "/courses" },
            { name: "Results & Certificates", href: "/results" },
            { name: "Careers", href: "/careers" },
          ].map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="group relative text-black hover:text-blue-700 font-medium transition-all"
            >
              {item.name}
              <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-blue-700 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>
      </div>

      {/* Avatar & Dropdown */}
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-3 focus:outline-none hover:scale-105 transition"
        >
          {renderAvatar()}
        </button>

        {dropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute right-2 top-full mt-2 w-[90vw] max-w-sm bg-white text-black border rounded-2xl shadow-2xl p-6 z-50"
          >
            <div className="flex items-center gap-4 mb-4">
              {renderAvatar()}
              <div>
                <h3 className="text-xl font-bold">{user?.name || "User"}</h3>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>

            {/* Username Section */}
            <div className="mt-4">
              {usernameSuccess ? (
                <p className="text-green-700 text-sm">{usernameSuccess}</p>
              ) : !user?.username ? (
                <div className="space-y-2 text-sm">
                  <label className="flex items-center gap-1 font-medium">
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
                          className="absolute z-50 top-6 left-1/2 -translate-x-1/2 bg-white text-black border rounded-lg p-2 shadow-lg text-xs w-64"
                        >
                          ✅ Username must be at least{" "}
                          <strong>10 characters</strong> long and contain only
                          letters, numbers, and underscores.
                        </div>
                      )}
                    </span>
                  </label>

                  <div className="flex gap-2">
                    <input
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setUsernameStatus(null);
                      }}
                      onBlur={checkUsernameAvailability}
                      placeholder="Create your username"
                      className="flex-1 px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm"
                    />
                    <button
                      onClick={submitUsername}
                      disabled={!username}
                      className={`p-2 rounded-lg ${
                        username
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }`}
                    >
                      ✓
                    </button>
                  </div>

                  {usernameStatus === "available" && (
                    <p className="text-green-700 text-xs animate-pulse">
                      Username available!
                    </p>
                  )}
                  {usernameStatus === "taken" && (
                    <p className="text-red-600 text-xs">
                      Username already taken.
                    </p>
                  )}
                </div>
              ) : null}
            </div>

            <div className="mt-6 flex gap-4">
              <button className="flex-1 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                Manage Account
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 text-sm font-semibold text-red-600 border border-red-500 rounded-lg hover:bg-red-100 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardNavbar;
