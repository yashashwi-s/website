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
        <About />
      </main>
      <Footer />
    </>
  );
}
