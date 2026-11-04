/* Rotondwa Portfolio — scroll reveal, 3D tilt, project slideshow */

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
  const cards = document.querySelectorAll(".card:not(.feat), .stat");
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

/* ---------- Slideshow inside featured project ---------- */
function setupSlideshow() {
  const root = document.getElementById("slideshow");
  if (!root) return;

  const slides = Array.from(root.querySelectorAll(".slide"));
  const dotsWrap = document.getElementById("slide-dots");
  const prevBtn = document.getElementById("slide-prev");
  const nextBtn = document.getElementById("slide-next");
  if (!slides.length) return;

  let index = 0;
  let timer = null;
  const INTERVAL = 4200;

  // Build dots
  if (dotsWrap) {
    dotsWrap.innerHTML = slides
      .map(
        (_, i) =>
          `<button type="button" class="dot${i === 0 ? " active" : ""}" data-i="${i}" aria-label="Slide ${i + 1}"></button>`
      )
      .join("");
    dotsWrap.querySelectorAll(".dot").forEach((dot) => {
      dot.addEventListener("click", () => goTo(Number(dot.dataset.i)));
    });
  }

  function goTo(i) {
    slides[index].classList.remove("active");
    index = ((i % slides.length) + slides.length) % slides.length;
    slides[index].classList.add("active");
    if (dotsWrap) {
      dotsWrap.querySelectorAll(".dot").forEach((d, di) => {
        d.classList.toggle("active", di === index);
      });
    }
    restart();
  }

  function next() {
    goTo(index + 1);
  }
  function prev() {
    goTo(index - 1);
  }

  function restart() {
    if (timer) clearInterval(timer);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer = setInterval(next, INTERVAL);
  }

  if (prevBtn) prevBtn.addEventListener("click", prev);
  if (nextBtn) nextBtn.addEventListener("click", next);

  // Pause on hover
  root.addEventListener("mouseenter", () => {
    if (timer) clearInterval(timer);
  });
  root.addEventListener("mouseleave", restart);

  // Touch swipe
  let touchX = null;
  root.addEventListener(
    "touchstart",
    (e) => {
      touchX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );
  root.addEventListener(
    "touchend",
    (e) => {
      if (touchX == null) return;
      const dx = e.changedTouches[0].screenX - touchX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) next();
        else prev();
      }
      touchX = null;
    },
    { passive: true }
  );

  restart();
}

document.addEventListener("DOMContentLoaded", () => {
  markStaticReveals();
  observeReveals();
  setupHeaderScroll();
  setupTiltCards();
  setupSlideshow();
});
