/* Lev Impressions motion layer. Adds movement on top of pages that already work
   without it: nothing here is needed to read or use the page.

   Scroll:  headline words rise one after another, images wipe in, a thin
            progress line shows how far down you are, the big word strip speeds
            up as you scroll, a few shapes drift at their own pace.
   Pointer: cards tilt toward the mouse with a soft light, big buttons pull
            toward it, text links underline with a swipe.
   Banner:  soft colour shapes drift behind it and follow the mouse a little,
            the cards float, the changing word rises letter by letter.
   Flow:    pages fade out and in, menu items arrive one after another, prices
            tick when they change.

   Everything is skipped when the visitor has asked their device for less motion. */
(function () {
  var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (calm) return;
  document.documentElement.classList.add("mo");

  function all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------- headline words rise ---------- */
  function splitWords(el) {
    if (el._split) return; el._split = true;
    var n = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            var mask = document.createElement("span"); mask.className = "mo-w";
            var inner = document.createElement("span"); inner.textContent = part; inner.style.setProperty("--n", n++);
            mask.appendChild(inner); frag.appendChild(mask);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== "BR") {
          if (child.id || child.children.length) {           // a live value (a date, a price): move it as one piece
            var mask = document.createElement("span"); mask.className = "mo-w";
            node.replaceChild(mask, child); child.style.setProperty("--n", n++); child.classList.add("mo-w__keep"); mask.appendChild(child);
          } else walk(child);
        }
      });
    })(el);
    el.classList.add("mo-words");
  }

  /* ---------- watch things come into view ---------- */
  var seen = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target; el.classList.add("mo-on"); seen.unobserve(el);
      // once a piece has arrived, hand it back to the page's normal styles (hover lifts, shadows)
      if (el.classList.contains("mo-wipe")) setTimeout(function () { el.classList.add("mo-done"); }, 1000);
      if (el.classList.contains("mo-row")) setTimeout(function () {
        Array.prototype.forEach.call(el.children, function (c) { c.classList.add("is-in"); c.style.transitionDelay = "0ms"; });
        el.classList.remove("mo-row", "mo-on");
      }, 900 + el.children.length * 70);
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });

  function setup() {
    // headlines (the banner's own h1 has a live swapping word, so it is handled apart)
    all("main h2.t-h1, main h2.t-display, main .section__head h2, main .rowhead h2").forEach(function (h) {
      splitWords(h);
      var holder = h.closest(".reveal"); if (holder) { holder.classList.add("mo-hold"); }
      seen.observe(h);
    });
    // images that wipe in
    // (a fully clipped element never counts as "in view", so its parent is watched for it)
    all("#feat-img, .who__mock, .bulk, .closer").forEach(function (el) {
      el.classList.add("mo-wipe");
      var gate = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        gate.disconnect(); el.classList.add("mo-on", "is-in");
        setTimeout(function () { el.classList.add("mo-done"); }, 1000);
      }, { rootMargin: "0px 0px -14% 0px", threshold: 0.1 });
      gate.observe(el.parentElement);
    });
    // rows whose children arrive one after another
    all("#cats, .steps, #brands, .who__list, #when-line, .faq").forEach(function (row) {
      Array.prototype.forEach.call(row.children, function (c, i) { c.style.setProperty("--mo-i", i); });
      row.classList.add("mo-row"); seen.observe(row);
    });
    // text links that underline with a swipe
    all(".lev-footer a, .pb-link, .crumbs a").forEach(function (a) { if (!a.querySelector("img, svg")) a.classList.add("mo-link"); });
    tiltCards(); magnets(); ticks();
  }

  /* ---------- cards tilt toward the mouse ---------- */
  function tiltCards() {
    if (!fine) return;
    document.addEventListener("pointermove", function (e) {
      var card = e.target.closest && e.target.closest(".pcard__img, .cat, .step, .who__mock, .feat__img");
      if (tiltCards.on && tiltCards.on !== card) reset(tiltCards.on);
      if (!card) { tiltCards.on = null; return; }
      tiltCards.on = card;
      var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.classList.add("mo-tilt");
      card.style.setProperty("--rx", ((0.5 - y) * 7).toFixed(2) + "deg");
      card.style.setProperty("--ry", ((x - 0.5) * 9).toFixed(2) + "deg");
      card.style.setProperty("--gx", (x * 100).toFixed(1) + "%"); card.style.setProperty("--gy", (y * 100).toFixed(1) + "%");
    }, { passive: true });
    function reset(card) { card.style.setProperty("--rx", "0deg"); card.style.setProperty("--ry", "0deg"); card.classList.remove("mo-tilt"); }
    document.addEventListener("pointerleave", function () { if (tiltCards.on) { reset(tiltCards.on); tiltCards.on = null; } });
  }

  /* ---------- big buttons pull toward the mouse ---------- */
  function magnets() {
    if (!fine) return;
    all(".btn--lg, .lev-header .btn--accent").forEach(function (b) {
      b.classList.add("mo-magnet");
      b.addEventListener("pointermove", function (e) { var r = b.getBoundingClientRect(); b.style.setProperty("--mx", ((e.clientX - r.left - r.width / 2) * 0.2).toFixed(1) + "px"); b.style.setProperty("--my", ((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1) + "px"); });
      b.addEventListener("pointerleave", function () { b.style.setProperty("--mx", "0px"); b.style.setProperty("--my", "0px"); });
    });
  }

  /* ---------- numbers tick when they change ---------- */
  function ticks() {
    all("#bulk-unit, #bulk-total, #bulk-qty, #feat-price, #feat-name, #when-date").forEach(function (el) {
      new MutationObserver(function () { el.classList.remove("mo-tick"); void el.offsetWidth; el.classList.add("mo-tick"); }).observe(el, { childList: true, characterData: true, subtree: true });
    });
  }

  /* ---------- the banner ---------- */
  function banner() {
    var hero = document.querySelector(".hero"); if (!hero) return;
    var glow = document.createElement("div"); glow.className = "mo-glow"; glow.setAttribute("aria-hidden", "true");
    glow.innerHTML = "<i></i><i></i><i></i>";
    hero.insertBefore(glow, hero.firstChild);
    hero.classList.add("mo-hero");
    // the changing word: its letters rise one after another
    all(".hero__swap span", hero).forEach(function (w) {
      var text = w.textContent; w.textContent = ""; w.setAttribute("aria-label", text);
      text.split("").forEach(function (ch, i) { var l = document.createElement("i"); l.textContent = ch; l.style.setProperty("--n", i); l.setAttribute("aria-hidden", "true"); w.appendChild(l); });
    });
    if (!fine) return;
    var stage = hero.querySelector(".hero__stage"), cards = all(".mock", hero), blobs = all("i", glow);
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      cards.forEach(function (c, i) { var d = (i + 1) * 7; c.style.setProperty("--tx", (x * d).toFixed(1) + "px"); c.style.setProperty("--ty", (y * d).toFixed(1) + "px"); });
      blobs.forEach(function (b, i) { var d = (i + 1) * 26; b.style.setProperty("--bx", (x * d).toFixed(1) + "px"); b.style.setProperty("--by", (y * d).toFixed(1) + "px"); });
    }, { passive: true });
    hero.addEventListener("pointerleave", function () { cards.concat(blobs).forEach(function (n) { ["--tx", "--ty", "--bx", "--by"].forEach(function (p) { n.style.setProperty(p, "0px"); }); }); });
    void stage;
  }

  /* ---------- things tied to how far and how fast you scroll ---------- */
  function scrolling() {
    var bar = document.createElement("div"); bar.className = "mo-progress"; bar.setAttribute("aria-hidden", "true"); document.body.appendChild(bar);
    var drift = all(".hero__stage .sticker, .cat svg.glyph, .words").map(function (el) { return { el: el, k: el.classList.contains("words") ? 0 : el.classList.contains("sticker") ? -0.06 : 0.05 }; });
    var strip = document.querySelector(".words__track"), stripAnim = null, last = window.scrollY, speed = 1, queued = false;
    function frame() {
      queued = false;
      var y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0).toFixed(4) + ")";
      drift.forEach(function (d) { if (!d.k) return; var r = d.el.getBoundingClientRect(); if (r.bottom < -100 || r.top > innerHeight + 100) return; d.el.style.setProperty("--py", ((r.top + r.height / 2 - innerHeight / 2) * d.k).toFixed(1) + "px"); });
      // the word strip runs faster while you scroll, then eases back
      if (strip) {
        if (!stripAnim && strip.getAnimations) stripAnim = strip.getAnimations()[0] || null;
        var v = Math.min(6, Math.abs(y - last) / 12); speed += (1 + v - speed) * 0.25;
        if (stripAnim) stripAnim.playbackRate = speed;
        if (Math.abs(speed - 1) > 0.02) { queued = true; requestAnimationFrame(frame); }
      }
      last = y;
    }
    window.addEventListener("scroll", function () { if (!queued) { queued = true; requestAnimationFrame(frame); } }, { passive: true });
    frame();
  }

  /* ---------- pages fade out before the next one loads ---------- */
  function pageFlow() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[href]");
      if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
      var url; try { url = new URL(a.href, location.href); } catch (err) { return; }
      if (url.origin !== location.origin || (url.pathname === location.pathname && url.search === location.search)) return;
      e.preventDefault(); document.documentElement.classList.add("mo-leaving");
      setTimeout(function () { location.href = a.href; }, 190);
    });
    window.addEventListener("pageshow", function () { document.documentElement.classList.remove("mo-leaving"); });
  }

  function start() { banner(); setup(); scrolling(); pageFlow(); }
  // run after the page's own script has filled the lists (cards, tiles, brands)
  if (document.readyState === "complete") setTimeout(start, 60); else window.addEventListener("load", function () { setTimeout(start, 60); });
  window.LevMotion = { refresh: setup };
})();

