"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import { FaGoogle, FaSeedling, FaEye, FaEyeSlash } from "react-icons/fa";
import StarBackground from "@/components/ui/StarBackground";
import FloatingTrees from "@/components/ui/FloatingTrees";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password কমপক্ষে 8 character হতে হবে।");
      return;
    }
    setLoading(true);
    try {
      const result = await signUp.email({
        name,
        email,
        password,
        callbackURL: "/dashboard",
      });
      if (result?.error) {
        setError("এই email দিয়ে আগেই account আছে।");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/dashboard"), 1500);
      }
    } catch {
      setError("Register করতে সমস্যা হয়েছে। আবার চেষ্টা করো।");
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
    <div className="min-h-screen flex items-center justify-center relative px-4 py-8">
      <StarBackground />
      <FloatingTrees />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
              className="text-5xl mb-3"
            >
              🌱
            </motion.div>
            <h1 className="text-3xl font-black glow-text" style={{ color: "#00ff88" }}>
              Forest শুরু করো!
            </h1>
            <p className="text-gray-400 mt-1">তোমার habit journey শুরু হোক</p>
          </div>

          {/* Success message */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-6 rounded-2xl mb-4"
                style={{ background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.3)" }}
              >
                <div className="text-4xl mb-2">🎉</div>
                <p className="text-green-400 font-bold">Account তৈরি হয়ে গেছে!</p>
                <p className="text-gray-400 text-sm">Dashboard এ যাচ্ছো...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {!success && (
            <>
              {/* Google Login */}
              <motion.button
                id="google-register-btn"
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
                <span>{googleLoading ? "Loading..." : "Google দিয়ে শুরু করো"}</span>
              </motion.button>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
                <span className="text-gray-500 text-sm">অথবা</span>
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
              </div>

              {/* Form */}
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5 font-semibold">তোমার নাম</label>
                  <input
                    id="register-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="নাম লেখো"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5 font-semibold">Email</label>
                  <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="তোমার email দাও"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5 font-semibold">
                    Password{" "}
                    <span className="text-gray-500 font-normal">(কমপক্ষে 8 character)</span>
                  </label>
                  <div className="relative">
                    <input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Strong password দাও"
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

                  {/* Password strength */}
                  {password.length > 0 && (
                    <div className="mt-2 flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 h-1 rounded-full transition-all duration-300"
                          style={{
                            background:
                              password.length > i * 3
                                ? password.length >= 12
                                  ? "#00ff88"
                                  : password.length >= 8
                                  ? "#ffd700"
                                  : "#ff6b6b"
                                : "rgba(255,255,255,0.1)",
                          }}
                        />
                      ))}
                    </div>
                  )}
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
                  id="register-submit-btn"
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
                      <FaSeedling />
                      Forest শুরু করো!
                    </>
                  )}
                </motion.button>
              </form>
            </>
          )}

          {/* Login link */}
          <p className="text-center text-gray-400 mt-6 text-sm">
            Account আছে?{" "}
            <Link
              href="/login"
              className="font-bold transition-colors hover:opacity-80"
              style={{ color: "#00ff88" }}
            >
              Login করো 🌿
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
