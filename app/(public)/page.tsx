import HeroSection from "@/components/home/hero-section";
import FeaturesGridSection from "@/components/home/features-grid-section";
import OptionalKPISection from "@/components/home/optional-kpi-section";
import BlobsBackground from "@/components/home/blobs-backgrounds";
import SectionDivider from "@/components/home/section-divider";
import Footer from "@/components/home/footer";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <HeroSection />
      <SectionDivider />
      <FeaturesGridSection />
      <SectionDivider />
      <OptionalKPISection />
      <SectionDivider />
      <Footer />
      <BlobsBackground />
    </div>
  );
}

// TODO: Filter by Date
// TODO: CRUD
