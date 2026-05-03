'use client';
import { motion } from 'framer-motion';

const trees = ['🌲', '🌳', '🌴', '🌲', '🌳', '🌲', '🌴', '🌳'];

export default function FloatingTrees() {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-around text-6xl z-10 pointer-events-none">
      {trees.map((tree, i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        >
          {tree}
        </motion.span>
      ))}
    </div>
  );
}
