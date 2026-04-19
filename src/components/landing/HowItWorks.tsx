import { useEffect, useRef, useState } from "react";

// Danh sách 6 bước trong quy trình vận hành của TIKA
const steps = [
  { n: "01", title: "Tiếp nhận & Khai phá", subtitle: "(Briefing)", desc: "Thấu hiểu mục tiêu, nghiên cứu ngành hàng và chân dung khách hàng mục tiêu." },
  { n: "02", title: "Chiến lược & Giải pháp", subtitle: "(Strategic Proposal)", desc: "Định hình concept sáng tạo, xác lập KPI và tối ưu hóa ngân sách." },
  { n: "03", title: "Giải pháp Nhân sự & Báo giá", subtitle: "(Talent Selection)", desc: "Đề xuất danh sách KOL/KOC dựa trên dữ liệu thực tế và minh bạch chi phí." },
  { n: "04", title: "Cam kết Hợp tác", subtitle: "(Contracting)", desc: "Hoàn thiện pháp lý, xác nhận lịch trình và các điều khoản triển khai." },
  { n: "05", title: "Vận hành & Giám sát", subtitle: "(Execution)", desc: "Quản trị nội dung chặt chẽ, đảm bảo tiến độ và bám sát thực tế." },
  { n: "06", title: "Đo lường & Tối ưu", subtitle: "(Reporting)", desc: "Phân tích hiệu chỉ số và tối ưu campaign tiếp theo." },
];

const HowItWorks = () => {
  // Theo dõi các bước đã xuất hiện trong viewport để chạy hiệu ứng fade-in tuần tự
  const [visible, setVisible] = useState<Set<number>>(new Set());
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Sử dụng IntersectionObserver để kích hoạt animation khi cuộn tới
    const observers: IntersectionObserver[] = [];
    refs.current.forEach((el, idx) => {
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Delay theo thứ tự để tạo hiệu ứng "stagger"
              setTimeout(() => {
                setVisible((prev) => new Set(prev).add(idx));
              }, idx * 120);
              io.disconnect();
            }
          });
        },
        { threshold: 0.25 }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section
      id="how"
      className="py-24 md:py-32 bg-card border-y border-border/60 relative overflow-hidden"
    >
      {/* Hiệu ứng nền: vầng sáng vàng mờ chuyển động chậm */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl animate-pulse-glow" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container relative">
        {/* Tiêu đề section */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="inline-block text-sm md:text-base font-medium uppercase tracking-[0.3em] text-primary mb-5">
            — Quy trình vận hành —
          </span>
          <h2 className="font-display font-medium text-3xl md:text-5xl leading-[1.15]">
            06 bước để biến ý tưởng<br />
            thành <span className="text-gold italic">chiến dịch hiệu quả.</span>
          </h2>
          <div className="gold-divider w-24 mx-auto mt-6" />
        </div>

        {/* Đường nối dọc/ngang chạy xuyên qua các bước (chỉ hiện trên desktop) */}
        <div className="relative grid sm:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8 md:gap-x-12">
          {/* Đường line ngang trang trí ở giữa các hàng - desktop */}
          <div className="hidden lg:block absolute left-0 right-0 top-[60px] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="hidden lg:block absolute left-0 right-0 top-[calc(50%+30px)] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          {steps.map((s, idx) => {
            const isVisible = visible.has(idx);
            return (
              <div
                key={s.n}
                ref={(el) => (refs.current[idx] = el)}
                className={`group relative text-center transition-all duration-700 ease-out ${
                  isVisible
                    ? "opacity-100 translate-y-0 blur-0"
                    : "opacity-0 translate-y-10 blur-sm"
                }`}
              >
                {/* Card chứa nội dung mỗi bước, có hiệu ứng hover tinh tế */}
                <div className="relative px-4 py-6 rounded-xl transition-all duration-500 hover:bg-background/60 hover:shadow-gold-ring hover:-translate-y-2">
                  {/* Vòng tròn xoay nhẹ phía sau số thứ tự khi hover */}
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full border border-primary/20 opacity-0 group-hover:opacity-100 group-hover:animate-spin-slow transition-opacity duration-500" />
                    <div className="absolute inset-1 rounded-full border border-primary/10 opacity-0 group-hover:opacity-100 group-hover:animate-spin-reverse transition-opacity duration-500" />

                    {/* Khung số thứ tự */}
                    <div className="relative w-16 h-16 mx-auto mt-2 border border-primary/40 bg-background flex items-center justify-center transition-all duration-500 group-hover:border-primary group-hover:shadow-soft group-hover:scale-110">
                      <span className="font-display text-2xl text-gold">
                        {s.n}
                      </span>
                      {/* Glow vàng mờ phía sau số khi hover */}
                      <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                    </div>
                  </div>

                  <h3 className="font-display text-2xl mb-1 transition-colors duration-300 group-hover:text-gold">
                    {s.title}
                  </h3>
                  <div className="font-display text-base text-foreground/50 italic mb-3 transition-colors duration-300 group-hover:text-gold/70">
                    {s.subtitle}
                  </div>

                  {/* Đường vàng nhỏ xuất hiện khi hover */}
                  <div className="h-px w-0 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-3 transition-all duration-500 group-hover:w-16" />

                  <p className="text-foreground/60 text-sm leading-relaxed font-light max-w-[260px] mx-auto">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
