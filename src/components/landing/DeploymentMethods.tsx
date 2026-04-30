import Reveal from "@/components/Reveal";
import illu1 from "@/assets/illu/1.png";
import illu2 from "@/assets/illu/2.png";
import illu3 from "@/assets/illu/3.png";
import illu4 from "@/assets/illu/4.png";
import illu5 from "@/assets/illu/5.png";
import illu6 from "@/assets/illu/6.png";

/* ─── Design tokens — mirrors site's gold / ivory system ─────────────────── */
const G = {
  gold: "#c9a96e",
  goldMid: "#d4a853",
  goldDp: "#a07d3c",
  goldLt: "#e8d5b0",
  goldPle: "#f0e2c0",
  cream: "#fdf8f0",
  ivoryBg: "#faf5ed",
  skin: "#f5cba7",
  darkMd: "#5c3d10",
  dark: "#2a1a06",
  white: "#ffffff",
  shadow: "rgba(180,130,50,0.15)",
};

const methods = [
  {
    num: "01",
    title: "Đăng ảnh & video trên MXH",
    desc: "Nội dung hình ảnh, video lan tỏa tự nhiên trên Facebook, Instagram, TikTok.",
    img: illu1,
  },
  {
    num: "02",
    title: "Check-in địa điểm / sự kiện",
    desc: "Tăng nhận diện thương hiệu tại điểm bán, sự kiện offline.",
    img: illu2,
  },
  {
    num: "03",
    title: "Quay video viral",
    desc: "Video ngắn sáng tạo, thu hút hàng triệu lượt xem.",
    img: illu3,
  },
  {
    num: "04",
    title: "Livestream bán hàng",
    desc: "Phát live trực tiếp, chốt đơn nhanh, tăng doanh thu.",
    img: illu4,
  },
  {
    num: "05",
    title: "Đại diện thương hiệu",
    desc: "KOL/Influencer trở thành gương mặt đại diện, gắn kết lâu dài.",
    img: illu5,
  },
  {
    num: "06",
    title: "Kết nối đa lĩnh vực, đa nền tảng",
    desc: "Phủ sóng trên mọi nền tảng: Facebook, TikTok, YouTube, Instagram.",
    img: illu6,
  },
];

/* ─── section ────────────────────────────────────────────────────────────── */
const DeploymentMethods = () => (
  <section className="py-20 md:py-28 bg-[#f7f4f0] relative overflow-hidden">
    {/* ambient glow — same pattern as Stats section */}
    <div
      className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
      aria-hidden
      style={{
        background:
          "radial-gradient(ellipse,hsl(45 80% 60%/0.09),transparent 65%)",
      }}
    />

    <div className="container relative">
      {/* ── Heading ─────────────────────────────────────── */}
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

      {/* ── 3 × 2 grid ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {methods.map(({ num, title, desc, img }, idx) => (
          <Reveal key={title} delay={idx * 70}>
            {/* card — lift + gold-top-line reveal on hover */}
            <div
              className="group relative bg-white rounded-2xl border border-border/60
                            hover:border-primary/35 hover:shadow-[0_16px_40px_-12px_rgba(180,130,50,0.22)]
                            hover:-translate-y-1.5 transition-all duration-300 ease-out
                            overflow-hidden flex flex-col h-full"
            >
              {/* gold top accent bar (scaleX 0→1 on hover) */}
              <span
                className="absolute inset-x-0 top-0 h-[2.5px] origin-left scale-x-0 group-hover:scale-x-100
                           transition-transform duration-300 ease-out rounded-t-2xl"
                style={{
                  background: "linear-gradient(90deg,#c9a96e,#e8d5b0,#c9a96e)",
                }}
                aria-hidden
              />

              {/* ── illustration area ── */}
              <div
                className="relative overflow-hidden"
                style={{ paddingBottom: "68%", background: G.cream }}
              >
                {/* large watermark number */}
                <span
                  className="absolute top-2 right-3 font-display font-bold text-5xl leading-none
                             pointer-events-none select-none transition-opacity duration-300
                             opacity-[0.07] group-hover:opacity-[0.5] z-10"
                  style={{ color: G.goldDp }}
                  aria-hidden
                >
                  {num}
                </span>

                {/* image — subtle scale on hover */}
                <img
                  src={img}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-contain p-5
                             transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                />
              </div>

              {/* ── gold fade separator ── */}
              <div
                className="h-px mx-0 flex-shrink-0"
                style={{
                  background:
                    "linear-gradient(90deg,transparent,hsl(45 75% 60%/0.30),transparent)",
                }}
              />

              {/* ── text area ── */}
              <div className="px-6 pt-5 pb-6 flex flex-col gap-3 flex-1">
                {/* numbered badge */}
                <div
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full
                             text-xs font-bold tracking-wide transition-colors duration-300
                             border border-primary/25 text-primary/60
                             group-hover:border-primary/50 group-hover:text-primary"
                >
                  {num}
                </div>

                <div>
                  <h3 className="font-display font-semibold text-[25px] leading-snug text-foreground mb-1.5 tracking-tight">
                    {title}
                  </h3>
                  <p className="text-[13px] text-foreground/52 leading-[1.7] font-light">
                    {desc}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* ── subtle bottom label ────────────────────────── */}
      <Reveal delay={500} className="mt-12 text-center">
        {/* <p className="text-sm text-foreground/40 font-light tracking-wide">
          6 hình thức · Phủ sóng đa nền tảng · Tùy chỉnh theo chiến dịch
          6 hình thức · Phủ sóng đa nền tảng · Tùy chỉnh theo chiến dịch
        </p> */}
      </Reveal>
    </div>
  </section>
);

export default DeploymentMethods;
