'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <div className="relative z-10 text-center px-4">
      {/* Logo */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="text-8xl mb-6"
      >
        🌳
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-6xl font-black mb-4 glow-text"
        style={{ color: '#00ff88' }}
      >
        HabitForest
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="text-xl text-gray-300 mb-12 max-w-lg mx-auto"
      >
        Habit গড়ো, গাছ লাগাও, Forest বানাও! 🌿
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link href="/register">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-2xl font-bold text-lg text-black"
            style={{ background: 'linear-gradient(135deg, #00ff88, #00cc66)' }}
          >
            শুরু করো 🌱
          </motion.button>
        </Link>
        <Link href="/login">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-2xl font-bold text-lg"
            style={{ border: '2px solid #00ff88', color: '#00ff88' }}
          >
            Login করো 🌿
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
