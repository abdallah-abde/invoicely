import HeroSection from "@/features/home/components/hero-section";
import FeaturesGridSection from "@/features/home/components/features-grid-section";
import OptionalKPISection from "@/features/home/components/optional-kpi-section";
import BlobsBackground from "@/features/home/components/blobs-backgrounds";
import SectionDivider from "@/features/home/components/section-divider";
import Footer from "@/features/home/components/footer";

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
