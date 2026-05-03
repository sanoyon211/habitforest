'use client';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

export default function StarBackground() {
  const stars = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        width: ((i * 7.3) % 3) + 1,
        height: ((i * 5.1) % 3) + 1,
        left: (i * 13.7) % 100,
        top: (i * 11.3) % 60,
        opacity: ((i * 0.17) % 0.7) + 0.3,
        duration: ((i * 0.9) % 3) + 2,
        delay: (i * 0.4) % 3,
      })),
    [],
  );

  return (
    <div className="fixed inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0d2137] to-[#0a2818]" />
      {stars.map(star => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            width: star.width,
            height: star.height,
            left: `${star.left}%`,
            top: `${star.top}%`,
            opacity: star.opacity,
          }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
          }}
        />
      ))}
    </div>
  );
}
