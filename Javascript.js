const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navigationLinks = document.querySelectorAll(".nav-link");
const year = document.querySelector("#current-year");

if (year) {
    year.textContent = new Date().getFullYear();
}

themeToggle?.addEventListener("click", () => {
    const isDark = root.dataset.theme !== "dark";
    root.dataset.theme = isDark ? "dark" : "light";
    themeToggle.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} theme`);
    themeToggle.setAttribute("title", `Switch to ${isDark ? "light" : "dark"} theme`);
});

function closeMenu() {
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation menu");
    navLinks?.classList.remove("is-open");
}

menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    navLinks?.classList.toggle("is-open", !isOpen);
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
        closeMenu();
    }
});

navigationLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
});

document.addEventListener("click", (event) => {
    if (!navLinks?.classList.contains("is-open")) {
        return;
    }

    const target = event.target;
    if (target instanceof Element && !target.closest(".nav")) {
        closeMenu();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
});

const revealItems = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => revealObserver.observe(item));
}

const sections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            navigationLinks.forEach((link) => {
                const isActive = link.getAttribute("href") === `#${entry.target.id}`;
                link.classList.toggle("active", isActive);
            });
        });
    }, { rootMargin: "-25% 0px -65% 0px" });

    sections.forEach((section) => sectionObserver.observe(section));
}
