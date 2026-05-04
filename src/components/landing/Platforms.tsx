import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";

/* ─── Counter helpers ────────────────────────────────────────────────────── */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function useCountUpFloat(
  target: number,
  duration: number,
  decimals: number,
  active: boolean
) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let startTs: number | null = null;
    let raf: number;
    const step = (ts: number) => {
      if (!startTs) startTs = ts;
      const p = Math.min((ts - startTs) / duration, 1);
      setVal(parseFloat((easeOut(p) * target).toFixed(decimals)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration, decimals]);
  return val;
}

const METRICS = [
  { target: 980,  dec: 0, suffix: "K+", label: "Lượt tiếp cận TB / chiến dịch" },
  { target: 4.1,  dec: 1, suffix: "%",  label: "Tỷ lệ tương tác trung bình"    },
  { target: 9.2,  dec: 1, suffix: "K+", label: "Chuyển đổi tổng hợp"           },
];

const PlatformCounters = () => {
  const ref    = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  const v0 = useCountUpFloat(METRICS[0].target, 1400, METRICS[0].dec, on);
  const v1 = useCountUpFloat(METRICS[1].target, 1200, METRICS[1].dec, on);
  const v2 = useCountUpFloat(METRICS[2].target, 1400, METRICS[2].dec, on);
  const vals = [v0, v1, v2];

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } },
      { threshold: 0.5 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="mt-14 border-t border-border/40 pt-10">
      <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto text-center">
        {METRICS.map(({ suffix, label }, i) => (
          <div key={label}>
            <div className="font-display font-bold text-3xl md:text-4xl text-primary tabular-nums">
              {vals[i]}
              {suffix}
            </div>
            <div className="text-[11px] uppercase tracking-[0.15em] text-foreground/50 mt-2 font-medium leading-snug">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Platform data ─────────────────────────────────────────────────────── */
const PLATFORMS = [
  {
    name: "Facebook",
    tags: ["Post", "Story", "Reels", "Group"],
    color: "#1877F2",
    bg:    "#EBF3FE",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    tags: ["Feed", "Reels", "Story", "Collab"],
    color: "#E1306C",
    bg:    "#FEE8F1",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    tags: ["Short Video", "Hashtag", "Challenge"],
    color: "#010101",
    bg:    "#F0F0F0",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9a8.18 8.18 0 004.78 1.52V7.1a4.85 4.85 0 01-1.01-.41z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    tags: ["Video Review", "Shorts", "Collab"],
    color: "#FF0000",
    bg:    "#FFEBEB",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: "Group cộng đồng",
    tags: ["Seeding", "Discussion", "Review"],
    color: "#0F9D58",
    bg:    "#E6F4EA",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    name: "Fanpage & Hot Page",
    tags: ["Viral Content", "Reach", "Sharing"],
    color: "#F4770B",
    bg:    "#FEF0E4",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
];

/* ─── Section ───────────────────────────────────────────────────────────── */
const Platforms = () => (
  <section
    id="platforms"
    className="py-20 md:py-28 bg-card border-b border-border/60 overflow-hidden relative"
  >
    {/* Ambient glow */}
    <div
      className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
      aria-hidden
      style={{
        background:
          "radial-gradient(ellipse, hsl(42 70% 45% / 0.07), transparent 70%)",
      }}
    />

    <div className="container relative">
      {/* ── Header ── */}
      <Reveal className="max-w-2xl mx-auto text-center mb-14">
        <span className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-primary mb-4">
          Nền tảng triển khai
        </span>
        <h2 className="font-display font-semibold text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground mb-4">
          Phủ sóng trên{" "}
          <span className="italic text-primary">đa nền tảng</span>
        </h2>
        <p className="text-foreground/60 text-[15px] leading-relaxed font-light">
          Chiến dịch được triển khai đồng bộ trên nhiều nền tảng mạng xã hội
          phổ biến — tiếp cận đúng tệp khách hàng, đúng thời điểm.
        </p>
        <div className="w-12 h-px bg-primary/50 mx-auto mt-6 rounded-full" />
      </Reveal>

      {/* ── Platform grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 max-w-3xl mx-auto">
        {PLATFORMS.map(({ name, tags, color, bg, Icon }, idx) => (
          <Reveal key={name} delay={idx * 60}>
            <div
              className="
                group relative bg-background rounded-2xl border border-border/60 p-5
                hover:border-primary/25 hover:shadow-[0_8px_32px_-8px_hsl(42_70%_45%/0.18)]
                hover:-translate-y-1 transition-all duration-300 ease-out
                overflow-hidden cursor-default
              "
            >
              {/* Gold top bar on hover */}
              <span
                className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-t-2xl"
                style={{
                  background:
                    "linear-gradient(90deg,hsl(42 70% 45%/0.6),hsl(45 80% 60%),hsl(42 70% 45%/0.6))",
                }}
                aria-hidden
              />

              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className="flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{ color }}
                >
                  <Icon />
                </div>

                {/* Right: name + tags */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-[15px] text-foreground mb-2 leading-snug">
                    {name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] text-foreground/50 bg-muted rounded-full px-2 py-0.5 font-medium tracking-wide"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* ── Footer note ── */}
      <Reveal delay={400} className="mt-12 text-center">
        <p className="text-[13px] text-foreground/45 font-light max-w-lg mx-auto leading-relaxed">
          Điều này giúp thương hiệu{" "}
          <span className="text-primary font-medium">
            tiếp cận khách hàng mục tiêu
          </span>
          , đúng thời điểm và đúng hành vi mua sắm.
        </p>
      </Reveal>

      {/* ── Counter strip ── */}
      <PlatformCounters />
    </div>
  </section>
);

export default Platforms;
