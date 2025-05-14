"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import DashboardNavbar from "@/components/DashboardNavbar";
// import TechMarquee from "@/components/TechMarquee";

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

  // if (loading) {
  //   return (
  //     <p className="text-center pt-8 text-gray-500">
  //       Loading your dashboard...
  //     </p>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      {/* Reusable Dashboard Navbar */}
      <DashboardNavbar
        user={user}
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
        dropdownRef={dropdownRef}
        buttonRef={buttonRef}
        tooltipIconRef={tooltipIconRef}
        tooltipBoxRef={tooltipBoxRef}
        username={username}
        setUsername={setUsername}
        usernameStatus={usernameStatus}
        usernameSuccess={usernameSuccess}
        showTooltip={showTooltip}
        setShowTooltip={setShowTooltip}
        checkUsernameAvailability={checkUsernameAvailability}
        submitUsername={submitUsername}
        handleLogout={handleLogout}
      />

      {/* HERO SECTION */}
      <section className="w-full bg-white py-20 px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
            Learn. Build. Conquer. 🚀
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Welcome to your learning journey, {user?.name?.split(" ")[0]}!
          </p>
          {/* Additional dashboard content here */}
        </div>
      </section>

      {/* <TechMarquee /> */}
    </div>
  );
};

export default Dashboard;
