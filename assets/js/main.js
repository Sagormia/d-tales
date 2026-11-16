/* D-Tales — interactions. Small, dependency-free, progressive. */
(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  /* ——— Header state ————————————————————————————————— */
  const header = $("[data-header]");
  const onScroll = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ——— Mobile menu ——————————————————————————————————— */
  const menu = $("[data-menu]");
  const menuBtn = $("[data-menu-btn]");
  if (menu && menuBtn) {
    let lastFocus = null;
    const setMenu = (open) => {
      document.body.classList.toggle("menu-open", open);
      menu.classList.toggle("is-open", open);
      menu.setAttribute("aria-hidden", String(!open));
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (open) {
        lastFocus = document.activeElement;
        const first = menu.querySelector("a");
        first?.focus({ preventScroll: true });
      } else if (lastFocus) {
        lastFocus.focus({ preventScroll: true });
      }
    };
    menuBtn.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
    $$(".menu-link", menu).forEach((link) => link.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menu.classList.contains("is-open")) setMenu(false);
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1080 && menu.classList.contains("is-open")) setMenu(false);
    });
  }

  /* ——— Reveal on scroll ——————————————————————————————— */
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
    );
    reveals.forEach((element) => observer.observe(element));
  } else {
    reveals.forEach((element) => element.classList.add("is-in"));
  }

  /* ——— Project filters ————————————————————————————————— */
  const filterBar = $("[data-filters]");
  const grid = $("[data-project-grid]");
  if (filterBar && grid) {
    const buttons = $$(".filter", filterBar);
    const cards = $$(".project-card", grid);
    const empty = $("[data-empty]");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        buttons.forEach((other) => {
          const active = other === button;
          other.classList.toggle("is-active", active);
          other.setAttribute("aria-pressed", String(active));
        });
        let visible = 0;
        cards.forEach((card) => {
          const tags = card.dataset.tags || "";
          const show = filter === "all" || tags.split(" ").includes(filter);
          card.hidden = !show;
          if (show) {
            visible += 1;
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
            card.animate(
              [
                { opacity: 0, transform: "translateY(14px)" },
                { opacity: 1, transform: "none" },
              ],
              { duration: 420, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" },
            );
          }
        });
        if (empty) empty.hidden = visible > 0;
      });
    });
  }

  /* ——— Gallery lightbox ————————————————————————————————— */
  const dialog = $("[data-lightbox]");
  const triggers = $$("[data-lightbox-item]");
  if (dialog && triggers.length) {
    const image = $("[data-lightbox-img]", dialog);
    const counter = $("[data-lightbox-count]", dialog);
    let index = 0;

    const render = () => {
      const trigger = triggers[index];
      if (!trigger) return;
      image.src = trigger.dataset.src;
      image.alt = trigger.dataset.alt || "";
      if (counter) counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(triggers.length).padStart(2, "0")}`;
    };
    const open = (i) => {
      index = (i + triggers.length) % triggers.length;
      render();
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    };
    const close = () => {
      if (typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
    };
    triggers.forEach((trigger, i) =>
      trigger.addEventListener("click", () => {
        open(i);
      }),
    );
    $("[data-lightbox-close]", dialog)?.addEventListener("click", close);
    $("[data-lightbox-prev]", dialog)?.addEventListener("click", () => {
      index = (index - 1 + triggers.length) % triggers.length;
      render();
    });
    $("[data-lightbox-next]", dialog)?.addEventListener("click", () => {
      index = (index + 1) % triggers.length;
      render();
    });
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        index = (index - 1 + triggers.length) % triggers.length;
        render();
      }
      if (event.key === "ArrowRight") {
        index = (index + 1) % triggers.length;
        render();
      }
    });
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (!inside) close();
    });
  }

  /* ——— Contact form (mailto, no backend needed) ————————— */
  const form = $("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const lines = [
        `Name: ${data.get("name") || ""}`,
        `Email: ${data.get("email") || ""}`,
        `Company: ${data.get("company") || "—"}`,
        `Budget: ${data.get("budget") || "—"}`,
        `Service: ${data.get("service") || "—"}`,
        "",
        "Project:",
        `${data.get("message") || ""}`,
      ];
      const subject = `New project enquiry — ${data.get("name") || "D-Tales"}`;
      const mailto = `mailto:info@d-tales.co?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
      window.location.href = mailto;
      const notice = $("[data-form-notice]", form);
      if (notice) notice.hidden = false;
    });
  }

  /* ——— Utilities ————————————————————————————————————— */
  const toTop = $("[data-to-top]");
  toTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const year = new Date().getFullYear();
  $$("[data-year]").forEach((element) => {
    element.textContent = String(year);
  });
})();
