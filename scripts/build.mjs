import fs from "node:fs";
import path from "node:path";
import { site, nav, projects, services, awards, team, stats, socialProjects, socialCapabilities, process } from "./data.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts", "asset-manifest.json"), "utf8"));

const esc = (value = "") =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const arrow = `<svg class="icon icon--arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 18 18 6M8 6h10v10"/></svg>`;
const plus = `<svg class="icon icon--plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M12 4v16M4 12h16"/></svg>`;
const star = `<svg class="star" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 0c4 36 14 46 50 50-36 4-46 14-50 50-4-36-14-46-50-50C36 46 46 36 50 0Z"/></svg>`;
const instagram = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></svg>`;
const xIcon = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.3L2.8 2h6.4l4.4 5.8L18.9 2Zm-1.1 18.1h1.7L7.3 3.8H5.5l12.3 16.3Z"/></svg>`;
const linkedin = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.2 1.4-2.2 2.9V21H9V9Z"/></svg>`;

function img(asset, alt, { loading = "lazy", fetchpriority = false, className = "" } = {}) {
  if (!asset) return "";
  return `<img src="${asset.src}" width="${asset.width}" height="${asset.height}" alt="${esc(alt)}"${
    className ? ` class="${className}"` : ""
  } loading="${loading}" decoding="async"${fetchpriority ? ' fetchpriority="high"' : ""}>`;
}

function marquee(text, className = "") {
  const run = Array.from({ length: 4 }, () => `<span>${text}</span><i>${star}</i>`).join("");
  return `<div class="marquee ${className}" aria-hidden="true"><div class="marquee-track">${run}${run}</div></div>`;
}

function logoMarquee() {
  const logos = manifest.clients || [];
  const cells = logos
    .map((src) => `<span class="logo-cell"><img src="${src}" alt="" loading="lazy" decoding="async"></span>`)
    .join("");
  return `<div class="logo-marquee" aria-hidden="true"><div class="logo-track">${cells}${cells}</div></div>`;
}

function header(active) {
  const links = nav
    .map(
      (item) =>
        `<a href="${item.href}" class="nav-link${active === item.key ? " is-active" : ""}"${
          active === item.key ? ' aria-current="page"' : ""
        }>${item.label}</a>`,
    )
    .join("");
  const mobileLinks = nav
    .map(
      (item, i) =>
        `<a href="${item.href}" class="menu-link"><span class="menu-link-num">0${i + 1}</span><span>${item.label}</span>${arrow}</a>`,
    )
    .join("");
  return `
  <header class="site-header" data-header>
    <div class="shell header-inner">
      <a class="brand" href="index.html" aria-label="D-Tales — home">
        <img class="brand-logo" src="assets/img/brand/logo-white.webp" width="164" height="38" alt="D-Tales">
      </a>
      <nav class="primary-nav" aria-label="Primary">${links}</nav>
      <div class="header-actions">
        <a class="btn btn-light btn-sm header-cta" href="contact.html">Start a project ${arrow}</a>
        <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu-panel" aria-label="Open menu" data-menu-btn>
          <span></span><span></span>
        </button>
      </div>
    </div>
  </header>
  <div class="menu-panel" id="menu-panel" aria-hidden="true" data-menu>
    <div class="menu-panel-inner">
      <div class="menu-panel-head">
        <span class="eyebrow">Menu</span>
        <span class="eyebrow">Riyadh, KSA</span>
      </div>
      <nav class="menu-nav" aria-label="Mobile">${mobileLinks}</nav>
      <div class="menu-panel-foot">
        <div>
          <p class="eyebrow">New business</p>
          <a href="mailto:${site.email}">${site.email}</a>
        </div>
        <div>
          <p class="eyebrow">Call us</p>
          <a href="tel:${site.phoneHref}">${site.phone}</a>
        </div>
        <div class="socials">
          <a href="${site.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${instagram}</a>
          <a href="${site.x}" target="_blank" rel="noopener" aria-label="X">${xIcon}</a>
          <a href="${site.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${linkedin}</a>
        </div>
      </div>
    </div>
  </div>`;
}

function footer() {
  return `
  <footer class="site-footer">
    ${marquee("WITH ENDLESS PASSION &amp; POSSIBILITY, CREATE YOUR VISION WITH US", "marquee--footer")}
    <div class="shell footer-main">
      <div class="footer-cta reveal">
        <p class="eyebrow"><span class="dot"></span> Have a project in mind?</p>
        <h2 class="footer-title">Let’s create <em>something</em> unforgettable.</h2>
        <a class="btn btn-accent" href="contact.html">Start a conversation ${arrow}</a>
      </div>
      <div class="footer-cols">
        <div class="footer-col">
          <p class="eyebrow">Sitemap</p>
          <a href="projects.html">Work</a>
          <a href="services.html">Services</a>
          <a href="who-are-we.html">Studio</a>
          <a href="consultation.html">Consultation</a>
          <a href="dt-social.html">DT Social</a>
          <a href="contact.html">Contact</a>
        </div>
        <div class="footer-col">
          <p class="eyebrow">Get in touch</p>
          <a href="mailto:${site.email}">${site.email}</a>
          <a href="tel:${site.phoneHref}">${site.phone}</a>
          <span>${site.location}</span>
          <a href="profile.html">Company profile</a>
        </div>
        <div class="footer-col footer-col--social">
          <p class="eyebrow">Follow</p>
          <a href="${site.instagram}" target="_blank" rel="noopener">Instagram ${arrow}</a>
          <a href="${site.x}" target="_blank" rel="noopener">X / Twitter ${arrow}</a>
          <a href="${site.linkedin}" target="_blank" rel="noopener">LinkedIn ${arrow}</a>
        </div>
      </div>
    </div>
    <div class="shell footer-meta">
      <span>© <span data-year>2026</span> D-Tales. All rights reserved.</span>
      <span>Brand &amp; Experience Consultancy — Riyadh, Saudi Arabia</span>
      <button class="footer-top" type="button" data-to-top>Back to top ${arrow}</button>
    </div>
  </footer>`;
}

