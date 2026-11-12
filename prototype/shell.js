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

  var header =
    '<div class="lev-bar" aria-hidden="true"><div class="lev-bar__track">' + tick + tick + "</div></div>" +
    '<header class="lev-header"><div class="wrap lev-header__in">' +
      '<a class="lev-logo" data-link="home" href="#" aria-label="Lev Impressions home"><img src="../theme/assets/lev-logo.png" alt="Lev Impressions" width="68" height="44"></a>' +
      '<ul class="lev-nav">' + MENU.map(function (m) { return '<li><button data-mega="' + m.key + '" data-nav-cat="' + m.cat + '" aria-expanded="false">' + m.label + chev + "</button></li>"; }).join("") +
        '<li><a data-link="catalog" href="#">All products</a></li><li><a href="index.html#how">How it works</a></li><li><a href="index.html#reviews">Reviews</a></li></ul>' +
      '<div class="lev-header__right">' +
        '<a class="lev-phone" href="tel:+13057055486">' + ico.phone + "<span>(305) 705-5486</span></a>" +
        '<a class="lev-iconlink" href="#" aria-label="Search">' + ico.search + "</a>" +
        '<a class="lev-iconlink" href="#" aria-label="Cart">' + ico.cart + "</a>" +
        '<a class="btn btn--accent btn--sm" data-link="studio" href="#">Start designing</a>' +
        '<button class="lev-iconlink lev-burger" data-drawer-open aria-label="Menu">' + ico.menu + "</button>" +
      "</div></div>" +
      '<div class="lev-mega"><div class="lev-mega__box">' + MENU.map(function (m) {
        return '<div class="lev-mega__pane" data-pane="' + m.key + '"><div class="lev-mega__links" data-cat-links="' + m.cat + '"><h3 class="t-h3">' + m.title + "</h3></div>" +
          '<div class="lev-mega__feature"><a class="lev-feature" data-cat-feature="' + m.cat + '" href="#"><strong>Most ordered</strong><span></span></a>' +
          '<a class="lev-feature lev-feature--ink" data-cat-studio="' + m.cat + '" href="#"><strong>Design it<br>yourself.</strong><span>Open the studio ' + ico.arrow + "</span></a></div></div>";
      }).join("") + "</div></div></header>" +
    '<div class="lev-scrim"></div>' +
    '<div class="lev-drawer" aria-label="Menu"><div class="lev-drawer__top"><a class="lev-logo" data-link="home" href="#"><img src="../theme/assets/lev-logo.png" alt="Lev Impressions" width="60" height="38"></a><button class="lev-iconlink" data-drawer-close aria-label="Close menu">' + ico.close + "</button></div>" +
      '<div class="lev-drawer__body">' + MENU.map(function (m) { return "<details><summary>" + m.cat + chev + '</summary><div data-cat-drawer="' + m.cat + '"></div></details>'; }).join("") +
      '<div class="lev-drawer__plain"><a data-link="catalog" href="#">All products</a><a href="index.html#how">How it works</a><a href="index.html#reviews">Reviews</a></div></div>' +
      '<div class="lev-drawer__foot"><a class="btn btn--accent btn--block btn--lg" data-link="studio" href="#">Start designing</a><a class="btn btn--ghost btn--block" href="tel:+13057055486">Call (305) 705-5486</a></div></div>';

  var footer =
    '<footer class="lev-footer"><div class="wrap lev-footer__top">' +
      '<div class="stack" style="--gap:18px"><p class="lev-footer__big">Made with heart<br>in Miami.</p><div class="heart-rule" style="width:120px"></div><p style="color:rgba(255,255,255,.7);max-width:34ch">Custom apparel, printed and embroidered by a family-owned shop.</p></div>' +
      "<div><h4>Shop</h4><ul>" + MENU.map(function (m) { return '<li><a data-link="catalog:' + m.cat + '" href="#">' + m.cat + "</a></li>"; }).join("") + '<li><a data-link="catalog" href="#">All products</a></li></ul></div>' +
      '<div><h4>Help</h4><ul><li><a href="index.html#how">How it works</a></li><li><a href="index.html#faq">Questions</a></li><li><a href="index.html#reviews">Reviews</a></li><li><a data-link="studio" href="#">Design studio</a></li></ul></div>' +
      '<div><h4>Contact</h4><ul><li><a href="tel:+13057055486">(305) 705-5486</a></li><li><a href="mailto:Support@levimpressions.com">Support@levimpressions.com</a></li><li>20815 NE 16th Ave, Unit B18<br>Miami, FL 33179</li></ul></div>' +
    '</div><div class="wrap lev-footer__base"><span>© Lev Impressions</span><span>Prototype build.</span></div></footer>';

  document.addEventListener("DOMContentLoaded", function () {
    document.body.insertAdjacentHTML("afterbegin", header);
    document.body.insertAdjacentHTML("beforeend", footer);
    window.LevSite.init();
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
        links.insertAdjacentHTML("beforeend",
          '<a data-link="catalog:' + m.cat + '" href="#"><strong>All ' + m.title.replace("Custom ", "").toLowerCase() + "</strong><span>" + plural(list.length) + "</span></a>" +
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

  /* Turns data-link="catalog:Shirts|Polo Shirts", "catalog", "studio", "studio:PC54", "product:PC54", "home" into real addresses. */
  function resolveLinks(root) {
    var D = window.LEV_DATA; if (!D) return;
    root.querySelectorAll("[data-link]").forEach(function (a) {
      var parts = a.getAttribute("data-link").split(":"), kind = parts[0], arg = parts.slice(1).join(":");
      if (kind === "home") a.href = D.url.home;
      else if (kind === "catalog") { var cs = arg.split("|"); a.href = D.url.catalog(cs[0], cs[1]); }
      else if (kind === "studio") a.href = D.url.studio(arg || "PC54");
      else if (kind === "product") a.href = D.url.product(arg || "PC54");
    });
  }
  window.LevResolveLinks = resolveLinks;
})();
