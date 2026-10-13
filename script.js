const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");
const year = document.querySelector("#year");

if (year) {
  year.textContent = String(new Date().getFullYear());
}

if (header && toggle && nav) {
  const navLinks = [...nav.querySelectorAll("a")];
  const mobileQuery = window.matchMedia("(max-width: 760px)");
  const background = document.querySelectorAll("main, .site-footer");

  const setNavOpen = (open) => {
    const show = open && mobileQuery.matches;
    nav.classList.toggle("is-open", show);
    toggle.setAttribute("aria-expanded", String(show));
    toggle.setAttribute("aria-label", show ? "Close menu" : "Open menu");
    document.body.classList.toggle("nav-open", show);
    background.forEach((region) => region.toggleAttribute("inert", show));

    if (mobileQuery.matches) {
      nav.setAttribute("aria-hidden", String(!show));
    } else {
      nav.removeAttribute("aria-hidden");
    }
  };

  setNavOpen(false);

  toggle.addEventListener("click", () => {
    const willOpen = !nav.classList.contains("is-open");
    setNavOpen(willOpen);
    if (willOpen && navLinks[0]) navLinks[0].focus();
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => setNavOpen(false));
  });

  nav.addEventListener("click", (event) => {
    if (event.target === nav) setNavOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (!nav.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      setNavOpen(false);
      toggle.focus();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = [toggle, ...navLinks];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const onBreakpointChange = () => setNavOpen(false);
  if (typeof mobileQuery.addEventListener === "function") {
    mobileQuery.addEventListener("change", onBreakpointChange);
  } else if (typeof mobileQuery.addListener === "function") {
    mobileQuery.addListener(onBreakpointChange);
  }

  const sections = [...document.querySelectorAll("main section[id]")];

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);

    const marker = window.scrollY + header.offsetHeight + 24;
    let currentId = "";
    sections.forEach((section) => {
      if (section.offsetTop <= marker) currentId = section.id;
    });

    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${currentId}`;
      if (active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

const revealItems = document.querySelectorAll(".reveal");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}
