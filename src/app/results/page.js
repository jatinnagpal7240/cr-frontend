"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/DashboardNavbar";

export default function ResultsCertificatesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const verifySessionAndFetchCertificates = async () => {
      try {
        const sessionRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/session/verify`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!sessionRes.ok) {
          router.push("/login");
          return;
        }

        const sessionData = await sessionRes.json();
        setUser(sessionData.user);

        const certRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/certificates/my`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!certRes.ok) throw new Error("Failed to fetch certificates");

        const certData = await certRes.json();
        const formatted = (certData.certificates || []).map((cert) => ({
          ...cert,
          formattedDate: new Date(cert.uploadedAt).toLocaleDateString("en-GB", {
            month: "long",
            year: "numeric",
          }),
        }));

        setCertificates(formatted);
      } catch (error) {
        console.error("Session or Certificate fetch failed:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    verifySessionAndFetchCertificates();

    const handleStorageChange = (event) => {
      if (event.key === "logoutEvent") {
        router.push("/login");
      }
    };

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

    window.addEventListener("storage", handleStorageChange);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen, showTooltip, router]);

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

  return (
    <div className="min-h-screen bg-white text-gray-900">
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

      {/* Header */}
      <header className="text-center py-20 px-6 bg-gradient-to-br from-gray-50 to-white">
        <h1 className="text-5xl font-semibold tracking-tight text-gray-800">
          Your Achievements
        </h1>
        <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto">
          Professionally designed certificates that recognize your journey of
          learning.
        </p>
      </header>

      {/* Certificate Section */}
      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {loading ? (
          <p className="text-center text-gray-400 text-lg">
            Loading certificates...
          </p>
        ) : certificates.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">
            No certificates yet. They&apos;ll appear here when ready.
          </p>
        ) : (
          certificates.map((cert, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-medium text-gray-800">
                    {cert.course}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Issued • {cert.formattedDate}
                  </p>
                </div>
                <a
                  href={cert.certificateUrl}
                  className="px-5 py-2 text-sm rounded-full bg-blue-700 text-white hover:bg-blue-800 transition font-medium"
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Certificate
                </a>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
