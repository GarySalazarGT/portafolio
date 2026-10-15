/**
 * Portafolio Gary Salazar — Rediseño 2026
 * JavaScript principal (vanilla JS, sin jQuery)
 */
(function () {
  "use strict";

  const select = (el, all = false) => {
    el = el.trim();
    return all ? [...document.querySelectorAll(el)] : document.querySelector(el);
  };

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ===== Año dinámico ===== */
  const year = new Date().getFullYear();
  const y1 = select("#year");
  const y2 = select("#year-footer");
  if (y1) y1.textContent = year;
  if (y2) y2.textContent = year;

  /* ===== Navegación móvil (sidebar) ===== */
  const sidebar = select("#sidebar");
  const toggle = select("#navToggle");
  const backdrop = select("#sidebarBackdrop");

  const openSidebar = () => {
    sidebar.classList.add("show");
    backdrop.classList.add("show");
    toggle.setAttribute("aria-expanded", "true");
  };
  const closeSidebar = () => {
    sidebar.classList.remove("show");
    backdrop.classList.remove("show");
    toggle.setAttribute("aria-expanded", "false");
  };

  if (toggle) {
    toggle.addEventListener("click", () => {
      sidebar.classList.contains("show") ? closeSidebar() : openSidebar();
    });
  }
  if (backdrop) backdrop.addEventListener("click", closeSidebar);

  /* ===== Cerrar sidebar al navegar (móvil) + scroll suave controlado ===== */
  const reduceMotionScroll = prefersReducedMotion ? "auto" : "smooth";
  select("#navbar .nav-link", true).forEach((link) => {
    link.addEventListener("click", (e) => {
      const hash = link.getAttribute("href");
      if (hash && hash.startsWith("#")) {
        const target = select(hash);
        if (target) {
          e.preventDefault();
          if (hash === "#hero") {
            window.scrollTo({ top: 0, behavior: reduceMotionScroll });
          } else {
            const top = target.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top, behavior: reduceMotionScroll });
          }
          history.replaceState(null, "", hash);
        }
      }
      if (window.innerWidth <= 1200) closeSidebar();
    });
  });

  /* ===== Estado activo del menú al hacer scroll ===== */
  const navLinks = select("#navbar .nav-link", true);
  const sections = navLinks
    .map((l) => {
      const id = l.getAttribute("href");
      return id && id.startsWith("#") ? select(id) : null;
    })
    .filter(Boolean);

  const onScrollSpy = () => {
    const pos = window.scrollY + 220;
    let currentId = "";
    sections.forEach((sec) => {
      if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
        currentId = "#" + sec.id;
      }
    });
    navLinks.forEach((l) => {
      l.classList.toggle("active", l.getAttribute("href") === currentId);
    });
  };
  window.addEventListener("scroll", onScrollSpy);
  window.addEventListener("load", onScrollSpy);

  /* ===== Botón volver arriba ===== */
  const backToTop = select("#backToTop");
  if (backToTop) {
    const toggleBackToTop = () => {
      backToTop.classList.toggle("active", window.scrollY > 300);
    };
    window.addEventListener("scroll", toggleBackToTop);
    window.addEventListener("load", toggleBackToTop);
  }

  /* ===== Efecto typed (hero) ===== */
  const typed = select(".typed");
  if (typed && typeof Typed !== "undefined") {
    const items = typed.getAttribute("data-typed-items").split(",");
    new Typed(".typed", {
      strings: items,
      loop: true,
      typeSpeed: prefersReducedMotion ? 0 : 70,
      backSpeed: prefersReducedMotion ? 0 : 35,
      backDelay: 1800,
    });
  }

  /* ===== Filtros de proyectos (Isotope) ===== */
  window.addEventListener("load", () => {
    const grid = select(".projects-grid");
    if (grid && typeof Isotope !== "undefined") {
      const iso = new Isotope(grid, {
        itemSelector: ".case-card",
        layoutMode: "fitRows",
      });
      const filters = select("#portfolio-filters .filter-btn", true);
      filters.forEach((f) => {
        f.addEventListener("click", () => {
          filters.forEach((x) => {
            x.classList.remove("filter-active");
            x.setAttribute("aria-pressed", "false");
          });
          f.classList.add("filter-active");
          f.setAttribute("aria-pressed", "true");
          iso.arrange({ filter: f.getAttribute("data-filter") });
        });
      });
    }

    /* ===== Animaciones AOS ===== */
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: prefersReducedMotion ? 0 : 800,
        easing: "ease-in-out",
        once: true,
        disable: prefersReducedMotion,
      });
    }
  });
})();
