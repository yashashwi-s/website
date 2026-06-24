import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import ScrollIndicator from "@/components/ScrollIndicator";
import NoiseOverlay from "@/components/NoiseOverlay";
import HorizontalGallery from "@/components/HorizontalGallery";
import VelocityMarquee from "@/components/VelocityMarquee";
import ExperienceSection from "@/components/ExperienceSection";
import SkillsSection from "@/components/SkillsSection";
import AchievementsSection from "@/components/AchievementsSection";

export default function Home() {
  return (
    <>
      <Preloader />
      <NoiseOverlay />
      <ScrollIndicator />
      <CustomCursor />
      <Navbar />
      <main className="relative z-10 bg-[#050505]">
        <Hero />
        <VelocityMarquee text="BUILDING THINGS THAT ARE FUN TO BREAK APART • " />
        <HorizontalGallery />
        <ExperienceSection />
        <About />
        <SkillsSection />
        <AchievementsSection />
        <div className="h-[30vh] w-full bg-[#050505] relative z-10 border-t border-white/5 flex items-center justify-center">
          <div className="w-[1px] h-32 bg-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/3 bg-white animate-slide" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
