import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import ScrollProgress from "@/components/landing/ScrollProgress";
import Hero from "@/components/landing/Hero";
import LogoMarquee from "@/components/landing/LogoMarquee";
import Services from "@/components/landing/Services";
import Stats from "@/components/landing/Stats";
import DeploymentMethods from "@/components/landing/DeploymentMethods";
import HowItWorks from "@/components/landing/HowItWorks";
import Platforms from "@/components/landing/Platforms";
import Analytics from "@/components/landing/Analytics";
import CTA from "@/components/landing/CTA";
import ContactForm from "@/components/landing/ContactForm";
import Footer from "@/components/landing/Footer";
import FloatingActions from "@/components/landing/FloatingActions";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    // wait for sections to mount
    const t = setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }, 80);
    return () => clearTimeout(t);
  }, [location.hash, location.key]);

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <LogoMarquee />
        <Stats />
        <DeploymentMethods />
        <Services />
        <HowItWorks />
        <Platforms />
        <Analytics />
        <ContactForm />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
};

export default Index;
