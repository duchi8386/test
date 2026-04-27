import Reveal from "@/components/Reveal";

const stats = [
  { value: "1000+", label: "Influencers", sub: "Micro · KOL · Reviewer" },
  { value: "500+", label: "Đối tác nhãn hàng", sub: "đa nền tảng" },
  { value: "2000+", label: "Chiến dịch", sub: "đã triển khai" },
];

const Stats = () => {
  return (
    <section id="platform" className="py-24 md:py-32 bg-card relative overflow-hidden border-y border-border/60">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px]" aria-hidden />
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
              5 năm xây dựng hệ sinh thái sáng tạo nội dung được tuyển chọn kỹ lưỡng nhất. TIKA là cầu nối
              giữa các thương hiệu lớn và những người kể chuyện xuất sắc.
            </p>
          </Reveal>

          <div className="relative">
            <div className="absolute -top-3 -left-3 w-8 h-8 border-l-2 border-t-2 border-primary" aria-hidden />
            <div className="absolute -bottom-3 -right-3 w-8 h-8 border-r-2 border-b-2 border-primary" aria-hidden />

            <div className="bg-background border border-border/60 divide-y divide-border/60 shadow-card">
              {stats.map((s, idx) => (
                <Reveal key={s.label} delay={idx * 150}>
                  <div className="group relative flex items-center justify-between gap-6 p-7 md:p-8 hover:bg-secondary/40 transition-colors">
                    <div className="flex items-baseline gap-5">
                      <span className="font-display text-xl md:text-2xl tracking-[0.15em] text-primary/70 w-10">
                        0{idx + 1}
                      </span>
                      <div>
                        <div className="text-base md:text-lg uppercase tracking-[0.2em] text-foreground font-medium">
                          {s.label}
                        </div>
                        <div className="text-sm text-foreground/50 mt-1.5 font-light">{s.sub}</div>
                      </div>
                    </div>
                    <div className="font-display text-5xl md:text-6xl text-gold tracking-tight leading-none transition-transform duration-500 group-hover:scale-105">
                      {s.value}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