function lightbox() {
  return `
  <dialog class="lightbox" data-lightbox aria-label="Image viewer">
    <button class="lightbox-close" type="button" aria-label="Close image viewer" data-lightbox-close>${plus}</button>
    <button class="lightbox-nav lightbox-nav--prev" type="button" aria-label="Previous image" data-lightbox-prev>←</button>
    <figure class="lightbox-figure"><img alt="" data-lightbox-img></figure>
    <button class="lightbox-nav lightbox-nav--next" type="button" aria-label="Next image" data-lightbox-next>→</button>
    <p class="lightbox-count" data-lightbox-count></p>
  </dialog>`;
}

function layout({ title, description, current = "", body, ogImage = "assets/img/work/founding-day-hero.webp", preloadImage, jsonLd }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${site.domain}/${current}">
  <meta name="theme-color" content="#080808">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="D-Tales">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${site.domain}/${ogImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${site.domain}/${ogImage}">
  <link rel="icon" href="assets/img/brand/favicon.png" sizes="32x32">
  <link rel="apple-touch-icon" href="assets/img/brand/apple-touch-icon.png">
  <link rel="preload" href="assets/fonts/instrument-sans.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="assets/fonts/instrument-serif-italic.woff2" as="font" type="font/woff2" crossorigin>
  ${preloadImage ? `<link rel="preload" as="image" href="${preloadImage}">` : ""}
  <link rel="stylesheet" href="assets/css/main.css">
  <script>document.documentElement.classList.add('js')</script>
  <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
  <script src="assets/js/main.js" defer></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer crossorigin="anonymous"></script>
  <script src="assets/js/motion.js" defer></script>
  ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ""}
</head>
<body class="page-${current ? current.replace(/\.html$/, "") : "home"}">
  <a class="skip-link" href="#main">Skip to content</a>
  ${header(current.replace(/\.html$/, ""))}
  <main id="main">${body}</main>
  ${footer()}
  ${lightbox()}
</body>
</html>`;
}

function pageHero({ eyebrow, title, lede, meta = [], actions = "" }) {
  return `
  <section class="page-hero">
    <div class="shell">
      <div class="page-hero-top reveal">
        <p class="eyebrow"><span class="dot"></span> ${eyebrow}</p>
        <p class="eyebrow eyebrow--muted">${site.location}</p>
      </div>
      <h1 class="page-title reveal">${title}</h1>
      <div class="page-hero-foot reveal">
        <p class="page-lede">${lede}</p>
        ${meta.length ? `<dl class="page-meta">${meta.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>` : ""}
        ${actions}
      </div>
    </div>
  </section>`;
}

function ctaBand({ eyebrow = "Start a project", title = "Your next chapter starts with a <em>conversation.</em>", text = "Tell us what you’re building. We’ll tell you how we can help." } = {}) {
  return `
  <section class="cta-band">
    <div class="shell cta-band-inner reveal">
      <div>
        <p class="eyebrow"><span class="dot dot--dark"></span> ${eyebrow}</p>
        <h2>${title}</h2>
        <p class="cta-band-text">${text}</p>
      </div>
      <div class="cta-band-actions">
        <a class="btn btn-dark" href="contact.html">Let’s talk ${arrow}</a>
        <a class="cta-band-mail" href="mailto:${site.email}">${site.email}</a>
      </div>
    </div>
    <div class="cta-band-spark" aria-hidden="true">${star}</div>
  </section>`;
}

function serviceRows() {
  return services
    .map(
      (service) => `
      <a class="service-row reveal" href="services.html#${service.id}">
        <span class="service-row-num">${service.num}</span>
        <h3>${service.title}</h3>
        <p><strong>${service.subtitle}</strong> ${service.description}</p>
        <span class="service-row-icon">${plus}</span>
      </a>`,
    )
    .join("");
}

function workCard(project, index) {
  const data = manifest[project.slug] || {};
  const media = index === 0 ? data.hero || data.card : data.card;
  return `
  <a class="work-card${index === 0 ? " work-card--wide" : ""} reveal" href="${project.slug}.html" style="--delay:${index * 0.08}s">
    <figure class="work-card-media">
      ${img(media, `${project.title} — brand identity`, { loading: index === 0 ? "eager" : "lazy" })}
      <span class="work-card-num">0${index + 1}</span>
    </figure>
    <div class="work-card-body">
      <div>
        <h3>${project.title}</h3>
        <p>${project.tagline}</p>
      </div>
      <div class="work-card-foot">
        <span class="tag-line">${project.tags.join(" · ")}</span>
        <span class="work-card-arrow">${arrow}</span>
      </div>
    </div>
  </a>`;
}

function projectCard(project, index) {
  const data = manifest[project.slug] || {};
  return `
  <a class="project-card reveal" href="${project.slug}.html" data-tags="${project.tags.join(" ").toLowerCase()}" style="--delay:${(index % 4) * 0.05}s">
    <figure class="project-card-media">
      ${img(data.card, `${project.title} — brand identity`)}
      <span class="project-card-num">${String(index + 1).padStart(2, "0")}</span>
    </figure>
    <div class="project-card-body">
      <div class="project-card-title">
        <h2>${project.title}</h2>
        <p>${project.tagline}</p>
      </div>
      <span class="project-card-arrow">${arrow}</span>
    </div>
    <div class="project-card-tags"><span>${project.tags.join(" · ")}</span><span>Case study</span></div>
  </a>`;
}

// ————————————————————————————————— Home
function homePage() {
  const featured = projects.filter((p) => p.featured);
  const heroImage = manifest["founding-day"]?.card;
  const body = `
  <section class="hero">
    <div class="hero-lines" aria-hidden="true"></div>
    <div class="shell hero-inner">
      <div class="hero-top reveal">
        <p class="eyebrow"><span class="dot"></span> Brand &amp; Experience Consultancy</p>
        <p class="eyebrow eyebrow--muted">Riyadh, Saudi Arabia · Est. 2018</p>
      </div>
      <h1 class="hero-title">
        <span class="hero-line"><span><em>Hello,</em> we are</span></span>
        <span class="hero-line hero-line--brand"><span>D–Tales</span><span class="hero-star">${star}</span></span>
      </h1>
      <div class="hero-bottom">
        <div class="hero-copy reveal" style="--delay:.25s">
          <p class="hero-lede">We partner with visionary businesses to build meaningful brands and unforgettable experiences.</p>
          <div class="hero-actions">
            <a class="btn btn-light" href="projects.html">Explore our work ${arrow}</a>
            <a class="link-arrow" href="contact.html">Start a project</a>
          </div>
        </div>
        <a class="hero-feature reveal" href="founding-day.html" style="--delay:.35s" aria-label="View the Saudi Founding Day case study">
          <figure class="hero-feature-media">${img(heroImage, "Saudi Founding Day brand installation", { loading: "eager", fetchpriority: true })}</figure>
          <div class="hero-feature-meta">
            <span class="eyebrow">Featured project</span>
            <span class="hero-feature-line">
              <span class="hero-feature-title">Saudi Founding Day</span>
              <span class="hero-feature-arrow">${arrow}</span>
            </span>
          </div>
        </a>
      </div>
      <div class="hero-scroll" aria-hidden="true"><span>Scroll to explore</span><span class="hero-scroll-line"></span></div>
    </div>
    ${marquee("STRATEGY — DESIGN — EXPERIENCE — CULTURE — DIGITAL —", "marquee--hero")}
  </section>

  <section class="section section--intro">
    <div class="shell">
      <div class="section-top reveal">
        <p class="eyebrow"><span class="eyebrow-num">01</span> The studio</p>
        <p class="eyebrow eyebrow--muted">Strategy / Design / Experience</p>
      </div>
      <div class="intro-grid">
        <h2 class="statement reveal">We help brands <em>think</em>, <em>feel</em>, and <em>perform</em> better.</h2>
        <div class="intro-copy reveal" style="--delay:.12s">
          <p>From market positioning to multi-sensory brand experiences, we guide organizations through the journey of transformation, growth, and cultural relevance.</p>
          <p>Whether launching a new brand or elevating an existing one, we ensure every interaction delivers clarity, emotion, and purpose.</p>
          <a class="link-arrow" href="who-are-we.html">Meet the studio ${arrow}</a>
        </div>
      </div>
      <div class="stats-grid">
        ${stats
          .map(
            (stat, i) => `<div class="stat reveal" style="--delay:${i * 0.06}s"><span class="stat-value">${stat.value}</span><span class="stat-label">${stat.label}</span></div>`,
          )
          .join("")}
      </div>
    </div>
  </section>

  <section class="section section--work">
    <div class="shell">
      <div class="section-top reveal">
        <p class="eyebrow"><span class="eyebrow-num">02</span> Selected work</p>
        <p class="eyebrow eyebrow--muted">${projects.length} projects / 2018 — now</p>
      </div>
      <div class="work-heading reveal">
        <h2>Work that <em>moves</em> people.</h2>
        <a class="link-arrow" href="projects.html">All projects ${arrow}</a>
      </div>
      <div class="work-grid">${featured.map(workCard).join("")}</div>
    </div>
  </section>

  <section class="section section--services">
    <div class="shell">
      <div class="section-top reveal">
        <p class="eyebrow"><span class="eyebrow-num">03</span> What we do</p>
        <p class="eyebrow eyebrow--muted">Three pillars, one connected practice</p>
      </div>
      <div class="services-heading reveal">
        <h2>Strategy speaks through design, and thrives in <em>experience.</em></h2>
        <p>Our process is built around three core pillars — each one feeding the next.</p>
      </div>
      <div class="service-list">${serviceRows()}</div>
      <div class="section-link reveal"><a class="btn btn-outline" href="services.html">Explore services ${arrow}</a></div>
    </div>
  </section>

  <section class="section section--awards">
    <div class="shell">
      <div class="section-top reveal">
        <p class="eyebrow"><span class="eyebrow-num">04</span> Recognition</p>
        <p class="eyebrow eyebrow--muted">Awards &amp; features</p>
      </div>
      <div class="awards-heading reveal">
        <h2>Driven by intention.<br><em>Recognised</em> by industry leaders.</h2>
      </div>
      <div class="award-list">
        ${awards
          .map(
            (award, i) => `
          <div class="award-row reveal" style="--delay:${i * 0.05}s">
            <span class="award-num">0${i + 1}</span>
            <h3>${award.name}</h3>
            <p class="award-recognition">${award.recognition}</p>
            <p class="award-body">${award.body}</p>
          </div>`,
          )
          .join("")}
      </div>
    </div>
  </section>

  <section class="section section--clients">
    <div class="shell">
      <div class="section-top reveal">
        <p class="eyebrow"><span class="eyebrow-num">05</span> Clients</p>
        <p class="eyebrow eyebrow--muted">Trusted across government, private &amp; cultural sectors</p>
      </div>
      <h2 class="clients-heading reveal">In good <em>company.</em></h2>
    </div>
    ${logoMarquee()}
  </section>

  ${ctaBand()}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "D-Tales",
    url: site.domain,
    logo: `${site.domain}/assets/img/brand/logo-white.png`,
    description: "Brand & Experience Consultancy based in Riyadh, Saudi Arabia.",
    email: site.email,
    telephone: site.phone,
    address: { "@type": "PostalAddress", addressLocality: "Riyadh", addressCountry: "SA" },
    sameAs: [site.instagram, site.x, site.linkedin],
  };

  return layout({
    title: "D-Tales — Brand & Experience Consultancy, Riyadh",
    description:
      "D-Tales is a Riyadh-based brand and experience consultancy. We partner with visionary businesses to build meaningful brands and unforgettable experiences.",
    current: "",
    body,
    preloadImage: heroImage?.src,
    jsonLd,
  });
}

