"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import {
  FaTree,
  FaLeaf,
  FaTrophy,
  FaHome,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", icon: <FaHome />, label: "Dashboard" },
  { href: "/habits", icon: <FaLeaf />, label: "Habits" },
  { href: "/forest", icon: <FaTree />, label: "My Forest" },
  { href: "/leaderboard", icon: <FaTrophy />, label: "Leaderboard" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
        style={{
          background: "rgba(10,22,40,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,255,136,0.1)",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">🌳</span>
            <span className="font-black text-xl glow-text" style={{ color: "#00ff88" }}>
              HabitForest
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200"
                    style={{
                      background: active ? "rgba(0,255,136,0.15)" : "transparent",
                      color: active ? "#00ff88" : "rgba(255,255,255,0.6)",
                      border: active ? "1px solid rgba(0,255,136,0.3)" : "1px solid transparent",
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* User + Signout */}
          <div className="hidden md:flex items-center gap-3">
            {session?.user && (
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{ background: "linear-gradient(135deg, #00ff88, #00cc66)", color: "#0a1628" }}
                >
                  {session.user.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="text-sm text-gray-300 max-w-[100px] truncate">
                  {session.user.name}
                </span>
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignOut}
              id="signout-btn"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-red-400 transition-colors hover:bg-red-400/10"
            >
              <FaSignOutAlt />
              Logout
            </motion.button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white text-xl"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-[57px] left-0 right-0 z-40 p-4"
          style={{
            background: "rgba(10,22,40,0.97)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(0,255,136,0.1)",
          }}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
            >
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl mb-1 font-semibold"
                style={{
                  color: pathname === item.href ? "#00ff88" : "rgba(255,255,255,0.7)",
                  background:
                    pathname === item.href ? "rgba(0,255,136,0.1)" : "transparent",
                }}
              >
                {item.icon}
                {item.label}
              </div>
            </Link>
          ))}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 font-semibold w-full mt-2"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </motion.div>
      )}
    </>
  );
}
