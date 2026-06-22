/* FBA Quant — minimal interactions (vanilla, no deps). */
(function () {
  "use strict";

  // Sticky header gains a hairline once scrolled.
  var header = document.querySelector(".site-header");
  function onScroll() { if (header) header.classList.toggle("scrolled", window.scrollY > 12); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Stat count-up when the number scrolls into view.
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function countUp(el) {
    var to = parseInt(el.getAttribute("data-to"), 10);
    if (isNaN(to)) return;
    if (reduce) { el.textContent = String(to); return; }
    var start = null, dur = 1100;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var nums = document.querySelectorAll(".num [data-to]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); io.unobserve(e.target); } });
    }, { threshold: 1 });
    nums.forEach(function (el) { io.observe(el); });
  } else {
    nums.forEach(function (el) { el.textContent = el.getAttribute("data-to"); });
  }
})();
