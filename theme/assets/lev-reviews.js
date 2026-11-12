/* Lev Impressions reviews block: the Google rating, a wall of real customer and
   shop photos, and a strip of Instagram posts. The photos come from one list
   (media/gallery.json in the prototype), so adding a photo is one line there.

   The written Google reviews themselves are not copied here: on the store the
   live Google reviews widget fills the slot marked data-google-reviews. */
(function () {
  "use strict";
  var STAR = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2.5 2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17.4l-5.9 3.3 1.3-6.6L2.5 9.5l6.6-.8Z"/></svg>';
  var ARROW = '<svg class="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
  var KIND = { customer: "Customer photo", work: "Our work", shop: "In the shop" };

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function lightbox(photos, base, start) {
    var at = start, box = el("div", "rv-light");
    box.setAttribute("role", "dialog"); box.setAttribute("aria-label", "Photo");
    box.innerHTML = '<button class="rv-light__x" aria-label="Close">&times;</button><button class="rv-light__nav rv-light__nav--prev" aria-label="Previous photo">' + ARROW + '</button><figure><img alt=""><figcaption></figcaption></figure><button class="rv-light__nav rv-light__nav--next" aria-label="Next photo">' + ARROW + "</button>";
    var img = box.querySelector("img"), cap = box.querySelector("figcaption");
    function show(n) { at = (n + photos.length) % photos.length; var p = photos[at]; img.src = base + p.src; img.alt = p.caption; cap.innerHTML = "<strong>" + esc(KIND[p.kind] || "") + "</strong> " + esc(p.caption) + ' <span class="t-num">' + (at + 1) + " / " + photos.length + "</span>"; }
    function close() { box.remove(); document.removeEventListener("keydown", key); document.documentElement.style.overflow = ""; }
    function key(e) { if (e.key === "Escape") close(); if (e.key === "ArrowRight") show(at + 1); if (e.key === "ArrowLeft") show(at - 1); }
    box.addEventListener("click", function (e) { if (e.target === box || e.target.closest(".rv-light__x")) close(); });
    box.querySelector(".rv-light__nav--prev").addEventListener("click", function () { show(at - 1); });
    box.querySelector(".rv-light__nav--next").addEventListener("click", function () { show(at + 1); });
    document.addEventListener("keydown", key);
    document.documentElement.style.overflow = "hidden";
    document.body.appendChild(box); show(start);
    box.querySelector(".rv-light__x").focus();
  }

  /* opts: { gallery: {instagram, items}, base: path before each src, variant: "home" | "product",
             rating: {value, count}, reviewsUrl } */
  function mount(root, opts) {
    var g = opts.gallery, base = opts.base || "", rating = opts.rating || { value: 5, count: 94 };
    var photos = g.items.filter(function (i) { return i.kind !== "instagram"; });
    var insta = g.items.filter(function (i) { return i.kind === "instagram"; });
    var compact = opts.variant === "product";
    if (compact) photos = photos.slice(0, 8);
    root.classList.add("rv"); if (compact) root.classList.add("rv--compact");

    var head = el("div", "rv__head");
    head.innerHTML =
      '<div class="rv__score"><span class="t-eyebrow">Reviews</span>' +
        '<div class="rv__big"><strong class="t-num">' + rating.value.toFixed(1) + '</strong><span class="stars">' + STAR + STAR + STAR + STAR + STAR + "</span></div>" +
        '<p class="rv__count">from <strong class="t-num">' + rating.count + "</strong> Google reviews of our shop</p>" +
        '<a class="btn btn--ghost btn--sm" href="' + (opts.reviewsUrl || "#") + '">Read the reviews ' + ARROW + "</a></div>" +
      '<div class="rv__intro"><h2 class="' + (compact ? "t-h2" : "t-h1") + '">' + (compact ? "Made here, worn by real customers." : "Real orders, real customers.") + "</h2>" +
        '<p class="t-lead">Photos from our shop floor and from the people who ordered. Nothing here is a stock picture.</p>' +
        '<div class="rv__slot" data-google-reviews><span class="tag">Google</span> The live Google reviews show in this spot on the store.</div></div>';
    root.appendChild(head);

    var wall = el("div", "rv__wall");
    photos.forEach(function (p, n) {
      var b = el("button", "rv__photo reveal"); b.type = "button"; b.style.setProperty("--i", n % 6);
      b.style.setProperty("--ratio", (p.w / p.h).toFixed(3));
      b.setAttribute("aria-label", "Open photo: " + p.caption);
      b.innerHTML = '<img src="' + base + p.src + '" alt="' + esc(p.caption) + '" loading="lazy" width="' + p.w + '" height="' + p.h + '">' +
        '<span class="rv__cap"><em class="' + (p.kind === "customer" ? "is-customer" : "") + '">' + esc(KIND[p.kind] || "") + "</em>" + esc(p.caption) + "</span>";
      b.addEventListener("click", function () { lightbox(photos, base, n); });
      wall.appendChild(b);
    });
    root.appendChild(wall);

    if (insta.length && !compact) {
      var strip = el("div", "rv__insta");
      strip.innerHTML = '<div class="rv__instahead"><div><span class="t-eyebrow">On Instagram</span><h3 class="t-h2">Life in the shop, @levimpressions</h3></div><a class="btn btn--sm" href="' + esc(g.instagram) + '" target="_blank" rel="noopener">Follow us ' + ARROW + "</a></div>";
      var row = el("div", "rv__reels");
      insta.forEach(function (p, n) {
        var a = el("a", "rv__reel reveal"); a.href = p.link; a.target = "_blank"; a.rel = "noopener"; a.style.setProperty("--i", n);
        a.setAttribute("aria-label", "Watch on Instagram: " + p.caption);
        a.innerHTML = '<img src="' + base + p.src + '" alt="" loading="lazy" width="' + p.w + '" height="' + p.h + '"><span class="rv__play" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5Z"/></svg></span><span class="rv__cap">' + esc(p.caption) + "</span>";
        row.appendChild(a);
      });
      strip.appendChild(row); root.appendChild(strip);
    }
    if (window.LevSite && window.LevSite.reveal) window.LevSite.reveal();
  }

  window.LevReviews = { mount: mount };
})();
