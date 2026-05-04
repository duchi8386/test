import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import { TrendingUp, Heart, Percent, Users, FileText, Star } from "lucide-react";

/* ─── Counter util (resetKey re-triggers animation) ─────────────────────── */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function useCountUp(
  target: number,
  duration: number,
  decimals: number,
  active: boolean,
  resetKey: number
) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    setVal(0);
    let s: number | null = null;
    let raf: number;
    const step = (ts: number) => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / duration, 1);
      setVal(parseFloat((easeOut(p) * target).toFixed(decimals)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, resetKey]);
  return val;
}

/* ─── 10 complete datasets ───────────────────────────────────────────────── */
const ALL_DATA = [
  { revenue: 158_230_775, units: 890,  viewers: 14.2, reach: 980,  eng: 4.1, conv: 9.2,
    bars: [{ l:"T1",r:55,e:36,c:22},{l:"T2",r:72,e:50,c:34},{l:"T3",r:63,e:42,c:28},{l:"T4",r:88,e:64,c:46},{l:"T5",r:70,e:48,c:38},{l:"T6",r:95,e:70,c:54},{l:"T7",r:82,e:58,c:44}] },
  { revenue: 234_560_000, units: 1240, viewers: 18.6, reach: 1250, eng: 5.3, conv: 12.8,
    bars: [{ l:"T1",r:50,e:32,c:18},{l:"T2",r:60,e:40,c:24},{l:"T3",r:70,e:48,c:30},{l:"T4",r:80,e:56,c:38},{l:"T5",r:88,e:62,c:44},{l:"T6",r:94,e:68,c:50},{l:"T7",r:98,e:74,c:56}] },
  { revenue: 189_450_000, units: 760,  viewers: 11.8, reach: 820,  eng: 3.8, conv: 7.6,
    bars: [{ l:"T1",r:88,e:62,c:44},{l:"T2",r:75,e:52,c:36},{l:"T3",r:60,e:40,c:26},{l:"T4",r:52,e:34,c:20},{l:"T5",r:65,e:44,c:30},{l:"T6",r:80,e:58,c:42},{l:"T7",r:95,e:72,c:54}] },
  { revenue: 312_780_000, units: 1560, viewers: 22.4, reach: 1680, eng: 6.2, conv: 18.4,
    bars: [{ l:"T1",r:45,e:28,c:16},{l:"T2",r:90,e:66,c:48},{l:"T3",r:50,e:32,c:20},{l:"T4",r:85,e:60,c:44},{l:"T5",r:55,e:36,c:22},{l:"T6",r:92,e:68,c:52},{l:"T7",r:60,e:40,c:28}] },
  { revenue: 95_600_000,  units: 420,  viewers: 8.3,  reach: 540,  eng: 2.9, conv: 4.8,
    bars: [{ l:"T1",r:48,e:30,c:18},{l:"T2",r:52,e:34,c:20},{l:"T3",r:55,e:36,c:22},{l:"T4",r:58,e:38,c:24},{l:"T5",r:68,e:46,c:32},{l:"T6",r:82,e:60,c:46},{l:"T7",r:98,e:76,c:60}] },
  { revenue: 278_900_000, units: 1380, viewers: 19.5, reach: 1420, eng: 5.8, conv: 15.6,
    bars: [{ l:"T1",r:70,e:48,c:32},{l:"T2",r:78,e:54,c:38},{l:"T3",r:86,e:62,c:44},{l:"T4",r:98,e:76,c:58},{l:"T5",r:84,e:60,c:42},{l:"T6",r:76,e:52,c:36},{l:"T7",r:70,e:48,c:32}] },
  { revenue: 143_220_000, units: 680,  viewers: 12.7, reach: 760,  eng: 3.4, conv: 6.9,
    bars: [{ l:"T1",r:30,e:18,c:10},{l:"T2",r:38,e:24,c:14},{l:"T3",r:50,e:32,c:20},{l:"T4",r:65,e:44,c:30},{l:"T5",r:80,e:58,c:42},{l:"T6",r:90,e:66,c:50},{l:"T7",r:96,e:72,c:56}] },
  { revenue: 198_750_000, units: 980,  viewers: 16.3, reach: 1080, eng: 4.6, conv: 11.2,
    bars: [{ l:"T1",r:85,e:60,c:44},{l:"T2",r:60,e:40,c:28},{l:"T3",r:88,e:64,c:48},{l:"T4",r:55,e:36,c:24},{l:"T5",r:90,e:66,c:50},{l:"T6",r:62,e:42,c:30},{l:"T7",r:92,e:68,c:52}] },
  { revenue: 356_120_000, units: 1820, viewers: 26.8, reach: 2100, eng: 7.4, conv: 22.6,
    bars: [{ l:"T1",r:60,e:40,c:26},{l:"T2",r:88,e:64,c:46},{l:"T3",r:90,e:66,c:48},{l:"T4",r:91,e:67,c:49},{l:"T5",r:89,e:65,c:47},{l:"T6",r:92,e:68,c:50},{l:"T7",r:75,e:52,c:36}] },
  { revenue: 172_480_000, units: 840,  viewers: 13.9, reach: 920,  eng: 4.4, conv: 8.8,
    bars: [{ l:"T1",r:42,e:26,c:14},{l:"T2",r:68,e:46,c:30},{l:"T3",r:58,e:38,c:24},{l:"T4",r:80,e:58,c:42},{l:"T5",r:72,e:50,c:34},{l:"T6",r:90,e:66,c:50},{l:"T7",r:96,e:72,c:56}] },
];

