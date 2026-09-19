import { useEffect, useRef, useState } from "react";
import { Arrow } from "../lib/ui";

const LINKS = [
  { label: "Explore", href: "#network" },
  { label: "How it works", href: "#how" },
  { label: "For Creators", href: "#agents" },
  { label: "For Brands", href: "#negotiation" },
  { label: "Pricing", href: "#platform" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); toggle.current?.focus(); }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActive(`#${entry.target.id}`);
      }
    }, { rootMargin: "-15% 0px -55% 0px", threshold: 0 });
    document.querySelectorAll("main > section").forEach((section) => observer.observe(section));
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      observer.disconnect();
    };
  }, []);

  return (
    <header className={`nav ${scrolled || open ? "scrolled" : ""}`}>
      <div className="nav-inner">
        <a href="#top" className="nav-logo" aria-label="Pact home"><span className="nav-mark" />PACT</a>
        <nav id="primary-navigation" aria-label="Main navigation" className={`nav-links ${open ? "open" : ""}`}>
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} aria-current={active === l.href ? "location" : undefined} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <a href="#cta" className="btn btn-primary nav-cta-mobile" onClick={() => setOpen(false)}>Create your agent <Arrow /></a>
        </nav>
        <div className="nav-right">
          <a href="#cta" className="btn btn-primary nav-cta">Create your agent <Arrow /></a>
          <button ref={toggle} className={`nav-burger ${open ? "open" : ""}`} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}><span /><span /></button>
        </div>
      </div>
    </header>
  );
}
