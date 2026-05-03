"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import StarBackground from "@/components/ui/StarBackground";

const TREE_STAGES = [
  { min: 0, tree: "🌱", label: "Seedling", color: "#90EE90" },
  { min: 3, tree: "🌿", label: "Sprout", color: "#4caf7d" },
  { min: 7, tree: "🌲", label: "Young Tree", color: "#2d7a4f" },
  { min: 14, tree: "🌳", label: "Tree", color: "#1a6b3a" },
  { min: 30, tree: "🌴", label: "Tall Tree", color: "#00cc66" },
  { min: 60, tree: "🎋", label: "Bamboo Forest", color: "#00ff88" },
];

function getStage(streak) {
  for (let i = TREE_STAGES.length - 1; i >= 0; i--) {
    if (streak >= TREE_STAGES[i].min) return TREE_STAGES[i];
  }
  return TREE_STAGES[0];
}

export default function ForestPage() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTree, setSelectedTree] = useState(null);

  useEffect(() => {
    async function fetchHabits() {
      try {
        const res = await fetch("/api/habits");
        const data = await res.json();
        if (data.habits) setHabits(data.habits);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchHabits();
  }, []);

  const totalStreak = habits.reduce((sum, h) => sum + (h.streak || 0), 0);
  const totalCompleted = habits.reduce(
    (sum, h) => sum + (h.completedDates?.length || 0),
    0
  );
  const forestLevel = Math.floor(totalStreak / 10) + 1;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarBackground />

      {/* Sky gradient overlay */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(10,40,24,0.6) 70%, rgba(10,40,24,0.9) 100%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-black glow-text mb-2" style={{ color: "#00ff88" }}>
            আমার Forest 🌳
          </h1>
          <p className="text-gray-400">
            প্রতিটি habit একটি গাছ। Streak বাড়লে গাছ বড় হয়!
          </p>
        </motion.div>

        {/* Forest Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-10"
        >
          {[
            { label: "Forest Level", value: `⭐ ${forestLevel}`, color: "#ffd700" },
            { label: "মোট গাছ", value: `🌲 ${habits.length}`, color: "#00ff88" },
            { label: "মোট দিন", value: `📅 ${totalCompleted}`, color: "#87ceeb" },
          ].map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="rounded-2xl p-4 text-center"
              style={{
                background: `${s.color}10`,
                border: `1px solid ${s.color}30`,
              }}
            >
              <div className="text-2xl font-black" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-6xl animate-bounce">🌱</div>
            <p className="text-gray-500 mt-3">Forest load হচ্ছে...</p>
          </div>
        ) : habits.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 rounded-3xl"
            style={{
              background: "rgba(0,255,136,0.03)",
              border: "2px dashed rgba(0,255,136,0.15)",
            }}
          >
            <div className="text-7xl mb-4">🏜️</div>
            <h2 className="text-xl font-bold text-gray-300 mb-2">Forest এখনো খালি!</h2>
            <p className="text-gray-500 mb-6">
              Habits page এ গিয়ে habit যোগ করলে এখানে গাছ জন্মাবে।
            </p>
            <a href="/habits" className="btn-primary px-6 py-3 inline-block">
              🌱 Habits যোগ করো
            </a>
          </motion.div>
        ) : (
          <>
            {/* Forest Grid */}
            <div
              className="rounded-3xl p-8 mb-8 relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(26,71,49,0.6) 0%, rgba(10,22,40,0.8) 100%)",
                border: "1px solid rgba(0,255,136,0.15)",
                minHeight: "300px",
              }}
            >
              {/* Ground */}
              <div
                className="absolute bottom-0 left-0 right-0 h-16 rounded-b-3xl"
                style={{
                  background: "linear-gradient(180deg, transparent, rgba(26,71,49,0.8))",
                }}
              />

              <div className="flex flex-wrap justify-center gap-6 items-end">
                {habits.map((habit, i) => {
                  const stage = getStage(habit.streak || 0);
                  const now = new Date();
                  const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split("T")[0];
                  const doneToday = habit.completedDates?.includes(today);

                  return (
                    <motion.div
                      key={habit._id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: i * 0.08,
                        type: "spring",
                        stiffness: 200,
                      }}
                      whileHover={{ scale: 1.15, y: -5 }}
                      onClick={() => setSelectedTree(selectedTree?._id === habit._id ? null : habit)}
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                          duration: 2.5 + i * 0.3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="text-5xl md:text-6xl relative"
                      >
                        {stage.tree}
                        {/* Glow if done today */}
                        {doneToday && (
                          <motion.div
                            animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-full"
                            style={{ background: `radial-gradient(circle, ${stage.color}40, transparent)` }}
                          />
                        )}
                      </motion.div>
                      <p className="text-xs text-gray-400 mt-1 max-w-[70px] text-center truncate">
                        {habit.name}
                      </p>
                      {(habit.streak || 0) > 0 && (
                        <span className="text-xs text-orange-400 font-bold">
                          🔥{habit.streak}
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Selected tree info */}
            {selectedTree && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-2xl p-5"
                style={{
                  background: "rgba(0,255,136,0.06)",
                  border: "1px solid rgba(0,255,136,0.2)",
                }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">
                    {getStage(selectedTree.streak || 0).tree}
                  </span>
                  <div>
                    <h3 className="font-black text-lg">{selectedTree.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {selectedTree.description || "কোনো বিবরণ নেই"}
                    </p>
                    <div className="flex gap-4 mt-2">
                      <span className="text-orange-400 text-sm font-bold">
                        🔥 {selectedTree.streak || 0} day streak
                      </span>
                      <span className="text-green-400 text-sm font-bold">
                        Stage: {getStage(selectedTree.streak || 0).label}
                      </span>
                      <span className="text-blue-400 text-sm">
                        📅 {selectedTree.completedDates?.length || 0} total days
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tree Evolution Guide */}
            <div>
              <h2 className="text-lg font-black mb-4 text-gray-300">
                🌱 গাছের বিকাশ
              </h2>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {TREE_STAGES.map((stage, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="rounded-2xl p-3 text-center"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div className="text-3xl mb-1">{stage.tree}</div>
                    <div className="text-xs font-bold" style={{ color: stage.color }}>
                      {stage.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {stage.min === 0 ? "শুরু" : `${stage.min}+ দিন`}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
