/* Lev Impressions product cards, shared by the home page and the catalog page.
   A card is drawn from one row of the catalog index, so a new item shows up
   everywhere as soon as it is in that list. */
(function () {
  "use strict";
  var P = window.LevPricing;
  var ARROW = '<svg class="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* Price of one piece when ordering 50 with the item's usual first decoration. */
  function from(item, pricing) {
    var v = item.firstView || { key: "front" };
    return P.quote(pricing, { blank: item.price, method: item.methods[0], qty: 50, locations: [{ key: v.key, tier: v.maxTier === "s" ? "s" : "m" }] }).unit;
  }

  function card(item, pricing, urls, opts) {
    opts = opts || {};
    var colour = item.colours[0];
    var a = el("article", "pcard" + (opts.reveal ? " reveal" : ""));
    if (opts.i != null) a.style.setProperty("--i", opts.i);
    var link = el("a", "pcard__img");
    link.href = urls.product(item.sku, colour.code);
    link.setAttribute("aria-label", item.title);
    var img = el("img"); img.src = item.base + item.thumb; img.alt = item.title + " in " + colour.name; img.loading = "lazy"; img.width = 600; img.height = 750;
    var hover = el("img"); hover.src = item.base + item.hover; hover.alt = ""; hover.loading = "lazy";
    link.appendChild(img);
    if (item.cardCrop) {
      // Caps and bags sit small and off-centre in the maker's tall picture: fit the
      // whole item in the card and centre it (card is 4:5, picture is 2:3).
      var c = item.cardCrop, z = Math.min(100 / c.w, (100 / 1.2) / c.h) * 0.86;
      link.classList.add("pcard__img--fit");
      img.style.width = (100 * z).toFixed(1) + "%";
      img.style.left = (50 - (c.x + c.w / 2) * z).toFixed(2) + "%";
      img.style.top = (50 - (c.y + c.h / 2) * 1.2 * z).toFixed(2) + "%";
    } else link.appendChild(hover);
    var tags = el("div", "pcard__tags");
    if (item.methods.indexOf("emb") >= 0) tags.appendChild(el("span", "tag", "Print or embroidery"));
    // Hot sellers get a small moving flame (no words; "Hot selling" is its hidden description).
    // Which items are hot is set in catalog/_items.json ("mark": "hot").
    var D = window.LEV_DATA || {};
    if (item.mark === "hot" && D.fire) {
      var hot = el("span", "pcard__hot", '<img alt="Hot selling" title="Hot selling" width="34" height="34">'); hot.firstChild.src = D.fire;
      tags.insertBefore(hot, tags.firstChild);
    } else if (opts.badge) tags.appendChild(el("span", "tag tag--accent", esc(opts.badge)));
    link.appendChild(tags);
    var cta = el("a", "btn btn--accent btn--sm btn--block pcard__cta", "<span>Design it</span>" + ARROW);
    cta.href = urls.studio(item.sku, colour.code);
    var wrap = el("div", "pcard__media"); wrap.appendChild(link); wrap.appendChild(cta);

    var dots = el("div", "pcard__dots");
    item.colours.slice(0, 7).forEach(function (c, n) {
      var b = el("button", n === 0 ? "is-on" : ""); b.type = "button"; b.title = c.name; b.setAttribute("aria-label", c.name); b.style.setProperty("--c", c.hex);
      b.addEventListener("click", function () {
        if (!c.thumb) return;
        img.src = item.base + c.thumb; img.alt = item.title + " in " + c.name; hover.style.display = "none";
        link.href = urls.product(item.sku, c.code); cta.href = urls.studio(item.sku, c.code);
        dots.querySelectorAll("button").forEach(function (x) { x.classList.toggle("is-on", x === b); });
      });
      dots.appendChild(b);
    });
    if (item.colourCount > 7) dots.appendChild(el("span", "t-micro t-muted", "+" + (item.colourCount - 7)));

    var meta = el("div", "pcard__meta");
    meta.innerHTML = '<span class="t-micro t-muted">' + esc(item.brand) + " · " + esc(item.sku) + '</span><a class="pcard__title" href="' + urls.product(item.sku, colour.code) + '">' + esc(item.title) + "</a>" +
      '<span class="pcard__price"><strong class="t-num">' + P.money(from(item, pricing)) + '</strong> <span class="t-small t-muted">each for 50, decorated</span></span>';
    meta.appendChild(dots);
    a.appendChild(wrap); a.appendChild(meta);
    return a;
  }

  window.LevCards = { card: card, from: from };
})();
