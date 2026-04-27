import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { Sparkles, type LucideIcon } from "lucide-react";
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

// Replace these URLs with your actual images
const SERVICE_IMAGES: string[][] = [
  [
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=300&fit=crop",
  ],
  [
    "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=600&fit=crop",
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=600&fit=crop",
    "https://images.unsplash.com/photo-1492681290082-e932832941e6?w=400&h=600&fit=crop",
  ],
  [
    "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&h=500&fit=crop",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=500&fit=crop",
  ],
];

const KOL_NAMES = [
  { name: "Linh Anh", tag: "BEAUTY · 606K" },
  { name: "Minh Tú", tag: "LIFESTYLE · 826K" },
  { name: "Hà My", tag: "FOOD · 1.2M" },
  { name: "Quang Huy", tag: "FITNESS · 405K" },
  { name: "Mai Phương", tag: "FAMILY · 921K" },
  { name: "Bảo Trân", tag: "FASHION · 1.8M" },
];

const VIDEO_LABELS = [
  { label: "Review serum mới về ♥", handle: "@tika.network" },
  { label: "Unbox bất ngờ 🎁", handle: "@tika.network" },
  { label: "Test thử có ngon không?", handle: "@tika.network" },
];

const STORE_LABELS = [
  { label: "Check-in quán mới 🔥", handle: "@tika.network" },
  { label: "Live tại store 💄", handle: "@tika.network" },
  { label: "Ăn gì hôm nay nè!", handle: "@tika.network" },
];

function KolGrid() {
  const imgs = SERVICE_IMAGES[0];
  return (
    <div className="grid grid-cols-3 gap-2 w-full">
      {imgs.map((src, i) => (
        <div key={i} className="relative overflow-hidden rounded-md aspect-[3/4]">
          <img src={src} alt={KOL_NAMES[i]?.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-1.5 left-2">
            <p className="text-white text-[10px] font-semibold leading-tight">{KOL_NAMES[i]?.name}</p>
            <p className="text-white/70 text-[9px] leading-tight">{KOL_NAMES[i]?.tag}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function VideoGrid({ imgIndex, labels }: { imgIndex: number; labels: typeof VIDEO_LABELS }) {
  const imgs = SERVICE_IMAGES[imgIndex];
  const isPhone = imgIndex === 1;
  return (
    <div className="flex gap-2 w-full justify-center">
      {imgs.map((src, i) => (
        <div
          key={i}
          className={`relative overflow-hidden rounded-xl flex-1 ${isPhone ? "aspect-[9/16]" : "aspect-[3/4]"} ${i === 0 && isPhone ? "scale-105 z-10 shadow-lg" : ""}`}
        >
          <img src={src} alt={labels[i]?.label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-9 h-9 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-4 h-4 text-white fill-white ml-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          {/* TikTok-like side icons */}
          <div className="absolute right-1.5 bottom-16 flex flex-col items-center gap-3">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>
          </div>
          <div className="absolute bottom-2 left-2 right-6">
            <p className="text-white text-[9px] font-medium leading-tight truncate">{labels[i]?.label}</p>
            <p className="text-white/60 text-[8px]">{labels[i]?.handle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

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
    <section id="services" className="py-24 md:py-32 bg-[#f7f4f0] relative overflow-hidden">
      <div className="container relative max-w-5xl">
        <Reveal className="max-w-3xl mx-auto text-center mb-16">
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
          <div className="flex flex-col gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-white/60 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {items.map((s, idx) => {
              const Icon = getIcon(s.icon);
              const num = String(idx + 1).padStart(2, "0");
              const isEven = idx % 2 === 1;

              const mediaEl =
                idx === 0 ? (
                  <KolGrid />
                ) : idx === 1 ? (
                  <VideoGrid imgIndex={1} labels={VIDEO_LABELS} />
                ) : (
                  <VideoGrid imgIndex={2} labels={STORE_LABELS} />
                );

              return (
                <Reveal key={s.id} delay={idx * 80}>
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className={`flex flex-col md:flex-row ${isEven ? "md:flex-row-reverse" : ""}`}>
                      {/* Media side */}
                      <div className="md:w-1/2 p-5 bg-white flex items-center justify-center min-h-[260px]">
                        {mediaEl}
                      </div>

                      {/* Text side */}
                      <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center relative">
                        {/* Step number watermark */}
                        <span className="absolute top-4 right-6 font-display text-7xl font-bold text-[#e8d5b0]/60 leading-none select-none">
                          {num}
                        </span>

                        {/* Icon badge */}
                        <div className="w-10 h-10 border border-[#c9a96e]/40 rounded-md flex items-center justify-center text-[#c9a96e] mb-5">
                          <Icon className="w-5 h-5" strokeWidth={1.5} />
                        </div>

                        <h3 className="font-display text-2xl md:text-3xl font-semibold mb-3 leading-snug text-[#1a1a1a]">
                          {s.name}
                        </h3>

                        {s.description && (
                          <p className="text-[#6b6b6b] text-sm leading-relaxed mb-6">
                            {s.description}
                          </p>
                        )}

                        {s.price_range && (
                          <div>
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#1a1a1a] border border-[#1a1a1a]/20 rounded-full px-3 py-1">
                              <span className="text-[#c9a96e]">●</span>
                              {s.price_range}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
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
