"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import { FaTrophy, FaMedal, FaTree, FaFire, FaStar } from "react-icons/fa";
import StarBackground from "@/components/ui/StarBackground";

const RANK_STYLES = [
  { bg: "linear-gradient(135deg, #ffd700, #ff8c00)", text: "#0a1628", icon: "🥇" },
  { bg: "linear-gradient(135deg, #c0c0c0, #a8a8a8)", text: "#0a1628", icon: "🥈" },
  { bg: "linear-gradient(135deg, #cd7f32, #a0522d)", text: "white", icon: "🥉" },
];

function getLevelLabel(xp = 0) {
  const level = Math.floor(Math.sqrt(xp / 100)) + 1;
  if (level >= 20) return { label: "Forest God 🌴", color: "#00ff88" };
  if (level >= 15) return { label: "Ancient Grove 🌳", color: "#4caf7d" };
  if (level >= 10) return { label: "Ranger 🌲", color: "#87ceeb" };
  if (level >= 5) return { label: "Gardener 🌿", color: "#ffd700" };
  return { label: "Seedling 🌱", color: "#aaa" };
}

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaders() {
      try {
        const res = await fetch("/api/leaderboard");
        const data = await res.json();
        if (data.leaders) setLeaders(data.leaders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaders();
  }, []);

  return (
    <div className="min-h-screen relative">
      <StarBackground />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="text-5xl mb-3">🏆</div>
          <h1 className="text-4xl font-black glow-text" style={{ color: "#ffd700" }}>
            Leaderboard
          </h1>
          <p className="text-gray-400 mt-2">সবচেয়ে বেশি XP অর্জনকারী Forest Keepers</p>
        </motion.div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-5xl animate-bounce">🏆</div>
            <p className="text-gray-500 mt-3">Loading...</p>
          </div>
        ) : leaders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 rounded-3xl"
            style={{
              background: "rgba(255,215,0,0.04)",
              border: "2px dashed rgba(255,215,0,0.15)",
            }}
          >
            <div className="text-6xl mb-4">🌱</div>
            <h2 className="text-xl font-bold text-gray-300 mb-2">
              এখনো কেউ নেই!
            </h2>
            <p className="text-gray-500">
              Habit complete করে XP অর্জন করো এবং Leaderboard এ আসো!
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {leaders.map((leader, i) => {
              const rank = i + 1;
              const rankStyle = RANK_STYLES[i];
              const { label: levelLabel, color: levelColor } = getLevelLabel(leader.xp);
              const level = Math.floor(Math.sqrt((leader.xp || 0) / 100)) + 1;
              const isMe = leader.userId === session?.user?.id;

              return (
                <motion.div
                  key={leader._id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-center gap-4 p-4 rounded-2xl relative overflow-hidden"
                  style={{
                    background: isMe
                      ? "rgba(0,255,136,0.08)"
                      : "rgba(255,255,255,0.04)",
                    border: isMe
                      ? "1px solid rgba(0,255,136,0.3)"
                      : "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  {/* Rank */}
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-black text-lg"
                    style={
                      rankStyle
                        ? { background: rankStyle.bg, color: rankStyle.text }
                        : { background: "rgba(255,255,255,0.1)", color: "white" }
                    }
                  >
                    {rankStyle ? rankStyle.icon : rank}
                  </div>

                  {/* Avatar */}
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm"
                    style={{
                      background: "linear-gradient(135deg, #00ff88, #00cc66)",
                      color: "#0a1628",
                    }}
                  >
                    {leader.displayName?.[0]?.toUpperCase() ||
                      leader.userId?.[0]?.toUpperCase() ||
                      "?"}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold truncate">
                        {leader.displayName || "Forest Keeper"}
                      </p>
                      {isMe && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{
                            background: "rgba(0,255,136,0.2)",
                            color: "#00ff88",
                          }}
                        >
                          তুমি
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: levelColor }}
                      >
                        {levelLabel}
                      </span>
                      <span className="text-xs text-gray-500">
                        Level {level}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex-shrink-0 text-right">
                    <div
                      className="font-black text-lg"
                      style={{ color: "#ffd700" }}
                    >
                      ⭐ {leader.xp || 0}
                    </div>
                    <div className="text-xs text-gray-500">XP</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-600 text-sm mt-8"
        >
          💡 Habit complete করলে 10 XP + streak bonus পাবে!
        </motion.p>
      </div>
    </div>
  );
}
