"use client";

import { useEffect, useState } from "react";

type Props = {
  items: {
    content: string;
    name: string;
    company: string;
    image: string;
  }[];
};

export default function Testimonials({ items }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 12000);
    return () => clearInterval(interval);
  }, [items.length]);

  const navigate = (direction: string) => {
    setActiveIndex((prev) =>
      direction === "next"
        ? (prev + 1) % items.length
        : (prev - 1 + items.length) % items.length
    );
  };

  const current = items[activeIndex];

  return (
    <div className="w-full border-b border-border">
      <div className="px-2 pb-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 px-6 md:px-12">
          <img
            className="w-48 h-48 rounded-full object-cover transition-opacity duration-500"
            src={current.image}
            alt={current.name}
          />

          <div className="flex-1">
            <p className="text-lg sm:text-xl font-medium text-brand-primary-800 mb-6 leading-relaxed">
              "{current.content}"
            </p>
            <div>
              <p className="text-base sm:text-lg font-medium text-brand-primary-700">
                {current.name}
              </p>
              <p className="text-base sm:text-lg text-brand-primary-600">
                {current.company}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("prev")}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-brand-desert-50 transition-colors"
              aria-label="Previous testimonial"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="#46413E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={() => navigate("next")}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-brand-desert-50 transition-colors"
              aria-label="Next testimonial"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 18L15 12L9 6"
                  stroke="#46413E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
