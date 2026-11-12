/* Lev Impressions pricing engine.
   One place that knows the rules, used by the listing-page calculator and the
   design studio so both always show the same number.

   Rules (Nasir, 2026-11-12):
   - unit price  = (blank + decoration for every decorated location) x (1 - bulk discount)
   - total       = quantity x unit price + setup + size upcharges
   - the bulk discount covers the blank and the decoration, not setup or upcharges
   - decoration and setup prices come from the master sheet (config/pricing.json)
   - setup is charged once per decorated location
*/
(function (root) {
  "use strict";

  function round2(n) { return Math.round((n + Number.EPSILON) * 100) / 100; }

  function money(n, currency) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: currency || "USD" }).format(n || 0);
  }

  function tierForQty(cfg, qty) {
    var tiers = cfg.discountTiers, pick = tiers[0], next = null;
    for (var i = 0; i < tiers.length; i++) {
      if (qty >= tiers[i].from) pick = tiers[i];
      else { next = tiers[i]; break; }
    }
    return { pct: pick.pct, from: pick.from, next: next };
  }

  /* Smallest price tier a design of w x h inches fits in. Either way up counts:
     a 16 x 12 design fits the 12 x 16 tier. Returns null when it fits none. */
  function tierForSize(cfg, method, w, h, maxKey) {
    var tiers = (cfg.methods[method] || {}).tiers || [];
    var eps = 0.02;
    for (var i = 0; i < tiers.length; i++) {
      var t = tiers[i];
      var fits = (w <= t.w + eps && h <= t.h + eps) || (w <= t.h + eps && h <= t.w + eps);
      if (fits) return t;
      if (maxKey && t.key === maxKey) return t;
    }
    return tiers.length ? null : null;
  }

  function findTier(cfg, method, key) {
    var tiers = (cfg.methods[method] || {}).tiers || [];
    for (var i = 0; i < tiers.length; i++) if (tiers[i].key === key) return tiers[i];
    return null;
  }

  /* input:
       blank       number, the item's selling price
       method      "dtf" | "emb"
       sizes       { S: 10, "2XL": 2 }   or   qty: 50
       upcharges   { "2XL": 2.13, "3XL": 3.54 }
       locations   [ { key: "front", label: "Front", tier: "m" } ]
       addons      [ "puff" ]  (embroidery add-ons, charged per piece)
  */
  function quote(cfg, input) {
    var sizes = input.sizes || {};
    var qty = 0, upcharge = 0, k;
    var upcharges = input.upcharges || {};
    if (input.sizes) {
      for (k in sizes) {
        var n = Math.max(0, parseInt(sizes[k], 10) || 0);
        qty += n;
        if (upcharges[k]) upcharge += n * upcharges[k];
      }
    } else {
      qty = Math.max(0, parseInt(input.qty, 10) || 0);
    }

    var method = input.method || "dtf";
    var lines = [], deco = 0, setup = 0;
    (input.locations || []).forEach(function (loc) {
      if (!loc || !loc.tier) return;
      var t = findTier(cfg, method, loc.tier);
      if (!t) return;
      deco += t.price;
      setup += t.setup;
      lines.push({ key: loc.key, label: loc.label || loc.key, tier: t.key, tierLabel: t.label, size: t.size, price: t.price, setup: t.setup });
    });
    var addonLines = [];
    var addonDefs = (cfg.methods[method] || {}).addons || [];
    (input.addons || []).forEach(function (key) {
      for (var i = 0; i < addonDefs.length; i++) {
        if (addonDefs[i].key === key) {
          deco += addonDefs[i].price; setup += addonDefs[i].setup;
          addonLines.push({ key: key, label: addonDefs[i].label, price: addonDefs[i].price, setup: addonDefs[i].setup });
        }
      }
    });

    var blank = Number(input.blank) || 0;
    var tier = tierForQty(cfg, qty);
    var rules = cfg.discountAppliesTo || { blank: true, decoration: true };
    var factor = 1 - tier.pct / 100;
    var unitBefore = round2(blank + deco);
    var unit = round2((rules.blank ? blank * factor : blank) + (rules.decoration ? deco * factor : deco));
    var goods = round2(qty * unit);
    var total = round2(goods + setup + upcharge);
    var listTotal = round2(qty * unitBefore + setup + upcharge);

    var min = input.min || cfg.minQty || 1;
    var nextTier = null;
    if (tier.next) {
      var nf = 1 - tier.next.pct / 100;
      var nUnit = round2((rules.blank ? blank * nf : blank) + (rules.decoration ? deco * nf : deco));
      nextTier = { from: tier.next.from, pct: tier.next.pct, add: tier.next.from - qty, unit: nUnit };
    }

    return {
      qty: qty,
      min: min,
      meetsMin: qty >= min,
      method: method,
      blank: blank,
      decoration: round2(deco),
      discountPct: tier.pct,
      unitBefore: unitBefore,
      unit: unit,
      goods: goods,
      setup: round2(setup),
      upcharge: round2(upcharge),
      total: total,
      listTotal: listTotal,
      saved: round2(listTotal - total),
      perPiece: qty ? round2(total / qty) : 0,
      locations: lines,
      addons: addonLines,
      nextTier: nextTier
    };
  }

  /* Delivery estimate from business days (weekends skipped). */
  function addBusinessDays(from, days) {
    var d = new Date(from.getTime());
    while (days > 0) { d.setDate(d.getDate() + 1); var w = d.getDay(); if (w !== 0 && w !== 6) days--; }
    return d;
  }
  function delivery(cfg, from) {
    var lt = cfg.leadTime || { productionDays: 3, shippingDays: 6 };
    var start = from || new Date();
    var total = lt.productionDays + lt.shippingDays;
    return { earliest: addBusinessDays(start, total - 2), latest: addBusinessDays(start, total) };
  }
  function shortDate(d) { return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }); }

  var api = { quote: quote, tierForQty: tierForQty, tierForSize: tierForSize, findTier: findTier, money: money, round2: round2, delivery: delivery, shortDate: shortDate };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.LevPricing = api;
})(typeof window !== "undefined" ? window : globalThis);
