/* Lev Impressions sample mock-ups: a sample design drawn onto an item's picture,
   placed inside that item's real print area. Used on the home page (hero cards,
   "who we print for") so every card shows a real item from the catalog. */
(function () {
  "use strict";

  /* Each design draws itself on a 100-wide strip that is `h` tall; it is then
     scaled to fit the print area. `ink` is the main colour, `pop` the accent. */
  var DESIGNS = {
    varsity: { h: 46, draw: function (ink, pop) { return t(50, 15, "RIVERSIDE", "Graduate", 15, ink) + t(50, 31, "HIGH", "Graduate", 15, ink) + t(50, 43, "CLASS OF 2027", "Anton", 7.5, pop, 1.2); } },
    script: { h: 44, draw: function (ink, pop) { return t(50, 17, "Miami Beach", "Pacifico", 17, ink) + t(50, 33, "RUN CLUB", "Anton", 13, pop, 1.2) + '<path d="M22 40q7-6 14 0t14 0 14 0 14 0" fill="none" stroke="' + ink + '" stroke-width="2.2" stroke-linecap="round"/>'; } },
    reunion: { h: 52, draw: function (ink, pop) { return t(50, 20, "COHEN", "Anton", 22, ink) + t(50, 32, "FAMILY REUNION", "Anton", 8.5, ink, 1.6) + t(50, 49, "2026", "Pacifico", 16, pop); } },
    climbing: { h: 46, draw: function (ink, pop) { return t(50, 16, "BROOKLYN", "Anton", 18, ink, 0.6) + '<rect x="14" y="21" width="72" height="1.6" fill="' + pop + '"/>' + t(50, 32, "CLIMBING CO.", "Anton", 9, ink, 2) + t(50, 43, "EST. 2026", "Graduate", 6.5, pop, 1); } },
    team: { h: 62, draw: function (ink, pop) { return t(50, 16, "TIGERS", "Graduate", 17, ink, 1) + t(50, 56, "21", "Graduate", 42, pop); } },
    swim: { h: 40, draw: function (ink, pop) { return t(50, 18, "Lakeside", "Pacifico", 19, ink) + t(50, 34, "SWIM TEAM", "Anton", 11, pop, 2); } },
    monogram: { h: 30, draw: function (ink, pop) { return t(50, 25, "MBRC", "Graduate", 27, ink, 1) + '<rect x="12" y="28" width="76" height="2" fill="' + pop + '"/>'; } },
    cursive: { h: 34, draw: function (ink) { return t(50, 26, "Lev", "Pacifico", 30, ink); } },
    supply: { h: 36, draw: function (ink, pop) { return t(50, 16, "COAST", "Anton", 17, ink, 2) + t(50, 32, "SUPPLY CO.", "Anton", 10, pop, 2.4); } },
    market: { h: 64, draw: function (ink, pop) { return t(50, 20, "FARMERS", "Anton", 21, ink, 0.6) + t(50, 42, "MARKET", "Anton", 21, pop, 2.2) + t(50, 58, "every saturday", "Pacifico", 11, ink); } },
    bookclub: { h: 52, draw: function (ink, pop) { return t(50, 22, "Book", "Pacifico", 26, ink) + t(50, 46, "CLUB", "Anton", 24, pop, 4); } },
    small: { h: 68, draw: function (ink, pop) { return t(50, 22, "SHOP", "Anton", 25, ink, 3) + t(50, 46, "SMALL", "Anton", 25, ink, 1.4) + '<path d="M50 56c-5-4-8-6-8-9a4 4 0 0 1 8-1 4 4 0 0 1 8 1c0 3-3 5-8 9Z" fill="' + pop + '" transform="translate(0 9)"/>'; } },
    electric: { h: 50, draw: function (ink, pop) { return '<path d="M53 1 34 27h13l-4 17 20-27H50Z" fill="' + pop + '"/>' + t(50, 49, "ORTIZ ELECTRIC", "Anton", 12.5, ink, 0.6); } },
    fest: { h: 50, draw: function (ink, pop) { return t(50, 16, "SUMMER", "Anton", 19, ink, 2) + t(50, 36, "Fest", "Pacifico", 22, pop) + t(50, 47, "JULY 12 · BAYFRONT PARK", "Anton", 5.6, ink, 1); } },
    hope: { h: 46, draw: function (ink, pop) { return t(50, 16, "Walk for", "Pacifico", 15, ink) + t(50, 35, "HOPE", "Anton", 24, pop, 3) + t(50, 44, "5K · 2026", "Graduate", 6, ink, 1); } },
    brand: { h: 30, draw: function (ink, pop) { return t(50, 18, "NORTHLINE", "Anton", 15, ink, 3) + '<rect x="34" y="23" width="32" height="2" fill="' + pop + '"/>'; } },
    creator: { h: 36, draw: function (ink, pop) { return t(50, 20, "@yourname", "Pacifico", 17, ink) + t(50, 33, "OFFICIAL MERCH", "Anton", 6.5, pop, 2); } },
    staff: { h: 26, draw: function (ink, pop) { return t(50, 14, "CAFÉ LUNA", "Anton", 13, ink, 1.6) + t(50, 24, "STAFF", "Graduate", 7, pop, 3); } }
  };

  function t(x, y, text, font, size, fill, spacing) {
    return '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-family="' + font + '" font-size="' + size + '" fill="' + fill + '"' + (spacing ? ' letter-spacing="' + spacing + '"' : "") + ">" + text + "</text>";
  }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  function pick(product, wanted) {
    var list = product.colours.filter(function (c) { return c.designable; });
    for (var i = 0; i < (wanted || []).length; i++) for (var j = 0; j < list.length; j++) if (list[j].code === wanted[i] || list[j].name === wanted[i]) return list[j];
    return list[0] || product.colours[0];
  }

  /* opts: { colour: code or name (or a list to try in order), design: key, view: view key (default the first) } */
  function inner(product, opts) {
    var view = product.views.filter(function (v) { return v.key === opts.view; })[0] || product.views[0];
    var colour = pick(product, [].concat(opts.colour || []));
    var a = view.area, d = DESIGNS[opts.design] || DESIGNS.varsity;
    // Two-tone caps (black front, white mesh) average out to a mid colour, so a
    // card can say outright that the decorated part is dark: opts.onDark = true.
    var dark = opts.onDark != null ? opts.onDark : colour.dark;
    var ink = dark ? "#ffffff" : "#0e0e10", pop = dark ? "#ffd60a" : "#e8401a";
    var H = 100 * (a.h * 18) / (a.w * 12);                        // height of the area on a 100-wide strip
    var s = Math.min(1, H / d.h) * (H / d.h < 1 ? 0.96 : 1);
    var tall = product.kind !== "bag" && product.kind !== "cap" && H > d.h * 1.6;   // on bags and caps the design sits in the middle
    var tx = (100 - 100 * s) / 2, ty = tall ? H * 0.07 : (H - d.h * s) / 2;
    // The 2:3 picture sits inside a 4:5 card. Small items (caps, chest logos) are
    // zoomed so the decorated spot is easy to see.
    var z, left, top, c = view.crop;
    if (c && !view.mirror && (product.kind === "cap" || product.kind === "bag")) {
      // Every flat view carries a crop box drawn around the whole item (the studio
      // uses it). For caps and bags the card fits that box
      // in the card and centre it, so the item fills the card and sits in the middle.
      z = opts.zoom || Math.min(100 / c.w, (100 / 1.2) / c.h) * 0.94;
      left = 50 - (c.x + c.w / 2) * z;
      top = 50 - (c.y + c.h / 2) * 1.2 * z;
    } else {
      z = opts.zoom || (view.maxTier === "s" ? 1.35 : 1);
      left = clamp(50 - (a.x + a.w / 2) * z, -(100 * z - 100), 0);
      top = clamp(46 - (a.y + a.h / 2) * 1.2 * z, -(120 * z - 100), 0);
    }
    var box = document.createElement("div"); box.className = "mock__in";
    box.innerHTML = '<img alt="" width="1200" height="1800" src="' + product.base + colour.images[view.image] + '" style="left:' + left.toFixed(2) + "%;top:" + top.toFixed(2) + "%;width:" + (100 * z).toFixed(1) + '%">' +
      '<svg viewBox="0 0 100 ' + H.toFixed(2) + '" style="left:' + (left + a.x * z).toFixed(2) + "%;width:" + (a.w * z).toFixed(2) + "%;top:" + (top + a.y * 1.2 * z).toFixed(2) + "%;height:" + (a.h * 1.2 * z).toFixed(2) + '%"><g transform="translate(' + tx.toFixed(2) + " " + ty.toFixed(2) + ") scale(" + s.toFixed(3) + ')">' + d.draw(ink, pop) + "</g></svg>";
    return { el: box, colour: colour };
  }

  window.LevMock = { inner: inner, pick: pick, designs: Object.keys(DESIGNS) };
})();
