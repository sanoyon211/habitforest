import Navbar from "@/components/ui/Navbar";
import { redirect } from "next/navigation";

// Shared layout for habits, forest, leaderboard pages
export default function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen">{children}</main>
    </>
  );
}
