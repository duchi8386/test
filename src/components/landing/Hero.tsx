import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import banner from "@/assets/tika-banner.png";
import logo from "@/assets/tika-logo.png";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-hero">
      <div
        className="absolute inset-0 opacity-60 mix-blend-screen pointer-events-none bg-no-repeat bg-cover dark:opacity-60"
        style={{ backgroundImage: `url(${banner})`, backgroundPosition: 'right center' }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" aria-hidden />

      <div className="container relative pt-16 pb-24 md:pt-24 md:pb-36 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-8 animate-pop-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-primary/30 text-xs uppercase tracking-[0.25em] text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            Mạng lưới Influencer cao cấp
          </div>

          <h1 className="font-display font-medium text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.02] tracking-tight [perspective:1200px] [transform-style:preserve-3d]">
            <span className="text-gold italic inline-block animate-title-3d animate-shimmer-text bg-[length:200%_auto] drop-shadow-[0_15px_25px_hsl(var(--primary)/0.35)]">Influencer Marketing</span><br />
            <span className="inline-block animate-title-3d drop-shadow-[0_15px_25px_hsl(var(--foreground)/0.2)]" style={{ animationDelay: '0.25s' }}>Agency</span>
          </h1>

          <div className="gold-divider w-32" />

          <p className="text-lg md:text-xl text-foreground/70 max-w-xl leading-relaxed font-light">
            Mạng lưới Influencer kết nối nhãn hàng với người nổi tiếng, kiến tạo những câu chuyện thương hiệu có
            <span className="text-foreground"> sức lay động và khả năng lan tỏa mạnh mẽ</span>. Với mạng lưới hơn KOL,
            Reviewer đa nền tảng, Tika Network cam kết tối ưu hóa hiệu quả truyền thông và mang lại giá trị chuyển
            đổi thực chất cho doanh nghiệp.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Button variant="hero" size="xl" asChild>
              <a href="#contact">Bắt đầu chiến dịch <ArrowRight className="w-4 h-4" /></a>
            </Button>
            <Button variant="soft" size="xl" asChild>
              <a href="#creators">Xem KOLs</a>
            </Button>
          </div>

          <div className="flex items-center gap-8 pt-6">
            <div>
              <div className="font-display text-3xl text-gold">500<span className="text-primary">+</span></div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 mt-1">Nhãn hàng tin chọn</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div>
              <div className="font-display text-3xl text-gold">2000<span className="text-primary">+</span></div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 mt-1">Chiến dịch triển khai</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative animate-pop-in" style={{ animationDelay: '0.15s' }}>
          <div className="relative aspect-square max-w-md mx-auto group">
            <div className="absolute inset-8 bg-primary/20 blur-3xl rounded-full animate-pulse-glow" aria-hidden />
            <div className="absolute inset-0 border border-primary/30 animate-spin-slow" aria-hidden />
            <div className="absolute inset-4 border border-primary/15 animate-spin-reverse" aria-hidden />
            <div className="absolute inset-12 border border-primary/10 rounded-full" aria-hidden />

            <div className="relative h-full w-full flex items-center justify-center p-12 animate-float-slow">
              <img
                src={logo}
                alt="TIKA Network monogram"
                width={1024}
                height={1024}
                className="w-full h-full object-contain drop-shadow-[0_0_40px_hsl(var(--primary)/0.4)] transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3"
              />
            </div>

            <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-primary" aria-hidden />
            <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-primary" aria-hidden />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-primary" aria-hidden />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-primary" aria-hidden />



          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
