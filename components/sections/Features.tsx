import dynamic from 'next/dynamic';

const TechSection = dynamic(() => import('./tech/TechSection'));
const MaterialsSection = dynamic(() => import('./materials/MaterialsSection'));
const PerformanceSection = dynamic(() => import('./performance/PerformanceSection'));
const GallerySection = dynamic(() => import('./gallery/GallerySection'));
const DesignerSection = dynamic(() => import('./designer/DesignerSection'));
const SustainabilitySection = dynamic(() => import('./sustainability/SustainabilitySection'));
const CtaSection = dynamic(() => import('./cta/CtaSection'));

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
