/* Lev Impressions listing page: gallery, colour swatches, decoration method,
   delivery estimate and the pricing calculator. Reads the same product and
   pricing data as the design studio. */
(function () {
  "use strict";
  var P = window.LevPricing;

  function h(tag, props, kids) {
    var e = document.createElement(tag);
    for (var k in props || {}) {
      var v = props[k]; if (v == null || v === false) continue;
      if (k === "class") e.className = v; else if (k === "text") e.textContent = v; else if (k === "html") e.innerHTML = v;
      else if (k === "style" && typeof v === "object") for (var sk in v) e.style.setProperty(sk, v[sk]);
      else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), v); else if (k === "value") e.value = v;
      else e.setAttribute(k, v === true ? "" : v);
    }
    (Array.isArray(kids) ? kids : kids == null ? [] : [kids]).forEach(function (c) { if (c == null || c === false) return; e.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return e;
  }
  var ARROW = '<svg class="arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
  var STAR = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.5 2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17.4l-5.9 3.3 1.3-6.6L2.5 9.5l6.6-.8Z"/></svg>';
  var VIEW_LABEL = { model_front: "Front, on model", model_back: "Back, on model", model_side: "Side, on model", model_lifestyle: "In use", flat_front: "Front", flat_back: "Back", flat_left: "Left side", flat_right: "Right side", hat_left: "Left side", hat_straight: "Front", hat_right: "Right side", hat_back: "Back" };
  var VIEW_ORDER = ["model_front", "model_back", "model_side", "hat_left", "hat_straight", "hat_right", "hat_back", "flat_front", "flat_back", "flat_left", "flat_right", "model_lifestyle"];

  /* A number that slides to its new value (transitions.dev "number subtle change"). */
  function swapText(el, text) {
    if (el.textContent === text) return;
    el.textContent = text; el.classList.remove("is-swap"); void el.offsetWidth; el.classList.add("is-swap");
  }

  function mount(opts) {
    var product = opts.product, pricing = opts.pricing;
    var st = {
      colour: (product.colours.filter(function (c) { return c.code === opts.colour; })[0] || product.colours[0]).code,
      image: 0,
      method: product.methods[0],
      qty: 50,
      locs: {}
    };
    var first = product.views[0], firstTier = first.maxTier === "s" ? "s" : "m"; st.locs[first.key] = firstTier;
    var oneSize = product.sizes.length === 1;
    var firstWord = firstTier === "s" ? "a small " + first.label.toLowerCase() + " logo" : "a " + first.label.toLowerCase() + " print";
    function colour() { return product.colours.filter(function (c) { return c.code === st.colour; })[0]; }
    function shots() { var c = colour(), keys = VIEW_ORDER.filter(function (k) { return c.images[k]; }); Object.keys(c.images).forEach(function (k) { if (keys.indexOf(k) < 0) keys.push(k); }); return keys.map(function (k) { return { key: k, src: product.base + c.images[k] }; }); }
    function studioUrl(extra) { var base = opts.studioUrl || "studio.html"; return base + (base.indexOf("?") >= 0 ? "&" : "?") + "sku=" + encodeURIComponent(product.sku) + "&color=" + encodeURIComponent(st.colour) + "&method=" + st.method + (extra || ""); }

    /* ---------- gallery ---------- */
    var gal = opts.gallery, main = h("div", { class: "pg-main" }), thumbs = h("div", { class: "pg-thumbs" });
    function drawGallery(dir) {
      var list = shots(); st.image = Math.max(0, Math.min(list.length - 1, st.image));
      var cur = list[st.image];
      var img = h("img", { src: cur.src, alt: product.title + " in " + colour().name + ", " + (VIEW_LABEL[cur.key] || "view").toLowerCase(), width: 1200, height: 1800, class: "pg-img", style: { "--from": (dir || 0) * 24 + "px" } });
      var old = main.querySelector(".pg-img"); if (old) { old.classList.add("is-out"); setTimeout(function () { old.remove(); }, 260); }
      main.appendChild(img);
      thumbs.innerHTML = "";
      list.forEach(function (s, i) {
        thumbs.appendChild(h("button", { class: "pg-thumb" + (i === st.image ? " is-on" : ""), "aria-label": VIEW_LABEL[s.key] || "View", onclick: function () { var d = i > st.image ? 1 : -1; st.image = i; drawGallery(d); } }, [h("img", { src: s.src, alt: "", loading: "lazy" })]));
      });
      count.textContent = (st.image + 1) + " / " + list.length;
    }
    var count = h("span", { class: "pg-count t-num" });
    function step(d) { var n = shots().length; st.image = (st.image + d + n) % n; drawGallery(d); }
    main.appendChild(h("button", { class: "pg-nav pg-nav--prev", "aria-label": "Previous picture", html: ARROW, onclick: function () { step(-1); } }));
    main.appendChild(h("button", { class: "pg-nav pg-nav--next", "aria-label": "Next picture", html: ARROW, onclick: function () { step(1); } }));
    main.appendChild(count);
    main.appendChild(h("span", { class: "sticker pg-sticker", text: "Your design here" }));
    gal.appendChild(thumbs); gal.appendChild(main);

    /* ---------- buy box ---------- */
    var buy = opts.buy;
    var d = P.delivery(pricing);
    var fromQ = P.quote(pricing, { blank: product.price, method: st.method, qty: 50, locations: [{ key: first.key, tier: firstTier }] });
    var colourName = h("strong", {});
    var swatches = h("div", { class: "pb-swatches" });
    var cta = h("a", { class: "btn btn--accent btn--lg btn--block", html: "<span>Start designing</span>" + ARROW });
    var uploadCta = h("a", { class: "btn btn--ghost btn--block", text: "I already have a design: upload it" });
    function drawSwatches() {
      swatches.innerHTML = "";
      product.colours.forEach(function (c) {
        swatches.appendChild(h("button", { class: "swatch" + (c.code === st.colour ? " is-on" : "") + (c.dark ? "" : " is-light"), style: { "--c": c.hex }, title: c.name, "aria-label": c.name, "aria-pressed": c.code === st.colour ? "true" : "false", onclick: function () { st.colour = c.code; st.image = 0; drawSwatches(); drawGallery(0); } }));
      });
      colourName.textContent = colour().name;
      cta.href = studioUrl(); uploadCta.href = studioUrl("&panel=upload");
      document.querySelectorAll("[data-studio-link]").forEach(function (a) { a.href = studioUrl(); });
    }
    var methodSeg = h("div", { class: "seg" }, Object.keys(pricing.methods).map(function (key) {
      var ok = product.methods.indexOf(key) >= 0;
      return h("button", { class: key === st.method ? "is-on" : "", value: key, disabled: !ok, title: ok ? "" : "Not offered on this item", text: pricing.methods[key].label });
    }));
    buy.appendChild(h("div", { class: "stack", style: { "--gap": "18px" } }, [
      h("div", { class: "pb-eyebrow" }, [h("span", { class: "t-eyebrow", text: product.brand + " · " + product.sku }), h("span", { class: "tag tag--good", text: "No setup surprises" })]),
      h("h1", { class: "t-h1", text: product.title }),
      h("a", { class: "pb-rating", href: "#reviews" }, [h("span", { class: "stars", html: STAR + STAR + STAR + STAR + STAR }), h("strong", { class: "t-num", text: product.rating.value.toFixed(1) }), h("span", { class: "t-muted", text: product.rating.count + " Google reviews of our shop" })]),
      h("p", { class: "pb-from" }, [h("strong", { class: "t-num", text: P.money(fromQ.unit) }), h("span", { text: " each for 50 with " + firstWord }), h("a", { href: "#calc", class: "pb-link", text: "Price yours" })]),
      h("div", { class: "pb-ship" }, [
        h("div", { class: "pb-ship__card" }, [h("span", { class: "t-micro t-muted", text: "Free delivery" }), h("strong", { class: "t-num", text: P.shortDate(d.earliest) + " – " + P.shortDate(d.latest) })]),
        h("div", { class: "pb-ship__card" }, [h("span", { class: "t-micro t-muted", text: "Need it sooner?" }), h("a", { href: "tel:+13057055486", html: "<strong>Call (305) 705-5486</strong>" })])
      ]),
      h("div", {}, [h("div", { class: "pb-label" }, ["Colour: ", colourName, h("span", { class: "t-muted", text: (product.coloursOnSanmar || 0) > product.colours.length ? " · " + product.colours.length + " of " + product.coloursOnSanmar + " colours shown" : " · " + product.colours.length + " colours" })]), swatches]),
      h("div", {}, [h("div", { class: "pb-label", text: "Decoration" }), methodSeg, h("p", { class: "t-small t-muted", style: { "margin-top": "8px" }, text: "Minimum " + product.min + " pieces. " + (oneSize ? "One size." : "Sizes " + product.sizes[0] + " to " + product.sizes[product.sizes.length - 1] + ".") })]),
      h("div", { class: "stack", style: { "--gap": "10px" } }, [cta, uploadCta]),
      h("ul", { class: "pb-trust" }, ["A person checks every design before it prints", "Bulk discount from 12 pieces, up to 46% off", "Text, your own art, clipart, names and numbers"].map(function (t) { return h("li", { text: t }); }))
    ]));
    var methodSegApi = window.LevSite.seg(methodSeg);
    methodSeg.addEventListener("seg:change", function (e) { st.method = e.detail; drawSwatches(); if (calcMethod) { calcMethod.querySelectorAll("button").forEach(function (b) { b.classList.toggle("is-on", b.value === st.method); }); calcSeg.place(); } drawCalc(); });

    /* ---------- calculator ---------- */
    var calc = opts.calc, calcMethod = null, calcSeg = null;
    var qtyInput = h("input", { class: "input pc-qty t-num", type: "number", min: product.min, max: pricing.maxQty, value: st.qty, inputmode: "numeric", "aria-label": "Quantity" });
    var range = h("input", { class: "range", type: "range", min: product.min, max: 300, step: 1, value: st.qty, "aria-label": "Quantity slider" });
    var ladder = h("div", { class: "pc-ladder" });
    var locRows = h("div", { class: "pc-locs" });
    var out = { unit: h("strong", { class: "pc-unit t-num" }), was: h("s", { class: "t-num t-muted" }), tag: h("span", { class: "tag tag--accent" }), total: h("strong", { class: "t-num" }), setup: h("span", { class: "t-num" }), hint: h("p", { class: "pc-hint" }) };
    function setQty(n, from) {
      n = Math.max(product.min, Math.min(pricing.maxQty, parseInt(n, 10) || product.min)); st.qty = n;
      if (from !== "input") qtyInput.value = n;
      if (from !== "range") range.value = Math.min(n, 300);
      range.style.setProperty("--fill", ((Math.min(n, 300) - product.min) / (300 - product.min)) * 100 + "%");
      drawCalc();
    }
    qtyInput.addEventListener("input", function () { if (qtyInput.value !== "") setQty(qtyInput.value, "input"); });
    qtyInput.addEventListener("blur", function () { setQty(qtyInput.value || product.min); });
    range.addEventListener("input", function () { setQty(range.value, "range"); });
    function drawLocs() {
      locRows.innerHTML = "";
      var tiers = pricing.methods[st.method].tiers;
      product.views.forEach(function (v) {
        var allowed = v.maxTier ? tiers.slice(0, tiers.map(function (t) { return t.key; }).indexOf(v.maxTier) + 1) : tiers;
        if (st.locs[v.key] && !allowed.filter(function (t) { return t.key === st.locs[v.key]; }).length) delete st.locs[v.key];
        var sel = h("select", { class: "select", "aria-label": v.label + " print size", onchange: function (e) { if (e.target.value) st.locs[v.key] = e.target.value; else delete st.locs[v.key]; row.classList.toggle("is-on", !!e.target.value); drawCalc(); } },
          [h("option", { value: "", text: "No decoration" })].concat(allowed.map(function (t) { var o = h("option", { value: t.key, text: t.label + " · " + t.size.replace("Up to ", "up to ") + " · +" + P.money(t.price) }); if (st.locs[v.key] === t.key) o.selected = true; return o; })));
        var row = h("label", { class: "pc-loc" + (st.locs[v.key] ? " is-on" : "") }, [h("span", { text: v.label }), sel]);
        locRows.appendChild(row);
      });
    }
    function drawCalc() {
      var locations = product.views.filter(function (v) { return st.locs[v.key]; }).map(function (v) { return { key: v.key, label: v.label, tier: st.locs[v.key] }; });
      var q = P.quote(pricing, { blank: product.price, method: st.method, qty: st.qty, locations: locations, min: product.min });
      swapText(out.unit, P.money(q.unit));
      out.was.textContent = q.discountPct ? P.money(q.unitBefore) : ""; out.was.hidden = !q.discountPct;
      out.tag.textContent = q.discountPct ? Math.round(q.discountPct) + "% bulk discount" : "Add " + (12 - q.qty) + " more for 17% off"; out.tag.className = "tag " + (q.discountPct ? "tag--good" : "tag--accent");
      swapText(out.total, P.money(q.total));
      out.setup.textContent = q.setup ? "includes " + P.money(q.setup) + " one-time setup" : "no setup: blank items";
      out.hint.textContent = q.nextTier ? "Order " + q.nextTier.add + " more and each piece drops to " + P.money(q.nextTier.unit) + "." : "This is our best bulk price.";
      ladder.innerHTML = "";
      pricing.discountTiers.forEach(function (t, i) {
        var nx = (pricing.discountTiers[i + 1] || {}).from, on = q.qty >= t.from && (!nx || q.qty < nx);
        ladder.appendChild(h("button", { class: "pc-step" + (on ? " is-on" : "") + (q.qty >= t.from ? " is-reached" : ""), title: "Set quantity to " + Math.max(t.from, product.min), onclick: function () { setQty(Math.max(t.from, product.min)); } }, [h("strong", { text: t.pct ? "-" + Math.round(t.pct) + "%" : "Base" }), h("span", { class: "t-num", text: t.from + (nx ? "–" + (nx - 1) : "+") })]));
      });
    }
    if (calc) {
      calcMethod = h("div", { class: "seg" }, Object.keys(pricing.methods).map(function (key) { var ok = product.methods.indexOf(key) >= 0; return h("button", { class: key === st.method ? "is-on" : "", value: key, disabled: !ok, text: pricing.methods[key].label }); }));
      var up = Object.keys(product.upcharges || {}), upText = "";
      if (up.length) { var groups = {}; up.forEach(function (z) { var k = product.upcharges[z].toFixed(2); (groups[k] = groups[k] || []).push(z); }); upText = Object.keys(groups).map(function (k) { var g = groups[k]; return (g.length > 1 ? g[0] + " to " + g[g.length - 1] : g[0]) + " add " + P.money(+k) + " each"; }).join(", ") + "."; }
      calc.appendChild(h("div", { class: "pc" }, [
        h("div", { class: "pc__left stack", style: { "--gap": "22px" } }, [
          h("div", {}, [h("div", { class: "t-eyebrow", text: "Pricing calculator" }), h("h2", { class: "t-h2", text: "Price it in ten seconds" })]),
          h("div", {}, [h("div", { class: "pc-row" }, [h("span", { class: "pb-label", text: "How many?" }), h("span", { class: "t-small t-muted", text: "minimum " + product.min })]), h("div", { class: "pc-qtyrow" }, [qtyInput, range]), ladder]),
          h("div", {}, [h("div", { class: "pb-label", text: "Decoration" }), calcMethod]),
          h("div", {}, [h("div", { class: "pb-label", text: "Where, and how big?" }), locRows, h("p", { class: "t-micro t-muted", style: { "margin-top": "8px" }, text: "Not sure of the size? The design studio measures your design and picks the size for you." })])
        ]),
        h("aside", { class: "pc__right" }, [
          h("div", { class: "t-eyebrow", text: "Price per piece" }),
          h("div", { class: "pc-price" }, [out.unit, out.was]),
          out.tag,
          h("div", { class: "pc-total" }, [h("span", { text: "Order total" }), out.total]),
          h("p", { class: "t-small t-muted" }, [out.setup]),
          out.hint,
          h("a", { class: "btn btn--accent btn--block btn--lg", "data-studio-link": true, html: "<span>Start designing</span>" + ARROW }),
          h("ul", { class: "pc-incl" }, ["Unlimited print colours", "Free standard delivery", "Design check by our art team", upText ? "Larger sizes: " + upText : null].filter(Boolean).map(function (t) { return h("li", { text: t }); }))
        ])
      ]));
      calcSeg = window.LevSite.seg(calcMethod);
      calcMethod.addEventListener("seg:change", function (e) { st.method = e.detail; methodSeg.querySelectorAll("button").forEach(function (b) { b.classList.toggle("is-on", b.value === st.method); }); methodSegApi.place(); drawLocs(); drawSwatches(); drawCalc(); });
      drawLocs();
    }

    drawSwatches(); drawGallery(0); if (calc) setQty(st.qty);
    document.addEventListener("keydown", function (e) { if (/input|select|textarea/i.test(e.target.tagName)) return; if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); });
    return { state: st };
  }

  window.LevProduct = { mount: mount };
})();
