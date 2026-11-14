/* Lev panda: our own panda face, drawn as layered vector, for the bulk pricing block on the home page.
   Its mood goes from 0 (sleepy, smug half-smile) to 6 (huge eyes, wide grin); the page sets it from where the slider is, and every position in between is blended.
   All movement is CSS (rules under ".pd" in lev-home.css): this file only prints the drawing and sets data-mood. */
(function () {
  "use strict";
  var STAR = "M0 -11 Q1.6 -1.6 11 0 Q1.6 1.6 0 11 Q-1.6 1.6 -11 0 Q-1.6 -1.6 0 -11Z";
  var MOUTH = "M186 288 Q230 297 274 288 C272 330 252 344 230 344 C208 344 188 330 186 288Z";

  function eye(side, cx, cy, slant) {
    var id = "pd-eye-" + side;
    return '<g class="pd-eye pd-eye--' + side + '">' +
      '<clipPath id="' + id + '"><circle cx="' + cx + '" cy="' + cy + '" r="24"/></clipPath>' +
      '<g clip-path="url(#' + id + ')">' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="24" fill="url(#pd-ball)"/>' +
      '<g class="pd-look"><circle cx="' + (cx - 3) + '" cy="' + (cy + 1) + '" r="13" fill="url(#pd-iris)"/>' +
      '<circle class="pd-pupil pd-pupil--' + side + '" cx="' + (cx - 3) + '" cy="' + (cy + 1) + '" r="6.8" fill="#0e0e10"/>' +
      '<circle cx="' + (cx - 8) + '" cy="' + (cy - 5) + '" r="4" fill="#fff"/><circle cx="' + (cx + 2) + '" cy="' + (cy + 7) + '" r="1.8" fill="#fff" opacity="0.8"/></g>' +
      '<g transform="rotate(' + slant + " " + cx + " " + cy + ')"><g class="pd-lid"><rect x="' + (cx - 34) + '" y="' + (cy - 84) + '" width="68" height="60" fill="#3d3d47"/><rect x="' + (cx - 34) + '" y="' + (cy - 26) + '" width="68" height="2.4" fill="#17171b"/></g>' +
      '<rect class="pd-blink" x="' + (cx - 34) + '" y="' + (cy - 84) + '" width="68" height="60" fill="#3d3d47"/></g>' +
      "</g></g>";
  }

  var SVG = '<svg class="pd" viewBox="0 0 440 400" xmlns="http://www.w3.org/2000/svg" focusable="false">' +
    "<defs>" +
    '<radialGradient id="pd-fur" cx="0.42" cy="0.3" r="0.8"><stop offset="0" stop-color="#ffffff"/><stop offset="0.6" stop-color="#f4f0ea"/><stop offset="1" stop-color="#d9d2c8"/></radialGradient>' +
    '<radialGradient id="pd-dark" cx="0.4" cy="0.3" r="0.8"><stop offset="0" stop-color="#4b4b56"/><stop offset="1" stop-color="#24242a"/></radialGradient>' +
    '<radialGradient id="pd-ball" cx="0.4" cy="0.35" r="0.7"><stop offset="0.5" stop-color="#ffffff"/><stop offset="1" stop-color="#dcd8d2"/></radialGradient>' +
    '<radialGradient id="pd-iris" cx="0.5" cy="0.5" r="0.5"><stop offset="0.35" stop-color="#b5652a"/><stop offset="1" stop-color="#6e3512"/></radialGradient>' +
    '<linearGradient id="pd-tee" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff6a33"/><stop offset="1" stop-color="#e2470f"/></linearGradient>' +
    '<clipPath id="pd-mouthclip"><path d="' + MOUTH + '"/></clipPath>' +
    "</defs>" +

    '<g class="pd-stars">' +
    '<path class="pd-star pd-star--1" transform="translate(230 24)" d="' + STAR + '"/>' +
    '<path class="pd-star pd-star--2" transform="translate(178 44) scale(0.55)" d="' + STAR + '"/>' +
    '<path class="pd-star pd-star--3" transform="translate(286 42) scale(0.5)" d="' + STAR + '"/>' +
    "</g>" +

    // the tee it wears (stays still)
    '<path d="M-10 410 C10 352 100 330 150 336 Q230 388 310 336 C340 330 430 352 450 410 L450 450 L-10 450Z" fill="url(#pd-tee)"/>' +
    '<path d="M150 336 Q230 388 310 336" fill="none" stroke="#b9370a" stroke-width="7" stroke-linecap="round"/>' +

    '<g class="pd-bob"><g class="pd-head">' +
    // ears
    '<g class="pd-ear pd-ear--l"><circle cx="110" cy="100" r="50" fill="url(#pd-dark)"/><circle cx="110" cy="100" r="49" fill="none" stroke="#fff" stroke-opacity="0.16" stroke-width="2"/><ellipse cx="114" cy="106" rx="24" ry="22" fill="#5d5863"/></g>' +
    '<g class="pd-ear pd-ear--r"><circle cx="350" cy="100" r="50" fill="url(#pd-dark)"/><circle cx="350" cy="100" r="49" fill="none" stroke="#fff" stroke-opacity="0.16" stroke-width="2"/><ellipse cx="346" cy="106" rx="24" ry="22" fill="#5d5863"/></g>' +
    // head and the tuft on top
    '<path d="M214 78 Q220 56 230 76 Q238 52 246 78Z" fill="#f4f0ea"/>' +
    '<ellipse cx="230" cy="215" rx="170" ry="146" fill="url(#pd-fur)"/>' +
    '<ellipse class="pd-blush" cx="112" cy="268" rx="26" ry="16" fill="#ff8f9c"/><ellipse class="pd-blush" cx="348" cy="268" rx="26" ry="16" fill="#ff8f9c"/>' +
    // eye patches
    '<ellipse cx="162" cy="208" rx="45" ry="56" transform="rotate(22 162 208)" fill="url(#pd-dark)"/>' +
    '<ellipse cx="298" cy="208" rx="45" ry="56" transform="rotate(-22 298 208)" fill="url(#pd-dark)"/>' +
    eye("l", 166, 204, -9) + eye("r", 294, 204, 9) +
    // brows
    '<path class="pd-brow pd-brow--l" d="M118 142 Q152 124 190 138" fill="none" stroke="#8d8890" stroke-width="7.5" stroke-linecap="round"/>' +
    '<path class="pd-brow pd-brow--r" d="M270 138 Q308 124 342 142" fill="none" stroke="#8d8890" stroke-width="7.5" stroke-linecap="round"/>' +
    // muzzle, nose, mouth
    '<ellipse cx="230" cy="284" rx="74" ry="54" fill="#fff"/>' +
    '<path d="M230 266 L230 289" stroke="#24242a" stroke-width="3.4" stroke-linecap="round"/>' +
    '<g class="pd-mouth"><path d="' + MOUTH + '" fill="#4a0b17" stroke="#24242a" stroke-width="3.4" stroke-linejoin="round"/>' +
    '<g clip-path="url(#pd-mouthclip)"><ellipse cx="230" cy="340" rx="30" ry="20" fill="#ef7f93"/><path d="M186 286 H274 V301 Q230 308 186 301Z" fill="#fff"/></g></g>' +
    '<path class="pd-cheek" d="M178 280 Q181 290 189 291" fill="none" stroke="#24242a" stroke-width="3.2" stroke-linecap="round"/>' +
    '<path class="pd-cheek" d="M282 280 Q279 290 271 291" fill="none" stroke="#24242a" stroke-width="3.2" stroke-linecap="round"/>' +
    '<path d="M206 246 Q230 236 254 246 Q256 262 230 272 Q204 262 206 246Z" fill="#24242a"/><ellipse cx="222" cy="249" rx="9" ry="4" fill="#fff" opacity="0.35"/>' +
    "</g></g></svg>";

  // the seven poses, one value per pose (0 = sleepy ... 6 = thrilled); anything in between is blended
  var POSES = {
    lid: [29, 22, 15, 8, 2, -2, -4], eye: [0.93, 0.95, 0.98, 1.03, 1.09, 1.15, 1.22], pupil: [1, 1, 1, 1, 1.06, 1.1, 1.16],
    brow: [7, 4, 0, -5, -9, -13, -17], mouth: [0.06, 0.07, 0.14, 0.34, 0.58, 0.8, 1], mw: [0.78, 0.92, 1, 1, 1.03, 1.07, 1.12],
    smirk: [-2, -6, -4, -2, 0, 0, 0], tilt: [-7, -4, -2, 0, 1, 2, 2], blush: [0, 0, 0.15, 0.35, 0.6, 0.8, 1],
    ear: [0, 0, 0, 3, 6, 9, 12], cheek: [0, 1, 1, 1, 1, 1, 1], bob: [0, 0, 0, 0, 3, 5, 7], star: [0, 0, 0, 0, 0, 0.6, 1]
  };

  window.LevPanda = {
    mount: function (host) {
      if (!host) return null;
      host.innerHTML = SVG;
      var svg = host.firstChild;
      return {
        // m is any number from 0 to 6; the face follows it smoothly, like dragging a video's progress bar
        set: function (m) {
          m = Math.max(0, Math.min(6, +m || 0));
          var i = Math.min(5, Math.floor(m)), f = m - i;
          for (var k in POSES) svg.style.setProperty("--" + k, (POSES[k][i] + (POSES[k][i + 1] - POSES[k][i]) * f).toFixed(3));
        }
      };
    }
  };
})();
