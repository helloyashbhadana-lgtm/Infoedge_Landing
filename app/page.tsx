import Navbar from "../components/layout/Navbar";
import Hero from "../components/sections/hero/HeroV1";
import Brands from "../components/sections/Brands";
import StockOverview from "../components/sections/StockOverview";
import WorkforceTrends from "../components/sections/WorkforceTrends";
import BuiltOnPurpose from "../components/sections/BuiltOnPurpose";
import AiCore from "../components/sections/AiCore";
import BackingInnovation from "../components/sections/BackingInnovation";
import InvestorRelations from "../components/sections/InvestorRelations";
import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar variant="light" />
      <main className="overflow-x-clip">
        <Hero />
        <Brands />
        <StockOverview />
        <WorkforceTrends />
        <BuiltOnPurpose />
        <AiCore />
        <BackingInnovation />
        <InvestorRelations />
      </main>
      <Footer />
    </>
  );
}