// ————————————————————————————————— Projects index
function projectsPage() {
  const counts = {
    all: projects.length,
    strategy: projects.filter((p) => p.tags.includes("Strategy")).length,
    design: projects.filter((p) => p.tags.includes("Design")).length,
    experience: projects.filter((p) => p.tags.includes("Experience")).length,
  };
  const filters = [
    ["all", "All"],
    ["strategy", "Strategy"],
    ["design", "Design"],
    ["experience", "Experience"],
  ];
  const body = `
  ${pageHero({
    eyebrow: "Work / Selected projects",
    title: "Brands with a <em>point of view.</em>",
    lede: "A selection of identities, experiences and stories built with intention — across government, culture, hospitality and retail.",
    meta: [
      ["Projects", `${projects.length}`],
      ["Disciplines", "Strategy · Design · Experience"],
      ["Based in", "Riyadh, KSA"],
    ],
  })}
  <section class="section section--listing">
    <div class="shell">
      <div class="filter-bar reveal" data-filters>
        ${filters
          .map(
            ([value, label], i) =>
              `<button class="filter${i === 0 ? " is-active" : ""}" type="button" data-filter="${value}" aria-pressed="${i === 0}">${label} <span>${counts[value]}</span></button>`,
          )
          .join("")}
      </div>
      <div class="project-grid" data-project-grid>
        ${projects.map(projectCard).join("")}
      </div>
      <p class="empty-state" data-empty hidden>No projects in this discipline yet.</p>
    </div>
  </section>
  ${ctaBand({ title: "Your brand could be <em>next.</em>", text: "We take on a limited number of partnerships each year. Tell us what you’re planning." })}`;
  return layout({
    title: "Work — D-Tales",
    description: "Selected brand identity, strategy and experience projects by D-Tales, Riyadh.",
    current: "projects.html",
    body,
  });
}

