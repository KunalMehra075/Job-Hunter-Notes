import { useEffect } from "react";
import LandingNav from "./LandingNav";
import Hero from "./Hero";
import PainPoints from "./PainPoints";
import Comparison from "./Comparison";
import UseCases from "./UseCases";
import FAQ from "./FAQ";
import FinalCTA from "./FinalCTA";
import Footer from "./Footer";
import MobileStickyCTA from "./MobileStickyCTA";

const LandingPage = () => {
  useEffect(() => {
    document.title =
      "ReuseNotes - Create Reusable Notes & Templates With Smart Variables";
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F8FAFC] text-slate-900">
      <LandingNav />
      <main>
        <Hero />
        <PainPoints />
        <Comparison />
        <UseCases />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      {/* Spacer so the sticky mobile CTA never covers footer content */}
      <div className="h-20 sm:hidden" aria-hidden />
      <MobileStickyCTA />
    </div>
  );
};

export default LandingPage;
