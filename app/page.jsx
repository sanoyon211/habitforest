import StarBackground from '@/components/ui/StarBackground';
import FloatingTrees from '@/components/ui/FloatingTrees';
import FeatureCards from '@/components/ui/FeatureCards';
import HeroSection from '@/components/ui/HeroSection';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <StarBackground />
      <HeroSection />
      <FeatureCards />
      <FloatingTrees />
    </main>
  );
}
