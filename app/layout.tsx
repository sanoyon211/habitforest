import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "HabitForest — Grow Your Habits, Grow Your Forest 🌳",
  description:
    "Track your daily habits and watch your personal forest grow! Complete habits to plant trees, compete on the leaderboard, and get AI-powered insights.",
  keywords: ["habit tracker", "forest", "productivity", "AI", "goals"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={nunito.variable}>
      <body className="min-h-screen bg-forest-dark text-white font-nunito antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
