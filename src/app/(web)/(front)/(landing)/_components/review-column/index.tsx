"use client";

import Phone from "@/components/phone";
import { motion, useAnimationFrame } from "motion/react";
import { useRef, useState } from "react";

export default function ReviewColumn({
  imgs,
  speed = 30,
}: {
  imgs: string[];
  speed: number;
}) {
  const [y, setY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useAnimationFrame((t, delta) => {
    if (!containerRef.current) return;

    const height = containerRef.current.scrollHeight / 2;
    setY((prev) => {
      const next = prev - (delta / 1000) * speed;
      return next <= -height ? 0 : next;
    });
  });

  return (
    <div className="overflow-hidden">
      <motion.div ref={containerRef} className="space-y-8 py-4" style={{ y }}>
        {[...imgs, ...imgs].map((img, i) => (
          <div key={i} className="rounded-3xl bg-secondary p-6 shadow-xl">
            <div className="relative mx-auto border-8 border-border rounded-[2.5rem] overflow-hidden w-64 h-[500px]">
              <Phone img={img} />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
