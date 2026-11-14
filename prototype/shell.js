/* Prototype only: prints the header, mega menu, phone drawer and footer that the
   Shopify theme will print from its own sections.

   The menu is built from the catalog list (catalog/index.json): a category or
   sub-category appears when it has items, with its count, and every link goes
   to that category's own page. */
window.LevSiteManual = true;
(function () {
  var chev = '<svg class="chev" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 4.5 6 8l3.5-3.5"/></svg>';
  var ico = {
    search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/></svg>',
    cart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1.2 11H6.2L5 8Zm4 0V6a3 3 0 0 1 6 0v2"/></svg>',
    phone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h4l1 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 1v4a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z"/></svg>',
    menu: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    arrow: '<svg class="arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>'
  };
  /* The four categories, in menu order, and a line for each sub-category. */
  var MENU = [
    { key: "shirts", cat: "Shirts", label: "Shirts", title: "Custom shirts" },
    { key: "hoodies", cat: "Hoodies & Sweatshirts", label: "Hoodies", title: "Hoodies & sweatshirts" },
    { key: "hats", cat: "Hats", label: "Hats", title: "Custom hats" },
    { key: "bags", cat: "Bags", label: "Bags", title: "Custom bags" }
  ];
  var SUB_NOTE = {
    "Short Sleeve T-Shirts": "The everyday classics", "Long Sleeve Shirts": "Cooler days, more print room", "Polo Shirts": "Staff and golf days",
    "Performance Shirts": "Moisture-wicking polyester", "Kids Shirts & Baby Onesies": "Youth, toddler and infant", "Tank Tops & Sleeveless": "Gyms and summer events", "Premium Shirts": "Softer fabrics, retail fit",
    "Hoodies": "Pullover fleece", "Sweatshirts": "Crewneck fleece", "Zip Up Hoodies": "Full-zip layers", "Quarter Zips": "A step up for teams", "Kids Sweatshirts & Hoodies": "Youth, toddler and infant",
    "Baseball Hats": "Six-panel classics", "Trucker Hats": "Mesh backs, snap closure", "Beanies": "Knit caps for winter",
    "Tote Bags": "Cotton and canvas", "Drawstring Bags": "Light and low cost", "Backpacks": "School and travel"
  };
  var ticker = ["Free delivery on every order", "Bulk discounts start at 12 pieces", "Printed and stitched in Miami", "Every design checked by a person", "Family owned, 18+ years"];
  var tick = ticker.concat(ticker).map(function (t) { return "<span>" + t + "</span>"; }).join("");

  /* The moving picture in the menu's "Design it yourself" card: a tiny studio screen that walks through
     four things the studio does (add text, upload art, move and resize, pick the item colour). */
  var MINI = {
    shirts: { c: [112, 60, 1], d: '<path class="lev-mini__g" d="M58 16 70 12Q80 20 90 12L102 16 120 31 110 44 101 37V96H59V37L50 44 40 31Z"/>' },
    hoodies: { c: [112, 66, 0.86], d: '<path class="lev-mini__g" d="M62 20Q80 2 98 20L112 27 124 74 112 78 102 50V98H58V50L48 78 36 74 48 27Z"/><path class="lev-mini__ln" d="M66 22Q80 36 94 22"/>' },
    hats: { c: [108, 58, 0.66], d: '<path class="lev-mini__g" d="M46 70Q42 28 78 28 108 28 110 64L132 72Q120 83 98 77L46 73Z"/><path class="lev-mini__ln" d="M110 64Q92 71 46 70"/>' },
    bags: { c: [112, 78, 0.84], d: '<path class="lev-mini__ln" d="M66 46Q66 16 80 16 94 16 94 46"/><path class="lev-mini__g" d="M54 46H106L110 100H50Z"/>' }
  };
  var STEPS = ["Add text in any font", "Upload your logo or art", "Move, resize and rotate", "Pick the item colour"];
  function mini(key) {
    var m = MINI[key], c = m.c, k = c[2];
    var px = function (n) { return n.toFixed(1) + "px"; };
    /* where the pointer grabs the frame's corner, before and after the design grows */
    var vars = "--ax:" + px(c[0] + 20 * 0.8 * k) + ";--ay:" + px(c[1] + 16 * 0.8 * k) + ";--bx:" + px(c[0] + 20 * 1.15 * k) + ";--by:" + px(c[1] + 16 * 1.15 * k);
    var tool = function (i, glyph) { return '<g class="lev-mini__tool" style="--i:' + i + '"><rect x="8" y="' + (12 + i * 20) + '" width="16" height="16" rx="5"/>' + glyph.replace(/Y/g, String(20 + i * 20)) + "</g>"; };
    return '<svg class="lev-mini" viewBox="0 0 200 118" aria-hidden="true" style="' + vars + '"><rect class="lev-mini__board" x="0.5" y="0.5" width="199" height="117" rx="12"/><path class="lev-mini__rail" d="M32 8V110"/>' +
      tool(0, '<path d="M12.5 16.5h7M16 16.5v7" transform="translate(0 0)"/>') +
      tool(1, '<path d="M16 43.5v-7m-3 3 3-3 3 3M12.5 44.5h7"/>') +
      tool(2, '<path d="M16 55.6l1.4 3 3.2.3-2.4 2.1.7 3.2-2.9-1.7-2.9 1.7.7-3.2-2.4-2.1 3.2-.3Z"/>') +
      tool(3, '<path d="M14.6 76v8m3-8v8m-5-5.4h7m-7 2.8h7"/>') +
      '<g transform="translate(32 6)">' + m.d + "</g>" +
      '<g transform="translate(' + c[0] + " " + c[1] + ") scale(" + k + ')"><g class="lev-mini__d">' +
        '<path class="lev-mini__star" d="M0-15 2.4-9.8 8.1-9.2 3.8-5.4 5-0.2 0-2.6-5-0.2-3.8-5.4-8.1-9.2-2.4-9.8Z"/><text class="lev-mini__txt" x="0" y="12" text-anchor="middle">TEAM</text>' +
        '<g class="lev-mini__sel"><rect x="-20" y="-16" width="40" height="32" rx="1"/><circle cx="-20" cy="-16" r="2.2"/><circle cx="20" cy="-16" r="2.2"/><circle cx="-20" cy="16" r="2.2"/><circle cx="20" cy="16" r="2.2"/></g>' +
      "</g></g>" +
      '<g class="lev-mini__sw"><circle cx="184" cy="40" r="5.5" fill="#f1efea"/><circle class="lev-mini__pick" cx="184" cy="59" r="5.5" fill="#ffc83d"/><circle cx="184" cy="78" r="5.5" fill="#0e0e10"/></g>' +
      '<path class="lev-mini__cur" d="M0 0V13L3.4 10 6 15.4 8.2 14.3 5.6 9.1H10Z"/></svg>' +
      '<div class="lev-steps">' + STEPS.map(function (t, i) { return '<em style="--i:' + i + '">' + t + "</em>"; }).join("") + "</div>" +
      '<div class="lev-stepdots">' + STEPS.map(function (t, i) { return '<i style="--i:' + i + '"></i>'; }).join("") + "</div>";
  }

  var header =
    '<div class="lev-bar" aria-hidden="true"><div class="lev-bar__track">' + tick + tick + "</div></div>" +
    '<header class="lev-header"><div class="wrap lev-header__in">' +
      '<a class="lev-logo" data-link="home" href="#" aria-label="Lev Impressions home"><img data-logo alt="Lev Impressions" width="68" height="44"></a>' +
      '<ul class="lev-nav">' + MENU.map(function (m) { return '<li><button data-mega="' + m.key + '" data-nav-cat="' + m.cat + '" aria-expanded="false">' + m.label + chev + "</button></li>"; }).join("") +
        '<li><a data-link="catalog" href="#">All products</a></li><li><a data-link="home#how" href="#">How it works</a></li><li><a data-link="home#reviews" href="#">Reviews</a></li></ul>' +
      '<div class="lev-header__right">' +
        '<a class="lev-phone" href="tel:+13057055486">' + ico.phone + "<span>(305) 705-5486</span></a>" +
        '<a class="lev-iconlink" href="#" aria-label="Search">' + ico.search + "</a>" +
        '<a class="lev-iconlink" href="#" aria-label="Cart">' + ico.cart + "</a>" +
        '<a class="btn btn--accent btn--sm" data-link="studio" href="#">Start designing</a>' +
        '<button class="lev-iconlink lev-burger" data-drawer-open aria-label="Menu">' + ico.menu + "</button>" +
      "</div></div>" +
      '<div class="lev-mega"><div class="lev-mega__box">' + MENU.map(function (m) {
        return '<div class="lev-mega__pane" data-pane="' + m.key + '"><div class="lev-mega__links" data-cat-links="' + m.cat + '"><h3 class="t-h3"><span>' + m.title + '</span><em class="lev-mega__count" data-cat-count="' + m.cat + '"></em></h3></div>' +
          '<div class="lev-mega__feature"><a class="lev-feature" data-cat-feature="' + m.cat + '" href="#"><strong>Most ordered</strong><span></span></a>' +
          '<a class="lev-feature lev-studiocard" data-cat-studio="' + m.cat + '" href="#">' + mini(m.key) + '<strong>Design it yourself</strong><span class="lev-studiocard__go">Open the studio ' + ico.arrow + "</span></a></div></div>";
      }).join("") + "</div></div></header>" +
    '<div class="lev-scrim"></div>' +
    '<div class="lev-drawer" aria-label="Menu"><div class="lev-drawer__top"><a class="lev-logo" data-link="home" href="#"><img data-logo alt="Lev Impressions" width="60" height="38"></a><button class="lev-iconlink" data-drawer-close aria-label="Close menu">' + ico.close + "</button></div>" +
      '<div class="lev-drawer__body">' + MENU.map(function (m) { return "<details><summary>" + m.cat + chev + '</summary><div data-cat-drawer="' + m.cat + '"></div></details>'; }).join("") +
      '<div class="lev-drawer__plain"><a data-link="catalog" href="#">All products</a><a data-link="home#how" href="#">How it works</a><a data-link="home#reviews" href="#">Reviews</a></div></div>' +
      '<div class="lev-drawer__foot"><a class="btn btn--accent btn--block btn--lg" data-link="studio" href="#">Start designing</a><a class="btn btn--ghost btn--block" href="tel:+13057055486">Call (305) 705-5486</a></div></div>';

  var fico = {
    mail: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>',
    pin: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    insta: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="0.6" fill="currentColor"/></svg>',
    up: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5m-6 6 6-6 6 6"/></svg>',
    star: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.5 2.9 6.2 6.8.8-5 4.6 1.3 6.700-6-3.4-6 3.4 1.3-6.700-5-4.6 6.8-.8Z"/></svg>'
  };
  var MAP = "https://www.google.com/maps/search/?api=1&query=20815+NE+16th+Ave+Unit+B18+Miami+FL+33179";
  var footer =
    '<footer class="lev-footer"><div class="lev-line" aria-hidden="true"><i></i></div><div class="wrap lev-footer__top">' +
      '<div class="lev-footer__brand reveal"><a class="lev-logo" data-link="home" href="#" aria-label="Lev Impressions home"><img data-logo alt="Lev Impressions" width="68" height="44"></a>' +
        '<p class="lev-footer__big">Made with heart<br>in Miami.</p><p class="lev-footer__lead">Custom apparel, printed and embroidered by a family-owned shop.</p>' +
        '<ul class="lev-footer__proof"><li><i>' + fico.star + "</i>5.0 from 94 Google reviews</li><li>Family owned, 18+ years</li><li>Free delivery on every order</li></ul></div>" +
      '<div class="lev-footer__col reveal" style="--reveal-delay:60ms"><h4>Shop</h4><ul>' + MENU.map(function (m) { return '<li><a data-link="catalog:' + m.cat + '" data-dot="' + m.key + '" href="#">' + m.cat + "</a></li>"; }).join("") + '<li><a data-link="catalog" href="#">All products</a></li></ul></div>' +
      '<div class="lev-footer__col reveal" style="--reveal-delay:120ms"><h4>Help</h4><ul><li><a data-link="home#how" href="#">How it works</a></li><li><a data-link="home#faq" href="#">Questions</a></li><li><a data-link="home#reviews" href="#">Reviews</a></li><li><a data-link="studio" href="#">Design studio</a></li></ul></div>' +
      '<div class="lev-footer__col reveal" style="--reveal-delay:180ms"><h4>Contact</h4><ul class="lev-footer__contact">' +
        '<li><a href="tel:+13057055486"><i>' + ico.phone + "</i><span>(305) 705-5486</span></a></li>" +
        '<li><a href="mailto:Support@levimpressions.com"><i>' + fico.mail + "</i><span>Support@levimpressions.com</span></a></li>" +
        '<li><a href="' + MAP + '" target="_blank" rel="noopener"><i>' + fico.pin + "</i><span>20815 NE 16th Ave, Unit B18<br>Miami, FL 33179</span></a></li>" +
        '<li><a href="https://www.instagram.com/levimpressions/" target="_blank" rel="noopener"><i>' + fico.insta + "</i><span>@levimpressions</span></a></li></ul></div>" +
    '</div><div class="lev-footer__mark" aria-hidden="true"><div class="lev-footer__word"><span>LEV IMPRESSIONS</span><span class="lev-footer__glow">LEV IMPRESSIONS</span></div>' +
      '<div class="lev-footer__heart" data-heart><i class="lev-footer__heartimg"></i>' + [["#f2a51f", -14, 12, 0.11], ["#a0409a", -24, 26, 0.07], ["#e2609f", -12, 34, 0.13], ["#35b3d3", 46, 6, 0.09], ["#f2a51f", 58, 24, 0.06]].map(function (d, i) { return '<b style="--c:' + d[0] + ";left:" + d[1] + "%;top:" + d[2] + "%;width:" + d[3] + "em;height:" + d[3] + "em;--i:" + i + '"></b>'; }).join("") + "</div></div>" +
    '<div class="wrap lev-footer__base"><span>© Lev Impressions</span><span>Prototype build.</span><span class="lev-footer__clock" data-miami hidden><i></i><em></em></span><a class="lev-footer__up" href="#" data-top>Back to top ' + fico.up + "</a></div></footer>";

  document.addEventListener("DOMContentLoaded", function () {
    document.body.insertAdjacentHTML("afterbegin", header);
    document.body.insertAdjacentHTML("beforeend", footer);
    window.LevSite.init();
    footerLife();
    document.querySelectorAll("[data-top]").forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); }); });
    resolveLinks(document);
    var D = window.LEV_DATA; if (!D) return;
    // mark the category we are in
    var here = new URLSearchParams(location.search).get("cat");
    document.querySelectorAll("[data-nav-cat]").forEach(function (b) { if (b.getAttribute("data-nav-cat") === here) b.classList.add("is-here"); });

    Promise.all([fetch(D.index).then(function (r) { return r.json(); }), fetch(D.pricing).then(function (r) { return r.json(); })]).then(function (d) {
      var items = d[0].items, pricing = d[1], P = window.LevPricing;
      MENU.forEach(function (m) {
        var list = items.filter(function (i) { return i.category === m.cat; });
        var subs = []; list.forEach(function (i) { if (i.sub && subs.indexOf(i.sub) < 0) subs.push(i.sub); });
        var count = function (s) { return list.filter(function (i) { return i.sub === s; }).length; };
        var plural = function (n) { return n + (n === 1 ? " style" : " styles"); };
        var links = document.querySelector('[data-cat-links="' + m.cat + '"]');
        document.querySelector('[data-cat-count="' + m.cat + '"]').textContent = plural(list.length);
        links.insertAdjacentHTML("beforeend",
          '<a data-link="catalog:' + m.cat + '" href="#"><strong>All ' + m.title.replace("Custom ", "").toLowerCase() + "</strong><span>Everything in one place</span></a>" +
          subs.map(function (s) { return '<a data-link="catalog:' + m.cat + "|" + s + '" href="#"><strong>' + s + "</strong><span>" + (SUB_NOTE[s] ? SUB_NOTE[s] + " · " : "") + plural(count(s)) + "</span></a>"; }).join(""));
        document.querySelector('[data-cat-drawer="' + m.cat + '"]').innerHTML =
          '<a data-link="catalog:' + m.cat + '" href="#">All ' + m.title.replace("Custom ", "").toLowerCase() + " (" + list.length + ")</a>" + subs.map(function (s) { return '<a data-link="catalog:' + m.cat + "|" + s + '" href="#">' + s + " (" + count(s) + ")</a>"; }).join("");
        var top = list[0], feature = document.querySelector('[data-cat-feature="' + m.cat + '"]'), studio = document.querySelector('[data-cat-studio="' + m.cat + '"]');
        if (top) {
          var v = top.firstView || { key: "front" };
          var from = P ? P.money(P.quote(pricing, { blank: top.price, method: top.methods[0], qty: 50, locations: [{ key: v.key, tier: v.maxTier === "s" ? "s" : "m" }] }).unit) : "";
          feature.href = D.url.product(top.sku, top.colours[0].code);
          if (top.cardCrop) {
            // Caps and bags sit small in the maker's tall picture. Show only the box
            // around the item: the drawing below fits that box to the card, whatever its size.
            var c = top.cardCrop, pad = 0.04;
            var box = [(c.x - c.w * pad) * 12, (c.y - c.h * pad) * 18, c.w * (1 + 2 * pad) * 12, c.h * (1 + 2 * pad) * 18].map(function (n) { return n.toFixed(0); }).join(" ");
            feature.insertAdjacentHTML("afterbegin", '<div class="lev-feature__pic"><svg viewBox="' + box + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><image href="' + top.base + top.thumb + '" width="1200" height="1800"/></svg></div>');
          } else feature.insertAdjacentHTML("afterbegin", '<img src="' + top.base + top.thumb + '" alt="" loading="lazy">');
          feature.querySelector("strong").textContent = top.title;
          feature.querySelector(":scope > span").textContent = "Most ordered" + (from ? " · from " + from + " each" : "");
          studio.href = D.url.studio(top.sku, top.colours[0].code);
        }
      });
      resolveLinks(document);
    });
  });

  /* The footer's living parts: the bold line on top and the big wordmark light up
     in the logo's colours under the pointer, the heart leans toward the pointer and throws paint dots when
     clicked, and a small clock shows the time in Miami. All of it is decoration: the footer works without it. */
  function footerLife() {
    var f = document.querySelector(".lev-footer"); if (!f) return;
    var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


    var clock = f.querySelector("[data-miami]");
    if (clock) {
      var tick = function () { try { clock.querySelector("em").textContent = "Miami time " + new Date().toLocaleTimeString("en-US", { timeZone: "America/New_York", hour: "numeric", minute: "2-digit" }); clock.hidden = false; } catch (e) {} };
      tick(); setInterval(tick, 30000);
    }
    if (calm) return;

    var word = f.querySelector(".lev-footer__word"), line = f.querySelector(".lev-line"), heart = f.querySelector("[data-heart]"), raf = 0, ev = null;
    f.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return; ev = e; if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0; var w = word.getBoundingClientRect(), h = heart.getBoundingClientRect();
        word.classList.add("is-live"); line.classList.add("is-live"); line.style.setProperty("--fx", (ev.clientX - line.getBoundingClientRect().left) + "px"); word.style.setProperty("--fx", (ev.clientX - w.left) + "px"); word.style.setProperty("--fy", (ev.clientY - w.top) + "px");
        var dx = (ev.clientX - (h.left + h.width / 2)) / innerWidth, dy = (ev.clientY - (h.top + h.height / 2)) / innerHeight;
        heart.style.setProperty("--hx", (dx * 14).toFixed(1) + "px"); heart.style.setProperty("--hy", (dy * 12).toFixed(1) + "px"); heart.style.setProperty("--hr", (dx * 9).toFixed(1) + "deg");
      });
    }, { passive: true });
    f.addEventListener("pointerleave", function () { word.classList.remove("is-live"); line.classList.remove("is-live"); ["--hx", "--hy", "--hr"].forEach(function (k) { heart.style.removeProperty(k); }); });

    var paint = ["#f2a51f", "#ff5a1f", "#ff2d92", "#a06bff", "#35b3d3", "#e2609f"];
    heart.addEventListener("click", function () {
      heart.classList.remove("is-beat"); void heart.offsetWidth; heart.classList.add("is-beat");
      for (var i = 0; i < 14; i++) {
        var d = document.createElement("u"), ang = Math.random() * Math.PI * 2, far = 60 + Math.random() * 110, size = 5 + Math.random() * 9;
        d.style.cssText = "--tx:" + (Math.cos(ang) * far).toFixed(0) + "px;--ty:" + (Math.sin(ang) * far - 40).toFixed(0) + "px;width:" + size.toFixed(0) + "px;height:" + size.toFixed(0) + "px;background:" + paint[i % paint.length];
        heart.appendChild(d); setTimeout(function (n) { n.remove(); }, 1000, d);
      }
    });
  }

  /* Turns data-link="catalog:Shirts|Polo Shirts", "catalog", "studio", "studio:PC54", "product:PC54", "home" into real addresses. */
  function resolveLinks(root) {
    var D = window.LEV_DATA; if (!D) return;
    root.querySelectorAll("img[data-logo]").forEach(function (im) { if (!im.getAttribute("src")) im.src = D.logo; });
    root.querySelectorAll("[data-link]").forEach(function (a) {
      var parts = a.getAttribute("data-link").split(":"), kind = parts[0], arg = parts.slice(1).join(":");
      if (kind.indexOf("home#") === 0) a.href = D.url.home + kind.slice(4);
      else if (kind === "home") a.href = D.url.home;
      else if (kind === "catalog") { var cs = arg.split("|"); a.href = D.url.catalog(cs[0], cs[1]); }
      else if (kind === "studio") a.href = D.url.studio(arg || "PC54");
      else if (kind === "product") a.href = D.url.product(arg || "PC54");
    });
  }
  window.LevResolveLinks = resolveLinks;
})();
