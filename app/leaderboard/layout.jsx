import Navbar from "@/components/ui/Navbar";

export default function LeaderboardLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen">{children}</main>
    </>
  );
}
