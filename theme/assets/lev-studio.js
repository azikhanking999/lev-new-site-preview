/* Lev Impressions design studio.
   A self-contained designer drawn in SVG: no outside library, no build step.
   Everything it needs arrives as plain data (product, pricing, clipart), so the
   same file runs in the local prototype and inside the Shopify theme, and a
   product's customisation can be changed by editing that data.

   Units: design positions are stored in hundredths of an inch inside each
   view's print area, so a saved design is the real print size. */
(function () {
  "use strict";

  var P = window.LevPricing;
  var NS = "http://www.w3.org/2000/svg";
  var U = 100; // units per inch

  var FONTS = [
    { n: "Anton", w: 400, c: "Bold" }, { n: "Bebas Neue", w: 400, c: "Bold" }, { n: "Archivo Black", w: 400, c: "Bold" },
    { n: "Oswald", w: 700, c: "Bold" }, { n: "Montserrat", w: 800, c: "Clean" }, { n: "Poppins", w: 700, c: "Clean" },
    { n: "Inter", w: 700, c: "Clean" }, { n: "Barlow Condensed", w: 700, c: "Clean" },
    { n: "Graduate", w: 400, c: "Team" }, { n: "Staatliches", w: 400, c: "Team" }, { n: "Black Ops One", w: 400, c: "Team" },
    { n: "Alfa Slab One", w: 400, c: "Team" }, { n: "Bungee", w: 400, c: "Team" },
    { n: "Playfair Display", w: 700, c: "Classic" }, { n: "Abril Fatface", w: 400, c: "Classic" }, { n: "Bitter", w: 700, c: "Classic" },
    { n: "Pacifico", w: 400, c: "Script" }, { n: "Lobster", w: 400, c: "Script" }, { n: "Dancing Script", w: 700, c: "Script" },
    { n: "Satisfy", w: 400, c: "Script" }, { n: "Permanent Marker", w: 400, c: "Script" }, { n: "Caveat", w: 700, c: "Script" },
    { n: "Fredoka", w: 600, c: "Fun" }, { n: "Luckiest Guy", w: 400, c: "Fun" }, { n: "Righteous", w: 400, c: "Fun" },
    { n: "Creepster", w: 400, c: "Fun" }, { n: "Press Start 2P", w: 400, c: "Fun" },
    { n: "Heebo", w: 800, c: "Hebrew" }, { n: "Rubik", w: 700, c: "Hebrew" }, { n: "Secular One", w: 400, c: "Hebrew" },
    { n: "Suez One", w: 400, c: "Hebrew" }, { n: "Frank Ruhl Libre", w: 700, c: "Hebrew" }, { n: "Karantina", w: 700, c: "Hebrew" }
  ];
  var INKS = ["#000000", "#ffffff", "#4a4a4a", "#9b9b9b", "#c8102e", "#ff5a1f", "#f5a623", "#ffd60a", "#b7e21a", "#2e9e4f", "#12805c", "#19c3b2", "#4a90e2", "#1f4fd8", "#0f2d48", "#5b3df5", "#8e24aa", "#f0379b", "#ff9ecd", "#7b4a26", "#c7a26b", "#f1e9d4"];
  var KEYBOARDS = {
    Hebrew: "א ב ג ד ה ו ז ח ט י כ ך ל מ ם נ ן ס ע פ ף צ ץ ק ר ש ת".split(" "),
    Greek: "Α Β Γ Δ Ε Ζ Η Θ Ι Κ Λ Μ Ν Ξ Ο Π Ρ Σ Τ Υ Φ Χ Ψ Ω".split(" ")
  };
  var ICON = {
    product: '<path d="M8 3 3 6l2 4 2-1v11h10V9l2 1 2-4-5-3a4 4 0 0 1-8 0Z"/>',
    text: '<path d="M5 6V4h14v2M12 4v16M9 20h6"/>',
    upload: '<path d="M12 16V5m0 0-4 4m4-4 4 4M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"/>',
    art: '<path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7Z"/>',
    names: '<path d="M4 18V7l4 6 4-6v11M16 8h4l-3 4a3 3 0 1 1-2 5"/>',
    undo: '<path d="M9 7 4 12l5 5M4 12h10a6 6 0 0 1 0 12h-2" transform="translate(0 -4)"/>',
    redo: '<path d="m15 7 5 5-5 5m5-5H10a6 6 0 0 0 0 12h2" transform="translate(0 -4)"/>',
    zoom: '<circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5M11 8.5v5M8.5 11h5"/>',
    trash: '<path d="M5 7h14M10 7V4h4v3m-7 0 1 13h8l1-13"/>',
    copy: '<rect x="8" y="8" width="11" height="11" rx="2"/><path d="M5 15V6a1 1 0 0 1 1-1h9"/>',
    center: '<path d="M12 3v18M7 8h10v3H7zM9 14h6v3H9z"/>',
    up: '<path d="m6 14 6-6 6 6"/>', down: '<path d="m6 10 6 6 6-6"/>',
    flip: '<path d="M12 3v18M8 7 3 12l5 5V7Zm8 0 5 5-5 5V7Z"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    save: '<path d="M5 4h11l3 3v13H5zM8 4v5h7V4M8 20v-6h8v6"/>',
    phone: '<path d="M6 3h4l1 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 1v4a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    rotate: '<path d="M20 12a8 8 0 1 1-2.5-5.8M20 4v5h-5"/>'
  };

  /* ---------- tiny DOM helpers ---------- */
  function h(tag, props, kids) {
    var e = document.createElement(tag);
    for (var k in props || {}) {
      var v = props[k];
      if (v == null || v === false) continue;
      if (k === "class") e.className = v;
      else if (k === "text") e.textContent = v;
      else if (k === "html") e.innerHTML = v;
      else if (k === "style" && typeof v === "object") for (var sk in v) e.style.setProperty(sk, v[sk]);
      else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), v);
      else if (k === "value") e.value = v;
      else if (k === "checked") e.checked = !!v;
      else e.setAttribute(k, v === true ? "" : v);
    }
    add(e, kids);
    return e;
  }
  function add(e, kids) {
    if (kids == null) return;
    if (!Array.isArray(kids)) kids = [kids];
    kids.forEach(function (c) { if (c == null || c === false) return; e.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c); });
  }
  function s(tag, attrs, kids) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs || {}) if (attrs[k] != null && attrs[k] !== false) e.setAttribute(k, attrs[k]);
    (kids || []).forEach(function (c) { if (c) e.appendChild(c); });
    return e;
  }
  function icon(name, size) {
    return '<svg class="ls-ico" width="' + (size || 22) + '" height="' + (size || 22) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[name] + "</svg>";
  }
  function uid() { return "i" + Math.random().toString(36).slice(2, 9); }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function inches(units) { return (units / U).toFixed(1).replace(/\.0$/, ""); }
  function deepCopy(o) { return JSON.parse(JSON.stringify(o)); }
  function fontOf(name) { for (var i = 0; i < FONTS.length; i++) if (FONTS[i].n === name) return FONTS[i]; return FONTS[0]; }

  function toast(msg) {
    var box = document.querySelector(".toasts") || document.body.appendChild(h("div", { class: "toasts" }));
    var t = box.appendChild(h("div", { class: "toast", text: msg }));
    setTimeout(function () { t.classList.add("is-out"); setTimeout(function () { t.remove(); }, 260); }, 2600);
  }

  /* ====================================================================== */
  function mount(root, opts) {
    var product = opts.product, pricing = opts.pricing, clipart = opts.clipart || { categories: [] };
    var IMG = product.imageSize || [1200, 1800];
    var storeKey = "lev-studio:" + product.sku;
    var designable = product.colours.filter(function (c) { return c.designable; });
    var firstColour = (opts.colour && designable.filter(function (c) { return c.code === opts.colour; })[0]) || designable[0];

    var st = {
      step: "design",
      method: product.methods.indexOf(opts.method) >= 0 ? opts.method : product.methods[0],
      colours: [firstColour.code],
      colour: firstColour.code,
      view: product.views[0].key,
      items: {},
      sel: null,
      panel: window.matchMedia("(max-width: 900px)").matches ? null : "product",
      sizes: {},
      names: { on: false, rows: [{ name: "", number: "", size: "" }] },
      notes: "",
      zoom: false,
      unlocked: false,
      designName: "",
      email: ""
    };
    product.views.forEach(function (v) { st.items[v.key] = []; });
    if (opts.panel && ["product", "text", "upload", "art", "names"].indexOf(opts.panel) >= 0) st.panel = opts.panel;

    var hist = [], histAt = -1;
    var nodes = {};          // id -> svg group on the live stage
    var el = {};             // named chrome elements
    var drag = null, raf = 0, snapX = false, snapY = false;

    /* measuring svg for text lengths */
    var meas = document.body.appendChild(s("svg", { width: 0, height: 0, style: "position:absolute;left:-9999px;top:-9999px;overflow:hidden" }));

    /* fonts */
    (function loadFonts() {
      var q = FONTS.map(function (f) { return "family=" + f.n.replace(/ /g, "+") + (f.w !== 400 ? ":wght@" + f.w : ""); }).join("&");
      document.head.appendChild(h("link", { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?" + q + "&display=swap" }));
    })();
    function ensureFont(name, then) {
      var f = fontOf(name);
      if (document.fonts && document.fonts.load) document.fonts.load(f.w + ' 40px "' + f.n + '"').then(then, then); else then();
    }

    /* ---------- lookups ---------- */
    function viewCfg(key) { key = key || st.view; for (var i = 0; i < product.views.length; i++) if (product.views[i].key === key) return product.views[i]; }
    function colourCfg(code) { code = code || st.colour; for (var i = 0; i < product.colours.length; i++) if (product.colours[i].code === code) return product.colours[i]; }
    function items(key) { return st.items[key || st.view]; }
    function selected() { var l = items(); for (var i = 0; i < l.length; i++) if (l[i].id === st.sel) return l[i]; return null; }
    function geom(v, colourCode) {
      // Sleeves are shown on a model, who stands a little differently in each
      // colour's photo, so those views carry their own box per colour.
      var own = v.byColour && v.byColour[colourCode || st.colour];
      var crop = (own && own.crop) || v.crop || { x: 0, y: 0, w: 100, h: 100 };
      var vb = { x: crop.x * IMG[0] / 100, y: crop.y * IMG[1] / 100, w: crop.w * IMG[0] / 100, h: crop.h * IMG[1] / 100 };
      var a = (own && own.area) || v.area, axPct = a.x;
      if (v.mirror) axPct = 2 * (crop.x + crop.w / 2) - (a.x + a.w);
      var ax = axPct * IMG[0] / 100, ay = a.y * IMG[1] / 100, aw = a.w * IMG[0] / 100, ah = a.h * IMG[1] / 100;
      var W = a.widthIn * U, H = a.heightIn * U;
      return { vb: vb, ax: ax, ay: ay, aw: aw, ah: ah, W: W, H: H, sx: aw / W, sy: ah / H, mirrorX: v.mirror ? 2 * (vb.x + vb.w / 2) : null };
    }
    function inkDefault() { return colourCfg().dark ? "#ffffff" : "#000000"; }

    /* ---------- history ---------- */
    function snapshot() { return JSON.stringify({ items: st.items, method: st.method, names: st.names }); }
    function commit() {
      var snap = snapshot();
      if (hist[histAt] === snap) return;
      hist = hist.slice(0, histAt + 1); hist.push(snap); histAt = hist.length - 1;
      if (hist.length > 80) { hist.shift(); histAt--; }
      persist(); renderChrome();
    }
    function restore(snap) {
      var d = JSON.parse(snap);
      st.items = d.items; st.method = d.method; st.names = d.names; st.sel = null;
      clearNodes(); renderAll(); persist();
    }
    function undo() { if (histAt > 0) restore(hist[--histAt]); }
    function redo() { if (histAt < hist.length - 1) restore(hist[++histAt]); }
    var commitSoonT = 0;
    function commitSoon() { clearTimeout(commitSoonT); commitSoonT = setTimeout(commit, 450); }

    function persist() {
      try {
        localStorage.setItem(storeKey, JSON.stringify({ v: 1, at: Date.now(), items: st.items, method: st.method, colours: st.colours, colour: st.colour, sizes: st.sizes, names: st.names, notes: st.notes, designName: st.designName, email: st.email, unlocked: st.unlocked }));
      } catch (e) { /* storage full (large pictures): the design still lives in this tab */ }
    }
    function loadSaved() {
      try {
        var d = JSON.parse(localStorage.getItem(storeKey) || "null");
        if (!d || !d.items) return false;
        var any = false;
        product.views.forEach(function (v) { if ((d.items[v.key] || []).length) any = true; else d.items[v.key] = d.items[v.key] || []; });
        if (!any) return false;
        st.items = d.items; st.method = product.methods.indexOf(d.method) >= 0 ? d.method : st.method;
        var ok = (d.colours || []).filter(function (c) { var cc = colourCfg(c); return cc && cc.designable; });
        if (ok.length && !opts.colour) { st.colours = ok; st.colour = ok.indexOf(d.colour) >= 0 ? d.colour : ok[0]; }
        st.sizes = d.sizes || {}; st.names = d.names || st.names; st.notes = d.notes || ""; st.designName = d.designName || ""; st.email = d.email || ""; st.unlocked = !!d.unlocked;
        return true;
      } catch (e) { return false; }
    }

    /* ---------- item drawing ---------- */
    function textString(it) {
      if (it.nn === "name") return (st.names.rows[0] && st.names.rows[0].name) || "NAME";
      if (it.nn === "number") return (st.names.rows[0] && st.names.rows[0].number) || "00";
      return it.text || "";
    }
    function buildText(it, suffix) {
      var f = fontOf(it.font);
      var attrs = {
        "font-family": '"' + f.n + '", sans-serif', "font-weight": f.w, "font-size": it.size, fill: it.colour,
        "text-anchor": "middle", "letter-spacing": (it.spacing || 0) * it.size / 100,
        "xml:space": "preserve"
      };
      if (it.outline && it.outlineW > 0) { attrs.stroke = it.outline; attrs["stroke-width"] = it.outlineW * it.size / 100; attrs["stroke-linejoin"] = "round"; attrs["paint-order"] = "stroke"; }
      var str = textString(it), lines = str.split("\n");
      var t = s("text", attrs);
      if (it.arc && Math.abs(it.arc) > 1) {
        var one = lines.join(" ");
        var probe = s("text", attrs); probe.textContent = one; meas.appendChild(probe);
        var L = Math.max(10, probe.getComputedTextLength()); meas.removeChild(probe);
        var theta = Math.abs(it.arc) / 100 * (300 * Math.PI / 180);
        var r = L / theta, half = theta / 2, sx = r * Math.sin(half), dy = r - r * Math.cos(half), large = theta > Math.PI ? 1 : 0;
        var d = it.arc > 0
          ? "M" + (-sx) + " " + dy + " A" + r + " " + r + " 0 " + large + " 1 " + sx + " " + dy
          : "M" + (-sx) + " " + (-dy) + " A" + r + " " + r + " 0 " + large + " 0 " + sx + " " + (-dy);
        var id = "arc-" + it.id + (suffix || "");
        var tp = s("textPath", { href: "#" + id, startOffset: "50%" }); tp.textContent = one;
        t.appendChild(tp);
        return s("g", {}, [s("path", { id: id, d: d, fill: "none" }), t]);
      }
      var lh = it.size * 1.08, y0 = -((lines.length - 1) * lh) / 2 + it.size * 0.35;
      lines.forEach(function (ln, i) { var ts = s("tspan", { x: 0, y: y0 + i * lh }); ts.textContent = ln || " "; t.appendChild(ts); });
      return t;
    }
    function buildInner(it, suffix) {
      if (it.type === "text") return buildText(it, suffix);
      if (it.type === "image") return s("image", { href: it.src, x: -it.w / 2, y: -it.h / 2, width: it.w, height: it.h, preserveAspectRatio: "none" });
      var k = it.w / (clipart.viewBox || 256);
      return s("g", { transform: "translate(" + (-it.w / 2) + " " + (-it.h / 2) + ") scale(" + k + ")" }, [s("path", { d: it.d, fill: it.colour }), s("rect", { width: 256, height: 256, fill: "transparent" })]);
    }
    function itemTransform(it) { return "translate(" + it.x + " " + it.y + ") rotate(" + (it.rot || 0) + ") scale(" + (it.flipX ? -1 : 1) + " " + (it.flipY ? -1 : 1) + ")"; }
    function measure(it, node) {
      var inner = node.firstChild, bb = null;
      if (it.type === "text") { try { bb = inner.getBBox(); } catch (e) { bb = null; } }
      if (!bb || (!bb.width && !bb.height)) bb = { x: -(it.w || 100) / 2, y: -(it.h || 100) / 2, width: it.w || 100, height: it.h || 100 };
      it.bb = { x: it.flipX ? -(bb.x + bb.width) : bb.x, y: it.flipY ? -(bb.y + bb.height) : bb.y, w: bb.width, h: bb.height };
    }
    function corners(it) {
      var b = it.type === "text" ? (it.bb || { x: -50, y: -50, w: 100, h: 100 }) : { x: -it.w / 2, y: -it.h / 2, w: it.w, h: it.h };
      var a = (it.rot || 0) * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a);
      return [[b.x, b.y], [b.x + b.w, b.y], [b.x + b.w, b.y + b.h], [b.x, b.y + b.h]].map(function (p) { return [it.x + p[0] * c - p[1] * sn, it.y + p[0] * sn + p[1] * c]; });
    }
    function viewBounds(key) {
      var list = items(key); if (!list.length) return null;
      var g = geom(viewCfg(key)), x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, out = false;
      list.forEach(function (it) { corners(it).forEach(function (p) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); }); });
      if (x0 < -1 || y0 < -1 || x1 > g.W + 1 || y1 > g.H + 1) out = true;
      x0 = clamp(x0, 0, g.W); x1 = clamp(x1, 0, g.W); y0 = clamp(y0, 0, g.H); y1 = clamp(y1, 0, g.H);
      return { w: Math.max(0, x1 - x0), h: Math.max(0, y1 - y0), out: out };
    }
    function locationInfo(key) {
      var b = viewBounds(key); if (!b) return null;
      var v = viewCfg(key), tiers = pricing.methods[st.method].tiers;
      var t = P.tierForSize(pricing, st.method, b.w / U, b.h / U, v.maxTier) || tiers[tiers.length - 1];
      return { key: key, label: v.label, tier: t.key, tierLabel: t.label, size: t.size, wIn: b.w / U, hIn: b.h / U, out: b.out };
    }
    function locations() { return product.views.map(function (v) { return locationInfo(v.key); }).filter(Boolean); }

    /* ---------- stage ---------- */
    function clearNodes() { for (var k in nodes) { nodes[k].remove(); } nodes = {}; }
    function buildStage() {
      el.svg = s("svg", { class: "ls-svg", xmlns: NS });
      el.defs = el.svg.appendChild(s("defs"));
      el.clipRect = s("rect", { x: 0, y: 0 });
      el.defs.appendChild(s("clipPath", { id: "ls-clip" }, [el.clipRect]));
      /* the item sits on a white board with round corners, so the studio's pattern shows around it */
      el.boardRect = s("rect", {});
      el.defs.appendChild(s("clipPath", { id: "ls-board" }, [el.boardRect]));
      el.boardBg = el.svg.appendChild(s("rect", { class: "ls-board" }));
      el.board = el.svg.appendChild(s("g", { "clip-path": "url(#ls-board)" }));
      el.garment = el.board.appendChild(s("image", { class: "ls-garment", preserveAspectRatio: "xMidYMid slice" }));
      el.area = el.svg.appendChild(s("g", { class: "ls-area" }));
      el.areaBox = el.area.appendChild(s("rect", { class: "ls-area-box", x: 0, y: 0, rx: 8 }));
      el.guideV = el.area.appendChild(s("line", { class: "ls-guide" }));
      el.guideH = el.area.appendChild(s("line", { class: "ls-guide" }));
      el.layer = el.area.appendChild(s("g", { "clip-path": "url(#ls-clip)" }));
      el.over = el.svg.appendChild(s("g", { class: "ls-over" }));
      el.svg.addEventListener("pointerdown", onDown);
      el.svg.addEventListener("dblclick", function (e) { if (e.target.closest(".ls-it") && selected() && selected().type === "text" && !selected().nn) { openPanel("text"); var ta = root.querySelector(".ls-textarea"); if (ta) { ta.focus(); ta.select(); } } });
      return el.svg;
    }
    function renderStage() {
      var v = viewCfg(), g = geom(v), col = colourCfg();
      var vb = g.vb;
      if (st.zoom) { var pad = 0.16; vb = { x: g.ax - g.aw * pad, y: g.ay - g.ah * pad, w: g.aw * (1 + 2 * pad), h: g.ah * (1 + 2 * pad) }; }
      el.svg.setAttribute("viewBox", vb.x + " " + vb.y + " " + vb.w + " " + vb.h);
      [el.boardRect, el.boardBg].forEach(function (r) { r.setAttribute("x", vb.x); r.setAttribute("y", vb.y); r.setAttribute("width", vb.w); r.setAttribute("height", vb.h); r.setAttribute("rx", vb.w * 0.028); });
      var src = product.base + col.images[v.image];
      if (el.garment.getAttribute("href") !== src) { el.garment.setAttribute("href", src); el.svg.classList.remove("is-swapped"); void el.svg.getBoundingClientRect(); el.svg.classList.add("is-swapped"); }
      el.garment.setAttribute("width", IMG[0]); el.garment.setAttribute("height", IMG[1]);
      if (g.mirrorX != null) el.garment.setAttribute("transform", "translate(" + g.mirrorX + " 0) scale(-1 1)"); else el.garment.removeAttribute("transform");
      var tf = "translate(" + g.ax + " " + g.ay + ") scale(" + g.sx + " " + g.sy + ")";
      el.area.setAttribute("transform", tf); el.over.setAttribute("transform", tf);
      el.areaBox.setAttribute("width", g.W); el.areaBox.setAttribute("height", g.H);
      el.clipRect.setAttribute("width", g.W); el.clipRect.setAttribute("height", g.H);
      el.areaBox.classList.toggle("is-dark", !!col.dark);
      el.guideV.setAttribute("x1", g.W / 2); el.guideV.setAttribute("x2", g.W / 2); el.guideV.setAttribute("y1", 0); el.guideV.setAttribute("y2", g.H);
      el.guideH.setAttribute("x1", 0); el.guideH.setAttribute("x2", g.W); el.guideH.setAttribute("y1", g.H / 2); el.guideH.setAttribute("y2", g.H / 2);
      el.guideV.style.opacity = snapX ? 1 : 0; el.guideH.style.opacity = snapY ? 1 : 0;

      var list = items(), keep = {};
      list.forEach(function (it, i) {
        keep[it.id] = 1;
        var node = nodes[it.id];
        var sig = it.type === "text" ? [textString(it), it.font, it.size, it.colour, it.outline, it.outlineW, it.arc, it.spacing].join("|") : it.type === "image" ? it.w + "|" + it.h + "|" + it.src.length : it.w + "|" + it.colour;
        if (!node) { node = nodes[it.id] = s("g", { class: "ls-it", "data-id": it.id }); node._sig = null; }
        if (node._sig !== sig) { while (node.firstChild) node.removeChild(node.firstChild); node.appendChild(buildInner(it)); node._sig = sig; }
        node.setAttribute("transform", itemTransform(it));
        if (el.layer.children[i] !== node) el.layer.insertBefore(node, el.layer.children[i] || null);
        measure(it, node);
      });
      for (var id in nodes) if (!keep[id]) { nodes[id].remove(); delete nodes[id]; }
      renderOverlay();
      renderStatus();
    }
    function pxPerUnit() { var r = el.svg.getBoundingClientRect(), vb = el.svg.viewBox.baseVal, g = geom(viewCfg()); return (r.width / (vb.width || 1)) * g.sx || 0.3; }
    function renderOverlay() {
      while (el.over.firstChild) el.over.removeChild(el.over.firstChild);
      var it = selected(); if (!it || !it.bb || st.step !== "design") return;
      var k = 1 / pxPerUnit(), b = it.bb, pad = 6 * k;
      var x = b.x - pad, y = b.y - pad, w = b.w + 2 * pad, hh = b.h + 2 * pad;
      var g = s("g", { transform: "translate(" + it.x + " " + it.y + ") rotate(" + (it.rot || 0) + ")" });
      g.appendChild(s("rect", { class: "ls-sel", x: x, y: y, width: w, height: hh, "stroke-width": 1.5 * k, "stroke-dasharray": 5 * k + " " + 4 * k }));
      if (!it.locked) {
        [[x, y], [x + w, y], [x + w, y + hh], [x, y + hh]].forEach(function (p, i) {
          g.appendChild(s("circle", { class: "ls-handle", "data-handle": "scale", cx: p[0], cy: p[1], r: 7 * k, "stroke-width": 2 * k, style: "cursor:" + (i % 2 ? "nesw-resize" : "nwse-resize") }));
        });
        var ry = y - 28 * k;
        g.appendChild(s("line", { class: "ls-sel", x1: x + w / 2, y1: y, x2: x + w / 2, y2: ry, "stroke-width": 1.5 * k }));
        g.appendChild(s("circle", { class: "ls-handle ls-handle--rot", "data-handle": "rotate", cx: x + w / 2, cy: ry, r: 8 * k, "stroke-width": 2 * k }));
      }
      el.over.appendChild(g);
    }
    function schedule() { if (raf) return; raf = requestAnimationFrame(function () { raf = 0; renderStage(); syncPanelValues(); }); }

    /* ---------- pointer interaction ---------- */
    function localPoint(e) {
      var pt = el.svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
      return pt.matrixTransform(el.area.getScreenCTM().inverse());
    }
    function onDown(e) {
      if (st.step !== "design") return;
      var handle = e.target.closest("[data-handle]"), itNode = e.target.closest(".ls-it"), p = localPoint(e), it;
      if (handle && (it = selected())) {
        drag = { mode: handle.getAttribute("data-handle"), it: it, p0: p, start: deepCopy(it), d0: Math.hypot(p.x - it.x, p.y - it.y) || 1, a0: Math.atan2(p.y - it.y, p.x - it.x) };
      } else if (itNode) {
        var id = itNode.getAttribute("data-id");
        if (st.sel !== id) { st.sel = id; it = selected(); openPanel(it.nn ? "names" : it.type === "text" ? "text" : it.type === "image" ? "upload" : "art", true); }
        it = selected();
        if (!it.locked) drag = { mode: "move", it: it, p0: p, start: deepCopy(it) };
        renderOverlay();
      } else {
        if (st.sel) { st.sel = null; renderOverlay(); renderPanel(); }
        return;
      }
      e.preventDefault();
      el.svg.setPointerCapture(e.pointerId);
      el.svg.addEventListener("pointermove", onMove);
      el.svg.addEventListener("pointerup", onUp);
      el.svg.addEventListener("pointercancel", onUp);
    }
    function onMove(e) {
      if (!drag) return;
      var p = localPoint(e), it = drag.it, s0 = drag.start, g = geom(viewCfg());
      if (drag.mode === "move") {
        it.x = s0.x + (p.x - drag.p0.x); it.y = s0.y + (p.y - drag.p0.y);
        var tol = 6 / pxPerUnit();
        var cx = it.x + (it.bb ? it.bb.x + it.bb.w / 2 : 0), cy = it.y + (it.bb ? it.bb.y + it.bb.h / 2 : 0);
        snapX = Math.abs(cx - g.W / 2) < tol && !(it.rot % 180); if (snapX) it.x += g.W / 2 - cx;
        snapY = Math.abs(cy - g.H / 2) < tol && !(it.rot % 180); if (snapY) it.y += g.H / 2 - cy;
        if (it.rot % 180) { snapX = Math.abs(it.x - g.W / 2) < tol; if (snapX) it.x = g.W / 2; snapY = false; }
      } else if (drag.mode === "scale") {
        var f = clamp(Math.hypot(p.x - it.x, p.y - it.y) / drag.d0, 0.05, 20);
        if (it.type === "text") it.size = clamp(s0.size * f, 12, 2400);
        else { var nw = clamp(s0.w * f, 20, 4000); it.h = s0.h * nw / s0.w; it.w = nw; }
      } else if (drag.mode === "rotate") {
        var a = s0.rot + (Math.atan2(p.y - it.y, p.x - it.x) - drag.a0) * 180 / Math.PI;
        a = ((a + 180) % 360 + 360) % 360 - 180;
        var near = Math.round(a / 45) * 45; if (Math.abs(a - near) < 4) a = near;
        it.rot = Math.round(a);
      }
      schedule();
    }
    function onUp(e) {
      el.svg.removeEventListener("pointermove", onMove); el.svg.removeEventListener("pointerup", onUp); el.svg.removeEventListener("pointercancel", onUp);
      try { el.svg.releasePointerCapture(e.pointerId); } catch (x) { /* already released */ }
      drag = null; snapX = snapY = false; renderStage(); commit();
    }
    function onKey(e) {
      if (st.step !== "design") return;
      var tag = (e.target.tagName || "").toLowerCase(), typing = tag === "input" || tag === "textarea" || tag === "select";
      var mod = e.ctrlKey || e.metaKey, key = e.key.toLowerCase();
      if (mod && key === "z" && !typing) { e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
      if (mod && key === "y" && !typing) { e.preventDefault(); redo(); return; }
      var it = selected(); if (!it || typing) return;
      if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); removeSel(); }
      else if (mod && key === "d") { e.preventDefault(); duplicateSel(); }
      else if (e.key.indexOf("Arrow") === 0 && !it.locked) {
        e.preventDefault(); var step = e.shiftKey ? 25 : 5;
        if (e.key === "ArrowLeft") it.x -= step; if (e.key === "ArrowRight") it.x += step; if (e.key === "ArrowUp") it.y -= step; if (e.key === "ArrowDown") it.y += step;
        renderStage(); commitSoon();
      } else if (e.key === "Escape") { st.sel = null; renderOverlay(); renderPanel(); }
    }

    /* ---------- item actions ---------- */
    function addItem(it) {
      var g = geom(viewCfg());
      it.id = uid(); it.rot = it.rot || 0;
      if (it.x == null) it.x = g.W / 2;
      if (it.y == null) it.y = viewCfg().maxTier ? g.H / 2 : g.H * 0.3;
      items().push(it); st.sel = it.id;
      renderStage(); commit();
      var n = nodes[it.id]; if (n) { n.classList.add("is-new"); setTimeout(function () { n.classList.remove("is-new"); }, 400); }
      return it;
    }
    function addText(str, extra) {
      var g = geom(viewCfg());
      var it = { type: "text", text: str || "Your text", font: "Anton", size: Math.round(Math.min(g.W, g.H) * 0.13), colour: inkDefault(), outline: "", outlineW: 0, arc: 0, spacing: 0 };
      for (var k in extra || {}) it[k] = extra[k];
      ensureFont(it.font, function () { renderStage(); });
      return addItem(it);
    }
    function removeSel() {
      var it = selected(); if (!it) return;
      st.items[st.view] = items().filter(function (x) { return x.id !== it.id; });
      st.sel = null; renderStage(); renderPanel(); commit();
    }
    function duplicateSel() {
      var it = selected(); if (!it || it.nn) return;
      var c = deepCopy(it); c.id = uid(); c.x += 40; c.y += 40; items().push(c); st.sel = c.id; renderStage(); renderPanel(); commit();
    }
    function layer(dir) {
      var it = selected(), l = items(), i = l.indexOf(it), j = i + dir; if (!it || j < 0 || j >= l.length) return;
      l.splice(i, 1); l.splice(j, 0, it); renderStage(); commit();
    }
    function centerSel() {
      var it = selected(); if (!it) return; var g = geom(viewCfg());
      it.x = g.W / 2 - (it.rot % 180 ? 0 : (it.bb ? it.bb.x + it.bb.w / 2 : 0)); renderStage(); commit();
    }
    function setProp(key, val, live) {
      var it = selected(); if (!it) return;
      it[key] = val; if (key === "font") ensureFont(val, function () { renderStage(); });
      renderStage(); live ? commitSoon() : commit();
    }

    /* ---------- panels ---------- */
    function openPanel(name, keepSel) {
      if (!keepSel && st.sel) {
        var it = selected();
        var fits = it && ((name === "text" && it.type === "text" && !it.nn) || (name === "upload" && it.type === "image") || (name === "art" && it.type === "art") || (name === "names" && it.nn));
        if (!fits) st.sel = null;
      }
      st.panel = name; renderPanel(); renderRail(); renderOverlay();
    }
    function panelHead(eyebrow, title) {
      return h("div", { class: "ls-panel__head" }, [h("div", {}, [h("div", { class: "t-eyebrow", text: eyebrow }), h("h2", { class: "t-h3", text: title })]), h("button", { class: "ls-iconbtn", "aria-label": "Close panel", html: icon("close", 20), onclick: function () { st.panel = null; renderPanel(); renderRail(); } })]);
    }
    function colourRow(current, onPick, withNone) {
      var row = h("div", { class: "ls-inks" });
      if (withNone) row.appendChild(h("button", { class: "ls-ink ls-ink--none" + (!current ? " is-on" : ""), title: "None", onclick: function () { onPick(""); } }));
      INKS.forEach(function (c) { row.appendChild(h("button", { class: "ls-ink" + (current && current.toLowerCase() === c ? " is-on" : ""), style: { "--c": c }, title: c, onclick: function () { onPick(c); } })); });
      var custom = h("label", { class: "ls-ink ls-ink--custom", title: "Any colour" }, [h("input", { type: "color", value: /^#[0-9a-f]{6}$/i.test(current || "") ? current : "#ff5a1f", oninput: function (e) { onPick(e.target.value, true); } })]);
      row.appendChild(custom);
      return row;
    }
    function slider(label, key, min, max, step, fmt) {
      var it = selected(), val = it[key] || 0;
      var out = h("output", { class: "t-num", text: fmt(val) });
      var input = h("input", { type: "range", class: "range", "data-key": key, min: min, max: max, step: step, value: val, oninput: function (e) { var v = parseFloat(e.target.value); out.textContent = fmt(v); fill(e.target); setProp(key, v, true); } });
      fill(input);
      return h("label", { class: "ls-slider" }, [h("span", { text: label }), input, out]);
    }
    function fill(input) { var mn = +input.min, mx = +input.max; input.style.setProperty("--fill", ((input.value - mn) / (mx - mn)) * 100 + "%"); }
    function syncPanelValues() {
      var it = selected(); if (!it || !el.panel) return;
      el.panel.querySelectorAll("input[type=range][data-key]").forEach(function (inp) {
        if (document.activeElement === inp) return;
        var key = inp.getAttribute("data-key"); inp.value = it[key] || 0; fill(inp);
        var out = inp.parentNode.querySelector("output"); if (out) out.textContent = key === "size" ? inches(it.size) + " in" : key === "rot" ? Math.round(it.rot) + "°" : Math.round(it[key] || 0);
      });
    }
    function actionBar(it) {
      function b(name, label, fn, on) { return h("button", { class: "ls-act" + (on ? " is-on" : ""), title: label, onclick: fn, html: icon(name, 18) + "<span>" + label + "</span>" }); }
      return h("div", { class: "ls-acts" }, [
        b("center", "Center", centerSel),
        b("up", "Forward", function () { layer(1); }),
        b("down", "Back", function () { layer(-1); }),
        b("flip", "Flip", function () { setProp("flipX", !it.flipX); }),
        it.nn ? null : b("copy", "Copy", duplicateSel),
        b("trash", "Delete", removeSel)
      ]);
    }

    function panelProduct() {
      var box = h("div", { class: "ls-panel__body" });
      var col = colourCfg();
      box.appendChild(h("div", { class: "ls-prod" }, [
        h("img", { src: product.base + (col.images.flat_front || col.images[product.views[0].image]), alt: "", width: 72, height: 108 }),
        h("div", {}, [h("div", { class: "t-micro t-muted", text: product.brand + " · " + product.sku }), h("div", { class: "ls-prod__title", text: product.title }), h("a", { class: "ls-link", href: opts.productUrl || "#", text: "Change product" })])
      ]));
      box.appendChild(h("div", { class: "ls-label", text: "Colour: " + col.name }));
      var grid = h("div", { class: "ls-swatches" });
      designable.forEach(function (c) {
        grid.appendChild(h("button", { class: "swatch" + (c.code === st.colour ? " is-on" : "") + (c.dark ? "" : " is-light"), style: { "--c": c.hex }, title: c.name, "aria-label": c.name, onclick: function () {
          var i = st.colours.indexOf(st.colour); if (st.colours.indexOf(c.code) < 0) st.colours[i] = c.code; st.colour = c.code;
          retintForGarment(); renderAll(); persist();
        } }));
      });
      box.appendChild(grid);
      if (st.colours.length > 1) {
        box.appendChild(h("div", { class: "ls-label", text: "In this order" }));
        var chips = h("div", { class: "ls-chips" });
        st.colours.forEach(function (code) {
          var c = colourCfg(code);
          chips.appendChild(h("span", { class: "chip" + (code === st.colour ? " is-on" : "") }, [
            h("button", { class: "ls-chipbtn", onclick: function () { st.colour = code; renderAll(); } }, [h("i", { class: "ls-dot", style: { "--c": c.hex } }), c.name]),
            h("button", { class: "ls-chipx", "aria-label": "Remove " + c.name, html: icon("close", 14), onclick: function () { st.colours = st.colours.filter(function (x) { return x !== code; }); delete st.sizes[code]; if (st.colour === code) st.colour = st.colours[0]; renderAll(); persist(); } })
          ]));
        });
        box.appendChild(chips);
      }
      box.appendChild(h("button", { class: "btn btn--ghost btn--sm btn--block", html: icon("plus", 16) + "Add another colour", onclick: function () {
        var next = designable.filter(function (c) { return st.colours.indexOf(c.code) < 0; })[0]; if (!next) return;
        st.colours.push(next.code); st.colour = next.code; renderAll(); persist(); toast("Pick the second colour above. The same design goes on both.");
      } }));

      box.appendChild(h("div", { class: "ls-label", text: "How we decorate it" }));
      var methods = h("div", { class: "ls-methods" });
      Object.keys(pricing.methods).forEach(function (key) {
        var m = pricing.methods[key], ok = product.methods.indexOf(key) >= 0;
        methods.appendChild(h("button", { class: "ls-method" + (st.method === key ? " is-on" : "") + (ok ? "" : " is-off"), disabled: !ok, onclick: function () { st.method = key; renderAll(); commit(); } }, [
          h("strong", { text: m.label }), h("span", { text: ok ? m.blurb : "Not offered on this item." })
        ]));
      });
      box.appendChild(methods);
      box.appendChild(h("p", { class: "t-micro t-muted", text: "Minimum " + product.min + " pieces. Need screen printing for a large run? Call (305) 705-5486." }));
      return [panelHead("Product", "Your item"), box];
    }

    function panelText() {
      var it = selected(); if (it && (it.type !== "text" || it.nn)) it = null;
      var box = h("div", { class: "ls-panel__body" });
      var ta = h("textarea", { class: "textarea ls-textarea", placeholder: "Type your text…", dir: "auto", value: it ? it.text : "", oninput: function (e) {
        var v = e.target.value;
        if (!selected() || selected().type !== "text" || selected().nn) { if (!v.trim()) return; addText(v); renderPanel(); var again = root.querySelector(".ls-textarea"); if (again) { again.focus(); again.setSelectionRange(v.length, v.length); } return; }
        selected().text = v; renderStage(); commitSoon();
      } });
      box.appendChild(ta);
      var kb = h("div", { class: "ls-kb" });
      var kbTabs = h("div", { class: "ls-kb__tabs" }, [h("span", { class: "t-micro t-muted", text: "On-screen keys:" })]);
      var keys = h("div", { class: "ls-kb__keys", hidden: true });
      Object.keys(KEYBOARDS).forEach(function (lang) {
        kbTabs.appendChild(h("button", { class: "chip", text: lang, onclick: function (e) {
          var open = keys.getAttribute("data-lang") === lang && !keys.hidden;
          kbTabs.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("is-on"); });
          keys.hidden = open; if (open) return;
          e.currentTarget.classList.add("is-on"); keys.setAttribute("data-lang", lang); keys.innerHTML = "";
          KEYBOARDS[lang].concat(["␣", "⌫"]).forEach(function (ch) {
            keys.appendChild(h("button", { text: ch, onclick: function () {
              var a = ta.selectionStart, b = ta.selectionEnd, v = ta.value;
              if (ch === "⌫") { if (a === b && a > 0) a--; ta.value = v.slice(0, a) + v.slice(b); ta.setSelectionRange(a, a); }
              else { var c = ch === "␣" ? " " : ch; ta.value = v.slice(0, a) + c + v.slice(b); ta.setSelectionRange(a + c.length, a + c.length); }
              ta.dispatchEvent(new Event("input")); ta.focus();
            } }));
          });
        } }));
      });
      kb.appendChild(kbTabs); kb.appendChild(keys); box.appendChild(kb);
      if (!it) { box.appendChild(h("p", { class: "t-small t-muted", text: "Start typing and your text appears on the shirt. Drag it to move, pull a corner to resize." })); return [panelHead("Text", "Add text"), box]; }

      box.appendChild(actionBar(it));
      box.appendChild(h("div", { class: "ls-label", text: "Font" }));
      var cats = [], seen = {}; FONTS.forEach(function (f) { if (!seen[f.c]) { seen[f.c] = 1; cats.push(f.c); } });
      var cur = fontOf(it.font), activeCat = cur.c;
      var catRow = h("div", { class: "ls-chips ls-chips--scroll" }), fontList = h("div", { class: "ls-fonts" });
      function drawFonts() {
        catRow.innerHTML = ""; fontList.innerHTML = "";
        cats.forEach(function (c) { catRow.appendChild(h("button", { class: "chip" + (c === activeCat ? " is-on" : ""), text: c, onclick: function () { activeCat = c; drawFonts(); } })); });
        FONTS.filter(function (f) { return f.c === activeCat; }).forEach(function (f) {
          fontList.appendChild(h("button", { class: "ls-font" + (f.n === it.font ? " is-on" : ""), style: { "font-family": '"' + f.n + '"', "font-weight": f.w }, text: activeCat === "Hebrew" ? "שלום " + f.n : f.n, onclick: function () { setProp("font", f.n); drawFonts(); } }));
        });
      }
      drawFonts(); box.appendChild(catRow); box.appendChild(fontList);
      box.appendChild(h("div", { class: "ls-label", text: "Colour" }));
      box.appendChild(colourRow(it.colour, function (c, live) { setProp("colour", c, live); if (!live) renderPanel(); }));
      box.appendChild(h("div", { class: "ls-label", text: "Outline" }));
      box.appendChild(colourRow(it.outline, function (c, live) { var s0 = selected(); s0.outline = c; if (c && !s0.outlineW) s0.outlineW = 6; if (!c) s0.outlineW = 0; renderStage(); live ? commitSoon() : (commit(), renderPanel()); }, true));
      if (it.outline) box.appendChild(slider("Outline width", "outlineW", 1, 20, 1, function (v) { return Math.round(v); }));
      box.appendChild(slider("Size", "size", 12, Math.round(geom(viewCfg()).H * 0.8), 1, function (v) { return inches(v) + " in"; }));
      box.appendChild(slider("Arc", "arc", -100, 100, 1, function (v) { return Math.round(v); }));
      box.appendChild(slider("Rotate", "rot", -180, 180, 1, function (v) { return Math.round(v) + "°"; }));
      box.appendChild(slider("Spacing", "spacing", -10, 60, 1, function (v) { return Math.round(v); }));
      box.appendChild(h("button", { class: "btn btn--ghost btn--sm btn--block", html: icon("plus", 16) + "Add another text", onclick: function () { st.sel = null; addText("New text", { y: geom(viewCfg()).H * 0.5 }); renderPanel(); } }));
      return [panelHead("Text", "Edit your text"), box];
    }

    /* ---------- print-ready files (optional): AI, PDF, SVG or TIFF kept with the order, not drawn on the item ---------- */
    var printFiles = [], PRINT_EXT = /\.(ai|pdf|svg|tiff?)$/i, PRINT_MAX = 50 * 1024 * 1024, PRINT_COUNT = 5;
    function fileSize(n) { return n < 1024 * 1024 ? Math.max(1, Math.round(n / 1024)) + " KB" : (n / 1024 / 1024).toFixed(1) + " MB"; }
    function addPrintFile(file) {
      if (!PRINT_EXT.test(file.name)) { toast("Print files can be AI, PDF, SVG or TIFF."); return false; }
      if (file.size > PRINT_MAX) { toast("That file is over 50 MB. Email it to us instead and we will match it to your order."); return false; }
      if (printFiles.length >= PRINT_COUNT) { toast("You can add up to " + PRINT_COUNT + " files."); return false; }
      if (printFiles.some(function (f) { return f.name === file.name && f.size === file.size; })) { toast("That file is already added."); return false; }
      printFiles.push(file); toast("Added " + file.name + ". Our art team will use it for printing."); return true;
    }
    function printFilesBox(redraw) {
      var wrap = h("div", { class: "ls-pf" });
      var input = h("input", { type: "file", accept: ".ai,.pdf,.svg,.tif,.tiff,application/pdf,application/postscript,image/svg+xml,image/tiff", multiple: true, hidden: true, onchange: function (e) { Array.prototype.forEach.call(e.target.files, addPrintFile); e.target.value = ""; redraw(); } });
      wrap.appendChild(h("div", { class: "ls-pf__head" }, [h("strong", { text: "Original design file" }), h("span", { class: "tag", text: "Optional" })]));
      wrap.appendChild(h("p", { class: "t-small t-muted", text: "For the best print, share your original file if you have one: AI, PDF, SVG or TIFF. No file? No problem, we can work from what you add in the studio." }));
      if (printFiles.length) {
        var list = h("ul", { class: "ls-pf__list" });
        printFiles.forEach(function (f, i) {
          list.appendChild(h("li", { class: "ls-pf__file" }, [
            h("span", { class: "ls-pf__ext", text: (f.name.split(".").pop() || "").toUpperCase().slice(0, 4) }),
            h("span", { class: "ls-pf__name" }, [h("strong", { text: f.name }), h("span", { class: "t-micro t-muted t-num", text: fileSize(f.size) })]),
            h("button", { class: "ls-iconbtn", type: "button", title: "Remove this file", "aria-label": "Remove " + f.name, html: icon("close", 16), onclick: function () { printFiles.splice(i, 1); redraw(); } })
          ]));
        });
        wrap.appendChild(list);
      }
      var btn = h("button", { class: "btn btn--ghost btn--sm btn--block", type: "button", html: icon("upload", 16) + (printFiles.length ? "Add another file" : "Add AI, PDF, SVG or TIFF"), onclick: function () { input.click(); } });
      wrap.addEventListener("dragover", function (e) { e.preventDefault(); wrap.classList.add("is-over"); });
      wrap.addEventListener("dragleave", function () { wrap.classList.remove("is-over"); });
      wrap.addEventListener("drop", function (e) { e.preventDefault(); e.stopPropagation(); wrap.classList.remove("is-over"); Array.prototype.forEach.call(e.dataTransfer.files, addPrintFile); redraw(); });
      wrap.appendChild(btn); wrap.appendChild(input);
      return wrap;
    }

    function readFile(file) {
      if (/\.(ai|pdf|tiff?)$/i.test(file.name)) { if (addPrintFile(file)) renderPanel(); return; }
      if (!/^image\/(png|jpeg|svg\+xml|webp|gif)$/.test(file.type)) { toast("That file type can't be shown here. Use PNG, JPG or SVG, or email us the file."); return; }
      if (file.size > 12 * 1024 * 1024) { toast("That picture is over 12 MB. Try a smaller copy."); return; }
      var fr = new FileReader();
      fr.onload = function () {
        var img = new Image();
        img.onload = function () {
          var g = geom(viewCfg()), nw = img.naturalWidth || 600, nh = img.naturalHeight || 600;
          var w = Math.min(g.W * 0.7, g.H * 0.7 * nw / nh);
          addItem({ type: "image", src: fr.result, name: file.name, natW: nw, natH: nh, w: w, h: w * nh / nw });
          openPanel("upload", true);
        };
        img.src = fr.result;
      };
      fr.readAsDataURL(file);
    }
    function knockOutWhite(it) {
      var img = new Image();
      img.onload = function () {
        var c = document.createElement("canvas"); c.width = img.naturalWidth; c.height = img.naturalHeight;
        var ctx = c.getContext("2d"); ctx.drawImage(img, 0, 0);
        var d = ctx.getImageData(0, 0, c.width, c.height), px = d.data;
        for (var i = 0; i < px.length; i += 4) { var m = Math.min(px[i], px[i + 1], px[i + 2]); if (m > 235) px[i + 3] = 0; else if (m > 205) px[i + 3] = Math.round(px[i + 3] * (235 - m) / 30); }
        ctx.putImageData(d, 0, 0); it.src = c.toDataURL("image/png"); it.cut = true; renderStage(); renderPanel(); commit();
      };
      img.src = it.src;
    }
    function panelUpload() {
      var it = selected(); if (it && it.type !== "image") it = null;
      var box = h("div", { class: "ls-panel__body" });
      var input = h("input", { type: "file", accept: "image/png,image/jpeg,image/svg+xml,image/webp", hidden: true, onchange: function (e) { if (e.target.files[0]) readFile(e.target.files[0]); e.target.value = ""; } });
      var drop = h("button", { class: "ls-drop", onclick: function () { input.click(); } }, [h("span", { html: icon("upload", 28) }), h("strong", { text: "Upload your art" }), h("span", { class: "t-small t-muted", text: "PNG, JPG or SVG. Drop a file here or tap to choose." })]);
      drop.addEventListener("dragover", function (e) { e.preventDefault(); drop.classList.add("is-over"); });
      drop.addEventListener("dragleave", function () { drop.classList.remove("is-over"); });
      drop.addEventListener("drop", function (e) { e.preventDefault(); drop.classList.remove("is-over"); if (e.dataTransfer.files[0]) readFile(e.dataTransfer.files[0]); });
      box.appendChild(drop); box.appendChild(input);
      if (it) {
        var dpi = Math.round(it.natW / (it.w / U));
        box.appendChild(h("div", { class: "ls-filecard" }, [h("img", { src: it.src, alt: "" }), h("div", {}, [h("div", { class: "ls-prod__title", text: it.name || "Your picture" }), h("div", { class: "t-micro t-muted", text: inches(it.w) + " × " + inches(it.h) + " in on the shirt" }), /svg/.test(it.src.slice(0, 30)) ? h("span", { class: "tag tag--good", text: "Vector: prints sharp at any size" }) : dpi < 120 ? h("span", { class: "tag tag--warn", text: "May print blurry at this size" }) : h("span", { class: "tag tag--good", text: "Sharp at this size" })])]));
        box.appendChild(actionBar(it));
        box.appendChild(slider("Rotate", "rot", -180, 180, 1, function (v) { return Math.round(v) + "°"; }));
        if (!it.cut && !/svg/.test(it.src.slice(0, 30))) box.appendChild(h("button", { class: "btn btn--ghost btn--sm btn--block", text: "Remove white background", onclick: function () { knockOutWhite(it); } }));
      }
      box.appendChild(printFilesBox(renderPanel));
      return [panelHead("Upload", it ? "Your picture" : "Add your art"), box];
    }

    function panelArt() {
      var it = selected(); if (it && it.type !== "art") it = null;
      var box = h("div", { class: "ls-panel__body" });
      if (it) {
        box.appendChild(actionBar(it));
        box.appendChild(h("div", { class: "ls-label", text: "Colour" }));
        box.appendChild(colourRow(it.colour, function (c, live) { setProp("colour", c, live); if (!live) renderPanel(); }));
        box.appendChild(slider("Rotate", "rot", -180, 180, 1, function (v) { return Math.round(v) + "°"; }));
        box.appendChild(h("hr", { class: "hairline" }));
      }
      var cat = panelArt.cat || (clipart.categories[0] || {}).category, q = panelArt.q || "";
      var search = h("input", { class: "input", type: "search", placeholder: "Search 200+ shapes and icons", value: q, oninput: function (e) { panelArt.q = e.target.value; draw(); } });
      var catRow = h("div", { class: "ls-chips ls-chips--scroll" }), grid = h("div", { class: "ls-artgrid" });
      function draw() {
        var query = (panelArt.q || "").trim().toLowerCase();
        catRow.innerHTML = ""; grid.innerHTML = "";
        clipart.categories.forEach(function (c) { catRow.appendChild(h("button", { class: "chip" + (!query && c.category === cat ? " is-on" : ""), text: c.category, onclick: function () { cat = panelArt.cat = c.category; panelArt.q = ""; search.value = ""; draw(); } })); });
        var list = [];
        clipart.categories.forEach(function (c) { c.items.forEach(function (a) { if (query ? a.name.indexOf(query) >= 0 : c.category === cat) list.push(a); }); });
        if (!list.length) grid.appendChild(h("p", { class: "t-small t-muted", text: "Nothing matches. Try another word, or upload your own art." }));
        list.slice(0, 120).forEach(function (a) {
          grid.appendChild(h("button", { class: "ls-artbtn", title: a.name, "aria-label": a.name, html: '<svg viewBox="0 0 256 256" width="36" height="36"><path d="' + a.d + '" fill="currentColor"/></svg>', onclick: function () {
            var g = geom(viewCfg()), w = Math.min(g.W, g.H) * 0.45;
            st.sel = null; addItem({ type: "art", d: a.d, name: a.name, colour: inkDefault() === "#ffffff" ? "#ffffff" : "#000000", w: w, h: w }); renderPanel();
          } }));
        });
      }
      draw(); box.appendChild(search); box.appendChild(catRow); box.appendChild(grid);
      return [panelHead("Art", it ? "Edit your art" : "Add art"), box];
    }

    function nnItems() { var out = { name: null, number: null }; product.views.forEach(function (v) { items(v.key).forEach(function (it) { if (it.nn) { out[it.nn] = it; out[it.nn + "View"] = v.key; } }); }); return out; }
    function setNN(part, on) {
      var cur = nnItems();
      if (on && !cur[part]) {
        var key = product.views.filter(function (v) { return v.key === "back"; })[0] ? "back" : product.views[0].key;
        st.view = key; var g = geom(viewCfg(key));
        addItem(part === "name"
          ? { type: "text", nn: "name", font: "Graduate", size: Math.round(Math.min(200, g.H * 0.14)), colour: inkDefault(), arc: 0, spacing: 4, outline: "", outlineW: 0, y: g.H * 0.12 }
          : { type: "text", nn: "number", font: "Graduate", size: Math.round(Math.min(800, g.H * 0.44)), colour: inkDefault(), arc: 0, spacing: 0, outline: "", outlineW: 0, y: g.H * 0.44 });
        ensureFont("Graduate", function () { renderStage(); });
      } else if (!on && cur[part]) {
        var vk = cur[part + "View"]; st.items[vk] = items(vk).filter(function (x) { return x !== cur[part]; }); st.sel = null; commit();
      }
      st.names.on = !!(nnItems().name || nnItems().number);
      renderAll();
    }
    function panelNames() {
      var box = h("div", { class: "ls-panel__body" }), cur = nnItems();
      box.appendChild(h("p", { class: "t-small t-muted", text: "For team shirts: every piece gets its own name, number or both. We place them on the back; drag to move them." }));
      box.appendChild(h("div", { class: "ls-toggles" }, [
        h("label", { class: "ls-toggle" }, [h("input", { type: "checkbox", checked: !!cur.name, onchange: function (e) { setNN("name", e.target.checked); } }), h("span", { text: "Names" })]),
        h("label", { class: "ls-toggle" }, [h("input", { type: "checkbox", checked: !!cur.number, onchange: function (e) { setNN("number", e.target.checked); } }), h("span", { text: "Numbers" })])
      ]));
      if (!cur.name && !cur.number) return [panelHead("Names & numbers", "Personalise each piece"), box];
      var styleOf = cur.name || cur.number;
      box.appendChild(h("div", { class: "ls-label", text: "Colour" }));
      box.appendChild(colourRow(styleOf.colour, function (c) { if (cur.name) cur.name.colour = c; if (cur.number) cur.number.colour = c; renderStage(); commit(); renderPanel(); }));
      box.appendChild(h("div", { class: "ls-label", text: "Font" }));
      var fl = h("div", { class: "ls-fonts" });
      ["Graduate", "Staatliches", "Anton", "Bebas Neue", "Black Ops One", "Alfa Slab One"].forEach(function (n) {
        var f = fontOf(n);
        fl.appendChild(h("button", { class: "ls-font" + (styleOf.font === n ? " is-on" : ""), style: { "font-family": '"' + n + '"', "font-weight": f.w }, text: "RIVERA 21", onclick: function () { if (cur.name) cur.name.font = n; if (cur.number) cur.number.font = n; ensureFont(n, function () { renderStage(); }); renderStage(); commit(); renderPanel(); } }));
      });
      box.appendChild(fl);
      box.appendChild(h("div", { class: "ls-label", text: "Your list (" + st.names.rows.length + ")" }));
      var table = h("div", { class: "ls-nn" });
      st.names.rows.forEach(function (row, i) {
        table.appendChild(h("div", { class: "ls-nn__row" }, [
          cur.name ? h("input", { class: "input", placeholder: "Name", value: row.name, maxlength: 16, oninput: function (e) { row.name = e.target.value.toUpperCase(); e.target.value = row.name; if (i === 0) renderStage(); commitSoon(); } }) : null,
          cur.number ? h("input", { class: "input ls-nn__num", placeholder: "00", value: row.number, maxlength: 3, inputmode: "numeric", oninput: function (e) { row.number = e.target.value.replace(/\D/g, ""); e.target.value = row.number; if (i === 0) renderStage(); commitSoon(); } }) : null,
          h("select", { class: "select ls-nn__size", onchange: function (e) { row.size = e.target.value; commitSoon(); } }, [h("option", { value: "", text: "Size" })].concat(product.sizes.map(function (z) { var o = h("option", { value: z, text: z }); if (row.size === z) o.selected = true; return o; }))),
          h("button", { class: "ls-iconbtn", "aria-label": "Remove row", html: icon("close", 16), onclick: function () { st.names.rows.splice(i, 1); if (!st.names.rows.length) st.names.rows.push({ name: "", number: "", size: "" }); renderStage(); renderPanel(); commit(); } })
        ]));
      });
      box.appendChild(table);
      box.appendChild(h("button", { class: "btn btn--ghost btn--sm btn--block", html: icon("plus", 16) + "Add a row", onclick: function () { st.names.rows.push({ name: "", number: "", size: "" }); renderPanel(); var ins = el.panel.querySelectorAll(".ls-nn__row"); var last = ins[ins.length - 1]; if (last) last.querySelector("input").focus(); } }));
      box.appendChild(h("p", { class: "t-micro t-muted", text: "The first row shows on the preview. Sizes on this list are counted in the next step." }));
      return [panelHead("Names & numbers", "Personalise each piece"), box];
    }

    function renderPanel() {
      if (!el.panel) return;
      el.panel.innerHTML = "";
      root.classList.toggle("has-panel", !!st.panel && st.step === "design");
      if (!st.panel || st.step !== "design") return;
      var parts = st.panel === "product" ? panelProduct() : st.panel === "text" ? panelText() : st.panel === "upload" ? panelUpload() : st.panel === "art" ? panelArt() : panelNames();
      add(el.panel, parts);
      el.panel.classList.remove("is-in"); void el.panel.offsetWidth; el.panel.classList.add("is-in");
    }
    function renderRail() {
      el.rail.querySelectorAll("button").forEach(function (b) { b.classList.toggle("is-on", b.getAttribute("data-panel") === st.panel && st.step === "design"); });
    }
    function retintForGarment() {
      // when the garment flips between light and dark, keep pure black/white art readable
      var want = inkDefault(), other = want === "#ffffff" ? "#000000" : "#ffffff";
      product.views.forEach(function (v) { items(v.key).forEach(function (it) { if (it.colour === other && (it.type === "text" || it.type === "art")) it.colour = want; }); });
    }

    /* ---------- status, thumbnails, chrome ---------- */
    function renderStatus() {
      if (!el.status) return;
      el.status.innerHTML = "";
      var locs = locations();
      if (!locs.length) { el.status.appendChild(h("span", { class: "t-muted", text: "Add text or art to start. The dashed box is the printable area." })); return; }
      locs.forEach(function (l) {
        el.status.appendChild(h("button", { class: "ls-stat" + (l.key === st.view ? " is-on" : ""), onclick: function () { st.view = l.key; st.sel = null; clearNodes(); renderAll(); } }, [
          h("strong", { text: l.label }), h("span", { class: "t-num", text: l.wIn.toFixed(1) + " × " + l.hIn.toFixed(1) + " in" }), h("span", { class: "tag " + (l.out ? "tag--warn" : "tag--violet"), text: l.out ? "Outside the box is cut off" : l.tierLabel + " " + pricing.methods[st.method].label.toLowerCase() })
        ]));
      });
    }
    function staticView(key, colourCode, suffix) {
      var v = viewCfg(key), g = geom(v, colourCode), col = colourCfg(colourCode), vb = g.vb;
      var svg = s("svg", { viewBox: vb.x + " " + vb.y + " " + vb.w + " " + vb.h, class: "ls-static", xmlns: NS });
      var cid = "c-" + key + "-" + (suffix || "");
      svg.appendChild(s("defs", {}, [s("clipPath", { id: cid }, [s("rect", { x: 0, y: 0, width: g.W, height: g.H })])]));
      var im = s("image", { href: product.base + col.images[v.image], width: IMG[0], height: IMG[1] });
      if (g.mirrorX != null) im.setAttribute("transform", "translate(" + g.mirrorX + " 0) scale(-1 1)");
      svg.appendChild(im);
      var layer = s("g", { "clip-path": "url(#" + cid + ")" });
      items(key).forEach(function (it) { layer.appendChild(s("g", { transform: itemTransform(it) }, [buildInner(it, "-" + (suffix || "s") + key)])); });
      svg.appendChild(s("g", { transform: "translate(" + g.ax + " " + g.ay + ") scale(" + g.sx + " " + g.sy + ")" }, [layer]));
      return svg;
    }
    function renderViews() {
      el.views.innerHTML = "";
      product.views.forEach(function (v) {
        el.views.appendChild(h("button", { class: "ls-view" + (v.key === st.view ? " is-on" : ""), onclick: function () { if (st.view === v.key) return; st.view = v.key; st.sel = null; clearNodes(); renderAll(); } }, [
          staticView(v.key, st.colour, "t"), h("span", { text: v.label }), items(v.key).length ? h("i", { class: "ls-view__dot" }) : null
        ]));
      });
    }
    function renderChrome() {
      el.undo.disabled = histAt <= 0; el.redo.disabled = histAt >= hist.length - 1;
      el.steps.querySelectorAll("button").forEach(function (b) { var k = b.getAttribute("data-step"); b.classList.toggle("is-on", k === st.step); b.classList.toggle("is-done", ["design", "quantity", "review"].indexOf(k) < ["design", "quantity", "review"].indexOf(st.step)); });
      var label = st.step === "design" ? "Next: sizes" : st.step === "quantity" ? "See my price" : "Add to cart";
      el.next.querySelector("span").textContent = label;
      root.setAttribute("data-step", st.step);
      renderViews();
    }
    function renderAll() {
      root.setAttribute("data-step", st.step);
      // the live stage is hidden on the other steps, and hidden text cannot be measured
      if (st.step === "design") renderStage();
      renderPanel(); renderRail(); renderChrome(); renderStepBody();
    }

    /* ---------- quantity + review ---------- */
    function totalQty() { var n = 0; st.colours.forEach(function (c) { var z = st.sizes[c] || {}; for (var k in z) n += parseInt(z[k], 10) || 0; }); return n; }
    function mergedSizes() { var out = {}; st.colours.forEach(function (c) { var z = st.sizes[c] || {}; for (var k in z) out[k] = (out[k] || 0) + (parseInt(z[k], 10) || 0); }); return out; }
    function quote() { return P.quote(pricing, { blank: product.price, method: st.method, sizes: mergedSizes(), upcharges: product.upcharges, locations: locations(), min: product.min }); }
    function ladder(q) {
      var wrap = h("div", { class: "ls-ladder" });
      pricing.discountTiers.forEach(function (t, i) {
        var nextFrom = (pricing.discountTiers[i + 1] || {}).from, on = q.qty >= t.from && (!nextFrom || q.qty < nextFrom);
        wrap.appendChild(h("div", { class: "ls-ladder__step" + (on ? " is-on" : "") + (q.qty >= t.from ? " is-reached" : "") }, [h("strong", { text: t.pct ? "-" + Math.round(t.pct) + "%" : "Base" }), h("span", { class: "t-num", text: t.from + (nextFrom ? "–" + (nextFrom - 1) : "+") })]));
      });
      return wrap;
    }
    function stepQuantity() {
      var wrap = h("div", { class: "ls-step" });
      wrap.appendChild(h("div", { class: "ls-step__head" }, [h("div", { class: "t-eyebrow", text: "Step 2 of 3" }), h("h2", { class: "t-h1", text: "How many do you need?" }), h("p", { class: "t-lead", text: "Enter a quantity for each size. The more you order, the lower the price per piece." })]));
      var grid = h("div", { class: "ls-step__grid" }), left = h("div", { class: "stack", style: { "--gap": "16px" } });
      var side = h("aside", { class: "ls-sum card" });
      function drawSide() {
        var q = quote(); side.innerHTML = "";
        add(side, [
          h("div", { class: "ls-sum__qty" }, [h("span", { class: "t-eyebrow", text: "Pieces" }), h("strong", { class: "t-num", text: q.qty })]),
          ladder(q),
          q.qty < product.min ? h("p", { class: "tag tag--warn", text: "Add " + (product.min - q.qty) + " more to reach the minimum of " + product.min }) :
            q.nextTier ? h("p", { class: "tag tag--accent", text: "Add " + q.nextTier.add + " more for " + Math.round(q.nextTier.pct) + "% off every piece" }) : h("p", { class: "tag tag--good", text: "You have our best bulk price" }),
          h("button", { class: "btn btn--accent btn--block btn--lg", disabled: q.qty < product.min, html: "<span>See my price</span>" + icon("arrow", 18), onclick: next }),
          h("p", { class: "t-micro t-muted", text: "Free design check on every order. Nothing is charged at this step." })
        ]);
      }
      st.colours.forEach(function (code) {
        var c = colourCfg(code); st.sizes[code] = st.sizes[code] || {};
        var card = h("div", { class: "ls-sizecard card" });
        card.appendChild(h("div", { class: "ls-sizecard__head" }, [h("div", { class: "ls-thumb" }, [staticView(product.views[0].key, code, "q" + code)]), h("div", {}, [h("div", { class: "ls-prod__title", text: product.title }), h("div", { class: "t-small t-muted" }, [h("i", { class: "ls-dot", style: { "--c": c.hex } }), " " + c.name])])]));
        var row = h("div", { class: "ls-sizes" });
        product.sizes.forEach(function (z) {
          row.appendChild(h("label", { class: "ls-size" }, [h("span", { text: z }), h("input", { class: "input t-num", type: "number", min: 0, max: 999, inputmode: "numeric", placeholder: "0", value: st.sizes[code][z] || "", oninput: function (e) { var n = clamp(parseInt(e.target.value, 10) || 0, 0, 999); if (n) st.sizes[code][z] = n; else delete st.sizes[code][z]; drawSide(); persist(); } }), h("em", { class: "t-micro t-num", text: product.upcharges[z] ? "+" + P.money(product.upcharges[z]) : "" })]));
        });
        card.appendChild(row); left.appendChild(card);
      });
      var listed = st.names.on ? st.names.rows.filter(function (r) { return r.size; }).length : 0;
      if (st.names.on) left.appendChild(h("p", { class: "t-small t-muted", text: "Your names list has " + st.names.rows.length + " row" + (st.names.rows.length === 1 ? "" : "s") + (listed ? ", " + listed + " with a size." : ".") + " Make sure the quantities above cover it." }));
      left.appendChild(h("button", { class: "btn btn--ghost btn--sm", html: icon("plus", 16) + "Add another colour", onclick: function () { st.step = "design"; st.panel = "product"; renderAll(); } }));
      drawSide(); grid.appendChild(left); grid.appendChild(side); wrap.appendChild(grid);
      return wrap;
    }
    function stepReview() {
      var q = quote(), wrap = h("div", { class: "ls-step" }), d = P.delivery(pricing);
      wrap.appendChild(h("div", { class: "ls-step__head" }, [h("div", { class: "t-eyebrow", text: "Step 3 of 3" }), h("h2", { class: "t-h1", text: st.designName ? "“" + st.designName + "” is ready" : "Your order" }), h("p", { class: "t-lead", text: "Check the preview and the price. We review every design by hand before it prints." })]));
      var grid = h("div", { class: "ls-step__grid" }), left = h("div", { class: "stack", style: { "--gap": "16px" } });
      var mocks = h("div", { class: "ls-mocks" }), locs = locations(), shown = locs.length ? locs.map(function (l) { return l.key; }) : [product.views[0].key];
      shown.forEach(function (key) { var l = locationInfo(key); mocks.appendChild(h("figure", { class: "ls-mock card" }, [staticView(key, st.colour, "r"), h("figcaption", {}, [h("strong", { text: viewCfg(key).label }), l ? h("span", { class: "t-small t-muted t-num", text: l.wIn.toFixed(1) + " × " + l.hIn.toFixed(1) + " in · " + l.tierLabel }) : null])])); });
      left.appendChild(mocks);
      left.appendChild(h("label", { class: "field" }, [h("span", { text: "Notes for our art team (optional)" }), h("textarea", { class: "textarea", placeholder: "Example: match the blue to our logo, keep the text 3 inches below the collar.", value: st.notes, oninput: function (e) { st.notes = e.target.value; persist(); } })]));
      left.appendChild(h("div", { class: "card ls-pf-card" }, [printFilesBox(renderStepBody)]));
      var rows = h("div", { class: "ls-lines" });
      function line(a, b, cls) { rows.appendChild(h("div", { class: "ls-line " + (cls || "") }, [h("span", { text: a }), h("span", { class: "t-num", text: b })])); }
      line(product.title + " × " + q.qty, P.money(q.blank) + " each");
      q.locations.forEach(function (l) { line(l.label + " · " + l.tierLabel.toLowerCase() + " (" + l.size.toLowerCase() + ")", "+" + P.money(l.price) + " each"); });
      if (q.discountPct) line("Bulk discount, " + q.qty + " pieces", "-" + q.discountPct + "%", "is-good");
      line("Price per piece", P.money(q.unit), "is-strong");
      line("Pieces", "× " + q.qty);
      if (q.setup) line("One-time setup (" + q.locations.length + " location" + (q.locations.length === 1 ? "" : "s") + ")", P.money(q.setup));
      if (q.upcharge) line("Larger sizes", P.money(q.upcharge));
      var side = h("aside", { class: "ls-sum card" }, [
        h("div", { class: "ls-price" }, [h("span", { class: "t-eyebrow", text: "Total" }), h("strong", { class: "t-num", text: P.money(q.total) }), h("span", { class: "t-small t-muted t-num", text: P.money(q.perPiece) + " per piece, all in" })]),
        q.saved > 0 ? h("p", { class: "tag tag--good", text: "You save " + P.money(q.saved) + " with the bulk discount" }) : null,
        rows,
        h("div", { class: "ls-deliver" }, [h("strong", { text: "Free standard delivery" }), h("span", { class: "t-num", text: "Arrives " + P.shortDate(d.earliest) + " – " + P.shortDate(d.latest) })]),
        h("button", { class: "btn btn--accent btn--block btn--lg", disabled: !q.meetsMin || !q.locations.length, html: "<span>Add to cart</span>" + icon("arrow", 18), onclick: addToCart }),
        !q.locations.length ? h("p", { class: "tag tag--warn", text: "Your design is empty. Go back and add text or art." }) : null,
        h("button", { class: "btn btn--ghost btn--block", text: "Email me this quote", onclick: function () { toast(st.email ? "We'll send this quote to " + st.email + " once the store is connected." : "Save your design first so we know where to send it."); } }),
        q.nextTier ? h("p", { class: "t-micro t-muted", text: "Tip: " + q.nextTier.add + " more pieces brings the price to " + P.money(q.nextTier.unit) + " each." }) : null
      ]);
      grid.appendChild(left); grid.appendChild(side); wrap.appendChild(grid);
      return wrap;
    }
    function renderStepBody() {
      el.stepBody.innerHTML = "";
      if (st.step === "quantity") el.stepBody.appendChild(stepQuantity());
      if (st.step === "review") el.stepBody.appendChild(stepReview());
    }
    function gate(then) {
      var name = h("input", { class: "input", placeholder: "Example: Spring fundraiser tees", maxlength: 40, value: st.designName, required: true });
      var email = h("input", { class: "input", type: "email", placeholder: "you@example.com", value: st.email, required: true, autocomplete: "email" });
      var modal = h("div", { class: "modal" }, [h("form", { class: "modal__box stack", onsubmit: function (e) {
        e.preventDefault(); st.designName = name.value.trim(); st.email = email.value.trim(); st.unlocked = true; persist(); modal.remove(); toast("Design saved."); then();
      } }, [
        h("div", { class: "t-eyebrow", text: "Almost there" }), h("h2", { class: "t-h2", text: "Save your design to see the price" }),
        h("p", { class: "t-small t-muted", text: "We keep it so you can pick it up later on any device, and so our art team can check it." }),
        h("label", { class: "field" }, [h("span", { text: "Name your design" }), name]),
        h("label", { class: "field" }, [h("span", { text: "Email" }), email]),
        h("button", { class: "btn btn--accent btn--block btn--lg", type: "submit", html: "<span>Save and see my price</span>" + icon("arrow", 18) }),
        h("button", { class: "btn btn--ghost btn--block", type: "button", text: "Not now", onclick: function () { modal.remove(); } })
      ])]);
      document.body.appendChild(modal); name.focus();
    }
    function cartPayload() {
      var q = quote();
      return { sku: product.sku, handle: product.handle, method: st.method, designName: st.designName, email: st.email, notes: st.notes, colours: st.colours.map(function (c) { return { code: c, name: colourCfg(c).name, sizes: st.sizes[c] || {} }; }), locations: locations(), names: st.names.on ? st.names.rows : [], printFiles: printFiles.map(function (f) { return { name: f.name, size: f.size, type: f.type }; }), quote: q };
    }
    function addToCart() {
      var payload = cartPayload();
      if (typeof opts.onAddToCart === "function") return opts.onAddToCart(payload);
      var modal = h("div", { class: "modal", onclick: function (e) { if (e.target === modal) modal.remove(); } }, [h("div", { class: "modal__box stack" }, [
        h("div", { class: "t-eyebrow", text: "Prototype" }), h("h2", { class: "t-h2", text: "This is where checkout starts" }),
        h("p", { class: "t-small t-muted", text: "On the live store this button puts " + payload.quote.qty + " pieces in the Shopify cart at " + P.money(payload.quote.total) + " with the design attached. That link is the next build step." }),
        h("button", { class: "btn btn--block", text: "Close", onclick: function () { modal.remove(); } })
      ])]);
      document.body.appendChild(modal);
    }
    function go(step) {
      if (step === st.step) return;
      if (step !== "design" && !locations().length) { toast("Add text or art first."); return; }
      if (step === "review") {
        if (totalQty() < product.min) { st.step = "quantity"; renderAll(); toast("Enter at least " + product.min + " pieces."); return; }
        if (!st.unlocked) { gate(function () { st.step = "review"; st.sel = null; renderAll(); window.scrollTo(0, 0); }); return; }
      }
      st.step = step; st.sel = null; renderAll(); window.scrollTo(0, 0);
    }
    function next() { if (st.step === "design") go("quantity"); else if (st.step === "quantity") go("review"); else addToCart(); }

    /* ---------- build the chrome ---------- */
    function build() {
      root.classList.add("ls");
      var rail = [["product", "Product"], ["text", "Text"], ["upload", "Upload"], ["art", "Art"], ["names", "Names"]];
      el.rail = h("nav", { class: "ls-rail", "aria-label": "Design tools" }, rail.map(function (r) { return h("button", { "data-panel": r[0], onclick: function () { if (st.step !== "design") { st.step = "design"; } openPanel(st.panel === r[0] && root.classList.contains("has-panel") ? null : r[0]); renderChrome(); renderStepBody(); }, html: icon(r[0] === "names" ? "names" : r[0], 24) + "<span>" + r[1] + "</span>" }); }));
      el.panel = h("aside", { class: "ls-panel", "aria-label": "Tool options" });
      el.steps = h("ol", { class: "ls-steps" }, [["design", "Design"], ["quantity", "Sizes"], ["review", "Price"]].map(function (x, i) { return h("li", {}, [h("button", { "data-step": x[0], onclick: function () { go(x[0]); } }, [h("i", { text: i + 1 }), h("span", { text: x[1] })])]); }));
      el.undo = h("button", { class: "ls-iconbtn", title: "Undo (Ctrl+Z)", "aria-label": "Undo", html: icon("undo", 20), onclick: undo });
      el.redo = h("button", { class: "ls-iconbtn", title: "Redo (Ctrl+Y)", "aria-label": "Redo", html: icon("redo", 20), onclick: redo });
      el.next = h("button", { class: "btn btn--accent", html: "<span>Next: sizes</span>" + icon("arrow", 18), onclick: next });
      var top = h("header", { class: "ls-top" }, [
        h("a", { class: "ls-logo", href: opts.homeUrl || "#", "aria-label": "Lev Impressions home" }, opts.logo ? [h("img", { src: opts.logo, alt: "Lev Impressions", height: 34 })] : [h("strong", { text: "LEV" })]),
        el.steps,
        h("div", { class: "ls-top__right" }, [
          h("a", { class: "ls-help", href: "tel:+13057055486", html: icon("phone", 18) + "<span>(305) 705-5486</span>" }),
          h("button", { class: "btn btn--white btn--sm", html: icon("save", 16) + "<span>Save</span>", onclick: function () { if (st.unlocked) { persist(); toast("Saved on this device."); } else gate(function () { }); } }),
          el.next
        ])
      ]);
      el.status = h("div", { class: "ls-status" });
      el.views = h("div", { class: "ls-views" });
      var stageWrap = h("div", { class: "ls-stage" }, [
        h("div", { class: "ls-tools" }, [el.undo, el.redo, h("button", { class: "ls-iconbtn", title: "Start over", "aria-label": "Start over", html: icon("rotate", 20), onclick: function () {
          if (!locations().length) return; if (!window.confirm("Clear the whole design and start over?")) return;
          product.views.forEach(function (v) { st.items[v.key] = []; }); st.sel = null; st.names = { on: false, rows: [{ name: "", number: "", size: "" }] }; clearNodes(); renderAll(); commit();
        } }), h("button", { class: "ls-iconbtn", title: "Zoom to the print area", "aria-label": "Zoom", html: icon("zoom", 20), onclick: function (e) { st.zoom = !st.zoom; e.currentTarget.classList.toggle("is-on", st.zoom); renderStage(); } })]),
        h("div", { class: "ls-canvas" }, [buildStage()]),
        el.views,
        el.status
      ]);
      el.stepBody = h("main", { class: "ls-stepbody" });
      add(root, [top, h("div", { class: "ls-work" }, [el.rail, el.panel, stageWrap]), el.stepBody]);
      document.addEventListener("keydown", onKey);
      window.addEventListener("resize", function () { renderOverlay(); });
    }

    build();
    var resumed = loadSaved();
    hist = [snapshot()]; histAt = 0;
    renderAll();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { for (var k in nodes) nodes[k]._sig = null; if (st.step === "design") renderStage(); renderViews(); });
    if (resumed) toast("Welcome back. We kept your design.");

    return { state: st, quote: quote, payload: cartPayload, printFiles: function () { return printFiles.slice(); }, addText: addText, addItem: addItem, go: go, locations: locations, render: function () { clearNodes(); renderAll(); }, commit: commit, undo: undo, redo: redo };
  }

  window.LevStudio = { mount: mount, FONTS: FONTS };
})();
