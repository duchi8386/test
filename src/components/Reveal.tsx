// Component wrapper kích hoạt hiệu ứng fade + trượt lên khi cuộn vào viewport.
// Dùng IntersectionObserver, hỗ trợ stagger qua prop `delay` (ms).
import { useEffect, useRef, useState, type ReactNode, type ElementType } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  /** Độ trễ tính bằng mili-giây — dùng để tạo hiệu ứng stagger giữa các phần tử kề nhau */
  delay?: number;
  /** Tag muốn render (mặc định div) */
  as?: ElementType;
  className?: string;
  /** Chỉ chạy một lần (mặc định true) */
  once?: boolean;
}

const Reveal = ({ children, delay = 0, as, className, once = true }: RevealProps) => {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Người dùng đã bật reduced motion → hiện luôn, không animate
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            if (once) io.disconnect();
          } else if (!once) {
            setShown(false);
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref as never}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform",
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        className
      )}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
