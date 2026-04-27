import { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2, X, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import FloatingActions from "@/components/landing/FloatingActions";
import { Button } from "@/components/ui/button";
import { usePublicProjectById, usePublicProjectsList } from "@/hooks/usePublicProjects";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading, isError } = usePublicProjectById(id);
  const { data: list = [] } = usePublicProjectsList();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const gallery = Array.isArray(project?.gallery_urls) ? (project.gallery_urls as string[]) : [];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    if (project) document.title = `${project.title} | TIKA Network`;
  }, [project]);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowRight") setLightboxIdx((i) => (i === null ? 0 : (i + 1) % gallery.length));
      if (e.key === "ArrowLeft") setLightboxIdx((i) => (i === null ? 0 : (i - 1 + gallery.length) % gallery.length));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIdx, gallery.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !project) return <Navigate to="/du-an" replace />;

  const currentIdx = list.findIndex((p) => p.id === project.id);
  const nextProject = list.length > 1
    ? list[(currentIdx + 1) % list.length]
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Header */}
        <section className="container py-12 md:py-20">
          <Link
            to="/du-an"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-foreground/60 hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Tất cả dự án
          </Link>

          <div className="text-[11px] uppercase tracking-[0.3em] text-primary mb-3">
            {project.brands?.name ?? "Dự án"}
          </div>
          <h1 className="font-[Cormorant_Garamond] text-4xl md:text-6xl lg:text-7xl leading-[1.05] mb-6 max-w-4xl">
            {project.title}
          </h1>
          <p className="text-base md:text-lg text-foreground/70 max-w-2xl">
            {project.description ?? ""}
          </p>
        </section>

        {/* Cover image */}
        <section className="container">
          <div className="overflow-hidden bg-muted aspect-[16/9]">
            {project.image_url ? (
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-foreground/30 text-sm">
                Chưa có ảnh bìa
              </div>
            )}
          </div>
        </section>

        {/* Gallery */}
        {gallery.length > 0 && (
          <section className="container py-12 md:py-16">
            <div className="text-[11px] uppercase tracking-[0.3em] text-foreground/50 mb-6">
              Thư viện ảnh
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {gallery.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setLightboxIdx(idx)}
                  className="group overflow-hidden bg-muted aspect-[9/16] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <img
                    src={url}
                    alt={`${project!.title} — ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Next + CTA */}
        <section className="border-t border-border/60">
          <div className="container py-12 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
              {nextProject && (
                <div>
                  <div className="text-[11px] uppercase tracking-[0.3em] text-foreground/50 mb-3">
                    Dự án tiếp theo
                  </div>
                  <Link to={`/du-an/${nextProject.id}`} className="group inline-flex flex-col gap-2">
                    <h3 className="font-[Cormorant_Garamond] text-3xl md:text-4xl group-hover:text-primary transition-colors">
                      {nextProject.title}
                    </h3>
                    <span className="inline-flex items-center gap-2 text-sm text-primary">
                      Xem chi tiết
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </div>
              )}
              <div className={nextProject ? "text-center md:text-right" : "col-span-full text-center"}>
                <h4 className="font-[Cormorant_Garamond] text-2xl md:text-3xl mb-4">
                  Bạn cũng có một dự án?
                </h4>
                <Button variant="hero" size="lg" asChild>
                  <Link to="/#contact">Đăng ký tư vấn</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingActions />

      {/* Lightbox */}
      {lightboxIdx !== null && gallery.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setLightboxIdx(null)}
        >
          {/* Close */}
          <button
            type="button"
            onClick={() => setLightboxIdx(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            aria-label="Đóng"
          >
            <X className="w-7 h-7" />
          </button>

          {/* Prev */}
          {gallery.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setLightboxIdx((lightboxIdx - 1 + gallery.length) % gallery.length); }}
              className="absolute left-3 md:left-6 text-white/70 hover:text-white transition-colors"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="w-9 h-9" />
            </button>
          )}

          {/* Image */}
          <img
            src={gallery[lightboxIdx]}
            alt={`${project!.title} — ${lightboxIdx + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain select-none"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          {gallery.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setLightboxIdx((lightboxIdx + 1) % gallery.length); }}
              className="absolute right-3 md:right-6 text-white/70 hover:text-white transition-colors"
              aria-label="Ảnh tiếp"
            >
              <ChevronRight className="w-9 h-9" />
            </button>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-widest">
            {lightboxIdx + 1} / {gallery.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