// ————————————————————————————————— Project detail
function projectPage(project, index) {
  const data = manifest[project.slug] || {};
  const next = projects[(index + 1) % projects.length];
  const nextData = manifest[next.slug] || {};
  const gallery = (data.gallery || [])
    .map(
      (item, i) => `
      <figure class="gallery-item-wrap reveal" style="--delay:${(i % 4) * 0.04}s">
        <button class="gallery-item" type="button" data-lightbox-item data-src="${item.src}" data-alt="${esc(`${project.title} — project image ${i + 1}`)}" aria-label="Open ${esc(project.title)} image ${i + 1}">
          <img src="${item.src}" width="${item.width}" height="${item.height}" alt="${esc(`${project.title} — project image ${i + 1}`)}" loading="lazy" decoding="async">
          <span class="gallery-zoom">${plus}</span>
        </button>
      </figure>`,
    )
    .join("");

  const body = `
  <article class="case-study">
    <header class="case-hero">
      <div class="shell">
        <p class="eyebrow case-eyebrow reveal"><a href="projects.html">Work</a><span>/</span>Case study</p>
        <h1 class="case-title reveal">${project.title}</h1>
        <div class="case-meta reveal">
          <p class="case-lede">${project.description}</p>
          <dl>
            <div><dt>Scope</dt><dd>${project.tags.join(", ")}</dd></div>
            <div><dt>Studio</dt><dd>D-Tales, Riyadh</dd></div>
          </dl>
        </div>
      </div>
      <div class="shell case-cover reveal">
        ${img(data.hero, `${project.title} — hero image`, { loading: "eager", fetchpriority: true })}
      </div>
    </header>

    <section class="section case-intro">
      <div class="shell case-intro-grid">
        <p class="eyebrow reveal">The brief</p>
        <div class="reveal" style="--delay:.08s">
          <p class="statement statement--sm">${project.tagline}</p>
          <p class="case-body">${project.description}</p>
          <ul class="tag-list">${project.tags.map((tag) => `<li>${tag}</li>`).join("")}</ul>
        </div>
      </div>
    </section>

    <section class="case-gallery">
      <div class="shell">
        <div class="case-gallery-head reveal">
          <p class="eyebrow">Selected imagery</p>
          <p class="eyebrow eyebrow--muted">${(data.gallery || []).length} frames</p>
        </div>
        <div class="gallery-grid" data-gallery>${gallery}</div>
      </div>
    </section>

    <section class="next-project">
      <a class="next-project-link" href="${next.slug}.html">
        <div class="shell">
          <p class="eyebrow reveal">Next project</p>
          <div class="next-project-row reveal">
            <h2>${next.title}</h2>
            <span class="next-project-arrow">${arrow}</span>
          </div>
          <figure class="next-project-media reveal">${img(nextData.card, `${next.title} — brand identity`)}</figure>
        </div>
      </a>
    </section>
  </article>
  ${ctaBand({ eyebrow: "Like what you see?", title: "Let’s build something <em>worth remembering.</em>" })}`;

  return layout({
    title: `${project.title} — D-Tales`,
    description: project.description,
    current: `${project.slug}.html`,
    body,
    ogImage: data.hero?.src || "assets/img/work/founding-day-hero.webp",
    preloadImage: data.hero?.src,
  });
}

