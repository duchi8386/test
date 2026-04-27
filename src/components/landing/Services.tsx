import { useEffect, useRef, useState } from "react";
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

interface ServiceMedia {
  id: string;
  service_id: string;
  type: string;
  url: string;
  thumbnail_url: string | null;
  label: string | null;
  handle: string | null;
  sort_order: number;
}

const getIcon = (name: string | null | undefined): LucideIcon => {
  if (!name) return Sparkles;
  const Comp = (Icons as unknown as Record<string, LucideIcon>)[name];
  return Comp ?? Sparkles;
};

// Static media for service index 0 (KOL grid) and index 2 (Store) — not managed from DB
const STATIC_KOL = [
  { url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=400&fit=crop", name: "Linh Anh", tag: "BEAUTY · 606K" },
  { url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=400&fit=crop", name: "Minh Tú", tag: "LIFESTYLE · 826K" },
  { url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=400&fit=crop", name: "Hà My", tag: "FOOD · 1.2M" },
  { url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=400&fit=crop", name: "Quang Huy", tag: "FITNESS · 405K" },
  { url: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=300&h=400&fit=crop", name: "Mai Phương", tag: "FAMILY · 921K" },
  { url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=400&fit=crop", name: "Bảo Trân", tag: "FASHION · 1.8M" },
];

const STATIC_STORE = [
  { url: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400&h=500&fit=crop", label: "Check-in quán mới 🔥" },
  { url: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&h=500&fit=crop", label: "Live tại store 💄" },
  { url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=500&fit=crop", label: "Ăn gì hôm nay nè!" },
];

function MediaItem({ item, index, isPhone }: { item: ServiceMedia; index: number; isPhone: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const isVideo = item.type === "video";

  const handleClick = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  const handleEnded = () => setPlaying(false);

  return (
    <div
      className={`group/vid relative overflow-hidden rounded-xl flex-1 cursor-pointer ${isPhone ? "aspect-[9/16]" : "aspect-[3/4]"} ${index === 0 && isPhone ? "scale-105 z-10 shadow-lg" : ""}`}
      onClick={handleClick}
    >
      {isVideo ? (
        <video
          ref={videoRef}
          src={item.url}
          poster={item.thumbnail_url ?? undefined}
          muted
          loop
          playsInline
          preload="metadata"
          onEnded={handleEnded}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover/vid:scale-110"
        />
      ) : (
        <img
          src={item.url}
          alt={item.label ?? ""}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover/vid:scale-110"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-300 group-hover/vid:from-black/65" />

      {/* Play / Pause button */}
      {isVideo && (
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${playing ? "opacity-0 group-hover/vid:opacity-100" : "opacity-100"}`}>
          <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center group-hover/vid:bg-white/50 transition-all duration-300 group-hover/vid:scale-110">
            {playing ? (
              <svg className="w-4 h-4 text-white fill-white" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-white fill-white ml-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>
        </div>
      )}

      {/* TikTok-like side icons */}
      <div className="absolute right-1.5 bottom-16 flex flex-col items-center gap-3">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>
      </div>
      <div className="absolute bottom-2 left-2 right-6 transition-transform duration-300 group-hover/vid:-translate-y-1">
        {item.label && <p className="text-white text-[9px] font-medium leading-tight truncate">{item.label}</p>}
        {item.handle && <p className="text-white/60 text-[8px]">{item.handle}</p>}
      </div>
    </div>
  );
}

function KolGrid() {
  return (
    <div className="grid grid-cols-3 gap-2 w-full">
      {STATIC_KOL.map((kol, i) => (
        <div key={i} className="group/img relative overflow-hidden rounded-md aspect-[3/4] cursor-pointer">
          <img
            src={kol.url}
            alt={kol.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover/img:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 group-hover/img:from-black/75" />
          <div className="absolute bottom-1.5 left-2 transition-transform duration-300 group-hover/img:-translate-y-1">
            <p className="text-white text-[10px] font-semibold leading-tight">{kol.name}</p>
            <p className="text-white/70 text-[9px] leading-tight">{kol.tag}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function StoreGrid() {
  return (
    <div className="flex gap-2 w-full justify-center">
      {STATIC_STORE.map((item, i) => (
        <div key={i} className="group/vid relative overflow-hidden rounded-xl flex-1 aspect-[3/4] cursor-pointer">
          <img
            src={item.url}
            alt={item.label}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover/vid:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-300 group-hover/vid:from-black/65" />
          <div className="absolute inset-0 flex items-center justify-center group-hover/vid:opacity-0 transition-opacity duration-300">
            <div className="w-9 h-9 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-4 h-4 text-white fill-white ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </div>
          </div>
          <div className="absolute bottom-2 left-2 right-2 transition-transform duration-300 group-hover/vid:-translate-y-1">
            <p className="text-white text-[9px] font-medium leading-tight truncate">{item.label}</p>
            <p className="text-white/60 text-[8px]">@tika.network</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function VideoGrid({ media }: { media: ServiceMedia[] }) {
  return (
    <div className="flex gap-2 w-full justify-center">
      {media.map((item, i) => (
        <MediaItem key={item.id} item={item} index={i} isPhone={true} />
      ))}
    </div>
  );
}

const Services = () => {
  const [items, setItems] = useState<Service[]>([]);
  const [mediaMap, setMediaMap] = useState<Record<string, ServiceMedia[]>>({});

  useEffect(() => {
    supabase
      .from("services")
      .select("id,name,description,price_range,icon,sort_order")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true })
      .then(({ data }) => setItems(data ?? []));

    supabase
      .from("service_media")
      .select("id,service_id,type,url,thumbnail_url,label,handle,sort_order")
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        console.log("[service_media] data:", data);
        console.log("[service_media] error:", error);
        const grouped: Record<string, ServiceMedia[]> = {};
        for (const row of data ?? []) {
          if (!grouped[row.service_id]) grouped[row.service_id] = [];
          grouped[row.service_id].push(row);
        }
        console.log("[service_media] grouped:", grouped);
        setMediaMap(grouped);
      });
  }, []);

  return (
    <section id="services" className="py-24 md:py-32 bg-[#f7f4f0] relative overflow-hidden">
        <div className="container relative">
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
          <div className="flex flex-col gap-6 w-full ">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-white/60 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-6 w-full ">
            {items.map((s, idx) => {
              const Icon = getIcon(s.icon);
              const num = String(idx + 1).padStart(2, "0");
              const isEven = idx % 2 === 1;
              const media = mediaMap[s.id] ?? [];

              const mediaEl =
                idx === 0 ? (
                  <KolGrid />
                ) : idx === 1 ? (
                  media.length > 0 ? (
                    <VideoGrid media={media} />
                  ) : (
                    <div className="flex gap-2 w-full justify-center">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className={`flex-1 aspect-[9/16] rounded-xl bg-[#f0ebe3] animate-pulse ${i === 1 ? "scale-105" : ""}`} />
                      ))}
                    </div>
                  )
                ) : (
                  <StoreGrid />
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
                      <div className="md:w-1/2 p-10 md:p-14 flex flex-col justify-center relative overflow-hidden">
                        {/* Step number watermark */}
                        <span className="absolute top-3 right-5 font-display text-[6rem] font-bold text-[#e8d5b0]/50 leading-none select-none pointer-events-none">
                          {num}
                        </span>

                        {/* Icon badge */}
                        <div className="w-11 h-11 border border-[#c9a96e]/50 rounded-xl flex items-center justify-center text-[#c9a96e] mb-6 bg-[#fdf8f2]">
                          <Icon className="w-5 h-5" strokeWidth={1.5} />
                        </div>

                        <h3 className="font-display text-3xl md:text-4xl font-semibold mb-2 leading-tight tracking-tight text-[#1a1a1a]">
                          {s.name}
                        </h3>

                        {/* Gold underline accent */}
                        <div className="w-10 h-[2px] bg-[#c9a96e] rounded-full mb-5" />

                        {s.description && (
                          <p className="text-[#737373] text-[15px] leading-[1.75] mb-7 max-w-xs">
                            {s.description}
                          </p>
                        )}

                        {s.price_range && (
                          <div>
                            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#1a1a1a] border border-[#1a1a1a]/15 rounded-full px-4 py-1.5 bg-white/80 backdrop-blur-sm shadow-sm hover:border-[#c9a96e]/60 hover:text-[#c9a96e] transition-colors duration-200 cursor-default">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#c9a96e] inline-block" />
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
