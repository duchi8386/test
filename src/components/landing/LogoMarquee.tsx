const logos = ["HAZELINE", "DOVE", "YSL", "LIFEBUOY", "VINFAST", "LA ROCHE-POSAY"];

const LogoMarquee = () => {
  return (
    <section className="py-12 border-y border-border/60 bg-card overflow-hidden">
      <p className="text-center text-base md:text-xl font-medium uppercase tracking-[0.3em] text-gold mb-8">
        — Được các thương hiệu hàng đầu tin chọn —
      </p>
      <div className="relative">
        <div className="flex gap-20 animate-marquee w-max">
          {[...logos, ...logos].map((logo, i) => (
            <div key={i} className="font-display text-2xl md:text-3xl tracking-[0.25em] text-foreground/30 hover:text-primary transition-colors whitespace-nowrap">
              {logo}
            </div>
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-card to-transparent" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-card to-transparent" />
      </div>
    </section>
  );
};

export default LogoMarquee;
