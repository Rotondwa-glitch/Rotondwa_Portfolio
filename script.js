/* Rotondwa Portfolio — gallery, lightbox, scroll reveal, 3D tilt */

const screenshots = [
  {
    src: "images/dashboard.png",
    caption: "Mister Auto and Turbo — Dashboard",
  },
];

let current = 0;

function renderGallery() {
  const gal = document.getElementById("gal");
  if (!gal) return;

  gal.innerHTML = screenshots
    .map(
      (s, i) =>
        `<img src="${s.src}" alt="${s.caption}" loading="lazy" data-index="${i}" title="${s.caption}" class="reveal">`
    )
    .join("");

  gal.querySelectorAll("img").forEach((img) => {
    img.addEventListener("click", () => {
      const i = Number(img.dataset.index);
      show(i);
    });
    img.addEventListener("error", () => {
      img.style.display = "none";
      if (!gal.querySelector(".missing-note")) {
        const note = document.createElement("p");
        note.className = "missing-note";
        note.style.cssText =
          "color:var(--muted);font-family:var(--mono);font-size:0.85rem;margin-top:0.5rem;";
        note.textContent =
          "Add your dashboard screenshot as images/dashboard.png in the repo.";
        gal.appendChild(note);
      }
    });
  });
}

function show(index) {
  if (!screenshots.length) return;
  current = ((index % screenshots.length) + screenshots.length) % screenshots.length;
  const s = screenshots[current];
  const lb = document.getElementById("lb");
  const lbi = document.getElementById("lbi");
  const lbc = document.getElementById("lbc");
  if (!lb || !lbi) return;
  lbi.src = s.src;
  lbi.alt = s.caption;
  if (lbc) lbc.textContent = s.caption;
  lb.classList.add("open");
  document.body.style.overflow = "hidden";
}

function hide() {
  const lb = document.getElementById("lb");
  if (lb) lb.classList.remove("open");
  document.body.style.overflow = "";
}

function next() {
  show(current + 1);
}

function prev() {
  show(current - 1);
}

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
    { rootMargin: "0px 0px -6% 0px", threshold: 0.08 }
  );
  els.forEach((el) => observer.observe(el));
}

function markStaticReveals() {
  const selectors = [
    ".stats .stat",
    "#about .section-text",
    "#skills .card",
    "#projects .card",
    "#gallery .section-text",
    "#experience .item",
    "#contact .section-text",
    "#contact .btns",
  ];
  document.querySelectorAll(selectors.join(", ")).forEach((el, i) => {
    el.classList.add("reveal");
    el.classList.add("reveal-delay-" + ((i % 4) + 1));
  });
}

function setupHeaderScroll() {
  const nav = document.querySelector("nav");
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 12);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function setupTiltCards() {
  const cards = document.querySelectorAll(".card, .stat");
  const maxTilt = 7;
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (window.innerWidth < 640) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;
      const rotateY = ((x - midX) / midX) * maxTilt;
      const rotateX = ((midY - y) / midY) * maxTilt;
      card.style.transform =
        "perspective(900px) rotateX(" +
        rotateX +
        "deg) rotateY(" +
        rotateY +
        "deg) translateY(-6px) scale(1.02)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderGallery();
  markStaticReveals();
  observeReveals();
  setupHeaderScroll();
  setupTiltCards();

  const cl = document.getElementById("cl");
  const nx = document.getElementById("nx");
  const pv = document.getElementById("pv");
  if (cl) cl.addEventListener("click", hide);
  if (nx) nx.addEventListener("click", next);
  if (pv) pv.addEventListener("click", prev);

  const lb = document.getElementById("lb");
  if (lb) {
    lb.addEventListener("click", (e) => {
      if (e.target === lb) hide();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (!document.getElementById("lb")?.classList.contains("open")) return;
    if (e.key === "Escape") hide();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });
});
