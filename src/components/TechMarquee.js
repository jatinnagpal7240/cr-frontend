"use client";
import React from "react";
import Image from "next/image";

const logos = ["python-logo.png", "favicon.png"];

const TechMarquee = () => {
  return (
    <div className="overflow-hidden relative w-full bg-gray-50 py-6">
      <div className="animate-marquee flex w-max space-x-16">
        {[...logos, ...logos].map((logo, index) => (
          <div
            key={index}
            className="w-20 h-20 flex items-center justify-center animate-spin-slow"
          >
            <Image
              src={`/logos/${logo}`}
              alt={logo.replace(".png", "")}
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechMarquee;
