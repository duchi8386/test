import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import zaloIcon from "@/assets/zalo.png";
import messengerIcon from "@/assets/messenger.png";

const FloatingActions = () => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <a
        href="https://zalo.me/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Liên hệ qua Zalo"
        className="group relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center transition-all duration-300 hover:scale-110 animate-float-slow"
      >
        <span className="absolute inset-0 rounded-full animate-ping bg-primary/20" aria-hidden />
        <img src={zaloIcon} alt="Zalo" className="relative w-full h-full object-contain drop-shadow-[0_4px_12px_hsl(var(--primary)/0.4)]" />
        <span className="absolute right-full mr-3 whitespace-nowrap bg-card border border-border px-3 py-1.5 text-xs uppercase tracking-[0.15em] text-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat Zalo
        </span>
      </a>

      <a
        href="https://m.me/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Liên hệ qua Messenger"
        className="group relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center transition-all duration-300 hover:scale-110 animate-float-fast"
      >
        <img src={messengerIcon} alt="Messenger" className="relative w-full h-full object-contain drop-shadow-[0_4px_12px_hsl(var(--primary)/0.4)]" />
        <span className="absolute right-full mr-3 whitespace-nowrap bg-card border border-border px-3 py-1.5 text-xs uppercase tracking-[0.15em] text-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Messenger
        </span>
      </a>

      <button
        onClick={scrollTop}
        aria-label="Cuộn lên đầu trang"
        className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-primary text-primary-foreground border border-primary shadow-pop hover:scale-110 transition-all duration-300 ${
          showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <ArrowUp className="w-5 h-5 md:w-6 md:h-6" />
      </button>
    </div>
  );
};

export default FloatingActions;
