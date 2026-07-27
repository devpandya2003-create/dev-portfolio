(() => {
  "use strict";
  const root = document.documentElement;
  const themeButton = document.querySelector("#theme-toggle");
  const menuButton = document.querySelector("#menu-open");
  const mobileNav = document.querySelector("#mobile-nav");

  function applyTheme(mode) {
    const resolved = mode === "auto" ? "dark" : mode;
    root.dataset.theme = resolved;
    root.dataset.themeMode = mode;
    if (themeButton) themeButton.textContent = `Theme: ${mode}`;
    localStorage.setItem("dev-boiii-theme", mode);
  }

  function cycleTheme() {
    const modes = ["auto", "dark", "light"];
    const current = root.dataset.themeMode || "auto";
    applyTheme(modes[(modes.indexOf(current) + 1) % modes.length]);
  }

  function closeMenu() {
    if (!menuButton || !mobileNav) return;
    mobileNav.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.textContent = "Menu";
  }

  applyTheme(localStorage.getItem("dev-boiii-theme") || "auto");
  themeButton?.addEventListener("click", cycleTheme);
  menuButton?.addEventListener("click", () => {
    if (!mobileNav) return;
    const opening = mobileNav.hidden;
    mobileNav.hidden = !opening;
    menuButton.setAttribute("aria-expanded", String(opening));
    menuButton.textContent = opening ? "Close" : "Menu";
  });
  document.querySelectorAll("#mobile-nav a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });
  document.querySelectorAll('[data-scroll="top"]').forEach(button => button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" })));

  const timeNode = document.querySelector("#local-time");
  const updateTime = () => {
    if (timeNode) timeNode.textContent = `LOCAL TIME ${new Intl.DateTimeFormat([], { hour: "2-digit", minute: "2-digit" }).format(new Date())}`;
  };
  updateTime();
})();
