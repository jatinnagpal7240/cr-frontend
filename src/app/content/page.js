"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [showShadow, setShowShadow] = useState(false);
  const [activeSection, setActiveSection] = useState(
    "Ongoing Certificate Courses"
  );

  useEffect(() => {
    setIsClient(true);

    const handleScroll = () => {
      setShowShadow(window.scrollY > 1);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-[Open_Sans]">
      {/* Full-width Fixed Navbar */}
      <header
        className={`fixed top-0 left-0 w-full flex items-center justify-between p-4 bg-white z-50 transition-shadow duration-300 ${
          showShadow ? "shadow-md" : "shadow-none"
        }`}
      >
        {/* Logo */}
        {isClient && (
          <Image
            src="/logo.png"
            alt="Code and Run Logo"
            width={150}
            height={50}
            priority
          />
        )}

        {/* Login & Signup Buttons */}
        <div className="flex space-x-4 mr-12">
          <button className="relative px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 overflow-hidden group">
            <span className="absolute inset-0 bg-blue-700 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">
              Login
            </span>
          </button>

          <Link href="/signup">
            <button className="relative px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 overflow-hidden group">
              <span className="absolute inset-0 bg-green-700 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                Signup
              </span>
            </button>
          </Link>
        </div>
      </header>

      {/* Spacer to Prevent Content Shift */}
      <div className="pt-[80px]"></div>

      {/* Sidebar & Main Content Container */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white h-screen p-0 border-r border-gray-200 fixed top-[80px]">
          <ul className="mt-12 space-y-0">
            {["Ongoing Certificate Courses", "Upcoming Courses"].map(
              (section) => (
                <li key={section}>
                  <button
                    className={`block w-full text-left px-4 py-2 transition-all ${
                      activeSection === section
                        ? "bg-blue-400 rounded-r-full rounded-l-none"
                        : "bg-white"
                    }`}
                    onClick={() => setActiveSection(section)}
                  >
                    {section}
                  </button>
                </li>
              )
            )}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 ml-64">
          {/* Active Certificate Courses (Only Python@100) */}
          {activeSection === "Ongoing Certificate Courses" && (
            <div className="grid grid-cols-3 gap-6 px-6">
              <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 p-6 flex flex-col items-center text-center">
                <Image
                  src="/images-removebg-preview (1).png"
                  alt="Python@100"
                  className="w-20 h-20 object-contain"
                  width="200"
                  height="200"
                />
                <h3 className="text-lg font-semibold text-gray-900 mt-4">
                  Code & Run Python@100
                </h3>
                <p className="text-gray-600 text-base mt-2 text-left">
                  Earn a professional certificate in Python with this
                  fundamental program.
                </p>
                <a
                  href="#"
                  className="text-blue-600 font-medium mt-3 inline-flex items-center hover:underline"
                >
                  Learn More
                  <span className="ml-1">→</span>
                </a>
              </div>
            </div>
          )}

          {/* Courses Section (All Other Courses) */}
          {activeSection === "Upcoming Courses" && (
            <div className="grid grid-cols-3 gap-6 px-6">
              {[
                {
                  img: "/css-logo.png",
                  title: "Code & Run CSS Mastery",
                  desc: "Master modern CSS techniques and build responsive web designs.",
                },
                {
                  img: "/favicon-1-removebg-preview.png",
                  title: "Code & Run NumPy Essentials",
                  desc: "Learn the core of numerical computing with Python and NumPy.",
                },
                {
                  img: "/html-logo.png",
                  title: "Code & Run HTML Basics",
                  desc: "Understand the foundation of web development with HTML.",
                },
                {
                  img: "/javascript-logo.png",
                  title: "Code & Run JavaScript",
                  desc: "Learn JavaScript from scratch and build interactive web apps.",
                },
                {
                  img: "/react-native-logo.png",
                  title: "Code & Run React Native",
                  desc: "Develop mobile apps with React Native and Expo.",
                },
                {
                  img: "/react-logo.png",
                  title: "Code & Run React",
                  desc: "Master React.js and build scalable web applications.",
                },
                {
                  img: "/mongodb-logo.png",
                  title: "Code & Run MongoDB",
                  desc: "Learn NoSQL database management with MongoDB.",
                },
                {
                  img: "/nextjs-logo.png",
                  title: "Code & Run Next.js",
                  desc: "Build high-performance web apps using Next.js framework.",
                },
              ].map((course, index) => (
                <div
                  key={index}
                  className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 p-6 flex flex-col items-center text-center"
                >
                  <Image
                    src={course.img}
                    alt={course.title}
                    className="w-20 h-20 object-contain"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 mt-4">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-base mt-2 text-left">
                    {course.desc}
                  </p>
                  <a
                    href="#"
                    className="text-blue-600 font-medium mt-3 inline-flex items-center hover:underline"
                  >
                    Learn More
                    <span className="ml-1">→</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
