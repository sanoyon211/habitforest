import Navbar from "@/components/ui/Navbar";

export default function ForestLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen">{children}</main>
    </>
  );
}
