/* Lev Impressions — site behaviours: sticky header, mega menu, mobile drawer,
   reveal on scroll, sliding segmented controls. Works on markup that is already
   on the page, so the Shopify sections only need to print the same classes. */
(function () {
  "use strict";

  function initHeader() {
    var header = document.querySelector(".lev-header"); if (!header) return;
    var mega = header.querySelector(".lev-mega"), scrim = document.querySelector(".lev-scrim");
    var triggers = Array.prototype.slice.call(header.querySelectorAll("[data-mega]"));
    var panes = mega ? Array.prototype.slice.call(mega.querySelectorAll(".lev-mega__pane")) : [];
    var openKey = null, closeT = 0;

    function show(key) {
      clearTimeout(closeT);
      var from = triggers.map(function (t) { return t.getAttribute("data-mega"); });
      var dir = openKey && from.indexOf(key) < from.indexOf(openKey) ? "-8px" : "8px";
      panes.forEach(function (p) { p.style.setProperty("--from", openKey ? dir : "0px"); p.classList.toggle("is-on", p.getAttribute("data-pane") === key); });
      triggers.forEach(function (t) { t.setAttribute("aria-expanded", t.getAttribute("data-mega") === key ? "true" : "false"); });
      mega.classList.add("is-open"); header.classList.add("is-open"); if (scrim) scrim.classList.add("is-on");
      openKey = key;
    }
    function hide(now) {
      clearTimeout(closeT);
      closeT = setTimeout(function () {
        if (!mega) return;
        mega.classList.remove("is-open"); header.classList.remove("is-open"); if (scrim) scrim.classList.remove("is-on");
        triggers.forEach(function (t) { t.setAttribute("aria-expanded", "false"); });
        openKey = null;
      }, now ? 0 : 140);
    }
    triggers.forEach(function (t) {
      var key = t.getAttribute("data-mega");
      t.addEventListener("mouseenter", function () { show(key); });
      t.addEventListener("focus", function () { show(key); });
      t.addEventListener("click", function (e) { e.preventDefault(); openKey === key && mega.classList.contains("is-open") ? hide(true) : show(key); });
    });
    if (mega) {
      mega.addEventListener("mouseenter", function () { clearTimeout(closeT); });
      mega.addEventListener("mouseleave", function () { hide(); });
      header.querySelector(".lev-nav").addEventListener("mouseleave", function () { hide(); });
    }
    if (scrim) scrim.addEventListener("click", function () { hide(true); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { hide(true); closeDrawer(); } });

    var onScroll = function () { header.classList.toggle("is-stuck", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

    var drawer = document.querySelector(".lev-drawer");
    function closeDrawer() { if (drawer) { drawer.classList.remove("is-open"); document.documentElement.style.overflow = ""; } }
    document.querySelectorAll("[data-drawer-open]").forEach(function (b) { b.addEventListener("click", function () { drawer.classList.add("is-open"); document.documentElement.style.overflow = "hidden"; }); });
    document.querySelectorAll("[data-drawer-close]").forEach(function (b) { b.addEventListener("click", closeDrawer); });
  }

  function initReveal() {
    var els = document.querySelectorAll(".reveal:not(.is-in)"); if (!els.length) return;
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("is-in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* Segmented control: moves the pill under the chosen button. */
  function seg(el) {
    var pill = el.querySelector(".seg__pill") || el.insertBefore(Object.assign(document.createElement("span"), { className: "seg__pill" }), el.firstChild);
    function place() {
      var on = el.querySelector("button.is-on"); if (!on) { pill.style.width = "0"; return; }
      pill.style.width = on.offsetWidth + "px"; pill.style.transform = "translateX(" + on.offsetLeft + "px)";
    }
    el.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b || b.disabled) return;
      el.querySelectorAll("button").forEach(function (x) { x.classList.toggle("is-on", x === b); });
      place(); el.dispatchEvent(new CustomEvent("seg:change", { detail: b.value || b.getAttribute("data-value") }));
    });
    window.addEventListener("resize", place);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
    requestAnimationFrame(place);
    return { place: place };
  }

  function init() { initHeader(); initReveal(); document.querySelectorAll(".seg[data-auto]").forEach(seg); }
  window.LevSite = { init: init, seg: seg, reveal: initReveal };
  if (document.readyState !== "loading") setTimeout(function () { if (!window.LevSiteManual) init(); }, 0);
  else document.addEventListener("DOMContentLoaded", function () { if (!window.LevSiteManual) init(); });
})();