// ————————————————————————————————— Studio
function studioPage() {
  const studio = manifest.studio || [];
  const body = `
  ${pageHero({
    eyebrow: "Studio / Who we are",
    title: "Strategy-led.<br>Design-driven. <em>Impact-obsessed.</em>",
    lede: "Based in Riyadh, we are a consultancy driven by strategy, fueled by design, and obsessed with impact. We’re more than a creative studio—we’re your strategic partner.",
    meta: [
      ["Founded", "2018"],
      ["Based in", "Riyadh, KSA"],
      ["Team", "Strategists · Designers · Storytellers"],
    ],
  })}
  <section class="studio-strip" aria-label="Inside the studio">
    <div class="studio-track">
      ${studio.map((item) => `<figure class="studio-shot">${img(item, "Inside the D-Tales studio")}</figure>`).join("")}
      ${studio.map((item) => `<figure class="studio-shot" aria-hidden="true">${img(item, "")}</figure>`).join("")}
    </div>
  </section>

  <section class="section section--manifesto">
    <div class="shell">
      <div class="section-top reveal"><p class="eyebrow"><span class="eyebrow-num">01</span> Our belief</p><p class="eyebrow eyebrow--muted">Intention over noise</p></div>
      <div class="intro-grid">
        <h2 class="statement reveal">We help brands <em>think</em>, <em>feel</em>, and <em>perform</em> better.</h2>
        <div class="intro-copy reveal">
          <p>From market positioning to multi-sensory brand experiences, we guide organizations through the journey of transformation, growth, and cultural relevance.</p>
          <p>We help brands think, feel, and perform better through a seamless blend of strategy, storytelling, and sensory design. Whether launching a new brand or elevating an existing one, we ensure every interaction delivers clarity, emotion, and purpose.</p>
        </div>
      </div>
      <div class="belief-grid">
        <div class="belief-card reveal"><span class="eyebrow">Local insight</span><h3>Deep local insight, global standards.</h3><p>We understand the culture, codes and ambitions of the Saudi market — and we hold the work to an international standard.</p></div>
        <div class="belief-card reveal" style="--delay:.08s"><span class="eyebrow">Founder-led</span><h3>Hands-on creative leadership.</h3><p>A founder-led consultancy means senior thinking stays close to the work, from the first question to the final touchpoint.</p></div>
        <div class="belief-card reveal" style="--delay:.16s"><span class="eyebrow">One practice</span><h3>Strategy, design and experience, connected.</h3><p>No hand-offs, no dilution. The same team carries the idea from positioning to the experience people remember.</p></div>
      </div>
    </div>
  </section>

  <section class="section section--founder">
    <div class="shell founder-grid">
      <figure class="founder-portrait reveal">
        ${img(manifest.dalal, "Dalal Alshaikh, Founder and Brand Strategist at D-Tales")}
        <figcaption><span>Dalal Alshaikh</span><span>Founder &amp; Brand Strategist</span></figcaption>
      </figure>
      <div class="founder-copy reveal">
        <p class="eyebrow"><span class="foreword">From the founder</span></p>
        <h2>Hi, I’m <em>Dalal Alshaikh,</em></h2>
        <p class="founder-role">Founder and Brand Strategist at D-Tales.</p>
        <p>In 2018, I founded D-Tales with a mission to transform businesses through intentional branding and design thinking. With over 8 years of industry experience, I’ve led high-impact projects across government, private, and cultural sectors—including the national brand identity for Saudi Arabia’s Founding Day.</p>
        <p>Over the years, our work has been recognized for both creative excellence and strategic value, winning awards and trust across industries. As we transition from a boutique design studio to a full-service brand and experience consultancy, our goal remains the same: to create brands that people remember and experiences they value.</p>
        <a class="link-arrow" href="consultation.html">Work with Dalal ${arrow}</a>
      </div>
    </div>
  </section>

  <section class="section section--team">
    <div class="shell">
      <div class="section-top reveal"><p class="eyebrow"><span class="eyebrow-num">02</span> The team</p><p class="eyebrow eyebrow--muted">Small team, senior thinking</p></div>
      <div class="team-heading reveal"><h2>The people behind the <em>work.</em></h2><p>Strategists, designers and storytellers who care about the details others skip.</p></div>
      <div class="team-grid">
        ${team
          .map(
            (member, i) => `
          <article class="team-card reveal" style="--delay:${i * 0.05}s">
            <div class="team-media">
              <video src="assets/img/team/${member.file}.mp4" poster="assets/img/team/${member.file}-poster.webp" width="620" height="272" autoplay muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video>
            </div>
            <div class="team-info">
              <h3>${member.name}</h3>
              <p class="team-role">${member.role}</p>
              <p class="team-tagline">${member.tagline}</p>
            </div>
          </article>`,
          )
          .join("")}
      </div>
    </div>
  </section>

  <section class="section section--careers">
    <div class="shell">
      <div class="section-top reveal"><p class="eyebrow"><span class="eyebrow-num">03</span> Careers</p><p class="eyebrow eyebrow--muted">Join the studio</p></div>
      <div class="career-list">
        <a class="career-row reveal" href="mailto:${site.email}">
          <span class="career-num">01</span>
          <div><h3>Join the team</h3><p>Full time or part time. Share your creativity with us.</p></div>
          <span class="career-arrow">${arrow}</span>
        </a>
        <a class="career-row reveal" href="${site.internship}" target="_blank" rel="noopener">
          <span class="career-num">02</span>
          <div><h3>Internship programme</h3><p>Improve your skills and understanding of the design industry with us.</p></div>
          <span class="career-arrow">${arrow}</span>
        </a>
      </div>
    </div>
  </section>

  <section class="section section--clients">
    <div class="shell"><div class="section-top reveal"><p class="eyebrow"><span class="eyebrow-num">04</span> Clients</p><p class="eyebrow eyebrow--muted">In good company</p></div><h2 class="clients-heading reveal">Built with <em>believers.</em></h2></div>
    ${logoMarquee()}
  </section>
  ${ctaBand()}`;
  return layout({
    title: "Studio — D-Tales",
    description: "Meet D-Tales: a Riyadh-based brand and experience consultancy founded by Dalal Alshaikh in 2018.",
    current: "who-are-we.html",
    body,
    ogImage: manifest.dalal?.src || "assets/img/dalal.webp",
  });
}

// ————————————————————————————————— Services
function servicesPage() {
  const visuals = ["baraka-of-medina", "founding-day", "skoops"];
  const body = `
  ${pageHero({
    eyebrow: "Services / What we do",
    title: "Strategy speaks through design, and thrives in <em>experience.</em>",
    lede: "A successful brand lives in strategy, speaks through design, and thrives in experience. That’s why our process is built around three core pillars.",
    meta: [
      ["Pillars", "03"],
      ["Engagements", "Project · Retainer · Advisory"],
      ["Based in", "Riyadh, KSA"],
    ],
  })}
  <section class="section section--services-detail">
    <div class="shell">
      ${services
        .map((service, i) => {
          const visual = manifest[visuals[i]] || {};
          return `
        <article class="service-detail reveal" id="${service.id}">
          <div class="service-detail-head">
            <span class="service-detail-num">${service.num}</span>
            <h2>${service.title}</h2>
            <p class="service-detail-sub">${service.subtitle}</p>
          </div>
          <div class="service-detail-body">
            <p class="service-detail-desc">${service.description}</p>
            <ul class="service-detail-list">${service.list.map((item) => `<li><span>${plus}</span>${item}</li>`).join("")}</ul>
            <figure class="service-detail-media">${img(visual.card, `${service.title} — D-Tales project`)}</figure>
          </div>
        </article>`;
        })
        .join("")}
    </div>
  </section>

  <section class="section section--process">
    <div class="shell">
      <div class="section-top reveal"><p class="eyebrow"><span class="eyebrow-num">04</span> How we work</p><p class="eyebrow eyebrow--muted">A clear, collaborative process</p></div>
      <h2 class="process-heading reveal">From first question to <em>final touchpoint.</em></h2>
      <div class="process-grid">
        ${process
          .map(
            (step, i) => `
          <div class="process-step reveal" style="--delay:${i * 0.06}s">
            <span class="process-num">${step.num}</span>
            <h3>${step.title}</h3>
            <p>${step.text}</p>
          </div>`,
          )
          .join("")}
      </div>
    </div>
  </section>

  <section class="section section--clients">
    <div class="shell"><div class="section-top reveal"><p class="eyebrow"><span class="eyebrow-num">05</span> Clients</p><p class="eyebrow eyebrow--muted">Sectors we know</p></div><h2 class="clients-heading reveal">Government. Culture.<br><em>Hospitality. Retail.</em></h2></div>
    ${logoMarquee()}
  </section>
  ${ctaBand({ eyebrow: "Not sure where to start?", title: "Start with a <em>conversation.</em>", text: "We’ll help you find the right entry point — strategy, identity, experience or all three." })}`;
  return layout({
    title: "Services — D-Tales",
    description: "Brand strategy, identity design and experience activation from D-Tales, Riyadh.",
    current: "services.html",
    body,
  });
}

