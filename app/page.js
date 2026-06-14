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
import ParticleBackground from "@/components/ParticleBackground";

export default function Home() {
  return (
    <>
      <Preloader />
      <ParticleBackground />
      <NoiseOverlay />
      <ScrollIndicator />
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <VelocityMarquee text="BUILDING THINGS THAT ARE FUN TO BREAK APART • " />
        <HorizontalGallery />
        <About />
      </main>
      <Footer />
    </>
  );
}
