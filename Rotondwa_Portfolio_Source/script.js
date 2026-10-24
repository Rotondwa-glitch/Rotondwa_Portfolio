/* ============================================
   Rotondwa Gift Madi — Portfolio Script
   3D tilt, scroll reveal, terminal, data
   ============================================ */

// --- Data (edit these to update the site) ---

const terminalLines = [
  { html: '<span class="cmd">$</span> whoami' },
  { html: '<span class="out">Rotondwa Gift Madi</span>' },
  { html: '<span class="cmd">$</span> cat role.txt' },
  { html: '<span class="val">Full Stack Developer</span>' },
  { html: '<span class="cmd">$</span> echo $STACK' },
  { html: '<span class="str">Flutter · C# · ASP.NET · Supabase</span>' },
  { html: '<span class="cmd">$</span> ls education/' },
  { html: '<span class="out">CUT Diploma · FNB App Academy</span>' },
  { html: '<span class="cmd">$</span> git remote -v' },
  { html: '<span class="val">github.com/Rotondwa-glitch</span>' },
];

const projects = [
  {
    title: "Student Assistant Application",
    lang: "Dart / Flutter",
    description:
      "Flutter app with Supabase auth, student management, document uploads and application status tracking.",
    links: [
      {
        label: "repo →",
        url: "https://github.com/Rotondwa-glitch/Student-Assistant-Application",
      },
    ],
  },
  {
    title: "Vehicle Management App",
    lang: "Flutter / Dart",
    description:
      "Add, edit and delete vehicles. Tracks active / inactive / in-maintenance status. Model: regNo, make, model, year.",
    links: [
      {
        label: "repo →",
        url: "https://github.com/Rotondwa-glitch/vehicle-management-app",
      },
    ],
  },
  {
    title: "Vehicle Service Management",
    lang: "C# · Flutter · Supabase",
    description:
      "Web (ASP.NET Core MVC) + mobile (Flutter) for workshops: roles, appointments, job cards, quotations, shared Supabase backend.",
    links: [
      { label: "github →", url: "https://github.com/Rotondwa-glitch" },
    ],
  },
  {
    title: "Calculator App",
    lang: "C# · HTML · CSS · SQLite",
    description:
      "CRUD calculator management with name, serial, model and functions. Built with OOP and MVC-style structure.",
    links: [
      {
        label: "Calculator-App →",
        url: "https://github.com/Rotondwa-glitch/Calculator-App",
      },
      {
        label: "App-1 →",
        url: "https://github.com/Rotondwa-glitch/Calculator-App-1",
      },
    ],
  },
  {
    title: "Digital Wave Studio",
    lang: "HTML",
    description: "Marketing site focused on selling website / web design services.",
    links: [
      {
        label: "repo →",
        url: "https://github.com/Rotondwa-glitch/Digital-wave-studio",
      },
    ],
  },
  {
    title: "Pine City Zoo",
    lang: "HTML",
    description: "Zoo map and related content pages.",
    links: [
      {
        label: "repo →",
        url: "https://github.com/Rotondwa-glitch/Pine-City-Zoo",
      },
    ],
  },
  {
    title: "Contact Book App",
    lang: "HTML",
    description: "Add, edit and delete contacts.",
    links: [
      {
        label: "repo →",
        url: "https://github.com/Rotondwa-glitch/Contact-Book-APP",
      },
    ],
  },
  {
    title: "More on GitHub",
    lang: "profile",
    description:
      "Profile README and other repos (including private ASP.NET Core DB and Refinery work).",
    links: [
      {
        label: "github.com/Rotondwa-glitch →",
        url: "https://github.com/Rotondwa-glitch",
      },
    ],
  },
];

const skills = {
  languages: ["C#", "Python", "SQL / SQLite", "JavaScript", "HTML / CSS", "Dart"],
  frameworks: ["ASP.NET Core MVC", "Flutter", "Supabase", "OOP / CRUD", "APIs"],
  tools: ["Git", "GitHub", "VS Code", "Visual Studio", "MS Office"],
};

const references = [
  { name: "Mr Mpitsi", phone: "084 448 6314" },
  { name: "Mr Leshole", phone: "065 615 8577" },
  { name: "Mr Moopeloa", phone: "083 492 0640" },
];

// --- Render helpers ---

function renderTerminal() {
  const body = document.getElementById("terminal-body");
  if (!body) return;

  body.innerHTML = "";
  terminalLines.forEach((line, i) => {
    const div = document.createElement("div");
    div.className = "term-line";
    div.style.animationDelay = `${i * 0.12}s`;
    div.innerHTML = line.html;
    body.appendChild(div);
  });
}

function renderProjects() {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  grid.innerHTML = projects
    .map(
      (p, i) => `
    <article class="project-card reveal reveal-delay-${(i % 4) + 1}" data-tilt>
      <div class="top">
        <h3>${escapeHtml(p.title)}</h3>
        <span class="lang">${escapeHtml(p.lang)}</span>
      </div>
      <p>${escapeHtml(p.description)}</p>
      <div class="project-links">
        ${p.links
          .map(
            (l) =>
              `<a href="${escapeAttr(l.url)}" target="_blank" rel="noopener">${escapeHtml(l.label)}</a>`
          )
          .join("")}
      </div>
    </article>
  `
    )
    .join("");

  setupTiltCards();
  observeReveals();
}

function renderSkills() {
  const map = {
    "skills-languages": skills.languages,
    "skills-frameworks": skills.frameworks,
    "skills-tools": skills.tools,
  };

  Object.entries(map).forEach(([id, list]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = list
      .map((s) => `<span class="tag">${escapeHtml(s)}</span>`)
      .join("");
  });
}

function renderReferences() {
  const el = document.getElementById("refs-list");
  if (!el) return;

  el.innerHTML = references
    .map(
      (r) => `
    <div class="ref-item">
      <strong>${escapeHtml(r.name)}</strong>
      <span>${escapeHtml(r.phone)}</span>
    </div>
  `
    )
    .join("");
}

function setYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = String(new Date().getFullYear());
}

// --- 3D mouse-tilt on cards ---
function setupTiltCards() {
  const cards = document.querySelectorAll("[data-tilt]");
  const maxTilt = 8;

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;
      const rotateY = ((x - midX) / midX) * maxTilt;
      const rotateX = ((midY - y) / midY) * maxTilt;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.02)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

// --- Scroll reveal ---
function observeReveals() {
  const els = document.querySelectorAll(".reveal:not(.visible)");
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );

  els.forEach((el) => observer.observe(el));
}

function markStaticReveals() {
  document
    .querySelectorAll(
      ".section-header, .two-col > .card, .timeline > .card, .skills-grid > .card, .cert-banner, .contact-grid > .card"
    )
    .forEach((el, i) => {
      el.classList.add("reveal");
      el.classList.add(`reveal-delay-${(i % 4) + 1}`);
    });
}

// Highlight active nav link while scrolling
function setupNavHighlight() {
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll(".nav-links a");

  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        links.forEach((a) => {
          a.classList.toggle("active", a.getAttribute("href") === `#${id}`);
        });
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((s) => observer.observe(s));
}

// Header shadow on scroll
function setupHeaderScroll() {
  const header = document.querySelector("header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 12);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(str) {
  return String(str).replace(/"/g, "&quot;");
}

// --- Init ---
document.addEventListener("DOMContentLoaded", () => {
  renderTerminal();
  markStaticReveals();
  renderProjects();
  renderSkills();
  renderReferences();
  setYear();
  setupNavHighlight();
  setupHeaderScroll();
  observeReveals();
});
