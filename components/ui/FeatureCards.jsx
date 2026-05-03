'use client';
import { motion } from 'framer-motion';
import { FaTree, FaLeaf, FaTrophy, FaBrain } from 'react-icons/fa';

const features = [
  { icon: <FaTree />, text: 'Forest Grow' },
  { icon: <FaLeaf />, text: 'Daily Habits' },
  { icon: <FaTrophy />, text: 'Leaderboard' },
  { icon: <FaBrain />, text: 'AI Insights' },
];

export default function FeatureCards() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.9 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
    >
      {features.map((item, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center gap-2 p-4 rounded-2xl"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(0,255,136,0.2)',
          }}
        >
          <span className="text-2xl" style={{ color: '#00ff88' }}>
            {item.icon}
          </span>
          <span className="text-sm text-gray-300">{item.text}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
