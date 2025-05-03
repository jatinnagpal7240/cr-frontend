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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      {/* HEADER */}
      <div
        className="w-full bg-[#DCE3E8] shadow-lg flex items-center justify-between px-4 sm:px-8"
        style={{ height: "70px" }}
      >
        {/* Left: Logo + Navigation */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <img
            src="/logo1.png"
            alt="Logo"
            className="h-12 w-auto object-contain object-center transition-transform duration-300 hover:scale-105 drop-shadow-md"
          />

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {[
              { name: "Beginner Courses", href: "/courses", delay: "100" },
              {
                name: "Results & Certificates",
                href: "/results",
                delay: "100",
              },
              { name: "Careers", href: "/careers", delay: "100" },
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`group relative text-gray-700 hover:text-blue-700 font-medium transition-all duration-300 ease-out delay-${item.delay} transform hover:-translate-y-0.5`}
              >
                {item.name}
                <span className="absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 w-0 bg-blue-700 transition-all duration-300 ease-out group-hover:w-full"></span>
              </a>
            ))}
          </div>
        </div>

        {/* Right: Avatar */}
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="focus:outline-none transition-transform hover:scale-105"
          >
            {renderAvatar()}
          </button>

          {/* Dropdown Panel */}
          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-2 top-full mt-2 w-[90vw] max-w-sm sm:right-0 backdrop-blur-xl bg-white/80 rounded-2xl shadow-2xl border p-6 z-50 animate-fade-in-up"
            >
              <button
                onClick={() => setDropdownOpen(false)}
                className="absolute top-2 right-4 text-gray-500 hover:text-gray-800 text-2xl"
              >
                &times;
              </button>
              <div className="flex items-center gap-4 mb-4">
                {renderAvatar()}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 animate-fade-in">
                    {user?.name || "User"}
                  </h3>
                  <p className="text-gray-500 text-sm">{user?.email}</p>
                </div>
              </div>

              {/* Username Input Section */}
              <div className="mt-4 animate-fade-in">
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
                  <div className="space-y-2">
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
                            className="absolute z-50 top-6 left-1/2 transform -translate-x-1/2 bg-white text-gray-700 border rounded-lg p-2 shadow-lg text-xs w-64 animate-fade-in"
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

      {/* HERO SECTION */}
      <section className="w-full bg-white py-20 px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
            Learn. Build. Conquer. 🚀
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            At <span className="font-semibold text-blue-700">Code & Run</span>,
            we transform beginners into confident coders. Start your journey
            from zero to pro with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/courses"
              className="bg-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-blue-800 transition"
            >
              Explore Courses
            </a>
            <a
              href="/results"
              className="bg-white border border-blue-700 text-blue-700 px-6 py-3 rounded-full font-semibold shadow-md hover:bg-blue-50 transition"
            >
              View Results & Certificates
            </a>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="w-full bg-[#F7FAFC] py-16 px-6 sm:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Why Code & Run?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-xl font-semibold text-blue-700 mb-2">
                Beginner Friendly
              </h3>
              <p className="text-gray-600">
                No prior experience? No problem. Our courses are designed for
                complete beginners.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-700 mb-2">
                Live Results & Certification
              </h3>
              <p className="text-gray-600">
                Track your progress and download certificates directly from your
                dashboard.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-700 mb-2">
                Real Community
              </h3>
              <p className="text-gray-600">
                Learn alongside peers and get mentorship to accelerate your
                growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION SECTION */}
      <section className="w-full bg-blue-700 text-white py-16 px-6 sm:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to start your journey?
          </h2>
          <p className="text-lg mb-8">
            Join Code & Run and unlock a new future in tech — one line of code
            at a time.
          </p>
          <a
            href="/courses"
            className="bg-white text-blue-700 px-6 py-3 rounded-full font-semibold shadow hover:bg-gray-100 transition"
          >
            Get Started Now
          </a>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
