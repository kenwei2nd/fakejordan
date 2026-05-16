import TechSection from './tech/TechSection';
import MaterialsSection from './materials/MaterialsSection';
import PerformanceSection from './performance/PerformanceSection';
import GallerySection from './gallery/GallerySection';
import DesignerSection from './designer/DesignerSection';
import SustainabilitySection from './sustainability/SustainabilitySection';
import CtaSection from './cta/CtaSection';

export default function Features() {
  return (
    <>
      <TechSection />
      <MaterialsSection />
      <PerformanceSection />
      <GallerySection />
      <DesignerSection />
      <SustainabilitySection />
      <CtaSection />
    </>
  );
}
