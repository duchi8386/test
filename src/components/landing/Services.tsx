import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { Sparkles, ArrowUpRight, type LucideIcon } from "lucide-react";
import Reveal from "@/components/Reveal";
import { supabase } from "@/integrations/supabase/client";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price_range: string | null;
  icon: string | null;
  sort_order: number | null;
}

const getIcon = (name: string | null | undefined): LucideIcon => {
  if (!name) return Sparkles;
  const Comp = (Icons as unknown as Record<string, LucideIcon>)[name];
  return Comp ?? Sparkles;
};

const Services = () => {
  const [items, setItems] = useState<Service[]>([]);

  useEffect(() => {
    supabase
      .from("services")
      .select("id,name,description,price_range,icon,sort_order")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true })
      .then(({ data }) => setItems(data ?? []));
  }, []);

  return (
    <section id="services" className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container relative">
        <Reveal className="max-w-3xl mx-auto text-center mb-20">
          <span className="inline-block text-sm md:text-base font-medium uppercase tracking-[0.3em] text-primary mb-5">
            — Dịch vụ của chúng tôi —
          </span>
          <h2 className="font-display font-medium text-4xl md:text-6xl mb-6 leading-[1.1]">
            Giải pháp trọn gói cho<br />
            <span className="text-gold italic">thương hiệu của bạn.</span>
          </h2>
          <div className="gold-divider w-24 mx-auto mb-6" />
          <p className="text-foreground/60 text-lg font-light">
            Từ sản xuất nội dung đến kết nối KOLs — TIKA Network mang đến hệ sinh thái dịch vụ hoàn chỉnh ở đẳng cấp cao nhất.
          </p>
        </Reveal>

        {items.length === 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-72 rounded-sm bg-card/50 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((s, idx) => {
              const Icon = getIcon(s.icon);
              const num = String(idx + 1).padStart(2, "0");
              return (
                <Reveal key={s.id} delay={idx * 100}>
                  <article className="group relative h-full bg-card border border-border/60 p-8 md:p-10 transition-all duration-500 hover:border-primary/60 hover:-translate-y-1 hover:shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.25)] overflow-hidden">
                    {/* Gold accent corner */}
                    <div
                      aria-hidden
                      className="absolute -top-px -right-px w-16 h-16 bg-gradient-to-bl from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                    {/* Number watermark */}
                    <div className="font-display text-7xl text-primary/10 absolute top-4 right-6 group-hover:text-primary/25 transition-colors duration-500 leading-none">
                      {num}
                    </div>

                    <div className="relative">
                      <div className="w-14 h-14 border border-primary/40 flex items-center justify-center mb-8 text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-500">
                        <Icon className="w-6 h-6" strokeWidth={1.5} />
                      </div>

                      <h3 className="font-display text-2xl md:text-3xl mb-4 leading-tight">
                        {s.name}
                      </h3>

                      <div className="w-10 h-px bg-primary/40 mb-4 group-hover:w-20 transition-all duration-500" />

                      {s.description && (
                        <p className="text-foreground/60 leading-relaxed font-light text-[15px] mb-6">
                          {s.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/40">
                        {s.price_range ? (
                          <span className="text-xs uppercase tracking-[0.2em] text-foreground/50">
                            <span className="text-primary">●</span> {s.price_range}
                          </span>
                        ) : (
                          <span />
                        )}
                        <ArrowUpRight className="w-5 h-5 text-foreground/30 group-hover:text-primary group-hover:rotate-45 transition-all duration-500" />
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
