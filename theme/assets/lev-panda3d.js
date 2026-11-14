/* Lev panda, 3D version: 23 pictures of the same panda (sleepy ... thrilled), laid on top of each other
   in the bulk pricing block. The page passes a number from 0 to 6 taken from where the slider is, and this
   fades between the two nearest pictures, so dragging the slider plays the faces like a video's progress bar.
   Pictures: lev-panda-0.webp ... lev-panda-22.webp (made by art/panda-3d/build_frames.py). Styles: ".pd3" in lev-home.css. */
(function () {
  "use strict";
  var here = (document.currentScript && document.currentScript.src || "").replace(/[^\/]*$/, "");
  window.LevPanda3D = {
    mount: function (host) {
      if (!host) return null;
      var box = document.createElement("div"); box.className = "pd3";
      // where each picture sits along the slider, from 0 (far left) to 12 (far right). They are not evenly spaced:
      // extra pictures were added where the face changes most. Same order as ORDER in art/panda-3d/build_frames.py.
      var POS = [0, 0.5, 1, 2, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12];
      var frames = [], N = POS.length;
      for (var i = 0; i < N; i++) {
        var im = new Image(); im.alt = ""; im.decoding = "async"; im.draggable = false;
        im.style.opacity = i ? 0 : 1;
        box.appendChild(im); frames.push(im);
      }
      host.innerHTML = ""; host.appendChild(box);
      // the pictures are 1.4 MB in all, so they are fetched only once the block is getting close to the screen,
      // and then all together, so none is still missing when the slider is dragged
      var load = function () { frames.forEach(function (im, k) { im.src = here + "lev-panda-" + k + ".webp"; }); };
      if ("IntersectionObserver" in window) {
        var near = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { near.disconnect(); load(); } }, { rootMargin: "900px 0px" });
        near.observe(host);
      } else load();
      return {
        // m is any number from 0 to 6
        set: function (m) {
          m = Math.max(0, Math.min(6, +m || 0));
          var x = m / 6 * 12, lo = 0;
          while (lo < N - 2 && POS[lo + 1] <= x) lo++;
          var f = (x - POS[lo]) / (POS[lo + 1] - POS[lo]);
          // the lower picture stays solid and the next one fades in over it, so the face never goes see-through
          for (var k = 0; k < N; k++) frames[k].style.opacity = k === lo ? 1 : k === lo + 1 ? f.toFixed(3) : 0;
          box.style.setProperty("--bob", (Math.max(0, m - 3.5) * 1.0).toFixed(2));
        }
      };
    }
  };
})();