const INTERVAL_MS = 5000;

/* ─── Feature list ───────────────────────────────────────────────────────── */
const FEATURES = [
  { Icon: TrendingUp, text: "Lượt tiếp cận (Reach)" },
  { Icon: Heart,      text: "Lượt tương tác (Like, Comment, Share)" },
  { Icon: Percent,    text: "Tỷ lệ tương tác (Engagement Rate)" },
  { Icon: Users,      text: "Hiệu quả từng Influencer" },
  { Icon: FileText,   text: "Hiệu quả từng nội dung" },
];

/* ─── Dashboard ──────────────────────────────────────────────────────────── */
const Dashboard = ({ active }: { active: boolean }) => {
  const [idx,  setIdx]  = useState(0);
  const [tick, setTick] = useState(0);

  /* Cycle every 5s once section is visible */
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % ALL_DATA.length);
      setTick((t) => t + 1);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [active]);

  const d = ALL_DATA[idx];

  const revenue = useCountUp(d.revenue,  1600, 0, active, tick);
  const units   = useCountUp(d.units,    1200, 0, active, tick);
  const viewers = useCountUp(d.viewers,  1200, 1, active, tick);
  const reach   = useCountUp(d.reach,    1400, 0, active, tick);
  const eng     = useCountUp(d.eng,      1200, 1, active, tick);
  const conv    = useCountUp(d.conv,     1400, 1, active, tick);

  return (
    <div className="rounded-2xl overflow-hidden shadow-[0_20px_60px_-12px_rgba(0,0,0,0.18)] border border-border/40 bg-card text-[13px]">

      {/* Progress bar — shows 5s countdown */}
      <div className="h-[2px] bg-primary/10 relative overflow-hidden">
        {active && (
          <div
            key={tick}
            className="absolute left-0 top-0 h-full bg-primary/60 rounded-full"
            style={{
              animation: `progress-fill ${INTERVAL_MS}ms linear forwards`,
            }}
          />
        )}
      </div>

      {/* Revenue header */}
      <div style={{ background: "linear-gradient(135deg,hsl(0 0% 8%),hsl(0 0% 14%))" }}
           className="px-5 py-4">
        <div className="text-[9px] uppercase tracking-[0.2em] text-primary/80 font-semibold mb-1">
          Doanh thu (đ)
        </div>
        <div className="font-display font-bold text-2xl text-primary tabular-nums leading-none">
          {active ? revenue.toLocaleString("vi-VN") : "0"}đ
        </div>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 divide-x divide-border/60 border-b border-border/60">
        {[
          { val: units,   suf: "",  label: "Doanh số đơn vị"   },
          { val: viewers, suf: "k", label: "Tăng số người xem" },
        ].map(({ val, suf, label }) => (
          <div key={label} className="px-4 py-3 text-center">
            <div className="font-display font-bold text-lg text-foreground tabular-nums">{val}{suf}</div>
            <div className="text-[10px] text-foreground/50 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Metric grid */}
      <div className="grid grid-cols-4 divide-x divide-border/40 border-b border-border/60 bg-muted/30">
        {[
          { val: "35.6%", label: "CTR"        },
          { val: "8.75%", label: "CR"         },
          { val: "7.8M",  label: "Watch time" },
          { val: "620",   label: "Người nhìn" },
        ].map(({ val, label }) => (
          <div key={label} className="px-2 py-2.5 text-center">
            <div className="font-semibold text-[13px] text-primary">{val}</div>
            <div className="text-[9px] text-foreground/45 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[11px] font-semibold text-foreground/70">Campaign Analytics</span>
          <div className="flex items-center gap-2 ml-auto">
            {[
              { color: "hsl(42 70% 45%)", label: "Reach"      },
              { color: "hsl(42 55% 62%)", label: "Engagement" },
              { color: "hsl(42 40% 76%)", label: "Conversion" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm" style={{ background: color }} />
                <span className="text-[9px] text-foreground/50">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-end gap-1.5 h-[72px]">
          {d.bars.map(({ l, r, e, c }) => (
            <div key={l} className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-full flex items-end gap-px" style={{ height: 60 }}>
                {[
                  { h: r, color: "hsl(42 70% 45%)" },
                  { h: e, color: "hsl(42 55% 62%)" },
                  { h: c, color: "hsl(42 40% 76%)" },
                ].map(({ h, color }, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{
                      height:          active ? `${h}%` : "0%",
                      background:      color,
                      transition:      `height 0.7s cubic-bezier(0.22,1,0.36,1)`,
                      transitionDelay: `${i * 60}ms`,
                    }}
                  />
                ))}
              </div>
              <span className="text-[8px] text-foreground/40">{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary counters */}
      <div className="grid grid-cols-3 divide-x divide-border/60 border-t border-border/60 bg-muted/20">
        {[
          { val: reach, suf: "K",  label: "Reach"       },
          { val: eng,   suf: "%",  label: "Engagement"  },
          { val: conv,  suf: "K",  label: "Conversions" },
        ].map(({ val, suf, label }) => (
          <div key={label} className="px-3 py-3 text-center">
            <div className="font-display font-bold text-base text-primary tabular-nums">{val}{suf}</div>
            <div className="text-[9px] text-foreground/45 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Dataset indicator dots */}
      <div className="flex items-center justify-center gap-1 py-2 bg-muted/10">
        {ALL_DATA.map((_, i) => (
          <span
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width:      i === idx ? 16 : 5,
              height:     5,
              background: i === idx ? "hsl(42 70% 45%)" : "hsl(42 70% 45% / 0.25)",
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes progress-fill {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
};

/* ─── Section ────────────────────────────────────────────────────────────── */
const Analytics = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setActive(true); io.disconnect(); } },
      { threshold: 0.2 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="analytics"
      className="py-20 md:py-28 bg-[#f7f4f0] border-y border-border/60 overflow-hidden"
    >
      <div className="container">
        <div ref={ref} className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Dashboard */}
          <Reveal>
            <Dashboard active={active} />
          </Reveal>

          {/* Text */}
          <Reveal delay={120}>
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-primary mb-4">
              Đo lường & Phân tích
            </span>
            <h2 className="font-display font-semibold text-3xl md:text-4xl leading-tight text-foreground mb-4">
              Công cụ phân tích &{" "}
              <span className="italic text-primary">đo lường chiến dịch</span>
            </h2>
            <div className="w-10 h-px bg-primary/50 mb-6 rounded-full" />
            <p className="text-foreground/60 text-[15px] leading-relaxed mb-8 font-light">
              TIKA cung cấp hệ thống báo cáo & phân tích chuyên sâu, cho phép
              doanh nghiệp theo dõi hiệu quả chiến dịch Influencer Marketing
              theo thời gian thực.
            </p>

            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-foreground/40 mb-4">
              Các chỉ số đo lường
            </p>

            <ul className="space-y-3 mb-8">
              {FEATURES.map(({ Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
                  </div>
                  <span className="text-[14px] text-foreground/70">{text}</span>
                </li>
              ))}
            </ul>

            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
              <p className="text-[13px] text-foreground/70 leading-relaxed">
                <Star className="w-3.5 h-3.5 text-primary inline mr-1.5 mb-0.5" />
                Giúp doanh nghiệp{" "}
                <span className="font-semibold text-foreground">
                  tối ưu chiến dịch & ngân sách
                </span>{" "}
                liên tục dựa trên dữ liệu thực tế.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Analytics;
