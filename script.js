/* =========================================================
   Discover India — script.js
   1. Navigation style change on scroll
   2. Mobile menu toggle
   3. Scroll-reveal animations (Intersection Observer)
   4. Hero parallax
   5. Active link highlight
   ========================================================= */

const header = document.getElementById("siteHeader");
const toggle = document.getElementById("navToggle");
const navLinks = document.querySelectorAll(".primary-nav a");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* 1. Add a glass background to the header after scrolling 60px */
function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 60);
}
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

/* 2. Open / close the mobile menu */
toggle.addEventListener("click", () => {
  const open = document.body.classList.toggle("nav-open");
  toggle.setAttribute("aria-expanded", open);
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
// Close the menu after a link is chosen
navLinks.forEach((link) =>
  link.addEventListener("click", () => {
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

/* 3. Reveal elements when they scroll into view, with a small stagger */
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reduceMotion) {
  // Stagger siblings inside grids
  document.querySelectorAll(".card-grid, .exp-grid").forEach((grid) => {
    [...grid.children].forEach((child, i) => child.style.setProperty("--delay", i * 0.12 + "s"));
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // animate only once
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  revealItems.forEach((el) => observer.observe(el));
} else {
  revealItems.forEach((el) => el.classList.add("visible"));
}

/* 4. Gentle parallax: the hero image moves slower than the page */
const heroMedia = document.getElementById("heroMedia");
if (!reduceMotion) {
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y < window.innerHeight) heroMedia.style.transform = `translateY(${y * 0.3}px)`;
      ticking = false;
    });
  }, { passive: true });
}

/* 5. Highlight the nav link of the section currently on screen */
const sections = [...navLinks].map((a) => document.querySelector(a.getAttribute("href")));
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((a) =>
          a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id)
        );
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => s && sectionObserver.observe(s));

/* Footer year */
document.getElementById("year").textContent = new Date().getFullYear();
