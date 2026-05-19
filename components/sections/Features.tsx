import dynamic from 'next/dynamic';

const TechSection = dynamic(() => import('./tech/TechSection'));
const GallerySection = dynamic(() => import('./gallery/GallerySection'));
const PerformanceSection = dynamic(() => import('./performance/PerformanceSection'));

export default function Features() {
  return (
    <>
      <TechSection />
      <GallerySection />
      <PerformanceSection />
    </>
  );
}