// ————————————————————————————————— Consultation
function consultationPage() {
  const consultClients = ["assets/img/clients/client3.svg", "assets/img/clients/client5.svg", "assets/img/brand/culture.webp", "assets/img/brand/landor.webp"];
  const body = `
  <section class="consult-hero">
    <div class="shell consult-hero-grid">
      <div class="consult-hero-copy">
        <p class="eyebrow reveal"><span class="dot"></span> Consultation / With Dalal Alshaikh</p>
        <h1 class="reveal">Become the story <em>they remember.</em></h1>
        <p class="consult-lede reveal">Brand &amp; experience consulting for founders, agencies and teams who want clarity without the execution overhead.</p>
        <a class="btn btn-accent reveal" href="mailto:${site.consultEmail}">Let’s chat ${arrow}</a>
      </div>
      <figure class="consult-portrait reveal">
        ${img(manifest.dalal, "Dalal Alshaikh, Brand and Experience Consultant")}
        <figcaption>Dalal Alshaikh — Brand &amp; Experience Consultant</figcaption>
      </figure>
    </div>
  </section>

  <section class="section section--consult-intro">
    <div class="shell consult-intro">
      <p class="eyebrow reveal">The consultant</p>
      <div class="consult-intro-copy reveal">
        <h2>Hi, I’m <em>Dalal Alshaikh,</em> Brand &amp; Experience Consultant.</h2>
        <p>I help businesses and teams transform their brands into experiences that inspire, connect, and leave a lasting impression. With years of experience leading major brand identities, I specialize in guiding companies to clarity, impact, and elevated customer experiences — without getting lost in design execution.</p>
      </div>
    </div>
  </section>

  <section class="section section--consult-who">
    <div class="shell">
      <div class="section-top reveal"><p class="eyebrow"><span class="eyebrow-num">01</span> Who I work with</p><p class="eyebrow eyebrow--muted">Right fit, right focus</p></div>
      <div class="who-grid">
        <div class="who-card reveal"><span class="who-num">01</span><h3>Business owners &amp; founders</h3><p>Who want clear brand direction.</p></div>
        <div class="who-card reveal" style="--delay:.06s"><span class="who-num">02</span><h3>Agencies</h3><p>Seeking expert brand and experience guidance.</p></div>
        <div class="who-card reveal" style="--delay:.12s"><span class="who-num">03</span><h3>Teams</h3><p>Who want frameworks, strategy, and leadership without execution overhead.</p></div>
      </div>
    </div>
  </section>

  <section class="section section--consult-why">
    <div class="shell why-grid">
      <div>
        <p class="eyebrow reveal"><span class="eyebrow-num">02</span> Why work with me</p>
        <h2 class="statement statement--sm reveal">Senior thinking,<br><em>without the layers.</em></h2>
      </div>
      <ol class="why-list">
        <li class="reveal"><span>01</span>Years of experience leading major national &amp; corporate brands</li>
        <li class="reveal"><span>02</span>Specialist in experience, not execution</li>
        <li class="reveal"><span>03</span>Focused, flexible, high-value approach</li>
        <li class="reveal"><span>04</span>Proven frameworks for clarity &amp; impact</li>
      </ol>
    </div>
  </section>

  <section class="section section--consult-clients">
    <div class="shell">
      <p class="eyebrow reveal">Trusted by</p>
      <div class="consult-logos reveal">${consultClients.map((src) => `<img src="${src}" alt="" loading="lazy" decoding="async">`).join("")}</div>
    </div>
  </section>

  <section class="consult-cta">
    <div class="shell consult-cta-inner reveal">
      <div><p class="eyebrow"><span class="dot"></span> Available for selected projects</p><h2>Let’s talk about<br><em>your next chapter.</em></h2></div>
      <div><a class="consult-mail" href="mailto:${site.consultEmail}">${site.consultEmail}</a><a class="btn btn-dark" href="mailto:${site.consultEmail}">Book a conversation ${arrow}</a></div>
    </div>
  </section>`;
  return layout({
    title: "Consultation — Dalal Alshaikh · D-Tales",
    description: "Brand and experience consulting with Dalal Alshaikh, founder of D-Tales. Clarity, impact and elevated customer experiences.",
    current: "consultation.html",
    body,
    ogImage: manifest.dalal?.src || "assets/img/dalal.webp",
  });
}

