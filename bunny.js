(function () {
  'use strict';

  // Override bunnyBounce to be pure vertical (no scaleX baked in)
  var s = document.createElement('style');
  s.textContent = '@keyframes bunnyBounce{from{transform:translateY(0)}to{transform:translateY(-18px)}}';
  document.head.appendChild(s);

  function init() {
    var raw = document.querySelector('.bunny-wrap');
    if (!raw) return;

    // We will extract the bunny as a template to clone.
    var tmpl1 = raw.cloneNode(true);
    tmpl1.style.animation = 'none';
    tmpl1.style.transition = 'none';
    tmpl1.style.position = 'fixed';
    tmpl1.style.bottom = '-10px';
    tmpl1.style.left = '-120px';
    tmpl1.style.right = 'auto';
    tmpl1.style.zIndex = '2';
    tmpl1.style.opacity = '1';
    tmpl1.style.transform = 'scaleX(1)';
    tmpl1.style.pointerEvents = 'none';

    var s1 = tmpl1.querySelector('.bunny');
    if (s1) { s1.style.animation = 'bunnyBounce 0.4s ease-in-out infinite alternate'; }

    var tmpl2 = tmpl1.cloneNode(true);
    tmpl2.style.transform = 'scaleX(-1)';

    // Remove the original one from the DOM so we only see our dynamic ones
    raw.remove();

    var SOLO = 3500;
    var LEG = 2000;
    var PAUSE = 600;

    function runSolo(fromRight) {
      if (fromRight) console.log("🐇 A correr da direita para a esquerda!");
      else console.log("🐇 A correr da esquerda para a direita!");
      
      var vw = window.innerWidth;
      var b = fromRight ? tmpl2.cloneNode(true) : tmpl1.cloneNode(true);
      var speed = SOLO - 500 + Math.random() * 1000;
      b.querySelector('.bunny').style.animationDuration = (0.35 + Math.random() * 0.1).toFixed(2) + 's';
      
      if (fromRight) {
        b.style.left = (vw + 120) + 'px';
      } else {
        b.style.left = '-120px';
      }
      document.body.appendChild(b);

      // give the browser a frame to place the bunny before moving it
      setTimeout(function() {
        b.style.transition = 'left ' + speed + 'ms linear';
        b.style.left = fromRight ? '-120px' : (vw + 120) + 'px';
      }, 50);

      setTimeout(function () {
        if (b.parentNode) b.remove();
      }, speed + 200);
    }

    function runEncounter() {
      var vw = window.innerWidth;
      var mid = Math.round(vw / 2);
      var legSpeed = LEG - 300 + Math.random() * 600;

      var b1 = tmpl1.cloneNode(true);
      var b2 = tmpl2.cloneNode(true);
      b1.querySelector('.bunny').style.animationDuration = (0.35 + Math.random() * 0.1).toFixed(2) + 's';
      b2.querySelector('.bunny').style.animationDuration = (0.35 + Math.random() * 0.1).toFixed(2) + 's';

      b2.style.left = (vw + 120) + 'px';

      document.body.appendChild(b1);
      document.body.appendChild(b2);

      b1.offsetWidth; b2.offsetWidth;

      b1.style.transition = 'left ' + legSpeed + 'ms linear'; b1.style.left = (mid - 110) + 'px';
      b2.style.transition = 'left ' + legSpeed + 'ms linear'; b2.style.left = (mid + 10) + 'px';

      setTimeout(function () {
        b1.style.transition = 'none'; b1.style.transform = 'scaleX(-1)';
        b2.style.transition = 'none'; b2.style.transform = 'scaleX(1)';
        b1.offsetWidth; b2.offsetWidth;
        setTimeout(function () {
          b1.style.transition = 'left ' + legSpeed + 'ms linear'; b1.style.left = '-120px';
          b2.style.transition = 'left ' + legSpeed + 'ms linear'; b2.style.left = (vw + 120) + 'px';
          setTimeout(function () {
            if (b1.parentNode) b1.remove();
            if (b2.parentNode) b2.remove();
          }, legSpeed + 200);
        }, PAUSE);
      }, legSpeed);
    }

    function scheduleNext() {
      setTimeout(function () {
        var r = Math.random();
        if (r < 0.25) {
          runSolo(false);
        } else if (r < 0.50) {
          runSolo(true);
        } else if (r < 0.75) {
          runEncounter();
        }
        scheduleNext();
      }, 2000);
    }

    // Start scheduling loop
    scheduleNext();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
