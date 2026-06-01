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
    <div className="relative min-h-screen overflow-x-hidden bg-[#F8FAFC] text-slate-900">
      {/* Top brand gradient — spans from the very top of the page, behind the navbar */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[760px] overflow-hidden"
      >
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#6D28FF]/25 blur-3xl rn-float" />
        <div
          className="absolute -top-12 right-0 h-80 w-80 rounded-full bg-[#3B82F6]/25 blur-3xl rn-float"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="absolute left-1/3 top-40 h-72 w-72 rounded-full bg-[#A78BFA]/20 blur-3xl" />
      </div>

      <div className="relative z-10">
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
      </div>
      <MobileStickyCTA />
    </div>
  );
};

export default LandingPage;