// ————————————————————————————————— DT Social
function socialPage() {
  const cards = socialProjects
    .slice(0, 6)
    .map((projectItem, i) => {
      const gallery = manifest.social?.[projectItem.slug] || [];
      const cover = gallery[0];
      return `
      <a class="social-card reveal" href="dt-projects.html#${projectItem.slug}" style="--delay:${(i % 3) * 0.06}s">
        <figure>${img(cover, `${projectItem.name} — social media work`)}
          <span class="social-card-num">${String(i + 1).padStart(2, "0")}</span>
        </figure>
        <div class="social-card-body"><div><h3>${projectItem.name}</h3><p>${projectItem.service}</p></div><span>${arrow}</span></div>
      </a>`;
    })
    .join("");
  const body = `
  <section class="social-hero">
    <div class="shell">
      <div class="social-hero-top reveal"><p class="eyebrow"><span class="dot"></span> A D-Tales studio</p><p class="eyebrow eyebrow--muted">Social-first content studio</p></div>
      <h1 class="social-title reveal">DT <em>Social</em><span class="social-mark">S</span></h1>
      <div class="social-hero-bottom">
        <h2 class="reveal">We don’t just post,<br>we spark <em>conversations.</em></h2>
        <p class="social-lede reveal">300+ success stories in the form of scroll-stopping content. Specializing in crafting digital narratives &amp; building communities — all while staying true to your brand’s voice &amp; goals.</p>
      </div>
      <div class="social-stats reveal">
        <div><span>300+</span><p>Success stories</p></div>
        <div><span>06</span><p>Brands in the feed</p></div>
        <div><span>05</span><p>Social capabilities</p></div>
      </div>
    </div>
  </section>

  <section class="section section--social-work">
    <div class="shell">
      <div class="section-top reveal"><p class="eyebrow"><span class="eyebrow-num">01</span> In the feed</p><p class="eyebrow eyebrow--muted">Scroll-stopping, on brand</p></div>
      <div class="social-heading reveal"><h2>Content with a <em>pulse.</em></h2><a class="link-arrow" href="dt-projects.html">View all social work ${arrow}</a></div>
      <div class="social-grid">${cards}</div>
    </div>
  </section>

  <section class="section section--social-capabilities">
    <div class="shell">
      <div class="section-top reveal"><p class="eyebrow"><span class="eyebrow-num">02</span> What we can do for you</p><p class="eyebrow eyebrow--muted">End-to-end social</p></div>
      <div class="capability-grid">
        ${socialCapabilities
          .map(
            (cap, i) => `
          <article class="capability-card reveal" style="--delay:${(i % 3) * 0.05}s">
            <span class="capability-num">${cap.num}</span>
            <h3>${cap.title}</h3>
            <ul>${cap.list.map((item) => `<li>${item}</li>`).join("")}</ul>
          </article>`,
          )
          .join("")}
      </div>
    </div>
  </section>

  <section class="section section--clients">
    <div class="shell"><div class="section-top reveal"><p class="eyebrow"><span class="eyebrow-num">03</span> Brands</p><p class="eyebrow eyebrow--muted">A few of the feeds we’ve shaped</p></div><h2 class="clients-heading reveal">In the <em>feed.</em></h2></div>
    ${logoMarquee()}
  </section>
  ${ctaBand({ eyebrow: "DT Social", title: "Make your feed <em>impossible to scroll past.</em>", text: "Tell us about your brand, your audience and the conversation you want to start." })}`;
  return layout({
    title: "DT Social — Social-first content studio by D-Tales",
    description: "DT Social is D-Tales’ social-first content studio: strategy, content creation, community management and paid social.",
    current: "dt-social.html",
    body,
  });
}

function socialProjectsPage() {
  const body = `
  ${pageHero({
    eyebrow: "DT Social / Projects",
    title: "The work behind <em>the feed.</em>",
    lede: "Six brands, six distinct voices. A look at the content systems, campaigns and communities we build for our social clients.",
    meta: [
      ["Projects", "06"],
      ["Services", "Campaigns · Management · Paid"],
      ["Studio", "DT Social"],
    ],
  })}
  <div class="shell anchor-nav reveal" aria-label="Social projects">
    ${socialProjects.map((p) => `<a href="#${p.slug}">${p.name}</a>`).join("")}
  </div>
  <section class="section section--social-projects">
    <div class="shell">
      ${socialProjects
        .map((projectItem, i) => {
          const gallery = (manifest.social?.[projectItem.slug] || []).slice(0, 4);
          return `
        <article class="social-project reveal" id="${projectItem.slug}">
          <div class="social-project-head">
            <span class="social-project-num">0${i + 1}</span>
            <div><h2>${projectItem.name}</h2><p>${projectItem.service}</p></div>
            <p class="social-project-text">${projectItem.text}</p>
          </div>
          <div class="social-project-gallery">
            ${gallery.map((item, gi) => `<figure class="${gi === 0 ? "is-cover" : ""}">${img(item, `${projectItem.name} — social content ${gi + 1}`)}</figure>`).join("")}
          </div>
        </article>`;
        })
        .join("")}
    </div>
  </section>
  ${ctaBand({ eyebrow: "DT Social", title: "Let’s make your brand <em>part of the conversation.</em>", text: "Content, community and campaigns built to stop the scroll — and start something." })}`;
  return layout({
    title: "DT Social Projects — D-Tales",
    description: "Social media campaigns and content management for Riyadh School, Oishiisushi, IDMI Coffee, SKOOPS, SHPS and Magnolia Bakery.",
    current: "dt-projects.html",
    body,
  });
}

