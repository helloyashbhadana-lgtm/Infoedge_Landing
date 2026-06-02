import Navbar from "../../components/layout/Navbar";
import HeroV4 from "../../components/sections/hero/HeroV4";
import OurBusiness from "../../components/sections/OurBusiness";
import BuiltOnPurpose from "../../components/sections/BuiltOnPurpose";
import AiCore from "../../components/sections/AiCore";
import BackingInnovation from "../../components/sections/BackingInnovation";
import InvestorRelations from "../../components/sections/InvestorRelations";
import Footer from "../../components/layout/Footer";

export default function HomeV4() {
  return (
    <>
      <Navbar />
      <main className="overflow-x-clip">
        <HeroV4 />
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