/* ---------- more motion elements (added 2026-11-14) ----------
   Floating shapes between sections, a
   turning badge, sparkles around the
   banner cards, a little burst when a main button is clicked, and the brand
   names running as a strip. */
(function () {
  var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (calm) return;
  var NS = "http://www.w3.org/2000/svg";
  function all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function svg(viewBox, inner, cls) { var s = document.createElementNS(NS, "svg"); s.setAttribute("viewBox", viewBox); if (cls === "mark") { s.setAttribute("preserveAspectRatio", "none"); cls = ""; } s.setAttribute("aria-hidden", "true"); if (cls) s.setAttribute("class", cls); s.innerHTML = inner; return s; }

  /* shapes that float in the margins between sections and drift as you scroll */
  var SHAPES = [
    '<path d="M50 4C54 34 66 46 96 50C66 54 54 66 50 96C46 66 34 54 4 50C34 46 46 34 50 4Z"/>',
    '<path d="M50 88C22 66 8 50 8 32C8 18 20 10 32 10C40 10 46 14 50 22C54 14 60 10 68 10C80 10 92 18 92 32C92 50 78 66 50 88Z"/>',
    '<circle cx="50" cy="50" r="34" fill="none" stroke-width="12"/>',
    '<path d="M40 8H60V40H92V60H60V92H40V60H8V40H40Z"/>',
    '<path d="M6 60C22 30 38 30 50 50S78 70 94 40" fill="none" stroke-width="12" stroke-linecap="round"/>'
  ];
  var COLOURS = ["#ff5a1f", "#5b3df5", "#ffc83d", "#0e0e10"];
  var floaters = [];
  function shapes() {
    all("main > section").forEach(function (sec, i) {
      if (i < 1 || sec.classList.contains("hero") || sec.classList.contains("brands")) return;
      if (getComputedStyle(sec).position === "static") sec.style.position = "relative";
      for (var k = 0; k < 2; k++) {
        var n = i * 2 + k, colour = COLOURS[n % COLOURS.length];
        var el = svg("0 0 100 100", SHAPES[n % SHAPES.length], "mo-deco");
        el.style.setProperty("--c", colour);
        el._side = k ? "right" : "left";
        el.style.top = (k ? 62 : 8) + (n % 3) * 6 + "%";
        el.style.width = 22 + (n % 4) * 9 + "px";
        el.style.setProperty("--spin", (n % 2 ? -1 : 1) * (14 + (n % 5) * 5) + "s");
        sec.appendChild(el);
        floaters.push({ el: el, k: (n % 2 ? -1 : 1) * (0.06 + (n % 3) * 0.04) });
      }
    });
    place(); addEventListener("resize", place);
  }
  /* Each shape goes in the middle of the empty margin beside the page's column,
     clear of any words or cards. With no real margin, the shapes are hidden. */
  function place() {
    floaters.forEach(function (f) {
      var sec = f.el.parentNode, r = sec.getBoundingClientRect(), pad = parseFloat(getComputedStyle(sec).paddingLeft) || 0;
      var room = f.el._side === "left" ? r.left : innerWidth - r.right, w = parseFloat(f.el.style.width) || 30;
      var gap = room + pad * 0.4;                         // a little of the column's own padding is free too
      if (gap < w + 56) { f.el.style.display = "none"; return; }
      f.el.style.display = "";
      f.el.style[f.el._side] = ((gap - w) / 2 - room).toFixed(0) + "px";
    });
  }

  /* a round badge with turning words, sitting where the banner meets the word strip */
  var badge = null;
  function turningBadge() {
    var hero = document.querySelector(".hero"); if (!hero) return;
    badge = document.createElement("div"); badge.className = "mo-badge"; badge.setAttribute("aria-hidden", "true");
    badge.appendChild(svg("0 0 200 200",
      '<circle cx="100" cy="100" r="98" class="mo-badge__bg"/>' +
      '<defs><path id="mo-badge-path" d="M100 100m-74 0a74 74 0 1 1 148 0a74 74 0 1 1 -148 0"/></defs>' +
      '<g class="mo-badge__spin"><text><textPath href="#mo-badge-path" textLength="455">MADE WITH HEART • PRINTED IN MIAMI • </textPath></text></g>' +
      '<path class="mo-badge__heart" d="M100 128C80 112 70 102 70 90C70 81 77 75 85 75C91 75 96 78 100 84C104 78 109 75 115 75C123 75 130 81 130 90C130 102 120 112 100 128Z"/>'));
    hero.appendChild(badge);
  }

  /* little stars blink around the banner cards */
  function sparkles() {
    var stage = document.querySelector(".hero__stage"); if (!stage) return;
    setInterval(function () {
      if (document.hidden) return;
      var r = stage.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
      var s = svg("0 0 100 100", SHAPES[0], "mo-spark");
      s.style.left = 4 + Math.random() * 92 + "%"; s.style.top = 2 + Math.random() * 92 + "%";
      s.style.width = 14 + Math.random() * 22 + "px"; s.style.setProperty("--c", COLOURS[Math.floor(Math.random() * 3)]);
      stage.appendChild(s); setTimeout(function () { s.remove(); }, 1500);
    }, 650);
  }

  /* a small burst when a main button is clicked */
  function bursts() {
    document.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest(".btn--accent, .btn--lg"); if (!b) return;
      for (var i = 0; i < 10; i++) {
        var p = document.createElement("i"); p.className = "mo-bit";
        var a = Math.PI * 2 * i / 10 + Math.random() * 0.5, d = 46 + Math.random() * 46;
        p.style.left = e.clientX + "px"; p.style.top = e.clientY + "px";
        p.style.setProperty("--x", Math.cos(a) * d + "px"); p.style.setProperty("--y", Math.sin(a) * d + "px");
        p.style.background = COLOURS[i % 3];
        document.body.appendChild(p); (function (n) { setTimeout(function () { n.remove(); }, 700); })(p);
      }
    });
  }

  /* the brand names run as a strip */
  function brandStrip() {
    var ul = document.getElementById("brands"); if (!ul || ul.children.length < 3) return;
    ul.classList.remove("mo-row", "mo-on");
    Array.prototype.forEach.call(ul.children, function (li) { li.style.removeProperty("--mo-i"); });
    ul.innerHTML += ul.innerHTML;
    all("li", ul).slice(ul.children.length / 2).forEach(function (li) { li.setAttribute("aria-hidden", "true"); });
    var box = document.createElement("div"); box.className = "mo-strip";
    ul.parentNode.insertBefore(box, ul); box.appendChild(ul);
  }

  /* things tied to scroll: floating shapes drift, the badge turns faster, the closing headline grows in */
  function onScroll() {
    var queued = false, last = scrollY, turn = 0, closer = document.querySelector(".closer h2");
    function frame() {
      queued = false;
      var y = scrollY, mid = innerHeight / 2;
      floaters.forEach(function (f) { var r = f.el.parentNode.getBoundingClientRect(); if (r.bottom < -200 || r.top > innerHeight + 200) return; f.el.style.setProperty("--py", ((r.top + r.height / 2 - mid) * f.k).toFixed(1) + "px"); });
      if (badge) { turn += (y - last) * 0.35; badge.style.setProperty("--turn", turn.toFixed(1) + "deg"); }
      if (closer) { var c = closer.getBoundingClientRect(), p = Math.max(0, Math.min(1, (innerHeight - c.top) / (innerHeight * 0.7))); closer.style.setProperty("--grow", (0.82 + p * 0.18).toFixed(3)); }
      last = y;
    }
    addEventListener("scroll", function () { if (!queued) { queued = true; requestAnimationFrame(frame); } }, { passive: true });
    frame();
  }

  function start() { shapes(); turningBadge(); sparkles(); bursts(); brandStrip(); onScroll(); }
  // after the first part of this file has split the headlines into words
  if (document.readyState === "complete") setTimeout(start, 220); else addEventListener("load", function () { setTimeout(start, 220); });
})();
