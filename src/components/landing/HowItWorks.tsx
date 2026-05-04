import { useEffect, useRef, useState } from "react";
import {
  ClipboardList,
  Lightbulb,
  Banknote,
  FileSignature,
  Rocket,
  BarChart2,
} from "lucide-react";

const STEPS = [
  {
    n: "01",
    title: "Tiếp nhận & Phân tích",
    desc: "Mục tiêu · ngành hàng · tệp khách hàng · nền tảng · timeline · ngân sách",
    Icon: ClipboardList,
    dark: true,
  },
  {
    n: "02",
    title: "Chiến lược & Đề xuất",
    desc: "Chốt KPI · xây concept · phân bổ ngân sách hợp lý",
    Icon: Lightbulb,
    dark: false,
  },
  {
    n: "03",
    title: "Lựa chọn & Báo giá",
    desc: "Đề xuất KOL / Micro / Reviewer theo data · báo giá chi tiết, minh bạch",
    Icon: Banknote,
    dark: true,
  },
  {
    n: "04",
    title: "Ký kết & Xác nhận",
    desc: "Ký hợp đồng · booking chính thức · xác nhận lịch triển khai",
    Icon: FileSignature,
    dark: false,
  },
  {
    n: "05",
    title: "Triển khai & Giám sát",
    desc: "Brief KOL · duyệt nội dung · bám sát timeline · monitor hiệu suất",
    Icon: Rocket,
    dark: true,
  },
  {
    n: "06",
    title: "Báo cáo & Tối ưu",
    desc: "Reach · Engagement · Conversion · insight tối ưu cho campaign tiếp theo",
    Icon: BarChart2,
    dark: false,
  },
];

// Easing presets
const EASE_SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const EASE_SMOOTH = "cubic-bezier(0.22, 1, 0.36, 1)";

