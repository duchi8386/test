import { useState } from "react";
import Reveal from "@/components/Reveal";
import illu1 from "@/assets/illu/1.png";
import illu2 from "@/assets/illu/2.png";
import illu3 from "@/assets/illu/3.png";
import illu4 from "@/assets/illu/4.png";
import illu5 from "@/assets/illu/5.png";
import illu6 from "@/assets/illu/6.png";

const G = {
  gold:   "#c9a96e",
  goldDp: "#a07d3c",
  goldLt: "#e8d5b0",
  cream:  "#fdf8f0",
};

const methods = [
  {
    num:   "01",
    title: "Đăng ảnh & video trên MXH",
    desc:  "Nội dung hình ảnh, video lan tỏa tự nhiên trên Facebook, Instagram, TikTok — tiếp cận đúng tệp khách hàng mục tiêu.",
    img:   illu1,
  },
  {
    num:   "02",
    title: "Check-in địa điểm / sự kiện",
    desc:  "Tăng nhận diện thương hiệu tại điểm bán, sự kiện offline thông qua các KOL hiện diện trực tiếp.",
    img:   illu2,
  },
  {
    num:   "03",
    title: "Quay video viral",
    desc:  "Video ngắn sáng tạo, thu hút hàng triệu lượt xem và chia sẻ trên TikTok, Reels, Shorts.",
    img:   illu3,
  },
  {
    num:   "04",
    title: "Livestream bán hàng",
    desc:  "Phát live trực tiếp, tương tác thời gian thực, chốt đơn nhanh và tăng doanh thu đáng kể.",
    img:   illu4,
  },
  {
    num:   "05",
    title: "Đại diện thương hiệu",
    desc:  "KOL / Influencer trở thành gương mặt đại diện, xây dựng sự gắn kết và tin tưởng lâu dài.",
    img:   illu5,
  },
  {
    num:   "06",
    title: "Kết nối đa lĩnh vực, đa nền tảng",
    desc:  "Phủ sóng đồng thời trên Facebook, TikTok, YouTube, Instagram — đa ngành hàng, đa format.",
    img:   illu6,
  },
];

/* ─── FlipCard ─────────────────────────────────────────────────────────── */
const FlipCard = ({
  num, title, desc, img, delay,
}: (typeof methods)[0] & { delay: number }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <Reveal delay={delay}>
      {/* Perspective wrapper */}
      <div
        className="relative cursor-pointer select-none"
        style={{ perspective: "1100px", minHeight: "340px" }}
        /* hover on desktop */
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
        /* tap on mobile */
        onClick={() => setFlipped((f) => !f)}
        aria-label={`${title} — bấm để xem mô tả`}
      >
        {/* ── Inner wrapper (rotates) ───────────────────── */}
        <div
          className="relative w-full h-full"
          style={{
            transformStyle:  "preserve-3d",
            transition:      "transform 0.65s cubic-bezier(0.4, 0.2, 0.2, 1)",
            transform:        flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            minHeight:        "inherit",
          }}
        >
          {/* ════════════ FRONT FACE ════════════ */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden border border-border/60 bg-white shadow-[0_2px_16px_-6px_rgba(0,0,0,0.08)] flex flex-col"
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Illustration */}
            <div
              className="relative overflow-hidden flex-1"
              style={{ background: G.cream, minHeight: "190px" }}
            >
              {/* Number watermark */}
              <span
                className="absolute top-2 right-3 font-display font-bold text-5xl leading-none pointer-events-none select-none z-10"
                style={{ color: G.goldDp, opacity: 0.1 }}
                aria-hidden
              >
                {num}
              </span>
              <img
                src={img}
                alt={title}
                className="absolute inset-0 w-full h-full object-contain p-5"
              />
              {/* Flip hint badge */}
              <span
                className="absolute bottom-2 right-3 text-[9px] font-medium text-primary/50 tracking-wide"
                aria-hidden
              >
                xem thêm ↗
              </span>
            </div>

            {/* Gold separator */}
            <div
              className="h-px flex-shrink-0"
              style={{
                background:
                  "linear-gradient(90deg,transparent,hsl(45 75% 60%/0.30),transparent)",
              }}
            />

            {/* Title area */}
            <div className="px-5 pt-4 pb-5 flex items-center gap-3">
              <div
                className="inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold flex-shrink-0 border border-primary/25 text-primary/60"
              >
                {num}
              </div>
              <h3 className="font-display font-semibold text-[15px] leading-snug text-foreground tracking-tight">
                {title}
              </h3>
            </div>
          </div>

          {/* ════════════ BACK FACE ════════════ */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden border border-primary/25 flex flex-col items-center justify-center px-7 py-8 shadow-[0_8px_32px_-8px_hsl(42_70%_45%/0.22)]"
            style={{
              backfaceVisibility: "hidden",
              transform:          "rotateY(180deg)",
              background:         `linear-gradient(145deg, ${G.cream} 0%, #fef9f0 60%, #fdf4e3 100%)`,
            }}
          >
            {/* Decorative circle */}
            <div
              className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-20 pointer-events-none"
              style={{ background: `radial-gradient(circle, ${G.gold}, transparent 70%)` }}
              aria-hidden
            />

            {/* Number badge */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold mb-5 border"
              style={{ borderColor: G.gold, color: G.goldDp, background: "#fff" }}
            >
              {num}
            </div>

            {/* Title */}
            <h3
              className="font-display font-bold text-base text-center leading-snug mb-4"
              style={{ color: G.goldDp }}
            >
              {title}
            </h3>

            {/* Gold divider */}
            <div
              className="w-10 h-px rounded-full mb-4 flex-shrink-0"
              style={{ background: G.gold, opacity: 0.6 }}
            />

            {/* Description */}
            <p className="text-[13px] text-foreground/65 text-center leading-relaxed">
              {desc}
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
};

/* ─── Section ───────────────────────────────────────────────────────────── */
const DeploymentMethods = () => (
  <section className="py-20 md:py-28 bg-[#f7f4f0] relative overflow-hidden">
    <div
      className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
      aria-hidden
      style={{
        background: "radial-gradient(ellipse,hsl(45 80% 60%/0.09),transparent 65%)",
      }}
    />

    <div className="container relative">
      {/* Heading */}
      <Reveal className="max-w-2xl mx-auto text-center mb-16">
        <span className="inline-block text-sm md:text-base font-medium uppercase tracking-[0.3em] text-primary mb-5">
          — Hình thức triển khai —
        </span>
        <h2 className="font-display font-medium text-4xl md:text-5xl leading-[1.2] mb-6">
          Đa dạng hình thức,{" "}
          <span className="text-gold italic">một hệ sinh thái.</span>
        </h2>
        <div className="gold-divider w-24 mx-auto mb-6" />
        <p className="text-foreground/60 text-lg font-light leading-relaxed">
          Từ nội dung mạng xã hội đến livestream, từ check-in offline đến đại sứ
          thương hiệu — TIKA bao phủ mọi hình thức.
        </p>
      </Reveal>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {methods.map(({ num, title, desc, img }, idx) => (
          <FlipCard
            key={num}
            num={num}
            title={title}
            desc={desc}
            img={img}
            delay={idx * 70}
          />
        ))}
      </div>
    </div>
  </section>
);

export default DeploymentMethods;
