import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";

const STATS = [
  { num: 1000, suffix: "+", label: "Influencers",        sub: "Micro · KOL · Reviewer" },
  { num: 500,  suffix: "+", label: "Đối tác nhãn hàng", sub: "đa nền tảng" },
  { num: 2000, suffix: "+", label: "Chiến dịch",         sub: "đã triển khai" },
];

/* easeOutCubic — giảm tốc mượt về cuối */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let startTs: number | null = null;
    let raf: number;

    const step = (ts: number) => {
      if (!startTs) startTs = ts;
      const elapsed  = ts - startTs;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.round(easeOut(progress) * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);

  return count;
}

/* ─── Single stat row ────────────────────────────────────────────────────── */
function StatRow({
  num, suffix, label, sub, idx,
}: (typeof STATS)[0] & { idx: number }) {
  const ref     = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const count   = useCountUp(num, 1600, active);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setActive(true); io.disconnect(); } },
      { threshold: 0.5 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <Reveal delay={idx * 150}>
      <div
        ref={ref}
        className="group relative flex items-center justify-between gap-6 p-7 md:p-8 hover:bg-secondary/40 transition-colors"
      >
        <div className="flex items-baseline gap-5">
          <span className="font-display text-xl md:text-2xl tracking-[0.15em] text-primary/70 w-10">
            0{idx + 1}
          </span>
          <div>
            <div className="text-base md:text-lg uppercase tracking-[0.2em] text-foreground font-medium">
              {label}
            </div>
            <div className="text-sm text-foreground/50 mt-1.5 font-light">{sub}</div>
          </div>
        </div>

        {/* Counter number */}
        <div className="font-display text-5xl md:text-6xl text-gold tracking-tight leading-none transition-transform duration-500 group-hover:scale-105 tabular-nums">
          {active ? count.toLocaleString() : 0}
          <span>{suffix}</span>
        </div>
      </div>
    </Reveal>
  );
}

/* ─── Section ───────────────────────────────────────────────────────────── */
const Stats = () => (
  <section
    id="platform"
    className="py-24 md:py-32 bg-card relative overflow-hidden border-y border-border/60"
  >
    <div
      className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px]"
      aria-hidden
    />
    <div className="container relative">
      <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
        <Reveal>
          <span className="inline-block text-sm md:text-base font-medium uppercase tracking-[0.3em] text-primary mb-5">
            — Những con số —
          </span>
          <h2 className="font-display font-medium text-4xl md:text-6xl leading-[1.4] md:leading-[1.3] py-4 mb-8">
            Những người kể chuyện.<br />
            <span className="text-gold italic inline-block mt-3">Niềm tin vững chắc.</span>
          </h2>
          <div className="gold-divider w-24 mb-6" />
          <p className="text-foreground/60 text-lg font-light leading-relaxed">
            5 năm xây dựng hệ sinh thái sáng tạo nội dung được tuyển chọn kỹ lưỡng nhất.
            TIKA là cầu nối giữa các thương hiệu lớn và những người kể chuyện xuất sắc.
          </p>
        </Reveal>

        <div className="relative">
          <div className="absolute -top-3 -left-3 w-8 h-8 border-l-2 border-t-2 border-primary" aria-hidden />
          <div className="absolute -bottom-3 -right-3 w-8 h-8 border-r-2 border-b-2 border-primary" aria-hidden />
          <div className="bg-background border border-border/60 divide-y divide-border/60 shadow-card">
            {STATS.map((s, idx) => (
              <StatRow key={s.label} {...s} idx={idx} />
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Stats;
