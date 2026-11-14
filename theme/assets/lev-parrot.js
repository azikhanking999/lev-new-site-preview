/* Lev parrot: a macaw head drawn as layered vector, for the bulk pricing block on the home page.
   Its mood goes from 0 (sleepy) to 6 (thrilled); the page sets it from the discount step.
   All movement is CSS (rules under ".pr" in lev-home.css): this file only prints the drawing and sets data-mood. */
(function () {
  "use strict";
  // feathers on the crown and nape: [base x, base y, resting angle, how far it lifts]
  var FLUFF = [[236, 64, 20, 1], [268, 70, 32, 1], [298, 84, 48, 1], [324, 108, 64, 0.95], [344, 138, 72, 0.85], [356, 176, 80, 0.75]];
  var STAR = "M0 -11 Q1.6 -1.6 11 0 Q1.6 1.6 0 11 Q-1.6 1.6 -11 0 Q-1.6 -1.6 0 -11Z";
  var HEAD = "M150 480 C142 400 128 318 148 268 L150 258 L150 120 C160 72 204 40 252 40 C312 40 356 86 370 150 C384 214 398 300 404 480 Z";

  var SVG = '<svg class="pr" data-mood="1" viewBox="0 0 440 420" xmlns="http://www.w3.org/2000/svg" focusable="false">' +
    "<defs>" +
    '<radialGradient id="pr-red" cx="0.36" cy="0.2" r="0.95"><stop offset="0" stop-color="#f4424a"/><stop offset="0.45" stop-color="#dc1f2c"/><stop offset="1" stop-color="#9c0d1a"/></radialGradient>' +
    '<linearGradient id="pr-skin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fffaf3"/><stop offset="1" stop-color="#eedbd0"/></linearGradient>' +
    '<linearGradient id="pr-horn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fdf5df"/><stop offset="0.5" stop-color="#efd8a8"/><stop offset="0.8" stop-color="#b98d58"/><stop offset="1" stop-color="#2a1e1a"/></linearGradient>' +
    '<linearGradient id="pr-jaw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3336"/><stop offset="1" stop-color="#121012"/></linearGradient>' +
    '<radialGradient id="pr-iris" cx="0.5" cy="0.5" r="0.5"><stop offset="0.3" stop-color="#fff6cf"/><stop offset="1" stop-color="#f0c452"/></radialGradient>' +
    '<linearGradient id="pr-fade" gradientUnits="userSpaceOnUse" x1="170" y1="80" x2="380" y2="400"><stop offset="0.1" stop-color="#fff" stop-opacity="0"/><stop offset="0.75" stop-color="#fff" stop-opacity="1"/></linearGradient>' +
    '<pattern id="pr-sc" width="36" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(-14)"><path d="M0 0 Q18 20 36 0 M-18 13 Q0 33 18 13 M18 13 Q36 33 54 13" fill="none" stroke="#7d0a15" stroke-opacity="0.5" stroke-width="1.6"/></pattern>' +
    '<clipPath id="pr-headclip"><path d="' + HEAD + '"/></clipPath>' +
    '<mask id="pr-scmask"><rect x="0" y="0" width="440" height="480" fill="url(#pr-fade)"/></mask>' +
    '<clipPath id="pr-eyeclip"><circle cx="208" cy="168" r="15"/></clipPath>' +
    "</defs>" +

    '<g class="pr-stars">' +
    '<path class="pr-star pr-star--1" transform="translate(150 62)" d="' + STAR + '"/>' +
    '<path class="pr-star pr-star--2" transform="translate(188 22) scale(0.62)" d="' + STAR + '"/>' +
    '<path class="pr-star pr-star--3" transform="translate(114 82) scale(0.5)" d="' + STAR + '"/>' +
    "</g>" +

    '<g class="pr-bob"><g class="pr-head">' +
    // feathers that lift when it gets excited (they lie hidden inside the head when calm)
    FLUFF.map(function (f) {
      return '<g transform="translate(' + f[0] + " " + f[1] + ") rotate(" + f[2] + ')"><g class="pr-fluff" style="--k:' + f[3] + '"><path d="M0 0 C20 -15 56 -13 80 0 C56 11 20 13 0 0Z" fill="#b9121e"/><path d="M6 0 L70 0" stroke="#e8474f" stroke-width="1.6" stroke-linecap="round" fill="none"/></g></g>';
    }).join("") +
    '<path d="' + HEAD + '" fill="url(#pr-red)"/>' +
    '<g clip-path="url(#pr-headclip)"><rect x="100" y="0" width="340" height="480" fill="url(#pr-sc)" mask="url(#pr-scmask)"/>' +
    '<path d="M150 262 C150 300 142 340 146 400 L190 400 C176 340 178 296 196 258Z" fill="#7d0a15" opacity="0.28"/></g>' +
    // bare white face with its fine feather lines
    '<path d="M150 122 C176 104 226 104 250 134 C272 162 268 214 236 240 C210 260 172 262 150 262Z" fill="url(#pr-skin)"/>' +
    '<g fill="none" stroke="#d8323a" stroke-width="2.3" stroke-linecap="round" stroke-dasharray="1.5 7" opacity="0.8">' +
    '<path d="M172 130 Q206 116 240 138"/><path d="M168 206 Q206 224 246 200"/><path d="M164 224 Q204 242 238 222"/><path d="M164 242 Q196 254 222 244"/></g>' +
    // eye
    '<g transform="translate(208 168) scale(1.36) translate(-208 -168)"><g clip-path="url(#pr-eyeclip)">' +
    '<circle cx="208" cy="168" r="15" fill="#1b1416"/><circle cx="208" cy="168" r="12.6" fill="url(#pr-iris)"/>' +
    '<circle class="pr-pupil" cx="208" cy="168" r="6.6" fill="#0e0e10"/>' +
    '<circle cx="204.2" cy="163.4" r="2.8" fill="#fff"/><circle class="pr-glint" cx="212.6" cy="173" r="1.7" fill="#fff"/>' +
    '<g class="pr-lid"><rect x="190" y="121" width="36" height="32" fill="#ecdcd1"/><rect x="190" y="151.4" width="36" height="1.8" fill="#1b1416"/></g>' +
    '<g class="pr-low"><rect x="190" y="183" width="36" height="20" fill="#ecdcd1"/><rect x="190" y="182.6" width="36" height="1.6" fill="#1b1416" opacity="0.7"/></g>' +
    '<rect class="pr-blink" x="190" y="121" width="36" height="32" fill="#ecdcd1"/>' +
    "</g>" +
    '<circle cx="208" cy="168" r="15" fill="none" stroke="#1b1416" stroke-width="1.6"/></g>' +
    // lower beak with the tongue and the inside of the mouth riding on it
    '<g class="pr-jaw">' +
    '<path d="M152 204 C132 202 110 192 98 178 L92 230 C108 220 130 214 152 212Z" fill="#4a0b17"/>' +
    '<ellipse cx="122" cy="216" rx="20" ry="9" fill="#e27b8f" transform="rotate(-8 122 216)"/>' +
    '<path d="M152 208 C130 210 108 216 96 226 C92 250 106 276 130 282 C142 272 150 262 152 250Z" fill="url(#pr-jaw)"/>' +
    '<path d="M104 232 C104 250 114 266 130 272" fill="none" stroke="#6a6266" stroke-width="2" stroke-linecap="round" opacity="0.7"/>' +
    "</g>" +
    // upper beak
    '<g class="pr-up">' +
    '<path d="M152 116 C110 100 62 118 48 170 C40 205 46 240 62 262 C66 240 78 222 100 214 C122 207 140 208 152 206Z" fill="url(#pr-horn)"/>' +
    '<path d="M144 124 C110 114 76 128 62 166" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="0.55"/>' +
    '<path d="M62 262 C66 240 78 222 100 214 C122 207 140 208 152 206" fill="none" stroke="#2a1e1a" stroke-width="1.8" stroke-linecap="round" opacity="0.55"/>' +
    '<ellipse cx="140" cy="137" rx="4.2" ry="3" fill="#6b4a3a"/>' +
    "</g>" +
    "</g></g>" +

    // shoulder feathers: they stay still and cover where the neck leaves the picture
    '<g class="pr-body">' +
    [[226, 404], [270, 396], [316, 392], [362, 394], [408, 400]].map(function (p, i) {
      return '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="30" ry="42" transform="rotate(' + (14 - i * 5) + " " + p[0] + " " + p[1] + ')" fill="#c4141f" stroke="#8f0d18" stroke-width="1.4"/>';
    }).join("") +
    [[300, 440], [346, 434], [392, 434], [436, 440]].map(function (p, i) {
      return '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="27" ry="40" transform="rotate(' + (8 - i * 5) + " " + p[0] + " " + p[1] + ')" fill="#ffc83d" stroke="#d99a12" stroke-width="1.4"/>';
    }).join("") +
    "</g></svg>";

  window.LevParrot = {
    mount: function (host) {
      if (!host) return null;
      host.innerHTML = SVG;
      var svg = host.firstChild, mood = 1;
      return {
        set: function (m) {
          m = Math.max(0, Math.min(6, Math.round(m)));
          if (m === mood) return;
          var up = m > mood; mood = m;
          svg.setAttribute("data-mood", m);
          svg.classList.remove("is-pop", "is-drop"); void svg.getBoundingClientRect();
          svg.classList.add(up ? "is-pop" : "is-drop");
        }
      };
    }
  };
})();
