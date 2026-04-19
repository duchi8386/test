import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/tika-logo.png";


const links = [
  { label: "Mạng lưới", href: "#platform" },
  { label: "Dịch vụ", href: "#services" },
  { label: "Dự án", href: "/du-an" },
  { label: "Quy trình", href: "#how" },
  { label: "Liên hệ", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>(links[0].href);
  const [indicator, setIndicator] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  
  const navigate = useNavigate();
  const location = useLocation();
  const isProjectsPage = location.pathname.startsWith("/du-an");

  // Track active section via IntersectionObserver
  useEffect(() => {
    if (isProjectsPage) {
      setActive("/du-an");
      return;
    }
    const sections = links
      .filter((l) => l.href.startsWith("#"))
      .map((l) => document.querySelector(l.href))
      .filter((el): el is Element => !!el);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActive(`#${visible[0].target.id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isProjectsPage]);

  // Move underline indicator under active item
  useEffect(() => {
    const el = itemRefs.current[active];
    const list = listRef.current;
    if (!el || !list) {
      setIndicator((p) => ({ ...p, opacity: 0 }));
      return;
    }
    const listRect = list.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    setIndicator({
      left: rect.left - listRect.left,
      width: rect.width,
      opacity: 1,
    });
  }, [active]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Route navigation (non-hash)
    if (!href.startsWith("#")) {
      e.preventDefault();
      setActive(href);
      setOpen(false);
      navigate(href);
      return;
    }
    // Hash navigation — if not on home, go home then scroll
    if (isProjectsPage) {
      e.preventDefault();
      setOpen(false);
      navigate("/" + href);
      return;
    }
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    setActive(href);
    const top = (target as HTMLElement).getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
    history.replaceState(null, "", href);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/60">
      <nav className="container flex items-center justify-between h-24 md:h-28">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            if (isProjectsPage) {
              navigate("/");
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
            setOpen(false);
          }}
          className="flex items-center gap-3 group"
        >
          <img
            src={logo}
            alt="TIKA Network"
            width={128}
            height={128}
            className="h-20 md:h-28 w-auto transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
          />
        </a>

        <ul ref={listRef} className="hidden md:flex items-center gap-10 relative">
          {links.map((l) => {
            const isActive = active === l.href;
            return (
              <li key={l.href}>
                <a
                  ref={(el) => (itemRefs.current[l.href] = el)}
                  href={l.href}
                  onClick={(e) => handleClick(e, l.href)}
                  className={`relative inline-block py-2 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                    isActive ? "text-primary" : "text-foreground/70 hover:text-primary"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            );
          })}
          <span
            className="pointer-events-none absolute -bottom-1 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-500 ease-out"
            style={{
              left: `${indicator.left}px`,
              width: `${indicator.width}px`,
              opacity: indicator.opacity,
            }}
            aria-hidden
          />
        </ul>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="hero" size="lg" className="text-sm tracking-[0.25em] px-8" asChild>
            <a href="#contact" onClick={(e) => handleClick(e, "#contact")}>Tư vấn ngay</a>
          </Button>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 hover:bg-secondary transition-colors"
            aria-label="Menu"
          >
            <div className="relative w-5 h-5">
              <Menu
                className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                  open ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
                }`}
              />
              <X
                className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                  open ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      <div
        className={`md:hidden border-t border-border/60 bg-background overflow-hidden transition-all duration-500 ease-out ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="container py-4 flex flex-col gap-1">
          {links.map((l, i) => {
            const isActive = active === l.href;
            return (
              <li
                key={l.href}
                className={`transform transition-all duration-500 ${
                  open ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                }`}
                style={{ transitionDelay: open ? `${i * 60}ms` : "0ms" }}
              >
                <a
                  href={l.href}
                  onClick={(e) => handleClick(e, l.href)}
                  className={`block py-3 px-3 text-xs uppercase tracking-[0.2em] font-medium border-l-2 transition-all duration-300 ${
                    isActive
                      ? "border-primary text-primary bg-primary/5 pl-5"
                      : "border-transparent text-foreground/70 hover:text-primary hover:border-primary/40 hover:pl-5"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            );
          })}
          <li
            className={`pt-2 transform transition-all duration-500 ${
              open ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
            }`}
            style={{ transitionDelay: open ? `${links.length * 60}ms` : "0ms" }}
          >
            <Button variant="hero" size="sm" className="w-full" asChild>
              <a href="#contact" onClick={(e) => handleClick(e, "#contact")}>Tư vấn ngay</a>
            </Button>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
