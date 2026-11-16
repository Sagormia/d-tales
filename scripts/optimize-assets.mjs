/**
 * Image pipeline for D-Tales.
 * Source images live outside the site (downloaded originals); output is
 * responsive WebP + a manifest the page builder reads.
 *
 * Usage: SOURCE_IMG=/path/to/img node scripts/optimize-assets.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = process.env.SOURCE_IMG || path.join(process.env.TEMP, "opencode", "dtales-assets", "assets", "img");
const OUT = path.join(ROOT, "assets", "img");
const manifest = {};

const projects = {
  "founding-day": {
    cover: "hproject1.webp",
    hero: "banner1.webp",
    gallery: [2, 3, 5, 6, 7, 8, 10, 12, 15, 16, 18, 20, 22, 23].map((n) => `portfolio${n}.webp`),
  },
  "magnolia-bakery": {
    cover: "hproject2.webp",
    hero: "hproject2.webp",
    gallery: ["mb1.webp", "mb2.webp", "mb3.gif", "mb6.webp", "mb7.webp", "mb8.webp", "mb9.webp", "mb10.webp", "mb11.webp", "mb12.gif"],
  },
  "baraka-of-medina": {
    cover: "hproject3.webp",
    hero: "hproject3.webp",
    gallery: [1, 2, 3, 4, 5, 6, 8, 9, 13, 14, 15, 16, 18, 20, 23, 25, 27].map((n) => `bm${n}.webp`),
  },
  "almajdiah-residence": {
    cover: "ar.webp",
    hero: "alm.webp",
    gallery: [2, 4, 5, 6, 7, 11, 12, 13, 14].map((n) => `ar${n}.webp`),
  },
  million: {
    cover: "million.webp",
    hero: "mn.webp",
    gallery: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((n) => `mn${n}.webp`),
  },
  almqr: {
    cover: "amr.webp",
    hero: "amr.webp",
    gallery: [2, 7, 8, 9, 10, 11, 13, 14].map((n) => `al${n}.webp`),
  },
  "medina-pavilion": {
    cover: "mp.webp",
    hero: "mp.webp",
    gallery: [1, 2, 4, 5, 8, 9, 11, 12, 13, 14, 15, 16].map((n) => `mp${n}.webp`),
  },
  "el-placer": {
    cover: "ep.webp",
    hero: "banner2.webp",
    gallery: [1, 2, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((n) => `el${n}.webp`),
  },
  shovel: {
    cover: "sl.webp",
    hero: "sl.webp",
    gallery: [1, 2, 3, 6, 7, 8, 9, 10, 11, 12, 13, 17, 18].map((n) => `sl${n}.webp`),
  },
  skoops: {
    cover: "skoops.webp",
    hero: "skoops.webp",
    gallery: [1, 2, 3, 6, 8, 10, 11, 13, 14, 16, 17, 18, 19, 20, 21, 22, 23].map((n) => `sk${n}.webp`),
  },
  "crowd-analyzer": {
    cover: "ca.webp",
    hero: "ca_bg.webp",
    gallery: [2, 4, 7, 9, 10, 12, 13, 14, 15, 16, 17, 18].map((n) => `ca${n}.webp`),
  },
  shawarmix: {
    cover: "sx.webp",
    hero: "sx.webp",
    gallery: [1, 3, 4, 6, 7, 8, 9, 10, 11].map((n) => `sx${n}.webp`),
  },
  "shrimp-shack": {
    cover: "ss.webp",
    hero: "ss.webp",
    gallery: [1, 2, 3, 5, 7, 9, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].map((n) => `ss${n}.webp`),
  },
};

const team = {
  dalal: "dalal.gif",
  raghad: "raghad.gif",
  shyma: "shyma.gif",
  nour: "nour.gif",
  israa: "israa.gif",
};

const social = {
  riyadh: ["img1.png", "dt-project/rs1.webp", "dt-project/rs2.webp", "dt-project/rs3.webp"],
  oishiisushi: ["img2.png", "dt-project/oishii1.webp", "dt-project/oishii2.webp", "dt-project/oishii5.webp"],
  idmi: ["img3.png", "dt-project/idmi2.webp", "dt-project/idmi3.webp", "dt-project/idmi4.webp"],
  skoops: ["img4.png", "dt-project/skoops1.webp", "dt-project/skoops2.webp", "dt-project/skoops3.webp"],
  shps: ["img5.png", "dt-project/shps1.webp", "dt-project/shps2.webp", "dt-project/shps3.webp"],
  "magnolia-bakery": ["hproject2.webp", "dt-project/mbk1.webp", "dt-project/mbk2.webp", "dt-project/mbk5.webp"],
};

const clientLogos = [
  "client1.svg", "client2.svg", "client3.svg", "client4.svg", "client5.svg",
  "client-logos-11.webp", "client-logos-12.webp", "client-logos-13.webp", "client-logos-14.webp",
  "client-logos-15.webp", "client-logos-16.webp", "client-logos-17.webp", "client-logos-18.webp",
  "client-logos-19.webp", "client-logos-20.webp",
];

const log = (name) => console.log("  ✓", name);

async function image(src, dest, width, quality = 78, animated = false) {
  const input = path.join(SRC, src);
  if (!fs.existsSync(input)) {
    console.warn("  ! missing", src);
    return null;
  }
  const pipe = sharp(input, { animated });
  const meta = await pipe.metadata();
  const resizeWidth = Math.min(width, meta.width || width);
  const output = animated
    ? path.join(OUT, dest)
    : path.join(OUT, dest);
  const resized = pipe.resize({ width: resizeWidth, withoutEnlargement: true });
  if (animated) resized.webp({ quality: 55, effort: 4, loop: 0 });
  else resized.webp({ quality, effort: 4 });
  await resized.toFile(output);
  return { src: `assets/img/${dest}`, width: resizeWidth, height: Math.round((meta.height / meta.width) * resizeWidth), animated };
}

async function run() {
  fs.mkdirSync(path.join(OUT, "work"), { recursive: true });
  fs.mkdirSync(path.join(OUT, "team"), { recursive: true });
  fs.mkdirSync(path.join(OUT, "clients"), { recursive: true });
  fs.mkdirSync(path.join(OUT, "social"), { recursive: true });
  fs.mkdirSync(path.join(OUT, "brand"), { recursive: true });

  // Brand files
  for (const file of ["logo-white.svg", "dt-logo.svg", "dt-social.svg", "favicon.png"]) {
    const src = path.join(SRC, file);
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(OUT, "brand", file));
  }
  log("brand marks");

  // Projects
  for (const [slug, p] of Object.entries(projects)) {
    const card = await image(p.cover, `work/${slug}-card.webp`, 1100, 80);
    const hero = await image(p.hero, `work/${slug}-hero.webp`, 1900, 82);
    const gallery = [];
    let i = 0;
    for (const file of p.gallery) {
      i++;
      const item = await image(file, `work/${slug}-${i}.webp`, 1200, 74);
      if (item) {
        item.alt = `${p.cover.replace(/\.\w+$/, "").replace(/-/g, " ")} — image ${i}`;
        gallery.push(item);
      }
    }
    manifest[slug] = { card, hero, gallery };
    log(`${slug} (${gallery.length} gallery images)`);
  }

  // Team animated name art
  manifest.team = [];
  for (const [name, file] of Object.entries(team)) {
    const item = await image(file, `team/${name}.webp`, 620, 50, true);
    if (item) manifest.team.push({ name, ...item });
  }
  log("team");

  // Social case study stills
  manifest.social = {};
  for (const [slug, files] of Object.entries(social)) {
    const list = [];
    let i = 0;
    for (const file of files) {
      i++;
      const item = await image(file, `social/${slug}-${i}.webp`, 900, 78);
      if (item) list.push(item);
    }
    manifest.social[slug] = list;
  }
  log("social case studies");

  // Team / studio photos
  manifest.studio = [];
  for (let i = 1; i <= 6; i++) {
    const item = await image(`moveimg${i}.webp`, `studio-${i}.webp`, 800, 78);
    if (item) manifest.studio.push(item);
  }
  manifest.dalal = await image("dalal.webp", "dalal.webp", 900, 84);
  log("studio");

  // Client logos — copy SVGs, convert raster marks
  manifest.clients = [];
  for (const file of clientLogos) {
    const src = path.join(SRC, file);
    if (!fs.existsSync(src)) continue;
    if (file.endsWith(".svg")) {
      fs.copyFileSync(src, path.join(OUT, "clients", file));
      manifest.clients.push(`assets/img/clients/${file}`);
    } else {
      const item = await image(file, `clients/${file}`, 340, 82);
      if (item) manifest.clients.push(item.src);
    }
  }
  log("clients");

  // Detail meta assets
  fs.writeFileSync(path.join(ROOT, "scripts", "asset-manifest.json"), JSON.stringify(manifest, null, 2));
  console.log("\nManifest written.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
