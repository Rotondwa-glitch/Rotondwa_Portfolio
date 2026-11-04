/* Rotondwa Portfolio — gallery + lightbox for dashboard screenshot */

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
        `<img src="${s.src}" alt="${s.caption}" loading="lazy" data-index="${i}" title="${s.caption}">`
    )
    .join("");

  gal.querySelectorAll("img").forEach((img) => {
    img.addEventListener("click", () => {
      const i = Number(img.dataset.index);
      show(i);
    });
    // Graceful fallback if image is missing
    img.addEventListener("error", () => {
      img.style.display = "none";
      if (!gal.querySelector(".missing-note")) {
        const note = document.createElement("p");
        note.className = "missing-note";
        note.style.cssText = "color:var(--muted);font-family:var(--mono);font-size:0.85rem;margin-top:0.5rem;";
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

document.addEventListener("DOMContentLoaded", () => {
  renderGallery();

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
