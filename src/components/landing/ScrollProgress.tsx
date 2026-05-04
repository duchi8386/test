import { useEffect, useState } from "react";

const ScrollProgress = () => {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY;
      const total =
        document.documentElement.scrollHeight - window.innerHeight;
      setPct(total > 0 ? Math.min((scrolled / total) * 100, 100) : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 z-[200] h-[2.5px] origin-left pointer-events-none"
      style={{
        width: `${pct}%`,
        background:
          "linear-gradient(90deg, hsl(42 70% 45%), hsl(45 80% 60%), hsl(42 70% 45%))",
        boxShadow: "0 0 6px hsl(45 80% 60% / 0.6)",
        transition: "width 80ms linear",
      }}
    />
  );
};

export default ScrollProgress;
