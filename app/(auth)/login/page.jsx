"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { FaGoogle, FaLeaf, FaEye, FaEyeSlash } from "react-icons/fa";
import StarBackground from "@/components/ui/StarBackground";
import FloatingTrees from "@/components/ui/FloatingTrees";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleEmailLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
      });
      if (result?.error) {
        setError("Email অথবা Password ভুল হয়েছে।");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Login করতে সমস্যা হয়েছে। আবার চেষ্টা করো।");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch {
      setError("Google Login এ সমস্যা হয়েছে।");
      setGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4">
      <StarBackground />
      <FloatingTrees />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card */}
        <div className="glass rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
              className="text-5xl mb-3"
            >
              🌳
            </motion.div>
            <h1 className="text-3xl font-black glow-text" style={{ color: "#00ff88" }}>
              স্বাগতম!
            </h1>
            <p className="text-gray-400 mt-1">তোমার Forest এ ফিরে যাও</p>
          </div>

          {/* Google Login */}
          <motion.button
            id="google-login-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl font-bold mb-6 transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            {googleLoading ? (
              <span className="animate-spin text-xl">⏳</span>
            ) : (
              <FaGoogle className="text-xl" style={{ color: "#ea4335" }} />
            )}
            <span>{googleLoading ? "Loading..." : "Google দিয়ে Login করো"}</span>
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
            <span className="text-gray-500 text-sm">অথবা</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5 font-semibold">Email</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="তোমার email দাও"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5 font-semibold">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="তোমার password দাও"
                  className="input-field pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3"
                >
                  ⚠️ {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              id="login-submit-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl font-bold text-black text-lg mt-2 transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                background: loading
                  ? "rgba(0,255,136,0.4)"
                  : "linear-gradient(135deg, #00ff88, #00cc66)",
              }}
            >
              {loading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <>
                  <FaLeaf />
                  Login করো
                </>
              )}
            </motion.button>
          </form>

          {/* Register link */}
          <p className="text-center text-gray-400 mt-6 text-sm">
            Account নেই?{" "}
            <Link
              href="/register"
              className="font-bold transition-colors hover:opacity-80"
              style={{ color: "#00ff88" }}
            >
              Register করো 🌱
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
