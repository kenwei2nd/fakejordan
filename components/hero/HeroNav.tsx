'use client';

export default function HeroNav() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-7">
      {/* Logo mark */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white" />
        </div>
        <span
          className="font-display text-white"
          style={{ fontSize: '1.1rem', letterSpacing: '0.05em' }}
        >
          AETHER
        </span>
      </div>

      {/* Center nav links */}
      <div className="hidden md:flex items-center gap-8 font-mono-spec text-white/60">
        <a className="hover:text-white transition-colors cursor-pointer">Shop</a>
        <a className="hover:text-white transition-colors cursor-pointer">Collections</a>
        <a className="hover:text-white transition-colors cursor-pointer">Story</a>
      </div>

      {/* CTA */}
      <button className="cta-primary">Order Now</button>
    </nav>
  );
}
