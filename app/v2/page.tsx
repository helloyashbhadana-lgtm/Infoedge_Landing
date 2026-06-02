import Navbar from "../../components/layout/Navbar";
import HeroV2 from "../../components/sections/hero/HeroV2";
import OurBusiness from "../../components/sections/OurBusiness";
import BuiltOnPurpose from "../../components/sections/BuiltOnPurpose";
import AiCore from "../../components/sections/AiCore";
import BackingInnovation from "../../components/sections/BackingInnovation";
import InvestorRelations from "../../components/sections/InvestorRelations";
import Footer from "../../components/layout/Footer";

export default function HomeV2() {
  return (
    <>
      <Navbar />
      <main className="overflow-x-clip">
        <HeroV2 />
        <OurBusiness />
        <BuiltOnPurpose />
        <AiCore />
        <BackingInnovation />
        <InvestorRelations />
      </main>
      <Footer />
    </>
  );
}
