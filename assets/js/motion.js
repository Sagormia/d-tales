/* D-Tales — GSAP motion layer. Progressive: site works fully without it. */
(() => {
  "use strict";
  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.registerPlugin(ScrollTrigger);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const mm = gsap.matchMedia();

  /* Logo + header entrance */
  gsap.from(".brand-logo", { y: -14, opacity: 0, duration: 0.9, ease: "power3.out" });
  gsap.from(".primary-nav .nav-link", { y: -12, opacity: 0, duration: 0.7, stagger: 0.06, delay: 0.15, ease: "power3.out" });

  /* Hero: title drifts and fades as you scroll away */
  const title = document.querySelector(".hero-title");
  if (title) gsap.to(title, { yPercent: -12, opacity: 0.35, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  /* Parallax on large images (scrubbed, GPU transforms only) */
  mm.add("(min-width: 768px)", () => {
    $$(".hero-feature-media img, .project-card figure img, .page-hero img").forEach((el) => {
      gsap.fromTo(el, { yPercent: -6, scale: 1.1 }, {
        yPercent: 6, scale: 1.1, ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
      });
    });
  });

  /* Stat numbers: count up on enter (children only, avoids .reveal conflict) */
  $$(".stat-value").forEach((el) => {
    const m = el.textContent.trim().match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
    if (!m) return;
    const end = parseFloat(m[2]), o = { v: 0 };
    el.setAttribute("aria-label", el.textContent.trim());
    ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: () =>
      gsap.to(o, { v: end, duration: 1.6, ease: "power2.out", onUpdate: () => { el.textContent = m[1] + Math.round(o.v) + m[3]; } }) });
  });
  /* Award rows: number + text slide in */
  $$(".award-row").forEach((row) => {
    gsap.from(row.children, { x: -24, opacity: 0, duration: 0.8, stagger: 0.08, ease: "power3.out",
      scrollTrigger: { trigger: row, start: "top 88%", once: true } });
  });

  /* Service rows: slide + hover nudge */
  $$(".service-row").forEach((row) => {
    const icon = row.querySelector(".service-row-icon");
    if (!icon) return;
    row.addEventListener("mouseenter", () => gsap.to(icon, { rotate: 90, duration: 0.45, ease: "back.out(2)" }));
    row.addEventListener("mouseleave", () => gsap.to(icon, { rotate: 0, duration: 0.4, ease: "power2.out" }));
  });

  /* Footer headline: scrubbed rise */
  const ft = document.querySelector(".footer-title");
  if (ft) gsap.from(ft, { yPercent: 18, opacity: 0.2, ease: "none", scrollTrigger: { trigger: ft, start: "top 105%", end: "top 55%", scrub: true } });

  /* Magnetic buttons */
  if (fine) {
    $$(".btn").forEach((btn) => {
      const x = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3.out" });
      const y = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3.out" });
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        x((e.clientX - r.left - r.width / 2) * 0.25);
        y((e.clientY - r.top - r.height / 2) * 0.35);
      });
      btn.addEventListener("mouseleave", () => { x(0); y(0); });
    });
  }

  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
