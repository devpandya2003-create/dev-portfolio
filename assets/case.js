(() => {
  "use strict";
  const root = document.documentElement;
  const themeButton = document.querySelector("#theme-toggle");
  const menuButton = document.querySelector("#menu-open");
  const mobileNav = document.querySelector("#mobile-nav");

  function applyTheme(mode) {
    if (!["auto", "dark", "light"].includes(mode)) mode = "auto";
    const resolved = mode === "auto" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : mode;
    root.dataset.theme = resolved;
    root.dataset.themeMode = mode;
    if (themeButton) themeButton.textContent = `Theme: ${mode}`;
    try { localStorage.setItem("dev-finance-theme", mode); } catch { /* Theme controls work when storage is disabled. */ }
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", resolved === "dark" ? "#101c19" : "#f7f6f2");
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

  let savedTheme = "auto";
  try { savedTheme = localStorage.getItem("dev-finance-theme") || "auto"; } catch { /* Optional browser preference only. */ }
  applyTheme(savedTheme);
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (root.dataset.themeMode === "auto") applyTheme("auto");
  });
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
  document.querySelectorAll('[data-scroll="top"]').forEach(button => button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "auto" })));

  const timeNode = document.querySelector("#local-time");
  const updateTime = () => {
    if (timeNode) timeNode.textContent = `LOCAL TIME ${new Intl.DateTimeFormat([], { hour: "2-digit", minute: "2-digit" }).format(new Date())}`;
  };
  updateTime();
})();
