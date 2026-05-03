"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { FaLeaf, FaTree, FaTrophy, FaFire, FaPlus, FaCheckCircle } from "react-icons/fa";
import StarBackground from "@/components/ui/StarBackground";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayCompleted, setTodayCompleted] = useState(0);

  useEffect(() => {
    fetchHabits();
  }, []);

  async function fetchHabits() {
    try {
      const res = await fetch("/api/habits");
      const data = await res.json();
      if (data.habits) {
        setHabits(data.habits);
        const now = new Date();
        const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split("T")[0];
        setTodayCompleted(
          data.habits.filter((h) => h.completedDates?.includes(today)).length
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleHabit(id) {
    try {
      const res = await fetch(`/api/habits/${id}`, { method: "PATCH" });
      const data = await res.json();
      if (data.habit) {
        setHabits((prev) =>
          prev.map((h) => (h._id === id ? data.habit : h))
        );
        const now = new Date();
        const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split("T")[0];
        setTodayCompleted(
          habits
            .map((h) => (h._id === id ? data.habit : h))
            .filter((h) => h.completedDates?.includes(today)).length
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  const now = new Date();
  const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split("T")[0];
  const totalStreak = habits.reduce((sum, h) => sum + (h.streak || 0), 0);
  const completionRate =
    habits.length > 0 ? Math.round((todayCompleted / habits.length) * 100) : 0;

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12 ? "সুপ্রভাত" : greetingHour < 17 ? "শুভ বিকেল" : "শুভ সন্ধ্যা";

  return (
    <div className="min-h-screen relative">
      <StarBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-black">
            {greeting},{" "}
            <span className="glow-text" style={{ color: "#00ff88" }}>
              {session?.user?.name?.split(" ")[0]} 👋
            </span>
          </h1>
          <p className="text-gray-400 mt-1">
            {todayCompleted === habits.length && habits.length > 0
              ? "🎉 আজকের সব habit complete! দারুণ!"
              : `আজকে ${habits.length - todayCompleted}টি habit বাকি আছে`}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            {
              icon: <FaLeaf className="text-2xl" />,
              label: "আজকের Progress",
              value: `${todayCompleted}/${habits.length}`,
              color: "#00ff88",
              bg: "rgba(0,255,136,0.08)",
            },
            {
              icon: <FaFire className="text-2xl" />,
              label: "Total Streak",
              value: `${totalStreak} 🔥`,
              color: "#ff6b35",
              bg: "rgba(255,107,53,0.08)",
            },
            {
              icon: <FaTree className="text-2xl" />,
              label: "Habits Active",
              value: habits.length,
              color: "#4caf7d",
              bg: "rgba(76,175,125,0.08)",
            },
            {
              icon: <FaTrophy className="text-2xl" />,
              label: "Completion",
              value: `${completionRate}%`,
              color: "#ffd700",
              bg: "rgba(255,215,0,0.08)",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              whileHover={{ scale: 1.03 }}
              className="rounded-2xl p-5"
              style={{ background: stat.bg, border: `1px solid ${stat.color}30` }}
            >
              <div style={{ color: stat.color }}>{stat.icon}</div>
              <div
                className="text-2xl font-black mt-2"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Today's Habits */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black">আজকের Habits</h2>
              <Link href="/habits">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  id="add-habit-btn"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
                  style={{
                    background: "linear-gradient(135deg, #00ff88, #00cc66)",
                    color: "#0a1628",
                  }}
                >
                  <FaPlus /> নতুন Habit
                </motion.button>
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl animate-bounce">🌱</div>
                <p className="mt-2">Loading...</p>
              </div>
            ) : habits.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 rounded-2xl"
                style={{
                  background: "rgba(0,255,136,0.04)",
                  border: "2px dashed rgba(0,255,136,0.2)",
                }}
              >
                <div className="text-5xl mb-4">🌱</div>
                <p className="text-gray-300 font-bold mb-2">এখনো কোনো Habit নেই!</p>
                <p className="text-gray-500 text-sm mb-6">
                  প্রথম habit যোগ করো এবং তোমার forest শুরু করো
                </p>
                <Link href="/habits">
                  <button className="btn-primary px-6 py-2 text-sm">
                    🌱 প্রথম Habit যোগ করো
                  </button>
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {habits.map((habit, i) => {
                  const done = habit.completedDates?.includes(today);
                  return (
                    <motion.div
                      key={habit._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200"
                      style={{
                        background: done
                          ? "rgba(0,255,136,0.08)"
                          : "rgba(255,255,255,0.04)",
                        border: done
                          ? "1px solid rgba(0,255,136,0.3)"
                          : "1px solid rgba(255,255,255,0.08)",
                      }}
                      onClick={() => toggleHabit(habit._id)}
                    >
                      <div className="text-3xl">{habit.treeType || "🌱"}</div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-bold truncate"
                          style={{
                            textDecoration: done ? "line-through" : "none",
                            color: done ? "rgba(255,255,255,0.5)" : "white",
                          }}
                        >
                          {habit.name}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-orange-400 font-semibold">
                            🔥 {habit.streak || 0} day streak
                          </span>
                          {habit.description && (
                            <span className="text-xs text-gray-500 truncate">
                              {habit.description}
                            </span>
                          )}
                        </div>
                      </div>
                      <motion.div
                        animate={{ scale: done ? [1, 1.3, 1] : 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FaCheckCircle
                          className="text-2xl flex-shrink-0"
                          style={{
                            color: done ? "#00ff88" : "rgba(255,255,255,0.15)",
                          }}
                        />
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Forest Preview */}
          <div>
            <h2 className="text-xl font-black mb-4">তোমার Forest 🌲</h2>
            <div
              className="rounded-2xl p-6 text-center"
              style={{
                background: "linear-gradient(135deg, rgba(26,71,49,0.5), rgba(10,22,40,0.8))",
                border: "1px solid rgba(0,255,136,0.15)",
                minHeight: "200px",
              }}
            >
              {habits.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-8">
                  <p className="text-gray-500 text-sm">Forest এ কোনো গাছ নেই</p>
                  <p className="text-gray-600 text-xs mt-1">
                    Habit যোগ করলে গাছ জন্মাবে!
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {habits.slice(0, 12).map((habit, i) => (
                      <motion.span
                        key={habit._id}
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                        className="text-2xl"
                      >
                        {habit.treeType || "🌱"}
                      </motion.span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">{habits.length}টি গাছ আছে</p>
                  <Link href="/forest">
                    <button className="mt-3 text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                      style={{ color: "#00ff88", border: "1px solid rgba(0,255,136,0.3)" }}
                    >
                      Full Forest দেখো →
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
