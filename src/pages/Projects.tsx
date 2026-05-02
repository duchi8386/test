import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink, Loader2 } from "lucide-react";

import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import FloatingActions from "@/components/landing/FloatingActions";
import { Button } from "@/components/ui/button";
import { usePublicProjectsList } from "@/hooks/usePublicProjects";

const Projects = () => {
  const { data: projects = [], isLoading, isError } = usePublicProjectsList();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    document.title = "Dự án | TIKA Network";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-80" aria-hidden />
          <div className="container relative py-20 md:py-28">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-foreground/60 hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Về trang chủ
            </Link>
            <div className="max-w-3xl">
              <h1 className="font-[Cormorant_Garamond] text-5xl md:text-7xl leading-[1.05] mb-6 animate-fade-in">
                Những dự án{" "}
                <span className="text-primary italic inline-block pb-2">
                  TIKA đã thực hiện
                </span>
              </h1>
              <p
                className="text-base md:text-lg text-foreground/70 max-w-2xl animate-fade-in"
                style={{ animationDelay: "150ms", animationFillMode: "backwards" }}
              >
                Hơn 200+ chiến dịch đã triển khai cho các thương hiệu trong và ngoài nước —
                từ beauty, công nghệ đến F&B, thời trang và giáo dục.
              </p>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="container py-16 md:py-24">
          {isLoading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <p className="text-center text-destructive py-16 text-sm">
              Không tải được danh sách dự án. Vui lòng thử lại sau.
            </p>
          ) : projects.length === 0 ? (
            <p className="text-center text-foreground/60 py-16">Chưa có dự án nào.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {projects.map((p, i) => (
                <Link
                  to={`/du-an/${p.id}`}
                  key={p.id}
                  className="group flex flex-col animate-fade-in rounded-xl overflow-hidden shadow-card hover:shadow-pop transition-all duration-500 hover:-translate-y-1"
                  style={{ animationDelay: `${i * 60}ms`, animationFillMode: "backwards" }}
                >
                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={`${p.title} — ${p.brands?.name ?? ""}`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-foreground/30 text-xs">
                        Chưa có ảnh
                      </div>
                    )}
                    {p.year && (
                      <div className="absolute top-3 right-3 text-[9px] uppercase tracking-[0.2em] text-primary-foreground bg-primary/80 backdrop-blur-sm px-2 py-0.5 rounded-sm">
                        {p.year}
                      </div>
                    )}
                  </div>

                  {/* Bottom bar */}
                  <div className="bg-gold flex items-center justify-center gap-1.5 px-3 py-5">
                    <h3 className="font-[Cormorant_Garamond] text-xl md:text-2xl leading-snug text-white text-center tracking-wide">
                     Dự án {p.title}
                    </h3>
                    <ArrowRight className="w-3.5 h-3.5 text-white/70 shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="border-t border-border/60 bg-secondary/30">
          <div className="container py-16 md:py-20 text-center">
            <h2 className="font-[Cormorant_Garamond] text-4xl md:text-5xl leading-[1.2] mb-4">
              Sẵn sàng cho dự án{" "}
              <span className="text-primary italic inline-block pb-2">
                tiếp theo?
              </span>
            </h2>
            <p className="text-foreground/70 mb-8 max-w-xl mx-auto">
              Hãy để TIKA Network đồng hành cùng thương hiệu của bạn trong chiến dịch sắp tới.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/#contact">
                Đăng ký tư vấn
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
};

export default Projects;
