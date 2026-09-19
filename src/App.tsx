import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { NetworkMap } from "./components/NetworkMap";
import { Problem } from "./components/Problem";
import { HowItWorks } from "./components/how/HowItWorks";
import { TwoAgents } from "./components/TwoAgents";
import { NegotiationDemo } from "./components/NegotiationDemo";
import { HumanApproval } from "./components/HumanApproval";
import { ProtectedPayment } from "./components/ProtectedPayment";
import { Performance } from "./components/Performance";
import { Reputation } from "./components/Reputation";
import { Flywheel } from "./components/Flywheel";
import { Activity } from "./components/Activity";
import { Platform } from "./components/Platform";
import { Vision } from "./components/Vision";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <main id="main-content">
        <Hero />
        <NetworkMap />
        <Problem />
        <HowItWorks />
        <TwoAgents />
        <NegotiationDemo />
        <HumanApproval />
        <ProtectedPayment />
        <Performance />
        <Reputation />
        <Flywheel />
        <Activity />
        <Platform />
        <Vision />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
