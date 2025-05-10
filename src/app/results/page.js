"use client";

import { useEffect, useState } from "react";

export default function ResultsCertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/certificates/my`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("Failed to fetch certificates");

        const data = await res.json();
        console.log("CERTIFICATE API RESPONSE:", data); // 🔍 Add this line

        const formatted = (data.certificates || []).map((cert) => ({
          ...cert,
          formattedDate: new Date(cert.date).toLocaleDateString("en-GB", {
            month: "long",
            year: "numeric",
          }),
        }));

        setCertificates(formatted);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 shadow-sm border-b border-gray-200 bg-white">
        <div className="flex items-center gap-8">
          <img
            src="/logo1.png"
            alt="Logo"
            className="h-12 w-auto object-contain object-center transition-transform duration-300 hover:scale-105 drop-shadow-md"
          />
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
      </nav>

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
                  href={cert.downloadUrl}
                  className="px-5 py-2 text-sm rounded-full bg-blue-700 text-white hover:bg-blue-800 transition font-medium"
                  download
                >
                  Download Certificate
                </a>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
