import { useEffect, useRef } from "react";

/**
 * Soft golden radial glow that follows the cursor on desktop.
 * Uses mix-blend-mode:overlay + high z-index so it shows above section backgrounds
 * without blocking clicks (pointer-events-none).
 * Direct DOM mutation → 60fps, no re-renders.
 */
const CursorGlow = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const SIZE = 560;
    const HALF = SIZE / 2;

    const move = (e: MouseEvent) => {
      if (!ref.current) return;
      ref.current.style.transform = `translate(${e.clientX - HALF}px, ${e.clientY - HALF}px)`;
      ref.current.style.opacity = "1";
    };

    const hide = () => {
      if (ref.current) ref.current.style.opacity = "0";
    };

    window.addEventListener("mousemove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", hide);
    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", hide);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed top-0 left-0 pointer-events-none hidden md:block"
      style={{
        width:        560,
        height:       560,
        borderRadius: "50%",
        opacity:      0,
        zIndex:       9998,
        willChange:   "transform, opacity",
        transition:   "transform 0.1s ease-out, opacity 0.5s ease",
        mixBlendMode: "overlay",
        background:
          "radial-gradient(circle, hsl(42 70% 55% / 0.45) 0%, hsl(45 80% 60% / 0.2) 40%, transparent 70%)",
      }}
    />
  );
};

export default CursorGlow;
