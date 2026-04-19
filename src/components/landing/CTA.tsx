import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import banner from "@/assets/tika-banner.png";
import Reveal from "@/components/Reveal";

const CTA = () => {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container">
        <div
          className="relative overflow-hidden border border-primary/30 px-8 py-20 md:p-24 text-center bg-cover bg-center"
          style={{ backgroundImage: `url(${banner})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/60" aria-hidden />
          <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary" aria-hidden />
          <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-primary" aria-hidden />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-primary" aria-hidden />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary" aria-hidden />

          <div className="relative max-w-3xl mx-auto">
            <Reveal>
              <span className="inline-block text-sm md:text-base font-medium uppercase tracking-[0.3em] text-primary mb-6">
                — Sẵn sàng khi bạn cần —
              </span>
            </Reveal>
            <Reveal delay={120}>
              <h2 className="font-display font-medium text-4xl md:text-7xl leading-[1.05] mb-6">
                Khởi động chiến dịch <span className="text-gold italic">tiếp theo.</span>
              </h2>
              <div className="gold-divider w-24 mx-auto mb-6" />
              <p className="text-foreground/70 text-lg mb-10 font-light max-w-xl mx-auto">
                Trải nghiệm tư vấn miễn phí. Không cần thẻ tín dụng.
              </p>
            </Reveal>
            <Reveal delay={280} className="flex flex-wrap gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <a href="#contact">Bắt đầu miễn phí <ArrowRight className="w-4 h-4" /></a>
              </Button>
              <Button variant="soft" size="xl" asChild>
                <a href="#contact">Đặt lịch demo</a>
              </Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
