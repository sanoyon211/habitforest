"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaFire, FaCheckCircle, FaTimes } from "react-icons/fa";
import StarBackground from "@/components/ui/StarBackground";

const ICONS = ["🌱", "💪", "📚", "🏃", "🧘", "💧", "🥗", "😴", "🎯", "✍️", "🎵", "🌞"];
const COLORS = [
  "#00ff88", "#4caf7d", "#ffd700", "#ff6b35",
  "#87ceeb", "#ff69b4", "#9b59b6", "#3498db",
];

export default function HabitsPage() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    icon: "🌱",
    color: "#00ff88",
    frequency: "daily",
  });

  const now = new Date();
  const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split("T")[0];

  useEffect(() => {
    fetchHabits();
  }, []);

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

  async function createHabit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.habit) {
        setHabits((prev) => [data.habit, ...prev]);
        setForm({ name: "", description: "", icon: "🌱", color: "#00ff88", frequency: "daily" });
        setShowModal(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function toggleHabit(id) {
    try {
      const res = await fetch(`/api/habits/${id}`, { method: "PATCH" });
      const data = await res.json();
      if (data.habit) {
        setHabits((prev) => prev.map((h) => (h._id === id ? data.habit : h)));
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteHabit(id) {
    try {
      await fetch(`/api/habits/${id}`, { method: "DELETE" });
      setHabits((prev) => prev.filter((h) => h._id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen relative">
      <StarBackground />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-black">আমার Habits 🌿</h1>
            <p className="text-gray-400 mt-1">
              {habits.length}টি habit track হচ্ছে
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            id="open-add-habit-modal"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-black"
            style={{ background: "linear-gradient(135deg, #00ff88, #00cc66)" }}
          >
            <FaPlus /> নতুন Habit
          </motion.button>
        </motion.div>

        {/* Habit List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-5xl animate-bounce">🌱</div>
            <p className="text-gray-500 mt-3">Loading...</p>
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
            <div className="text-6xl mb-4">🌱</div>
            <h2 className="text-xl font-bold text-gray-300 mb-2">
              এখনো কোনো Habit নেই!
            </h2>
            <p className="text-gray-500 mb-6 max-w-xs mx-auto">
              একটা habit যোগ করো এবং প্রতিদিন complete করলে গাছ grow করবে!
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary px-6 py-3"
            >
              🌱 প্রথম Habit যোগ করো
            </button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            <AnimatePresence>
              {habits.map((habit, i) => {
                const done = habit.completedDates?.includes(today);
                return (
                  <motion.div
                    key={habit._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="rounded-2xl p-5 relative group"
                    style={{
                      background: done
                        ? `${habit.color || "#00ff88"}12`
                        : "rgba(255,255,255,0.04)",
                      border: `1px solid ${done ? habit.color + "40" : "rgba(255,255,255,0.08)"}`,
                    }}
                  >
                    {/* Delete button */}
                    <button
                      onClick={() => deleteHabit(habit._id)}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all text-sm"
                    >
                      <FaTrash />
                    </button>

                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{habit.treeType || habit.icon || "🌱"}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-lg truncate">{habit.name}</h3>
                        {habit.description && (
                          <p className="text-gray-400 text-sm mt-0.5 line-clamp-2">
                            {habit.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-sm text-orange-400 font-bold">
                            🔥 {habit.streak || 0} day streak
                          </span>
                          <span className="text-xs text-gray-500">
                            Best: {habit.longestStreak || 0}
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-3 h-1.5 rounded-full overflow-hidden"
                          style={{ background: "rgba(255,255,255,0.08)" }}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.min(
                                ((habit.completedDates?.length || 0) /
                                  (habit.targetDays || 66)) * 100,
                                100
                              )}%`,
                            }}
                            transition={{ duration: 0.8, delay: i * 0.05 }}
                            className="h-full rounded-full"
                            style={{
                              background: `linear-gradient(90deg, ${habit.color || "#00ff88"}, ${habit.color || "#00cc66"})`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {habit.completedDates?.length || 0}/{habit.targetDays || 66} দিন
                        </p>
                      </div>

                      {/* Complete button */}
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => toggleHabit(habit._id)}
                        className="flex-shrink-0 mt-1"
                      >
                        <FaCheckCircle
                          className="text-3xl transition-colors"
                          style={{ color: done ? "#00ff88" : "rgba(255,255,255,0.15)" }}
                        />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Add Habit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-md rounded-3xl p-6"
              style={{
                background: "rgba(10,22,40,0.97)",
                border: "1px solid rgba(0,255,136,0.2)",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black glow-text" style={{ color: "#00ff88" }}>
                  নতুন Habit যোগ করো 🌱
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors text-xl"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={createHabit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5 font-semibold">
                    Habit এর নাম *
                  </label>
                  <input
                    id="habit-name-input"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="যেমন: প্রতিদিন ব্যায়াম করা"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5 font-semibold">
                    বিস্তারিত (optional)
                  </label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="সংক্ষেপে লেখো..."
                    className="input-field"
                  />
                </div>

                {/* Icon picker */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2 font-semibold">Icon বেছে নাও</label>
                  <div className="flex flex-wrap gap-2">
                    {ICONS.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setForm({ ...form, icon })}
                        className="w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all"
                        style={{
                          background:
                            form.icon === icon
                              ? "rgba(0,255,136,0.2)"
                              : "rgba(255,255,255,0.05)",
                          border:
                            form.icon === icon
                              ? "2px solid #00ff88"
                              : "2px solid transparent",
                        }}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color picker */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2 font-semibold">Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setForm({ ...form, color })}
                        className="w-8 h-8 rounded-full transition-all"
                        style={{
                          background: color,
                          transform: form.color === color ? "scale(1.3)" : "scale(1)",
                          boxShadow:
                            form.color === color ? `0 0 12px ${color}` : "none",
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 rounded-2xl font-bold btn-outline"
                  >
                    বাতিল
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={saving}
                    id="save-habit-btn"
                    className="flex-1 py-3 rounded-2xl font-bold text-black"
                    style={{
                      background: saving
                        ? "rgba(0,255,136,0.4)"
                        : "linear-gradient(135deg, #00ff88, #00cc66)",
                    }}
                  >
                    {saving ? "⏳ Saving..." : "🌱 যোগ করো"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