const HowItWorks = () => {
  const [headerVisible, setHeaderVisible] = useState(false);
  const [lineVisible, setLineVisible]     = useState(false);
  const [visible, setVisible]             = useState<Set<number>>(new Set());

  const headerRef    = useRef<HTMLDivElement>(null);
  const timelineRef  = useRef<HTMLDivElement>(null);
  const stepRefs     = useRef<(HTMLDivElement | null)[]>([]);

  // Header fade-up
  useEffect(() => {
    if (!headerRef.current) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHeaderVisible(true); io.disconnect(); } },
      { threshold: 0.4 }
    );
    io.observe(headerRef.current);
    return () => io.disconnect();
  }, []);

  // Spine line draw
  useEffect(() => {
    if (!timelineRef.current) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setLineVisible(true); io.disconnect(); } },
      { threshold: 0.05 }
    );
    io.observe(timelineRef.current);
    return () => io.disconnect();
  }, []);

  // Step rows — stagger as each enters viewport
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    stepRefs.current.forEach((el, idx) => {
      if (!el) return;
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            // Small extra delay so spine draws slightly ahead of cards
            setTimeout(
              () => setVisible((prev) => new Set(prev).add(idx)),
              idx * 120 + 200
            );
            io.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section
      id="how"
      className="py-20 md:py-28 bg-background border-y border-border/60 overflow-hidden"
    >
      <div className="container">

        {/* ── Header ── */}
        <div
          ref={headerRef}
          className="text-center mb-14"
          style={{
            opacity:   headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(28px)",
            transition: `opacity 0.8s ${EASE_SMOOTH}, transform 0.8s ${EASE_SMOOTH}`,
          }}
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-primary mb-4">
            Quy trình vận hành
          </span>
          <h2 className="font-display font-semibold text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground">
            06 bước để biến ý tưởng{" "}
            <span className="italic text-primary">thành chiến dịch hiệu quả</span>
          </h2>
          <div
            className="h-px bg-primary/50 mx-auto mt-5 rounded-full"
            style={{
              width:      headerVisible ? "48px" : "0px",
              transition: `width 0.9s ${EASE_SMOOTH} 0.3s`,
            }}
          />
        </div>

        {/* ── Timeline ── */}
        <div ref={timelineRef} className="relative max-w-[680px] mx-auto">

          {/* Spine — draws from top to bottom */}
          <div
            aria-hidden
            className="absolute left-[23px] top-8 bottom-8 w-px origin-top"
            style={{
              background: "linear-gradient(to bottom, hsl(42 70% 45% / 0.2), hsl(42 70% 45% / 0.65) 50%, hsl(42 70% 45% / 0.2))",
              transform:  lineVisible ? "scaleY(1)" : "scaleY(0)",
              transition: `transform 1.6s ${EASE_SMOOTH}`,
            }}
          />

          <div className="flex flex-col gap-[22px]">
            {STEPS.map((step, i) => {
              const isVisible = visible.has(i);
              const delay     = `${i * 0.06}s`;

              return (
                <div
                  key={step.n}
                  ref={(el) => (stepRefs.current[i] = el)}
                  className="flex items-center gap-4"
                  style={{
                    opacity:   isVisible ? 1 : 0,
                    transform: isVisible ? "translateX(0)" : "translateX(36px)",
                    transition: `opacity 0.55s ${EASE_SMOOTH} ${delay}, transform 0.65s ${EASE_SMOOTH} ${delay}`,
                  }}
                >
                  {/* ── Dot ── */}
                  <div className="w-12 flex-shrink-0 flex items-center justify-center relative">
                    {/* One-time ping ring when step appears */}
                    {isVisible && (
                      <span
                        className="absolute w-[18px] h-[18px] rounded-full border border-primary/50"
                        style={{
                          animation: `ping-once 0.7s ${EASE_SMOOTH} forwards`,
                        }}
                      />
                    )}
                    <div
                      className="w-[18px] h-[18px] rounded-full border-2 border-primary/50 bg-background flex items-center justify-center z-10"
                      style={{
                        transform:  isVisible ? "scale(1)" : "scale(0)",
                        transition: `transform 0.45s ${EASE_SPRING} ${delay}`,
                      }}
                    >
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                  </div>

                  {/* ── Icon bubble — spring bounce ── */}
                  <div
                    className={`w-[60px] h-[60px] rounded-full flex-shrink-0 flex items-center justify-center shadow-md cursor-default ${
                      step.dark ? "bg-primary-deep" : "bg-primary"
                    }`}
                    style={{
                      transform:  isVisible ? "scale(1)" : "scale(0.25)",
                      transition: `transform 0.55s ${EASE_SPRING} calc(${delay} + 0.08s)`,
                    }}
                  >
                    <step.Icon className="w-[26px] h-[26px] text-white" strokeWidth={1.6} />
                  </div>

                  {/* ── Card ── */}
                  <div
                    className="
                      group flex-1 bg-card rounded-2xl border border-border/60
                      px-5 py-4 shadow-[0_2px_16px_-6px_rgba(0,0,0,0.08)]
                      hover:border-primary/30
                      hover:shadow-[0_6px_28px_-8px_hsl(42_70%_45%/0.18)]
                      hover:-translate-y-0.5
                      transition-[border-color,box-shadow,transform] duration-300 cursor-default
                    "
                  >
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-[10px] font-mono font-semibold text-primary/60 tracking-widest">
                        {step.n}
                      </span>
                      <h3 className="font-display font-extrabold text-[13px] md:text-sm tracking-[0.12em] text-primary uppercase">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-[12px] md:text-[13px] text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
                    {/* Expand underline on hover */}
                    <div className="mt-2.5 h-px w-0 group-hover:w-10 bg-primary/40 transition-all duration-500 ease-out rounded-full" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Keyframe for one-time dot ping */}
      <style>{`
        @keyframes ping-once {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(2.4); opacity: 0;   }
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;