// ————————————————————————————————— Contact
function contactPage() {
  const body = `
  ${pageHero({
    eyebrow: "Contact / Start a project",
    title: "Tell us what<br>you’re <em>building.</em>",
    lede: "Whether you need a brand from scratch, a sharper story, or an experience people remember — start here. We’ll reply within two working days.",
    meta: [
      ["New business", site.email],
      ["Call us", site.phone],
      ["Studio", site.location],
    ],
  })}
  <section class="section section--contact">
    <div class="shell contact-grid">
      <form class="contact-form reveal" data-contact-form>
        <div class="form-row">
          <label>Your name<input type="text" name="name" autocomplete="name" required placeholder="Name"></label>
          <label>Email<input type="email" name="email" autocomplete="email" required placeholder="you@company.com"></label>
        </div>
        <div class="form-row">
          <label>Company<input type="text" name="company" autocomplete="organization" placeholder="Company name"></label>
          <label>Budget<select name="budget"><option value="">Select a range</option><option>Under SAR 50k</option><option>SAR 50k – 150k</option><option>SAR 150k – 300k</option><option>SAR 300k+</option><option>Not sure yet</option></select></label>
        </div>
        <label>What do you need?<select name="service"><option value="">Select a service</option><option>Brand strategy</option><option>Brand identity</option><option>Brand experience</option><option>Website / digital</option><option>Social media (DT Social)</option><option>Consultation with Dalal</option><option>Something else</option></select></label>
        <label>Tell us about the project<textarea name="message" rows="5" required placeholder="A little context, timing and what success looks like…"></textarea></label>
        <div class="form-foot">
          <button class="btn btn-accent" type="submit">Send enquiry ${arrow}</button>
          <p>This opens your email app with the details filled in. Prefer email? <a href="mailto:${site.email}">${site.email}</a></p>
        </div>
        <p class="form-notice" data-form-notice hidden>Your email app should now be open. If not, email us directly at <a href="mailto:${site.email}">${site.email}</a>.</p>
      </form>
      <aside class="contact-aside reveal">
        <div class="contact-card">
          <p class="eyebrow">Direct</p>
          <a href="mailto:${site.email}">${site.email}</a>
          <a href="tel:${site.phoneHref}">${site.phone}</a>
        </div>
        <div class="contact-card">
          <p class="eyebrow">Consultation</p>
          <a href="mailto:${site.consultEmail}">${site.consultEmail}</a>
          <p>For advisory and consulting enquiries with Dalal Alshaikh.</p>
        </div>
        <div class="contact-card">
          <p class="eyebrow">Studio</p>
          <p>Riyadh, Saudi Arabia<br>Working across the Kingdom and beyond.</p>
        </div>
        <div class="contact-card contact-card--social">
          <p class="eyebrow">Follow</p>
          <a href="${site.instagram}" target="_blank" rel="noopener">Instagram ${arrow}</a>
          <a href="${site.x}" target="_blank" rel="noopener">X / Twitter ${arrow}</a>
          <a href="${site.linkedin}" target="_blank" rel="noopener">LinkedIn ${arrow}</a>
        </div>
      </aside>
    </div>
  </section>
  ${ctaBand({ eyebrow: "DT Social", title: "Here for social? <em>Start there.</em>", text: "Campaigns, content and community management for brands that live in the feed." })}`;
  return layout({
    title: "Contact — D-Tales",
    description: "Start a project with D-Tales. Brand strategy, identity, experience and social media from Riyadh, Saudi Arabia.",
    current: "contact.html",
    body,
  });
}

// ————————————————————————————————— Company profile
function profilePage() {
  const body = `
  <section class="profile-page">
    <div class="shell">
      <div class="profile-toolbar">
        <a class="link-arrow" href="index.html">← Back to site</a>
        <button class="btn btn-outline" type="button" onclick="window.print()">Print / Save PDF ${arrow}</button>
      </div>
      <header class="profile-head">
        <img class="profile-logo" src="assets/img/brand/logo-white.png" width="224" height="52" alt="D-Tales">
        <p class="eyebrow">Company profile · 2026</p>
      </header>
      <h1>Brand &amp; Experience<br><em>Consultancy.</em></h1>
      <p class="profile-lede">Based in Riyadh, D-Tales partners with visionary businesses to build meaningful brands and unforgettable experiences.</p>
      <div class="profile-grid">
        <div><h2>What we do</h2><ul>${services.map((s) => `<li><strong>${s.title}</strong> — ${s.subtitle}</li>`).join("")}</ul></div>
        <div><h2>How we think</h2><p>From market positioning to multi-sensory brand experiences, we guide organizations through transformation, growth, and cultural relevance. Our work is driven by intention — and recognised by industry leaders.</p></div>
        <div><h2>Selected clients</h2><p>Government, culture, hospitality, real estate, F&amp;B and retail brands across Saudi Arabia.</p></div>
        <div><h2>Recognition</h2><ul>${awards.map((a) => `<li><strong>${a.name}</strong> — ${a.recognition}</li>`).join("")}</ul></div>
        <div><h2>Founder</h2><p>Dalal Alshaikh, Founder &amp; Brand Strategist. Founded in 2018.</p></div>
        <div><h2>Contact</h2><p>${site.email}<br>${site.phone}<br>${site.location}</p></div>
      </div>
      <footer class="profile-foot"><span>d-tales.co</span><span>© <span data-year>2026</span> D-Tales</span></footer>
    </div>
  </section>`;
  return layout({
    title: "Company Profile — D-Tales",
    description: "D-Tales company profile: brand strategy, design and experience consultancy, Riyadh.",
    current: "profile.html",
    body,
  });
}

function notFoundPage() {
  const body = `
  <section class="not-found">
    <div class="shell">
      <p class="eyebrow"><span class="dot"></span> 404</p>
      <h1>This page took a <em>wrong turn.</em></h1>
      <p>The link may be old, or the page has moved. Let’s get you back to the good stuff.</p>
      <div class="not-found-actions"><a class="btn btn-accent" href="index.html">Home ${arrow}</a><a class="btn btn-outline" href="projects.html">View work</a></div>
    </div>
  </section>`;
  return layout({ title: "Not found — D-Tales", description: "Page not found.", current: "404.html", body });
}

// ————————————————————————————————— Write
const pages = [
  ["index.html", homePage()],
  ["projects.html", projectsPage()],
  ...projects.map((project, index) => [`${project.slug}.html`, projectPage(project, index)]),
  ["who-are-we.html", studioPage()],
  ["services.html", servicesPage()],
  ["consultation.html", consultationPage()],
  ["dt-social.html", socialPage()],
  ["dt-projects.html", socialProjectsPage()],
  ["contact.html", contactPage()],
  ["profile.html", profilePage()],
  ["404.html", notFoundPage()],
];

for (const [file, html] of pages) {
  fs.writeFileSync(path.join(ROOT, file), html, "utf8");
  console.log("wrote", file, `${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`);
}

// sitemap + robots
const urls = pages
  .filter(([file]) => file !== "404.html")
  .map(([file]) => {
    const loc = file === "index.html" ? site.domain + "/" : `${site.domain}/${file}`;
    return `  <url><loc>${loc}</loc><changefreq>monthly</changefreq><priority>${file === "index.html" ? "1.0" : "0.7"}</priority></url>`;
  })
  .join("\n");
fs.writeFileSync(
  path.join(ROOT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
fs.writeFileSync(path.join(ROOT, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${site.domain}/sitemap.xml\n`);
console.log("wrote sitemap.xml, robots.txt");
