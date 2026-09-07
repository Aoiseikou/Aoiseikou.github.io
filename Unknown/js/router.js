/* ============================================================
   AOISEIKOU — router (PJAX)
   Intercepts [data-link] clicks, fetches target page, swaps
   #content so the shell (header, rays, sidebar, player) never
   reloads and audio keeps playing uninterrupted.

   Sets document.body.dataset.page on every navigation so CSS
   can show/hide per-page elements (e.g. hide .widget--preview
   on pages that don't need it).

   NOTE: fetch() requires a real HTTP server. On GitHub Pages
   this works automatically. For local testing, run:
     python3 -m http.server 8080
   then open http://localhost:8080/home.html
   Opening via file:// will fall back to full page loads
   and audio will stop on navigation.
   ============================================================ */

(() => {
  "use strict";

  const contentEl = document.getElementById("content");
  if (!contentEl) return;

  function pageFromUrl(url) {
    return url.split("/").pop() || "home.html";
  }

  // set on load so CSS rules fire immediately
  document.body.dataset.page = pageFromUrl(location.pathname + location.search);

  async function navigate(url, { push = true } = {}) {
    const target = pageFromUrl(url);
    const current = pageFromUrl(location.pathname);
    if (!url || target === current) return;

    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error(`fetch ${res.status}`);

      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const incoming = doc.getElementById("content");
      if (!incoming) throw new Error("no #content");

      // fade out, swap, fade in
      contentEl.style.opacity = "0";
      contentEl.style.transition = "opacity 0.18s ease";

      await new Promise(r => setTimeout(r, 160));

      contentEl.innerHTML = incoming.innerHTML;
      document.title = doc.title || document.title;
      document.body.dataset.page = target;

      // re-execute page-specific scripts (innerHTML doesn't run <script> tags)
      contentEl.querySelectorAll("script").forEach((old) => {
        const s = document.createElement("script");
        if (old.src) s.src = old.src;
        else s.textContent = old.textContent;
        old.replaceWith(s);
      });

      if (push) history.pushState({ url }, "", url);
      window.dispatchEvent(new CustomEvent("aoi:content-loaded", { detail: { url } }));

      contentEl.style.opacity = "";
      contentEl.style.transition = "";
      window.scrollTo({ top: 0 });

    } catch (err) {
      // graceful fallback: full navigation (audio stops, but nothing breaks)
      window.location.href = url;
    }
  }

  // delegated click handler — survives content swaps
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-link]");
    if (!el) return;
    const url = el.dataset.link;
    if (!url || /^https?:\/\//.test(url)) return;
    e.preventDefault();
    navigate(url);
  });

  window.addEventListener("popstate", () => {
    navigate(location.pathname.split("/").pop() || "home.html", { push: false });
  });

  window.AOI_NAVIGATE = navigate;
})();
